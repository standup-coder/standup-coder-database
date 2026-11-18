---
contentStatus: outline
id: incident-postmortem
type: composite-skill
title: Incident Postmortem
nameZh: 事故复盘
domain: devops
tags: postmortem, incident, sre, blameless, reliability
catalogSource: internal
catalogFile: skills/incident-postmortem.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 5
---

# 事故复盘

> 以无指责为原则运作事故复盘：时间线 → 根因 → 教训 → 行动项 → 知识沉淀

## 何时使用

- 需要完成「以无指责为原则运作事故复盘：时间线 → 根因 → 教训 → 行动项 → 知识沉淀」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（postmortem、incident、sre）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: timeline — 
  ↓
步骤 2: rca — 
  ↓
步骤 3: lessons — 
  ↓
步骤 4: actions — 
  ↓
步骤 5: doc — 
  ↓
[输出]
```

### 步骤 1: timeline

**目标**：执行 timeline，产出该环节的结构化结果供下一步消费。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 2（rca）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 2: rca

**目标**：执行 rca，产出该环节的结构化结果供下一步消费。
**输入**：步骤 1（timeline）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 3（lessons）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 3: lessons

**目标**：执行 lessons，产出该环节的结构化结果供下一步消费。
**输入**：步骤 2（rca）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 4（actions）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 4: actions

**目标**：执行 actions，产出该环节的结构化结果供下一步消费。
**输入**：步骤 3（lessons）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 5（doc）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 5: doc

**目标**：执行 doc，产出该环节的结构化结果供下一步消费。
**输入**：步骤 4（actions）的输出。
**输出**：本步骤的结构化结果与关键中间数据。作为工作流最终交付的一部分。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

## 输入参数

- `incidentId` (string, **必填**)
- `severity` (string, **必填**) 取值: sev1/sev2/sev3/sev4
- `rawTimeline` (array, 可选)
- `impactedServices` (array, 可选)
- `userImpact` (string, 可选)

## 输出

- `timeline` (array, 可选)
- `rootCause` (string, 可选)
- `contributingFactors` (array, 可选)
- `lessonsLearned` (array, 可选)
- `actionItems` (array, 可选)
- `postmortemDoc` (string, 可选)

## 错误处理
策略: `continue`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
