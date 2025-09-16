from typing import List, Optional, Dict, Any, Tuple

from pydantic import BaseModel, Field, field_validator

# LangChain / Ollama
from langchain_ollama import ChatOllama
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import ChatPromptTemplate

# 语义模式
from semantic_schema import semantic_manager, DatabaseSemantic


class ColumnRef(BaseModel):
    table: Optional[str] = Field(default=None, description="表名，可选")
    column: str = Field(description="列名或表达式，如 count(*)、sum(amount)")
    alias: Optional[str] = Field(default=None, description="列别名，可选")


class Condition(BaseModel):
    left: str = Field(description="左侧表达式，如 table.column 或 聚合表达式")
    op: str = Field(description="操作符，如 =, >, <, >=, <=, !=, in, like, between")
    right: str = Field(description="右侧值/表达式，字符串请原样输出，不要转义")
    
    @field_validator('right', mode='before')
    @classmethod
    def convert_right_to_string(cls, v):
        if isinstance(v, (int, float)):
            return str(v)
        return v
    
    @field_validator('left', mode='before')
    @classmethod
    def validate_left_not_null(cls, v):
        if v is None or v == "":
            raise ValueError("left字段不能为空")
        return v


class Join(BaseModel):
    table: str
    on: str = Field(description="连接条件，如 a.id = b.a_id")
    kind: str = Field(default="inner", description="连接类型：inner/left/right/full")


class OrderItem(BaseModel):
    by: str = Field(description="排序表达式，如 table.column 或 聚合表达式")
    direction: str = Field(default="asc", description="asc 或 desc")


class SelectQuery(BaseModel):
    select: List[ColumnRef]
    from_: List[str] = Field(alias="from", description="主表列表，最少一个")
    joins: Optional[List[Join]] = None
    where: Optional[List[Condition]] = None
    group_by: Optional[List[str]] = None
    having: Optional[List[Condition]] = None
    order_by: Optional[List[OrderItem]] = None
    limit: Optional[int] = None

    class Config:
        populate_by_name = True


class SemanticSQL(BaseModel):
    intent: str = Field(description="查询意图的简要说明")
    query: SelectQuery


def _quote_identifier(name: str) -> str:
    if name is None or name == "*" or name.strip() == "*":
        return name
    # 简单处理反引号包裹
    if "." in name:
        parts = name.split(".")
        return ".".join(f"`{p}`" if p != "*" else "*" for p in parts)
    return f"`{name}`"


def _render_condition(cond: Condition) -> str:
    op = cond.op.strip().lower()
    if op == "in":
        return f"{cond.left} IN ({cond.right})"
    if op == "between":
        return f"{cond.left} BETWEEN {cond.right}"
    if op == "like":
        return f"{cond.left} LIKE {cond.right}"
    return f"{cond.left} {cond.op} {cond.right}"


def render_mysql_sql(semantic: SemanticSQL) -> str:
    q = semantic.query

    select_parts: List[str] = []
    for col in q.select:
        expr = col.column if (col.table is None) else f"{_quote_identifier(col.table)}.{_quote_identifier(col.column)}"
        if col.alias:
            expr = f"{expr} AS {_quote_identifier(col.alias)}"
        select_parts.append(expr)
    select_sql = ", ".join(select_parts) if select_parts else "*"

    from_parts = [f"{_quote_identifier(t)}" for t in q.from_]
    from_sql = ", ".join(from_parts)

    join_sql = ""
    if q.joins:
        chunks = []
        for j in q.joins:
            kind = j.kind.upper() if j.kind else "INNER"
            chunks.append(f" {kind} JOIN {_quote_identifier(j.table)} ON {j.on}")
        join_sql = "".join(chunks)

    where_sql = ""
    if q.where and len(q.where) > 0:
        where_sql = " WHERE " + " AND ".join(_render_condition(c) for c in q.where)

    group_sql = ""
    if q.group_by and len(q.group_by) > 0:
        group_sql = " GROUP BY " + ", ".join(q.group_by)

    having_sql = ""
    if q.having and len(q.having) > 0:
        having_sql = " HAVING " + " AND ".join(_render_condition(c) for c in q.having)

    order_sql = ""
    if q.order_by and len(q.order_by) > 0:
        order_sql = " ORDER BY " + ", ".join(f"{o.by} {o.direction.upper()}" for o in q.order_by)

    limit_sql = f" LIMIT {q.limit}" if q.limit is not None else ""

    return (
        f"SELECT {select_sql} FROM {from_sql}{join_sql}{where_sql}{group_sql}{having_sql}{order_sql}{limit_sql}"
    )


def _build_schema_hint(schema: Dict[str, List[Tuple[str, str]]]) -> str:
    if not schema:
        return "(无显式表结构; 保持常识即可)"
    lines: List[str] = []
    for table, cols in schema.items():
        col_desc = ", ".join(f"{c} {t}" for c, t in cols)
        lines.append(f"- {table}: {col_desc}")
    return "\n".join(lines)


def _build_semantic_hint(db_name: str, table_names: Optional[List[str]] = None) -> str:
    """构建语义提示信息"""
    return semantic_manager.build_semantic_hint(db_name, table_names)


