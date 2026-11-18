---
id: ui-design
type: atomic-skill
title: UI Design
nameZh: UI 设计
domain: design
tags: design, ui, visual, layout, a11y
catalogSource: internal
catalogFile: atomic-skills/ui-design.json
catalogAddedAt: 2026-07-26
operation: design
level: mid
---

# UI 设计
> 视觉界面设计：布局 / 字体 / 配色 / 组件 / 可访问性。
## 操作语义
- 类型: design
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `scope` (string, **必填**)
- `platform` (string, 可选) 取值: web/ios/android/desktop
- `designSystem` (string, 可选)
## 输出
- `mockups` (array, 可选)
- `tokens` (object, 可选)
- `a11yReport` (object, 可选)
## 核心要点

UI 设计 80% 是约束游戏：栅格、间距、字阶、色阶、组件状态——把这五件事钉死，剩下 20% 是品牌与情感。

## 关键要点

- 8pt grid + 4pt baseline
- type scale 用模度系数（1.125 / 1.25）
- 色阶要看对比度而非主观
- state 完整性：default/hover/active/focus/disabled
- token > 直接写 hex

## 最佳实践

- Figma 变量 / token 对接 design system
- 组件先建状态矩阵再画
- a11y 用 Stark / Contrast 插件做 lint
- 与前端共享 token 文件

## 反模式

- ❌ "差不多就行" 的 4px / 6px 混用
- ❌ 颜色靠美感不查对比度
- ❌ 只画 default 不画 disabled
- ❌ 同一组件多版本散落

## 分级掌握

- **Junior**: 能复用组件画页面
- **Mid**: 能建 token 与状态矩阵
- **Senior**: 能驱动 design system 与 a11y baseline

## 参考资源

- [Refactoring UI](https://www.refactoringui.com/) — book
- [Material 3](https://m3.material.io/) — doc
- [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/) — doc

## 相关 Skills
_见所属 composite skill 或 role_