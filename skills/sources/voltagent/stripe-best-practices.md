---
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/stripe/skills
title: "Stripe/stripe-best-practices"
nameZh: "Stripe 集成最佳实践"
category: "Backend / Payments"
tags:
  - stripe
  - payments
  - fintech
  - integration
rank: 15
---

# Stripe/stripe-best-practices

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/stripe/skills/stripe-best-practices)

## 概述

Guides decisions when building Stripe integrations — which API to use (Checkout Sessions vs PaymentIntents vs Setup Intents), how to configure Connect platforms with Accounts v2, and how to set up billing, Treasury financial accounts, and embedded payment UIs. Also covers migrating away from deprecated Stripe APIs.
Rather than reading across multiple Stripe docs pages to find the right API for your use case, this skill routes you directly to the correct integration path and reference file based on what you're building.

**中文名称**：Stripe 集成最佳实践
**供应商**：stripe
**分类**：Backend / Payments

## 使用场景

- Choosing between Checkout Sessions and PaymentIntents for a new payment flow
- Setting up a marketplace with Connect Accounts v2 and controller properties
- Adding subscription billing with the correct Billing API and Checkout integration
- Configuring a Treasury financial account for embedded banking features
- Auditing an existing Stripe integration against the Go Live checklist before launch

## 能力说明

- **安装方式**：`npx skills add https://github.com/stripe/skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/stripe/skills](https://github.com/stripe/skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Stripe/stripe-best-practices 详情页](https://officialskills.sh/stripe/skills/stripe-best-practices)
- [源代码仓库](https://github.com/stripe/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
