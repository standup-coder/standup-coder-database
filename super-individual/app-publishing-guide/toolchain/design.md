---
title: 设计工具指南
category: super-individual
lastUpdated: 2026年05月
aiGenerated: false
---

# 设计工具指南

## 设计工具对比

| 工具 | 费用 | 平台 | 特点 | 推荐度 |
|------|------|------|------|--------|
| Figma | 免费个人版 | Web/桌面 | 协作强、组件化 | ⭐⭐⭐⭐⭐ |
| Sketch | $99/人/年 | Mac | 生态丰富 | ⭐⭐⭐⭐ |
| Adobe XD | 免费 | 跨平台 | 功能全 | ⭐⭐⭐ |
| Canva | 免费/付费 | Web | 模板多、快 | ⭐⭐⭐ |
| Affinity Designer | $54.99 | Mac/Win | 矢量强 | ⭐⭐⭐⭐ |

## Figma（强烈推荐）

### 为什么选 Figma

```bash
# 1. 免费个人版够用
#    - 最多 3 个项目
#    - 无限协作者
#    - 云端存储

# 2. 跨平台
#    - Web 浏览器直接用
#    - Mac/Windows 客户端
#    - 不需要 Mac（这是相对 Sketch 的巨大优势）

# 3. 协作功能强
#    - 实时预览
#    - 评论功能
#    - 版本历史
```

### Figma 入门步骤

#### 第一步：注册账号

```bash
# 1. 访问 https://figma.com
# 2. 点击 "Sign up"
# 3. 使用邮箱或 Google 账号注册
# 4. 选择 "Free tier"（个人版）
# 5. 填写基本信息
```

#### 第二步：创建第一个项目

```bash
# 1. 点击 "New Project"
# 2. 命名项目（如 "MyApp Design"）
# 3. 点击 "New File" 创建设计文件
```

#### 第三步：熟悉界面

```bash
# 主要区域：
# 1. 顶部工具栏：选择、框架、钢笔、文本等工具
# 2. 左侧面板：图层列表、页面管理
# 3. 中间画布：设计区域
# 4. 右侧面板：属性、样式、导出
```

#### 第四步：创建 App 界面

```bash
# 1. 创建 Frame（画框）
#    - 按 F 键或点击工具栏
#    - 选择 iPhone 尺寸

# 2. iPhone 常用尺寸：
#    - iPhone 14 Pro：393 x 852
#    - iPhone 14：390 x 844
#    - iPhone SE：375 x 667

# 3. 使用组件
#    - 右侧搜索 "iOS" 或 "Material"
#    - 拖拽按钮、输入框等
```

#### 第五步：导出资源

```bash
# 1. 选中要导出的元素
# 2. 右侧面板点击 "Export"
# 3. 选择格式：
#    - PNG：图标、按钮
#    - SVG：矢量图
#    - JPG：照片
# 4. 选择倍率：1x / 2x / 3x
```

### Figma App 设计模板

```bash
# Figma 社区有大量免费模板：
# 1. 访问 https://figma.com/community
# 2. 搜索 "iOS app design"
# 3. 选择喜欢的模板
# 4. 点击 "Duplicate" 复制到你的账户
# 5. 修改颜色和文字
```

### 超级个体使用建议

```bash
# 1. 使用免费模板起步
#    - 不用从零开始设计
#    - 社区有大量 App UI 套件

# 2. 利用现成组件
#    - Figma 内置 iOS 组件库
#    - 社区组件库

# 3. 移动端预览
#    - 下载 Figma App（iOS/Android）
#    - 扫码预览设计稿
```

## 图标资源

### 免费图标库

| 库 | 地址 | 图标数 | 风格 |
|---|------|--------|------|
| Heroicons | heroicons.com | 250+ | 线性、简约 |
| Lucide | lucide.dev | 1000+ | 线性、清晰 |
| Phosphor | phosphor.io | 1000+ | 多种风格 |
| Iconify | iconify.design | 150000+ | 超全汇总 |
| Flaticon | flaticon.com | 百万+ | 多样 |

### Iconify 使用方法

```bash
# 1. 访问 https://iconify.design/
# 2. 搜索你需要的图标（如 "home"）
# 3. 选择风格（outline/filled/bold）
# 4. 复制代码或下载 PNG/SVG

# 支持格式：
# - SVG（代码）
# - PNG（多尺寸）
# - React/Vue 组件
```

### App 图标生成

```bash
# 推荐工具：App Icon Generator（Mac App Store 免费）

# 或使用在线工具：
# https://appicon.co/
# https://icon.kitchen/

# 输入一张 1024x1024 图标
# 自动生成所有尺寸
```

## 设计规范参考

### iOS 设计规范

```bash
# Apple 官方设计指南：
# https://developer.apple.com/design/

# 关键要点：
# - 使用 SF Symbols（系统图标）
# - 遵循 Human Interface Guidelines
# - 颜色使用系统色或辅助色
# - 字体使用 SF Pro（系统字体）
```

### Material Design（Android）

```bash
# Google 官方设计指南：
# https://m3.material.io/

# 关键要点：
# - 使用 Material Symbols
# - 遵循 Material Design 3
# - 组件有明确规格
```

## 配色工具

### 配色方案生成

```bash
# 1. Coolors：https://coolors.co/
#    - 空格键生成随机配色
#    - 可锁定颜色微调

# 2. Adobe Color：https://color.adobe.com/
#    - 支持色彩提取
#    - 多种色彩规则（互补、类比等）

# 3. uiverse.io：https://uiverse.io/buttons
#    - CSS 按钮代码
```

### 品牌色生成

```bash
# 如果你没有品牌色：
# 1. 访问 https://coolors.co/
# 2. 按空格键随机生成
# 3. 选一个主色
# 4. 生成辅助色

# 建议：
# - 主色：品牌色（1个）
# - 辅助色：2-3个
# - 中性色：灰/黑色
# - 强调色：1个（用于 CTA）
```
