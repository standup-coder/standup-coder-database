---
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/huggingface/skills
title: "Hugging Face/hf-cli"
nameZh: "Hugging Face CLI"
category: "AI/LLM APIs"
tags:
  - huggingface
  - hf-cli
  - models
  - ml
rank: 12
---

# Hugging Face/hf-cli

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/huggingface/skills/hf-cli)

## 概述

The `hf` CLI manages Hugging Face Hub repositories, models, datasets, and Spaces from the terminal. It handles downloads, uploads, cache, inference endpoints, jobs, and webhooks. It replaces the deprecated `huggingface-cli` command.
It covers the full Hub lifecycle in one binary, so you can download, upload, manage endpoints, run jobs, and handle auth without switching between the web UI, Python scripts, and separate tools.

**中文名称**：Hugging Face CLI
**供应商**：huggingface
**分类**：AI/LLM APIs

## 使用场景

- Downloading a specific model revision to a local directory for offline use
- Uploading a large fine-tuned model with resumable multi-worker transfers
- Querying dataset parquet files with raw SQL via DuckDB without writing any code
- Deploying and scaling Inference Endpoints from the command line
- Syncing a local training output directory to a Hub repository bucket

## 能力说明

- **安装方式**：`npx skills add https://github.com/huggingface/skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/huggingface/skills](https://github.com/huggingface/skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Hugging Face/hf-cli 详情页](https://officialskills.sh/huggingface/skills/hf-cli)
- [源代码仓库](https://github.com/huggingface/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
