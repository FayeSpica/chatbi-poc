#!/usr/bin/env python3
"""
语义模块使用示例
展示如何使用语义模式来增强SQL生成
"""

from semantic_schema import semantic_manager, create_sample_shop_schema
from translator import nl_to_mysql

def demo_semantic_module():
    """演示语义模块的功能"""
    print("=== 语义模块演示 ===\n")
    
    # 1. 显示语义模式信息
    print("1. 语义模式信息:")
    schema = semantic_manager.get_schema("shop")
    if schema:
        print(f"数据库: {schema.name}")
        print(f"业务领域: {schema.business_domain}")
        print(f"描述: {schema.description}")
        print(f"表数量: {len(schema.tables)}")
        
        for table in schema.tables:
            print(f"\n表: {table.name}")
            print(f"  业务含义: {table.business_meaning}")
            print(f"  字段数量: {len(table.fields)}")
            for field in table.fields[:3]:  # 只显示前3个字段
                print(f"    - {field.name}: {field.business_meaning}")
            if len(table.fields) > 3:
                print(f"    ... 还有 {len(table.fields) - 3} 个字段")
    
    print("\n" + "="*50 + "\n")
    
    # 2. 对比有无语义模式的查询结果
    questions = [
        "查询最近一周的订单趋势",
        "找出最活跃的用户",
        "统计商品销售情况"
    ]
    
    for question in questions:
        print(f"问题: {question}")
        print("-" * 30)
        
        # 有语义模式
        print("有语义模式:")
        try:
            semantic, sql = nl_to_mysql(
                question=question,
                db_name="shop",
                model="qwen2.5:7b"
            )
            print(f"意图: {semantic.intent}")
            print(f"SQL: {sql}")
        except Exception as e:
            print(f"错误: {e}")
        
        print()
        
        # 无语义模式
        print("无语义模式:")
        try:
            semantic, sql = nl_to_mysql(
                question=question,
                db_name="unknown_db",
                model="qwen2.5:7b"
            )
            print(f"意图: {semantic.intent}")
            print(f"SQL: {sql}")
        except Exception as e:
            print(f"错误: {e}")
        
        print("\n" + "="*50 + "\n")

if __name__ == "__main__":
    demo_semantic_module()
