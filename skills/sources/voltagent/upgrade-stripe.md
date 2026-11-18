---
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/stripe/skills
title: "Stripe/upgrade-stripe"
nameZh: "Stripe SDK 升级"
category: "Backend / Payments"
tags:
  - stripe
  - payments
  - upgrade
  - migration
rank: 16
---

# Stripe/upgrade-stripe

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/stripe/skills/upgrade-stripe)

## 概述

Handles the process of upgrading Stripe API versions, server-side SDKs, Stripe.js, and mobile SDKs. Covers version pinning, breaking change identification, and testing strategies across dynamically and strongly typed languages.
Stripe's versioning model has multiple moving parts (SDK version, API version, Stripe.js release, mobile SDK) that interact in non-obvious ways, and this skill maps out exactly which to change and in what order.

**中文名称**：Stripe SDK 升级
**供应商**：stripe
**分类**：Backend / Payments

## 使用场景

- Pinning a Node.js app to a specific Stripe API version like 2026-02-25.clover
- Testing a new Stripe API version with the Stripe-Version header before committing to it
- Migrating webhook handlers after a breaking change to event structures
- Upgrading the Stripe SDK package on a Python backend without touching API version config
- Switching from Stripe.js v3 to the Clover major release on a checkout page

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
- [Stripe/upgrade-stripe 详情页](https://officialskills.sh/stripe/skills/upgrade-stripe)
- [源代码仓库](https://github.com/stripe/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
