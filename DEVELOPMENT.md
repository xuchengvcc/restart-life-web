# 前端开发指南

## 项目结构

```
.frontend/
├── public/              # 静态资源
├── src/
│   ├── components/      # 通用组件
│   │   └── Navigation.tsx
│   ├── pages/          # 页面组件
│   │   ├── HomePage.tsx
│   │   ├── GamePage.tsx
│   │   ├── CharacterPage.tsx
│   │   └── ProfilePage.tsx
│   ├── services/       # API 服务
│   │   └── api.ts
│   ├── stores/         # 状态管理
│   │   ├── authStore.ts
│   │   └── gameStore.ts
│   ├── types/          # TypeScript 类型定义
│   │   └── index.ts
│   ├── utils/          # 工具函数
│   ├── App.tsx         # 主应用组件
│   ├── main.tsx        # 应用入口
│   └── index.css       # 全局样式
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript 配置
├── vite.config.ts      # Vite 配置
└── README.md          # 项目说明
```

## 技术栈

- **React 18**: 现代化的前端框架
- **TypeScript**: 类型安全的 JavaScript
- **Vite**: 快速的构建工具
- **Ant Design**: 企业级 UI 组件库
- **Zustand**: 轻量级状态管理
- **React Router**: 路由管理
- **Axios**: HTTP 客户端

## 开发环境设置

### 1. 安装 Node.js
确保你的系统已安装 Node.js 18 或更高版本：
```bash
# 检查 Node.js 版本
node --version

# 如果未安装，请下载安装：
# https://nodejs.org/
```

### 2. 安装依赖
```bash
cd .frontend
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```
这将启动开发服务器，默认运行在 http://localhost:3000

### 4. 其他可用命令
```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

## API 集成

前端通过 `/src/services/api.ts` 与后端 API 通信：

- **基础 URL**: `/api` (通过 Vite 代理到 `http://localhost:8080/api/v1`)
- **认证**: 使用 JWT Token，自动添加到请求头
- **错误处理**: 自动处理 401 错误并重定向到登录页

## 状态管理

使用 Zustand 进行状态管理：

- **authStore**: 用户认证状态
- **gameStore**: 游戏相关状态

## 开发规范

### 1. 文件命名
- 组件文件使用 PascalCase: `HomePage.tsx`
- 其他文件使用 camelCase: `api.ts`

### 2. 组件结构
```tsx
import React from 'react'
import { Button } from 'antd'

interface Props {
  title: string
}

const MyComponent: React.FC<Props> = ({ title }) => {
  return <Button>{title}</Button>
}

export default MyComponent
```

### 3. 类型定义
所有 API 相关的类型定义都在 `/src/types/index.ts` 中维护。

## 部署

### 开发环境
开发环境通过 Vite 开发服务器运行，支持热重载。

### 生产环境
```bash
# 构建生产版本
npm run build

# 构建输出在 dist/ 目录
# 可以通过任何静态文件服务器提供服务
```

## 下一步开发计划

1. **认证功能**: 完善登录/注册页面
2. **角色创建**: 实现角色创建流程
3. **游戏界面**: 开发核心游戏体验界面
4. **个人中心**: 用户信息和成就系统
5. **响应式设计**: 移动端适配
6. **性能优化**: 代码分割和懒加载

## 与后端对接

确保后端 API 服务运行在 `http://localhost:8080`，前端会自动代理 API 请求。

主要 API 端点：
- `POST /api/v1/auth/login` - 用户登录
- `GET /api/v1/characters` - 获取角色列表
- `POST /api/v1/characters` - 创建角色
- `GET /api/v1/game/{id}/state` - 获取游戏状态
- `POST /api/v1/game/{id}/advance` - 推进游戏
