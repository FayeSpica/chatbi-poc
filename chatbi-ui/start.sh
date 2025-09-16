#!/bin/bash

# ChatBI UI 启动脚本

echo "🚀 启动 ChatBI UI..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在 chatbi-ui 目录下运行此脚本"
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

# 检查后端服务
if ! curl -s http://localhost:8000/ > /dev/null; then
    echo "⚠️  后端服务未运行，请先启动 ChatBI Server："
    echo "   cd ../chatbi-server && ./start.sh"
    echo ""
    echo "继续启动前端（可能会遇到API连接错误）..."
fi

echo "📦 安装依赖..."
npm install

echo "🌐 启动开发服务器..."
echo "📍 前端地址: http://localhost:3000"
echo "🔗 后端API: http://localhost:8000"
echo ""
echo "按 Ctrl+C 停止服务"

npm run dev