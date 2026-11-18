---
type: external
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/LambdaTest/agent-skills/tree/main/playwright-skill
title: "TestMu AI/playwright-skill"
nameZh: "Playwright 测试生成"
category: "Testing"
tags: ["playwright","e2e","testing"]
rank: 32
id: testmu-ai-playwright-skill
domain: testing
domainLabel: 测试
catalogSource: voltagent
catalogFile: testmu-ai-playwright-skill.md
catalogAddedAt: 2026-07-26
---

# TestMu AI/playwright-skill

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://github.com/LambdaTest/agent-skills/tree/main/playwright-skill)

## 概述

# Playwright Test Automation

## Step 1 — Determine Execution Target

Decide BEFORE writing any code:

| User says... | Target | Action |
|---|---|---|
| No cloud mention, "locally", "debug" | **Local** | Standard Playwright config |
| "cloud", "TestMu", "LambdaTest", "cross-browser", "real device" | **Cloud** | See [reference/cloud-integration.md](reference/cloud-integration.md) |
| Impossible local combo (Safari on Windows, Edge on Linux) | **Cloud** | Suggest TestMu AI, see [reference/cloud-integration.md](reference/cloud-integration.md) |
| "HyperExecute", "parallel at scale" | **HyperExecute** | Defer to `hyperexecute-skill` |
| "visual regression", "screenshot comparison" | **SmartUI** | Defer to `smartui-skill` |
| Ambiguous | **Local** | Default local, mention cloud option |

## Step 2 — Detect Language

| Signal | Language | Default |
|---|---|---|
| "TypeScript", "TS", `.ts`, or no language specified | TypeScript | ✅ |
| "JavaScript", "JS", `.js` | JavaScript | |
| "Python", "pytest", `.py` | Python | See [reference/python-patterns.md](reference/python-patterns.md) |
| "Java", "Maven", "Gradle", "TestNG" | Java | See [reference/java-patterns.md](reference/java-patterns.md) |
| "C#", ".NET", "NUnit", "MSTest" | C# | See [reference/csharp-patterns.md](reference/csharp-patterns.md) |

## Step 3 — Determine Scope

| Request type | Output |
|---|---|
| One-off quick script | Standalone `.ts` file, no POM |
| Single test for existing project | Match their structure and conventions |

**中文名称**：Playwright 测试生成
**供应商**：testmu-ai
**分类**：Testing

## 使用场景

- 在支持 Agent Skills 的编码助手（如 Claude Code、Codex、Cursor、Gemini CLI）中调用此技能
- 配合 TestMu AI 相关的开发任务使用
- 需要访问对应平台 API 或 SDK 时自动激活

## 能力说明

- **安装方式**：`npx skills add https://github.com/LambdaTest/agent-skills/tree/main/playwright-skill` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/LambdaTest/agent-skills/tree/main/playwright-skill](https://github.com/LambdaTest/agent-skills/tree/main/playwright-skill)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [TestMu AI/playwright-skill 详情页](https://github.com/LambdaTest/agent-skills/tree/main/playwright-skill)
- [源代码仓库](https://github.com/LambdaTest/agent-skills/tree/main/playwright-skill)
- [officialskills.sh 平台](https://officialskills.sh/)
