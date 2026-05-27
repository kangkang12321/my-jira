# Docker 数据库连接排查指南

## 常见问题解决

### 1. 检查 Docker 容器状态
```bash
# 查看所有容器
docker ps -a

# 查看 MySQL 日志
docker logs jira-mysql

# 查看 Redis 日志
docker logs jira-redis
```

### 2. 重启数据库容器
```bash
# 停止并删除容器
docker-compose down

# 重新启动
docker-compose up -d

# 等待 MySQL 初始化完成（约 10-15 秒）
sleep 15

# 检查状态
docker ps
```

### 3. 测试数据库连接
```bash
# 连接到 MySQL 容器
docker exec -it jira-mysql mysql -u jira_user -pjira_password jira_clone

# 或使用 root
docker exec -it jira-mysql mysql -uroot -prootpassword
```

### 4. 检查端口占用
```bash
# 检查 3306 端口是否被占用
lsof -i :3306

# 或
netstat -an | grep 3306
```

### 5. 如果端口被占用，修改端口
编辑 `docker-compose.yml`，将端口映射改为：
```yaml
ports:
  - "3307:3306"  # 使用 3307 而不是 3306
```

同时修改 `backend/.env`：
```env
DB_PORT=3307
```

### 6. 完整重启流程
```bash
# 1. 停止所有服务
docker-compose down -v

# 2. 删除旧数据（可选，会清空数据库）
rm -rf mysql_data redis_data

# 3. 重新启动
docker-compose up -d

# 4. 等待启动
sleep 15

# 5. 检查状态
docker ps
docker logs jira-mysql --tail 20
```

### 7. 验证 MySQL 是否就绪
```bash
# 检查 MySQL 进程
docker exec jira-mysql pgrep -f mysql

# 测试连接
docker exec jira-mysql mysqladmin ping -h localhost -u jira_user -pjira_password

# 应该返回：mysqld is alive
```

## 常见错误

### Error: Access denied for user
检查密码是否匹配：
- docker-compose.yml: `MYSQL_PASSWORD=jira_password`
- backend/.env: `DB_PASSWORD=jira_password`

### Error: Unknown database
数据库需要时间初始化，等待 10-15 秒后再连接

### Error: Can't connect to MySQL server
1. 检查端口是否正确
2. 等待容器完全启动
3. 检查防火墙设置

## 快速测试

运行这个测试命令：
```bash
cd /Users/zyy/Desktop/lgz
docker exec -it jira-mysql mysql -u jira_user -pjira_password -e "SELECT 'Database connection successful!' as status;"
```

如果输出 `Database connection successful!`，则数据库正常。