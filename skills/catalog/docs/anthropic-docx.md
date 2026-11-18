---
type: external
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/anthropics/skills/tree/main/skills/docx
title: "Anthropic/docx"
nameZh: "Word 文档处理"
category: "Official Skills / Documents"
tags: ["anthropic","docx","document"]
rank: 3
id: anthropic-docx
duplicateOf: docx
domain: docs
domainLabel: 文档
catalogSource: voltagent
catalogFile: docx.md
catalogAddedAt: 2026-07-26
---

# Anthropic/docx

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/anthropics/skills/docx)

## 概述

Handles .docx file creation, editing, and analysis. Supports generating structured Word documents from scratch using docx-js, editing existing files by unpacking and modifying XML, and extracting content with pandoc. Covers tables, images, tracked changes, headers/footers, footnotes, and table of contents.
Generating .docx files manually means wrestling with XML namespaces, DXA unit math, and docx-js quirks like portrait/landscape dimension swaps — this skill encodes those rules so you don't have to rediscover them.

**中文名称**：Word 文档处理
**供应商**：anthropics
**分类**：Official Skills / Documents

## 使用场景

- Creating a formatted Word report with tables, headings, and page numbers
- Editing an existing contract to add tracked changes with author attribution
- Extracting text from a .docx file into markdown for further processing
- Converting a .doc legacy file to .docx and updating its content
- Building a memo template with a header, footer, and auto-generated table of contents

## 能力说明

- **安装方式**：`npx skills add https://github.com/anthropics/skills/tree/main/skills/docx` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/anthropics/skills/tree/main/skills/docx](https://github.com/anthropics/skills/tree/main/skills/docx)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Anthropic/docx 详情页](https://officialskills.sh/anthropics/skills/docx)
- [源代码仓库](https://github.com/anthropics/skills/tree/main/skills/docx)
- [officialskills.sh 平台](https://officialskills.sh/)
