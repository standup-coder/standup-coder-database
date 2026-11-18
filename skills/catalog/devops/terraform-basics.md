---
id: terraform-basics
type: atomic-skill
title: Terraform Basics
nameZh: Terraform 基础
domain: devops
tags: iac, terraform, cloud, provisioning, devops
catalogSource: internal
catalogFile: atomic-skills/terraform-basics.json
catalogAddedAt: 2026-07-26
operation: devops
level: junior
---

# Terraform 基础
> 使用 Terraform 声明式管理云资源：provider / resource / module / state / 远端 backend。
## 操作语义
- 类型: devops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `provider` (any, **必填**) 取值: aws/azurerm/google/kubernetes/multi
- `module` (string, 可选) — 模块名或路径
- `backend` (any, 可选) 取值: local/s3/gcs/azurerm/remote 默认: `"s3"`
## 输出
- `plan` (string, 可选)
- `tfFiles` (array, 可选)
- `applyResult` (object, 可选)
## 核心要点

Terraform 的核心痛点不是语法，而是状态管理：state 一坏，整朵云都疼。

## 关键要点

- 永远使用远端 backend + state lock
- 生产环境禁用 local state
- 模块化复用，但避免过度抽象
- plan 必须人工 review 后再 apply
- sensitive 字段标记 + secret 不入 state

## 最佳实践

- Atlantis / Terraform Cloud / Spacelift 做 PR-based 流程
- tfsec / checkov 做安全扫
- workspace 隔离 dev/stg/prod
- 版本化 provider 和 module，避免 drift

## 反模式

- ❌ 多人共用一份 local state
- ❌ 直接在控制台改资源（带外变更）
- ❌ apply --auto-approve 在生产
- ❌ secret 写在 .tf 文件入 git

## 分级掌握

- **Junior**: 能读懂并修改既有 module
- **Mid**: 能设计模块化布局、远端 state、CI/CD 流程
- **Senior**: 能制定全公司 IaC 规范、合规扫描、漂移治理

## 参考资源

- [Terraform Best Practices (Gruntwork)](https://www.terraform-best-practices.com/) — doc
- [HashiCorp 官方文档](https://developer.hashicorp.com/terraform/docs) — doc
- [tfsec](https://aquasecurity.github.io/tfsec/) — doc

## 相关 Skills
_见所属 composite skill 或 role_