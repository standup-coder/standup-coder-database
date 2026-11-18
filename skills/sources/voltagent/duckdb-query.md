---
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/duckdb/skills
title: "DuckDB/query"
nameZh: "DuckDB 查询"
category: "Database"
tags:
  - duckdb
  - olap
  - database
  - sql
rank: 20
---

# DuckDB/query

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/duckdb/skills/query)

## 概述

Runs SQL queries against DuckDB databases or files like CSV and Parquet. Accepts raw SQL or natural language questions and translates them to DuckDB Friendly SQL. Handles schema inspection, result size estimation, and error recovery automatically.
DuckDB's Friendly SQL idioms like FROM-first queries, GROUP BY ALL, and direct file access reduce the boilerplate needed compared to writing standard SQL against a traditional database setup.

**中文名称**：DuckDB 查询
**供应商**：duckdb
**分类**：Database

## 使用场景

- Querying a CSV file with natural language like 'show me top 10 sales by region'
- Running aggregations across multiple Parquet files using glob patterns
- Profiling an unknown dataset with SUMMARIZE before writing analysis queries
- Pivoting time-series data from long to wide format for reporting
- Checking row counts and schema before joining two large tables

## 能力说明

- **安装方式**：`npx skills add https://github.com/duckdb/skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/duckdb/skills](https://github.com/duckdb/skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [DuckDB/query 详情页](https://officialskills.sh/duckdb/skills/query)
- [源代码仓库](https://github.com/duckdb/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
