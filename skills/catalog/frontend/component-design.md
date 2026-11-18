---
id: component-design
type: atomic-skill
title: Component Design
nameZh: 组件设计
domain: frontend
tags: frontend, component, design-system, a11y, ui
catalogSource: internal
catalogFile: atomic-skills/component-design.json
catalogAddedAt: 2026-07-26
operation: frontend
level: mid
---

# 组件设计
> 设计可复用、可访问、可组合的 UI 组件，明确 API 边界、状态归属与样式策略。
## 操作语义
- 类型: frontend
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `componentName` (string, **必填**)
- `purpose` (string, **必填**) — 组件解决的问题
- `variants` (array, 可选)
- `stateOwnership` (any, 可选) 取值: controlled/uncontrolled/hybrid
- `a11yLevel` (any, 可选) 取值: AA/AAA 默认: `"AA"`
## 输出
- `componentCode` (string, 可选)
- `propsApi` (string, 可选)
- `stories` (string, 可选) — Storybook 用例
- `tests` (string, 可选)
- `a11yReport` (string, 可选)
## 核心要点

好组件 = 单一职责 + 清晰 props + 无副作用 + 可访问 + 可组合。

## 关键要点

- 单一职责：一个组件只解决一个 UI 问题；功能聚合到容器层而非展示层
- 受控 vs 非受控：默认非受控，必要时升级为受控；不要二者并存
- Props 设计：布尔标志 < 5 个，多于则用枚举或 slot；避免 `mode='special-edit-with-...'` 这种字符串黑魔法
- 组合优于配置：用 `Card.Header / Card.Body` slot 模式而非 `<Card hasHeader headerProps={...}>`
- 样式策略一致：CSS Variable / token 驱动主题，不要硬编码颜色
- 无障碍：键盘可达 + 焦点环 + ARIA 角色 + 颜色对比度 > 4.5:1
- 性能：受控组件用 React.memo + useMemo/useCallback；列表用虚拟滚动

## 最佳实践

- API-first：先写 README + 用法示例再写实现，倒逼接口清晰
- 用 Storybook 覆盖所有 variant + state（hover/focus/disabled/loading/error）
- 做视觉回归（Chromatic / Loki），防止样式回退
- 用 axe-core / pa11y 做无障碍 CI 检查
- 分离 headless（行为）+ skin（样式）层，参考 Radix UI / Headless UI

## 反模式

- ❌ 一个组件 30+ props 还在涨
- ❌ 在组件内部 fetch 数据，破坏纯展示性
- ❌ state 同时受控也被内部修改，行为不可预测
- ❌ 用 div + onClick 模拟 button，丢失键盘和无障碍
- ❌ 通过 className 注入业务样式，破坏组件封装

## 分级掌握

- **Junior**: 能在 design system 内实现常见组件，遵循既有 props 规范
- **Mid**: 能设计中等复杂度组件 API、覆盖 a11y 与全状态用例
- **Senior**: 能主导 design system / 组件库架构，建立 API 设计原则与治理流程

## 参考资源

- [Refactoring UI (Adam Wathan)](https://www.refactoringui.com/) — book
- [Radix UI Primitives](https://www.radix-ui.com/) — tool
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) — doc
- [Storybook Docs](https://storybook.js.org/docs) — doc
- [Inclusive Components (Heydon Pickering)](https://inclusive-components.design/) — book

## 相关 Skills
_见所属 composite skill 或 role_