---
contentStatus: outline
id: ci-pipeline-setup
type: composite-skill
title: CI Pipeline Setup
nameZh: CI 流水线搭建
domain: devops
tags: cicd, github-actions, automation, ops
catalogSource: internal
catalogFile: skills/ci-pipeline-setup.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 3
---

# CI 流水线搭建

> 为项目生成 GitHub Actions 等 CI/CD 流水线配置

## 何时使用

- 需要完成「为项目生成 GitHub Actions 等 CI/CD 流水线配置」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（cicd、github-actions、automation）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: inspect-project — 
  ↓
步骤 2: generate-workflow — 
  ↓
步骤 3: format-output — 
  ↓
[输出]
```

### 步骤 1: inspect-project

**目标**：对输入做结构化梳理（inspect-project），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 2（generate-workflow）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 2: generate-workflow

**目标**：基于上一步的结论产出本环节交付物（generate-workflow），关键取舍当场记录决策理由。
**输入**：步骤 1（inspect-project）的输出。
**输出**：本步骤的核心产物（文档/配置/代码草案），含决策记录与未决问题清单。供步骤 3（format-output）消费。
**失败处理**：出现两难取舍时记录 ADR 式决策而非留空；产物无法满足上游约束时回退上一步修订结论。

### 步骤 3: format-output

**目标**：把前序步骤成果整理为约定格式的最终交付物（format-output）。
**输入**：步骤 2（generate-workflow）的输出。
**输出**：按目标受众组织的最终交付物，附关键数据与决策依据的引用。作为工作流最终交付的一部分。
**失败处理**：交付物缺关键信息时回溯对应步骤补齐，而不是在交付物里含糊带过。

## 输入参数

- `projectPath` (string, **必填**) — 项目根目录路径
- `techStack` (array, 可选) — 技术栈，如 ["nodejs", "docker"]
- `stages` (array, 可选) 默认: `["lint","test","build"]`

## 输出

- `workflowYaml` (string, 可选)
- `summary` (string, 可选)
- `filesToCreate` (array, 可选)

## 错误处理
策略: `continue`
- fallback: `generate-workflow` → use-template

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
