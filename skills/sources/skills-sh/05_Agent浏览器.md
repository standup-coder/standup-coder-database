---
source: skills-sh
sourceUrl: https://www.skills.sh/vercel-labs/agent-browser/agent-browser
title: agent-browser
nameZh: Agent 浏览器
category: Vercel官方
tags: [Vercel, Vercel官方, 官方]
rank: 5
---
# agent-browser（Agent 浏览器）

> 给 AI agent 用的浏览器自动化 CLI

## 概述

Browser automation CLI for AI agents. Use when the user needs to interact with websites, including navigating pages, filling forms, clicking buttons, taking…

## 使用场景

- Supports three browser modes: headless Chromium, real Chrome with profile support, and cloud-hosted remote browsers with proxy configuration
- Includes 15+ command categories covering navigation, page inspection, interactions, data extraction, cookie management, and JavaScript execution
- Offers cloud session management, local server tunneling via Cloudflare, and parallel subagent execution through remote sessions
- Built-in Python integration for setting variables, accessing the browser object, and running scripts within the automation context

## 能力说明

Fast, persistent browser automation with session continuity across sequential agent commands.
- Supports three browser modes: headless Chromium, real Chrome with profile support, and cloud-hosted remote browsers with proxy configuration
- Includes 15+ command categories covering navigation, page inspection, interactions, data extraction, cookie management, and JavaScript execution
- Offers cloud session management, local server tunneling via Cloudflare, and parallel subagent execution through remote sessions
- Built-in Python integration for setting variables, accessing the browser object, and running scripts within the automation context
SKILL.md
Fast browser automation CLI for AI agents. Chrome/Chromium via CDP with accessibility-tree snapshots and compact `@eN` element refs.
Install: `npm i -g agent-browser && agent-browser install`
This file is a discovery stub, not the usage guide. Before running any `agent-browser` command, load the actual workflow content from the CLI:
```
agent-browser skills get core             # start here — workflows, common patterns, troubleshooting
agent-browser skills get core --full      # include full command reference and templates

## 风险与注意事项

暂无来源说明

## 参考链接

- 原文：https://www.skills.sh/vercel-labs/agent-browser/agent-browser
- 仓库：https://github.com/vercel-labs/agent-browser
- 指标：安装数 567.5K，GitHub Stars 38.9K
