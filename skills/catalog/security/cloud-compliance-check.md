---
contentStatus: outline
id: cloud-compliance-check
type: composite-skill
title: Cloud Compliance Check
nameZh: 云合规检查
domain: security
tags: compliance, cis, soc2, gdpr, hipaa, pci-dss, cloud
catalogSource: internal
catalogFile: skills/cloud-compliance-check.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 5
---

# 云合规检查

> 对云资源配置进行合规框架检查（CIS、SOC2、GDPR、HIPAA、PCI-DSS）

## 何时使用

- 需要完成「对云资源配置进行合规框架检查（CIS、SOC2、GDPR、HIPAA、PCI-DSS）」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（compliance、cis、soc2）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: list-resources — 
  ↓
步骤 2: scan-logging-config — 
  ↓
步骤 3: scan-encryption-config — 
  ↓
步骤 4: llm-compliance — 
  ↓
步骤 5: format-output — 
  ↓
[输出]
```

### 步骤 1: list-resources

**目标**：执行 list-resources，产出该环节的结构化结果供下一步消费。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 2（scan-logging-config）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 2: scan-logging-config

**目标**：对输入做结构化梳理（scan-logging-config），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：步骤 1（list-resources）的输出。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 3（scan-encryption-config）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 3: scan-encryption-config

**目标**：对输入做结构化梳理（scan-encryption-config），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：步骤 2（scan-logging-config）的输出。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 4（llm-compliance）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 4: llm-compliance

**目标**：执行 llm-compliance，产出该环节的结构化结果供下一步消费。
**输入**：步骤 3（scan-encryption-config）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 5（format-output）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 5: format-output

**目标**：把前序步骤成果整理为约定格式的最终交付物（format-output）。
**输入**：步骤 4（llm-compliance）的输出。
**输出**：按目标受众组织的最终交付物，附关键数据与决策依据的引用。作为工作流最终交付的一部分。
**失败处理**：交付物缺关键信息时回溯对应步骤补齐，而不是在交付物里含糊带过。

## 输入参数

- `targetPath` (string, **必填**) — 云资源配置路径
- `framework` (string, **必填**) 取值: CIS/SOC2/GDPR/HIPAA/PCI-DSS/ISO27001 — 合规框架
- `cloudProvider` (string, **必填**) 取值: aws/azure/gcp/tencent-cloud

## 输出

- `compliant` (boolean, 可选)
- `framework` (string, 可选)
- `totalControls` (number, 可选)
- `passedControls` (number, 可选)
- `failedControls` (number, 可选)
- `results` (array, 可选)

## 错误处理
策略: `continue`
- fallback: `llm-compliance` → skip-partial

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
