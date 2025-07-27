# 重启人生 - 前端项目 (Restart Life Frontend)

<div align="center">
  <h2>🎮 一款让你体验无限人生可能的文字模拟游戏</h2>
  <p>基于 React + TypeScript + Vite + Ant Design 构建的现代化前端应用</p>
</div>

## 📖 项目简介

重启人生前端是一款文字冒险、人生模拟、策略决策游戏的Web客户端。玩家可以选择出生的国家和年代，通过随机生成和主动选择相结合的方式，体验完整的人生历程。

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

⚠️ **注意**：
- 开发服务器默认配置为允许外网访问（`host: '0.0.0.0'`）
- 确保防火墙允许8080端口通行
- API请求会自动代理到后端服务（localhost:8081）

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
