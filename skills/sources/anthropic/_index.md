---
source: anthropic-skills
sourceRepo: https://github.com/anthropics/skills
collectedAt: 2026-07-21
totalSkillsInRepo: 17
collectedCount: 17
targetWas: 50
note: 仓库实际仅含 17 个 skill（顶层 skills/ 下每个目录一个 SKILL.md）。按任务要求"总数 < 50 则全部采集"。template/SKILL.md 是模板而非 skill，未计入。
---

# Anthropic 官方 Skills 语料库采集索引

> 采集自 https://github.com/anthropics/skills
> 任务目标：TOP 50。仓库实际 skill 总数 = **17**（< 50），按规则**全量采集**。
> 采集日期：2026-07-21

## 仓库概览

`anthropics/skills` 是 Anthropic 官方的 Claude skills 仓库，演示 skills 系统的能力。skills 覆盖创意应用（艺术、设计）、技术任务（Web 应用测试、MCP 服务器生成）、企业工作流（沟通、品牌）以及生产级文档能力。

仓库顶层结构：

```
anthropics/skills/
├── README.md
├── THIRD_PARTY_NOTICES.md
├── .claude-plugin/
│   └── marketplace.json        # 插件市场配置（3 个插件）
├── spec/                       # Agent Skills 规范
├── template/                   # skill 模板（不计入 skill 数）
└── skills/                     # 17 个 skill
    ├── algorithmic-art/
    ├── brand-guidelines/
    ├── canvas-design/
    ├── claude-api/
    ├── doc-coauthoring/
    ├── docx/
    ├── frontend-design/
    ├── internal-comms/
    ├── mcp-builder/
    ├── pdf/
    ├── pptx/
    ├── skill-creator/
    ├── slack-gif-creator/
    ├── theme-factory/
    ├── web-artifacts-builder/
    ├── webapp-testing/
    └── xlsx/
```

### 插件分组（来自 `.claude-plugin/marketplace.json`）

仓库以 3 个插件形式发布到 Claude Code marketplace：

| 插件 | 含 skill 数 | 说明 |
|---|---|---|
| **document-skills** | 4 | 文档处理套件：Excel、Word、PowerPoint、PDF（驱动 Claude.ai "create files" 能力；source-available，非开源） |
| **example-skills** | 12 | 示例 skill：skill 创建、MCP 构建、视觉设计、算法艺术、内部沟通、Web 测试、artifact 构建、Slack GIF、主题样式等（Apache 2.0） |
| **claude-api** | 1 | Claude API / Anthropic SDK 参考文档（Apache 2.0） |

## 采集统计

- 仓库实际总 skill 数：**17**
- 采集成功数：**17 / 17**（100%）
- 目标 50 未达成原因：仓库本身仅含 17 个 skill，已全量采集。
- 失败/缺失：**无**

## 完整技能表

按采集 rank 排序（1 = 最重要）。rank 优先级：document-skills（驱动生产 Claude.ai 能力）> example-skills 核心开发/元工具 > 创意设计 > 企业沟通 > claude-api（独立插件）。

