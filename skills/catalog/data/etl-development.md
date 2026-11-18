---
id: etl-development
type: atomic-skill
title: ETL Development
nameZh: ETL 开发
domain: data
tags: data, etl, pipeline, integration, warehouse
catalogSource: internal
catalogFile: atomic-skills/etl-development.json
catalogAddedAt: 2026-07-26
operation: data
level: mid
---

# ETL 开发
> 实现从源系统到分析存储的 ETL 流程，覆盖质量 / 血缘 / SLA。
## 操作语义
- 类型: data
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `source` (object, **必填**)
- `target` (object, **必填**)
- `pattern` (any, 可选) 取值: etl/elt/cdc 默认: `"elt"`
- `sla` (object, 可选)
## 输出
- `jobId` (string, 可选)
- `rowsLoaded` (number, 可选)
- `lineage` (object, 可选)
## 核心要点

ETL 已经让位 ELT：把转换放到仓库内做，复用算力又简化 pipeline。

## 关键要点

- ELT > ETL（让仓库的算力替你跑 transform）
- CDC（Debezium / Fivetran）替代周期性 dump
- idempotent + 幂等键是修复脏数据的前提
- 血缘（OpenLineage）让审计与回滚成为可能
- late-arriving data 用 watermark 与 reprocess 处理

## 最佳实践

- dbt 做 transform 层，版本化 SQL
- Airflow / Dagster 编排作业
- 每条作业绑定 SLA 与告警
- 上游 schema 变更走 contract 审核

## 反模式

- ❌ 手写 cron 跑 SQL，无 retry / 无幂等
- ❌ 转换逻辑散落在 ETL 工具与 BI 报表两层
- ❌ 把脏数据直接 DELETE，事故无法复盘
- ❌ CDC 不做去重，下游消费幂等失败

## 分级掌握

- **Junior**: 能写单条 ETL 任务并定时跑
- **Mid**: 能设计 ELT / CDC、SLA、血缘
- **Senior**: 能在组织层推 data contract / lineage 闭环

## 参考资源

- [dbt docs](https://docs.getdbt.com/) — doc
- [Debezium](https://debezium.io/documentation/) — doc
- [OpenLineage](https://openlineage.io/) — doc

## 相关 Skills
_见所属 composite skill 或 role_