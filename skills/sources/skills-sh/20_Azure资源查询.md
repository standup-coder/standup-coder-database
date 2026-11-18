---
source: skills-sh
sourceUrl: https://www.skills.sh/microsoft/azure-skills/azure-resource-lookup
title: azure-resource-lookup
nameZh: Azure 资源查询
category: Microsoft Azure官方
tags: [Microsoft, Microsoft Azure官方, 官方]
rank: 20
---
# azure-resource-lookup（Azure 资源查询）

> 跨订阅、资源组列出、查找并展示 Azure 资源

## 概述

List, find, and show Azure resources across subscriptions or resource groups. Handles prompts like "list the websites in my subscription", "list my web apps",…

## 使用场景

- List resources of any type (VMs, web apps, storage accounts, container apps, databases, etc.)
- Show resources in a specific subscription or resource group
- Query resources across multiple subscriptions or resource types
- Find orphaned resources (unattached disks, unused NICs, idle IPs)
- Discover resources missing required tags or configurations
- Get a resource inventory spanning multiple types

## 能力说明

Fast discovery and inventory of Azure resources across subscriptions using Resource Graph queries.
- Queries any Azure resource type (VMs, storage accounts, web apps, container apps, Key Vaults, etc.) across subscriptions and resource groups in a single command
- Supports cross-cutting searches for orphaned resources, missing tags, unhealthy states, and resource inventory counts
- Routes single-resource-type queries to dedicated MCP tools when available; falls back to Azure Resource Graph for broader or unsupported resource types
- Uses KQL (Kusto Query Language) for flexible filtering, with built-in error handling for authorization, syntax, and scope issues
SKILL.md
List, find, and discover Azure resources of any type across subscriptions and resource groups. Use Azure Resource Graph (ARG) for fast, cross-cutting queries when dedicated MCP tools don't cover the resource type.
Use this skill when the user wants to:
- List resources of any type (VMs, web apps, storage accounts, container apps, databases, etc.)
- Show resources in a specific subscription or resource group
- Query resources across multiple subscriptions or resource types
- Find orphaned resources (unattached disks, unused NICs, idle IPs)

## 风险与注意事项

暂无来源说明

## 参考链接

- 原文：https://www.skills.sh/microsoft/azure-skills/azure-resource-lookup
- 仓库：https://github.com/microsoft/azure-skills
- 指标：安装数 467.0K，GitHub Stars 1.3K
