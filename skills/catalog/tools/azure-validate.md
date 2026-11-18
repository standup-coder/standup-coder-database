---
type: external
source: skills-sh
sourceUrl: https://www.skills.sh/microsoft/azure-skills/azure-validate
title: azure-validate
nameZh: Azure 校验
category: Microsoft Azure官方
tags: [Microsoft, Microsoft Azure官方, 官方]
rank: 16
id: azure-validate
domain: tools
domainLabel: Azure
catalogSource: skills-sh
catalogFile: 16_Azure校验.md
catalogAddedAt: 2026-07-26
---
# azure-validate（Azure 校验）

> 部署前对配置、基础设施做深度就绪校验

## 概述

Pre-deployment validation for Azure readiness. Run deep checks on configuration, infrastructure (Bicep or Terraform), RBAC role assignments, managed identity…

## 使用场景

- Runs recipe-specific validation commands including Bicep builds, Terraform validation, and Azure CLI preflight checks
- Verifies RBAC role assignments in infrastructure code and managed identity permissions before deployment
- Requires `.azure/deployment-plan.md` from azure-prepare skill; records validation proof and updates plan status to `Validated` only after all checks pass
- Integrates into the three-step workflow: azure-prepare → azure-validate → azure-deploy

## 能力说明

Pre-deployment validation for Azure readiness with configuration, infrastructure, RBAC, and identity checks.
- Runs recipe-specific validation commands including Bicep builds, Terraform validation, and Azure CLI preflight checks
- Verifies RBAC role assignments in infrastructure code and managed identity permissions before deployment
- Requires `.azure/deployment-plan.md` from azure-prepare skill; records validation proof and updates plan status to `Validated` only after all checks pass
- Integrates into the three-step workflow: azure-prepare → azure-validate → azure-deploy
SKILL.md
AUTHORITATIVE GUIDANCE — Follow these instructions exactly unless they contradict security policies given to you.
⛔ STOP — PREREQUISITE CHECK REQUIRED
Before proceeding, verify this prerequisite is met:
azure-prepare was invoked and completed → `.azure/deployment-plan.md` exists with status `Approved` or later
If the plan is missing, STOP IMMEDIATELY and invoke azure-prepare first.
The complete workflow ensures success:

## 风险与注意事项

暂无来源说明

## 参考链接

- 原文：https://www.skills.sh/microsoft/azure-skills/azure-validate
- 仓库：https://github.com/microsoft/azure-skills
- 指标：安装数 467.4K，GitHub Stars 1.3K
