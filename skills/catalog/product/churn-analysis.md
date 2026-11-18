---
contentStatus: outline
id: churn-analysis
type: composite-skill
title: Churn Analysis
nameZh: 客户流失分析
domain: product
tags: churn, retention, cohort, customer-success, analytics
catalogSource: internal
catalogFile: skills/churn-analysis.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 5
---

# 客户流失分析

> 量化流失驱动因素并产出优先级化的留存动作计划：定义 → 队列 → 模型 → 干预 → 复盘

## 何时使用

- 需要完成「量化流失驱动因素并产出优先级化的留存动作计划：定义 → 队列 → 模型 → 干预 → 复盘」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（churn、retention、cohort）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: define — 
  ↓
步骤 2: cohort — 
  ↓
步骤 3: drivers — 
  ↓
步骤 4: intervention — 
  ↓
步骤 5: impact — 
  ↓
[输出]
```

### 步骤 1: define

**目标**：基于上一步的结论产出本环节交付物（define），关键取舍当场记录决策理由。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：本步骤的核心产物（文档/配置/代码草案），含决策记录与未决问题清单。供步骤 2（cohort）消费。
**失败处理**：出现两难取舍时记录 ADR 式决策而非留空；产物无法满足上游约束时回退上一步修订结论。

### 步骤 2: cohort

**目标**：执行 cohort，产出该环节的结构化结果供下一步消费。
**输入**：步骤 1（define）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 3（drivers）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 3: drivers

**目标**：执行 drivers，产出该环节的结构化结果供下一步消费。
**输入**：步骤 2（cohort）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 4（intervention）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 4: intervention

**目标**：执行 intervention，产出该环节的结构化结果供下一步消费。
**输入**：步骤 3（drivers）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 5（impact）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 5: impact

**目标**：执行 impact，产出该环节的结构化结果供下一步消费。
**输入**：步骤 4（intervention）的输出。
**输出**：本步骤的结构化结果与关键中间数据。作为工作流最终交付的一部分。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

## 输入参数

- `churnDefinition` (string, **必填**) — 流失业务定义（订阅取消/连续 30 天不活跃等）
- `lookbackDays` (integer, 可选)
- `segments` (array, 可选)

## 输出

- `churnRate` (object, 可选)
- `cohortMatrix` (object, 可选)
- `driverModel` (object, 可选)
- `interventionPlan` (array, 可选)
- `expectedImpact` (object, 可选)

## 错误处理
策略: `continue`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
