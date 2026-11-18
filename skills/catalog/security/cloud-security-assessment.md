---
contentStatus: outline
id: cloud-security-assessment
type: composite-skill
title: Cloud Security Assessment
nameZh: 云安全评估
domain: security
tags: cloud-security, assessment, cspm, compliance
catalogSource: internal
catalogFile: skills/cloud-security-assessment.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 6
---

# 云安全评估

> 对云基础设施配置进行安全评估，识别错误配置、权限泄露和合规风险

## 何时使用

- 需要完成「对云基础设施配置进行安全评估，识别错误配置、权限泄露和合规风险」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（cloud-security、assessment、cspm）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: list-cloud-configs — 
  ↓
步骤 2: scan-iam-risks — 
  ↓
步骤 3: scan-exposed-resources — 
  ↓
步骤 4: scan-unencrypted-data — 
  ↓
步骤 5: llm-assessment — 
  ↓
步骤 6: format-output — 
  ↓
[输出]
```

### 步骤 1: list-cloud-configs

**目标**：执行 list-cloud-configs，产出该环节的结构化结果供下一步消费。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 2（scan-iam-risks）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 2: scan-iam-risks

**目标**：对输入做结构化梳理（scan-iam-risks），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：步骤 1（list-cloud-configs）的输出。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 3（scan-exposed-resources）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 3: scan-exposed-resources

**目标**：对输入做结构化梳理（scan-exposed-resources），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：步骤 2（scan-iam-risks）的输出。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 4（scan-unencrypted-data）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 4: scan-unencrypted-data

**目标**：对输入做结构化梳理（scan-unencrypted-data），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：步骤 3（scan-exposed-resources）的输出。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 5（llm-assessment）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 5: llm-assessment

**目标**：执行 llm-assessment，产出该环节的结构化结果供下一步消费。
**输入**：步骤 4（scan-unencrypted-data）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 6（format-output）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 6: format-output

**目标**：把前序步骤成果整理为约定格式的最终交付物（format-output）。
**输入**：步骤 5（llm-assessment）的输出。
**输出**：按目标受众组织的最终交付物，附关键数据与决策依据的引用。作为工作流最终交付的一部分。
**失败处理**：交付物缺关键信息时回溯对应步骤补齐，而不是在交付物里含糊带过。

## 输入参数

- `targetPath` (string, **必填**) — 云资源配置目标路径（Terraform / CloudFormation / K8s manifests）
- `cloudProvider` (string, 可选) 取值: aws/azure/gcp/tencent-cloud/multi-cloud 默认: `"aws"`
- `frameworks` (array, 可选) 默认: `["CIS"]`

## 输出

- `passed` (boolean, 可选)
- `riskScore` (number, 可选)
- `findings` (array, 可选)
- **compliance** (object):
  - `framework` (string, 可选)
  - `totalChecks` (number, 可选)
  - `passedChecks` (number, 可选)
  - `failedChecks` (number, 可选)

## 错误处理
策略: `continue`
- fallback: `llm-assessment` → skip-partial

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
