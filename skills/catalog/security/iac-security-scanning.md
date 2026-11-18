---
id: iac-security-scanning
type: atomic-skill
title: IaC Security Scanning
nameZh: IaC 安全扫描
domain: security
tags: iac, terraform, security-scanning, shift-left, devsecops
catalogSource: internal
catalogFile: atomic-skills/iac-security-scanning.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# IaC 安全扫描
> 在 apply 前静态扫描 Terraform / CFN / K8s manifest 的安全配置缺陷。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `path` (string, **必填**)
- `tool` (string, 可选) 取值: checkov/tfsec/kics/trivy-config/snyk-iac
- `severity` (string, 可选) 取值: low/medium/high/critical
## 输出
- `violations` (array, 可选)
- `sarif` (string, 可选)
- `fixSuggestions` (array, 可选)
## 核心要点

IaC 扫描是 shift-left 的最高 ROI 节点：在 PR 阶段拦下 90% 云配置漏洞，比 runtime 修复便宜 100 倍。

## 关键要点

- PR 阶段扫描，failed → 阻塞合并
- 区分 advisory（提示）vs blocking（阻塞）
- 自定义策略覆盖业务约束
- SARIF 格式上 GitHub Code Scanning
- 与 OPA / Rego 共用策略

## 最佳实践

- Checkov + tfsec 组合提高召回
- 基线规则按 severity 分级渐进推进
- 每条违规附 remediation snippet
- 把 baseline 文件入库管理 false positive

## 反模式

- ❌ 只扫 main 分支不扫 PR
- ❌ severity 阈值过宽，开发被告警淹没
- ❌ 扫描结果不接 review，永远 advisory

## 分级掌握

- **Junior**: 能在 CI 跑 Checkov / tfsec
- **Mid**: 能写自定义策略并控制 false positive
- **Senior**: 能驱动组织级 IaC 安全 baseline 与 OPA 治理

## 参考资源

- [Checkov](https://www.checkov.io/) — doc
- [tfsec](https://aquasecurity.github.io/tfsec/) — doc
- [KICS](https://docs.kics.io/) — doc

## 相关 Skills
_见所属 composite skill 或 role_