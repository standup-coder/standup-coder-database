---
id: compliance
type: atomic-skill
title: Compliance Management
nameZh: 合规管理
domain: security
tags: compliance, governance, audit, soc2, gdpr
catalogSource: internal
catalogFile: atomic-skills/compliance.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 合规管理
> 把内部控制映射到 SOC2 / ISO27001 / GDPR / HIPAA 等合规框架，收集证据准备审计。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `framework` (any, **必填**) 取值: soc2/iso27001/gdpr/hipaa/pci-dss/iso27701
- `stage` (any, 可选) 取值: readiness/pre-audit/audit/remediation
- `scope` (string, 可选)
## 输出
- `controlMapping` (object, 可选)
- `evidence` (array, 可选)
- `gaps` (array, 可选)
## 核心要点

合规不是审计前突击，而是把 control 嵌入工程日常，让证据自然生成。

## 关键要点

- Control 是手段，evidence 是证明
- SOC2 五原则：Security / Availability / Confidentiality / Processing Integrity / Privacy
- compliance-as-code：control 自动化采样
- data residency / 数据出境是 GDPR 重点
- 员工培训 + 入离职流程是审计常见缺口

## 最佳实践

- 用 Drata / Vanta / Secureframe 做持续合规
- 每 control 指派 owner + due date
- 把证据收集嵌入 CI/CD 与 IaC
- 年审之前做 mock audit

## 反模式

- ❌ 审计前两周突击搞 evidence
- ❌ policy 写得很美但工程根本没落实
- ❌ 把合规当 security 全部，忽视实际威胁
- ❌ 不同框架重复劳动而不复用 control

## 分级掌握

- **Junior**: 能按 checklist 收集 evidence
- **Mid**: 能映射 control、补 gap、协调 audit
- **Senior**: 能搭多框架合规体系、compliance-as-code 与文化建设

## 参考资源

- [AICPA SOC 2 Trust Services Criteria](https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2) — doc
- [GDPR official text](https://gdpr-info.eu/) — doc
- [compliance-as-code (Cloud Custodian)](https://cloudcustodian.io/) — doc

## 相关 Skills
_见所属 composite skill 或 role_