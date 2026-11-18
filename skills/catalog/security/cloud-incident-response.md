---
contentStatus: outline
id: cloud-incident-response
type: composite-skill
title: Cloud Incident Response
nameZh: 云安全事件响应
domain: security
tags: incident-response, cloud-security, forensics, containment
catalogSource: internal
catalogFile: skills/cloud-incident-response.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 5
---

# 云安全事件响应

> 云安全事件的检测、分析、遏制和修复，支持凭据泄露、数据外泄等场景

## 何时使用

- 需要完成「云安全事件的检测、分析、遏制和修复，支持凭据泄露、数据外泄等场景」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（incident-response、cloud-security、forensics）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: collect-evidence — 
  ↓
步骤 2: analyze-access-logs — 
  ↓
步骤 3: scan-credential-exposure — 
  ↓
步骤 4: llm-incident-analysis — 
  ↓
步骤 5: format-output — 
  ↓
[输出]
```

### 步骤 1: collect-evidence

**目标**：对输入做结构化梳理（collect-evidence），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 2（analyze-access-logs）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 2: analyze-access-logs

**目标**：对输入做结构化梳理（analyze-access-logs），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：步骤 1（collect-evidence）的输出。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 3（scan-credential-exposure）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 3: scan-credential-exposure

**目标**：对输入做结构化梳理（scan-credential-exposure），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：步骤 2（analyze-access-logs）的输出。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 4（llm-incident-analysis）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 4: llm-incident-analysis

**目标**：对输入做结构化梳理（llm-incident-analysis），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：步骤 3（scan-credential-exposure）的输出。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 5（format-output）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 5: format-output

**目标**：把前序步骤成果整理为约定格式的最终交付物（format-output）。
**输入**：步骤 4（llm-incident-analysis）的输出。
**输出**：按目标受众组织的最终交付物，附关键数据与决策依据的引用。作为工作流最终交付的一部分。
**失败处理**：交付物缺关键信息时回溯对应步骤补齐，而不是在交付物里含糊带过。

## 输入参数

- `incidentType` (string, **必填**) 取值: credential-compromise/data-exfiltration/cryptojacking/misconfiguration-exposure/unauthorized-access/malware-container — 事件类型
- `cloudProvider` (string, **必填**) 取值: aws/azure/gcp/tencent-cloud 默认: `"aws"`
- `evidencePath` (string, 可选) — 证据文件路径（日志、配置快照等）
- `affectedResources` (array, 可选) — 受影响资源列表

## 输出

- `severity` (any, 可选) 取值: critical/high/medium/low
- `status` (any, 可选) 取值: detected/analyzing/contained/resolved
- `timeline` (array, 可选)
- `rootCause` (string, 可选)
- `affectedResources` (array, 可选)
- `containmentSteps` (array, 可选)
- `remediationPlan` (array, 可选)
- `lessonsLearned` (array, 可选)

## 错误处理
策略: `continue`
- fallback: `llm-incident-analysis` → skip-partial

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
