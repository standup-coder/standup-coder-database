---
type: external
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/mendableai/skills
title: "Firecrawl/firecrawl-build"
nameZh: "Firecrawl 网页抓取"
category: "Data / Crawling"
tags: ["firecrawl","web-scraping","crawler"]
rank: 45
id: firecrawl-firecrawl-build
domain: tools
domainLabel: 未分类
catalogSource: voltagent
catalogFile: firecrawl-firecrawl-build.md
catalogAddedAt: 2026-07-26
---

# Firecrawl/firecrawl-build

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/firecrawl/skills/firecrawl-build)

## 概述

Entry-point skill for integrating Firecrawl inside product code when a feature needs web data — search, page scraping, structured extraction, or browser interaction. Routes requests to `/scrape`, `/search`, or `/interact` depending on the need, and covers SDK usage across languages. Not for one-off terminal-only tasks — use the CLI for those.
Gives a single entry point for all app-level Firecrawl use cases so feature code maps cleanly onto `/scrape`, `/search`, or `/interact` instead of reinventing routing each time.

**中文名称**：Firecrawl 网页抓取
**供应商**：firecrawl
**分类**：Data / Crawling

## 使用场景

- Adding web search to an app that needs live results inside a feature
- Scraping a URL to structured content from product code
- Building an agent tool that pulls page content on demand
- Picking between `/scrape`, `/search`, and `/interact` for a new web-data feature
- Dropping Firecrawl into a Node, Python, or Go backend for web data

## 能力说明

- **安装方式**：`npx skills add https://github.com/mendableai/skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/mendableai/skills](https://github.com/mendableai/skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Firecrawl/firecrawl-build 详情页](https://officialskills.sh/firecrawl/skills/firecrawl-build)
- [源代码仓库](https://github.com/mendableai/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
