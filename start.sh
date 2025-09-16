#!/bin/bash

# ChatBI 项目启动脚本

echo "🚀 启动 ChatBI 项目..."

# 检查是否在项目根目录
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ 请在项目根目录下运行此脚本"
    exit 1
fi

echo "请选择启动方式："
echo "1. 使用 Docker Compose 启动（推荐）"
echo "2. 分别启动后端和前端服务"
echo "3. 只启动后端服务"
echo "4. 只启动前端服务"
echo "5. 只启动数据库服务"
read -p "请输入选择 (1-5): " choice

case $choice in
    1)
        echo "🐳 使用 Docker Compose 启动所有服务..."
        
        # 检查 Docker 和 Docker Compose
        if ! command -v docker &> /dev/null; then
            echo "❌ 未找到 Docker，请先安装 Docker"
            exit 1
        fi
        
        if ! command -v docker-compose &> /dev/null; then
            echo "❌ 未找到 Docker Compose，请先安装 Docker Compose"
            exit 1
        fi
        
        echo "🔧 构建和启动服务..."
        docker-compose up --build -d
        
        echo "✅ 服务启动完成！"
        echo "📱 前端地址: http://localhost:3000"
        echo "🔧 后端地址: http://localhost:8000"
        echo "📚 API文档: http://localhost:8000/docs"
        echo "🗄️  数据库: localhost:3307"
        echo ""
        echo "查看日志: docker-compose logs -f"
        echo "停止服务: docker-compose down"
        ;;
        
    2)
        echo "🔧 分别启动后端和前端服务..."
        
        # 启动后端
        echo "启动后端服务..."
        cd chatbi-server
        ./start.sh &
        BACKEND_PID=$!
        cd ..
        
        # 等待后端启动
        echo "⏳ 等待后端启动..."
        sleep 5
        
        # 启动前端
        echo "启动前端服务..."
        cd chatbi-ui
        ./start.sh &
        FRONTEND_PID=$!
        cd ..
        
        echo "✅ 服务启动完成！"
        echo "📱 前端地址: http://localhost:3000"
        echo "🔧 后端地址: http://localhost:8000"
        echo ""
        echo "按 Ctrl+C 停止所有服务"
        
        # 等待用户中断
        trap "echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
        wait
        ;;
        
    3)
        echo "🔧 启动后端服务..."
        cd chatbi-server
        ./start.sh
        ;;
        
    4)
        echo "🌐 启动前端服务..."
        cd chatbi-ui
        ./start.sh
        ;;
        
    5)
        echo "🗄️  启动数据库服务..."
        if ! command -v docker-compose &> /dev/null; then
            echo "❌ 未找到 Docker Compose，请先安装"
            exit 1
        fi
        
        docker-compose up mysql -d
        echo "✅ MySQL 数据库已启动"
        echo "🗄️  数据库地址: localhost:3307"
        echo "👤 用户名: root"
        echo "🔑 密码: pass"
        echo "📊 数据库: shop"
        ;;
        
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac