---
id: gitops-workflow
type: atomic-skill
title: GitOps Workflow
nameZh: GitOps 工作流
domain: devops
tags: ops, gitops, argocd, flux, k8s
catalogSource: internal
catalogFile: atomic-skills/gitops-workflow.json
catalogAddedAt: 2026-07-26
operation: ops
level: mid
---

# GitOps 工作流
> 实施 GitOps 工作流：Git 是基础设施与应用状态的唯一真相。
## 操作语义
- 类型: ops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `repo` (string, **必填**)
- `tool` (string, 可选) 取值: argocd/flux/jenkins-x
- `pattern` (string, 可选) 取值: mono-repo/multi-repo/app-of-apps
## 输出
- `config` (object, 可选)
- `syncStatus` (object, 可选)
- `drift` (array, 可选)
## 核心要点

GitOps 不是"用 Git 部署"，是"集群状态由 Git 单向推动"；任何 kubectl apply 直改集群都是反模式。

## 关键要点

- declarative > imperative
- pull > push（agent 主动同步）
- app-of-apps 控制 sprawl
- sealed secret / SOPS 解决 secret 入 Git
- drift detection + auto-heal

## 最佳实践

- ArgoCD app-of-apps + Helm values 分离
- PR-based 变更 + 自动化测试
- sync wave 控制启动顺序
- RBAC 限制谁能改 production

## 反模式

- ❌ kubectl apply 绕过 GitOps
- ❌ secret 明文入库
- ❌ auto-sync 无 review 直接 prod
- ❌ 一个 ArgoCD 跨多 cluster 不分租户

## 分级掌握

- **Junior**: 能用 ArgoCD 部署单 app
- **Mid**: 能落地 app-of-apps + sealed secret + RBAC
- **Senior**: 能驱动组织级 GitOps 战略与多 cluster 治理

## 参考资源

- [OpenGitOps Principles](https://opengitops.dev/) — doc
- [ArgoCD](https://argo-cd.readthedocs.io/) — doc
- [Flux](https://fluxcd.io/flux/) — doc

## 相关 Skills
_见所属 composite skill 或 role_