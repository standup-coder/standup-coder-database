---
contentStatus: outline
id: user-research-process
type: composite-skill
title: User Research Process
nameZh: 用户研究流程
domain: design
tags: user-research, ux, interview, survey, insight
catalogSource: internal
catalogFile: skills/user-research-process.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 5
---

# 用户研究流程

> 以决策为导向运作一次完整的用户研究：目标对齐 → 招募 → 访谈/问卷 → 编码分析 → 洞察输出

## 何时使用

- 需要完成「以决策为导向运作一次完整的用户研究：目标对齐 → 招募 → 访谈/问卷 → 编码分析 → 洞察输出」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（user-research、ux、interview）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: plan — 
  ↓
步骤 2: recruit — 
  ↓
步骤 3: fieldwork — 
  ↓
步骤 4: coding — 
  ↓
步骤 5: insight — 
  ↓
[输出]
```

### 步骤 1: plan

**目标**：基于上一步的结论产出本环节交付物（plan），关键取舍当场记录决策理由。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：本步骤的核心产物（文档/配置/代码草案），含决策记录与未决问题清单。供步骤 2（recruit）消费。
**失败处理**：出现两难取舍时记录 ADR 式决策而非留空；产物无法满足上游约束时回退上一步修订结论。

### 步骤 2: recruit

**目标**：执行 recruit，产出该环节的结构化结果供下一步消费。
**输入**：步骤 1（plan）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 3（fieldwork）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 3: fieldwork

**目标**：执行 fieldwork，产出该环节的结构化结果供下一步消费。
**输入**：步骤 2（recruit）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 4（coding）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 4: coding

**目标**：执行 coding，产出该环节的结构化结果供下一步消费。
**输入**：步骤 3（fieldwork）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 5（insight）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 5: insight

**目标**：执行 insight，产出该环节的结构化结果供下一步消费。
**输入**：步骤 4（coding）的输出。
**输出**：本步骤的结构化结果与关键中间数据。作为工作流最终交付的一部分。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

## 输入参数

- `researchQuestion` (string, **必填**) — 驱动研究的核心问题
- `targetSegment` (object, 可选)
- `method` (string, **必填**) 取值: interview/survey/diary/usability-test/mixed
- `sampleSize` (integer, 可选)

## 输出

- `researchPlan` (object, 可选)
- `rawData` (array, 可选)
- `themes` (array, 可选)
- `insightReport` (string, 可选)
- `recommendations` (array, 可选)

## 错误处理
策略: `continue`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
