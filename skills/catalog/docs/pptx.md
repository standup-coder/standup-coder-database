---
type: external
source: anthropic-skills
sourceUrl: https://github.com/anthropics/skills/tree/main/skills/pptx
title: pptx
name: pptx
nameZh: PowerPoint 演示文稿处理（pptx）
category: 文档（Document Skills / document-skills 插件）
tags: [powerpoint, pptx, potx, slides, deck, pptxgenjs, markitdown, office]
rank: 3
plugin: document-skills
license: Proprietary (source-available)
hasReferences: false
references: [scripts/thumbnail.py, scripts/add_slide.py, scripts/clean.py, scripts/office/validate.py, scripts/office/soffice.py]
id: pptx
domain: docs
domainLabel: 文档
catalogSource: anthropic
catalogFile: pptx.md
catalogAddedAt: 2026-07-26
---

# pptx

> Use this skill any time a .pptx or .potx file is involved in any way — as input, output, or both. This includes: creating slide decks, pitch decks, or presentations; reading, parsing, or extracting text from any .pptx or .potx file; editing, modifying, or updating existing presentations; combining or splitting slide files; working with templates, layouts, speaker notes, or comments. Trigger whenever the user mentions "deck," "slides," "presentation," or references a .pptx or .potx filename, regardless of what they plan to do with the content afterward.

## 概述

`pptx` 是 Anthropic 官方驱动 Claude.ai "create files" 的核心 skill，用于创建、编辑、分析 PowerPoint 演示文稿（`.pptx`）和模板（`.potx`）。一个 `.pptx` 本质上是 XML 文件的 ZIP 归档；skill 按任务路由：

| 任务 | 方法 |
|---|---|
| **创建**新 deck | 写 `pptxgenjs` 脚本 |
| **编辑**既有 deck 或基于模板构建 | unzip → 编辑 `ppt/slides/slideN.xml` → zip |
| **读取**内容 | `markitdown deck.pptx`（每张幻灯片一个块，带 `<!-- Slide number: N -->` 标记）；视觉网格：`python scripts/thumbnail.py deck.pptx` |

## 使用场景

- 用户提到 "deck"、"slides"、"presentation"，或引用任何 `.pptx` / `.potx` 文件名。
- 创建幻灯片、路演 deck、演示。
- 读取、解析、提取文字（即便提取出的内容要拿到别处用，比如邮件或摘要）。
- 编辑、修改、更新既有演示。
- 合并 / 拆分幻灯片文件，处理模板（`.potx`）、布局、演讲者备注、批注。
- 任何需要打开、创建、触碰 `.pptx` / `.potx` 的场景。

## 能力说明

### 脚本

路径相对于本 skill 目录。其他都是普通 Python / `node` / shell：

| 脚本 | 作用 |
|---|---|
| `scripts/thumbnail.py deck.pptx [prefix]` | 每张幻灯片的标注网格，用于挑选模板布局。仅 `.pptx`。传 `prefix`——默认 `thumbnails` 会覆盖同目录下任何其他 deck 的网格 |
| `scripts/add_slide.py unpacked/ slide2.xml [--after slideN.xml]` | 复制幻灯片（或 `slideLayoutN.xml`）并处理包簿记。也能直接接 `.pptx`：`-o out.pptx` |
| `scripts/clean.py unpacked/` | 删除不再被引用的幻灯片、媒体、rels。在 `<p:sldIdLst>` 定稿**之后**运行 |
| `scripts/office/validate.py deck.pptx [--original src.pptx]` | schema、关系、content-type、图表、幻灯片检查；每个失败都点名修法。模板衍生的 deck 传 `--original` 做基线 |
| `scripts/office/soffice.py --headless --convert-to pdf deck.pptx` | LibreOffice 封装——沙箱里裸 `soffice` 会挂起 |

### 用 pptxgenjs 创建——避坑指南

`pptxgenjs` 预装——不要先 `npm install`，直接写脚本并 `require('pptxgenjs')`；只有 `require` 失败才装。要点：

