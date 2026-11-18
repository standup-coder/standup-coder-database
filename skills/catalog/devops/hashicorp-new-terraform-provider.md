---
type: external
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/hashicorp/skills
title: "HashiCorp/new-terraform-provider"
nameZh: "Terraform Provider 脚手架"
category: "DevOps / Infra"
tags: ["hashicorp","terraform","provider","iac"]
rank: 23
id: hashicorp-new-terraform-provider
domain: devops
domainLabel: DevOps
catalogSource: voltagent
catalogFile: hashicorp-new-terraform-provider.md
catalogAddedAt: 2026-07-26
---

# HashiCorp/new-terraform-provider

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/hashicorp/skills/new-terraform-provider)

## 概述

Scaffolds a new Terraform provider project using the Plugin Framework. Sets up the Go module, installs dependencies, writes a main.go entry point, and verifies the build compiles and tests pass.
Manually bootstrapping a Terraform provider requires cross-referencing the Plugin Framework docs, writing correct main.go boilerplate, and running several go commands in the right order — this skill handles all of it in one step.

**中文名称**：Terraform Provider 脚手架
**供应商**：hashicorp
**分类**：DevOps / Infra

## 使用场景

- Starting a new Terraform provider from a clean directory structure
- Wiring up the Plugin Framework entry point without reading through boilerplate docs
- Generating a provider workspace that builds and passes tests out of the box
- Adding a second provider to a repo without mixing it into an existing workspace
- Getting a go.mod and dependency tree in place before writing the first resource

## 能力说明

- **安装方式**：`npx skills add https://github.com/hashicorp/skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/hashicorp/skills](https://github.com/hashicorp/skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [HashiCorp/new-terraform-provider 详情页](https://officialskills.sh/hashicorp/skills/new-terraform-provider)
- [源代码仓库](https://github.com/hashicorp/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
