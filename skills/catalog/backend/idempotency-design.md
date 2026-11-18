---
id: idempotency-design
type: atomic-skill
title: Idempotency Design
nameZh: 幂等性设计
domain: backend
tags: idempotency, api, retry, exactly-once
catalogSource: internal
catalogFile: atomic-skills/idempotency-design.json
catalogAddedAt: 2026-07-26
operation: microservices
level: senior
---

# 幂等性设计
> 设计幂等 API 与消息处理器，使重试安全无副作用。
## 操作语义
- 类型: microservices
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `operation` (string, **必填**)
- `channel` (any, 可选) 取值: http/mq/rpc
- `stateStore` (string, 可选)
## 输出
- `idempotencyKeyStrategy` (string, 可选)
- `storageDesign` (object, 可选)
- `ttl` (string, 可选)
## 核心要点

分布式系统里没有 'exactly once'，只有 'at-least-once + idempotency'，幂等键是核心。

## 关键要点

- 幂等 ≠ 不变：相同输入应得相同结果，但内部状态可以更新（如计数）
- Idempotency-Key 由客户端生成（UUID）通过 header 传递
- 存储幂等记录：key → (status, response, expires_at)，TTL 24-72h 常见
- MQ 消费要么幂等业务，要么用消费记录表去重
- GET/PUT/DELETE 天然幂等，POST 需要业务设计
- 外部支付/转账这类副作用 API 必须强制幂等

## 最佳实践

- 在网关层统一拦截幂等键，业务只关心首次执行
- 幂等键存储用 Redis + 持久化兜底，避免单点丢失
- 返回首次结果而非每次重新计算（response cache）
- 明确幂等窗口期（TTL），过期外的同 key 视为新请求
- 对失败重试也写入记录，避免 'finally' 执行多次

## 反模式

- ❌ 用业务 ID（如订单号）做幂等键，业务层无法重生成
- ❌ TTL 设太短，重试到期失效又执行一次
- ❌ 存了幂等键但不存响应，命中后无法返回原结果
- ❌ MQ 消费重启后从头消费但下游不幂等
- ❌ 依赖数据库唯一索引兜底而不显式设计

## 分级掌握

- **Junior**: 能为单接口实现 idempotency-key + 数据库唯一索引
- **Mid**: 能为支付/转账等关键链路设计完整幂等机制
- **Senior**: 能在异步 + 同步混合系统中跨服务保证幂等与一致性

## 参考资源

- [Designing Idempotent APIs (Stripe)](https://stripe.com/blog/idempotency) — article
- [Idempotency-Key Header (IETF Draft)](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/) — doc
- [Building Reliable Distributed Systems (Klepmann)](https://dataintensive.net/) — book
- [Exactly-Once Semantics (Confluent)](https://www.confluent.io/blog/exactly-once-semantics-are-possible-heres-how-apache-kafka-does-it/) — article
- [Outbox Pattern](https://microservices.io/patterns/data/transactional-outbox.html) — doc

## 相关 Skills
_见所属 composite skill 或 role_