def _get_enhanced_schema_hint(
    db_name: str, 
    physical_schema: Optional[Dict[str, List[Tuple[str, str]]]] = None,
    table_names: Optional[List[str]] = None
) -> str:
    """获取增强的架构提示，结合物理架构和语义信息"""
    semantic_hint = _build_semantic_hint(db_name, table_names)
    physical_hint = _build_schema_hint(physical_schema or {})
    
    if semantic_hint == "(无语义模式定义)":
        return f"物理表结构:\n{physical_hint}\n\n(无语义模式定义，请根据表名和字段名推断业务含义)"
    else:
        return f"语义模式定义:\n{semantic_hint}\n\n物理表结构:\n{physical_hint}"


def _make_llm(model: str = "qwen2.5:7b", base_url: Optional[str] = None) -> ChatOllama:
    return ChatOllama(
        model=model, 
        base_url=base_url or "http://localhost:11434",
        temperature=0.1,
        timeout=300.0
    )


def nl_to_semantic(
    question: str,
    schema: Optional[Dict[str, List[Tuple[str, str]]]] = None,
    model: str = "qwen2.5:7b",
    base_url: Optional[str] = None,
    db_name: str = "shop",
) -> SemanticSQL:
    import json
    
    # 使用增强的架构提示，包含语义信息
    schema_hint = _get_enhanced_schema_hint(db_name, schema)
    
    # Create a more detailed prompt with semantic information
    prompt_text = f"""你是一个优秀的数据分析助理。根据自然语言问题和提供的数据库结构信息（包含语义含义和物理结构），生成一个JSON对象用于表示语义SQL（S2SQL）。

{schema_hint}

请仔细分析问题的业务含义，选择合适的表和字段，并严格按照以下JSON格式输出，不要添加任何其他内容：

{{
  "intent": "查询意图的简要说明",
  "query": {{
    "select": [
      {{"table": "表名或null", "column": "列名或表达式", "alias": "别名或null"}}
    ],
    "from": ["主表名"],
    "joins": [
      {{"table": "表名", "on": "连接条件", "kind": "inner"}}
    ],
    "where": [
      {{"left": "左侧表达式", "op": "操作符", "right": "右侧值"}}
    ],
    "group_by": ["分组列"],
    "having": [
      {{"left": "左侧表达式", "op": "操作符", "right": "右侧值"}}
    ],
    "order_by": [
      {{"by": "排序表达式", "direction": "asc"}}
    ],
    "limit": 数量或null
  }}
}}

注意事项：
1. 根据字段的业务含义选择合适的聚合函数（COUNT, SUM, AVG, MAX, MIN等）
2. 时间字段通常用于过滤和分组，注意使用合适的日期函数
3. 外键关系用于表连接，注意关联条件
4. 布尔字段通常用于状态过滤
5. 金额字段通常用于聚合和排序

问题：{question}"""

    llm = _make_llm(model=model, base_url=base_url)
    
    try:
        response = llm.invoke(prompt_text)
        # Parse the JSON response
        json_str = response.content.strip()
        # Remove any markdown formatting if present
        if json_str.startswith("```json"):
            json_str = json_str[7:]
        if json_str.endswith("```"):
            json_str = json_str[:-3]
        
        data = json.loads(json_str)
        
        # 清理无效的条件
        if 'query' in data and 'where' in data['query']:
            valid_conditions = []
            for cond in data['query']['where']:
                if cond and isinstance(cond, dict) and cond.get('left') and cond.get('op') and cond.get('right') is not None:
                    valid_conditions.append(cond)
            data['query']['where'] = valid_conditions
        
        # 清理无效的having条件
        if 'query' in data and 'having' in data['query']:
            valid_having = []
            for cond in data['query']['having']:
                if cond and isinstance(cond, dict) and cond.get('left') and cond.get('op') and cond.get('right') is not None:
                    valid_having.append(cond)
            data['query']['having'] = valid_having
        
        return SemanticSQL(**data)
    except Exception as e:
        print(f"Error parsing LLM response: {e}")
        print(f"Response was: {response.content if 'response' in locals() else 'No response'}")
        # Return a simple fallback
        return SemanticSQL(
            intent="查询用户信息",
            query=SelectQuery(
                select=[ColumnRef(column="*")],
                from_=["users"]
            )
        )


def nl_to_mysql(
    question: str,
    schema: Optional[Dict[str, List[Tuple[str, str]]]] = None,
    model: str = "qwen2.5:7b",
    base_url: Optional[str] = None,
    db_name: str = "shop",
) -> Tuple[SemanticSQL, str]:
    semantic = nl_to_semantic(question=question, schema=schema, model=model, base_url=base_url, db_name=db_name)
    sql = render_mysql_sql(semantic)
    return semantic, sql


def _merge_s2sql_and_physical(s2sql: str, semantic_name: str, physical_sql: str, support_with: bool) -> str:
    """辅助函数：合并S2SQL和物理SQL"""
    if support_with:
        return f"WITH `{semantic_name}` AS (\n    {physical_sql}\n)\n {s2sql}"
    else:
        return f"{s2sql} {physical_sql}"