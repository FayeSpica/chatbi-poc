"""
ChatBI Web Backend - FastAPI应用
提供自然语言转SQL的Web API接口
"""

import os
import sys
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import uvicorn

# 添加父目录到路径，以便导入语义模块
parent_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from translator import nl_to_mysql
from semantic_schema import semantic_manager

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('chatbi-server.log', encoding='utf-8')
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ChatBI API",
    description="自然语言转SQL的Web API",
    version="1.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应该设置具体的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 请求模型
class QueryRequest(BaseModel):
    question: str = Field(..., description="自然语言问题")
    db_name: str = Field(default="shop", description="数据库名称")
    use_semantic: bool = Field(default=True, description="是否使用语义模式")
    model: str = Field(default="qwen2.5:7b", description="使用的模型")

class QueryResponse(BaseModel):
    success: bool
    question: str
    intent: str
    semantic_sql: Dict[str, Any]
    mysql_sql: str
    execution_time: float
    timestamp: str
    error: Optional[str] = None

class SchemaInfoResponse(BaseModel):
    success: bool
    schemas: List[Dict[str, Any]]
    error: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    ollama_available: bool
    semantic_schemas: int

# 全局配置
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
MYSQL_CONFIG = {
    "host": os.getenv("MYSQL_HOST", "127.0.0.1"),
    "port": int(os.getenv("MYSQL_PORT", "3307")),
    "user": os.getenv("MYSQL_USER", "root"),
    "password": os.getenv("MYSQL_PASSWORD", "pass"),
    "database": os.getenv("MYSQL_DATABASE", "shop")
}

@app.get("/", response_model=HealthResponse)
async def health_check():
    """健康检查接口"""
    logger.info("执行健康检查")
    try:
        # 检查Ollama连接
        import requests
        ollama_available = False
        try:
            response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5)
            ollama_available = response.status_code == 200
            logger.debug(f"Ollama连接检查 - 可用: {ollama_available}, 状态码: {response.status_code}")
        except Exception as e:
            logger.warning(f"Ollama连接检查失败: {e}")
            pass
        
        schemas_count = len(semantic_manager.schemas)
        logger.info(f"健康检查完成 - Ollama可用: {ollama_available}, 语义模式数量: {schemas_count}")
        
        return HealthResponse(
            status="healthy",
            timestamp=datetime.now().isoformat(),
            ollama_available=ollama_available,
            semantic_schemas=schemas_count
        )
    except Exception as e:
        logger.error(f"健康检查失败: {e}", exc_info=True)
        return HealthResponse(
            status="unhealthy",
            timestamp=datetime.now().isoformat(),
            ollama_available=False,
            semantic_schemas=0
        )

@app.get("/schemas", response_model=SchemaInfoResponse)
async def get_schemas():
    """获取可用的语义模式列表"""
    logger.info("获取语义模式列表请求")
    try:
        schemas = []
        for name, schema in semantic_manager.schemas.items():
            schemas.append({
                "name": schema.name,
                "description": schema.description,
                "business_domain": schema.business_domain,
                "tables": [
                    {
                        "name": table.name,
                        "business_meaning": table.business_meaning,
                        "field_count": len(table.fields)
                    }
                    for table in schema.tables
                ]
            })
        
        logger.info(f"成功返回 {len(schemas)} 个语义模式")
        return SchemaInfoResponse(success=True, schemas=schemas)
    except Exception as e:
        logger.error(f"获取语义模式列表失败: {e}", exc_info=True)
        return SchemaInfoResponse(success=False, schemas=[], error=str(e))

@app.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """处理自然语言查询"""
    start_time = datetime.now()
    
    # 记录请求开始信息
    logger.info(f"开始处理查询请求 - 问题: '{request.question}', 数据库: {request.db_name}, "
                f"使用语义模式: {request.use_semantic}, 模型: {request.model}")
    
    try:
        # 准备参数
        schema = None
        if MYSQL_CONFIG["host"]:
            try:
                # 这里可以添加MySQL模式自省逻辑
                # 暂时跳过，直接使用语义模式
                logger.debug(f"MySQL配置检测到，主机: {MYSQL_CONFIG['host']}:{MYSQL_CONFIG['port']}")
                pass
            except Exception as e:
                logger.error(f"MySQL连接失败: {e}")
        
        # 调用翻译器
        logger.info(f"开始自然语言到SQL转换 - 使用语义模式: {request.use_semantic}")
        
        if request.use_semantic:
            semantic, sql = nl_to_mysql(
                question=request.question,
                schema=schema,
                model=request.model,
                base_url=OLLAMA_BASE_URL,
                db_name=request.db_name
            )
        else:
            # 不使用语义模式
            logger.info("使用非语义模式进行转换")
            semantic, sql = nl_to_mysql(
                question=request.question,
                schema=schema,
                model=request.model,
                base_url=OLLAMA_BASE_URL,
                db_name="unknown_db"  # 使用未知数据库名禁用语义模式
            )
        
        execution_time = (datetime.now() - start_time).total_seconds()
        
        # 记录成功处理信息
        logger.info(f"查询处理成功 - 意图: {semantic.intent}, SQL长度: {len(sql)}字符, "
                    f"执行时间: {execution_time:.3f}秒")
        logger.debug(f"生成的SQL: {sql}")
        
        return QueryResponse(
            success=True,
            question=request.question,
            intent=semantic.intent,
            semantic_sql=semantic.model_dump(by_alias=True),
            mysql_sql=sql,
            execution_time=execution_time,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        execution_time = (datetime.now() - start_time).total_seconds()
        
        # 记录错误信息
        logger.error(f"查询处理失败 - 问题: '{request.question}', 错误: {str(e)}, "
                     f"执行时间: {execution_time:.3f}秒", exc_info=True)
        
        return QueryResponse(
            success=False,
            question=request.question,
            intent="",
            semantic_sql={},
            mysql_sql="",
            execution_time=execution_time,
            timestamp=datetime.now().isoformat(),
            error=str(e)
        )

@app.get("/examples")
async def get_examples():
    """获取示例查询"""
    return {
        "examples": [
            {
                "category": "基础查询",
                "queries": [
                    "查询所有用户的信息",
                    "查询所有商品信息，包括名称、价格和库存",
                    "查询所有订单信息"
                ]
            },
            {
                "category": "聚合查询",
                "queries": [
                    "统计每个用户的订单总数和总金额",
                    "查询最近一周的订单趋势，按日期统计订单数量和总金额",
                    "统计商品销售情况，按商品分组"
                ]
            },
            {
                "category": "复杂查询",
                "queries": [
                    "找出最活跃的用户，按订单总金额排序",
                    "查询最近7天每天的新增订单数量，按日期排序",
                    "统计每个商品类别的平均价格"
                ]
            }
        ]
    }

if __name__ == "__main__":
    logger.info("启动ChatBI服务器")
    logger.info(f"Ollama基础URL: {OLLAMA_BASE_URL}")
    logger.info(f"MySQL配置: {MYSQL_CONFIG['host']}:{MYSQL_CONFIG['port']}")
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
