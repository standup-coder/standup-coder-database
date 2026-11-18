---
type: external
source: anthropic-skills
sourceUrl: https://github.com/anthropics/skills/tree/main/skills/brand-guidelines
title: brand-guidelines
name: brand-guidelines
nameZh: Anthropic 品牌指南（brand-guidelines）
category: 创意与设计（example-skills 插件）
tags: [branding, anthropic, colors, typography, visual-identity, styling]
rank: 10
plugin: example-skills
license: Apache 2.0
hasReferences: false
references: []
id: brand-guidelines
domain: design
domainLabel: 设计
catalogSource: anthropic
catalogFile: brand-guidelines.md
catalogAddedAt: 2026-07-26
---

# brand-guidelines

> Applies Anthropic's official brand colors and typography to any sort of artifact that may benefit from having Anthropic's look-and-feel. Use it when brand colors or style guidelines, visual formatting, or company design standards apply.

## 概述

`brand-guidelines` 把 Anthropic 官方品牌色彩与字体应用到任何能从"Anthropic 长相"中受益的 artifact 上。当涉及品牌色、风格指南、视觉格式化或公司设计标准时使用。

**关键词**：branding、corporate identity、visual identity、post-processing、styling、brand colors、typography、Anthropic brand、visual formatting、visual design。

## 使用场景

- 任何需要套上 Anthropic 官方视觉识别的 artifact。
- 涉及品牌色、风格指南、视觉格式化、公司设计标准时。

## 能力说明

### 品牌指南

**主色：**

- Dark：`#141413` — 主要文本与深色背景
- Light：`#faf9f5` — 浅色背景与深色上的文本
- Mid Gray：`#b0aea5` — 次要元素
- Light Gray：`#e8e6dc` — 微妙背景

**强调色：**

- Orange：`#d97757` — 主要 accent
- Blue：`#6a9bcc` — 次要 accent
- Green：`#788c5d` — 第三 accent

### 字体

- **标题**：Poppins（fallback Arial）
- **正文**：Lora（fallback Georgia）
- **注意**：环境预装这些字体会得到最佳效果

### 功能特性

**智能字体应用**：

- 24pt 及以上标题套用 Poppins。
- 正文套用 Lora。
- 自定义字体不可用时自动 fallback 到 Arial / Georgia。
- 在所有系统上保持可读性。

**文本样式**：

- 标题（24pt+）：Poppins 字体
- 正文：Lora 字体
- 根据背景智能选择颜色
- 保留文本层级与格式

**形状与强调色**：

- 非文本形状使用强调色
- 在橙、蓝、绿三色 accent 间循环
- 保持视觉趣味性的同时不偏离品牌

### 技术细节

- 字体可用时使用系统预装的 Poppins / Lora。
- 自动 fallback 到 Arial（标题）/ Georgia（正文）。

## 参考资源

无独立 references 子目录。

## 原文链接

- 仓库路径：https://github.com/anthropics/skills/tree/main/skills/brand-guidelines
- SKILL.md 原文：https://raw.githubusercontent.com/anthropics/skills/main/skills/brand-guidelines/SKILL.md
