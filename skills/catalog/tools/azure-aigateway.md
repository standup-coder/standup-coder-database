---
type: external
source: skills-sh
sourceUrl: https://www.skills.sh/microsoft/azure-skills/azure-aigateway
title: azure-aigateway
nameZh: Azure AI 网关
category: Microsoft Azure官方
tags: [Microsoft, Microsoft Azure官方, 官方]
rank: 21
id: azure-aigateway
domain: tools
domainLabel: Azure
catalogSource: skills-sh
catalogFile: 21_AzureAI网关.md
catalogAddedAt: 2026-07-26
---
# azure-aigateway（Azure AI 网关）

> 把 Azure API Management 配置为 AI 模型/MCP/agent 网关

## 概述

Configure Azure API Management as an AI Gateway for AI models, MCP tools, and agents. WHEN: semantic caching, token limit, content safety, load balancing, AI…

## 使用场景

- Supports semantic caching (60-80% cost savings), token rate limiting, content safety filtering, and jailbreak detection across AI backends
- Add Azure OpenAI, AI Foundry models, or convert existing APIs to MCP tools as managed backends with load balancing
- Includes five core policy categories: authentication, semantic cache lookup, token limits, content safety, and token metrics for observability
- Requires Azure CLI for configuration and testing; integrates with managed identity for secure backend access

## 能力说明

Configure Azure API Management as an AI Gateway for models, MCP tools, and agents with built-in governance policies.
- Supports semantic caching (60-80% cost savings), token rate limiting, content safety filtering, and jailbreak detection across AI backends
- Add Azure OpenAI, AI Foundry models, or convert existing APIs to MCP tools as managed backends with load balancing
- Includes five core policy categories: authentication, semantic cache lookup, token limits, content safety, and token metrics for observability
- Requires Azure CLI for configuration and testing; integrates with managed identity for secure backend access
SKILL.md
Configure Azure API Management (APIM) as an AI Gateway for governing AI models, MCP tools, and agents.
To deploy APIM, use the azure-prepare skill. See APIM deployment guide.
Category
Triggers
Model Governance
"semantic caching", "token limits", "load balance AI", "track token usage"

## 风险与注意事项

暂无来源说明

## 参考链接

- 原文：https://www.skills.sh/microsoft/azure-skills/azure-aigateway
- 仓库：https://github.com/microsoft/azure-skills
- 指标：安装数 467.0K，GitHub Stars 1.3K
