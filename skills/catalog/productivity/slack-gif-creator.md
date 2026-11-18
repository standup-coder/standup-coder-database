---
type: external
source: anthropic-skills
sourceUrl: https://github.com/anthropics/skills/tree/main/skills/slack-gif-creator
title: slack-gif-creator
name: slack-gif-creator
nameZh: Slack GIF 创建器（slack-gif-creator）
category: 创意与设计（example-skills 插件）
tags: [gif, slack, animation, pil, emoji, optimization]
rank: 14
plugin: example-skills
license: Apache 2.0
hasReferences: false
references: [core/gif_builder.py, requirements.txt]
id: slack-gif-creator
domain: productivity
domainLabel: 生产力
catalogSource: anthropic
catalogFile: slack-gif-creator.md
catalogAddedAt: 2026-07-26
---

# slack-gif-creator

> Knowledge and utilities for creating animated GIFs optimized for Slack. Provides constraints, validation tools, and animation concepts. Use when users request animated GIFs for Slack like "make me a GIF of X doing Y for Slack."

## 概述

`slack-gif-creator` 是为 Slack 优化的动画 GIF 创建工具箱，提供约束、验证工具和动画概念。当用户请求如 "make me a GIF of X doing Y for Slack" 这类 Slack GIF 时使用。

## 使用场景

- 用户要为 Slack 创建动画 GIF（如表情 GIF、消息 GIF）。
- 需要满足 Slack 对 GIF 尺寸、帧率、色数、时长的约束。

## 能力说明

### Slack 要求

**尺寸：**

- Emoji GIF：128×128（推荐）
- 消息 GIF：480×480

**参数：**

- FPS：10-30（越低文件越小）
- 颜色：48-128（越少文件越小）
- 时长：emoji GIF 控制在 3 秒以内

### 核心工作流

```python
from core.gif_builder import GIFBuilder
from PIL import Image, ImageDraw

# 1. 创建 builder
builder = GIFBuilder(width=128, height=128, fps=10)

# 2. 生成帧
for i in range(12):
    frame = Image.new('RGB', (128, 128), (240, 248, 255))
    draw = ImageDraw.Draw(frame)
    # 用 PIL 基本图元画动画（圆、多边形、线等）
    builder.add_frame(frame)

# 3. 保存并优化
builder.save('output.gif', num_colors=48, optimize_for_emoji=True)
```

### 绘制图形

**处理用户上传的图片**：先判断用户是想直接用（"animate this"、"split this into frames"）还是当灵感（"make something like this"）。用 PIL 加载：

```python
from PIL import Image
uploaded = Image.open('file.png')
# 直接用，或仅作颜色/风格参考
```

**从零绘制**：用 PIL `ImageDraw` 基本图元（圆、多边形、线等）绘制动画。

### 优化

- `optimize_for_emoji=True` 针对 emoji 用途做优化。
- `num_colors` 控制色数（48-128）以减小文件。
- 帧率与时长平衡流畅度与文件大小。

## 参考资源

- `core/gif_builder.py` — GIFBuilder 核心类
- `requirements.txt` — Python 依赖

## 原文链接

- 仓库路径：https://github.com/anthropics/skills/tree/main/skills/slack-gif-creator
- SKILL.md 原文：https://raw.githubusercontent.com/anthropics/skills/main/skills/slack-gif-creator/SKILL.md
