---
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/ClickHouse/skills
title: "ClickHouse/clickhouse-best-practices"
nameZh: "ClickHouse 最佳实践"
category: "Database"
tags:
  - clickhouse
  - olap
  - database
  - analytics
rank: 19
---

# ClickHouse/clickhouse-best-practices

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/clickhouse/skills/clickhouse-best-practices)

## 概述

A set of 28 validated rules for ClickHouse covering schema design, query optimization, and data ingestion. Rules are grouped by category and priority, from primary key selection to mutation avoidance. Meant to be checked against before answering ClickHouse questions or reviewing database code.
ClickHouse has specific behaviors around columnar storage and sparse indexes where standard SQL intuition leads to bad designs, and these rules encode validated ClickHouse-specific guidance that general database knowledge won't cover.

**中文名称**：ClickHouse 最佳实践
**供应商**：clickhouse
**分类**：Database

## 使用场景

- Reviewing a CREATE TABLE statement for column ordering mistakes before deploying
- Diagnosing slow SELECT queries caused by JOIN algorithm mismatches
- Replacing frequent ALTER TABLE UPDATE operations with ReplacingMergeTree patterns
- Choosing the right numeric type when designing a new ClickHouse schema
- Configuring async inserts for a high-frequency small-batch ingestion pipeline

## 能力说明

- **安装方式**：`npx skills add https://github.com/ClickHouse/skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/ClickHouse/skills](https://github.com/ClickHouse/skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [ClickHouse/clickhouse-best-practices 详情页](https://officialskills.sh/clickhouse/skills/clickhouse-best-practices)
- [源代码仓库](https://github.com/ClickHouse/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
