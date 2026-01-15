# 重启人生 - 前端项目 (Restart Life Frontend)

<div align="center">
  <h2>🎮 一款让你体验无限人生可能的文字模拟测试</h2>
  <p>基于 React + TypeScript + Vite + Ant Design 构建的现代化前端应用</p>
</div>

## 📖 项目简介

重启新生是一款文字冒险、人生模拟、策略决策的Web测试客户端。用户可以选择出生的国家和年代，通过随机生成和主动选择相结合的方式，体验完整的人生历程。

### 🎯 核心特色

- 🌍 **全球视野**：支持全球200+国家和地区选择
- ⏰ **时代穿越**：体验不同年代的时代背景
- 🎲 **随机人生**：智能生成合理的人生事件和发展轨迹
- 🤔 **策略决策**：在关键人生节点做出重要选择
- 📊 **深度模拟**：完整的属性、关系、经济、健康系统
- 🏆 **成就系统**：记录和展示独特的人生成就

## 🛠 技术栈

- **前端框架**：React 18.2.0
- **构建工具**：Vite 4.4.0
- **UI组件库**：Ant Design 5.12.0
- **状态管理**：Zustand 4.4.0
- **路由管理**：React Router DOM 6.8.0
- **HTTP客户端**：Axios 1.6.0
- **类型检查**：TypeScript 5.0.0
- **样式方案**：Less + CSS Modules
- **图标库**：@ant-design/icons 5.2.0
- **日期处理**：Day.js 1.11.0
- **代码规范**：ESLint + TypeScript ESLint

## 📁 项目结构

```
.frontend/
├── src/                          # 源代码目录
│   ├── components/               # React组件
│   │   └── Navigation.tsx        # 导航组件
│   ├── pages/                    # 页面组件
│   │   ├── HomePage.tsx          # 首页
│   │   ├── LoginPage.tsx         # 登录页
│   │   ├── CharacterPage.tsx     # 角色管理页
│   │   ├── GamePage.tsx          # 游戏页面
│   │   └── ProfilePage.tsx       # 个人中心
│   ├── services/                 # API服务层
│   │   └── api.ts                # API接口定义
│   ├── stores/                   # 状态管理
│   │   └── authStore.ts          # 认证状态
│   ├── types/                    # TypeScript类型定义
│   │   └── index.ts              # 全局类型
│   ├── utils/                    # 工具函数
│   ├── App.tsx                   # 根组件
│   ├── main.tsx                  # 应用入口
│   └── index.css                 # 全局样式
├── public/                       # 静态资源
├── dist/                         # 构建输出 (ignored)
├── node_modules/                 # 依赖包 (ignored)
├── docs/                         # 文档
├── prdtd/                        # 产品需求文档
├── regulations/                  # 开发规范
├── package.json                  # 依赖配置
├── vite.config.ts                # Vite配置
├── tsconfig.json                 # TypeScript配置
└── README.md                     # 项目说明文档
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装步骤

1. **克隆项目**
   ```bash
   git clone [项目地址]
   cd restart-life-api/.frontend
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   yarn install
   ```

3. **启动开发服务器**
   ```bash
   # 开发模式（自动允许外网访问）
   npm run dev
   # 或
   yarn dev
   ```

4. **构建生产版本**
   ```bash
   npm run build
   # 或
   yarn build
   ```

5. **预览生产构建**
   ```bash
   npm run preview
   # 或
   yarn preview
   ```

### 开发环境

- **本地访问**：`http://localhost:8080`
- **网络访问**：`http://[服务器IP]:8080`（如：`http://43.136.39.202:8080`）
- **生产环境**：`https://asecondchance.cn`

- ⚠️ **注意**：
- 开发服务器默认配置为允许外网访问（`host: '0.0.0.0'`），在开发机上使用时请添加防火墙规则以限制不必要的对外暴露。
- 如果在非本机部署或容器中运行，确保宿主机已开放 `8080` 端口，且对应的 API 端口（默认 `8081`）也可达。
- API 请求会被 Vite 代理转发到 `http://localhost:8081/api/v1`，因此在开发模式下后端服务需监听该地址并允许跨域。 Proxy 配置可在 [`vite.config.ts`](./vite.config.ts) 中查看。

