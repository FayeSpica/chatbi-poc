# ChatBI - 自然语言转SQL系统

一个现代化的自然语言转SQL系统，采用前后端分离架构，支持中文自然语言查询，基于Ollama和LangChain构建。

## 🚀 项目概述

ChatBI是一个完整的自然语言转SQL解决方案，包含：
- **智能查询转换**: 使用大语言模型将中文自然语言转换为标准SQL
- **语义模式支持**: 通过预定义语义模式提供更准确的查询结果
- **现代化界面**: 基于React的聊天式用户界面
- **RESTful API**: 基于FastAPI的后端服务
- **容器化部署**: 完整的Docker支持

## 📁 项目结构

```
chatbi/
├── chatbi-server/          # 后端API服务
│   ├── app.py             # FastAPI主应用
│   ├── main.py            # 命令行工具
│   ├── translator.py      # 核心翻译逻辑
│   ├── semantic_schema.py # 语义模式定义
│   ├── requirements.txt   # Python依赖
│   ├── Dockerfile         # 后端Docker配置
│   └── README.md          # 后端说明文档
├── chatbi-ui/             # 前端用户界面
│   ├── src/               # React源代码
│   ├── package.json       # Node.js依赖
│   ├── Dockerfile         # 前端Docker配置
│   └── README.md          # 前端说明文档
├── mysql/                 # 数据库初始化脚本
│   └── init/
│       └── 001_schema.sql
├── docker-compose.yml     # 完整服务编排
└── README.md             # 项目总览
```

## 🎯 功能特性

### 核心功能
- **自然语言转SQL**: 支持中文自然语言输入，智能生成MySQL SQL语句
- **语义模式**: 预定义的业务语义模式，提供更准确的查询理解
- **数据库自省**: 自动获取数据库结构信息，为LLM提供上下文
- **多模型支持**: 支持多种Ollama模型配置

### 用户界面
- **聊天式交互**: 类似ChatGPT的对话界面
- **实时查询**: 即时显示SQL生成过程和结果
- **语法高亮**: SQL代码语法高亮显示
- **一键复制**: 支持SQL和JSON结果复制
- **响应式设计**: 支持桌面和移动设备

### 技术特性
- **前后端分离**: React + FastAPI架构
- **容器化部署**: 完整的Docker和docker-compose支持
- **RESTful API**: 标准的REST API接口
- **现代化技术栈**: 使用最新的Web技术

## 🚀 快速开始

### 方法一：使用docker-compose（推荐）

#### 1. 克隆项目
```bash
git clone <repository-url>
cd chatbi
```

#### 2. 启动服务
```bash
docker-compose up -d
```

#### 3. 访问应用
- 前端界面: http://localhost:3000
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/docs
- MySQL数据库: localhost:3307

### 方法二：分别启动服务

#### 1. 启动后端服务
```bash
cd chatbi-server
pip install -r requirements.txt
python app.py
```

#### 2. 启动前端服务
```bash
cd chatbi-ui
npm install
npm run dev
```

#### 3. 启动MySQL（可选）
```bash
docker-compose up mysql -d
```

## 📋 环境要求

### 系统要求
- **Ollama服务**: 需要运行Ollama本地LLM服务
- **Python**: 3.8+ (后端)
- **Node.js**: 16+ (前端)
- **MySQL**: 8.0+ (数据库，可选)

### 必要服务

#### 1. 安装和启动Ollama
```bash
# 安装Ollama（参考官方文档）
curl -fsSL https://ollama.ai/install.sh | sh

# 启动Ollama服务
ollama serve

# 下载模型
ollama pull qwen2.5:7b
```

#### 2. 配置MySQL（可选）
如果需要连接真实数据库：
```bash
# 使用docker-compose启动MySQL
docker-compose up mysql -d

# 或者使用现有MySQL实例
```

## 🔧 配置说明

### 环境变量

#### 后端配置 (chatbi-server)
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

#### 前端配置 (chatbi-ui)
| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `VITE_API_BASE_URL` | http://localhost:8000 | 后端API地址 |

## 💡 使用示例

### 基础查询
- "查询所有用户的信息"
- "查询所有商品信息，包括名称、价格和库存"
- "显示最近10个订单"

### 聚合查询
- "统计每个用户的订单总数和总金额"
- "查询最近一周的订单趋势，按日期统计"
- "统计商品销售情况，按商品分组"

### 复杂查询
- "找出最活跃的用户，按订单总金额排序，显示前5名"
- "查询最近7天每天的新增订单数量，按日期排序"
- "统计每个商品类别的平均价格和销量"

## 🛠️ 开发指南

### 后端开发
详细的后端开发说明请参考 [chatbi-server/README.md](./chatbi-server/README.md)

主要内容：
- API接口开发
- 语义模式扩展
- 翻译逻辑自定义
- 数据库集成

### 前端开发
详细的前端开发说明请参考 [chatbi-ui/README.md](./chatbi-ui/README.md)

主要内容：
- React组件开发
- 样式自定义
- API集成
- 用户界面优化

### 添加新的语义模式

1. 在 `chatbi-server/semantic_schema.py` 中定义新模式：
```python
from semantic_schema import DatabaseSemantic, TableSemantic, FieldSemantic

custom_schema = DatabaseSemantic(
    name="my_database",
    description="我的数据库",
    business_domain="业务领域",
    tables=[
        # 定义表结构
    ]
)

# 注册模式
semantic_manager.add_schema(custom_schema)
```

2. 重启后端服务使更改生效

## 🐳 Docker部署

### 完整服务部署
```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 单独服务部署
```bash
# 只启动数据库
docker-compose up mysql -d

# 只启动后端
docker-compose up chatbi-server -d

# 只启动前端
docker-compose up chatbi-ui -d
```

## 🔍 故障排除

### 常见问题

1. **Ollama连接失败**
   - 确认Ollama服务正在运行：`ollama serve`
   - 检查模型是否已下载：`ollama list`
   - 验证OLLAMA_BASE_URL配置

2. **前端无法连接后端**
   - 检查后端服务是否启动
   - 验证VITE_API_BASE_URL配置
   - 检查代理设置

3. **数据库连接失败**
   - 确认MySQL服务运行状态
   - 检查数据库连接参数
   - 验证网络连接

4. **Docker服务启动失败**
   - 检查端口占用：`netstat -tlnp`
   - 查看服务日志：`docker-compose logs service-name`
   - 重建容器：`docker-compose up --build`

### 调试模式
- 后端：设置 `DEBUG=1` 环境变量
- 前端：打开浏览器开发者工具
- Docker：使用 `docker-compose logs -f` 查看实时日志

## 📚 API文档

启动后端服务后，访问以下地址查看完整API文档：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 主要API端点
- `GET /`: 健康检查
- `GET /schemas`: 获取语义模式
- `POST /query`: 处理自然语言查询
- `GET /examples`: 获取查询示例

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 创建Pull Request

### 开发规范
- 后端：遵循PEP 8 Python代码规范
- 前端：使用ESLint和Prettier
- 提交：使用语义化提交信息
- 文档：更新相关文档

## 📄 许可证

MIT License

## 🙏 致谢

感谢以下开源项目的支持：
- [Ollama](https://ollama.ai/) - 本地LLM服务
- [LangChain](https://langchain.com/) - LLM应用框架
- [FastAPI](https://fastapi.tiangolo.com/) - 现代Python Web框架
- [React](https://reactjs.org/) - 用户界面库
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架