---
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/composiohq/skills
title: "Composio/composio"
nameZh: "Composio 工具集成"
category: "Integrations"
tags:
  - composio
  - integrations
  - automation
  - tools
rank: 44
---

# Composio/composio

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/composiohq/skills/composio)

## 概述

Composio connects AI agents and apps to 1000+ external services like Gmail, Slack, GitHub, and Notion. It provides both a CLI for direct tool execution and an SDK for building agents that need per-user connections to external APIs.
Instead of reading API docs and handling OAuth flows for each service separately, you get a single CLI and SDK that manages connections, auth, and tool discovery across hundreds of apps.

**中文名称**：Composio 工具集成
**供应商**：composio
**分类**：Integrations

## 使用场景

- Sending a Gmail draft from a terminal command without writing any code
- Connecting a multi-tenant AI agent to each user's own Slack workspace
- Searching 1000+ tool integrations by use case to find the right action
- Triggering a GitHub issue creation from an AI agent mid-conversation
- Listening for real-time events from external apps to drive agent workflows

## 能力说明

- **安装方式**：`npx skills add https://github.com/composiohq/skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/composiohq/skills](https://github.com/composiohq/skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Composio/composio 详情页](https://officialskills.sh/composiohq/skills/composio)
- [源代码仓库](https://github.com/composiohq/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
