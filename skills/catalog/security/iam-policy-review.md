---
contentStatus: outline
id: iam-policy-review
type: composite-skill
title: IAM Policy Review
nameZh: IAM 策略审查
domain: security
tags: iam, policy, least-privilege, rbac, cloud-security
catalogSource: internal
catalogFile: skills/iam-policy-review.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 6
---

# IAM 策略审查

> 审查云 IAM 策略文件，识别过度授权、权限泄露和最小权限违规

## 何时使用

- 需要完成「审查云 IAM 策略文件，识别过度授权、权限泄露和最小权限违规」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（iam、policy、least-privilege）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: list-iam-files — 
  ↓
步骤 2: read-iam-policies — 
  ↓
步骤 3: scan-wildcards — 
  ↓
步骤 4: scan-admin-access — 
  ↓
步骤 5: llm-review — 
  ↓
步骤 6: format-output — 
  ↓
[输出]
```

### 步骤 1: list-iam-files

**目标**：执行 list-iam-files，产出该环节的结构化结果供下一步消费。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 2（read-iam-policies）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 2: read-iam-policies

**目标**：执行 read-iam-policies，产出该环节的结构化结果供下一步消费。
**输入**：步骤 1（list-iam-files）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 3（scan-wildcards）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 3: scan-wildcards

**目标**：对输入做结构化梳理（scan-wildcards），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：步骤 2（read-iam-policies）的输出。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 4（scan-admin-access）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 4: scan-admin-access

**目标**：对输入做结构化梳理（scan-admin-access），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：步骤 3（scan-wildcards）的输出。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 5（llm-review）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 5: llm-review

**目标**：对输入做结构化梳理（llm-review），产出后续步骤可直接消费的发现清单与关键约束。
**输入**：步骤 4（scan-admin-access）的输出。
**输出**：结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。供步骤 6（format-output）消费。
**失败处理**：输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。

### 步骤 6: format-output

**目标**：把前序步骤成果整理为约定格式的最终交付物（format-output）。
**输入**：步骤 5（llm-review）的输出。
**输出**：按目标受众组织的最终交付物，附关键数据与决策依据的引用。作为工作流最终交付的一部分。
**失败处理**：交付物缺关键信息时回溯对应步骤补齐，而不是在交付物里含糊带过。

## 输入参数

- `targetPath` (string, **必填**) — IAM 策略文件路径（Terraform / JSON / YAML）
- `cloudProvider` (string, 可选) 取值: aws/azure/gcp/tencent-cloud 默认: `"aws"`
- `strictness` (string, 可选) 取值: strict/moderate/permissive — 审查严格度：strict=最小权限 / moderate=合理授权 / permissive=仅标记高风险 默认: `"moderate"`

## 输出

- `passed` (boolean, 可选)
- `totalPolicies` (number, 可选)
- `riskPolicies` (number, 可选)
- `findings` (array, 可选)

## 错误处理
策略: `continue`
- fallback: `llm-review` → skip-partial

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
