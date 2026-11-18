---
contentStatus: outline
id: log-analysis
type: composite-skill
title: Log Analysis
nameZh: 日志分析
domain: devops
tags: logging, analysis, troubleshooting, ops
catalogSource: internal
catalogFile: skills/log-analysis.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 4
---

# 日志分析

> 分析应用日志，定位异常模式并生成摘要报告

## 何时使用

- 需要完成「分析应用日志，定位异常模式并生成摘要报告」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（logging、analysis、troubleshooting）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: read-log — 
  ↓
步骤 2: parse-log — 
  ↓
步骤 3: llm-analysis — 
  ↓
步骤 4: format-output — 
  ↓
[输出]
```

### 步骤 1: read-log

**目标**：执行 read-log，产出该环节的结构化结果供下一步消费。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 2（parse-log）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 2: parse-log

**目标**：对输入做结构化梳理（parse-log），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：步骤 1（read-log）的输出。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 3（llm-analysis）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 3: llm-analysis

**目标**：对输入做结构化梳理（llm-analysis），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：步骤 2（parse-log）的输出。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 4（format-output）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 4: format-output

**目标**：把前序步骤成果整理为约定格式的最终交付物（format-output）。
**输入**：步骤 3（llm-analysis）的输出。
**输出**：按目标受众组织的最终交付物，附关键数据与决策依据的引用。作为工作流最终交付的一部分。
**失败处理**：交付物缺关键信息时回溯对应步骤补齐，而不是在交付物里含糊带过。

## 输入参数

- `logFilePath` (string, **必填**) — 日志文件路径
- `logFormat` (string, 可选) 取值: json/nginx/apache/plain 默认: `"json"`
- `query` (string, **必填**) — 自然语言查询，如'找出5xx错误的原因'

## 输出

- `summary` (string, 可选)
- `anomalies` (array, 可选)
- `timeline` (array, 可选)

## 错误处理
策略: `continue`
- fallback: `llm-analysis` → skip-partial

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
