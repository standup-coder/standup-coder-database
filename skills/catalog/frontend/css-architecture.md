---
id: css-architecture
type: atomic-skill
title: CSS Architecture
nameZh: CSS 架构
domain: frontend
tags: frontend, css, design-tokens, tailwind, css-modules
catalogSource: internal
catalogFile: atomic-skills/css-architecture.json
catalogAddedAt: 2026-07-29
operation: frontend
level: mid
---

# CSS 架构
> 为中大型项目选择并落地可扩展的样式组织方案：作用域策略、design token 与层级治理。
## 操作语义
- 类型: frontend
## 何时使用
- 新项目技术选型：在 CSS Modules / Tailwind / CSS-in-JS / 原生分层间做决策
- 存量样式失控：改一处坏三处、!important 蔓延、无人敢删 CSS
- 设计系统落地：需要把设计稿的颜色/间距/字号收敛为 token
## 何时不使用
- 单页 landing page 或活动页——直接写就行，架构是规模问题的解法
## 输入参数
- `projectScale` (string, **必填**) — 团队人数与页面量级
- `constraints` (array, 可选) — SSR、RSC、多主题、多品牌等约束
- `existingStack` (string, 可选) — 存量方案（迁移场景）
## 输出
- `decision` (object) — 方案选型与理由（含放弃项的原因）
- `tokenSpec` (object) — design token 分层定义
- `conventions` (array) — 团队约定（命名、目录、逃生舱规则）
## 核心要点

CSS 架构解决的是三个规模化问题：作用域隔离（谁影响谁）、值的一致性（token）、层叠优先级治理（谁覆盖谁）。

## 关键要点

- 作用域方案对比：CSS Modules（构建期哈希、零运行时）、Tailwind（原子类、样式即约束）、CSS-in-JS（动态能力强但有运行时成本，RSC 下受限）、原生 @scope/嵌套（新项目可行性上升）
- Design token 分三层：原始值（--blue-500）→ 语义（--color-primary）→ 组件（--button-bg），业务代码只允许消费语义层及以上
- 层叠治理用 @layer 显式声明优先级顺序（reset < base < components < utilities），比选择器权重竞赛可控
- 主题切换的正解是"换 token 值"而不是"换 class 树"：语义层 token + data-theme 属性切换
- Tailwind 的本质是把 design token 编译成原子类——它替你解决了 token 与命名，但语义抽象要靠组件层补
- 逃生舱要设计而非放任：inline style / arbitrary value 何时允许，写进规范
## 最佳实践

- 组件样式与组件文件同置（colocation），删组件时样式一起死，避免 CSS 只增不减
- token 定义单一来源（如 tokens.css / tailwind config），设计与代码同步靠工具（Style Dictionary）而非人肉
- 用 stylelint 约束禁用项（裸色值、magic number、!important），规范进 CI 才是规范
- 迁移存量项目按"新代码新方案 + 旧代码只删不改"推进，避免大爆炸重写

## 反模式

- ❌ 全局 CSS + 深层后代选择器建模，形成"样式考古"现场
- ❌ 业务代码直接写裸色值/像素值，绕过 token——多主题与改版时全线爆炸
- ❌ 用 !important 解决优先级冲突，冲突只会升级
- ❌ 混用三套方案（Modules + Tailwind + styled-components）且无边界约定

## 分级掌握

- **Junior**: 能在既定方案下规范写样式，理解作用域与 token 消费规则
- **Mid**: 能落地 token 分层与 @layer 治理，用 lint 固化约定
- **Senior**: 能为多品牌/多主题产品设计 token 体系与迁移路线，主导跨团队样式方案选型

## 参考资源

- [CSS @layer (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) — doc
- [Design Tokens W3C 社区规范](https://design-tokens.github.io/community-group/format/) — doc
- [Tailwind CSS — Theme](https://tailwindcss.com/docs/theme) — doc
- [Style Dictionary](https://styledictionary.com/) — tool

## 相关 Skills

- [component-design](./component-design.md) — 组件层是语义抽象的载体
- [accessibility-audit](./accessibility-audit.md) — 焦点/状态样式的可访问性约束
