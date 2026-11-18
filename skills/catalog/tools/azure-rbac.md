---
type: external
source: skills-sh
sourceUrl: https://www.skills.sh/microsoft/azure-skills/azure-rbac
title: azure-rbac
nameZh: Azure RBAC
category: Microsoft Azure官方
tags: [Microsoft, Microsoft Azure官方, 官方]
rank: 24
id: azure-rbac
domain: tools
domainLabel: Azure
catalogSource: skills-sh
catalogFile: 24_AzureRBAC.md
catalogAddedAt: 2026-07-26
---
# azure-rbac（Azure RBAC）

> 为身份推荐最小权限的 Azure RBAC 角色并配置

## 概述

Helps users find the right Azure RBAC role for an identity with least privilege access, then generate CLI commands and Bicep code to assign it. Also provides…

## 使用场景

- Identifies built-in roles matching desired permissions using Azure documentation, or creates custom role definitions when no built-in role fits
- Generates Azure CLI commands and Bicep code snippets for assigning roles to identities, service principals, and managed identities
- Clarifies prerequisites for granting roles, including which permissions (`Microsoft.Authorization/roleAssignments/write`) are required and recommends least-privilege options like User Access Administrator
- Supports least-privilege access patterns by matching specific permission requirements rather than defaulting to broad roles

## 能力说明

Find minimal Azure RBAC roles, generate assignment commands, and provide Bicep infrastructure code.
- Identifies built-in roles matching desired permissions using Azure documentation, or creates custom role definitions when no built-in role fits
- Generates Azure CLI commands and Bicep code snippets for assigning roles to identities, service principals, and managed identities
- Clarifies prerequisites for granting roles, including which permissions (`Microsoft.Authorization/roleAssignments/write`) are required and recommends least-privilege options like User Access Administrator
- Supports least-privilege access patterns by matching specific permission requirements rather than defaulting to broad roles

## 风险与注意事项

暂无来源说明

## 参考链接

- 原文：https://www.skills.sh/microsoft/azure-skills/azure-rbac
- 仓库：https://github.com/microsoft/azure-skills
- 指标：安装数 463.9K，GitHub Stars 1.3K
