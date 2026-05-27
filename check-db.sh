#!/bin/bash

echo "🔍 检查 Docker 和数据库状态..."
echo ""

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker Desktop"
    exit 1
fi

echo "✅ Docker 正在运行"
echo ""

# 检查容器状态
echo "📦 检查容器状态..."
docker ps | grep -E "jira-mysql|jira-redis"

if [ $? -ne 0 ]; then
    echo "⚠️  容器未运行，尝试启动..."
    docker-compose up -d
    echo "⏳ 等待数据库初始化（30秒）..."
    sleep 30
fi

echo ""
echo "📋 容器日志："
echo "--- MySQL ---"
docker logs jira-mysql --tail 10
echo ""
echo "--- Redis ---"
docker logs jira-redis --tail 5

echo ""
echo "🔗 测试数据库连接..."

# 测试 MySQL 连接
docker exec jira-mysql mysqladmin ping -h localhost -u jira_user -pjira_password 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ MySQL 连接成功！"

    # 测试查询
    docker exec jira-mysql mysql -u jira_user -pjira_password -e "SELECT 'Database is ready!' as status;" 2>/dev/null
else
    echo "❌ MySQL 连接失败"
    echo ""
    echo "尝试重启容器："
    docker-compose restart mysql
    sleep 10
fi

echo ""
echo "📊 容器详细信息："
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "NAMES|jira"

echo ""
echo "💡 提示："
echo "- 如果看到 'Database is ready!'，数据库已就绪"
echo "- 前端地址：http://localhost:3000"
echo "- 后端地址：http://localhost:3001"
echo ""
echo "如果仍有问题，请查看 TROUBLESHOOTING.md"