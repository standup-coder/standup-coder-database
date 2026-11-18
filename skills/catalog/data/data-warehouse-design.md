---
contentStatus: outline
id: data-warehouse-design
type: composite-skill
title: Data Warehouse Design
nameZh: 数据仓库建模
domain: data
tags: data-warehouse, dimensional-modeling, metrics-layer, kimball, data
catalogSource: internal
catalogFile: skills/data-warehouse-design.json
catalogAddedAt: 2026-07-26
errorHandling: stop
stepCount: 6
---

# 数据仓库建模

> 按 ODS/DWD/DWS/ADS 分层与维度建模理论设计数据仓库，并落地指标层与一致性维度

## 何时使用

- 需要完成「按 ODS/DWD/DWS/ADS 分层与维度建模理论设计数据仓库，并落地指标层与一致性维度」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（data-warehouse、dimensional-modeling、metrics-layer）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: process-matrix — 
  ↓
步骤 2: grain — 
  ↓
步骤 3: dimensions — 
  ↓
步骤 4: facts — 
  ↓
步骤 5: metrics — 
  ↓
步骤 6: ddl — 
  ↓
[输出]
```

### 步骤 1: process-matrix

**目标**：执行 process-matrix，产出该环节的结构化结果供下一步消费。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 2（grain）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 2: grain

**目标**：执行 grain，产出该环节的结构化结果供下一步消费。
**输入**：步骤 1（process-matrix）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 3（dimensions）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 3: dimensions

**目标**：执行 dimensions，产出该环节的结构化结果供下一步消费。
**输入**：步骤 2（grain）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 4（facts）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 4: facts

**目标**：执行 facts，产出该环节的结构化结果供下一步消费。
**输入**：步骤 3（dimensions）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 5（metrics）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 5: metrics

**目标**：执行 metrics，产出该环节的结构化结果供下一步消费。
**输入**：步骤 4（facts）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 6（ddl）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 6: ddl

**目标**：执行 ddl，产出该环节的结构化结果供下一步消费。
**输入**：步骤 5（metrics）的输出。
**输出**：本步骤的结构化结果与关键中间数据。作为工作流最终交付的一部分。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

## 输入参数

- `businessProcesses` (array, **必填**)
- `engine` (string, **必填**) 取值: snowflake/bigquery/redshift/doris/starrocks/hive
- `metricsCatalog` (array, 可选)

## 输出

- `layerModel` (object, 可选)
- `factTables` (array, 可选)
- `dimensionTables` (array, 可选)
- `metricsLayer` (object, 可选)
- `ddl` (string, 可选)

## 错误处理
策略: `stop`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
