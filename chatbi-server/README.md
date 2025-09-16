# ChatBI Server - 后端API服务

ChatBI项目的后端服务，基于FastAPI构建，提供自然语言转SQL的API接口和核心处理逻辑。

## 功能特性

### 🚀 核心功能
- **自然语言转SQL**: 使用Ollama + LangChain将中文自然语言转换为MySQL SQL语句
- **语义模式支持**: 集成语义模块，提供更准确的查询结果
- **RESTful API**: 提供标准的REST API接口
- **数据库自省**: 自动获取MySQL数据库结构信息
- **模型管理**: 支持多种LLM模型配置

### 🛠️ 技术栈
- **FastAPI**: 现代化的Python Web框架
- **LangChain**: LLM集成框架
- **Ollama**: 本地LLM服务
- **Pydantic**: 数据验证和序列化
- **MySQL Connector**: 数据库连接
- **Uvicorn**: ASGI服务器

## 项目结构

```
chatbi-server/
├── app.py                  # FastAPI主应用
├── main.py                 # 命令行工具入口
├── translator.py           # 核心翻译逻辑
├── semantic_schema.py      # 语义模式定义
├── semantic_example.py     # 语义模块示例
├── requirements.txt        # Python依赖
├── Dockerfile             # Docker构建文件
└── README.md              # 项目说明
```

## 安装和运行

### 方法一：直接运行

#### 1. 安装依赖
```bash
cd chatbi-server
pip install -r requirements.txt
```

#### 2. 启动服务
```bash
python app.py
```

服务将在 http://localhost:8000 启动

### 方法二：Docker运行

#### 1. 构建镜像
```bash
docker build -t chatbi-server .
```

#### 2. 运行容器
```bash
docker run -p 8000:8000 \
  -e MYSQL_HOST=host.docker.internal \
  -e MYSQL_PORT=3307 \
  -e MYSQL_USER=root \
  -e MYSQL_PASSWORD=pass \
  -e MYSQL_DATABASE=shop \
  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 \
  chatbi-server
```

### 方法三：使用docker-compose（推荐）

在项目根目录运行：
```bash
docker-compose up chatbi-server
```

## 环境变量配置

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `MYSQL_HOST` | - | MySQL主机地址 |
| `MYSQL_PORT` | 3306 | MySQL端口 |
| `MYSQL_USER` | - | MySQL用户名 |
| `MYSQL_PASSWORD` | - | MySQL密码 |
| `MYSQL_DATABASE` | - | MySQL数据库名 |
| `OLLAMA_BASE_URL` | http://localhost:11434 | Ollama服务地址 |
| `OLLAMA_MODEL` | qwen2.5:7b | 使用的LLM模型 |
| `DB_NAME` | shop | 语义模式数据库名 |

## API接口文档

### 健康检查
```http
GET /
```

### 获取语义模式
```http
GET /schemas
```

### 处理自然语言查询
```http
POST /query
Content-Type: application/json

{
  "question": "查询所有用户信息",
  "db_name": "shop",
  "use_semantic": true,
  "model": "qwen2.5:7b"
}
```

响应示例：
```json
{
  "success": true,
  "semantic_sql": {
    "intent": "查询用户信息",
    "query": {
      "select": ["*"],
      "from": "users"
    }
  },
  "mysql_sql": "SELECT * FROM users",
  "execution_time": 1.23
}
```

### 获取查询示例
```http
GET /examples
```

### API文档
访问 http://localhost:8000/docs 查看完整的API文档

## 命令行工具

除了Web API，还可以直接使用命令行工具：

```bash
# 基础查询
QUESTION="查询所有用户信息" python main.py

# 带MySQL连接的查询
MYSQL_HOST=127.0.0.1 MYSQL_PORT=3307 MYSQL_USER=root MYSQL_PASSWORD=pass MYSQL_DATABASE=shop OLLAMA_BASE_URL=http://localhost:11434 QUESTION="统计每个用户的订单数量" python main.py

# 使用语义模式的查询
MYSQL_HOST=127.0.0.1 MYSQL_PORT=3307 MYSQL_USER=root MYSQL_PASSWORD=pass MYSQL_DATABASE=shop OLLAMA_BASE_URL=http://localhost:11434 DB_NAME=shop QUESTION="找出最活跃的用户" python main.py
```

## 开发说明

### 添加新的API端点
1. 在 `app.py` 中定义新的路由函数
2. 使用Pydantic模型定义请求/响应结构
3. 添加适当的错误处理

### 扩展语义模式
1. 修改 `semantic_schema.py` 中的模式定义
2. 在 `semantic_manager` 中注册新模式
3. 重启服务使更改生效

### 自定义翻译逻辑
修改 `translator.py` 中的翻译函数来自定义处理逻辑

## 故障排除

### 常见问题

1. **Ollama连接失败**
   - 确认Ollama服务正在运行：`ollama serve`
   - 检查OLLAMA_BASE_URL配置
   - 确认模型已下载：`ollama pull qwen2.5:7b`

2. **MySQL连接失败**
   - 检查数据库服务是否运行
   - 验证连接参数（主机、端口、用户名、密码）
   - 确认数据库存在

3. **语义模式加载失败**
   - 检查DB_NAME环境变量
   - 确认语义模式定义正确
   - 查看服务器日志获取详细错误

4. **API调用失败**
   - 检查请求格式是否正确
   - 查看API文档：http://localhost:8000/docs
   - 检查服务器日志

### 调试模式
设置环境变量 `DEBUG=1` 可以显示更详细的日志信息

### 日志查看
- 直接运行：查看终端输出
- Docker运行：`docker logs chatbi-server`
- docker-compose运行：`docker-compose logs chatbi-server`

## 性能优化

### 建议配置
- 生产环境使用Gunicorn运行：`gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app`
- 配置适当的工作进程数量
- 使用Redis缓存查询结果
- 配置数据库连接池

### 监控
- 使用FastAPI内置的性能监控
- 配置日志记录
- 监控Ollama服务状态

## 部署说明

### 生产环境部署
1. 使用Gunicorn作为WSGI服务器
2. 配置反向代理（Nginx）
3. 设置环境变量
4. 配置日志和监控

### 容器化部署
使用提供的Dockerfile和docker-compose.yml进行部署

## 贡献指南

1. Fork项目
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 创建Pull Request

## 许可证

MIT License