# DESIGN.md

## Design Tokens

### 色彩
- 主色：清爽蓝紫渐变（#4c6ef5 → #7c3aed），传达专业、现代、可信赖
- 辅助色：紫色系（#b84dff），用于点缀和强调
- 背景：浅蓝白渐变（#f8faff → #f0f4ff → #f5f0ff），营造清爽通透感
- 卡片：白色玻璃态（rgba(255,255,255,0.7) + backdrop-blur），轻盈不沉闷

### 字体
- 字体族：Inter + Noto Sans SC（中英文搭配）
- 标题：Inter Bold，正文：Inter Regular / Noto Sans SC Regular
- 字号层级：H1 4xl → H2 3xl → H3 2xl → body base → caption sm

### 圆角
- 卡片：2xl（16px）
- 按钮：xl（12px）
- 标签/徽章：full（9999px）
- 头像：3xl（24px）

### 阴影
- 卡片默认：border border-gray-100
- 卡片悬浮：shadow-2xl shadow-primary-200/20
- 导航栏：shadow-lg shadow-primary-100/20

### 动效
- 缓动曲线：cubic-bezier(0.4, 0, 0.2, 1)
- 卡片悬浮：translateY(-4px) + shadow 增强
- 页面元素：fade-in + slide-up 交错入场
- 按钮：scale(1.05) hover + scale(0.95) tap

## 设计禁忌
- 不使用纯黑背景或高饱和度色彩
- 不使用尖锐直角（最小圆角 8px）
- 不使用过多颜色（限制在蓝紫主色系内）
- 不使用过于复杂的渐变（保持双色渐变）
