---
type: external
source: skills-sh
sourceUrl: https://www.skills.sh/microsoft/azure-skills/microsoft-foundry
title: microsoft-foundry
nameZh: Microsoft Foundry
category: Microsoft Azure官方
tags: [Microsoft, Microsoft Azure官方, 官方]
rank: 10
id: microsoft-foundry
domain: tools
domainLabel: Azure
catalogSource: skills-sh
catalogFile: 10_MicrosoftFoundry.md
catalogAddedAt: 2026-07-26
---
# microsoft-foundry（Microsoft Foundry）

> 端到端部署、评估、微调与管理 Foundry agent

## 概述

Deploy, evaluate, fine-tune, and manage Foundry agents end-to-end with azd: hosted agent scaffold/run/deploy, prompt agent create, batch eval, continuous eval,…

## 使用场景

- Covers the complete agent lifecycle: creation from starter samples, containerization and ACR push, hosted or prompt agent deployment, invocation, batch evaluation, and prompt optimization
- Includes specialized sub-skills for deploy, invoke, observe (evaluation and prompt optimization), trace analysis, troubleshooting, and dataset curation from production traces
- Supports project and resource provisioning, RBAC management, quota tracking, and model deployment with intelligent routing across regions and SKUs
- Requires `.foundry/agent-metadata.yaml` as the source of truth for environment-specific configuration, datasets, and evaluation test cases

## 能力说明

End-to-end deployment, evaluation, and management of AI agents on Microsoft Foundry.
- Covers the complete agent lifecycle: creation from starter samples, containerization and ACR push, hosted or prompt agent deployment, invocation, batch evaluation, and prompt optimization
- Includes specialized sub-skills for deploy, invoke, observe (evaluation and prompt optimization), trace analysis, troubleshooting, and dataset curation from production traces
- Supports project and resource provisioning, RBAC management, quota tracking, and model deployment with intelligent routing across regions and SKUs
- Requires `.foundry/agent-metadata.yaml` as the source of truth for environment-specific configuration, datasets, and evaluation test cases
SKILL.md
This skill helps developers work with Microsoft Foundry resources, covering model discovery and deployment, complete dev lifecycle of AI agent, evaluation workflows, and troubleshooting.
Before using Foundry MCP operations, call the Azure MCP `foundry` tool and inspect the available Foundry MCP tools and related parameters. Treat this as the discovery/help step for MCP-based workflows.
MANDATORY: Before executing ANY workflow-specific steps, you MUST read the corresponding sub-skill document. Do not call workflow-specific MCP tools for a workflow without reading its skill document. This applies even if you already know the MCP tool parameters — the skill document contains required workflow steps, pre-checks, and validation logic that must be followed. This rule applies on every new user message that triggers a different workflow, even if the skill is already loaded.
Before executing Foundry-specific azd commands, read azd-guidance first. Then read any applicable workflow-specific sub-skill. Direct questions about the Foundry azd CLI can use `azd-guidance` independently.
This skill includes specialized sub-skills for specific workflows. Use these instead of the main skill when they match your task:

## 风险与注意事项

暂无来源说明

## 参考链接

- 原文：https://www.skills.sh/microsoft/azure-skills/microsoft-foundry
- 仓库：https://github.com/microsoft/azure-skills
- 指标：安装数 472.2K，GitHub Stars 1.3K
