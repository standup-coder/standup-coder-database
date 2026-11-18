---
type: external
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/veniceai/skills/tree/main/skills/venice-chat
title: "Venice.ai/venice-chat"
nameZh: "Venice 对话 API"
category: "AI/LLM APIs"
tags: ["venice-ai","llm","chat"]
rank: 13
id: venice-ai-venice-chat
domain: ai-ml
domainLabel: AI/ML/LLM
catalogSource: voltagent
catalogFile: venice-venice-chat.md
catalogAddedAt: 2026-07-26
---

# Venice.ai/venice-chat

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://github.com/veniceai/skills/tree/main/skills/venice-chat)

## 概述

# Venice Chat Completions

`POST /api/v1/chat/completions` is Venice's main text endpoint. It's OpenAI-compatible, plus a `venice_parameters` object for Venice-only features.

## Use when

- You need LLM text generation, with or without tools, with or without streaming.
- You want multimodal inputs (images, audio, video) to a vision/audio-capable model.
- You want Venice-specific features: web search, E2EE, characters, xAI X/Twitter search, strip-thinking, web scraping.
- You need prompt caching for large system prompts or long documents.
- You need structured (`json_schema`) output.

For the newer Alpha **Responses API**, see `venice-responses`（原始 skill 包的姊妹技能，本库未收录）.

## Minimal request

```bash
curl https://api.venice.ai/api/v1/chat/completions \
-H "Authorization: Bearer $VENICE_API_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "zai-org-glm-5-1",
"messages": [{"role": "user", "content": "Why is the sky blue?"}]
}'
```

Response shape is the standard OpenAI `chat.completion` object (`id`, `object: "chat.completion"`, `choices[].message`, `usage`). With `stream: true`, responses come as SSE `data:` lines in `chat.completion.chunk` format.

## The request body

### Core fields (OpenAI-compatible)

**中文名称**：Venice 对话 API
**供应商**：veniceai
**分类**：AI/LLM APIs

## 使用场景

- 在支持 Agent Skills 的编码助手（如 Claude Code、Codex、Cursor、Gemini CLI）中调用此技能
- 配合 Venice.ai 相关的开发任务使用
- 需要访问对应平台 API 或 SDK 时自动激活

## 能力说明

- **安装方式**：`npx skills add https://github.com/veniceai/skills/tree/main/skills/venice-chat` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/veniceai/skills/tree/main/skills/venice-chat](https://github.com/veniceai/skills/tree/main/skills/venice-chat)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Venice.ai/venice-chat 详情页](https://github.com/veniceai/skills/tree/main/skills/venice-chat)
- [源代码仓库](https://github.com/veniceai/skills/tree/main/skills/venice-chat)
- [officialskills.sh 平台](https://officialskills.sh/)
