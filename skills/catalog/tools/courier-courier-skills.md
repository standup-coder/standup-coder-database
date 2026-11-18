---
type: external
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/trycourier/courier-skills
title: "Courier/courier-skills"
nameZh: "Courier 多通道通知"
category: "Communication"
tags: ["courier","notification","messaging"]
rank: 36
id: courier-courier-skills
domain: tools
domainLabel: 第三方工具集成
catalogSource: voltagent
catalogFile: courier-courier-skills.md
catalogAddedAt: 2026-07-26
---

# Courier/courier-skills

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://github.com/trycourier/courier-skills)

## 概述

# Courier Notification Skills

A comprehensive agent skill for building production-ready notification systems across multiple channels. Covers everything from email deliverability to push permission priming, with a focus on user experience and reliability.

> **For AI Agents & Developers**: This skill provides structured guidance for implementing notifications with the [Courier API](https://www.courier.com). Use it to send emails, SMS, push notifications, Slack messages, and more through a unified interface.

## Why Use This Skill

- **Multi-channel notifications** — Send messages via email, SMS, push, Slack, Microsoft Teams, WhatsApp, and in-app inbox from a single API
- **Production-ready patterns** — Battle-tested code examples for authentication flows, order updates, billing alerts, and more
- **Developer-first** — TypeScript, Python, CLI, and curl examples for key patterns

## Who This Is For

- Developers building SaaS, e-commerce, marketplaces, or mobile apps
- Teams consolidating notification providers into a single API
- Engineers implementing user preferences, unsubscribe handling, or multi-channel routing

## Installation

**Cursor** (global, available in all projects):

```bash
git clone https://github.com/trycourier/courier-skills.git ~/.cursor/skills/courier-skills
```

**Cursor** (project-specific):

```bash
git clone https://github.com/trycourier/courier-skills.git .cursor/skills/courier-skills
```

**中文名称**：Courier 多通道通知
**供应商**：courier
**分类**：Communication

## 使用场景

- 在支持 Agent Skills 的编码助手（如 Claude Code、Codex、Cursor、Gemini CLI）中调用此技能
- 配合 Courier 相关的开发任务使用
- 需要访问对应平台 API 或 SDK 时自动激活

## 能力说明

- **安装方式**：`npx skills add https://github.com/trycourier/courier-skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/trycourier/courier-skills](https://github.com/trycourier/courier-skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Courier/courier-skills 详情页](https://github.com/trycourier/courier-skills)
- [源代码仓库](https://github.com/trycourier/courier-skills)
- [officialskills.sh 平台](https://officialskills.sh/)
