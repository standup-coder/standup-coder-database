---
type: external
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/DataDog/skills
title: "Datadog/dd-apm"
nameZh: "Datadog APM 查询"
category: "Observability"
tags: ["datadog","apm","monitoring"]
rank: 43
id: datadog-dd-apm
domain: tools
domainLabel: 第三方工具集成
catalogSource: voltagent
catalogFile: datadog-dd-apm.md
catalogAddedAt: 2026-07-26
---

# Datadog/dd-apm

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/datadog-labs/skills/dd-apm)

## 概述

Lets you query Datadog APM data from your editor. Search traces, list services, view dependency maps, and check latency or error rates across distributed systems using the Datadog Labs Pup CLI.
Instead of switching to the Datadog web UI and clicking through dashboards, you can pull trace data and service stats directly in your workflow with short CLI commands.

**中文名称**：Datadog APM 查询
**供应商**：datadog
**分类**：Observability

## 使用场景

- Searching for slow traces on a specific service after a deploy
- Listing all services and their error rates in a given environment
- Pulling up the dependency map for a microservice to find upstream bottlenecks
- Checking request latency percentiles before and after a config change
- Finding error traces tied to a specific API endpoint

## 能力说明

- **安装方式**：`npx skills add https://github.com/DataDog/skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/DataDog/skills](https://github.com/DataDog/skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Datadog/dd-apm 详情页](https://officialskills.sh/datadog-labs/skills/dd-apm)
- [源代码仓库](https://github.com/DataDog/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
