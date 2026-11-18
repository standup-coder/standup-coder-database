---
id: distributed-tracing
type: atomic-skill
title: Distributed Tracing
nameZh: 分布式追踪
domain: devops
tags: observability, tracing, opentelemetry, performance
catalogSource: internal
catalogFile: atomic-skills/distributed-tracing.json
catalogAddedAt: 2026-07-26
operation: observability
level: mid
---

# 分布式追踪
> 用 OpenTelemetry 在跨服务与异步边界采集与分析分布式追踪。
## 操作语义
- 类型: observability
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `stack` (array, **必填**)
- `backend` (any, 可选) 取值: jaeger/tempo/zipkin/datadog
- `samplingRate` (number, 可选)
## 输出
- `instrumentationPlan` (object, 可选)
- `samplingStrategy` (object, 可选)
- `queryPatterns` (array, 可选)
## 核心要点

Tracing 让分布式延迟与错误从'摸黑'变'看清'，OpenTelemetry 是事实标准。

## 关键要点

- Trace = 一组 Span，Span 代表一个工作单元，含 trace_id / span_id / parent_id
- 上下文传播（context propagation）是核心：HTTP header / MQ message / async context
- 采样策略：head-based（入口决定）vs tail-based（看到错误再保存）
- Span 关键字段：service.name / operation.name / status.code / attributes
- Trace 与 Logs / Metrics 关联（通过 trace_id），形成可观测三件套
- 不要把 PII 直接写进 attributes，需脱敏

## 最佳实践

- 用 OpenTelemetry SDK 自动 instrument 主流框架，少写手工代码
- 异步任务（MQ / 协程）显式传 trace context
- tail-based sampling 优先保留错误与慢调用
- 为每个服务定义关键 span 命名约定，便于跨团队聚合
- 把 trace_id 写到日志，从日志可以一键跳到 trace 详情

## 反模式

- ❌ Span 颗粒度过细（每个函数一个），存储爆炸
- ❌ 上下文不透传，trace 在异步处断裂
- ❌ 采样率 100% 上线，存储吃不消
- ❌ 把整个 request body 写进 attribute
- ❌ 只看单个 trace，不做聚合分析（latency 分布、错误率）

## 分级掌握

- **Junior**: 能接入 OTel 自动 instrument 并查看 trace UI
- **Mid**: 能设计采样策略、跨异步边界传 context、做 trace+log 关联
- **Senior**: 能在大规模、多语言、多 region 系统中治理可观测体系成本与可用性

## 参考资源

- [OpenTelemetry Docs](https://opentelemetry.io/docs/) — doc
- [Distributed Tracing in Practice (O'Reilly)](https://www.oreilly.com/library/view/distributed-tracing-in/9781492056621/) — book
- [Dapper (Google)](https://research.google/pubs/dapper-a-large-scale-distributed-systems-tracing-infrastructure/) — article
- [Grafana Tempo](https://grafana.com/oss/tempo/) — tool
- [Tail Sampling (OTel)](https://opentelemetry.io/docs/collector/configuration/#tail-sampling) — doc

## 相关 Skills
_见所属 composite skill 或 role_