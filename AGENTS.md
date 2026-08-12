# 项目上下文

## 技术栈

- **核心**: React 18, TypeScript, Vite 5
- **UI**: Tailwind CSS 3
- **动画**: Framer Motion
- **图标**: Lucide React
- **路由**: React Router DOM

## 目录结构

```
├── scripts/            # 构建与启动脚本
│   ├── build.sh        # 构建脚本
│   ├── dev.sh          # 开发环境启动脚本
│   └── start.sh        # 生产环境启动脚本
├── src/                # 前端源码
│   ├── components/     # 公共UI组件
│   │   ├── Navbar.tsx      # 导航栏（桌面/移动端适配）
│   │   ├── Layout.tsx      # 页面布局容器
│   │   └── ChatWidget.tsx  # AI对话交互组件
│   ├── pages/          # 页面组件
│   │   ├── HomePage.tsx        # 首页（个人简介+技能+AI对话入口）
│   │   ├── AboutPage.tsx       # 关于我（履历+技术栈+兴趣）
│   │   ├── DashboardPage.tsx   # 币安看板（实时加密货币行情）
│   │   └── PortfolioPage.tsx   # 作品集（网格卡片+详情弹窗）
│   ├── hooks/          # 自定义Hooks
│   │   ├── useBinanceData.ts   # 币安API数据获取Hook
│   │   └── useMarketData.ts    # 美股/A股/贵金属行情数据Hook（模拟）
│   ├── types/          # TypeScript类型定义
│   │   └── index.ts
│   ├── App.tsx         # 应用根组件（路由配置）
│   ├── main.tsx        # 客户端入口
│   └── index.css       # 全局样式（Tailwind + 自定义工具类）
├── index.html          # 入口 HTML
├── package.json        # 项目依赖管理
├── tsconfig.json       # TypeScript 配置
├── vite.config.ts      # Vite 配置
├── tailwind.config.js  # Tailwind CSS 配置
└── DESIGN.md           # 设计规范文件
```

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。
**常用命令**：
- 安装依赖：`pnpm add <package>`
- 安装开发依赖：`pnpm add -D <package>`
- 安装所有依赖：`pnpm install`
- 移除依赖：`pnpm remove <package>`

## 开发规范

- 使用 Tailwind CSS 进行样式开发
- 使用 Framer Motion 实现页面动画效果
- 组件按功能拆分到 components/ 和 pages/ 目录
- 自定义 Hooks 放入 hooks/ 目录
- 类型定义统一放入 types/ 目录

### 编码规范

- 默认按 TypeScript `strict` 心智写代码；优先复用当前作用域已声明的变量、函数、类型和导入，禁止引用未声明标识符或拼错变量名。
- 禁止隐式 `any` 和 `as any`；函数参数、返回值、解构项、事件对象在使前应有明确类型或先完成类型收窄，并清理未使用的变量和导入。
- 所有组件和核心逻辑需添加中文注释说明。

## 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | HomePage | 首页 - 个人简介、技能标签云、AI对话入口 |
| `/about` | AboutPage | 关于我 - 履历、技术栈、兴趣爱好 |
| `/dashboard` | DashboardPage | 行情看板 - 加密货币/美股/A股/贵金属 |
| `/portfolio` | PortfolioPage | 作品集 - 项目展示与详情 |

## API 集成

- **币安公开API**: `https://api.binance.com/api/v3/ticker/24hr`
- 无需 API Key，直接调用公开接口
- 数据每60秒自动刷新
