# Jira Clone - 快速启动（无需 Docker）

由于 Docker 权限问题，可以使用 SQLite 版本快速启动项目。

## 快速启动（SQLite）

### 1. 安装依赖

```bash
cd frontend
npm install

cd ../backend
npm install
```

### 2. 启动后端（使用 SQLite）

```bash
cd backend
npm run dev:sqlite
```

数据库会自动创建在 `backend/data/jira_clone.db`

### 3. 启动前端

```bash
cd frontend
npm run dev
```

### 访问地址
- 前端：http://localhost:3000
- 后端：http://localhost:3001

## SQLite vs MySQL

| 特性 | SQLite | MySQL |
|------|--------|-------|
| 启动 | ✅ 即时启动 | ⚠️ 需要 Docker |
| 性能 | 适合开发/测试 | 生产级性能 |
| 并发 | 单连接 | 高并发 |
| 数据持久化 | ✅ 文件存储 | ✅ 数据库 |

## 切换到 MySQL

如果想使用 MySQL，确保 Docker Desktop 正常运行后：

```bash
# 启动 MySQL
docker-compose up -d

# 等待 30 秒
sleep 30

# 启动后端
cd backend
npm run start:dev
```

## 项目已配置

后端已自动配置为支持两种数据库：
- 使用 `.env` 文件 → MySQL
- 使用 `.env.sqlite` 文件 → SQLite

默认使用 SQLite 进行快速开发。