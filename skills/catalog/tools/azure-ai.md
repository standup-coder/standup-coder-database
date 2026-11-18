---
type: external
source: skills-sh
sourceUrl: https://www.skills.sh/microsoft/azure-skills/azure-ai
title: azure-ai
nameZh: Azure AI
category: Microsoft Azure官方
tags: [Microsoft, Microsoft Azure官方, 官方]
rank: 11
id: azure-ai
domain: tools
domainLabel: Azure
catalogSource: skills-sh
catalogFile: 11_AzureAI.md
catalogAddedAt: 2026-07-26
---
# azure-ai（Azure AI）

> Azure AI 搜索、语音、OpenAI、文档智能等能力

## 概述

Use for Azure AI: Search, Speech, OpenAI, Document Intelligence. Helps with search, vector/hybrid search, speech-to-text, text-to-speech, transcription, OCR.…

## 使用场景

- AI Search supports full-text, vector, hybrid, and semantic search with AI enrichment capabilities like entity extraction and OCR
- Speech service enables speech-to-text transcription (real-time and batch), text-to-speech with neural voices, speaker diarization, and custom models
- MCP server integration provides direct tool access via `azure__search` and `azure__speech` commands; falls back to CLI and SDK when MCP is unavailable
- Includes OpenAI model access, DALL-E image generation, embeddings, and Document Intelligence for form extraction and OCR
- `azure__search` with command `search_index_list` - List search indexes
- `azure__search` with command `search_index_get` - Get index details

## 能力说明

Unified access to Azure AI services: Search, Speech, OpenAI, and Document Intelligence.
- AI Search supports full-text, vector, hybrid, and semantic search with AI enrichment capabilities like entity extraction and OCR
- Speech service enables speech-to-text transcription (real-time and batch), text-to-speech with neural voices, speaker diarization, and custom models
- MCP server integration provides direct tool access via `azure__search` and `azure__speech` commands; falls back to CLI and SDK when MCP is unavailable
- Includes OpenAI model access, DALL-E image generation, embeddings, and Document Intelligence for form extraction and OCR
SKILL.md
Service
Use When
MCP Tools
CLI
AI Search
Full-text, vector, hybrid search

## 风险与注意事项

暂无来源说明

## 参考链接

- 原文：https://www.skills.sh/microsoft/azure-skills/azure-ai
- 仓库：https://github.com/microsoft/azure-skills
- 指标：安装数 468.7K，GitHub Stars 1.3K
