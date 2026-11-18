---
contentStatus: outline
id: content-marketing-campaign
type: composite-skill
title: Content Marketing Campaign
nameZh: 内容营销战役
domain: marketing
tags: content-marketing, seo, campaign, funnel, marketing
catalogSource: internal
catalogFile: skills/content-marketing-campaign.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 5
---

# 内容营销战役

> 围绕漏斗目标设计并执行多渠道内容战役：受众 → 主题群 → 日历 → 分发 → 复盘

## 何时使用

- 需要完成「围绕漏斗目标设计并执行多渠道内容战役：受众 → 主题群 → 日历 → 分发 → 复盘」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（content-marketing、seo、campaign）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: narrative — 
  ↓
步骤 2: topics — 
  ↓
步骤 3: calendar — 
  ↓
步骤 4: distribution — 
  ↓
步骤 5: kpi — 
  ↓
[输出]
```

### 步骤 1: narrative

**目标**：执行 narrative，产出该环节的结构化结果供下一步消费。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 2（topics）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 2: topics

**目标**：执行 topics，产出该环节的结构化结果供下一步消费。
**输入**：步骤 1（narrative）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 3（calendar）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 3: calendar

**目标**：执行 calendar，产出该环节的结构化结果供下一步消费。
**输入**：步骤 2（topics）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 4（distribution）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 4: distribution

**目标**：执行 distribution，产出该环节的结构化结果供下一步消费。
**输入**：步骤 3（calendar）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 5（kpi）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 5: kpi

**目标**：执行 kpi，产出该环节的结构化结果供下一步消费。
**输入**：步骤 4（distribution）的输出。
**输出**：本步骤的结构化结果与关键中间数据。作为工作流最终交付的一部分。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

## 输入参数

- `goal` (string, **必填**) 取值: awareness/lead-gen/activation/retention
- `audience` (object, **必填**)
- `channels` (array, **必填**)
- `budgetUsd` (number, 可选)
- `durationWeeks` (integer, 可选)

## 输出

- `narrative` (string, 可选)
- `topicCluster` (object, 可选)
- `contentCalendar` (array, 可选)
- `distributionPlan` (object, 可选)
- `kpiDashboard` (object, 可选)

## 错误处理
策略: `continue`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
