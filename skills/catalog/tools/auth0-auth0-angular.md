---
type: external
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/auth0/skills
title: "Auth0/auth0-angular"
nameZh: "Auth0 Angular 集成"
category: "Auth / Security"
tags: ["auth0","authentication","angular"]
rank: 41
id: auth0-auth0-angular
domain: tools
domainLabel: AI/ML/LLM
catalogSource: voltagent
catalogFile: auth0-angular.md
catalogAddedAt: 2026-07-26
---

# Auth0/auth0-angular

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/auth0/skills/auth0-angular)

## 概述

Adds authentication to Angular apps using the @auth0/auth0-angular SDK. Handles login/logout flows, route guards, HTTP interceptors for attaching tokens, and user profile access through observables.
Wiring up OAuth redirect flows, token storage, and route protection by hand in Angular is tedious and easy to get wrong. This skill sets up the full Auth0 SDK integration with guards and interceptors in a few steps.

**中文名称**：Auth0 Angular 集成
**供应商**：auth0
**分类**：Auth / Security

## 使用场景

- Adding login and signup to an Angular SPA with redirect-based auth
- Protecting specific routes so only authenticated users can access them
- Attaching access tokens to outgoing API calls automatically
- Showing user profile data like name and avatar after login
- Gating features behind authentication state using Angular observables

## 能力说明

- **安装方式**：`npx skills add https://github.com/auth0/skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/auth0/skills](https://github.com/auth0/skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Auth0/auth0-angular 详情页](https://officialskills.sh/auth0/skills/auth0-angular)
- [源代码仓库](https://github.com/auth0/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
