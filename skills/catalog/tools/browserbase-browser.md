---
type: external
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/browserbase/skills
title: "Browserbase/browser"
nameZh: "Browserbase 浏览器自动化"
category: "Testing / Automation"
tags: ["browserbase","browser-automation"]
rank: 34
id: browserbase-browser
domain: tools
domainLabel: 第三方工具集成
catalogSource: voltagent
catalogFile: browserbase-browser.md
catalogAddedAt: 2026-07-26
---

# Browserbase/browser

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/browserbase/skills/browser)

## 概述

Automates web browser interactions through natural language CLI commands. It can navigate pages, extract data, fill forms, take screenshots, and click elements. Supports both local Chrome and remote Browserbase sessions with automatic CAPTCHA solving and anti-bot stealth.
Handles bot detection, CAPTCHAs, and anti-scraping measures automatically, so you don't have to fiddle with headless browser configs or proxy rotation yourself.

**中文名称**：Browserbase 浏览器自动化
**供应商**：browserbase
**分类**：Testing / Automation

## 使用场景

- Scraping product prices from sites with Cloudflare protection
- Filling out multi-step web forms without opening a browser
- Taking screenshots of a page after logging in with saved cookies
- Extracting text content from JavaScript-heavy single-page apps
- Running automated checks on localhost during development

## 能力说明

- **安装方式**：`npx skills add https://github.com/browserbase/skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/browserbase/skills](https://github.com/browserbase/skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Browserbase/browser 详情页](https://officialskills.sh/browserbase/skills/browser)
- [源代码仓库](https://github.com/browserbase/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
