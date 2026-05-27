# Jira Clone - 项目管理系统

仿照 Jira 的项目管理系统，采用全栈架构：

## 技术栈

### 前端
- Next.js 19
- React 19
- TypeScript
- Tailwind CSS
- React Server Components & Server Actions
- `useTransition` 和乐观更新
- Zustand 状态管理
- @dnd-kit 拖拽功能

### 后端
- NestJS
- TypeScript
- TypeORM
- MySQL 8.0
- JWT 认证
- Passport

## 快速开始

### 1. 启动数据库

```bash
docker-compose up -d
```

### 2. 安装依赖

```bash
# 前端
cd frontend
npm install

# 后端
cd ../backend
npm install
```

### 3. 启动后端服务

```bash
cd backend
npm run start:dev
```

后端运行在 `http://localhost:3001`

### 4. 启动前端服务

```bash
cd frontend
npm run dev
```

前端运行在 `http://localhost:3000`

## 项目结构

```
jira-clone/
├── frontend/                 # Next.js 19 前端
│   ├── src/
│   │   ├── app/              # App Router (Server Components)
│   │   │   ├── actions.ts    # Server Actions
│   │   │   └── data.ts       # Server-side data fetching
│   │   ├── components/       # React 组件
│   │   ├── hooks/            # 自定义 hooks (useTransition, useOptimistic)
│   │   ├── lib/              # 工具函数和 API 客户端
│   │   ├── types/            # TypeScript 类型
│   │   └── store/            # Zustand 状态管理
│   └── package.json
│
├── backend/                  # NestJS 后端
│   ├── src/
│   │   ├── modules/          # 功能模块
│   │   │   ├── auth/         # 认证模块
│   │   │   ├── projects/     # 项目管理
│   │   │   ├── issues/       # Issue 管理
│   │   │   ├── sprints/      # Sprint 管理
│   │   │   └── comments/     # 评论管理
│   │   └── main.ts
│   └── package.json
│
└── docker-compose.yml        # MySQL + Redis
```

## Next.js 19 特性应用

### 1. React Server Components (RSC)
- 首页默认为 Server Component，使用 SSR
- 服务器端数据获取 (`data.ts`)

### 2. Server Actions
- 登录/注册表单处理
- 项目创建和删除
- 使用 `useFormState` 集成

### 3. useTransition 优化
- `useOptimisticUpdate` Hook
- 项目列表的乐观更新
- 表单提交的 `startTransition` 包装

### 4. 乐观更新 (Optimistic Updates)
- 删除项目立即更新 UI
- 使用 `useOptimistic` Hook

## API 端点

### 认证
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `GET /auth/me` - 获取当前用户

### 项目
- `GET /projects` - 获取项目列表
- `POST /projects` - 创建项目
- `GET /projects/:id` - 获取项目详情
- `PATCH /projects/:id` - 更新项目
- `DELETE /projects/:id` - 删除项目

### Issues
- `GET /projects/:projectId/issues` - 获取 Issues
- `POST /projects/:projectId/issues` - 创建 Issue
- `GET /issues/:id` - 获取 Issue 详情
- `PATCH /issues/:id` - 更新 Issue
- `DELETE /issues/:id` - 删除 Issue

### Sprints
- `GET /projects/:projectId/sprints` - 获取 Sprints
- `POST /projects/:projectId/sprints` - 创建 Sprint
- `PATCH /sprints/:id` - 更新 Sprint
- `DELETE /sprints/:id` - 删除 Sprint

### Comments
- `GET /issues/:issueId/comments` - 获取评论
- `POST /issues/:issueId/comments` - 创建评论
- `PATCH /comments/:id` - 更新评论
- `DELETE /comments/:id` - 删除评论

## 数据库

项目使用 MySQL 8.0，主要表：

- `users` - 用户表
- `projects` - 项目表
- `project_members` - 项目成员
- `issues` - Issue 表
- `sprints` - Sprint 表
- `comments` - 评论表
- `issue_changes` - Issue 变更历史

## 开发说明

### 前端开发

```bash
cd frontend
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
```

### 后端开发

```bash
cd backend
npm run start:dev    # 启动开发服务器 (热重载)
npm run build        # 构建
npm run start:prod   # 启动生产服务器
npm run test         # 运行测试
```

## 许可证

MIT