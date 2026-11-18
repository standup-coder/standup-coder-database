---
id: data-quality
type: atomic-skill
title: Data Quality Check
nameZh: 数据质量检查
domain: data
tags: data, quality, pipeline, governance, observability
catalogSource: internal
catalogFile: atomic-skills/data-quality.json
catalogAddedAt: 2026-07-26
operation: data
level: mid
---

# 数据质量检查
> 在数据集上执行完整性 / 准确性 / 一致性 / 时效性 / 唯一性 / 合法性六维度检查，输出违规报告与建议。
## 操作语义
- 类型: data
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `dataset` (string, **必填**) — 数据集 ID 或路径（table / file / view）
- `rules` (array, 可选) — 质量规则列表（声明式）
- `level` (any, 可选) 取值: error/warn — 违规处理级别 默认: `"error"`
## 输出
- `passed` (boolean, 可选)
- `totalRows` (number, 可选)
- `violations` (array, 可选)
- `summaryByDimension` (object, 可选)
## 核心要点

数据质量决定下游一切决策的可信度：六维度（完整 / 准确 / 一致 / 时效 / 唯一 / 合法）缺一不可。

## 关键要点

- 六维度量化指标
- pipeline 关键节点 quality gate
- bad data 进 quarantine 而非丢弃
- 与 lineage 联动定位起源
- SLO 化数据质量

## 最佳实践

- Great Expectations / Soda / dbt tests 声明式校验
- 上游 data contract
- freshness 监控独立通道
- 质量指标进业务 dashboard

## 反模式

- ❌ 只在最终报表层校验
- ❌ null rate 99% 仍发布
- ❌ 坏数据直接 DELETE 无回溯
- ❌ 质量规则散落无 owner

## 分级掌握

- **Junior**: 能写基础规则识别异常
- **Mid**: 能搭 quality gate 与 quarantine
- **Senior**: 能在组织层推 data contract 与 SLO 化数据质量

## 参考资源

- [Great Expectations](https://docs.greatexpectations.io/) — doc
- [dbt tests](https://docs.getdbt.com/docs/build/tests) — doc

## 相关 Skills
_见所属 composite skill 或 role_