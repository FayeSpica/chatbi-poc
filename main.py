import os
import json
from typing import Dict, List, Tuple, Optional

import mysql.connector  # type: ignore

from translator import nl_to_mysql


def _introspect_schema(
    host: str,
    port: int,
    user: str,
    password: str,
    database: str,
) -> Dict[str, List[Tuple[str, str]]]:
    conn = mysql.connector.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        database=database,
    )
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT TABLE_NAME, COLUMN_NAME, COLUMN_TYPE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = %s
            ORDER BY TABLE_NAME, ORDINAL_POSITION
            """,
            (database,),
        )
        schema: Dict[str, List[Tuple[str, str]]] = {}
        for table_name, column_name, column_type in cur.fetchall():
            schema.setdefault(table_name, []).append((column_name, column_type))
        return schema
    finally:
        conn.close()


def run():
    question = os.environ.get("QUESTION") or input("输入自然语言问题: ")

    db_host = os.environ.get("MYSQL_HOST")
    db_port = int(os.environ.get("MYSQL_PORT", "3306"))
    db_user = os.environ.get("MYSQL_USER")
    db_password = os.environ.get("MYSQL_PASSWORD")
    db_database = os.environ.get("MYSQL_DATABASE")

    schema: Optional[Dict[str, List[Tuple[str, str]]]] = None
    if all([db_host, db_user, db_password, db_database]):
        try:
            schema = _introspect_schema(
                host=db_host, port=db_port, user=db_user, password=db_password, database=db_database
            )
        except Exception as e:
            print(f"[WARN] 无法获取数据库结构，将在无结构提示下生成: {e}")

    model = os.environ.get("OLLAMA_MODEL", "llama3.1:8b")
    base_url = os.environ.get("OLLAMA_BASE_URL")  # e.g. http://localhost:11434
    db_name = os.environ.get("DB_NAME", "shop")  # 数据库名称，用于语义模式匹配

    semantic, sql = nl_to_mysql(
        question=question,
        schema=schema,
        model=model,
        base_url=base_url,
        db_name=db_name,
    )

    print("\n[SemanticSQL]")
    print(json.dumps(semantic.model_dump(by_alias=True), ensure_ascii=False, indent=2))
    print("\n[MySQL SQL]")
    print(sql)


if __name__ == "__main__":
    run()
