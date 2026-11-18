---
type: external
source: anthropic-skills
sourceUrl: https://github.com/anthropics/skills/tree/main/skills/xlsx
title: xlsx
name: xlsx
nameZh: Excel 表格处理（xlsx）
category: 文档（Document Skills / document-skills 插件）
tags: [spreadsheet, excel, xlsx, openpyxl, pandas, formulas, data-analysis, office]
rank: 1
plugin: document-skills
license: Proprietary (source-available)
hasReferences: false
references: [scripts/recalc.py, scripts/office/validate.py, scripts/office/soffice.py]
id: xlsx
domain: docs
domainLabel: 文档
catalogSource: anthropic
catalogFile: xlsx.md
catalogAddedAt: 2026-07-26
---

# xlsx

> Use this skill any time a spreadsheet file is the primary input or output. This means any task where the user wants to: open, read, edit, or fix an existing .xlsx, .xlsm, .xltx, .csv, or .tsv file (e.g., adding columns, computing formulas, formatting, charting, cleaning messy data); create a new spreadsheet from scratch or from other data sources; or convert between tabular file formats.

## 概述

`xlsx` 是 Anthropic 官方驱动 Claude.ai "create files" 能力的核心 skill 之一，用于创建、编辑、分析电子表格文件（`.xlsx` / `.xlsm` / `.xltx` / `.csv` / `.tsv`）。它把多个工具组合成一条标准化流水线：`openpyxl` 用于带公式和格式的创建/编辑，`pandas` 用于大批量数据进出，`markitdown` 用于快速浏览工作表。

按任务路由的核心策略：

| 任务 | 方法 |
|---|---|
| 创建 / 编辑（含公式、格式） | `openpyxl` |
| 批量数据进出 | `pandas`（`read_excel`, `to_excel`） |
| 快速浏览某张表 | `markitdown file.xlsx` |
| 同时读取公式与值 | 两次 `load_workbook` |

`openpyxl`、`pandas`、`markitdown` 均为预装依赖——不要先跑 `pip install`，直接写脚本并 `import`；只有当 `import` 失败或 `markitdown` 命令缺失时才补装。

## 使用场景

- 用户提到 "spreadsheet"、"xlsx"、"the xlsx in my downloads" 等并希望对它做改动或基于它产出。
- 清洗 / 重组脏的表格数据（错位的行、放错位置的表头、垃圾数据），把它整理成规范电子表格。
- 在 Excel 里加列、写公式、做格式化、画图表。
- 把 `.csv` / `.tsv` 转成 `.xlsx`，或在 `.xlsx` / `.xlsm` / `.xltx` 之间转换。
- **不触发**：最终交付物是 Word 文档、HTML 报告、独立 Python 脚本、数据库管道或 Google Sheets API 集成时——即便其中涉及表格数据。

## 能力说明

每个输出都必须满足以下硬性要求：

- **专业字体**：全程使用 Arial 或 Times New Roman，除非用户另说。
- **零公式错误**：`recalc.py` 报告 `errors_found` 时绝不交付。要证明错误是文件本身带的，而非你引入的：用 `data_only=True` 重新加载原始文件查看该单元格。
- **必须用公式，不要硬编码结果**：写 `sheet['B10'] = '=SUM(B2:B9)'`，而不是把 Python 算出来的总和写进去——文件要能在输入变化时重新计算。
- **逐字遵守用户规范**：tab 名、列头、用户指定的公式一字不差。哪怕更优雅的设计，只要算的是别的东西就算失败。
- **逐项记录每个假设和硬编码数字**，写在读者一眼能看到的地方（单元格批注或表格末尾相邻单元格）。有出处就引用真实来源（如 `Source: Company 10-K, FY2024, Page 45, Revenue Note, [SEC EDGAR URL]`），来自用户的数字则直接说明。
- **为别人填表而创建的工作簿**：需要一小段图例标注哪些单元格要编辑，加一行格式示范。但**绝不要**在用户让你编辑的文件里加这种示例行。
- **编辑现有文件时严格匹配其约定**：先找到它指定的输入单元格（通常用不同字体颜色或填充标记），只在那些地方写，已有的公式一律不动。

### 重新计算（含公式时强制执行）

`openpyxl` 写公式时只写字符串、**不带缓存值**。在重新计算前，任何读取缓存值的方式（`pandas`、`load_workbook(data_only=True)`、绝大多数预览器）都会把公式单元格读成 `None`。

```bash
python scripts/recalc.py output.xlsx [timeout_seconds]   # 默认 30
```

LibreOffice 会算出每个公式的值，文件被**原地重写**，并返回 JSON：`status`（`success` | `errors_found`）、`total_formulas`、`total_errors`，以及最多列出 100 个单元格的 `error_summary`。修完它点名的错误后再跑一遍。注意：**绿色 recalc 只能证明公式能算，不能证明算得对**——off-by-one 的范围、引用错行都会得到一个干净却错误连篇的文件。

> 引用其他文件的公式（如 `='[1]Returns Analysis'!$B$2` 中的 `[1]`）在用 `openpyxl` 保存并重算后会丢失跨文件链接。`recalc.py` 在这种状态下会拒绝运行，需要先把那些单元格的值从原始文件拷出来。

### 验证

`scripts/office/validate.py` 对 OOXML 做 XSD、关系、content-type 检查；`scripts/office/soffice.py` 是 LibreOffice 的安全封装（沙箱里裸 `soffice` 会挂起）。

## 参考资源

- `scripts/recalc.py` — 强制重算 + 错误报告
- `scripts/office/validate.py` — OOXML schema 校验
- `scripts/office/soffice.py` — LibreOffice headless 封装
- `scripts/office/schemas/` — ECMA / ISO-IEC29500-4 / MCE schema
- `scripts/office/validators/`, `scripts/office/helpers/` — 校验与辅助工具

## 原文链接

- 仓库路径：https://github.com/anthropics/skills/tree/main/skills/xlsx
- SKILL.md 原文：https://raw.githubusercontent.com/anthropics/skills/main/skills/xlsx/SKILL.md
