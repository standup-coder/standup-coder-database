---
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/voltagent/voltagent
title: "VoltAgent/voltagent-best-practices"
nameZh: "VoltAgent 最佳实践"
category: "Agent Framework"
tags:
  - voltagent
  - agent-framework
  - typescript
rank: 48
---

# VoltAgent/voltagent-best-practices

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/voltagent/skills/voltagent-best-practices)

## 概述

Reference guide for VoltAgent architectural patterns and conventions. Covers when to use agents versus workflows, project layout, memory configuration, server providers, and observability setup.
Having the conventions in one place means you don't need to dig through the VoltAgent monorepo to find the right import, memory pattern, or server option each time you start a new project.

**中文名称**：VoltAgent 最佳实践
**供应商**：voltagent
**分类**：Agent Framework

## 使用场景

- Choosing between Agent and Workflow when designing a new VoltAgent service
- Wiring up VoltOps tracing by setting the right environment variables
- Picking a server provider based on runtime target (Node, Cloudflare, Netlify)
- Structuring the src/ directory for agents, tools, and workflows
- Avoiding safeStringify footguns when working inside VoltAgent packages

## 能力说明

- **安装方式**：`npx skills add https://github.com/voltagent/voltagent` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/voltagent/voltagent](https://github.com/voltagent/voltagent)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [VoltAgent/voltagent-best-practices 详情页](https://officialskills.sh/voltagent/skills/voltagent-best-practices)
- [源代码仓库](https://github.com/voltagent/voltagent)
- [officialskills.sh 平台](https://officialskills.sh/)
