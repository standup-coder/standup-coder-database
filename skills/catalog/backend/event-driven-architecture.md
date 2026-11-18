---
id: event-driven-architecture
type: atomic-skill
title: Event-Driven Architecture
nameZh: 事件驱动架构
domain: backend
tags: backend, event-driven, cqrs, event-sourcing, outbox, eventual-consistency
catalogSource: internal
catalogFile: atomic-skills/event-driven-architecture.json
catalogAddedAt: 2026-07-29
operation: backend
level: senior
---

# 事件驱动架构
> 用事件解耦服务并达成跨服务最终一致：区分事件与命令、用 outbox 保证可靠发布、诚实评估 CQRS/事件溯源的适用边界。
## 操作语义
- 类型: backend
## 何时使用
- 一个业务事实要驱动多个下游反应，且下游数量还在增长（新增消费者不改生产者）
- 跨服务数据一致性无法用单库事务解决，需要 saga/最终一致方案
- 需要完整审计轨迹或按时间回放业务状态（事件溯源的核心卖点）
## 何时不使用
- 调用方需要立即知道结果的请求-响应场景——硬改成事件会造成"异步等待地狱"
- 小团队小系统：事件驱动的调试成本（分布式因果链）远高于同步调用，别为架构美感买单
## 输入参数
- `businessFlow` (string, **必填**) — 业务流程与参与服务
- `consistencyWindow` (string, 可选) — 可接受的最终一致时间窗口
## 输出
- `eventDesign` (object) — 事件命名、载荷、版本策略（事件 vs 命令区分）
- `reliabilityPlan` (string) — outbox/幂等/重放的可靠性方案
- `sagaDesign` (object) — 跨服务流程的编排/协同与补偿动作
## 核心要点

事件是"已发生的事实"（OrderPlaced），命令是"要求做某事"(ShipOrder)：事件的生产者不关心谁消费，命令有明确的接收者与预期。混淆两者会把解耦架构悄悄退化成"用 MQ 传输的 RPC"。

## 关键要点

- 双写问题是 EDA 第一陷阱：先写库再发消息，任何一步失败都造成状态与事件不一致——标准解法是 outbox 模式（事件与业务数据同一本地事务落库，中继进程再发布）
- 消费者幂等是硬前提：at-least-once 投递 + 重放需求，意味着每个消费者都要能安全处理重复事件
- saga 两种风格：编排（orchestration，中心协调器发命令）易观测、易改流程；协同（choreography，服务间互相监听）更解耦但因果链难追踪——超过 3 步的流程倾向编排
- 每个 saga 步骤都要设计补偿动作（cancel/refund），"最终一致"的另一面是"中间态可见"，业务与产品必须知情
- CQRS 只在读写模型差异巨大时才值得：读侧物化视图从事件流投影而来，代价是投影延迟与重建复杂度
- 事件溯源（Event Sourcing）是重型决策：获得完整审计与时间回溯，付出快照管理、事件版本迁移、团队心智转换的成本——大多数系统用"状态存储 + 领域事件"的轻量组合即可
## 最佳实践

- 事件命名用过去时（OrderPlaced 而非 PlaceOrder），载荷带 eventId/occurredAt/version，事实数据自包含（消费者不必回查）
- 用 schema registry 管理事件版本，新字段向后兼容，破坏性变更发新事件类型
- 为每条业务流建"因果链追踪"：correlationId 贯穿所有事件与日志，否则线上排障靠猜
- 定期演练事件重放与消费者重建，确保"可回放"不只是理论能力

## 反模式

- ❌ 事件里只放 id，消费者集体回查生产者 API——把解耦做成了更脆的耦合
- ❌ 用事件传递命令语义（"XxxRequested"满天飞），生产者实际在等某个特定消费者干活
- ❌ 没有 outbox，靠"先发消息再写库 + 祈祷"
- ❌ 全系统一步到位事件溯源，半年后团队淹死在事件版本迁移里

## 分级掌握

- **Junior**: 能区分事件与命令，理解最终一致与中间态
- **Mid**: 能实现 outbox + 幂等消费，设计带补偿的 saga 流程
- **Senior**: 能做 EDA vs 同步架构的选型论证，制定事件契约治理与 CQRS/ES 采用边界

## 参考资源

- [microservices.io — Saga / Transactional Outbox 模式](https://microservices.io/patterns/data/saga.html) — doc
- [Martin Fowler — Event-Driven 的四种含义](https://martinfowler.com/articles/201701-event-driven.html) — article
- [Martin Fowler — Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) — article
- 《Enterprise Integration Patterns》(Hohpe & Woolf) — book

## 相关 Skills

- [message-queue](./message-queue.md) — 事件的传输载体
- [idempotency-design](./idempotency-design.md) — 消费端硬前提
- [ddd-modeling](./ddd-modeling.md) — 领域事件从建模中来
