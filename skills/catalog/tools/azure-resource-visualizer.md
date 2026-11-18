---
type: external
source: skills-sh
sourceUrl: https://www.skills.sh/microsoft/azure-skills/azure-resource-visualizer
title: azure-resource-visualizer
nameZh: Azure 资源可视化
category: Microsoft Azure官方
tags: [Microsoft, Microsoft Azure官方, 官方]
rank: 23
id: azure-resource-visualizer
domain: tools
domainLabel: Azure
catalogSource: skills-sh
catalogFile: 23_Azure资源可视化.md
catalogAddedAt: 2026-07-26
---
# azure-resource-visualizer（Azure 资源可视化）

> 分析资源组并生成 Mermaid 架构图

## 概述

Analyze Azure resource groups and generate detailed Mermaid architecture diagrams showing the relationships between individual resources. WHEN: create…

## 使用场景

- Discovers all resources within a resource group and analyzes their configurations, dependencies, and interconnections
- Generates Mermaid diagrams organized by logical layers (Network, Compute, Data, Security, Monitoring) with SKU details and connection labels
- Maps relationships including network connections, data flows, identity bindings, and configuration dependencies across resources
- Creates comprehensive markdown documentation with resource inventory tables, architecture diagrams, and relationship explanations
- Resource Group Discovery: List available resource groups when not specified
- Deep Resource Analysis: Examine all resources, their configurations, and interdependencies

## 能力说明

Transform Azure resource groups into detailed architecture diagrams showing resource relationships and configurations.
- Discovers all resources within a resource group and analyzes their configurations, dependencies, and interconnections
- Generates Mermaid diagrams organized by logical layers (Network, Compute, Data, Security, Monitoring) with SKU details and connection labels
- Maps relationships including network connections, data flows, identity bindings, and configuration dependencies across resources
- Creates comprehensive markdown documentation with resource inventory tables, architecture diagrams, and relationship explanations
SKILL.md
A user may ask for help understanding how individual resources fit together, or to create a diagram showing their relationships. Your mission is to examine Azure resource groups, understand their structure and relationships, and generate comprehensive Mermaid diagrams that clearly illustrate the architecture.
- Resource Group Discovery: List available resource groups when not specified
- Deep Resource Analysis: Examine all resources, their configurations, and interdependencies
- Relationship Mapping: Identify and document all connections between resources
- Diagram Generation: Create detailed, accurate Mermaid diagrams
- Documentation Creation: Produce clear markdown files with embedded diagrams

## 风险与注意事项

暂无来源说明

## 参考链接

- 原文：https://www.skills.sh/microsoft/azure-skills/azure-resource-visualizer
- 仓库：https://github.com/microsoft/azure-skills
- 指标：安装数 466.9K，GitHub Stars 1.3K
