# 个人项目展示网站使用说明

## 项目概述

这是一个使用 React + TypeScript + Tailwind CSS 构建的个人项目展示单页网站。网站包含个人简介、技术栈展示、项目展示、学习历程和未来规划等板块，并支持响应式设计，可在移动端和桌面端良好显示。

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

网站将在 http://localhost:3000 启动。

### 构建生产版本

```bash
pnpm build
```

## 如何修改网站内容

网站的所有内容数据都集中在 `src/pages/Home.tsx` 文件中，您可以通过修改该文件来更新网站内容。

### 1. 修改个人信息

在 `Home.tsx` 文件中找到个人简介相关代码（约314-338行）：

```typescript
<h1 className="text-4xl md:text-5xl font-bold mb-4">张明</h1>
<p className="text-xl md:text-2xl mb-6 text-gray-500 dark:text-gray-400">
  全栈开发工程师 | AI+RPA技术专家
</p>

<div className="flex flex-wrap justify-center gap-3 mb-8">
  {['RPA', '人工智能', '全栈开发', '数据可视化', '自动化测试'].map(tag => (
    <span 
      key={tag} 
      className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
    >
      {tag}
    </span>
  ))}
</div>

<p className="text-lg mb-8 max-w-2xl mx-auto">
  专注于AI与RPA技术的融合应用，致力于开发高效、智能的业务流程自动化解决方案，
  帮助企业提升运营效率，降低人工成本。
</p>
```

您可以修改：
- 姓名（"张明"）
- 职业定位（"全栈开发工程师 | AI+RPA技术专家"）
- 核心技术标签（数组中的各项）
- 个人简介文字内容

### 2. 修改个人照片

在 `Home.tsx` 文件中找到个人照片相关代码（约306-310行）：

```typescript
<img 
  src="https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=professional%20portrait%20of%20a%20smiling%20developer&sign=e722746479f11422e00c56958e5e1981" 
  alt="个人照片" 
  className="w-full h-full object-cover"
/>
```

您可以替换 `src` 属性的值为您自己的照片URL。如果您想使用图片生成服务，可以修改 `prompt` 参数来生成不同风格的照片。

### 3. 修改技术栈数据

在 `Home.tsx` 文件中找到 `SKILLS` 常量定义（约84-100行）：

```typescript
const SKILLS: Skill[] = [
  // RPA技术
  { name: "UiPath", level: 90, category: "rpa" },
  { name: "Automation Anywhere", level: 85, category: "rpa" },
  { name: "Blue Prism", level: 75, category: "rpa" },
  { name: "Selenium", level: 95, category: "rpa" },
  // AI技术
  { name: "机器学习", level: 85, category: "ai" },
  { name: "深度学习", level: 80, category: "ai" },
  { name: "自然语言处理", level: 75, category: "ai" },
  { name: "计算机视觉", level: 70, category: "ai" },
  // 其他技术
  { name: "React", level: 90, category: "other" },
  { name: "TypeScript", level: 85, category: "other" },
  { name: "Python", level: 95, category: "other" },
  { name: "Node.js", level: 80, category: "other" }
];
```

每个技能对象包含三个属性：
- `name`：技术名称
- `level`：掌握程度（0-100）
- `category`：技术类别（"rpa"、"ai" 或 "other"）

您可以添加、删除或修改技能项，系统会自动更新技术栈展示区的内容。

### 4. 修改项目数据

在 `Home.tsx` 文件中找到 `PROJECTS` 常量定义（约45-82行）：

```typescript
const PROJECTS: Project[] = [
  {
    id: 1,
    name: "智能RPA流程自动化平台",
    description: "基于AI的RPA流程自动化平台，支持复杂业务流程的智能识别与自动化执行",
    techStack: ["Python", "Selenium", "TensorFlow", "Flask"],
    category: ["rpa", "ai"],
    repo: "https://github.com/example/rpa-platform",
    achievements: [
      { title: "流程自动化率", value: "85%" },
      { title: "节省工时", value: "1200+小时/月" }
    ]
  },
  // 更多项目...
];
```

每个项目对象包含以下属性：
- `id`：唯一标识符（数字）
- `name`：项目名称
- `description`：项目描述
- `techStack`：技术栈数组
- `category`：项目类别数组（"rpa"、"ai" 或 "other"）
- `repo`（可选）：代码仓库链接
- `link`（可选）：项目演示链接
- `achievements`（可选）：项目成果数组

您可以添加、删除或修改项目项，系统会自动更新项目展示区的内容。

