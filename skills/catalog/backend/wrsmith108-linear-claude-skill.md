---
type: external
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/wrsmith108/linear-claude-skill
title: "wrsmith108/linear-claude-skill"
nameZh: "Linear 项目管理"
category: "Productivity"
tags: ["linear","project-management","integration"]
rank: 38
id: wrsmith108-linear-claude-skill
domain: backend
domainLabel: 后端
catalogSource: voltagent
catalogFile: linear-claude-skill.md
catalogAddedAt: 2026-07-26
---

# wrsmith108/linear-claude-skill

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://github.com/wrsmith108/linear-claude-skill)

## 概述

# Linear Skill for Claude Code

A comprehensive [Claude Code](https://claude.ai/code) skill for managing Linear issues, projects, and teams. Provides patterns for MCP tools, SDK automation, and GraphQL API access.

## Features

- **esbuild Pre-compilation** — 18x faster CLI startup (~50ms vs ~1s) with transparent tsx fallback via shared `scripts/run.sh`
- **Label Taxonomy System** — Domain-based labels for consistent categorization and agent routing
- **First-Time Setup Check** — Automatic configuration validation with actionable guidance
- **High-Level Operations** — Simple commands for initiatives, projects, and status updates
- **Sub-Issue Management** — Create and manage parent-child issue relationships
- **Discovery Before Creation** — Mandatory checks to prevent duplicate projects/issues
- **MCP Tool Integration** — Simple operations via Linear MCP server
- **SDK Automation** — Complex operations with TypeScript scripts
- **GraphQL API** — Direct API access for advanced queries
- **Project Management** — Content, descriptions, milestones, resource links
- **Bulk Sync** — Synchronize code changes with Linear via CLI, agents, or hooks
- **Image Uploads** — Upload images to Linear's S3 storage and attach to issues
- **Smoke Tests** — Automated verification of build output and CLI behavior
- **`lin` CLI Integration** — Optional fast-path via [aaronkwhite/linear-cli](https://github.com/aaronkwhite/linear-cli) Rust binary with silent SDK fallback

## Quick Start (New Users)

### 1. Install the Skill

```bash
git clone https://github.com/wrsmith108/linear-claude-skill ~/.claude/skills/linear
cd ~/.claude/skills/linear && npm install
```

### 2. Run Setup Check

**中文名称**：Linear 项目管理
**供应商**：linear
**分类**：Productivity

## 使用场景

- 在支持 Agent Skills 的编码助手（如 Claude Code、Codex、Cursor、Gemini CLI）中调用此技能
- 配合 wrsmith108 相关的开发任务使用
- 需要访问对应平台 API 或 SDK 时自动激活

## 能力说明

- **安装方式**：`npx skills add https://github.com/wrsmith108/linear-claude-skill` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/wrsmith108/linear-claude-skill](https://github.com/wrsmith108/linear-claude-skill)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [wrsmith108/linear-claude-skill 详情页](https://github.com/wrsmith108/linear-claude-skill)
- [源代码仓库](https://github.com/wrsmith108/linear-claude-skill)
- [officialskills.sh 平台](https://officialskills.sh/)
