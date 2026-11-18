---
contentStatus: outline
id: data-pipeline-build
type: composite-skill
title: Data Pipeline Build
nameZh: 数据管道构建
domain: data
tags: data-pipeline, etl, elt, lineage, data-engineering
catalogSource: internal
catalogFile: skills/data-pipeline-build.json
catalogAddedAt: 2026-07-26
errorHandling: stop
stepCount: 5
---

# 数据管道构建

> 以契约和血缘为核心搭建生产级数据管道：从源接入、转换、装载到调度、监控与回放

## 何时使用

- 需要完成「以契约和血缘为核心搭建生产级数据管道：从源接入、转换、装载到调度、监控与回放」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（data-pipeline、etl、elt）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: contracts — 
  ↓
步骤 2: etl-design — 
  ↓
步骤 3: dag — 
  ↓
步骤 4: lineage — 
  ↓
步骤 5: monitor — 
  ↓
[输出]
```

### 步骤 1: contracts

**目标**：执行 contracts，产出该环节的结构化结果供下一步消费。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 2（etl-design）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 2: etl-design

**目标**：执行 etl-design，产出该环节的结构化结果供下一步消费。
**输入**：步骤 1（contracts）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 3（dag）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 3: dag

**目标**：执行 dag，产出该环节的结构化结果供下一步消费。
**输入**：步骤 2（etl-design）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 4（lineage）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 4: lineage

**目标**：执行 lineage，产出该环节的结构化结果供下一步消费。
**输入**：步骤 3（dag）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 5（monitor）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 5: monitor

**目标**：建立/执行观测（monitor），让结果状态可量化、异常可发现。
**输入**：步骤 4（lineage）的输出。
**输出**：可持续观测的指标/告警/日志视图，含基线值与异常判定阈值。作为工作流最终交付的一部分。
**失败处理**：指标缺失或噪声过大时先修观测本身，避免基于失真数据做后续判断。

## 输入参数

- `sources` (array, **必填**) — 源系统列表
- `sinks` (array, **必填**)
- `slaMinutes` (integer, 可选) — 端到端时延 SLA
- `engine` (string, 可选) 取值: airflow/dagster/prefect/spark/flink

## 输出

- `dagDefinition` (string, 可选)
- `schemaContracts` (array, 可选)
- `lineageGraph` (object, 可选)
- `monitoringDashboard` (string, 可选)

## 错误处理
策略: `stop`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
