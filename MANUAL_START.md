# 手动启动指南

## 方案 1: 修复证书问题后安装

在终端运行以下命令修复证书问题：

```bash
cd /Users/zyy/Desktop/lgz

# 修复 npm 证书问题
npm config set strict-ssl false
npm config set registry https://registry.npmjs.org/

# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

## 方案 2: 使用国内镜像源（推荐）

```bash
cd /Users/zyy/Desktop/lgz

# 使用淘宝镜像源
npm config set registry https://registry.npmmirror.com

# 安装依赖
cd frontend
npm install

cd ../backend
npm install
```

## 方案 3: 手动安装依赖

如果上述方法都失败，请在你的终端中依次执行：

### 前端依赖安装
```bash
cd /Users/zyy/Desktop/lgz/frontend
npm install
```

### 后端依赖安装
```bash
cd /Users/zyy/Desktop/lgz/backend
npm install
```

---

## 启动项目

### 启动后端（SQLite）
```bash
cd /Users/zyy/Desktop/lgz/backend
npm run dev:sqlite
```

### 启动前端（新终端）
```bash
cd /Users/zyy/Desktop/lgz/frontend
npm run dev
```

---

## 访问地址
- 前端：http://localhost:3000
- 后端：http://localhost:3001

---

## 常见错误解决

### 错误: "failed to copy trust settings"
这是系统证书问题，尝试：

```bash
# 方法 1: 使用国内镜像
npm config set registry https://registry.npmmirror.com

# 方法 2: 禁用 SSL 验证
npm config set strict-ssl false

# 方法 3: 清理缓存
npm cache clean --force
npm install
```

### 错误: "403 Forbidden"
```bash
# 使用国内镜像
npm config set registry https://registry.npmmirror.com
npm install --force
```

### 错误: "ECONNREFUSED"
检查网络连接，或使用镜像源。

---

## 快速启动命令（复制粘贴）

```bash
# 设置镜像源
npm config set registry https://registry.npmmirror.com

# 安装所有依赖
cd /Users/zyy/Desktop/lgz/frontend && npm install && cd ../backend && npm install

# 启动后端（终端1）
cd /Users/zyy/Desktop/lgz/backend && npm run dev:sqlite

# 启动前端（终端2，新窗口）
cd /Users/zyy/Desktop/lgz/frontend && npm run dev
```