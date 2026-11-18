---
source: anthropic-skills
sourceUrl: https://github.com/anthropics/skills/tree/main/skills/canvas-design
title: canvas-design
name: canvas-design
nameZh: 画布设计（canvas-design）
category: 创意与设计（example-skills 插件）
tags: [visual-design, poster, pdf, png, art, design-philosophy, creative]
rank: 9
plugin: example-skills
license: Apache 2.0
hasReferences: false
references: [canvas-fonts/]
---

# canvas-design

> Create beautiful visual art in .png and .pdf documents using design philosophy. You should use this skill when the user asks to create a poster, piece of art, design, or other static piece. Create original visual designs, never copying existing artists' work to avoid copyright violations.

## 概述

`canvas-design` 用于创作静态视觉艺术（海报、艺术品、设计稿等），产出 `.png` 和 `.pdf`。它走"设计哲学"路径——先创建一个被视觉诠释的美学运动，再在画布上表达。只输出 `.md`、`.pdf`、`.png` 文件。

流程两步：
1. 设计哲学创建（`.md` 文件）。
2. 在画布上表达（`.pdf` 或 `.png` 文件）。

## 使用场景

- 用户要创建海报、艺术品、设计稿或其他静态作品。
- 想要原创视觉设计（避免复制既有艺术家作品以规避版权问题）。

## 能力说明

### 设计哲学创建

创建一个视觉哲学（不是布局或模板），它将被以下方式诠释：

- 形式、空间、色彩、构图。
- 图像、图形、形状、图案。
- 极简文字作为视觉点缀。

**关键理解**：
- 收到：用户的一些细微输入或指令，作为基础但不限制创作自由。
- 创建：一个设计哲学 / 美学运动。
- 接下来：同一版本收到哲学后**用视觉表达它**——创作 90% 视觉设计 + 10% 关键文本的 artifact。

### 如何生成视觉哲学

**命名运动**（1-2 词）："Brutalist Joy" / "Chromatic Silence" / "Metabolist Dreams"。

**阐述哲学**（4-6 段，精炼但完整），表达它如何通过以下方式显现：

- 空间与形式。
- 色彩与材质。
- 尺度与节奏。
- 构图与平衡。
- 视觉层级。

**关键准则**：
- **避免冗余**：每个设计层面只提一次，避免重复色彩理论、空间关系、排版原理，除非增加新深度。
- **反复强调工艺**：哲学必须多次强调最终作品应看起来像花了无数小时创作、被精心打磨、出自该领域顶尖人物之手。重复短语如"meticulously crafted"、"the product of deep expertise"、"painstaking attention"、"master-level execution"。
- **留出创作空间**：对美学方向要具体，但精炼到让下一个 Claude 有空间在极高工艺水准上做诠释性选择。

哲学必须引导下一版**用视觉**表达想法，而非通过文本。信息活在设计里，不在段落里。

### 哲学示例

**"Concrete Poetry"** — 哲学：通过纪念碑式形式与粗野几何传达。视觉表达：巨大色块、雕塑式排版（巨大的单词、微小的标签）、粗野主义空间划分、波兰海报能量遇上 Le Corbusier。想法通过视觉重量与空间张力表达，而非解释。文字作为罕见而有力的姿态——从不是段落，只有融入视觉架构的关键词。每个元素都按大师匠人的精度放置。

**"Chromatic Language"** — 哲学：色彩作为主要信息系统。视觉表达：几何精度，色区创造意义。排版极简——小无衬线标签让色彩场说话。想到 Josef Albers 的"interaction"遇上数据可视化。信息按空间和色彩编码。文字只为锚定色彩已展示的内容。

**"Analog Meditation"** — 哲学：通过纹理与呼吸空间进行的安静视觉冥想。视觉表达：纸张颗粒、墨水洇开、巨大负空间。摄影与插画主导。排版被低语（小、克制、服务视觉）。日式摄影书美学。图像跨页呼吸。

### 字体资源

`canvas-fonts/` 目录预置大量开源字体（OFL 协议）用于设计：Arsenal SC、Big Shoulders、Boldonse、Bricolage Grotesque、Crimson Pro、DM Mono、Erica One、Geist Mono、Gloock、IBM Plex Mono/Serif、Instrument Sans/Serif、Italiana、JetBrains Mono、Jura、Libre Baskerville、Lora、National Park、Nothing You Could Do、Outfit、Pixelify Sans、Poiret One、Red Hat Mono、Silkscreen、Smooch Sans、Tektur、Work Sans、Young Serif 等。

## 参考资源

- `canvas-fonts/` — 大量预置开源字体（含 OFL 协议文本与 TTF 文件）

## 原文链接

- 仓库路径：https://github.com/anthropics/skills/tree/main/skills/canvas-design
- SKILL.md 原文：https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/SKILL.md
