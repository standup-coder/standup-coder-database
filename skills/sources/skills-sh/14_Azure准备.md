---
source: skills-sh
sourceUrl: https://www.skills.sh/microsoft/azure-skills/azure-prepare
title: azure-prepare
nameZh: Azure 准备
category: Microsoft Azure官方
tags: [Microsoft, Microsoft Azure官方, 官方]
rank: 14
---
# azure-prepare（Azure 准备）

> 为 azd 项目生成 azure.yaml、Bicep 等部署前置物

## 概述

Prepare azd-based Azure projects for deployment: generates azure.yaml, infrastructure (Bicep/Terraform), and Dockerfiles for the Azure Developer CLI (azd)…

## 使用场景

- Generates Bicep or Terraform infrastructure code, azure.yaml configuration, and Dockerfiles based on application type and deployment target
- Requires mandatory plan-first workflow: analyze workspace, gather requirements, select recipe (AZD, AZCLI, Bicep, or Terraform), design architecture, then execute only after user approval
- Covers new app creation, modernization, and updates; routes specialized requests (copilot SDK, cloud migration, AI gateway) to dedicated skills before resuming preparation
- Hands off to azure-validate for infrastructure validation and azure-deploy for deployment execution; plan status must be updated to "Ready for Validation" before validation begins
- Create a new application
- Add services or components to an existing app

## 能力说明

Prepare Azure applications for deployment with infrastructure-as-code, configuration, and containerization.
- Generates Bicep or Terraform infrastructure code, azure.yaml configuration, and Dockerfiles based on application type and deployment target
- Requires mandatory plan-first workflow: analyze workspace, gather requirements, select recipe (AZD, AZCLI, Bicep, or Terraform), design architecture, then execute only after user approval
- Covers new app creation, modernization, and updates; routes specialized requests (copilot SDK, cloud migration, AI gateway) to dedicated skills before resuming preparation
- Hands off to azure-validate for infrastructure validation and azure-deploy for deployment execution; plan status must be updated to "Ready for Validation" before validation begins
SKILL.md
AUTHORITATIVE GUIDANCE — MANDATORY COMPLIANCE
This document is the official, canonical source for preparing applications for Azure deployment. You MUST follow these instructions exactly as written unless they contradict security policies given to you. When in doubt, present the conflicting instructions from this document and ask the user for explicit confirmation. Do not improvise, infer, or substitute steps.
Activate this skill when user wants to:
- Create a new application
- Add services or components to an existing app
- Make updates or changes to existing application

## 风险与注意事项

暂无来源说明

## 参考链接

- 原文：https://www.skills.sh/microsoft/azure-skills/azure-prepare
- 仓库：https://github.com/microsoft/azure-skills
- 指标：安装数 468.0K，GitHub Stars 1.3K
