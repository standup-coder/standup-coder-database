---
type: external
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/expo/skills
title: "Expo/expo-deployment"
nameZh: "Expo 部署"
category: "Mobile"
tags: ["expo","react-native","deployment"]
rank: 27
id: expo-expo-deployment
domain: tools
domainLabel: 第三方工具集成
catalogSource: voltagent
catalogFile: expo-deployment.md
catalogAddedAt: 2026-07-26
---

# Expo/expo-deployment

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/expo/skills/expo-deployment)

## 概述

Handles deploying Expo apps to iOS App Store, Google Play Store, and web hosting using EAS (Expo Application Services). Covers builds, store submissions, TestFlight distribution, PR preview URLs, and automated CI/CD workflows via EAS Workflows.
EAS handles code signing, version increments, and store credential management automatically, removing the manual Xcode/Gradle steps that typically break CI pipelines.

**中文名称**：Expo 部署
**供应商**：expo
**分类**：Mobile

## 使用场景

- Submitting an iOS build to TestFlight for beta review
- Running automated Play Store deployments when code merges to main
- Generating preview URLs for web app pull requests
- Managing build version numbers remotely across iOS and Android
- Setting up a single eas.json config to handle both platform builds and submissions

## 能力说明

- **安装方式**：`npx skills add https://github.com/expo/skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/expo/skills](https://github.com/expo/skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Expo/expo-deployment 详情页](https://officialskills.sh/expo/skills/expo-deployment)
- [源代码仓库](https://github.com/expo/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
