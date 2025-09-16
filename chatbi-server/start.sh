#!/bin/bash

# ChatBI Server 启动脚本

echo "🚀 启动 ChatBI Server..."

# 检查是否在正确的目录
if [ ! -f "app.py" ]; then
    echo "❌ 请在 chatbi-server 目录下运行此脚本"
    exit 1
fi

# 检查 Python 环境
if ! command -v python3 &> /dev/null; then
    echo "❌ 未找到 Python3"
    exit 1
fi

# 检查 Ollama 服务
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "⚠️  Ollama 服务未运行，请先启动 Ollama："
    echo "   ollama serve"
    echo "   然后下载模型："
    echo "   ollama pull qwen3:8b"
    echo ""
    echo "继续启动服务器（可能会遇到连接错误）..."
fi

echo "📦 安装依赖..."
pip install -r requirements.txt

echo "🌐 启动服务器..."
echo "📍 服务地址: http://localhost:8000"
echo "📚 API文档: http://localhost:8000/docs"
echo ""
echo "按 Ctrl+C 停止服务"

python app.py