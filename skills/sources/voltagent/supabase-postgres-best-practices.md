---
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/supabase/skills
title: "Supabase/postgres-best-practices"
nameZh: "Supabase Postgres 最佳实践"
category: "Database"
tags:
  - supabase
  - postgres
  - database
  - sql
rank: 17
---

# Supabase/postgres-best-practices

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/supabase/skills/postgres-best-practices)

## 概述

A collection of Postgres optimization rules organized by impact, covering query performance, connection management, RLS, schema design, and concurrency. Each rule includes SQL examples showing the wrong and right approach, with EXPLAIN output and metrics where relevant.

**中文名称**：Supabase Postgres 最佳实践
**供应商**：supabase
**分类**：Database

## 使用场景

- Catching missing indexes before a slow query hits production
- Writing RLS policies that don't cause full table scans
- Configuring connection pooling for high-concurrency workloads
- Designing schemas with the right column types and partial indexes
- Reviewing query plans to understand why a join is slow

## 能力说明

- **安装方式**：`npx skills add https://github.com/supabase/skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/supabase/skills](https://github.com/supabase/skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Supabase/postgres-best-practices 详情页](https://officialskills.sh/supabase/skills/postgres-best-practices)
- [源代码仓库](https://github.com/supabase/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
