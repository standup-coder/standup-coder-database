---
type: external
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/anthropics/skills/tree/main/skills/pdf
title: "Anthropic/pdf"
nameZh: "PDF 处理"
category: "Official Skills / Documents"
tags: ["anthropic","pdf","document"]
rank: 4
id: anthropic-pdf
duplicateOf: pdf
domain: docs
domainLabel: 文档
catalogSource: voltagent
catalogFile: pdf.md
catalogAddedAt: 2026-07-26
---

# Anthropic/pdf

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/anthropics/skills/pdf)

## 概述

Handles PDF operations in code: reading, writing, merging, splitting, rotating, watermarking, encrypting, extracting text and tables, OCR on scanned pages, and creating new PDFs from scratch. Covers both Python libraries (pypdf, pdfplumber, reportlab) and CLI tools (qpdf, pdftk, pdftotext).
Instead of piecing together which Python library handles which task, this skill maps every common PDF operation to the right tool with working code snippets ready to adapt.

**中文名称**：PDF 处理
**供应商**：anthropics
**分类**：Official Skills / Documents

## 使用场景

- Extracting tables from a multi-page PDF report into a spreadsheet
- Merging dozens of invoice PDFs into a single file for accounting
- Running OCR on scanned contracts to make them text-searchable
- Splitting a large PDF manual into per-chapter files
- Adding a watermark to all pages before sending a document externally

## 能力说明

- **安装方式**：`npx skills add https://github.com/anthropics/skills/tree/main/skills/pdf` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/anthropics/skills/tree/main/skills/pdf](https://github.com/anthropics/skills/tree/main/skills/pdf)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Anthropic/pdf 详情页](https://officialskills.sh/anthropics/skills/pdf)
- [源代码仓库](https://github.com/anthropics/skills/tree/main/skills/pdf)
- [officialskills.sh 平台](https://officialskills.sh/)
