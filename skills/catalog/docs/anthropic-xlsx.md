---
type: external
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/anthropics/skills/tree/main/skills/xlsx
title: "Anthropic/xlsx"
nameZh: "Excel 电子表格"
category: "Official Skills / Documents"
tags: ["anthropic","xlsx","spreadsheet"]
rank: 6
id: anthropic-xlsx
duplicateOf: xlsx
domain: docs
domainLabel: 文档
catalogSource: voltagent
catalogFile: xlsx.md
catalogAddedAt: 2026-07-26
---

# Anthropic/xlsx

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/anthropics/skills/xlsx)

## 概述

Reads, writes, and edits Excel and tabular files (.xlsx, .xlsm, .csv, .tsv). Uses pandas for data analysis and openpyxl for formula and formatting work. Includes LibreOffice-based recalculation to verify formulas are error-free before delivery.
Writing openpyxl scripts yourself rarely catches formula errors before you open the file — this runs LibreOffice recalculation automatically and returns the exact cell locations of any errors to fix.

**中文名称**：Excel 电子表格
**供应商**：anthropics
**分类**：Official Skills / Documents

## 使用场景

- Building a financial model with color-coded inputs and formula-driven projections
- Cleaning a CSV with misplaced headers and junk rows into a structured spreadsheet
- Converting a TSV data export into a formatted Excel workbook with proper column widths
- Adding SUM and AVERAGE formulas to an existing spreadsheet without hardcoding calculated values
- Fixing #REF! and #DIV/0! errors in an inherited Excel file

## 能力说明

- **安装方式**：`npx skills add https://github.com/anthropics/skills/tree/main/skills/xlsx` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/anthropics/skills/tree/main/skills/xlsx](https://github.com/anthropics/skills/tree/main/skills/xlsx)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Anthropic/xlsx 详情页](https://officialskills.sh/anthropics/skills/xlsx)
- [源代码仓库](https://github.com/anthropics/skills/tree/main/skills/xlsx)
- [officialskills.sh 平台](https://officialskills.sh/)
