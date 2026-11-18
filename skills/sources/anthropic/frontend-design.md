---
source: anthropic-skills
sourceUrl: https://github.com/anthropics/skills/tree/main/skills/frontend-design
title: frontend-design
name: frontend-design
nameZh: 前端设计（frontend-design）
category: 创意与设计（example-skills 插件）
tags: [frontend, design, ui, typography, palette, aesthetic, web]
rank: 7
plugin: example-skills
license: Apache 2.0
hasReferences: false
references: []
---

# frontend-design

> Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.

## 概述

`frontend-design` 在构建新 UI 或重塑既有 UI 时，提供有辨识度、有意图的视觉设计指导。它的核心姿态是：把自己当成一家小工作室的设计负责人，以给每个客户做出不会被认错成别人的视觉识别为荣——这位客户已经拒绝过模板化的提案，正在为独到的观点付费。

## 使用场景

- 构建新 UI 或重做既有 UI 时，需要审美方向、字体、调色板指导。
- 想避开"AI 生成感"的默认外观（templated defaults）。
- 需要针对具体 brief 做出可论证的、有主张的设计选择。

## 能力说明

### 把它落到主题上

如果 brief 没钉死产品/主题是什么，先自己钉死：命名一个具体主题、它的受众、这一页的唯一任务，并说明你的选择。记忆里关于这个人的偏好、他们在做什么、你之前做过的设计——都拿来当线索。主题自身的世界（材料、器具、artifact、行话）才是独到选择的来源。全程用 brief 的真实内容和主题来构建。

### 设计原则

- **Hero 是论点**：用主题世界里最具特征的东西开场——标题、图片、动画、live demo、交互时刻。一个大数字 + 小标签 + 支撑数据 + 渐变 accent 是模板答案，只在真是最佳时才用。
- **字体承载个性**：刻意配对 display 和 body 字体，不要用任何项目都会抓的同一套；设清晰字阶，有意图地用字重、字宽、字距。让字体处理本身成为难忘的部分，而不是中性内容载体。
- **结构即信息**：结构装置、编号、eyebrow、分隔线、标签应编码关于内容的真实信息，而不是装饰。编号标记（01 / 02 / 03）只在内容真是序列时才合适。
- **刻意用动效**：page-load 序列、scroll-triggered reveal、hover 微交互、环境氛围。一个精心编排的时刻通常比散落的效果更有力。有时少即是多。
- **匹配复杂度到愿景**：极繁方向需要繁复执行；极简方向需要在间距、字体、细节上的精度。优雅是把选定的愿景执行好。
- **慎重对待文案**：brief 没给真实内容时得自己写。文案能让设计显得和设计本身一样模板化。

### 流程：brainstorm, explore, plan, critique, build, critique again

**校准参考**：当前 AI 生成的设计主要聚集在三种长相——
1. 暖米色背景（接近 #F4F1EA）+ 高对比衬线 display + 赤陶 accent；
2. 近黑背景 + 单一亮酸性绿或朱红 accent；
3. broadsheet 风布局 + 发丝规 + 零圆角 + 密集报纸式栏。

这三种对某些 brief 合法，但它们是默认值而非选择，且不分主题地出现。Brief 钉死视觉方向时就严格照办——brief 自己的话永远赢，包括它要求这三种之一时。Brief 留出自由度时，别把自由度花在这三种默认上。

## 参考资源

无独立 references 子目录。

## 原文链接

- 仓库路径：https://github.com/anthropics/skills/tree/main/skills/frontend-design
- SKILL.md 原文：https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md
