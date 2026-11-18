---
id: message-queue
type: atomic-skill
title: Message Queue
nameZh: 消息队列
domain: backend
tags: backend, kafka, rabbitmq, messaging, async, delivery-semantics
catalogSource: internal
catalogFile: atomic-skills/message-queue.json
catalogAddedAt: 2026-07-29
operation: backend
level: mid
---

# 消息队列
> 用 Kafka/RabbitMQ 等消息中间件解耦生产者与消费者，正确处理投递语义、消费失败与积压，是异步架构的第一块基石。
## 操作语义
- 类型: backend
## 何时使用
- 上下游吞吐不匹配需要削峰填谷（下单洪峰 vs 履约处理能力）
- 一次业务动作要通知多个下游且不希望同步耦合（订单创建 → 库存/积分/通知）
- 任务可异步且允许秒级延迟（邮件、报表、图片处理）
## 何时不使用
- 调用方必须拿到结果才能继续（同步 RPC 更诚实，不要用"发消息再轮询"模拟）
- 单体应用内部的低频任务——进程内任务队列或数据库表足够，引入 MQ 是自增运维负担
## 输入参数
- `scenario` (string, **必填**) — 业务场景与吞吐/延迟要求
- `orderingRequired` (boolean, 可选) — 是否要求分区内有序
- `deliveryGuarantee` (string, 可选) — at-most-once / at-least-once / effectively-once
## 输出
- `brokerChoice` (string) — 选型结论与理由（Kafka/RabbitMQ/云托管）
- `topicDesign` (object) — topic/分区/消费者组/重试与死信设计
- `failureHandling` (string) — 消费失败、重复消息、积压的处理方案
## 核心要点

默认现实是 at-least-once：消息会重复，消费者必须幂等。"exactly-once"在业务层几乎总是靠"at-least-once + 幂等消费"实现，而不是靠中间件魔法。

## 关键要点

- 选型分水岭：Kafka 是可回放的分布式日志（高吞吐、流处理、事件溯源）；RabbitMQ 是智能路由的传统 broker（复杂路由、单条低延迟、任务队列）
- Kafka 只保证分区内有序；需要按业务键有序时用该键做分区键，并接受热点键风险
- 消费者组 rebalance 是 Kafka 最常见的生产事故来源：处理超过 `max.poll.interval.ms` 会被踢出组导致重复消费风暴
- 死信队列（DLQ）不是可选项：无 DLQ 的重试要么丢消息要么无限阻塞队头（poison message）
- 积压（lag）监控是第一告警指标：lag 持续增长 = 消费能力 < 生产速率，扩分区前先确认消费瓶颈在哪
- 消息体存引用不存大对象：>1MB 的负载放对象存储，消息里只放 key（claim check 模式）
## 最佳实践

- 消费逻辑先写幂等（唯一键去重表 / 版本号），再谈其他——参考 [idempotency-design](./idempotency-design.md)
- 重试用指数退避 + 有限次数 + DLQ 三件套；DLQ 配告警与人工重放工具
- schema 用 Avro/Protobuf + schema registry 管理演进，禁止裸 JSON 随意加减字段
- 分区数一开始留余量（分区只能加不能减），但单 broker 分区总数控制在几千以内

## 反模式

- ❌ 把 MQ 当数据库用：靠"消费后查最新状态"传递大状态，而不是传事件
- ❌ 消费者不幂等就上线，靠"应该不会重复"祈祷
- ❌ 无限重试同一条毒消息，阻塞整个分区的后续消息
- ❌ 一个巨型 topic 混装所有业务事件，消费者被迫过滤 90% 不相关消息

## 分级掌握

- **Junior**: 能解释 at-least-once 为什么导致重复、消费者组如何分摊分区
- **Mid**: 能设计含重试/DLQ/幂等的完整消费链路，会排查 lag 与 rebalance 问题
- **Senior**: 能做选型论证与容量规划（分区数/保留期/吞吐），制定跨团队事件契约规范

## 参考资源

- [Kafka 官方文档 — Design 章节](https://kafka.apache.org/documentation/#design) — doc
- [RabbitMQ — Reliability Guide](https://www.rabbitmq.com/docs/reliability) — doc
- [Confluent — Kafka vs RabbitMQ 架构对比](https://www.confluent.io/learn/kafka-vs-rabbitmq/) — article
- 《Designing Data-Intensive Applications》Ch.11 Stream Processing — book

## 相关 Skills

- [idempotency-design](./idempotency-design.md) — 消费端幂等是 MQ 的前置必修
- [event-driven-architecture](./event-driven-architecture.md) — MQ 之上的架构范式
- [circuit-breaker](./circuit-breaker.md)