### 5. 修改学习历程

在 `Home.tsx` 文件中找到 `TIMELINE` 常量定义（约102-123行）：

```typescript
const TIMELINE: TimelineItem[] = [
  {
    year: "2021",
    title: "RPA开发工程师",
    description: "系统学习UiPath、Automation Anywhere等主流RPA工具，完成多个企业级自动化项目"
  },
  // 更多时间线项目...
];
```

每个时间线项目包含三个属性：
- `year`：年份或时间段
- `title`：事件标题
- `description`：事件描述

您可以添加、删除或修改时间线项目，系统会自动更新学习历程区的内容。时间线会随着页面滚动逐个浮现，具有动画效果。

### 6. 修改未来规划

在 `Home.tsx` 文件中找到 `PLANS` 常量定义（约125-141行）：

```typescript
const PLANS: Plan[] = [
  {
    period: "short",
    title: "短期规划 (1年内)",
    description: "深化AI与RPA融合技术研究，完成3-5个创新性项目，提升技术影响力"
  },
  // 更多规划项目...
];
```

每个规划项目包含三个属性：
- `period`：规划周期（"short"、"medium" 或 "long"）
- `title`：规划标题
- `description`：规划描述

您可以修改规划内容，系统会自动更新未来规划区的显示。

### 7. 修改网站主题

网站支持浅色/深色主题切换，主题设置保存在本地存储中。您可以在导航栏中点击🌞/🌙图标切换主题。

主题相关逻辑在 `src/hooks/useTheme.ts` 文件中实现。

## 网站结构说明

### 主要组件和文件

1. `src/App.tsx` - 应用入口文件，包含路由配置
2. `src/pages/Home.tsx` - 首页组件，包含所有内容模块
3. `src/hooks/useTheme.ts` - 主题切换钩子
4. `src/lib/utils.ts` - 工具函数

### 页面布局

网站采用单页滚动设计，包含以下主要区域：
1. 导航栏 - 固定在顶部，支持快速跳转到各个区域
2. 个人简介区 - 展示个人基本信息
3. 技术栈展示区 - 以可视化方式展示掌握的技术
4. 项目展示区 - 展示项目卡片，支持按类别筛选
5. 学习历程区 - 时间线形式展示学习和职业发展节点
6. 未来规划区 - 展示短期、中期和长期规划
7. 页脚 - 包含版权信息和社交媒体链接

## 响应式设计说明

网站采用 Tailwind CSS 的响应式类实现多设备适配：
- `sm:` - 小屏幕（≥640px）
- `md:` - 中等屏幕（≥768px）
- `lg:` - 大屏幕（≥1024px）
- `xl:` - 超大屏幕（≥1280px）

在移动设备上，导航栏会自动转换为汉堡菜单，内容布局也会调整以适应小屏幕显示。

## 动画效果说明

网站使用 `framer-motion` 库实现了多种动画效果：
1. 页面滚动时的渐现效果
2. 学习历程时间线的逐个浮现动画
3. 项目卡片的悬停效果
4. 主题切换的平滑过渡

## 自定义样式

如果您想自定义网站样式，可以修改以下内容：

1. **颜色**：在组件中使用 Tailwind CSS 的颜色工具类，如 `bg-blue-500`、`text-gray-800` 等
2. **字体**：字体设置在 `src/index.css` 文件中
3. **布局**：使用 Tailwind CSS 的布局工具类，如 `flex`、`grid`、`container` 等
4. **间距**：使用 Tailwind CSS 的间距工具类，如 `p-4`、`m-6`、`space-x-4` 等

## 常见问题解答

### 如何添加新的项目类别？

1. 在 `PROJECTS` 数据中添加新的类别值
2. 在项目筛选按钮区域（约504-545行）添加对应的筛选按钮

### 如何修改项目卡片的图片？

项目卡片的图片是通过 `space.coze.cn` 的图片生成服务自动生成的，基于项目名称。如果您想使用自定义图片，可以修改 `img` 标签的 `src` 属性（约563行）。

### 如何调整动画效果？

您可以修改 `framer-motion` 相关的代码，调整 `duration`、`delay`、`ease` 等参数来改变动画效果。

## 总结

这个个人项目展示网站设计简洁、结构清晰，所有内容都集中在一个文件中，方便您快速修改和定制。通过按照本说明修改 `src/pages/Home.tsx` 文件中的相关数据，您可以轻松更新网站的文字、图片和其他内容，打造属于自己的个性化项目展示网站。