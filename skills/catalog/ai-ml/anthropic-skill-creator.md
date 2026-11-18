---
type: external
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/anthropics/skills/tree/main/skills/skill-creator
title: "Anthropic/skill-creator"
nameZh: "技能创建器"
category: "Official Skills / Meta"
tags: ["anthropic","meta","authoring"]
rank: 1
id: anthropic-skill-creator
duplicateOf: skill-creator
domain: ai-ml
domainLabel: AI/ML/LLM
catalogSource: voltagent
catalogFile: skill-creator.md
catalogAddedAt: 2026-07-26
---

# Anthropic/skill-creator

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/anthropics/skills/skill-creator)

## 概述

A skill for building, testing, and refining other skills. It guides you through drafting a skill, running test cases with and without the skill, reviewing outputs qualitatively and quantitatively, and iterating based on feedback. Also handles description optimization to improve when the skill gets triggered.
It handles the full create-test-iterate loop automatically, including spawning baseline comparison runs, grading assertions, and launching a review viewer, which would otherwise require coordinating multiple scripts and manual eval tracking.

**中文名称**：技能创建器
**供应商**：anthropics
**分类**：Official Skills / Meta

## 使用场景

- Writing a first draft of a skill from a rough idea or existing workflow
- Running parallel test cases to compare outputs with and without a skill active
- Reviewing eval results in a browser viewer before deciding what to change
- Benchmarking two versions of a skill to measure improvement across iterations
- Optimizing a skill's description so it triggers at the right times and not others

## 能力说明

- **安装方式**：`npx skills add https://github.com/anthropics/skills/tree/main/skills/skill-creator` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/anthropics/skills/tree/main/skills/skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Anthropic/skill-creator 详情页](https://officialskills.sh/anthropics/skills/skill-creator)
- [源代码仓库](https://github.com/anthropics/skills/tree/main/skills/skill-creator)
- [officialskills.sh 平台](https://officialskills.sh/)
