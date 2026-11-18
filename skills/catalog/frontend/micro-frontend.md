---
id: micro-frontend
type: atomic-skill
title: Micro Frontend
nameZh: 微前端
domain: frontend
tags: frontend, micro-frontend, module-federation, monorepo
catalogSource: internal
catalogFile: atomic-skills/micro-frontend.json
catalogAddedAt: 2026-07-29
operation: frontend
level: senior
---

# 微前端
> 评估是否需要微前端，并在确需时选择拆分边界、集成方式与共享依赖策略。
## 操作语义
- 类型: frontend
## 何时使用
- 多个团队（≥3）在同一个前端应用上并行开发，发布互相阻塞
- 大型应用需要渐进式技术栈迁移（如 老框架 → React 逐模块替换）
- 组织并购/多产品整合，需要把独立应用组合到统一门户
## 何时不使用
- 单团队项目——monorepo + 良好模块边界能解决 90% 的"想要微前端"的诉求，成本低一个量级
- 只是想"技术上先进"——微前端是组织问题的技术解，没有组织问题就没有收益只有成本
## 输入参数
- `teamTopology` (object, **必填**) — 团队数量、边界与发布节奏
- `constraints` (array, 可选) — 技术栈异构、SEO、性能预算等
## 输出
- `verdict` (string) — 是否采用微前端（含替代方案对比）
- `architecture` (object) — 拆分边界、集成方式、共享依赖与路由方案
- `governance` (array) — 版本、发布、监控的治理约定
## 核心要点

微前端首先是组织架构决策（康威定律），技术选型（如何集成）是第二步——先确认"独立发布"是真需求。

## 关键要点

- 拆分边界按业务域切（垂直切分，一个团队一个域），不要按技术层切（组件库不是微前端）
- 集成方式光谱：构建期（npm 包/monorepo，最简单）→ 运行期（Module Federation 共享运行时）→ 服务端（SSR 组合/edge include）→ iframe（隔离最强、体验最差，慎用）
- Module Federation 的核心价值：运行期加载远程模块 + 共享依赖单例（react 等 singleton），发布解耦但共享库版本需要治理
- 全局路由归壳应用（shell），子应用只管自己的子路由；跨应用通信用 URL/自定义事件/发布订阅，禁止共享可变全局状态
- 样式与全局副作用隔离：CSS 作用域方案 + 规范化全局污染（body class、全局监听器）的申报制度
- 共享依赖是双刃剑：共享省体积但耦合升级节奏，不共享则重复加载——按"框架单例共享、业务库各自带"划线
- 性能账要算总量：N 个子应用各自的运行时、重复依赖、级联加载，没有治理的微前端比单体更慢
## 最佳实践

- 先写"不采用微前端"的论证，推翻不了再上——这是昂贵的单向门决策
- 每个子应用保持可独立运行（standalone 模式），开发调试不依赖整个星系启动
- 契约先行：shell 与子应用之间的加载协议、通信事件、共享依赖版本范围写成文档并做契约测试
- 统一可观测性：错误上报带子应用标识，跨应用用户旅程可追踪

## 反模式

- ❌ 单团队上微前端——为不存在的组织问题支付真实的复杂度成本
- ❌ 子应用间直接 import 内部模块或共享 store，独立发布名存实亡
- ❌ 各子应用自带不同版本的框架运行时且不共享，首屏加载三份 React
- ❌ 用 iframe 集成核心交互流程（弹层、路由、通信全是硬伤）

## 分级掌握

- **Junior**: 理解微前端解决什么问题，能开发遵循契约的子应用
- **Mid**: 能用 Module Federation 落地集成、处理共享依赖与路由治理
- **Senior**: 能做"是否微前端"的架构决策、设计拆分边界与治理体系，并规划回退路线

## 参考资源

- [micro-frontends.org](https://micro-frontends.org/) — doc
- [Module Federation](https://module-federation.io/) — doc
- [Martin Fowler — Micro Frontends](https://martinfowler.com/articles/micro-frontends.html) — article
- [single-spa](https://single-spa.js.org/) — tool

## 相关 Skills

- [frontend-architecture-design](./frontend-architecture-design.md) — 先用单体架构方案对比论证
- [bundler-optimization](./bundler-optimization.md) — 共享依赖与产物治理
