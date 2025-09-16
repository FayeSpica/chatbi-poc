# ChatBI POC - 自然语言转SQL系统

一个基于Ollama和LangChain的自然语言转SQL系统，支持语义模式定义，能够将中文自然语言转换为MySQL SQL语句。

## 功能特性

### 核心功能
- **自然语言转语义SQL**：使用Ollama + LangChain将中文自然语言转换为结构化的SemanticSQL JSON
- **语义SQL转MySQL**：将SemanticSQL结构渲染为标准的MySQL SQL语句
- **MySQL模式自省**：自动连接MySQL数据库获取表结构，为LLM提供上下文
- **语义模式支持**：通过预定义的语义模式提供更丰富的业务上下文

### 语义模块特性
- **表格语义定义**：定义每个表的业务含义和用途
- **字段语义描述**：详细描述每个字段的业务含义、数据类型和约束
- **关联关系定义**：定义表之间的外键关系和业务关联
- **业务规则支持**：定义业务规则和常见查询模式
- **聚合支持标记**：标记字段是否支持聚合操作

## 项目结构

```
chatbi-poc/
├── main.py                 # 主程序入口
├── translator.py           # 核心翻译逻辑
├── semantic_schema.py      # 语义模式定义
├── semantic_example.py     # 语义模块使用示例
├── requirements.txt        # Python依赖
├── docker-compose.yml      # MySQL容器配置
└── README.md              # 项目说明
```

## 安装和运行

### 1. 安装依赖
```bash
pip install -r requirements.txt
```

### 2. 启动MySQL（可选）
```bash
docker-compose up -d
```

### 3. 确保Ollama运行
```bash
ollama serve
# 确保有qwen3:8b模型
ollama pull qwen3:8b
```

### 4. 运行系统

#### 基础运行（无语义模式）
```bash
OLLAMA_BASE_URL=http://localhost:11434 QUESTION="你的问题" python main.py
```

#### 带MySQL模式自省
```bash
MYSQL_HOST=127.0.0.1 MYSQL_PORT=3307 MYSQL_USER=root MYSQL_PASSWORD=pass MYSQL_DATABASE=shop OLLAMA_BASE_URL=http://localhost:11434 QUESTION="你的问题" python main.py
```

#### 带语义模式（推荐）
```bash
MYSQL_HOST=127.0.0.1 MYSQL_PORT=3307 MYSQL_USER=root MYSQL_PASSWORD=pass MYSQL_DATABASE=shop OLLAMA_BASE_URL=http://localhost:11434 DB_NAME=shop QUESTION="你的问题" python main.py
```

## 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `QUESTION` | - | 自然语言问题 |
| `MYSQL_HOST` | - | MySQL主机地址 |
| `MYSQL_PORT` | 3306 | MySQL端口 |
| `MYSQL_USER` | - | MySQL用户名 |
| `MYSQL_PASSWORD` | - | MySQL密码 |
| `MYSQL_DATABASE` | - | MySQL数据库名 |
| `OLLAMA_BASE_URL` | http://localhost:11434 | Ollama服务地址 |
| `OLLAMA_MODEL` | qwen3:8b | 使用的模型 |
| `DB_NAME` | shop | 语义模式数据库名 |

## 语义模式定义

### 预定义模式
系统包含一个示例的电商商店语义模式，包含以下表：
- **users**: 用户信息表
- **orders**: 订单信息表  
- **products**: 商品信息表

### 自定义语义模式
可以通过修改 `semantic_schema.py` 来定义自己的语义模式：

```python
from semantic_schema import DatabaseSemantic, TableSemantic, FieldSemantic, DataType

# 创建自定义语义模式
custom_schema = DatabaseSemantic(
    name="my_db",
    description="我的数据库",
    business_domain="我的业务领域",
    tables=[
        TableSemantic(
            name="my_table",
            business_meaning="我的表",
            description="表的详细描述",
            fields=[
                FieldSemantic(
                    name="my_field",
                    data_type=DataType.STRING,
                    business_meaning="字段的业务含义",
                    examples=["示例值1", "示例值2"],
                    constraints=["非空", "唯一"]
                )
            ]
        )
    ]
)

# 添加到管理器
from semantic_schema import semantic_manager
semantic_manager.add_schema(custom_schema)
```

## 使用示例

### 基础查询
```bash
QUESTION="查询所有用户的信息" python main.py
```

### 复杂聚合查询
```bash
QUESTION="统计每个用户的订单总数和总金额，按总金额降序排列，只显示前5名" python main.py
```

### 时间范围查询
```bash
QUESTION="查询最近7天每天的新增订单数量，按日期排序" python main.py
```

### 多表关联查询
```bash
QUESTION="找出最活跃的用户，按订单总金额排序，显示用户名、邮箱和总消费金额" python main.py
```

## 输出格式

系统会输出两种格式：

### 1. SemanticSQL JSON
结构化的语义SQL表示，包含：
- `intent`: 查询意图
- `query`: 查询结构
  - `select`: 选择字段
  - `from`: 主表
  - `joins`: 关联表
  - `where`: 过滤条件
  - `group_by`: 分组字段
  - `having`: 分组过滤
  - `order_by`: 排序
  - `limit`: 限制数量

### 2. MySQL SQL
可直接执行的SQL语句

## 技术架构

- **LangChain**: 提供LLM集成框架
- **Ollama**: 本地LLM服务
- **Pydantic**: 数据验证和序列化
- **MySQL Connector**: 数据库连接和模式自省
- **自定义语义模块**: 业务语义定义和管理

## 扩展功能

### 添加新的语义模式
1. 在 `semantic_schema.py` 中定义新的 `DatabaseSemantic`
2. 使用 `semantic_manager.add_schema()` 添加
3. 在运行时设置 `DB_NAME` 环境变量

### 自定义字段类型
在 `semantic_schema.py` 中的 `DataType` 枚举中添加新类型

### 自定义业务规则
在 `TableSemantic` 的 `business_rules` 字段中定义业务规则

## 故障排除

### 常见问题
1. **Ollama连接失败**: 确保Ollama服务正在运行
2. **MySQL连接失败**: 检查数据库配置和网络连接
3. **模型不存在**: 使用 `ollama pull qwen3:8b` 下载模型
4. **JSON解析错误**: 检查LLM输出格式，系统会自动清理无效条件

### 调试模式
设置环境变量 `DEBUG=1` 可以显示更详细的错误信息

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

MIT License
