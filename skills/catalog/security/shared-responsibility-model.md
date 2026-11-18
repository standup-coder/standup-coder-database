---
id: shared-responsibility-model
type: atomic-skill
title: Shared Responsibility Model
nameZh: 共担责任模型
domain: security
tags: security, shared-responsibility, cloud, governance, iaas
catalogSource: internal
catalogFile: atomic-skills/shared-responsibility-model.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 共担责任模型
> 应用云共担责任模型，清晰划分云厂商与租户在不同层的安全责任。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `service` (string, **必填**)
- `model` (string, 可选) 取值: iaas/paas/saas
## 输出
- `customerDuties` (array, 可选)
- `providerDuties` (array, 可选)
- `gaps` (array, 可选)
## 核心要点

出事时永远不是"云厂商的锅"——配置 / 数据 / 身份这三件事永远在你这边；把责任清单贴到入职 onboarding 文档里。

## 关键要点

- IaaS / PaaS / SaaS 责任边界递进
- 数据与身份永远是租户责任
- 物理安全永远是 provider
- patch 责任随服务模式变化
- AWS / Azure / GCP 表述略有差异

## 最佳实践

- 每服务做 responsibility map
- onboarding 必看共担责任图
- 事故复盘明确归属
- 审计前先核对 provider attestation

## 反模式

- ❌ 以为 SaaS 就不需要做 IAM
- ❌ EC2 把 OS patch 当 AWS 责任
- ❌ 数据丢了找云厂商
- ❌ serverless 不再做 input validation

## 分级掌握

- **Junior**: 能解释 IaaS / PaaS / SaaS 边界
- **Mid**: 能落地 responsibility map 到团队
- **Senior**: 能驱动组织级共担责任治理与跨云对齐

## 参考资源

- [AWS Shared Responsibility](https://aws.amazon.com/compliance/shared-responsibility-model/) — doc
- [Azure Shared Responsibility](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility) — doc
- [GCP Shared Responsibility](https://cloud.google.com/architecture/framework/security/shared-responsibility-shared-fate) — doc

## 相关 Skills
_见所属 composite skill 或 role_