#!/bin/bash

echo "🚀 启动 Jira Clone 项目（SQLite 版本）..."

# 创建 data 目录
mkdir -p backend/data

# 检查依赖
if [ ! -d "frontend/node_modules" ]; then
    echo "📥 安装前端依赖..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📥 安装后端依赖..."
    cd backend && npm install && cd ..
fi

echo ""
echo "✅ 环境准备完成！"
echo ""
echo "🎯 请在两个终端中分别运行："
echo ""
echo "终端 1 - 后端（SQLite）："
echo "  cd backend && npm run dev:sqlite"
echo ""
echo "终端 2 - 前端："
echo "  cd frontend && npm run dev"
echo ""
echo "🌐 前端地址：http://localhost:3000"
echo "🔌 后端地址：http://localhost:3001"
echo "💾 数据库：SQLite (backend/data/jira_clone.db)"
echo ""