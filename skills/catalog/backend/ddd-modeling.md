---
id: ddd-modeling
type: atomic-skill
title: Domain-Driven Design Modeling
nameZh: DDD 领域建模
domain: backend
tags: backend, ddd, bounded-context, aggregate, domain-model
catalogSource: internal
catalogFile: atomic-skills/ddd-modeling.json
catalogAddedAt: 2026-07-29
operation: backend
level: senior
---

# DDD 领域建模
> 用限界上下文切分复杂业务、用聚合守卫一致性边界，让代码结构与业务语言对齐——以及诚实判断什么时候不该用 DDD。
## 操作语义
- 类型: backend
## 何时使用
- 业务规则复杂且多变（金融/供应链/保险），if-else 与贫血模型已难以维护
- 微服务拆分找不到边界依据，需要限界上下文作为切分标尺
- 多团队对同一名词理解不一致（"订单"在销售/履约/财务眼里是三个东西）
## 何时不使用
- CRUD 为主、规则简单的系统——DDD 的建模成本远超收益，事务脚本 + 好命名足够
- 团队没有领域专家可对话——没有输入的"领域建模"只是自嗨的类图
## 输入参数
- `domainDescription` (string, **必填**) — 业务领域描述与核心流程
- `painPoints` (string, 可选) — 当前模型的痛点（歧义/耦合/规则散落）
## 输出
- `contextMap` (object) — 限界上下文划分与上下文间关系（合作/防腐层/发布语言）
- `aggregateDesign` (object) — 聚合根、实体、值对象与不变量
- `ubiquitousLanguage` (object) — 术语表（代码命名的唯一依据）
## 核心要点

DDD 的精髓是战略设计（限界上下文 + 通用语言），不是战术模式（实体/值对象/仓储）。先切对上下文再谈聚合；只捡战术模式而跳过战略设计，得到的是"有 DDD 词汇的旧架构"。

## 关键要点

- 限界上下文 = 一个模型和一套语言有效的边界：同一个词跨上下文含义不同是正常的，强行统一成"企业级大模型"是经典失败路径
- 上下文映射的关系模式决定集成方式：上游强势用防腐层（ACL）隔离、平等合作用发布语言（published language）、纯消费用遵奉者（conformist）
- 聚合是一致性边界：一个事务只改一个聚合；跨聚合用领域事件最终一致——聚合设计得大，锁冲突和性能问题都会找上门
- 聚合尽量小：默认从"一个实体一个聚合"开始，只有真正的业务不变量（invariant）才把多个实体绑进同一聚合
- 值对象优先：无标识、不可变的概念（金额、地址、区间）建成值对象，消灭一大类共享可变状态 bug
- 通用语言必须落到代码：类名、方法名、事件名与领域专家的用词一字不差，翻译损耗就是 bug 温床
## 最佳实践

- 用事件风暴（Event Storming）工作坊起步：领域专家 + 开发一起从领域事件反推命令、聚合与上下文边界
- 每个上下文写一页术语表并进版本库，评审时对照检查命名
- 领域层保持零框架依赖（纯语言对象），基础设施细节推到边缘（六边形/端口适配器）
- 从核心域开始建模（差异化竞争力所在），支撑域直接买或用 CRUD

## 反模式

- ❌ 贫血模型 + Service 类装所有逻辑，实体退化为字段袋（DDD 词汇齐全但本质是过程式）
- ❌ 一个聚合根挂几十个实体，任何修改都锁整棵树
- ❌ 跨上下文直接共享数据库表，边界名存实亡
- ❌ 给简单 CRUD 系统套满仓储/工厂/规约模式，复杂度自我实现

## 分级掌握

- **Junior**: 能区分实体/值对象，理解聚合与仓储的职责
- **Mid**: 能设计合理大小的聚合与不变量，用领域事件做跨聚合协作
- **Senior**: 能主持事件风暴划分限界上下文，做上下文映射与防腐层决策，并判断何时不用 DDD

## 参考资源

- 《Domain-Driven Design》(Eric Evans, 2003) — book
- 《Implementing Domain-Driven Design》(Vaughn Vernon) — book
- [Martin Fowler — BoundedContext](https://martinfowler.com/bliki/BoundedContext.html) — article
- [Event Storming 官方介绍 (Alberto Brandolini)](https://www.eventstorming.com/) — doc

## 相关 Skills

- [event-driven-architecture](./event-driven-architecture.md) — 跨聚合/跨上下文协作的载体
- [system-design](./system-design.md)
- [architecture-design-fundamentals](./architecture-design-fundamentals.md)
