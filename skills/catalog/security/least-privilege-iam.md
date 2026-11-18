---
id: least-privilege-iam
type: atomic-skill
title: Least Privilege IAM
nameZh: 最小权限 IAM
domain: security
tags: iam, least-privilege, policy-as-code, aws, gcp
catalogSource: internal
catalogFile: atomic-skills/least-privilege-iam.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 最小权限 IAM
> 通过 policy-as-code 与持续审计落地最小权限 IAM。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `identity` (string, **必填**)
- `cloud` (string, 可选) 取值: aws/azure/gcp
- `observationDays` (number, 可选) 默认: `30`
## 输出
- `recommendedPolicy` (object, 可选)
- `removedPermissions` (array, 可选)
- `riskBefore` (number, 可选)
- `riskAfter` (number, 可选)
## 核心要点

最小权限不是一次性收敛，而是观察 → 收敛 → 再观察的循环；过度收敛会引发 prod 故障，过度宽松会引发数据泄漏。

## 关键要点

- 先 audit 30 天再收敛
- IAM Access Analyzer / GCP Recommender 自动建议
- permission boundary 限制 escalation
- session policy 做即时收敛
- 区分 human / service identity

## 最佳实践

- policy-as-code（Terraform + OPA）
- service control policy 做账号级护栏
- cross-account 用 role 不用 long-lived key
- 权限变更走 PR review

## 反模式

- ❌ "*:*" 临时加上忘了删
- ❌ 一个 role 多 service 复用
- ❌ 不用 boundary，开发可自己提权
- ❌ service account key 长期常驻

## 分级掌握

- **Junior**: 能写基础 IAM policy
- **Mid**: 能用 Access Analyzer 收敛权限
- **Senior**: 能驱动组织级 least-privilege 与 SCP 治理

## 参考资源

- [AWS IAM Access Analyzer](https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html) — doc
- [GCP IAM Recommender](https://cloud.google.com/iam/docs/recommender-overview) — doc
- [Cloud Security Alliance IAM](https://cloudsecurityalliance.org/research/topics/identity-access-management) — doc

## 相关 Skills
_见所属 composite skill 或 role_