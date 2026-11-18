---
type: external
source: anthropic-skills
sourceUrl: https://github.com/anthropics/skills/tree/main/skills/docx
title: docx
name: docx
nameZh: Word 文档处理（docx）
category: 文档（Document Skills / document-skills 插件）
tags: [word, docx, dotx, document, docx-js, pandoc, office, tracked-changes]
rank: 2
plugin: document-skills
license: Proprietary (source-available)
hasReferences: false
references: [scripts/merge_runs.py, scripts/accept_changes.py, scripts/office/validate.py, scripts/office/soffice.py, scripts/templates/]
id: docx
domain: docs
domainLabel: 文档
catalogSource: anthropic
catalogFile: docx.md
catalogAddedAt: 2026-07-26
---

# docx

> Use this skill whenever the user wants to create, read, edit, or manipulate Word documents (.docx files) or Word templates (.dotx files). Triggers include: any mention of 'Word doc', 'word document', '.docx', '.dotx', or requests to produce professional documents with formatting like tables of contents, headings, page numbers, or letterheads. Also use when extracting or reorganizing content from .docx or .dotx files, inserting or replacing images in documents, performing find-and-replace in Word files, working with tracked changes or comments, or converting content into a polished Word document.

## 概述

`docx` 是 Anthropic 官方驱动 Claude.ai "create files" 的核心 skill，用于创建、读取、编辑、操作 Word 文档（`.docx`）和 Word 模板（`.dotx`）。一个 `.docx` 本质上是 XML 文件的 ZIP 归档；skill 按任务类型路由到不同方法：

| 任务 | 方法 |
|---|---|
| **创建**新文档 | 写一个 `docx`（npm）脚本 |
| **编辑**现有文档 | `unzip` → 编辑 `word/document.xml` → `zip`（docx-js 无法打开既有文件） |
| **读取**内容 | `pandoc -t markdown file.docx` |

## 使用场景

- 用户提到 "Word doc"、"word document"、`.docx`、`.dotx`，或要求生成带 TOC、标题、页码、信头等专业排版的文档。
- 从 `.docx` / `.dotx` 中提取或重组内容，插入/替换图片，做查找替换。
- 处理修订（tracked changes）或批注（comments）。
- 用户要 "report"、"memo"、"letter"、"template" 这类交付物，且要求是 Word/`.docx` 文件。
- **不适用**：PDF、电子表格、Google Docs 或与文档生成无关的常规编程任务。

## 能力说明

### 用 docx-js 创建——避坑指南

`docx` 包是预装的——不要先跑 `npm install`，直接写脚本并 `require('docx')`；只有当 `require` 失败时才 `npm install docx`。要点：

- **页面默认 A4。** US Letter 需 `page: { size: { width: 12240, height: 15840 } }`（DXA，1440 = 1″）。
- **横向：** 传竖向尺寸 + `orientation: PageOrientation.LANDSCAPE`——docx-js 内部会交换宽高。
- **表格需要双宽度：** 同时在 table 上设 `columnWidths`、在每个 cell 上设 `width`，都用 `WidthType.DXA`（PERCENTAGE 在 Google Docs 里会坏）。列宽之和必须等于表宽。
- **表格底纹：** 用 `ShadingType.CLEAR`，绝不用 `SOLID`（会渲染成黑色）。
- **列表：** 绝不直接插 `•`；用带 `LevelFormat.BULLET` 的 `numbering` 配置。
- **`ImageRun` 必须带 `type:`**（`"png"`、`"jpg"`…）。
- **`PageBreak` 必须包在 `Paragraph` 里。**
- **绝不使用 `\n`**——用独立的 `Paragraph` 元素。
- **TOC：** 标题必须用内置 `HeadingLevel.*`；自定义 heading 样式需设 `outlineLevel`，否则不会出现在 TOC。
- **不要用表格当水平线**——用段落底部边框。
- **点引导线 / 同行右对齐：** 用 `PositionalTab`（`alignment: PositionalTabAlignment.RIGHT`, `leader: PositionalTabLeader.DOT`），不要用字面 `.` 或空格填充。

### 校验输出

```bash
python scripts/office/soffice.py --headless --convert-to pdf output.docx
pdftoppm -jpeg -r 100 output.pdf page
ls page-*.jpg   # 然后把这些图片 Read 进来看
```

`pdftoppm` 会按页数宽度做零填充（`page-01.jpg`…`page-12.jpg`）。

### 编辑既有文档

老式 `.doc` 必须先转换：`python scripts/office/soffice.py --headless --convert-to docx file.doc`。

```bash
unzip -q doc.docx -d unpacked/
find unpacked -type l -delete   # 剥掉符号链接——外部 .docx 不被信任
python scripts/merge_runs.py unpacked/   # 合并碎片化 run，让文本可被搜到
# 在 unpacked/word/document.xml 里就地编辑——不要 reformat 或 pretty-print
(cd unpacked && rm -f ../out.docx && zip -Xr ../out.docx .)
python scripts/office/validate.py out.docx --original doc.docx   # XSD 检查；--auto-repair 修常见问题
# 要红线修订？加 --author "<你的名字>" 检查每次编辑是否被 tracked
```

Word 会把文本切到很多 `<w:r>` run 里（revision id、拼写检查标记），所以你能在文档里看到的短语在 XML 里常常不是连续字符串。`merge_runs.py` 在不改变内容和渲染的前提下合并 `word/document.xml` 中相邻、同格式的 run；它也能直接接 `.docx`（`python scripts/merge_runs.py doc.docx -o merged.docx`）。

**Tracked changes：** 红线修订时用 `--author "<你的名字>"`（需 `--original`）校验——它会报告任何没被 `<w:ins>`/`<w:del>` 包住的改动（这种错很容易犯且在 accepted view 里看不见）。把 run 包进 `<w:ins>`/`<w:del>`，带 `w:id`、`w:author`、`w:date`。在 `<w:del>` 里文本元素是 `<w:delText>` 而不是 `<w:t>`。删除段落标记（`<w:pPr><w:rPr><w:del .../>`）意为"把此段并入下一段"——所以彻底删段等于它加上把每个 run 都包进 `<w:del>`。`<w:del/>` 必须出现在 rPr 其他子元素之前，顺序由 schema 强制。

生成全部接受修订的干净副本：`python scripts/accept_changes.py in.docx out.docx`。

## 参考资源

- `scripts/merge_runs.py` — 合并相邻同格式 run
- `scripts/accept_changes.py` — 接受所有 tracked changes
- `scripts/office/validate.py` — OOXML schema 校验
- `scripts/office/soffice.py` — LibreOffice headless 封装
- `scripts/templates/` — 文档模板
- `scripts/office/schemas/` — ECMA / ISO-IEC29500-4 / MCE schema

## 原文链接

- 仓库路径：https://github.com/anthropics/skills/tree/main/skills/docx
- SKILL.md 原文：https://raw.githubusercontent.com/anthropics/skills/main/skills/docx/SKILL.md
