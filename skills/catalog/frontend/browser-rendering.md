---
id: browser-rendering
type: atomic-skill
title: Browser Rendering Principles
nameZh: 浏览器渲染原理
domain: frontend
tags: frontend, rendering, reflow, compositing, event-loop
catalogSource: internal
catalogFile: atomic-skills/browser-rendering.json
catalogAddedAt: 2026-07-29
operation: frontend
level: mid
---

# 浏览器渲染原理
> 理解从 HTML/CSS/JS 到像素的渲染管线与事件循环，用于归因卡顿、掉帧与布局抖动问题。
## 操作语义
- 类型: frontend
## 何时使用
- 页面滚动/动画掉帧、输入延迟，需要从渲染管线层面归因
- 代码评审时判断某段 DOM/样式操作是否会触发强制同步布局
- 性能审计发现主线程繁忙，需要理解"浏览器在忙什么"
## 何时不使用
- 瓶颈已确认在网络传输或后端——渲染原理帮不上，先看瀑布图
## 输入参数
- `symptom` (string, **必填**) — 现象描述（掉帧/卡顿/闪烁/抖动）
- `trace` (object, 可选) — Performance 面板录制的 trace
## 输出
- `pipelineStage` (string) — 瓶颈所在管线阶段（style/layout/paint/composite）
- `rootCause` (string) — 根因与触发代码定位
- `fixStrategy` (string) — 修复策略（批量读写/提升合成层/任务拆分等）
## 核心要点

渲染管线五阶段 JS → Style → Layout → Paint → Composite：优化的核心是让改动尽量落在靠后的阶段。

## 关键要点

- 触发成本排序：改 transform/opacity（仅 Composite）≪ 改颜色（Paint 起）≪ 改宽高/位置（Layout 起全链路）
- 强制同步布局（layout thrashing）：写样式后立即读布局属性（offsetHeight 等）会强制浏览器提前算 layout，循环里读写交替是重灾区
- 事件循环与帧预算：60fps 下每帧约 16.7ms，长任务（>50ms）会阻塞输入响应——这是 INP 差的直接原因
- 合成层（compositing layer）：will-change/transform3d 可把元素提升到独立层跳过重绘，但层爆炸会耗尽显存
- requestAnimationFrame 在每帧渲染前执行，适合视觉更新；数据计算放 requestIdleCallback 或 worker
- 渲染阻塞资源：head 中的同步 CSS/JS 会推迟首帧，defer/async/media 条件加载是标准解法
## 最佳实践

- 动画只用 transform 与 opacity；需要动画高度时改用 transform: scaleY 或 FLIP 技巧
- 批量 DOM 操作：先读后写分两批，或用 DocumentFragment/一次性 class 切换
- 用 Performance 面板的紫色（Layout）/绿色（Paint）块定位管线瓶颈，而非猜测
- content-visibility: auto 跳过屏外内容渲染，长列表首选虚拟滚动

## 反模式

- ❌ 在滚动/resize 处理器里同步读布局属性且不节流
- ❌ 给大量元素加 will-change "以防万一"——常驻合成层白耗内存
- ❌ 用 setInterval 驱动动画（与帧不同步，必然抖动）
- ❌ 用 JS 动画库实现纯 CSS 能做的过渡，把合成器能干的活拉回主线程

## 分级掌握

- **Junior**: 能说清渲染管线五阶段与 transform/width 改动的成本差异
- **Mid**: 能用 Performance 面板定位 layout thrashing 与长任务并修复
- **Senior**: 能设计规避渲染瓶颈的架构（虚拟化、worker 分流、合成层策略）并制定团队规范

## 参考资源

- [Inside look at modern web browser (Chrome)](https://developer.chrome.com/blog/inside-browser-part1) — article
- [web.dev — Rendering performance](https://web.dev/articles/rendering-performance) — doc
- [CSS Triggers 思想: 哪些属性触发哪些阶段](https://web.dev/articles/animations-guide) — doc
- [Jake Archibald: In The Loop (事件循环)](https://www.youtube.com/watch?v=cCOL7MC4Pl0) — video

## 相关 Skills

- [web-performance-audit](./web-performance-audit.md) — 用指标发现问题，用本技能归因
- [component-design](./component-design.md)
