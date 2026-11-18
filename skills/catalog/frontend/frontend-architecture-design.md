---
id: frontend-architecture-design
type: atomic-skill
title: Frontend Architecture Design
nameZh: 前端架构设计
domain: frontend
tags: frontend, architecture, spa, ssr, module-federation
catalogSource: internal
catalogFile: atomic-skills/frontend-architecture-design.json
catalogAddedAt: 2026-07-26
operation: frontend
level: senior
---

# 前端架构设计
> 为前端项目设计涵盖渲染策略、状态管理、路由、构建与团队协作扩展性的整体架构。
## 操作语义
- 类型: frontend
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `appType` (any, **必填**) 取值: spa/ssr/ssg/hybrid/mpa — 应用形态
- `scale` (any, 可选) 取值: small/medium/large/monorepo
- `teamSize` (number, 可选)
- `seoCritical` (boolean, 可选)
- `stack` (array, 可选)
## 输出
- `renderingStrategy` (string, 可选)
- `stateLayer` (string, 可选)
- `routingStrategy` (string, 可选)
- `buildSetup` (string, 可选)
- `moduleStructure` (string, 可选)
- `performanceBudget` (object, 可选)
## 核心要点

前端架构的核心矛盾是"开发体验 × 用户体验 × 团队协作"，要按业务规模分阶段选型。

## 关键要点

- 渲染策略：CSR 简单但首屏差；SSR 首屏好但服务器开销大；SSG 性能极好但内容静态；ISR/PPR 折中
- 状态管理分级：local state → context → 全局（Redux/Zustand/Jotai）→ 服务端状态（TanStack Query/SWR）
- 路由架构：file-based（Next/Nuxt）vs config-based；嵌套布局与 layout group 是关键
- 代码分割粒度：route-level + component-level + 第三方库，配 dynamic import
- 组件分层：UI 原子 → 业务组件 → 页面 → 布局；禁止跨层引用
- Monorepo 分包策略：apps/* + packages/*，工具如 Turborepo / Nx
- 可观测性：Web Vitals、错误监控（Sentry）、用户行为埋点

## 最佳实践

- 建立 Performance Budget（JS bundle < 200KB gzip、LCP < 2.5s）写进 CI
- 用 module-federation / monorepo 解耦多团队协作
- css 隔离方案选定（CSS Modules / Tailwind / CSS-in-JS）并坚持
- 服务端状态与客户端状态分离，避免把 fetch 数据塞到全局 store
- 采用 type-safe routing + 自动生成的 API client（tRPC / GraphQL Codegen）

## 反模式

- ❌ 全局 store 装一切：服务端缓存数据、UI 状态、路由参数都塞进 Redux
- ❌ 每个页面都 SSR，即使没 SEO 需求，徒增服务器成本
- ❌ 状态层选型跟风：业务很小却上 Redux Toolkit + Saga + Reselect 全套
- ❌ 未做 bundle 分析，第三方库占 60% 体积无人察觉
- ❌ 组件库从零自研但人力不足，半成品拖累产品

## 分级掌握

- **Junior**: 能在框架内按规范开发页面，理解组件分层与基础状态管理
- **Mid**: 能主导中型前端项目架构选型、性能预算、CI 防护
- **Senior**: 能设计大型 / 多团队前端架构，建立公司级前端基础设施与规范

## 参考资源

- [Patterns.dev (Lydia Hallie)](https://www.patterns.dev/) — doc
- [Next.js Documentation](https://nextjs.org/docs) — doc
- [Building Micro-Frontends (Luca Mezzalira)](https://www.oreilly.com/library/view/building-micro-frontends/9781492082989/) — book
- [Web Vitals](https://web.dev/vitals/) — doc
- [TanStack Query](https://tanstack.com/query) — tool

## 相关 Skills
_见所属 composite skill 或 role_