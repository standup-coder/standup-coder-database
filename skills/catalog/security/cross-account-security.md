---
id: cross-account-security
type: atomic-skill
title: Cross-Account Security
nameZh: 跨账号安全
domain: security
tags: security, cross-account, iam, aws-organizations, scp
catalogSource: internal
catalogFile: atomic-skills/cross-account-security.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 跨账号安全
> 基于 assume-role 与 SCP 护栏设计安全的跨账号访问与资源共享。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `source` (string, **必填**)
- `target` (string, **必填**)
- `pattern` (string, 可选) 取值: assume-role/resource-policy/ram/lake-formation
## 输出
- `trustPolicy` (object, 可选)
- `scpPolicy` (object, 可选)
- `sharedResources` (array, 可选)
## 核心要点

多账号架构是云安全护栏的"基石"；跨账号设计的核心是 trust + condition + SCP 三层叠加，不能只靠 trust policy。

## 关键要点

- ExternalId 防 confused deputy
- Source IP / VPC condition 进一步约束
- SCP 是组织级"不可越过"护栏
- AWS RAM > 资源策略复杂度低
- 一切跨账号走 IaC 不手工

## 最佳实践

- per-tenant ExternalId 不复用
- SCP 写"deny *:*" 例外白名单
- cross-account log 集中到 security account
- 定期审 trust policy 漂移

## 反模式

- ❌ 没有 ExternalId 的 trust policy
- ❌ SCP 不写靠 IAM 做护栏
- ❌ 资源策略 Principal *
- ❌ 日志 / 监控数据散在各业务账号

## 分级掌握

- **Junior**: 能配置基础 assume-role
- **Mid**: 能设计 SCP + trust 多层护栏
- **Senior**: 能驱动组织级 multi-account landing zone 战略

## 参考资源

- [AWS Cross-Account Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html) — doc
- [AWS Confused Deputy](https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html) — doc
- [AWS Organizations SCP](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) — doc

## 相关 Skills
_见所属 composite skill 或 role_