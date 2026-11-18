---
source: skills-sh
sourceUrl: https://www.skills.sh/microsoft/azure-skills/azure-deploy
title: azure-deploy
nameZh: Azure 部署
category: Microsoft Azure官方
tags: [Microsoft, Microsoft Azure官方, 官方]
rank: 12
---
# azure-deploy（Azure 部署）

> 对已就绪的 azd 应用执行 Azure 部署

## 概述

Execute Azure deployments for ALREADY-PREPARED applications that have existing .azure/deployment-plan.md and infrastructure files. DO NOT use this skill when…

## 使用场景

- Requires `.azure/plan.md` with `Validated` status from azure-validate and azure-prepare skills; will not proceed without both prerequisites
- Executes `azd up`, `azd deploy`, `terraform apply`, and `az deployment` commands with error handling and post-deployment verification
- Includes pre-deploy checklist, recipe-based deployment workflows, and post-deploy configuration for SQL managed identity and Entity Framework migrations
- Supports applications with API Management gateway infrastructure created during preparation phase

## 能力说明

Execute Azure deployments for prepared applications with built-in error recovery and validation.
- Requires `.azure/plan.md` with `Validated` status from azure-validate and azure-prepare skills; will not proceed without both prerequisites
- Executes `azd up`, `azd deploy`, `terraform apply`, and `az deployment` commands with error handling and post-deployment verification
- Includes pre-deploy checklist, recipe-based deployment workflows, and post-deploy configuration for SQL managed identity and Entity Framework migrations
- Supports applications with API Management gateway infrastructure created during preparation phase
SKILL.md
AUTHORITATIVE GUIDANCE — MANDATORY COMPLIANCE
PREREQUISITE: The azure-validate skill MUST be invoked and completed with status `Validated` BEFORE executing this skill.

## 风险与注意事项

暂无来源说明

## 参考链接

- 原文：https://www.skills.sh/microsoft/azure-skills/azure-deploy
- 仓库：https://github.com/microsoft/azure-skills
- 指标：安装数 468.5K，GitHub Stars 1.3K
