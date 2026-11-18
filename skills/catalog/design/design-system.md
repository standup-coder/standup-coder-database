---
id: design-system
type: atomic-skill
title: Design System
nameZh: 设计系统
domain: design
tags: design, design-system, tokens, components, frontend
catalogSource: internal
catalogFile: atomic-skills/design-system.json
catalogAddedAt: 2026-07-26
operation: design
level: senior
---

# 设计系统
> 搭建覆盖 token / 组件 / 模式 / 文档的设计系统，规模化保证产品一致体验。
## 操作语义
- 类型: design
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `scope` (any, **必填**) 取值: tokens/components/patterns/full
- `platforms` (array, 可选)
- `themingMode` (any, 可选) 取值: light/dark/multi-brand 默认: `"light"`
## 输出
- `tokensJson` (object, 可选)
- `componentLibrary` (string, 可选)
- `docsUrl` (string, 可选)
## 核心要点

设计系统的难点不在画组件，而在让 100 个产品团队都愿意用、用对、用得久。

## 关键要点

- Token 是设计与代码的桥梁
- 组件 API 设计 = 半个开源项目
- 版本化 + Changelog 不可少
- 文档（Storybook / Zeroheight）质量决定采纳率
- 配套治理：贡献流程、review、deprecation

## 最佳实践

- Style Dictionary / Tokens Studio 跨平台输出
- Storybook + a11y addon
- 组件库走 SemVer + Changesets
- 建立 Adoption Dashboard 跟踪覆盖率

## 反模式

- ❌ 先做组件再补 token
- ❌ 一夜推翻全量重做，团队跟不上
- ❌ 组件 API 跟随单业务需求频繁变化
- ❌ 只发布不维护、文档过时

## 分级掌握

- **Junior**: 能基于已有 DS 开发新组件
- **Mid**: 能设计 token 体系、组件 API、文档化
- **Senior**: 能驱动跨产品 DS 治理与采纳

## 参考资源

- [Brad Frost: Atomic Design](https://atomicdesign.bradfrost.com/) — book
- [Style Dictionary](https://amzn.github.io/style-dictionary/) — doc
- [Storybook Design System](https://storybook.js.org/tutorials/design-systems-for-developers/) — doc

## 相关 Skills
_见所属 composite skill 或 role_