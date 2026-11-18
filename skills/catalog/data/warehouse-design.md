---
id: warehouse-design
type: atomic-skill
title: Data Warehouse Design
nameZh: 数据仓库设计
domain: data
tags: data, warehouse, kimball, modeling, olap
catalogSource: internal
catalogFile: atomic-skills/warehouse-design.json
catalogAddedAt: 2026-07-26
operation: data
level: senior
---

# 数据仓库设计
> 基于 Kimball 维度建模或 Data Vault 设计分层数仓（ODS/DWD/DWS/ADS），输出星型 / 雪花 schema 与命名规范。
## 操作语义
- 类型: data
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `businessDomain` (string, **必填**) — 业务域（订单 / 用户 / 财务 ...）
- `pattern` (any, 可选) 取值: star/snowflake/data-vault/one-big-table 默认: `"star"`
- `sourceSystems` (array, 可选)
- `slaFreshnessHours` (number, 可选) 默认: `24`
## 输出
- `factTables` (array, 可选)
- `dimensionTables` (array, 可选)
- `layerMapping` (object, 可选)
- `namingConvention` (string, 可选)
## 核心要点

数仓设计的核心不是表多漂亮，而是粒度稳定、口径统一、可追溯。

## 关键要点

- 粒度先行，事实表的 grain 决定一切
- 维度建模 vs Data Vault 各有适用
- ODS/DWD/DWS/ADS 分层职责清晰
- SCD Type 2 处理历史变化
- 命名规范是治理的开始

## 最佳实践

- 每张事实表写明 grain 描述
- 为每个指标建立口径文档
- 使用 dbt 管理血缘与测试
- 冷热分层降存储成本

## 反模式

- ❌ 一张大宽表打天下
- ❌ 事实表混合多种 grain
- ❌ 维度表频繁删旧记录
- ❌ 没有命名规范，下游靠猜

## 分级掌握

- **Junior**: 能按既有规范建表
- **Mid**: 能主导域建模、SCD 设计、命名规范
- **Senior**: 能设计企业级分层数仓、治理体系与成本策略

## 参考资源

- [Kimball Group: Dimensional Modeling Techniques](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/) — doc
- [dbt 文档](https://docs.getdbt.com/) — doc

## 相关 Skills
_见所属 composite skill 或 role_