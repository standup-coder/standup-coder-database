---
type: external
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/anthropics/skills/tree/main/skills/pptx
title: "Anthropic/pptx"
nameZh: "PowerPoint 演示文稿"
category: "Official Skills / Documents"
tags: ["anthropic","pptx","presentation"]
rank: 5
id: anthropic-pptx
duplicateOf: pptx
domain: design
domainLabel: 设计
catalogSource: voltagent
catalogFile: pptx.md
catalogAddedAt: 2026-07-26
---

# Anthropic/pptx

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/anthropics/skills/pptx)

## 概述

Handles everything involving .pptx files: reading and extracting text, editing existing presentations, and building new ones from scratch or templates. Covers slides, layouts, speaker notes, and visual design.
Combines text extraction, XML-level editing, and from-scratch generation in one workflow, so you don't need to switch between tools or manually reformat slides after every change.

**中文名称**：PowerPoint 演示文稿
**供应商**：anthropics
**分类**：Official Skills / Documents

## 使用场景

- Extracting all text from a client deck to feed into a summary email
- Converting a data report into a slide presentation with charts and callouts
- Editing an existing template deck with new content without breaking the layout
- Building a pitch deck from scratch with a custom color palette and font pairing
- Splitting a large presentation into separate files by section

## 能力说明

- **安装方式**：`npx skills add https://github.com/anthropics/skills/tree/main/skills/pptx` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/anthropics/skills/tree/main/skills/pptx](https://github.com/anthropics/skills/tree/main/skills/pptx)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Anthropic/pptx 详情页](https://officialskills.sh/anthropics/skills/pptx)
- [源代码仓库](https://github.com/anthropics/skills/tree/main/skills/pptx)
- [officialskills.sh 平台](https://officialskills.sh/)
