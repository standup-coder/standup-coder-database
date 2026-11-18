---
type: external
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/mongodb-js/skills
title: "MongoDB/mongodb-schema-design"
nameZh: "MongoDB 模式设计"
category: "Database"
tags: ["mongodb","schema-design","database"]
rank: 18
id: mongodb-mongodb-schema-design
domain: data
domainLabel: 设计
catalogSource: voltagent
catalogFile: mongodb-schema-design.md
catalogAddedAt: 2026-07-26
---

# MongoDB/mongodb-schema-design

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/mongodb/skills/mongodb-schema-design)

## 概述

A collection of MongoDB schema design patterns and anti-patterns from MongoDB, covering embed-vs-reference decisions, the 16MB document limit, schema validation, and 11 data modeling patterns like bucket, polymorphic, and time series. Includes a decision framework for relationships and optional MCP integration to inspect live collections.
Most MongoDB performance problems come from schema decisions, not query tuning, and this skill gives you the specific pattern names and trade-off tables MongoDB's own engineers use to diagnose them.

**中文名称**：MongoDB 模式设计
**供应商**：mongodb
**分类**：Database

## 使用场景

- Deciding whether to embed order line items or reference them from a separate collection
- Migrating a normalized PostgreSQL users/profiles/addresses schema into document form
- Fixing a products collection where documents keep approaching the 16MB cap
- Bucketing IoT sensor readings into hourly documents instead of one-doc-per-reading
- Adding $jsonSchema validation to a legacy collection with inconsistent field types

## 能力说明

- **安装方式**：`npx skills add https://github.com/mongodb-js/skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/mongodb-js/skills](https://github.com/mongodb-js/skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [MongoDB/mongodb-schema-design 详情页](https://officialskills.sh/mongodb/skills/mongodb-schema-design)
- [源代码仓库](https://github.com/mongodb-js/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
