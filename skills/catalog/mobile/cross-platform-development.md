---
contentStatus: outline
id: cross-platform-development
type: composite-skill
title: Cross-Platform Development
nameZh: 跨平台开发
domain: mobile
tags: cross-platform, react-native, flutter, kmm, mobile
catalogSource: internal
catalogFile: skills/cross-platform-development.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 5
---

# 跨平台开发

> 以共享核心层为目标设计跨平台应用：选型 → 架构分层 → 平台桥接 → 性能与一致性验证

## 何时使用

- 需要完成「以共享核心层为目标设计跨平台应用：选型 → 架构分层 → 平台桥接 → 性能与一致性验证」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（cross-platform、react-native、flutter）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: tradeoff — 
  ↓
步骤 2: architecture — 
  ↓
步骤 3: bridging — 
  ↓
步骤 4: perf-budget — 
  ↓
步骤 5: consistency — 
  ↓
[输出]
```

### 步骤 1: tradeoff

**目标**：执行 tradeoff，产出该环节的结构化结果供下一步消费。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 2（architecture）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 2: architecture

**目标**：执行 architecture，产出该环节的结构化结果供下一步消费。
**输入**：步骤 1（tradeoff）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 3（bridging）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 3: bridging

**目标**：执行 bridging，产出该环节的结构化结果供下一步消费。
**输入**：步骤 2（architecture）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 4（perf-budget）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 4: perf-budget

**目标**：执行 perf-budget，产出该环节的结构化结果供下一步消费。
**输入**：步骤 3（bridging）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 5（consistency）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 5: consistency

**目标**：执行 consistency，产出该环节的结构化结果供下一步消费。
**输入**：步骤 4（perf-budget）的输出。
**输出**：本步骤的结构化结果与关键中间数据。作为工作流最终交付的一部分。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

## 输入参数

- `framework` (string, **必填**) 取值: react-native/flutter/kmm/tauri/electron
- `platforms` (array, **必填**)
- `sharedLogicScope` (array, 可选) — 希望共享的业务领域

## 输出

- `architecture` (object, 可选)
- `bridgingPlan` (object, 可选)
- `performanceBudget` (object, 可选)
- `consistencyChecklist` (array, 可选)

## 错误处理
策略: `continue`

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
