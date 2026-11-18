---
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/openai/skills
title: "OpenAI/sora"
nameZh: "Sora 视频生成"
category: "AI/LLM APIs"
tags:
  - openai
  - sora
  - video-generation
  - multimedia
rank: 11
---

# OpenAI/sora

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/openai/skills/sora)

## 概述

Generates and manages Sora video jobs from text prompts. Covers the full lifecycle: create, edit, extend, poll status, download assets, and run local multi-job queues. Uses a bundled CLI with structured prompt augmentation for consistent results.
Rather than manually crafting API calls, polling for completion, and downloading expiring URLs, this skill handles the full job lifecycle through a single CLI with structured prompt templates that reduce trial-and-error iterations.

**中文名称**：Sora 视频生成
**供应商**：openai
**分类**：AI/LLM APIs

## 使用场景

- Generating a 4-second product teaser clip from a text description
- Creating a reusable non-human character reference for use across multiple shots
- Extending a completed Sora video with a continuation prompt
- Editing an existing generated video to change only the color palette or lighting
- Running a local batch queue of multiple video render jobs in parallel

## 能力说明

- **安装方式**：`npx skills add https://github.com/openai/skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/openai/skills](https://github.com/openai/skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [OpenAI/sora 详情页](https://officialskills.sh/openai/skills/sora)
- [源代码仓库](https://github.com/openai/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
