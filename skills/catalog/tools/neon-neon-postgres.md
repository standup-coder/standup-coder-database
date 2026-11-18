---
type: external
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/neondatabase/skills
title: "Neon/neon-postgres"
nameZh: "Neon Postgres"
category: "Database"
tags: ["neon","postgresql","serverless"]
rank: 22
id: neon-neon-postgres
domain: tools
domainLabel: 第三方工具集成
catalogSource: voltagent
catalogFile: neon-neon-postgres.md
catalogAddedAt: 2026-07-26
---

# Neon/neon-postgres

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/neondatabase/skills/neon-postgres)

## 概述

Neon is a serverless Postgres platform with autoscaling, database branching, and scale-to-zero. It separates compute from storage, so each branch gets its own endpoint and branches are instant copy-on-write clones. Compatible with any Postgres driver, ORM, or framework.
Branching lets you test schema migrations against a real copy of production data without provisioning a separate database or running a dump/restore cycle.

**中文名称**：Neon Postgres
**供应商**：neon
**分类**：Database

## 使用场景

- Spinning up isolated Postgres branches for each pull request preview
- Restoring a database to a specific point in time after a bad migration
- Connecting a Next.js app on Vercel Edge to Postgres over HTTP without TCP
- Scaling read replicas independently for analytics queries without duplicating storage
- Automating branch creation and deletion in CI/CD pipelines with neonctl

## 能力说明

- **安装方式**：`npx skills add https://github.com/neondatabase/skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/neondatabase/skills](https://github.com/neondatabase/skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Neon/neon-postgres 详情页](https://officialskills.sh/neondatabase/skills/neon-postgres)
- [源代码仓库](https://github.com/neondatabase/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
