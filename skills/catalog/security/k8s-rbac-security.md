---
id: k8s-rbac-security
type: atomic-skill
title: Kubernetes RBAC Security
nameZh: K8s RBAC 安全
domain: security
tags: kubernetes, rbac, least-privilege, authorization, security
catalogSource: internal
catalogFile: atomic-skills/k8s-rbac-security.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# K8s RBAC 安全
> 设计与审计 K8s RBAC 策略，强制最小权限。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `cluster` (string, **必填**)
- `namespace` (string, 可选)
- `auditMode` (string, 可选) 取值: static/live
## 输出
- `roles` (array, 可选)
- `bindings` (array, 可选)
- `overprivileged` (array, 可选)
- `recommendations` (array, 可选)
## 核心要点

K8s RBAC 写起来容易，写对很难；80% 集群存在 cluster-admin 滥用，最小权限要靠工具持续审计而非人脑。

## 关键要点

- Role vs ClusterRole 默认选 Role
- 聚合 ClusterRole 用于复用
- wildcard verbs / resources 是反模式
- ServiceAccount 一对一绑定 Role
- 审计要看 audit log + RBAC 引用图

## 最佳实践

- 用 audit2rbac 从日志生成最小 RBAC
- rakkess / kubectl-who-can 做 RBAC 可视化
- 禁用默认 ServiceAccount auto-mount
- PR 模板要求列出新增权限

## 反模式

- ❌ 给应用 cluster-admin 图省事
- ❌ "verbs: [*]" 出现在生产
- ❌ 一个 SA 多 namespace 复用
- ❌ RoleBinding 漂移与代码不一致

## 分级掌握

- **Junior**: 能写基础 Role / RoleBinding
- **Mid**: 能审计与收敛过宽权限
- **Senior**: 能驱动 RBAC 治理与最小权限文化

## 参考资源

- [K8s RBAC docs](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) — doc
- [audit2rbac](https://github.com/liggitt/audit2rbac) — doc
- [rakkess](https://github.com/corneliusweig/rakkess) — doc

## 相关 Skills
_见所属 composite skill 或 role_