---
id: iam-core-concepts
type: atomic-skill
title: IAM Core Concepts
nameZh: IAM 核心概念
domain: security
tags: security, iam, cloud, identity, access-control
catalogSource: internal
catalogFile: atomic-skills/iam-core-concepts.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# IAM 核心概念
> 掌握云 IAM 的身份 / 主体 / 策略 / 角色 / 权限 / 信任关系核心模型。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `provider` (any, **必填**) 取值: aws/gcp/azure/k8s
- `principalType` (any, 可选) 取值: user/role/service-account/group
## 输出
- `policyDocument` (object, 可选)
- `attachments` (array, 可选)
## 核心要点

IAM 是云的引力场：理解 Identity / Principal / Policy / Role / Trust 五件套，才能在多账号中飞行。

## 关键要点

- Identity Policy（attached to who）vs Resource Policy（attached to what）
- Role + AssumeRole 替代长期 access key
- Service Linked Role 是云原生集成的关键
- condition 字段控制时间 / IP / MFA
- 策略求交：deny 永远胜出

## 最佳实践

- IAM Access Analyzer 持续审视
- 所有人类身份接 SSO + MFA
- 机器身份用 IAM Roles for Service Accounts (IRSA) 或 Workload Identity
- 权限分层：admin / operator / readonly

## 反模式

- ❌ 给 EC2 / Pod 直接 root admin
- ❌ * on * 的 wildcard 策略
- ❌ IAM user 多于 role，credential 散落
- ❌ condition 写错导致默认放行

## 分级掌握

- **Junior**: 能读懂常见 policy json
- **Mid**: 能写最小权限策略 + AssumeRole 跨账号
- **Senior**: 能设计组织级 IAM 架构与持续治理

## 参考资源

- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html) — doc
- [GCP IAM Concepts](https://cloud.google.com/iam/docs/overview) — doc
- [Azure RBAC](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview) — doc

## 相关 Skills
_见所属 composite skill 或 role_