---
id: state-management
type: atomic-skill
title: State Management
nameZh: 前端状态管理
domain: frontend
tags: frontend, state, redux, zustand, react-query
catalogSource: internal
catalogFile: atomic-skills/state-management.json
catalogAddedAt: 2026-07-26
operation: frontend
level: mid
---

# 前端状态管理
> 为复杂 SPA 设计与实现前端状态管理模式。
## 操作语义
- 类型: frontend
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `app` (string, **必填**)
- `framework` (string, 可选) 取值: react/vue/svelte/solid
- `pattern` (string, 可选) 取值: flux/atomic/signal/server-state
## 输出
- `storeShape` (object, 可选)
- `selectors` (array, 可选)
- `sideEffects` (array, 可选)
## 核心要点

前端状态最大的反模式是把 server state 当 client state 管；React Query / SWR 把缓存语义还给数据层之后，全局 store 应该只剩 UI state。

## 关键要点

- 区分 server state / UI state / form state / URL state
- colocate state（最近共享祖先）
- derived state 用 selector 不用 store
- 不可变更新（immer）
- memoization 要看依赖稳定性

## 最佳实践

- server state → React Query / SWR / RTK Query
- UI state → Zustand / Jotai / Context
- form → React Hook Form / Tanstack Form
- URL → 路由参数
- devtools 永远开

## 反模式

- ❌ 把 API 数据塞 Redux 手动同步
- ❌ 一切走全局 store 引发 re-render 风暴
- ❌ useState 链式 setState 嵌套
- ❌ Context 滥用做高频更新

## 分级掌握

- **Junior**: 能用 useState / Context
- **Mid**: 能选型 server vs client state 并落地
- **Senior**: 能驱动复杂应用状态架构与性能优化

## 参考资源

- [TkDodo blog](https://tkdodo.eu/blog/) — article
- [Redux Style Guide](https://redux.js.org/style-guide/) — doc
- [Zustand](https://zustand-demo.pmnd.rs/) — doc

## 相关 Skills
_见所属 composite skill 或 role_