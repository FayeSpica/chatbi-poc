# ChatBI Web - 自然语言转SQL Web应用

基于React和FastAPI的现代化Web界面，提供直观的自然语言转SQL功能。

## 功能特性

### 🎯 核心功能
- **自然语言查询**: 支持中文自然语言输入
- **实时SQL生成**: 即时生成MySQL SQL语句
- **语义模式支持**: 集成语义模块，提供更准确的查询结果
- **交互式界面**: 现代化的聊天式用户界面
- **代码高亮**: SQL语法高亮显示
- **一键复制**: 支持SQL和JSON结果复制

### 🛠️ 技术特性
- **前后端分离**: React + FastAPI架构
- **响应式设计**: 支持桌面和移动设备
- **实时状态**: 显示Ollama连接状态和语义模式信息
- **错误处理**: 完善的错误提示和处理机制
- **设置面板**: 可配置数据库、模型等参数

## 项目结构

```
chatbi-web/
├── backend/                 # FastAPI后端
│   ├── app.py              # 主应用文件
│   └── requirements.txt    # Python依赖
├── frontend/               # React前端
│   ├── src/
│   │   ├── components/     # React组件
│   │   ├── utils/          # 工具函数
│   │   └── styles/         # 样式文件
│   ├── package.json        # Node.js依赖
│   └── vite.config.js      # Vite配置
├── start.sh               # 启动脚本
└── README.md              # 项目说明
```

## 快速开始

### 方法一：使用启动脚本（推荐）

```bash
cd chatbi-web
./start.sh
```

### 方法二：手动启动

#### 1. 启动后端
```bash
cd chatbi-web/backend
pip install -r requirements.txt
python app.py
```

#### 2. 启动前端
```bash
cd chatbi-web/frontend
npm install
npm run dev
```

### 3. 访问应用
- 前端界面: http://localhost:3000
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/docs

## 环境要求

### 后端要求
- Python 3.8+
- 已安装的语义模块（来自父目录）
- Ollama服务运行中

### 前端要求
- Node.js 16+
- npm 或 yarn

## 配置说明

### 环境变量
后端支持以下环境变量：

```bash
# Ollama配置
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b

# MySQL配置（可选）
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3307
MYSQL_USER=root
MYSQL_PASSWORD=pass
MYSQL_DATABASE=shop
```

### 前端配置
在 `vite.config.js` 中配置API代理：

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

## API接口

### 健康检查
```http
GET /api/
```

### 获取语义模式
```http
GET /api/schemas
```

### 处理查询
```http
POST /api/query
Content-Type: application/json

{
  "question": "查询所有用户信息",
  "db_name": "shop",
  "use_semantic": true,
  "model": "llama3.1:8b"
}
```

### 获取示例
```http
GET /api/examples
```

## 使用示例

### 基础查询
- "查询所有用户的信息"
- "查询所有商品信息，包括名称、价格和库存"
- "查询所有订单信息"

### 聚合查询
- "统计每个用户的订单总数和总金额"
- "查询最近一周的订单趋势，按日期统计订单数量和总金额"
- "统计商品销售情况，按商品分组"

### 复杂查询
- "找出最活跃的用户，按订单总金额排序"
- "查询最近7天每天的新增订单数量，按日期排序"
- "统计每个商品类别的平均价格"

## 界面说明

### 主界面
- **聊天区域**: 显示对话历史和查询结果
- **输入框**: 输入自然语言查询
- **设置按钮**: 配置查询参数
- **清空按钮**: 清空对话历史

### 侧边栏
- **语义模式**: 显示可用的语义模式信息
- **示例查询**: 提供常用查询示例
- **设置选项**: 配置使用偏好

### 查询结果
- **查询意图**: 显示AI理解的查询意图
- **MySQL SQL**: 生成的SQL语句（支持语法高亮）
- **语义SQL**: 结构化的JSON表示
- **执行时间**: 查询处理耗时
- **复制功能**: 一键复制SQL或JSON

## 开发说明

### 添加新组件
1. 在 `src/components/` 中创建新组件
2. 使用Tailwind CSS进行样式设计
3. 导出组件并在需要的地方导入

### 修改API接口
1. 在 `backend/app.py` 中添加新的路由
2. 在 `frontend/src/utils/api.js` 中添加对应的API调用函数
3. 在组件中使用新的API函数

### 自定义样式
- 修改 `src/styles/index.css` 中的Tailwind配置
- 在 `tailwind.config.js` 中扩展主题
- 使用Tailwind工具类进行样式设计

## 故障排除

### 常见问题

1. **前端无法连接后端**
   - 检查后端是否正在运行
   - 确认代理配置是否正确
   - 检查端口是否被占用

2. **Ollama连接失败**
   - 确认Ollama服务正在运行
   - 检查OLLAMA_BASE_URL配置
   - 确认模型已下载

3. **语义模式未加载**
   - 检查父目录的语义模块是否正确安装
   - 确认数据库名称配置正确

4. **查询失败**
   - 检查输入的问题是否清晰
   - 查看后端日志获取详细错误信息
   - 尝试使用示例查询

### 调试模式
- 前端: 打开浏览器开发者工具查看控制台
- 后端: 查看终端输出的日志信息
- API: 访问 http://localhost:8000/docs 查看接口文档

## 部署说明

### 生产环境部署
1. 构建前端: `npm run build`
2. 配置反向代理（如Nginx）
3. 使用Gunicorn运行后端
4. 配置环境变量

### Docker部署
可以创建Dockerfile和docker-compose.yml进行容器化部署。

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 创建Pull Request

## 许可证

MIT License
