---
id: circuit-breaker
type: atomic-skill
title: Circuit Breaker
nameZh: 熔断器
domain: backend
tags: resilience, circuit-breaker, retry, timeout
catalogSource: internal
catalogFile: atomic-skills/circuit-breaker.json
catalogAddedAt: 2026-07-26
operation: microservices
level: mid
---

# 熔断器
> 运用熔断、重试与超时模式，防止级联故障与雪崩。
## 操作语义
- 类型: microservices
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `service` (string, **必填**)
- `downstreamSLA` (object, 可选)
- `trafficPattern` (string, 可选)
## 输出
- `breakerConfig` (object, 可选)
- `retryPolicy` (object, 可选)
- `fallbackStrategy` (string, 可选)
## 核心要点

熔断不是为了让你重试更多次，而是为了在依赖坏掉时快速失败、保护自己与下游。

## 关键要点

- 三态：Closed → Open → Half-Open，触发条件基于错误率/慢调用率
- 超时是熔断的前提：没有超时，熔断永远等不到信号
- 重试需配指数退避 + jitter，避免重试风暴
- 幂等性是重试的前置条件，否则会双扣/双发
- 区分快速失败（fallback）与降级（degrade），二者业务含义不同
- Bulkhead 隔离：不同依赖用独立线程池/连接池

## 最佳实践

- 为每个外部依赖单独配熔断 + 超时，禁用全局兜底
- fallback 返回静态/缓存/简化结果，不要再调另一个不可靠依赖
- 把熔断状态、重试次数暴露为指标，纳入告警
- 用 chaos engineering 定期验证熔断真的会触发
- 失败后写明确日志：哪个依赖、哪个调用、哪个 fallback

## 反模式

- ❌ 无超时的同步 RPC，下游慢死自己
- ❌ 无界重试 + 无退避，制造重试雪崩
- ❌ 对非幂等操作做重试，导致重复副作用
- ❌ 熔断阈值靠拍脑袋，没基于历史数据
- ❌ fallback 路径未测试，故障时才发现也是坏的

## 分级掌握

- **Junior**: 理解三态与重试基础，能用 SDK 配置基本参数
- **Mid**: 能为业务调出合理阈值、设计 fallback 与隔离
- **Senior**: 能在跨服务调用图谱上设计韧性策略，并用故障演练验证

## 参考资源

- [Release It! (Michael Nygard)](https://pragprog.com/titles/mnee2/release-it-second-edition/) — book
- [Resilience4j](https://resilience4j.readme.io/) — tool
- [Circuit Breaker (Martin Fowler)](https://martinfowler.com/bliki/CircuitBreaker.html) — article
- [Hystrix Wiki](https://github.com/Netflix/Hystrix/wiki) — doc
- [Exponential Backoff and Jitter (AWS)](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/) — article

## 相关 Skills
_见所属 composite skill 或 role_