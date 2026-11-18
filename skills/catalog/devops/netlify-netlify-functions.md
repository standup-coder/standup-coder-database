---
type: external
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/netlify/skills
title: "Netlify/netlify-functions"
nameZh: "Netlify Functions"
category: "Frontend / Web"
tags: ["netlify","serverless","functions"]
rank: 26
id: netlify-netlify-functions
domain: devops
domainLabel: 未分类
catalogSource: voltagent
catalogFile: netlify-netlify-functions.md
catalogAddedAt: 2026-07-26
---

# Netlify/netlify-functions

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/netlify/skills/netlify-functions)

## 概述

Netlify Functions lets you write serverless functions that run on Netlify's infrastructure. It covers the modern default export syntax, TypeScript support, path and method routing, background functions for long-running tasks, scheduled functions via cron, and streaming responses.
The skill eliminates the guesswork around modern syntax vs. legacy handler patterns, resource limits, and when to use background vs. scheduled functions — details you'd otherwise piece together from scattered Netlify docs.

**中文名称**：Netlify Functions
**供应商**：netlify
**分类**：Frontend / Web

## 使用场景

- Writing a REST API endpoint for a static React app without a separate backend
- Running a background function to process image uploads after the user gets an immediate 202 response
- Scheduling a nightly cron job to sync data from an external API
- Streaming server-sent events from a function to a client in real time
- Accessing geo and IP data from incoming requests to serve localized content

## 能力说明

- **安装方式**：`npx skills add https://github.com/netlify/skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/netlify/skills](https://github.com/netlify/skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Netlify/netlify-functions 详情页](https://officialskills.sh/netlify/skills/netlify-functions)
- [源代码仓库](https://github.com/netlify/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
