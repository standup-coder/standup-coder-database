---
contentStatus: outline
id: mobile-release-pipeline
type: composite-skill
title: Mobile Release Pipeline
nameZh: 移动端发布流水线
domain: mobile
tags: mobile, ci-cd, fastlane, code-signing, release-train
catalogSource: internal
catalogFile: skills/mobile-release-pipeline.json
catalogAddedAt: 2026-07-26
errorHandling: stop
stepCount: 6
---

# 移动端发布流水线

> 覆盖移动端发布全流程：多渠道构建、签名、灰度、商店提交与回滚

## 何时使用

- 需要完成「覆盖移动端发布全流程：多渠道构建、签名、灰度、商店提交与回滚」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（mobile、ci-cd、fastlane）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: build — 
  ↓
步骤 2: sign — 
  ↓
步骤 3: beta — 
  ↓
步骤 4: submit — 
  ↓
步骤 5: monitor — 
  ↓
步骤 6: rollback-plan — 
  ↓
[输出]
```

### 步骤 1: build

**目标**：基于上一步的结论产出本环节交付物（build），关键取舍当场记录决策理由。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：本步骤的核心产物（文档/配置/代码草案），含决策记录与未决问题清单。供步骤 2（sign）消费。
**失败处理**：出现两难取舍时记录 ADR 式决策而非留空；产物无法满足上游约束时回退上一步修订结论。

### 步骤 2: sign

**目标**：把前序步骤成果整理为约定格式的最终交付物（sign）。
**输入**：步骤 1（build）的输出。
**输出**：按目标受众组织的最终交付物，附关键数据与决策依据的引用。供步骤 3（beta）消费。
**失败处理**：交付物缺关键信息时回溯对应步骤补齐，而不是在交付物里含糊带过。

### 步骤 3: beta

**目标**：执行 beta，产出该环节的结构化结果供下一步消费。
**输入**：步骤 2（sign）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 4（submit）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 4: submit

**目标**：把前序步骤成果整理为约定格式的最终交付物（submit）。
**输入**：步骤 3（beta）的输出。
**输出**：按目标受众组织的最终交付物，附关键数据与决策依据的引用。供步骤 5（monitor）消费。
**失败处理**：交付物缺关键信息时回溯对应步骤补齐，而不是在交付物里含糊带过。

### 步骤 5: monitor

**目标**：建立/执行观测（monitor），让结果状态可量化、异常可发现。
**输入**：步骤 4（submit）的输出。
**输出**：可持续观测的指标/告警/日志视图，含基线值与异常判定阈值。供步骤 6（rollback-plan）消费。
**失败处理**：指标缺失或噪声过大时先修观测本身，避免基于失真数据做后续判断。

### 步骤 6: rollback-plan

**目标**：针对已识别的问题实施修复/加固（rollback-plan），并确认修复未引入回归。
**输入**：步骤 5（monitor）的输出。
**输出**：修复动作记录、修复前后对比证据、残余风险清单。作为工作流最终交付的一部分。
**失败处理**：修复引发新问题时立即回滚到已知良好状态，重新评估方案。

## 输入参数

- `platforms` (array, **必填**)
- `version` (string, **必填**)
- `rolloutStrategy` (string, 可选) 取值: full/staged/ab-test
- `betaChannel` (string, 可选) 取值: testflight/firebase-app-distribution/internal

## 输出

- `buildArtifacts` (array, 可选)
- `signingReport` (object, 可选)
- `submissionResult` (object, 可选)
- `rollbackPlan` (string, 可选)

## 错误处理
策略: `stop`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
