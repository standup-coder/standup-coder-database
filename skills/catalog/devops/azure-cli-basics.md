---
id: azure-cli-basics
type: atomic-skill
title: Azure CLI Basics
nameZh: Azure CLI 基础
domain: devops
tags: azure, cli, cloud, devops, automation
catalogSource: internal
catalogFile: atomic-skills/azure-cli-basics.json
catalogAddedAt: 2026-07-26
operation: devops
level: junior
---

# Azure CLI 基础
> 使用 Azure CLI 管理 Azure 资源，支撑脚本化与自动化。
## 操作语义
- 类型: devops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `service` (string, **必填**)
- `action` (string, **必填**)
- `subscription` (string, 可选)
## 输出
- `result` (object, 可选)
- `exitCode` (number, 可选)
## 核心要点

Azure CLI 与 AWS CLI 模式同构，但 RBAC 与 Resource Group 边界是 Azure 独有的概念门槛。

## 关键要点

- az login + az account set --subscription
- Resource Group 是部署单位与权限边界
- --query 用 JMESPath，--output table 适合 ad-hoc
- Service Principal 替代长期密钥
- az bicep 与 ARM template 配合使用

## 最佳实践

- 用 Managed Identity 替代凭据
- CLI 命令固化进 scripts 与 CI
- 危险操作 --dry-run / what-if
- tag 命名规范便于成本归属

## 反模式

- ❌ 全局 admin 用户日常使用
- ❌ 把 SP 凭据写入仓库
- ❌ 订阅 / RG 命名混乱难治理
- ❌ 命令脚本无版本控制

## 分级掌握

- **Junior**: 能跑常用资源管理命令
- **Mid**: 能用 SP / Managed Identity / 脚本化
- **Senior**: 能制定云资源治理与命名 / RBAC 规范

## 参考资源

- [Azure CLI docs](https://learn.microsoft.com/en-us/cli/azure/) — doc
- [Azure RBAC](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview) — doc

## 相关 Skills
_见所属 composite skill 或 role_