---
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/better-auth/skills
title: "Better Auth/best-practices"
nameZh: "Better Auth 最佳实践"
category: "Auth / Security"
tags:
  - better-auth
  - authentication
  - security
  - sessions
rank: 40
---

# Better Auth/best-practices

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/better-auth/skills/best-practices)

## 概述

Covers Better Auth server and client setup, including database adapter configuration, session management, plugin integration, and environment variable handling. Targets TypeScript projects using email/password auth, OAuth providers, or plugin-based features like two-factor and magic links.
Better Auth has enough config surface area that small mistakes like confusing ORM model names with table names or missing a CLI re-run after adding plugins break auth silently, so having the exact rules in context prevents those bugs without digging through the docs each time.

**中文名称**：Better Auth 最佳实践
**供应商**：better-auth
**分类**：Auth / Security

## 使用场景

- Setting up a Better Auth server with Drizzle or Prisma adapter
- Adding OAuth providers like Google alongside email/password login
- Configuring session storage with Redis as secondary storage
- Wiring in plugins like twoFactor or magicLink with correct import paths
- Mapping ORM model names to database tables without breaking migrations

## 能力说明

- **安装方式**：`npx skills add https://github.com/better-auth/skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/better-auth/skills](https://github.com/better-auth/skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Better Auth/best-practices 详情页](https://officialskills.sh/better-auth/skills/best-practices)
- [源代码仓库](https://github.com/better-auth/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
