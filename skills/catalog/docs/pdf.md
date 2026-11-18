---
type: external
source: anthropic-skills
sourceUrl: https://github.com/anthropics/skills/tree/main/skills/pdf
title: pdf
name: pdf
nameZh: PDF 处理（pdf）
category: 文档（Document Skills / document-skills 插件）
tags: [pdf, pypdf, pdftoppm, ocr, forms, merge, split, office]
rank: 4
plugin: document-skills
license: Proprietary (source-available)
hasReferences: true
references: [reference.md, forms.md, scripts/check_bounding_boxes.py, scripts/check_fillable_fields.py, scripts/convert_pdf_to_images.py, scripts/create_validation_image.py, scripts/extract_form_field_info.py, scripts/extract_form_structure.py, scripts/fill_fillable_fields.py, scripts/fill_pdf_form_with_annotations.py]
id: pdf
domain: docs
domainLabel: 文档
catalogSource: anthropic
catalogFile: pdf.md
catalogAddedAt: 2026-07-26
---

# pdf

> Use this skill whenever the user wants to do anything with PDF files. This includes reading or extracting text/tables from PDFs, combining or merging multiple PDFs into one, splitting PDFs apart, rotating pages, adding watermarks, creating new PDFs, filling PDF forms, encrypting/decrypting PDFs, extracting images, and OCR on scanned PDFs to make them searchable. If the user mentions a .pdf file or asks to produce one, use this skill.

## 概述

`pdf` 是 Anthropic 官方驱动 Claude.ai "create files" 的核心 skill，覆盖 PDF 处理的常用工作流：读取/提取文本与表格、合并、拆分、旋转、加水印、新建 PDF、填表单、加解密、提取图片、对扫描件做 OCR。基础操作用 Python 库 + 命令行工具；高级特性、JavaScript 库和详细示例见 `reference.md`；填 PDF 表单需先读 `forms.md` 并按其指引操作。

## 使用场景

- 用户提到 `.pdf` 文件或要求产出 PDF。
- 提取文本、表格、图片，或对扫描件做 OCR 让其可搜索。
- 合并多个 PDF、拆分、旋转页面、加水印。
- 创建新 PDF（报告、简历、海报等）。
- 填写 PDF 表单（fillable 或基于 annotation 的）。
- 加密 / 解密 PDF。

## 能力说明

### Quick Start

```python
from pypdf import PdfReader, PdfWriter

# 读取 PDF
reader = PdfReader("document.pdf")
print(f"Pages: {len(reader.pages)}")

# 提取文本
text = ""
for page in reader.pages:
    text += page.extract_text()
```

### Python 库 — pypdf 基础操作

**合并 PDF：**

```python
from pypdf import PdfWriter, PdfReader

writer = PdfWriter()
for pdf_file in ["doc1.pdf", "doc2.pdf", "doc3.pdf"]:
    reader = PdfReader(pdf_file)
    for page in reader.pages:
        writer.add_page(page)

with open("merged.pdf", "wb") as output:
    writer.write(output)
```

**拆分 PDF：**

```python
reader = PdfReader("input.pdf")
for i, page in enumerate(reader.pages):
    writer = PdfWriter()
    writer.add_page(page)
    with open(f"page_{i+1}.pdf", "wb") as output:
        writer.write(output)
```

**提取元数据：**

```python
reader = PdfReader("document.pdf")
meta = reader.metadata
print(f"Title: {meta.title}")
print(f"Author: {meta.author}")
print(f"Subject: {meta.subject}")
print(f"Creator: {meta.creator}")
```

### 表单处理

填表单走 `forms.md`：先 `scripts/check_fillable_fields.py` 判断是否为可填表单；若是，用 `scripts/fill_fillable_fields.py`；若是基于 annotation 的，走 `scripts/fill_pdf_form_with_annotations.py`，并用 `scripts/check_bounding_boxes.py` / `scripts/create_validation_image.py` 校验坐标。

### 转图片 / OCR

`scripts/convert_pdf_to_images.py` 把 PDF 转成图片用于视觉校验或 OCR；扫描件可用 OCR 工具让其变得可搜索。

## 参考资源

- `reference.md` — 高级特性、JavaScript 库、详细示例
- `forms.md` — PDF 表单填写流程
- `scripts/check_bounding_boxes.py` — 检查坐标边界
- `scripts/check_fillable_fields.py` — 判断是否可填表单
- `scripts/convert_pdf_to_images.py` — PDF 转图片
- `scripts/create_validation_image.py` — 生成校验图
- `scripts/extract_form_field_info.py` — 提取表单字段信息
- `scripts/extract_form_structure.py` — 提取表单结构
- `scripts/fill_fillable_fields.py` — 填可填字段
- `scripts/fill_pdf_form_with_annotations.py` — 填 annotation 表单

## 原文链接

- 仓库路径：https://github.com/anthropics/skills/tree/main/skills/pdf
- SKILL.md 原文：https://raw.githubusercontent.com/anthropics/skills/main/skills/pdf/SKILL.md
