---
contentStatus: outline
id: customer-onboarding
type: composite-skill
title: Customer Onboarding
nameZh: 客户上手流程
domain: product
tags: customer-success, onboarding, ttv, playbook, growth
catalogSource: internal
catalogFile: skills/customer-onboarding.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 6
---

# 客户上手流程

> 围绕 Time-to-Value 设计并落地客户上手旅程：分段 → 旅程图 → 自动化 → 健康分 → 复盘

## 何时使用

- 需要完成「围绕 Time-to-Value 设计并落地客户上手旅程：分段 → 旅程图 → 自动化 → 健康分 → 复盘」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（customer-success、onboarding、ttv）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: segment — 
  ↓
步骤 2: journey — 
  ↓
步骤 3: playbook — 
  ↓
步骤 4: automation — 
  ↓
步骤 5: health — 
  ↓
步骤 6: qbr — 
  ↓
[输出]
```

### 步骤 1: segment

**目标**：对输入做结构化梳理（segment），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 2（journey）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 2: journey

**目标**：执行 journey，产出该环节的结构化结果供下一步消费。
**输入**：步骤 1（segment）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 3（playbook）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 3: playbook

**目标**：执行 playbook，产出该环节的结构化结果供下一步消费。
**输入**：步骤 2（journey）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 4（automation）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 4: automation

**目标**：执行 automation，产出该环节的结构化结果供下一步消费。
**输入**：步骤 3（playbook）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 5（health）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 5: health

**目标**：执行 health，产出该环节的结构化结果供下一步消费。
**输入**：步骤 4（automation）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 6（qbr）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 6: qbr

**目标**：执行 qbr，产出该环节的结构化结果供下一步消费。
**输入**：步骤 5（health）的输出。
**输出**：本步骤的结构化结果与关键中间数据。作为工作流最终交付的一部分。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

## 输入参数

- `segment` (string, **必填**) 取值: self-serve/smb/mid-market/enterprise
- `ttvTargetDays` (integer, **必填**)
- `productSurface` (array, 可选)
- `successCriteria` (array, 可选)

## 输出

- `journeyMap` (object, 可选)
- `playbook` (string, 可选)
- `automationFlows` (array, 可选)
- `healthScoreModel` (object, 可选)
- `qbrTemplate` (string, 可选)

## 错误处理
策略: `continue`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
