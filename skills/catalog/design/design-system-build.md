---
contentStatus: outline
id: design-system-build
type: composite-skill
title: Design System Build
nameZh: 设计系统构建
domain: design
tags: design-system, tokens, component-library, ui-ux, governance
catalogSource: internal
catalogFile: skills/design-system-build.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 5
---

# 设计系统构建

> 以 Design Token 为核心搭建可治理的设计系统：从基础变量、组件库到文档与版本治理

## 何时使用

- 需要完成「以 Design Token 为核心搭建可治理的设计系统：从基础变量、组件库到文档与版本治理」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（design-system、tokens、component-library）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: audit — 
  ↓
步骤 2: tokens — 
  ↓
步骤 3: components — 
  ↓
步骤 4: docs — 
  ↓
步骤 5: governance — 
  ↓
[输出]
```

### 步骤 1: audit

**目标**：对输入做结构化梳理（audit），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 2（tokens）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 2: tokens

**目标**：执行 tokens，产出该环节的结构化结果供下一步消费。
**输入**：步骤 1（audit）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 3（components）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 3: components

**目标**：执行 components，产出该环节的结构化结果供下一步消费。
**输入**：步骤 2（tokens）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 4（docs）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 4: docs

**目标**：执行 docs，产出该环节的结构化结果供下一步消费。
**输入**：步骤 3（components）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 5（governance）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 5: governance

**目标**：执行 governance，产出该环节的结构化结果供下一步消费。
**输入**：步骤 4（docs）的输出。
**输出**：本步骤的结构化结果与关键中间数据。作为工作流最终交付的一部分。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

## 输入参数

- `brandGuide` (object, **必填**) — 品牌视觉规范（颜色/字体/间距）
- `componentScope` (array, **必填**) — 首批组件清单
- `platforms` (array, 可选)
- `techStack` (string, 可选) 取值: react/vue/svelte/web-components

## 输出

- `tokens` (object, 可选) — Design Tokens（W3C DTCG 格式）
- `componentSpecs` (array, 可选)
- `documentation` (string, 可选) — Storybook / Docusaurus 站点
- `governanceModel` (object, 可选)

## 错误处理
策略: `continue`
- fallback: `governance` → skip-llm-step

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
