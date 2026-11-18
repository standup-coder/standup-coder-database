---
contentStatus: outline
id: release-strategy
type: composite-skill
title: Release Strategy
nameZh: 发布策略
domain: devops
tags: release, progressive-delivery, feature-flag, canary, rollback
catalogSource: internal
catalogFile: skills/release-strategy.json
catalogAddedAt: 2026-07-26
errorHandling: stop
stepCount: 5
---

# 发布策略

> 以渐进式交付为核心设计发布策略：分级灰度 + 特性开关 + 自动回滚 + 可观测验证

## 何时使用

- 需要完成「以渐进式交付为核心设计发布策略：分级灰度 + 特性开关 + 自动回滚 + 可观测验证」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（release、progressive-delivery、feature-flag）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: tradeoff — 
  ↓
步骤 2: flags — 
  ↓
步骤 3: canary — 
  ↓
步骤 4: rollback — 
  ↓
步骤 5: verify — 
  ↓
[输出]
```

### 步骤 1: tradeoff

**目标**：执行 tradeoff，产出该环节的结构化结果供下一步消费。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 2（flags）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 2: flags

**目标**：执行 flags，产出该环节的结构化结果供下一步消费。
**输入**：步骤 1（tradeoff）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 3（canary）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 3: canary

**目标**：执行 canary，产出该环节的结构化结果供下一步消费。
**输入**：步骤 2（flags）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 4（rollback）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 4: rollback

**目标**：针对已识别的问题实施修复/加固（rollback），并确认修复未引入回归。
**输入**：步骤 3（canary）的输出。
**输出**：修复动作记录、修复前后对比证据、残余风险清单。供步骤 5（verify）消费。
**失败处理**：修复引发新问题时立即回滚到已知良好状态，重新评估方案。

### 步骤 5: verify

**目标**：对上一步产物做客观验证（verify），在进入交付前暴露缺陷。
**输入**：步骤 4（rollback）的输出。
**输出**：验证结论：通过项、失败项及其复现方式、需要回退修订的清单。作为工作流最终交付的一部分。
**失败处理**：验证不通过时打回产出步骤修订，禁止"先交付再修"；反复不通过则升级评审。

## 输入参数

- `releaseScope` (string, **必填**)
- `riskLevel` (string, **必填**) 取值: low/medium/high/critical
- `trafficSegments` (array, 可选)
- `rollbackBudgetMinutes` (integer, 可选)

## 输出

- `deliveryPlan` (object, 可选)
- `flagPlan` (object, 可选)
- `canaryStages` (array, 可选)
- `rollbackTriggers` (array, 可选)
- `verificationDashboard` (string, 可选)

## 错误处理
策略: `stop`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
