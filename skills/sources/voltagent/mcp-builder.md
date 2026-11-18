---
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/anthropics/skills/tree/main/skills/mcp-builder
title: "Anthropic/mcp-builder"
nameZh: "MCP 服务器构建器"
category: "Official Skills / Integrations"
tags:
  - anthropic
  - mcp
  - model-context-protocol
  - integrations
  - api
rank: 2
---

# Anthropic/mcp-builder

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/anthropics/skills/mcp-builder)

## 概述

A development guide for building MCP (Model Context Protocol) servers that connect LLMs to external APIs and services. Covers the full lifecycle: planning tool design, implementing in TypeScript or Python, testing with MCP Inspector, and writing evaluations. Includes reference docs for both SDKs and a structured four-phase workflow.
Rather than reading scattered SDK READMEs and protocol specs separately, this guide consolidates tool design patterns, evaluation strategies, and language-specific examples into a single workflow that reduces the chance of building tools agents can't reliably use.

**中文名称**：MCP 服务器构建器
**供应商**：anthropics
**分类**：Official Skills / Integrations

## 使用场景

- Building a TypeScript MCP server that exposes GitHub API endpoints to an LLM
- Designing tool schemas with Zod so agents receive structured, typed responses
- Writing 10-question evaluation suites to verify an MCP server works with real LLM prompts
- Choosing between stdio and streamable HTTP transport for local vs. remote deployments
- Debugging tool discoverability by reviewing naming conventions and description clarity

## 能力说明

- **安装方式**：`npx skills add https://github.com/anthropics/skills/tree/main/skills/mcp-builder` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/anthropics/skills/tree/main/skills/mcp-builder](https://github.com/anthropics/skills/tree/main/skills/mcp-builder)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Anthropic/mcp-builder 详情页](https://officialskills.sh/anthropics/skills/mcp-builder)
- [源代码仓库](https://github.com/anthropics/skills/tree/main/skills/mcp-builder)
- [officialskills.sh 平台](https://officialskills.sh/)
