---
id: cspm-tools
type: atomic-skill
title: CSPM Tools
nameZh: 云安全态势管理工具
domain: security
tags: cloud-security, cspm, posture, misconfig, compliance
catalogSource: internal
catalogFile: atomic-skills/cspm-tools.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 云安全态势管理工具
> 使用 CSPM 工具持续检测与修复云资源配置缺陷。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `cloud` (string, **必填**) 取值: aws/azure/gcp/multi
- `tool` (string, 可选) 取值: prisma-cloud/wiz/orca/aws-config/cloud-custodian
- `framework` (string, 可选) 取值: cis/nist/soc2/pci
## 输出
- `findings` (array, 可选)
- `severityCounts` (object, 可选)
- `remediationPlan` (string, 可选)
## 核心要点

CSPM 不是又一个扫描器，而是把云配置基线变成持续审计；选型看的是「能不能落地修复」而非告警数量。

## 关键要点

- agentless 优先，agent 仅用于 runtime
- finding 必须打 owner 标签否则没人修
- 区分 misconfig vs vulnerability
- 与 IaC（Terraform / CFN）回写形成闭环
- 基线对齐 CIS Benchmarks

## 最佳实践

- 每条 finding 自动开 ticket 到 owner team
- 高危按 SLA 自动升级
- 把 P1 finding 接到 release gate
- 定期做"漏洞老化"分析

## 反模式

- ❌ 告警一万条，修复零条
- ❌ CSPM 只看 dashboard 不接 ticket 流
- ❌ 用 CSPM 替代 IaC 静态扫描

## 分级掌握

- **Junior**: 能跑 CSPM 扫描看 dashboard
- **Mid**: 能联通 ticketing + IaC 修复闭环
- **Senior**: 能驱动组织级云安全基线治理与 SLA 体系

## 参考资源

- [Wiz Cloud Security Atlas](https://www.wiz.io/academy) — doc
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks) — doc
- [Cloud Custodian](https://cloudcustodian.io/) — doc

## 相关 Skills
_见所属 composite skill 或 role_