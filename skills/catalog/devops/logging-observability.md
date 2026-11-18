---
id: logging-observability
type: atomic-skill
title: Logging Observability
nameZh: 日志可观测性
domain: devops
tags: observability, logging, sre, troubleshooting, audit
catalogSource: internal
catalogFile: atomic-skills/logging-observability.json
catalogAddedAt: 2026-07-26
operation: ops
level: mid
---

# 日志可观测性
> 设计结构化日志策略，与指标 / 链路 trace 协同，支撑大规模调试与审计。
## 操作语义
- 类型: ops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `service` (string, **必填**)
- `format` (any, 可选) 取值: json/logfmt 默认: `"json"`
- `retentionDays` (number, 可选) 默认: `30`
## 输出
- `schemaDoc` (string, 可选)
- `ingestionPipeline` (string, 可选)
## 核心要点

日志是事后侦查，指标是实时报警，trace 是因果地图。三者必须共享 trace_id 才能闭环。

## 关键要点

- 结构化日志 (JSON / logfmt) 第一守则
- 统一字段：timestamp, level, service, trace_id, user_id
- log level 控制谨慎（INFO 之上才进入索引）
- 与 OpenTelemetry trace 关联
- 审计日志 vs 应用日志要分开 pipeline

## 最佳实践

- 用 ECS / OTel Logs Data Model 做 schema
- 采样高频路径（debug 级 sampling）
- 冷热分层：近期 ES，长期 S3 + Athena
- 禁止把 PII 写日志，用 hash 或 redact

## 反模式

- ❌ printf 大法满天飞
- ❌ log.info(JSON.stringify(...request))
- ❌ 日志当 metrics 用，靠 grep 算 QPS
- ❌ 没有 retention 策略，磁盘永远 90%

## 分级掌握

- **Junior**: 能写结构化日志，区分 level
- **Mid**: 能设计 schema、与 trace 关联、控制日志量
- **Senior**: 能制定组织级日志治理：合规 / 成本 / 审计

## 参考资源

- [OpenTelemetry Logs Data Model](https://opentelemetry.io/docs/specs/otel/logs/data-model/) — doc
- [Elastic Common Schema (ECS)](https://www.elastic.co/guide/en/ecs/current/index.html) — doc

## 相关 Skills
_见所属 composite skill 或 role_