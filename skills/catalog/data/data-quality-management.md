---
contentStatus: outline
id: data-quality-management
type: composite-skill
title: Data Quality Management
nameZh: 数据质量治理
domain: data
tags: data-quality, great-expectations, data-contract, data-sla, data
catalogSource: internal
catalogFile: skills/data-quality-management.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 5
---

# 数据质量治理

> 以剖析→预期→SLA→事件四步法持续治理数据质量，闭环故障与回放

## 何时使用

- 需要完成「以剖析→预期→SLA→事件四步法持续治理数据质量，闭环故障与回放」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（data-quality、great-expectations、data-contract）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: profile — 
  ↓
步骤 2: expectations — 
  ↓
步骤 3: sla — 
  ↓
步骤 4: score — 
  ↓
步骤 5: runbook — 
  ↓
[输出]
```

### 步骤 1: profile

**目标**：对输入做结构化梳理（profile），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 2（expectations）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 2: expectations

**目标**：执行 expectations，产出该环节的结构化结果供下一步消费。
**输入**：步骤 1（profile）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 3（sla）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 3: sla

**目标**：执行 sla，产出该环节的结构化结果供下一步消费。
**输入**：步骤 2（expectations）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 4（score）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 4: score

**目标**：对上一步产物做客观验证（score），在进入交付前暴露缺陷。
**输入**：步骤 3（sla）的输出。
**输出**：验证结论：通过项、失败项及其复现方式、需要回退修订的清单。供步骤 5（runbook）消费。
**失败处理**：验证不通过时打回产出步骤修订，禁止"先交付再修"；反复不通过则升级评审。

### 步骤 5: runbook

**目标**：执行 runbook，产出该环节的结构化结果供下一步消费。
**输入**：步骤 4（score）的输出。
**输出**：本步骤的结构化结果与关键中间数据。作为工作流最终交付的一部分。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

## 输入参数

- `dataset` (string, **必填**) — 目标数据集/表名
- `criticalColumns` (array, 可选)
- `slaTarget` (object, 可选) — freshness/completeness/accuracy SLA

## 输出

- `profile` (object, 可选)
- `expectations` (array, 可选)
- `qualityScore` (number, 可选)
- `incidentRunbook` (string, 可选)

## 错误处理
策略: `continue`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
