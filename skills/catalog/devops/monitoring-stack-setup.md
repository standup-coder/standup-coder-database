---
contentStatus: outline
id: monitoring-stack-setup
type: composite-skill
title: Monitoring Stack Setup
nameZh: 监控栈搭建
domain: devops
tags: prometheus, grafana, monitoring, observability, ops
catalogSource: internal
catalogFile: skills/monitoring-stack-setup.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 3
---

# 监控栈搭建

> 生成 Prometheus + Grafana 监控栈的 Docker Compose 配置与告警规则

## 何时使用

- 需要完成「生成 Prometheus + Grafana 监控栈的 Docker Compose 配置与告警规则」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（prometheus、grafana、monitoring）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: health-check — 
  ↓
步骤 2: generate-configs — 
  ↓
步骤 3: format-output — 
  ↓
[输出]
```

### 步骤 1: health-check

**目标**：执行 health-check，产出该环节的结构化结果供下一步消费。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 2（generate-configs）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 2: generate-configs

**目标**：基于上一步的结论产出本环节交付物（generate-configs），关键取舍当场记录决策理由。
**输入**：步骤 1（health-check）的输出。
**输出**：本步骤的核心产物（文档/配置/代码草案），含决策记录与未决问题清单。供步骤 3（format-output）消费。
**失败处理**：出现两难取舍时记录 ADR 式决策而非留空；产物无法满足上游约束时回退上一步修订结论。

### 步骤 3: format-output

**目标**：把前序步骤成果整理为约定格式的最终交付物（format-output）。
**输入**：步骤 2（generate-configs）的输出。
**输出**：按目标受众组织的最终交付物，附关键数据与决策依据的引用。作为工作流最终交付的一部分。
**失败处理**：交付物缺关键信息时回溯对应步骤补齐，而不是在交付物里含糊带过。

## 输入参数

- `targets` (array, **必填**) — 要监控的服务地址列表
- `alertChannels` (array, 可选) 默认: `["email"]`
- `outputDir` (string, 可选) — 配置输出目录 默认: `"./monitoring"`

## 输出

- `composeYaml` (string, 可选)
- `prometheusConfig` (string, 可选)
- `alertRules` (string, 可选)
- `setupInstructions` (string, 可选)

## 错误处理
策略: `continue`
- fallback: `generate-configs` → use-default-template

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
