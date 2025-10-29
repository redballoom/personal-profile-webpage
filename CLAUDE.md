# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

- 使用中文回复用户
- 读取 README.md 文件，辅助我修改网页
- 我的gitee远程代码仓库地址：git@gitee.com:redballoon/personal-profile-webpage.git
- 我的github远程代码仓库地址：git@github.com:redballoom/personal-profile-webpage.git
- 每次项目push前向我询问是否继续

## 项目概述

这是一个个人项目展示网站，使用 React + TypeScript + Tailwind CSS 构建。网站为单页应用，展示个人简介、技术栈、项目作品、学习历程和未来规划。

## 核心开发命令

### 开发环境
```bash
pnpm install          # 安装依赖
pnpm dev              # 启动开发服务器（运行在 localhost:3000）
pnpm dev:client       # 同上，更明确的命令
```

### 构建部署
```bash
pnpm build            # 完整构建（清理 dist 目录 + 构建客户端）
pnpm build:client     # 仅构建客户端到 dist/static
```

## 项目架构

### 技术栈
- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS + PostCSS
- **路由**: React Router v7
- **动画**: Framer Motion
- **图标**: Lucide React
- **图表**: Recharts
- **状态管理**: React Context (AuthContext)
- **工具库**: clsx, tailwind-merge, zod

### 目录结构
```
src/
├── App.tsx              # 应用入口，路由配置
├── main.tsx             # React 渲染入口
├── pages/               # 页面组件
│   └── Home.tsx         # 主页（包含所有内容数据）
├── components/          # 可复用组件
├── contexts/            # React Context
│   └── authContext.ts   # 认证上下文
├── hooks/               # 自定义 Hooks
│   └── useTheme.ts      # 主题切换 Hook
├── lib/                 # 工具函数
│   └── utils.ts         # 通用工具函数
└── index.css            # 全局样式
```

### 核心数据结构

网站主要内容数据集中在 `src/pages/Home.tsx` 中：

1. **PROJECTS**: 项目数组，包含 id、name、description、techStack、category、repo、link、achievements
2. **SKILLS**: 技能数组，包含 name、level、category（分为 "rpa"、"ai"、"other" 三类）
3. **TIMELINE**: 学习历程数组，包含 year、title、description
4. **PLANS**: 未来规划数组，按 period（"short"、"medium"、"long"）分类

### 关键特性

1. **响应式设计**: 使用 Tailwind 响应式类适配移动端和桌面端
2. **主题切换**: 支持浅色/深色主题，设置保存在 localStorage
3. **动画效果**: 使用 Framer Motion 实现滚动渐现、悬停效果等
4. **项目筛选**: 支持按类别筛选项目展示
5. **图片生成**: 项目卡片图片通过 space.coze.cn API 自动生成

## 内容修改指南

所有网站内容都集中在 `src/pages/Home.tsx` 文件中修改：

- **个人信息**: 修改姓名、职业定位、技术标签、个人简介（约 314-338 行）
- **个人照片**: 修改 img 标签的 src 属性（约 306-310 行）
- **项目数据**: 修改 PROJECTS 常量（约 45-82 行）
- **技能数据**: 修改 SKILLS 常量（约 84-100 行）
- **学习历程**: 修改 TIMELINE 常量（约 102-123 行）
- **未来规划**: 修改 PLANS 常量（约 125-141 行）

## 构建配置

- Vite 配置文件为 `vite.config.ts`，包含 React 插件和路径别名支持
- TypeScript 配置文件为 `tsconfig.json`
- Tailwind CSS 配置文件为 `tailwind.config.js`
- PostCSS 配置文件为 `postcss.config.js`