### Nginx & 生产部署说明
- 生产镜像通过 [`Dockerfile.prod`](./Dockerfile.prod) 构建，内部将 Vite 的构建产物拷贝到 `/usr/share/nginx/html`，并使用 [`nginx/nginx.conf`](./nginx/nginx.conf) + [`nginx/default.conf`](./nginx/default.conf) 提供静态文件服务、缓存策略与反向代理。
- 构建命令：`npm run docker:build` 会调用 `docker-compose build frontend-prod`，打包并输出 `frontend-prod` 镜像。运行命令 `npm run docker:prod` 会基于 production profile 启动 `frontend-prod` 服务，该服务依赖 `restart-network` 网络并将 HTTP/HTTPS 端口映射为 80/443。
- `nginx/nginx.conf` 开启了 gzip、日志、缓存、keepalive 等优化，生产镜像中还会包含 `nginx/default.conf`。该文件实现：
   1. **常规静态文件**：对 `.js/.css/.png/...` 设置 `expires 1y`，并添加 `Cache-Control: public, immutable`，适用于带 hash 的资源，前端构建时确保文件名为 content hash，避免缓存问题。
   2. **API 反向代理**：以 `/api/` 开头的请求代理至 `http://restart-life-api:8080`，服务名应与后端容器在 `restart-network` 中的服务名一致，且保留原始 `Host`、真实 IP 与代理头。可在多阶段部署时通过修改 `default.conf` 指向其他主机。
   3. **前端路由支持**：所有非静态资源会通过 `try_files $uri $uri/ /index.html` 回退到 SPA 主入口，确保刷新/深度链接可正常跳转。
   4. **健康检查**：`/health` 路径简单返回 `healthy`，可用于负载均衡或容器编排就绪探针。
   5. **安全头**：全局添加 `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection` 保护。Nginx 还可通过 `include` 引入额外头部。
- HTTPS 部分提供示例配置，监听 `443 ssl http2`，并读取 `/etc/nginx/ssl/cert.pem` 与 `/etc/nginx/ssl/key.pem`。部署时请将你自己的证书（例如 Let’s Encrypt）手动挂载到该路径，或通过 Kubernetes Secret/卷映射传入。
- 生产镜像默认挂载：
   - `./nginx/nginx.conf` 到容器 `/etc/nginx/nginx.conf`
   - `./nginx/default.conf` 到 `/etc/nginx/conf.d/default.conf`
   - SSL 证书到 `/etc/nginx/ssl`（只在 HTTPS 需要时提供）
- 推荐：在正式集群中前端容器与后端容器都加入 `restart-network` 网络，以保持 `/api/` 代理不需修改。如果后端服务在其他主机，请更新 `proxy_pass`。要关闭 HTTP，可在 `default.conf` 中注释 80 端口段并仅保留 443 部分。

### 可用脚本

```bash
# 开发服务器
npm run dev          # 启动开发服务器

# 构建相关
npm run build        # 构建生产版本
npm run preview      # 预览生产构建

# 代码质量
npm run lint         # ESLint代码检查
npm run type-check   # TypeScript类型检查

# Docker 相关
npm run docker:dev   # 通过 docker-compose 启动开发容器
npm run docker:build # 构建生产镜像 frontend-prod
npm run docker:prod  # 以 production profile 启动 nginx 前端容器
```

## 🎯 功能模块

### 🎲 核心游戏功能
- [x] 角色创建系统
- [x] 人生推进系统
- [x] 决策选择系统
- [x] 属性管理系统
- [x] 关系网络系统
- [x] 成就系统

### 🛠 辅助功能
- [x] 存档系统
- [x] 统计系统
- [x] 重制功能
- [x] 分享功能

### 📊 数据系统
- [x] 人生阶段系统
- [x] 事件系统设计
- [x] 时代背景系统
- [x] 游戏平衡机制

## 🎮 游戏玩法

### 开始游戏
1. 选择出生国家（全球200+国家）
2. 选择出生年份（1800-2050年）
3. 系统随机生成角色属性和家庭背景
4. 开启人生之旅

### 人生推进
- 选择推进模式（激进/稳定/保守）
- 每次推进一年
- 面对随机事件和重要选择
- 管理属性、关系和经济状况

### 策略要素
- 🧠 智力发展：影响学习和决策能力
- 💪 体质管理：影响健康和寿命
- ✨ 魅力培养：影响社交和机会
- 🎯 意志锻炼：影响抗压和坚持
- 🎨 创造力：影响创新和艺术成就

## 📚 文档

- [产品需求文档](./prdtd/PRD.md)
- [开发规范](./regulations/regulation.md)

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 开源协议

本项目采用 MIT 协议，详情请查看 [LICENSE](LICENSE) 文件。

## 🔄 版本历史

- **v1.0.0**：基础游戏功能实现
- **开发中**：更多特性持续添加...

## 📞 联系我们

如有问题或建议，请通过以下方式联系：

- GitHub Issues
- 项目讨论区

---

<div align="center">
  <p>🎮 开始你的重启人生之旅吧！</p>
  <p>在这里，每一个选择都很重要，每一段人生都独一无二。</p>
</div>