- **加 slide 前先设 `pres.layout`。** 默认画布 `LAYOUT_16x9` = **10" × 5.625"**，不是 13.3" 宽。越界坐标会被写入但不显示。（`LAYOUT_WIDE` 是 13.3" × 7.5"。）
- **Hex 颜色：绝不要 `#`，绝不要 8 位。** `color: "FF0000"`。`"#FF0000"` 和把 alpha 烤进 hex（`"00000020"`）都会**损坏文件**。半透明用 `transparency: 0-100`（填充/图片）或 `opacity: 0.0-1.0`（阴影）——两者在对方位置上会被静默忽略。
- **pptxgenjs 会就地修改 option 对象**（首次使用时把值转成 EMU）。绝不要在两个 `add*` 调用间共享同一个 `shadow`/options 对象——每次新建。
- **阴影 `offset` 必须 ≥ 0**——负 offset 损坏文件。向上投射阴影用 `angle: 270` + 正 offset。
- **`letterSpacing` 被静默忽略**——真正选项是 `charSpacing`。
- **列表：** 每项 `bullet: true`，绝不字面 `•`（会渲染双重点）。除最后一项外每个数组项设 `breakLine: true`。用 `paraSpaceAfter` 控制段落间距，不要用 `lineSpacing`（会有巨大空隙）。
- **每个输出文件一个 `new pptxgen()`**——绝不复用实例。
- **`rectRadius` 只对 `ROUNDED_RECTANGLE` 生效**，不对 `RECTANGLE`。
- **不支持渐变填充**——用渐变图片当背景代替。
- **文本框自带内边距**——文本要和同 x 处的形状/线条/图标对齐时设 `margin: 0`。
- **演讲者备注进 `slide.addNotes("...")`**（纯文本，每张一次），不要进幻灯片上的文本框。
- **图表保持原生。** 能用 `addChart()` 就用（combo 传 `{type, data, options}` 数组）。库没暴露的原生特性（趋势线、误差线）自己算或后处理 OOXML——不要退回成渲染图片。只有 PowerPoint 没有原生形式的（Sankey、网络、和弦）才用图片。
- **默认图表渲染得很裸**——没标题、没数据标签、过时调色板。设 `showTitle` + `title`、`showValue: true` + `dataLabelPosition`、调色板里的 `chartColors: [...]`，并安静化框架。
- **堆叠条/柱状图的 `dataLabelPosition` 必须是 `ctr` / `inEnd` / `inBase`。** `outEnd` **会损坏文件**。
- **使用 `secondaryValAxis`/`secondaryCatAxis` 的 combo 序列，chart options 上要同时有 `valAxes` 和 `catAxes`，各两条。** 否则 pptxgenjs 会写它从未声明的 axis id，PowerPoint **丢弃该图表**并报告文件损坏。只给 `valAxes` 不够。
- **`writeFile()` 之后，跑 `python scripts/office/validate.py deck.pptx`。** 它会报告上述两类图表故障和 PowerPoint 拒绝的 slide-XML 缺陷，并点名修法。在 generator 里修，不要手改打包后的 XML。
- **绝不要重排 `<p:presentation>` 的子元素。** pptxgenjs 把 `<p:notesMasterIdLst>` 紧跟在 `<p:sldIdLst>` 之后并把两个 master 指向同一 theme。PowerPoint 读得开心——一动这个元素，同一份 deck 就打不开了。
- **图标：** 把 `react-icons` 渲染成 SVG（`ReactDOMServer.renderToStaticMarkup`），用 `sharp` 在 ≥256px 光栅化，再 `addImage({ data: "image/png;base64," + buf.toString("base64") })`——`image/png;base64,` 前缀必填。

### 编辑既有 deck 和模板

先挑布局：`python scripts/thumbnail.py template.pptx template-thumbs` 写出每张幻灯片的标注网格并打印生成的文件。**永远传第二个参数，按 deck 命名。** 它默认 `thumbnails`，所以同目录下两个 deck 会静默互相覆盖（头一个的网格直接没了）。配 `markitdown` 把每个内容段映射到模板幻灯片，并变换布局——不要把每段都放到同一个标题+项目符号页上。

```bash
python3 -c "import sys,zipfile; zipfile.ZipFile(sys.argv[1]).extractall('unpacked')" deck.pptx
python scripts/add_slide.py unpacked/ slide2.xml --after slide2.xml   # 复制幻灯片（或 slideLayoutN.xml）；打印新幻灯片路径
# 重排/删幻灯片 = 编辑 ppt/presentation.xml 里的 <p:sldIdLst>
python scripts/clean.py unpacked/                                     # 删除后：清理孤儿幻灯片、媒体、rels
# 在 ppt/slides/slideN.xml 里编辑内容
(cd unpacked && rm -f ../out.pptx && zip -Xr ../out.pptx .)           # 从目录内部 zip；先 rm 否则删掉的部分会残留
python scripts/office/validate.py out.pptx --original deck.pptx
```

## 参考资源

- `scripts/thumbnail.py` — 幻灯片缩略图网格
- `scripts/add_slide.py` — 复制幻灯片
- `scripts/clean.py` — 清理孤儿部件
- `scripts/office/validate.py` — OOXML schema 校验
- `scripts/office/soffice.py` — LibreOffice headless 封装
- `scripts/office/schemas/` — ECMA / ISO-IEC29500-4 / MCE schema

## 原文链接

- 仓库路径：https://github.com/anthropics/skills/tree/main/skills/pptx
- SKILL.md 原文：https://raw.githubusercontent.com/anthropics/skills/main/skills/pptx/SKILL.md
