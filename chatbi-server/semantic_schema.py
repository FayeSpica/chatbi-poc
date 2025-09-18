"""
语义模式模块 - 定义数据库表格和字段的业务含义
用于为LLM提供更丰富的上下文信息，提高SQL生成的准确性
"""

from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from enum import Enum


class DataType(str, Enum):
    """数据类型枚举"""
    STRING = "string"
    INTEGER = "integer"
    FLOAT = "float"
    BOOLEAN = "boolean"
    DATE = "date"
    DATETIME = "datetime"
    TEXT = "text"
    DECIMAL = "decimal"
    JSON = "json"


class FieldSemantic(BaseModel):
    """字段语义定义"""
    name: str = Field(description="字段名")
    data_type: DataType = Field(description="数据类型")
    business_meaning: str = Field(description="业务含义描述")
    examples: Optional[List[str]] = Field(default=None, description="示例值")
    constraints: Optional[List[str]] = Field(default=None, description="约束条件，如主键、外键、非空等")
    relationships: Optional[Dict[str, str]] = Field(default=None, description="关联关系，格式：{关联表: 关联字段}")
    aggregation_support: bool = Field(default=True, description="是否支持聚合操作")
    filter_support: bool = Field(default=True, description="是否支持过滤条件")
    sort_support: bool = Field(default=True, description="是否支持排序")


class TableSemantic(BaseModel):
    """表格语义定义"""
    name: str = Field(description="表名")
    business_meaning: str = Field(description="表的业务含义")
    description: str = Field(description="详细描述")
    fields: List[FieldSemantic] = Field(description="字段列表")
    primary_key: Optional[str] = Field(default=None, description="主键字段")
    common_queries: Optional[List[str]] = Field(default=None, description="常见查询模式")
    business_rules: Optional[List[str]] = Field(default=None, description="业务规则")


class DatabaseSemantic(BaseModel):
    """数据库语义定义"""
    name: str = Field(description="数据库名")
    description: str = Field(description="数据库描述")
    tables: List[TableSemantic] = Field(description="表列表")
    business_domain: str = Field(description="业务领域")
    version: Optional[str] = Field(default="1.0", description="版本号")


class SemanticSchemaManager:
    """语义模式管理器"""
    
    def __init__(self):
        self.schemas: Dict[str, DatabaseSemantic] = {}
    
    def add_schema(self, schema: DatabaseSemantic):
        """添加语义模式"""
        self.schemas[schema.name] = schema
    
    def get_schema(self, db_name: str) -> Optional[DatabaseSemantic]:
        """获取语义模式"""
        return self.schemas.get(db_name)
    
    def get_table_semantic(self, db_name: str, table_name: str) -> Optional[TableSemantic]:
        """获取表格语义"""
        schema = self.get_schema(db_name)
        if not schema:
            return None
        
        for table in schema.tables:
            if table.name == table_name:
                return table
        return None
    
    def get_field_semantic(self, db_name: str, table_name: str, field_name: str) -> Optional[FieldSemantic]:
        """获取字段语义"""
        table = self.get_table_semantic(db_name, table_name)
        if not table:
            return None
        
        for field in table.fields:
            if field.name == field_name:
                return field
        return None
    
    def build_semantic_hint(self, db_name: str, table_names: Optional[List[str]] = None) -> str:
        """构建语义提示信息"""
        schema = self.get_schema(db_name)
        if not schema:
            return "(无语义模式定义)"
        
        lines = [f"数据库: {schema.name} - {schema.description}"]
        lines.append(f"业务领域: {schema.business_domain}")
        lines.append("")
        
        for table in schema.tables:
            if table_names and table.name not in table_names:
                continue
                
            lines.append(f"表: {table.name}")
            lines.append(f"  含义: {table.business_meaning}")
            lines.append(f"  描述: {table.description}")
            
            if table.primary_key:
                lines.append(f"  主键: {table.primary_key}")
            
            if table.common_queries:
                lines.append(f"  常见查询: {', '.join(table.common_queries)}")
            
            if table.business_rules:
                lines.append(f"  业务规则: {'; '.join(table.business_rules)}")
            
            lines.append("  字段:")
            for field in table.fields:
                field_info = f"    - {field.name} ({field.data_type.value}): {field.business_meaning}"
                if field.examples:
                    field_info += f" [示例: {', '.join(field.examples)}]"
                if field.constraints:
                    field_info += f" [约束: {', '.join(field.constraints)}]"
                if field.relationships:
                    rels = [f"{k}.{v}" for k, v in field.relationships.items()]
                    field_info += f" [关联: {', '.join(rels)}]"
                lines.append(field_info)
            
            lines.append("")
        
        return "\n".join(lines)


