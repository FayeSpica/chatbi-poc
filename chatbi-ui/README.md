# ChatBI UI - 前端用户界面

ChatBI项目的前端界面，基于React和Vite构建，提供现代化的自然语言转SQL交互体验。

## 功能特性

### 🎯 用户界面
- **聊天式交互**: 类似ChatGPT的对话界面
- **实时查询**: 即时显示SQL生成结果
- **语法高亮**: SQL代码语法高亮显示
- **一键复制**: 支持SQL和JSON结果复制
- **响应式设计**: 支持桌面和移动设备

### 🛠️ 技术特性
- **React 18**: 现代化的React框架
- **Vite**: 快速的构建工具
- **Tailwind CSS**: 实用优先的CSS框架
- **代码高亮**: Prism.js语法高亮
- **状态管理**: React Hooks状态管理
- **API集成**: 与ChatBI Server的完整集成

## 项目结构

```
chatbi-ui/
├── src/
│   ├── components/         # React组件
│   │   ├── ChatInterface.jsx    # 聊天界面主组件
│   │   ├── Header.jsx           # 顶部导航
│   │   ├── MessageBubble.jsx    # 消息气泡
│   │   ├── QueryInput.jsx       # 查询输入框
│   │   ├── ResponseDisplay.jsx  # 结果显示组件
│   │   └── Sidebar.jsx          # 侧边栏
│   ├── utils/
│   │   └── api.js              # API调用工具
│   ├── styles/
│   │   └── index.css           # 全局样式
│   ├── App.jsx                 # 主应用组件
│   └── main.jsx                # 应用入口
├── public/                     # 静态资源
├── package.json               # 项目配置和依赖
├── vite.config.js            # Vite配置
├── tailwind.config.js        # Tailwind配置
├── postcss.config.js         # PostCSS配置
├── Dockerfile                # Docker构建文件
└── README.md                 # 项目说明
```

## 安装和运行

### 方法一：本地开发

#### 1. 安装依赖
```bash
cd chatbi-ui
npm install
```

#### 2. 启动开发服务器
```bash
npm run dev
```

应用将在 http://localhost:3000 启动

#### 3. 构建生产版本
```bash
npm run build
```

#### 4. 预览生产版本
```bash
npm run preview
```

### 方法二：Docker运行

#### 1. 构建镜像
```bash
docker build -t chatbi-ui .
```

#### 2. 运行容器
```bash
docker run -p 3000:3000 \
  -e VITE_API_BASE_URL=http://localhost:8000 \
  chatbi-ui
```

### 方法三：使用docker-compose（推荐）

在项目根目录运行：
```bash
docker-compose up chatbi-ui
```

## 环境变量配置

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `VITE_API_BASE_URL` | http://localhost:8000 | ChatBI Server API地址 |

注意：Vite环境变量必须以`VITE_`前缀开头才能在客户端代码中使用。

## 功能说明

### 主界面组件

#### 聊天界面 (ChatInterface)
- 显示对话历史
- 处理用户输入
- 展示查询结果
- 管理应用状态

#### 查询输入 (QueryInput)
- 自然语言输入框
- 发送查询请求
- 输入验证和状态管理

#### 结果显示 (ResponseDisplay)
- SQL语法高亮显示
- JSON结构化展示
- 一键复制功能
- 执行时间显示

#### 侧边栏 (Sidebar)
- 语义模式信息
- 示例查询列表
- 设置选项
- 状态指示器

### API集成

#### 查询处理
```javascript
import { queryAPI } from './utils/api';

const result = await queryAPI({
  question: "查询所有用户信息",
  db_name: "shop",
  use_semantic: true,
  model: "qwen3:8b"
});
```

#### 获取语义模式
```javascript
import { getSchemasAPI } from './utils/api';

const schemas = await getSchemasAPI();
```

#### 获取示例
```javascript
import { getExamplesAPI } from './utils/api';

const examples = await getExamplesAPI();
```

## 开发指南

### 添加新组件

1. 在 `src/components/` 目录创建新组件文件
2. 使用函数式组件和React Hooks
3. 应用Tailwind CSS样式
4. 导出组件并在需要的地方导入

示例：
```jsx
import React from 'react';

const NewComponent = ({ prop1, prop2 }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">{prop1}</h2>
      <p className="text-gray-600">{prop2}</p>
    </div>
  );
};

export default NewComponent;
```

### 修改样式

#### 使用Tailwind工具类
```jsx
<div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
  <span className="text-blue-800 font-medium">状态信息</span>
  <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
    操作
  </button>
</div>
```

#### 自定义CSS
在 `src/styles/index.css` 中添加自定义样式：
```css
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 3px;
}
```

### API调用

#### 扩展API函数
在 `src/utils/api.js` 中添加新的API调用函数：
```javascript
export const newAPI = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/new-endpoint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API调用失败:', error);
    throw error;
  }
};
```

## 构建和部署

### 开发环境
```bash
npm run dev        # 启动开发服务器
npm run build      # 构建生产版本
npm run preview    # 预览生产版本
npm run lint       # 代码检查
```

### 生产环境部署

#### 1. 构建应用
```bash
npm run build
```

#### 2. 部署静态文件
将 `dist/` 目录中的文件部署到Web服务器（如Nginx、Apache等）

#### 3. 配置反向代理
如果使用Nginx，配置示例：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/chatbi-ui/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 自定义配置

### Vite配置
修改 `vite.config.js` 来自定义构建配置：
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### Tailwind配置
修改 `tailwind.config.js` 来扩展主题：
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    },
  },
  plugins: [],
}
```

## 故障排除

### 常见问题

1. **API连接失败**
   - 检查ChatBI Server是否运行
   - 验证VITE_API_BASE_URL配置
   - 检查网络连接和代理设置

2. **构建失败**
   - 清理node_modules：`rm -rf node_modules && npm install`
   - 检查Node.js版本兼容性
   - 查看构建错误日志

3. **样式显示异常**
   - 确认Tailwind CSS正确安装
   - 检查PostCSS配置
   - 清理浏览器缓存

4. **组件渲染错误**
   - 检查React版本兼容性
   - 查看浏览器控制台错误
   - 验证组件props类型

### 调试技巧

1. **开发者工具**
   - 使用React Developer Tools
   - 检查Network标签页的API请求
   - 查看Console错误信息

2. **日志调试**
   ```javascript
   console.log('调试信息:', data);
   console.error('错误信息:', error);
   ```

3. **条件渲染调试**
   ```jsx
   {process.env.NODE_ENV === 'development' && (
     <div className="debug-info">
       {JSON.stringify(debugData, null, 2)}
     </div>
   )}
   ```

## 贡献指南

1. Fork项目
2. 创建功能分支：`git checkout -b feature/ui-improvement`
3. 提交更改：`git commit -am 'Improve user interface'`
4. 推送分支：`git push origin feature/ui-improvement`
5. 创建Pull Request

### 代码规范
- 使用ESLint进行代码检查
- 遵循React最佳实践
- 保持组件简洁和可复用
- 添加必要的注释

## 许可证

MIT License