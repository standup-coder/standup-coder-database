---
type: external
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/replicate/skills
title: "Replicate/replicate"
nameZh: "Replicate 模型运行"
category: "AI/LLM APIs"
tags: ["replicate","ml-models","api"]
rank: 14
id: replicate-replicate
domain: tools
domainLabel: 第三方工具集成
catalogSource: voltagent
catalogFile: replicate-replicate.md
catalogAddedAt: 2026-07-26
---

# Replicate/replicate

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/replicate/skills/replicate)

## 概述

Replicate lets you run AI models via API, including image generation, language models, and other ML tasks. It handles model hosting, scaling, and versioning so you don't run your own GPU infrastructure. Models are searchable and runnable through a standardized REST interface.
Instead of provisioning GPUs, managing model weights, and writing custom inference code, you get a single API that works across hundreds of models with consistent input/output handling.

**中文名称**：Replicate 模型运行
**供应商**：replicate
**分类**：AI/LLM APIs

## 使用场景

- Running image generation models like Flux or Stable Diffusion without a GPU
- Comparing outputs from multiple AI models using the same prompt
- Integrating speech-to-text or image-to-video models into a web app
- Queuing batch predictions concurrently across different model versions
- Setting up webhooks to receive and store model outputs as they complete

## 能力说明

- **安装方式**：`npx skills add https://github.com/replicate/skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/replicate/skills](https://github.com/replicate/skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Replicate/replicate 详情页](https://officialskills.sh/replicate/skills/replicate)
- [源代码仓库](https://github.com/replicate/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
