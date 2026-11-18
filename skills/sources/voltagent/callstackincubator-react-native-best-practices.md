---
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/callstackincubator/skills
title: "CallStack/react-native-best-practices"
nameZh: "React Native 最佳实践"
category: "Mobile"
tags:
  - react-native
  - mobile
  - performance
  - callstack
rank: 29
---

# CallStack/react-native-best-practices

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/callstackincubator/skills/react-native-best-practices)

## 概述

A performance optimization guide for React Native apps, based on Callstack's Ultimate Guide to React Native Optimization. Covers FPS, bundle size, TTI, memory leaks, animations, and native modules across JS, iOS, and Android layers. Each guideline includes code patterns, profiling commands, and impact ratings.
Instead of piecing together scattered blog posts, you get a structured, prioritized reference with working code patterns and profiling commands specific to React Native's JS/native bridge model.

**中文名称**：React Native 最佳实践
**供应商**：callstackincubator
**分类**：Mobile

## 使用场景

- Replacing ScrollView with FlashList to fix list scroll jank
- Analyzing JS bundle with source-map-explorer to find bloated dependencies
- Measuring cold-start TTI and cutting it with Hermes mmap and native navigation
- Migrating a slow native module to async Turbo Module with background threading
- Tracking down JS or native memory leaks during a performance review

## 能力说明

- **安装方式**：`npx skills add https://github.com/callstackincubator/skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/callstackincubator/skills](https://github.com/callstackincubator/skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [CallStack/react-native-best-practices 详情页](https://officialskills.sh/callstackincubator/skills/react-native-best-practices)
- [源代码仓库](https://github.com/callstackincubator/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
