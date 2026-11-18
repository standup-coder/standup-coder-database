---
type: external
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/qdrant/skills
title: "qdrant/skills"
nameZh: "Qdrant 向量数据库"
category: "Community / Vector DB"
tags: ["qdrant","vector-database","search"]
rank: 50
id: qdrant-skills
domain: ai-ml
domainLabel: AI/ML/LLM
catalogSource: voltagent
catalogFile: qdrant-skills.md
catalogAddedAt: 2026-07-26
---

# qdrant/skills

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://github.com/qdrant/skills)

## 概述

# Qdrant Skills - Agent Skills for Qdrant Vector Search

Agent skills for building with Qdrant vector search

Skills encode deep Qdrant knowledge so coding agents can make the engineering decisions that determine whether vector search works well: quantization, sharding, tenant isolation, hybrid search, model migration, and more.

## Philosophy

Skills are not documentation. Qdrant already has docs in markdown. Skills
answer "when?" and "why?", not "how?"

They are structured as the handbook of a Solutions Architect working on Qdrant:
given a problem, navigate to the exact place in the documentation where the
answer lives. No tutorials, no concept explanations. Only references and
minimal snippets where absolutely necessary.

## Disclaimer

These skills are under active development. Skill content and structure may change between versions as Qdrant evolves.

## Usage

Qdrant maintains a growing set of skills, and their content changes as Qdrant evolves. There are a few ways to give your agent access to them.

### Recommended: install the Qdrant Advisor

**中文名称**：Qdrant 向量数据库
**供应商**：qdrant
**分类**：Community / Vector DB

## 使用场景

- 在支持 Agent Skills 的编码助手（如 Claude Code、Codex、Cursor、Gemini CLI）中调用此技能
- 配合 qdrant 相关的开发任务使用
- 需要访问对应平台 API 或 SDK 时自动激活

## 能力说明

- **安装方式**：`npx skills add https://github.com/qdrant/skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/qdrant/skills](https://github.com/qdrant/skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [qdrant/skills 详情页](https://github.com/qdrant/skills)
- [源代码仓库](https://github.com/qdrant/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
