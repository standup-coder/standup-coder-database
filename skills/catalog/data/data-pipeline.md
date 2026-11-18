---
id: data-pipeline
type: atomic-skill
title: Data Pipeline
nameZh: 数据管道
domain: data
tags: data, pipeline, etl, streaming, orchestration
catalogSource: internal
catalogFile: atomic-skills/data-pipeline.json
catalogAddedAt: 2026-07-26
operation: data
level: mid
---

# 数据管道
> 构建批 / 流式数据管道，覆盖采集 / 转换 / 装载，保证可靠性、幂等性与可观测性。
## 操作语义
- 类型: data
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `source` (object, **必填**) — 数据来源（DB / Kafka / API / file）
- `sink` (object, **必填**) — 数据去向（Warehouse / Lake / Topic）
- `mode` (any, 可选) 取值: batch/stream/micro-batch 默认: `"batch"`
- `schedule` (string, 可选) — cron 表达式或事件触发
## 输出
- `dagId` (string, 可选)
- `latencyMs` (number, 可选)
- `rowsProcessed` (number, 可选)
## 核心要点

数据管道的本质是契约：上游变 schema、下游消费方式变，都要管道在中间稳住。

## 关键要点

- 幂等性：同一 batch 重跑结果一致
- exactly-once 难度极高，多数场景 at-least-once + 去重更现实
- 关注 backfill 能力
- late-arriving event 用 watermark + window 处理
- pipeline 必须可观测：lag / throughput / failure rate

## 最佳实践

- Airflow / Dagster / Prefect 任选其一统一编排
- 把转换逻辑放进 dbt / Spark SQL，便于复用与版本化
- 为关键 pipeline 设 SLA 与告警
- 上下游 data contract

## 反模式

- ❌ cron 触发但下游消费侧未就绪
- ❌ 把 pipeline 当一次性脚本，无幂等
- ❌ schema 漂移无监控，下游静默失败
- ❌ 没有 backfill 机制，历史修复难

## 分级掌握

- **Junior**: 能写单条 ETL 任务并定时跑
- **Mid**: 能设计幂等 / backfill / 监控告警
- **Senior**: 能搭组织级 pipeline 平台，覆盖批流统一与 data contract

## 参考资源

- [Designing Data-Intensive Applications](https://dataintensive.net/) — book
- [Airflow docs](https://airflow.apache.org/docs/) — doc
- [dbt docs](https://docs.getdbt.com/) — doc

## 相关 Skills
_见所属 composite skill 或 role_