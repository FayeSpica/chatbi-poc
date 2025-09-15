#!/bin/bash

# ChatBI Web 启动脚本

echo "🚀 启动 ChatBI Web 应用..."

# 检查是否在正确的目录
if [ ! -f "backend/app.py" ]; then
    echo "❌ 请在 chatbi-web 目录下运行此脚本"
    exit 1
fi

# 检查 Python 环境
if ! command -v python3 &> /dev/null; then
    echo "❌ 未找到 Python3"
    exit 1
fi

# 检查 Node.js 环境
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 未找到 npm"
    exit 1
fi

echo "📦 安装后端依赖..."
cd backend
pip install -r requirements.txt

echo "📦 安装前端依赖..."
cd ../frontend
npm install

echo "🔧 构建前端..."
npm run build

echo "🌐 启动后端服务..."
cd ../backend
python app.py &
BACKEND_PID=$!

echo "⏳ 等待后端启动..."
sleep 3

echo "🌐 启动前端服务..."
cd ../frontend
npm run serve &
FRONTEND_PID=$!

echo "✅ ChatBI Web 应用已启动!"
echo "📱 前端地址: http://localhost:3000"
echo "🔧 后端地址: http://localhost:8000"
echo "📚 API文档: http://localhost:8000/docs"
echo ""
echo "按 Ctrl+C 停止服务"

# 等待用户中断
trap "echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
