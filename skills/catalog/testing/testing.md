---
contentStatus: outline
id: testing
type: composite-skill
title: Testing
nameZh: 测试
domain: testing
tags: testing, qa, unit-tests, e2e
catalogSource: internal
catalogFile: skills/testing.json
catalogAddedAt: 2026-07-26
stepCount: 3
---

# 测试

> 综合测试策略和实施

## 何时使用

- 需要完成「综合测试策略和实施」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（testing、qa、unit-tests）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: design-tests — 
  ↓
步骤 2: write-unit-tests — 
  ↓
步骤 3: run-tests — 
  ↓
[输出]
```

### 步骤 1: design-tests

**目标**：基于上一步的结论产出本环节交付物（design-tests），关键取舍当场记录决策理由。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：本步骤的核心产物（文档/配置/代码草案），含决策记录与未决问题清单。供步骤 2（write-unit-tests）消费。
**失败处理**：出现两难取舍时记录 ADR 式决策而非留空；产物无法满足上游约束时回退上一步修订结论。

### 步骤 2: write-unit-tests

**目标**：基于上一步的结论产出本环节交付物（write-unit-tests），关键取舍当场记录决策理由。
**输入**：步骤 1（design-tests）的输出。
**输出**：本步骤的核心产物（文档/配置/代码草案），含决策记录与未决问题清单。供步骤 3（run-tests）消费。
**失败处理**：出现两难取舍时记录 ADR 式决策而非留空；产物无法满足上游约束时回退上一步修订结论。

### 步骤 3: run-tests

**目标**：执行 run-tests，产出该环节的结构化结果供下一步消费。
**输入**：步骤 2（write-unit-tests）的输出。
**输出**：本步骤的结构化结果与关键中间数据。作为工作流最终交付的一部分。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

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