| Rank | Skill | 中文名 | 插件 | 类别 | 许可证 | references | 文件 |
|---:|---|---|---|---|---|---|---|
| 1 | [xlsx](./xlsx.md) | Excel 表格处理 | document-skills | 文档 | Proprietary (source-available) | scripts/* | xlsx.md |
| 2 | [docx](./docx.md) | Word 文档处理 | document-skills | 文档 | Proprietary (source-available) | scripts/* | docx.md |
| 3 | [pptx](./pptx.md) | PowerPoint 演示文稿处理 | document-skills | 文档 | Proprietary (source-available) | scripts/* | pptx.md |
| 4 | [pdf](./pdf.md) | PDF 处理 | document-skills | 文档 | Proprietary (source-available) | reference.md, forms.md, scripts/* | pdf.md |
| 5 | [skill-creator](./skill-creator.md) | Skill 创建器 | example-skills | 开发与元工具 | Apache 2.0 | references/, agents/, scripts/, eval-viewer/ | skill-creator.md |
| 6 | [mcp-builder](./mcp-builder.md) | MCP 服务器构建器 | example-skills | 开发与集成 | Apache 2.0 | reference/* | mcp-builder.md |
| 7 | [frontend-design](./frontend-design.md) | 前端设计 | example-skills | 创意与设计 | Apache 2.0 | — | frontend-design.md |
| 8 | [algorithmic-art](./algorithmic-art.md) | 算法艺术 | example-skills | 创意与设计 | Apache 2.0 | templates/* | algorithmic-art.md |
| 9 | [canvas-design](./canvas-design.md) | 画布设计 | example-skills | 创意与设计 | Apache 2.0 | canvas-fonts/ | canvas-design.md |
| 10 | [brand-guidelines](./brand-guidelines.md) | Anthropic 品牌指南 | example-skills | 创意与设计 | Apache 2.0 | — | brand-guidelines.md |
| 11 | [theme-factory](./theme-factory.md) | 主题工厂 | example-skills | 创意与设计 | Apache 2.0 | theme-showcase.pdf, themes/* | theme-factory.md |
| 12 | [doc-coauthoring](./doc-coauthoring.md) | 文档协作 | example-skills | 企业与沟通 | Apache 2.0 | — | doc-coauthoring.md |
| 13 | [internal-comms](./internal-comms.md) | 内部沟通 | example-skills | 企业与沟通 | Apache 2.0 | examples/* | internal-comms.md |
| 14 | [slack-gif-creator](./slack-gif-creator.md) | Slack GIF 创建器 | example-skills | 创意与设计 | Apache 2.0 | core/gif_builder.py | slack-gif-creator.md |
| 15 | [web-artifacts-builder](./web-artifacts-builder.md) | Web Artifacts 构建器 | example-skills | 开发与集成 | Apache 2.0 | scripts/* | web-artifacts-builder.md |
| 16 | [webapp-testing](./webapp-testing.md) | Web 应用测试 | example-skills | 开发与集成 | Apache 2.0 | scripts/, examples/* | webapp-testing.md |
| 17 | [claude-api](./claude-api.md) | Claude API/SDK 参考 | claude-api | 开发与集成 | Apache 2.0 | {lang}/, shared/* | claude-api.md |

## 按类别分组

### 文档（document-skills 插件，4 个）
驱动 Claude.ai "create files" 生产能力的核心 skill，source-available（非开源）：
- xlsx — Excel 电子表格（openpyxl/pandas/markitdown）
- docx — Word 文档（docx-js/pandoc）
- pptx — PowerPoint 演示文稿（pptxgenjs）
- pdf — PDF 处理（pypdf + 表单填写脚本）

### 开发与元工具（4 个）
- skill-creator — 元 skill，造 skill 的工具
- mcp-builder — 构建 MCP 服务器
- web-artifacts-builder — 构建 claude.ai HTML artifact
- webapp-testing — Playwright Web 应用测试

### 创意与设计（6 个）
- frontend-design — 前端 UI 设计指导
- algorithmic-art — p5.js 算法艺术
- canvas-design — 静态视觉艺术（PNG/PDF）
- brand-guidelines — Anthropic 品牌色与字体
- theme-factory — 10 套预设主题
- slack-gif-creator — Slack 动画 GIF

### 企业与沟通（2 个）
- doc-coauthoring — 文档协作工作流
- internal-comms — 内部沟通模板

### Claude API 参考（1 个，独立插件）
- claude-api — Claude API/Anthropic SDK 全语言参考

## 失败/缺失清单

**无失败、无缺失。** 仓库 17 个 skill 全部成功采集并生成带 frontmatter 的 md 文件。

唯一未采集的 `template/SKILL.md` 是 skill 模板（非实际 skill），按要求不计入。

## 备注

- 所有 md 保留 Anthropic 官方 frontmatter 字段（`name`、`description`、`license`），并补充采集用元字段（`source`、`sourceUrl`、`nameZh`、`category`、`tags`、`rank`、`plugin`、`hasReferences`、`references`）。
- `description` 字段原文为英文，已在正文"概述"以中文转述并保留关键英文术语；正文保留原文关键内容（避坑指南、代码示例、流程）。
- 仓库 README 同时指向 [agentskills.io](http://agentskills.io) 的 Agent Skills 标准，以及 `spec/` 目录下的规范——这些不是 skill 本身，未单独采集。
