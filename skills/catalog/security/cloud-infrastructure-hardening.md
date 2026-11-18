---
contentStatus: outline
id: cloud-infrastructure-hardening
type: composite-skill
title: Cloud Infrastructure Hardening
nameZh: 云基础设施加固
domain: security
tags: cloud-security, hardening, vpc, cis, network
catalogSource: internal
catalogFile: skills/cloud-infrastructure-hardening.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 7
---

# 云基础设施加固

> 对云网络、计算、存储资源进行安全加固，消除错误配置和攻击面

## 何时使用

- 需要完成「对云网络、计算、存储资源进行安全加固，消除错误配置和攻击面」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（cloud-security、hardening、vpc）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: list-infra-configs — 
  ↓
步骤 2: scan-network-exposure — 
  ↓
步骤 3: scan-unencrypted-resources — 
  ↓
步骤 4: scan-logging-gaps — 
  ↓
步骤 5: scan-compute-security — 
  ↓
步骤 6: llm-hardening — 
  ↓
步骤 7: format-output — 
  ↓
[输出]
```

### 步骤 1: list-infra-configs

**目标**：执行 list-infra-configs，产出该环节的结构化结果供下一步消费。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 2（scan-network-exposure）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 2: scan-network-exposure

**目标**：对输入做结构化梳理（scan-network-exposure），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：步骤 1（list-infra-configs）的输出。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 3（scan-unencrypted-resources）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 3: scan-unencrypted-resources

**目标**：对输入做结构化梳理（scan-unencrypted-resources），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：步骤 2（scan-network-exposure）的输出。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 4（scan-logging-gaps）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 4: scan-logging-gaps

**目标**：对输入做结构化梳理（scan-logging-gaps），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：步骤 3（scan-unencrypted-resources）的输出。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 5（scan-compute-security）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 5: scan-compute-security

**目标**：对输入做结构化梳理（scan-compute-security），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：步骤 4（scan-logging-gaps）的输出。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 6（llm-hardening）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 6: llm-hardening

**目标**：执行 llm-hardening，产出该环节的结构化结果供下一步消费。
**输入**：步骤 5（scan-compute-security）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 7（format-output）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 7: format-output

**目标**：把前序步骤成果整理为约定格式的最终交付物（format-output）。
**输入**：步骤 6（llm-hardening）的输出。
**输出**：按目标受众组织的最终交付物，附关键数据与决策依据的引用。作为工作流最终交付的一部分。
**失败处理**：交付物缺关键信息时回溯对应步骤补齐，而不是在交付物里含糊带过。

## 输入参数

- `targetPath` (string, **必填**) — 云基础设施配置路径（Terraform / CloudFormation / ARM / Pulumi）
- `cloudProvider` (string, 可选) 取值: aws/azure/gcp/tencent-cloud 默认: `"aws"`
- `hardeningProfile` (string, 可选) 取值: cis-benchmark/nist-800-53/soc2/custom — 加固基准 默认: `"cis-benchmark"`

## 输出

- `passed` (boolean, 可选)
- `hardeningScore` (number, 可选)
- `totalChecks` (number, 可选)
- `passedChecks` (number, 可选)
- `findings` (array, 可选)

## 错误处理
策略: `continue`
- fallback: `llm-hardening` → skip-partial

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