# 预定义的示例语义模式
def create_sample_shop_schema() -> DatabaseSemantic:
    """创建示例商店数据库的语义模式"""
    return DatabaseSemantic(
        name="shop",
        description="电商商店数据库",
        business_domain="电商零售",
        tables=[
            TableSemantic(
                name="users",
                business_meaning="用户信息表",
                description="存储注册用户的基本信息和账户状态",
                primary_key="id",
                common_queries=[
                    "查询用户基本信息",
                    "统计用户注册趋势",
                    "查找活跃用户"
                ],
                business_rules=[
                    "用户ID必须唯一",
                    "邮箱地址必须唯一且有效",
                    "手机号格式必须正确"
                ],
                fields=[
                    FieldSemantic(
                        name="id",
                        data_type=DataType.INTEGER,
                        business_meaning="用户唯一标识符",
                        constraints=["主键", "自增"],
                        aggregation_support=False,
                        filter_support=True,
                        sort_support=True
                    ),
                    FieldSemantic(
                        name="username",
                        data_type=DataType.STRING,
                        business_meaning="用户名，用于登录",
                        examples=["john_doe", "alice_smith"],
                        constraints=["唯一", "非空"],
                        filter_support=True,
                        sort_support=True
                    ),
                    FieldSemantic(
                        name="email",
                        data_type=DataType.STRING,
                        business_meaning="用户邮箱地址",
                        examples=["user@example.com", "admin@shop.com"],
                        constraints=["唯一", "非空", "邮箱格式"],
                        filter_support=True,
                        sort_support=True
                    ),
                    FieldSemantic(
                        name="phone",
                        data_type=DataType.STRING,
                        business_meaning="用户手机号码",
                        examples=["13800138000", "13912345678"],
                        constraints=["手机号格式"],
                        filter_support=True,
                        sort_support=False
                    ),
                    FieldSemantic(
                        name="created_at",
                        data_type=DataType.DATETIME,
                        business_meaning="用户注册时间",
                        examples=["2024-01-15 10:30:00"],
                        constraints=["非空"],
                        aggregation_support=True,
                        filter_support=True,
                        sort_support=True
                    ),
                    FieldSemantic(
                        name="is_active",
                        data_type=DataType.BOOLEAN,
                        business_meaning="账户是否激活",
                        examples=["true", "false"],
                        constraints=["非空"],
                        filter_support=True,
                        sort_support=False
                    )
                ]
            ),
            TableSemantic(
                name="orders",
                business_meaning="订单信息表",
                description="存储用户下单的订单记录和状态信息",
                primary_key="id",
                common_queries=[
                    "查询订单详情",
                    "统计订单金额",
                    "分析订单趋势",
                    "查找待处理订单"
                ],
                business_rules=[
                    "订单号必须唯一",
                    "订单金额必须大于0",
                    "订单状态必须有效"
                ],
                fields=[
                    FieldSemantic(
                        name="id",
                        data_type=DataType.INTEGER,
                        business_meaning="订单唯一标识符",
                        constraints=["主键", "自增"],
                        aggregation_support=False,
                        filter_support=True,
                        sort_support=True
                    ),
                    FieldSemantic(
                        name="user_id",
                        data_type=DataType.INTEGER,
                        business_meaning="下单用户ID",
                        constraints=["外键", "非空"],
                        relationships={"users": "id"},
                        filter_support=True,
                        sort_support=True
                    ),
                    FieldSemantic(
                        name="order_number",
                        data_type=DataType.STRING,
                        business_meaning="订单号，用于用户查询",
                        examples=["ORD202401150001", "ORD202401150002"],
                        constraints=["唯一", "非空"],
                        filter_support=True,
                        sort_support=True
                    ),
                    FieldSemantic(
                        name="total_amount",
                        data_type=DataType.DECIMAL,
                        business_meaning="订单总金额",
                        examples=["99.99", "299.50"],
                        constraints=["非空", "大于0"],
                        aggregation_support=True,
                        filter_support=True,
                        sort_support=True
                    ),
                    FieldSemantic(
                        name="status",
                        data_type=DataType.STRING,
                        business_meaning="订单状态",
                        examples=["pending", "paid", "shipped", "delivered", "cancelled"],
                        constraints=["非空", "枚举值"],
                        filter_support=True,
                        sort_support=False
                    ),
                    FieldSemantic(
                        name="created_at",
                        data_type=DataType.DATETIME,
                        business_meaning="订单创建时间",
                        examples=["2024-01-15 14:30:00"],
                        constraints=["非空"],
                        aggregation_support=True,
                        filter_support=True,
                        sort_support=True
                    ),
                    FieldSemantic(
                        name="updated_at",
                        data_type=DataType.DATETIME,
                        business_meaning="订单最后更新时间",
                        examples=["2024-01-15 16:45:00"],
                        constraints=["非空"],
                        aggregation_support=True,
                        filter_support=True,
                        sort_support=True
                    )
                ]
            ),
            TableSemantic(
                name="products",
                business_meaning="商品信息表",
                description="存储商品的基本信息、价格和库存状态",
                primary_key="id",
                common_queries=[
                    "查询商品信息",
                    "统计商品销量",
                    "查找热门商品",
                    "分析商品价格"
                ],
                business_rules=[
                    "商品名称不能为空",
                    "商品价格必须大于0",
                    "库存数量不能为负数"
                ],
                fields=[
                    FieldSemantic(
                        name="id",
                        data_type=DataType.INTEGER,
                        business_meaning="商品唯一标识符",
                        constraints=["主键", "自增"],
                        aggregation_support=False,
                        filter_support=True,
                        sort_support=True
                    ),
                    FieldSemantic(
                        name="name",
                        data_type=DataType.STRING,
                        business_meaning="商品名称",
                        examples=["iPhone 15 Pro", "MacBook Air M2"],
                        constraints=["非空"],
                        filter_support=True,
                        sort_support=True
                    ),
                    FieldSemantic(
                        name="description",
                        data_type=DataType.TEXT,
                        business_meaning="商品详细描述",
                        examples=["最新款iPhone，配备A17 Pro芯片"],
                        filter_support=True,
                        sort_support=False
                    ),
                    FieldSemantic(
                        name="price",
                        data_type=DataType.DECIMAL,
                        business_meaning="商品价格",
                        examples=["999.99", "1299.00"],
                        constraints=["非空", "大于0"],
                        aggregation_support=True,
                        filter_support=True,
                        sort_support=True
                    ),
                    FieldSemantic(
                        name="stock_quantity",
                        data_type=DataType.INTEGER,
                        business_meaning="库存数量",
                        examples=["100", "50"],
                        constraints=["非空", "大于等于0"],
                        aggregation_support=True,
                        filter_support=True,
                        sort_support=True
                    ),
                    FieldSemantic(
                        name="category",
                        data_type=DataType.STRING,
                        business_meaning="商品分类",
                        examples=["电子产品", "服装", "家居用品"],
                        filter_support=True,
                        sort_support=True
                    ),
                    FieldSemantic(
                        name="is_active",
                        data_type=DataType.BOOLEAN,
                        business_meaning="商品是否上架",
                        examples=["true", "false"],
                        constraints=["非空"],
                        filter_support=True,
                        sort_support=False
                    )
                ]
            )
        ]
    )


