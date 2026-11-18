---
contentStatus: outline
id: incident-management
type: composite-skill
title: Incident Management
nameZh: 事件管理
domain: devops
tags: incident, response, runbook, on-call
catalogSource: internal
catalogFile: skills/incident-management.json
catalogAddedAt: 2026-07-26
stepCount: 3
---

# 事件管理

> 事件响应手册和云IR剧本

## 何时使用

- 需要完成「事件响应手册和云IR剧本」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（incident、response、runbook）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: analyze-incident — 
  ↓
步骤 2: create-runbook — 
  ↓
步骤 3: setup-alerting — 
  ↓
[输出]
```

### 步骤 1: analyze-incident

**目标**：对输入做结构化梳理（analyze-incident），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 2（create-runbook）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 2: create-runbook

**目标**：基于上一步的结论产出本环节交付物（create-runbook），关键取舍当场记录决策理由。
**输入**：步骤 1（analyze-incident）的输出。
**输出**：本步骤的核心产物（文档/配置/代码草案），含决策记录与未决问题清单。供步骤 3（setup-alerting）消费。
**失败处理**：出现两难取舍时记录 ADR 式决策而非留空；产物无法满足上游约束时回退上一步修订结论。

### 步骤 3: setup-alerting

**目标**：基于上一步的结论产出本环节交付物（setup-alerting），关键取舍当场记录决策理由。
**输入**：步骤 2（create-runbook）的输出。
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
