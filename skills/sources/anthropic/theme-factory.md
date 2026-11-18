---
source: anthropic-skills
sourceUrl: https://github.com/anthropics/skills/tree/main/skills/theme-factory
title: theme-factory
name: theme-factory
nameZh: 主题工厂（theme-factory）
category: 创意与设计（example-skills 插件）
tags: [theme, styling, colors, fonts, slides, deck, palette]
rank: 11
plugin: example-skills
license: Apache 2.0
hasReferences: true
references: [theme-showcase.pdf, themes/arctic-frost.md, themes/botanical-garden.md, themes/desert-rose.md, themes/forest-canopy.md, themes/golden-hour.md, themes/midnight-galaxy.md, themes/modern-minimalist.md, themes/ocean-depths.md, themes/sunset-boulevard.md, themes/tech-innovation.md]
---

# theme-factory

> Toolkit for styling artifacts with a theme. These artifacts can be slides, docs, reportings, HTML landing pages, etc. There are 10 pre-set themes with colors/fonts that you can apply to any artifact that has been creating, or can generate a new theme on-the-fly.

## 概述

`theme-factory` 是用主题给 artifact 套样式的工具箱。artifact 可以是幻灯片、文档、报表、HTML 落地页等。内置 10 套预设主题（含配色与字体），可应用到任何已创建的 artifact，或当场生成新主题。

## 使用场景

- 给幻灯片 deck / 文档 / 报表 / HTML 落地页等 artifact 套上一致、专业的样式。
- 在 10 套预设主题中挑选，或当预设都不合适时生成自定义主题。

## 能力说明

### 目的

为演示幻灯片套上一致、专业的样式。每套主题包括：

- 含 hex 码的协调调色板。
- 互补的标题/正文字体配对。
- 适合不同场景与受众的独特视觉识别。

### 使用流程

1. **展示主题预览**：把 `theme-showcase.pdf` 展示给用户，让他们直观看到所有可用主题。不要修改它，仅供查看。
2. **询问选择**：问用户想把哪套主题应用到 deck。
3. **等待选择**：得到对所选主题的明确确认。
4. **应用主题**：选定后，把该主题的颜色与字体应用到 deck/artifact。

### 可用主题（10 套，均在 `theme-showcase.pdf` 中预览）

1. **Ocean Depths** — 专业且 calming 的航海主题。
2. **Sunset Boulevard** — 温暖且 vibrant 的夕阳色。
3. **Forest Canopy** — 自然且 grounded 的大地色。
4. **Modern Minimalist** — 干净且 contemporary 的灰阶。
5. **Golden Hour** — 浓郁且温暖的秋日调色板。
6. **Arctic Frost** — 冷峻且 crisp 的冬季灵感主题。
7. **Desert Rose** — 柔和且 sophisticated 的蒙尘色。
8. **Tech Innovation** — 大胆且现代的科技美学。
9. **Botanical Garden** — 清新且有机的花园色。
10. **Midnight Galaxy** — 戏剧化且宇宙感的深色调。

### 主题细节

每套主题定义在 `themes/` 目录下，完整规范包括：协调调色板（含 hex）、互补字体配对、独特视觉识别。

### 应用过程

选定偏好主题后：

1. 从 `themes/` 目录读取对应主题文件。
2. 把指定颜色与字体一致地应用到整份 deck。
3. 确保对比度与可读性。
4. 在所有幻灯片上保持主题的视觉识别。

### 自创主题

当现有主题都不适合某个 artifact 时，创建自定义主题：根据提供的输入，生成一个与上述类似的新主题，给它一个描述字体/色彩组合含义的相似名字。用任何提供的基本描述来挑合适的颜色/字体。生成后展示给用户审阅与验证，然后按上述流程应用。

## 参考资源

- `theme-showcase.pdf` — 10 套主题的可视化预览
- `themes/ocean-depths.md`、`themes/sunset-boulevard.md`、`themes/forest-canopy.md`、`themes/modern-minimalist.md`、`themes/golden-hour.md`、`themes/arctic-frost.md`、`themes/desert-rose.md`、`themes/tech-innovation.md`、`themes/botanical-garden.md`、`themes/midnight-galaxy.md` — 各主题完整规范

## 原文链接

- 仓库路径：https://github.com/anthropics/skills/tree/main/skills/theme-factory
- SKILL.md 原文：https://raw.githubusercontent.com/anthropics/skills/main/skills/theme-factory/SKILL.md