def create_ip_flow_schema() -> DatabaseSemantic:
    """创建IP流量数据库的语义模式"""
    return DatabaseSemantic(
        name="network",
        description="网络流量监控数据库",
        business_domain="网络监控",
        tables=[
            TableSemantic(
                name="ip_flow",
                business_meaning="IP流量统计表",
                description="存储网络接口的IP流量统计信息，用于网络性能监控和分析",
                primary_key="timestamp,ip,intf",
                common_queries=[
                    "查询指定IP的流量统计",
                    "分析网络接口流量趋势",
                    "统计时间段内的带宽使用情况",
                    "查找高流量IP地址",
                    "监控接口流量峰值"
                ],
                business_rules=[
                    "IP地址必须为有效格式",
                    "带宽速率不能为负数",
                    "时间戳必须为有效时间格式",
                    "接口名称不能为空"
                ],
                fields=[
                    FieldSemantic(
                        name="ip",
                        data_type=DataType.STRING,
                        business_meaning="IP地址，标识网络中的主机或设备",
                        examples=["192.168.1.100", "10.0.0.1", "172.16.1.50"],
                        constraints=["非空", "IP地址格式"],
                        filter_support=True,
                        sort_support=True,
                        aggregation_support=False
                    ),
                    FieldSemantic(
                        name="intf",
                        data_type=DataType.STRING,
                        business_meaning="网络接口名称，标识数据流经的网络接口",
                        examples=["eth0", "eth1", "wlan0", "lo", "ens33"],
                        constraints=["非空"],
                        filter_support=True,
                        sort_support=True,
                        aggregation_support=False
                    ),
                    FieldSemantic(
                        name="bps",
                        data_type=DataType.FLOAT,
                        business_meaning="带宽速率，单位为每秒字节数(Bytes per second)",
                        examples=["1024.5", "2048000.0", "512.25"],
                        constraints=["非空", "大于等于0"],
                        aggregation_support=True,
                        filter_support=True,
                        sort_support=True
                    ),
                    FieldSemantic(
                        name="timestamp",
                        data_type=DataType.DATETIME,
                        business_meaning="数据采集时间戳，记录流量统计的具体时间",
                        examples=["2024-01-15 14:30:00", "2024-01-15 14:31:00"],
                        constraints=["非空"],
                        aggregation_support=True,
                        filter_support=True,
                        sort_support=True
                    )
                ]
            )
        ]
    )


# 全局语义模式管理器实例
semantic_manager = SemanticSchemaManager()

# 初始化示例模式
semantic_manager.add_schema(create_sample_shop_schema())
semantic_manager.add_schema(create_ip_flow_schema())
