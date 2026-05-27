#!/bin/bash

echo "🚀 启动 Jira Clone 项目..."

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker"
    exit 1
fi

# 启动数据库
echo "📦 启动 MySQL 数据库..."
docker-compose up -d

# 等待数据库启动
echo "⏳ 等待数据库启动..."
sleep 5

# 安装后端依赖（如果需要）
if [ ! -d "backend/node_modules" ]; then
    echo "📥 安装后端依赖..."
    cd backend && npm install && cd ..
fi

# 安装前端依赖（如果需要）
if [ ! -d "frontend/node_modules" ]; then
    echo "📥 安装前端依赖..."
    cd frontend && npm install && cd ..
fi

echo ""
echo "✅ 环境准备完成！"
echo ""
echo "🎯 请在两个终端中分别运行："
echo ""
echo "终端 1 - 后端："
echo "  cd backend && npm run start:dev"
echo ""
echo "终端 2 - 前端："
echo "  cd frontend && npm run dev"
echo ""
echo "🌐 前端地址：http://localhost:3000"
echo "🔌 后端地址：http://localhost:3001"
echo ""