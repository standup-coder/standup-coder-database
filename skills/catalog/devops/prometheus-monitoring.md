---
id: prometheus-monitoring
type: atomic-skill
title: Prometheus Monitoring
nameZh: Prometheus 监控
domain: devops
tags: observability, prometheus, metrics, monitoring, sre
catalogSource: internal
catalogFile: atomic-skills/prometheus-monitoring.json
catalogAddedAt: 2026-07-26
operation: ops
level: mid
---

# Prometheus 监控
> 为应用埋设 Prometheus 指标，编写 PromQL，配置抓取任务与告警规则。
## 操作语义
- 类型: ops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `service` (string, **必填**)
- `metricsPort` (number, 可选) 默认: `9090`
- `slo` (object, 可选) — SLO 配置（target / window）
## 输出
- `metricsExposed` (array, 可选)
- `scrapeConfig` (string, 可选)
- `alertRules` (array, 可选)
## 核心要点

Prometheus 的杀手是高基数：一个 user_id 标签能让你的存储一夜爆炸。

## 关键要点

- 四类指标：Counter / Gauge / Histogram / Summary
- Histogram 默认配置 bucket，不要全用默认
- label 严控：user_id / request_id 永远不上 label
- PromQL 的 rate() 必须用 Counter，不要用 Gauge
- recording rules 预聚合常用查询，降 query 成本

## 最佳实践

- 遵循 USE / RED 法则建立指标
- 用 Prometheus Operator 管理 K8s 内部
- AlertManager 路由按团队 + severity 分发
- 远端存储（Thanos / Mimir）做长期保留

## 反模式

- ❌ 把 traceID 当 label 用，基数爆炸
- ❌ rate() 应用在 Gauge 上得到错误结果
- ❌ 只监控基础设施不监控业务路径
- ❌ AlertManager 不分级，告警雪片飞

## 分级掌握

- **Junior**: 能埋点 Counter / Gauge 并写简单 PromQL
- **Mid**: 能设计 Histogram / SLO / 告警规则
- **Senior**: 能搭建组织级监控平台，含远端存储与告警治理

## 参考资源

- [Prometheus Best Practices](https://prometheus.io/docs/practices/naming/) — doc
- [PromLabs PromQL guide](https://promlabs.com/promql-cheat-sheet/) — article
- [Prometheus Operator](https://prometheus-operator.dev/) — doc

## 相关 Skills
_见所属 composite skill 或 role_