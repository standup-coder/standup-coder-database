---
contentStatus: outline
id: code-review
type: composite-skill
title: Code Review
nameZh: 代码审查
domain: backend
tags: review, quality, security
catalogSource: internal
catalogFile: skills/code-review.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 6
---

# 代码审查

> 全面审查代码质量、安全性、性能和可维护性

## 何时使用

- 需要完成「全面审查代码质量、安全性、性能和可维护性」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（review、quality、security）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: read-file — 
  ↓
步骤 2: analyze-syntax — 
  ↓
步骤 3: check-security — 
  ↓
步骤 4: check-performance — 
  ↓
步骤 5: llm-review — 
  ↓
步骤 6: format-output — 
  ↓
[输出]
```

### 步骤 1: read-file

**目标**：执行 read-file，产出该环节的结构化结果供下一步消费。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 2（analyze-syntax）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 2: analyze-syntax

**目标**：对输入做结构化梳理（analyze-syntax），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：步骤 1（read-file）的输出。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 3（check-security）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 3: check-security

**目标**：对上一步产物做客观验证（check-security），在进入交付前暴露缺陷。
**输入**：步骤 2（analyze-syntax）的输出。
**输出**：验证结论：通过项、失败项及其复现方式、需要回退修订的清单。供步骤 4（check-performance）消费。
**失败处理**：验证不通过时打回产出步骤修订，禁止"先交付再修"；反复不通过则升级评审。

### 步骤 4: check-performance

**目标**：对上一步产物做客观验证（check-performance），在进入交付前暴露缺陷。
**输入**：步骤 3（check-security）的输出。
**输出**：验证结论：通过项、失败项及其复现方式、需要回退修订的清单。供步骤 5（llm-review）消费。
**失败处理**：验证不通过时打回产出步骤修订，禁止"先交付再修"；反复不通过则升级评审。

### 步骤 5: llm-review

**目标**：对输入做结构化梳理（llm-review），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：步骤 4（check-performance）的输出。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 6（format-output）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 6: format-output

**目标**：把前序步骤成果整理为约定格式的最终交付物（format-output）。
**输入**：步骤 5（llm-review）的输出。
**输出**：按目标受众组织的最终交付物，附关键数据与决策依据的引用。作为工作流最终交付的一部分。
**失败处理**：交付物缺关键信息时回溯对应步骤补齐，而不是在交付物里含糊带过。

## 输入参数

- `filePath` (string, **必填**) — 要审查的文件路径
- `fileContent` (string, 可选) — 文件内容（如未提供则自动读取）
- **context** (object):
  - `relatedFiles` (array, 可选)
  - `prDescription` (string, 可选)
  - `techStack` (array, 可选)
- `focus` (array, 可选) 默认: `["all"]`

## 输出

- `summary` (string, 可选)
- `score` (number, 可选)
- `issues` (array, 可选)
- `suggestions` (array, 可选)
- `approval` (any, 可选) 取值: approved/comment/request-changes

## 错误处理
策略: `continue`
- fallback: `llm-review` → skip-partial-analysis

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
