---
contentStatus: outline
id: growth-analytics
type: composite-skill
title: Growth Analytics
nameZh: 增长分析
domain: marketing
tags: growth, analytics, ab-test, funnel
catalogSource: internal
catalogFile: skills/growth-analytics.json
catalogAddedAt: 2026-07-26
stepCount: 3
---

# 增长分析

> A/B测试、漏斗分析和队列分析

## 何时使用

- 需要完成「A/B测试、漏斗分析和队列分析」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（growth、analytics、ab-test）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: design-experiment — 
  ↓
步骤 2: implement-tracking — 
  ↓
步骤 3: setup-dashboard — 
  ↓
[输出]
```

### 步骤 1: design-experiment

**目标**：基于上一步的结论产出本环节交付物（design-experiment），关键取舍当场记录决策理由。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：本步骤的核心产物（文档/配置/代码草案），含决策记录与未决问题清单。供步骤 2（implement-tracking）消费。
**失败处理**：出现两难取舍时记录 ADR 式决策而非留空；产物无法满足上游约束时回退上一步修订结论。

### 步骤 2: implement-tracking

**目标**：基于上一步的结论产出本环节交付物（implement-tracking），关键取舍当场记录决策理由。
**输入**：步骤 1（design-experiment）的输出。
**输出**：本步骤的核心产物（文档/配置/代码草案），含决策记录与未决问题清单。供步骤 3（setup-dashboard）消费。
**失败处理**：出现两难取舍时记录 ADR 式决策而非留空；产物无法满足上游约束时回退上一步修订结论。

### 步骤 3: setup-dashboard

**目标**：基于上一步的结论产出本环节交付物（setup-dashboard），关键取舍当场记录决策理由。
**输入**：步骤 2（implement-tracking）的输出。
**输出**：本步骤的核心产物（文档/配置/代码草案），含决策记录与未决问题清单。作为工作流最终交付的一部分。
**失败处理**：出现两难取舍时记录 ADR 式决策而非留空；产物无法满足上游约束时回退上一步修订结论。

## 输入参数

_无明确 schema_

## 输出

_无明确 schema_



## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
