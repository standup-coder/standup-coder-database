---
id: frontend-architecture
type: composite-skill
title: Frontend Architecture
nameZh: 前端架构
domain: frontend
tags: frontend, architecture, components
catalogSource: internal
catalogFile: skills/frontend-architecture.json
catalogAddedAt: 2026-07-26
stepCount: 3
level: senior
contentStatus: reviewed
---

# 前端架构

> 为"接下来一年的变更"设计前端结构:约束梳理 → 关键决策(ADR) → 落地为机器可检查的约定

## 何时使用

- 新项目启动或大版本重构前——现在的架构决策决定未来两个季度的变更成本
- 团队从 1-2 人扩到 3 人以上并行开发,"改一处崩另一处"的耦合开始可见
- 存量代码出现"没人敢动的模块",需要重建边界与依赖规则

## 何时不使用

- 一次性活动页/原型——直接写,架构规范在这个规模是纯开销
- 只是想换框架/追新范式——先问"现有架构具体阻塞了什么变更",答不出就不动

## 工作流

```
[输入: 业务上下文 + 团队现状 + 技术约束]
  ↓
步骤 1: analyze-requirements — 画变化频率地图,梳理硬约束
  ↓
步骤 2: design-components — 做关键决策(渲染/状态/分层/边界),逐项落 ADR
  ↓
步骤 3: write-components — 约定文档化 + 脚手架 + CI 边界检查
  ↓
[输出: 架构文档 + ADR 集合 + 机器可检查的依赖规则]
```

### 步骤 1: analyze-requirements

**目标**:画出"变化频率地图"并对齐硬约束——架构的粒度必须跟着变化频率走,而不是跟着抽象美感走。逐项澄清:哪些模块每周变(业务页面)、哪些每季度变(设计系统/公共组件)、哪些基本不变(构建/部署/基础库);同时收集硬约束(SEO 与首屏指标、浏览器/端兼容、团队技能分布、运维能力、既有系统对接)。
**输入**:产品路线图、现有代码结构、团队规模与并行度、业务方对性能/SEO 的硬指标。
**输出**:约束清单(逐条可追溯到来源)+ 变化频率地图(高变/中变/稳定三层),供步骤 2 的每个决策引用。
**失败处理**:需求方说不清变化频率时,用近 3 个月的 git/迭代记录反推,禁止凭"感觉会变"设计扩展点;硬约束与业务目标冲突时上报裁决,禁止自行降级。

### 步骤 2: design-components

**目标**:在四个维度上做出关键决策,每个决策记录 ADR(背景/候选方案/取舍/结论):① 渲染策略——SPA/SSR/SSG/islands 按页面特性选择,允许混合而非全局一刀切;② 状态分型——server state(缓存与一致性问题,交给 React Query/SWR 类工具)与 client state(UI 状态,useState/轻量 store)分开治理,不要用一个全局 store 打天下;③ 组件分层——设计系统原子层 / 业务组件层 / 页面层,依赖方向严格单向;④ 模块边界——按步骤 1 的变化频率地图切分,高变与稳定区之间只允许经过显式接口。
**输入**:步骤 1 的约束清单与变化频率地图。
**输出**:ADR 集合(每个关键决策一篇)+ 架构决策总览表(决策/理由/影响范围/复核时间)。
**失败处理**:两个方案都可行时选更无聊、生态更成熟的(boring technology);决策依赖"未来可能需要"时降级为 YAGNI 并记入 ADR 的复核触发条件;出现无法调和的分叉(如多团队并行度)时评估 micro-frontend 而非强统一。

### 步骤 3: write-components

**目标**:把决策落成"不需要自觉"的机制——目录结构与命名规范写成文档和脚手架模板;用 ESLint(import 规则/no-restricted-paths)与 dependency-cruiser 把层间依赖方向固化为 CI 检查;组件 API 约定(受控/非受控、复合组件、Props 类型设计)对齐 component-design 与 typescript-advanced 的规范;存量迁移用绞杀者模式按模块渐进,禁止大爆炸重写。
**输入**:步骤 2 的 ADR 集合与决策总览。
**输出**:架构文档(新人一天能上手)、脚手架/模板、CI 边界检查配置、迁移路线图。
**失败处理**:CI 边界检查报出大量存量违例时,用基线文件冻结存量、只拦增量,禁止一次性"修完再上";规范落地两周内被频繁绕过时,回到步骤 2 复核决策是否符合实际,而不是加码执行。

## 输入参数

- `business_context`(**必填**)— 产品路线图与变化频率估计
- `team_profile`(可选)— 团队规模、技能分布、并行度
- `hard_constraints`(可选)— SEO/性能硬指标、兼容性、既有系统

## 输出

- 约束清单 + 变化频率地图(步骤 1)
- ADR 集合与架构决策总览表(步骤 2)
- 架构文档 + 脚手架 + CI 边界检查 + 迁移路线图(步骤 3)

## 学习要点

- 架构的产出不是图,是三个问题的答案:变更发生在哪、谁能并行、什么不允许做
- 匹配组织与变化频率的架构优于理论最优架构——过度设计是负资产,Conway 定律站在组织那边
- 边界必须机器可检查:靠 code review 自觉守卫的边界,三个月后必然失守

## 相关 Skills

- [component-design](./component-design.md) — 步骤 2 组件分层与 Props API 约定
- [state-management](./state-management.md) — 步骤 2 server/client 状态分型
- [css-architecture](./css-architecture.md) — 样式层架构与设计系统约束
- [micro-frontend](./micro-frontend.md) — 多团队并行时的边界方案选项
- [ssr-hydration](./ssr-hydration.md) — 渲染策略选型的原理底座
- [typescript-advanced](./typescript-advanced.md) — 步骤 3 类型层约定与边界类型
