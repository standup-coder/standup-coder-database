---
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/hashicorp/skills
title: "HashiCorp/azure-verified-modules"
nameZh: "Azure 验证模块"
category: "DevOps / Infra"
tags:
  - hashicorp
  - terraform
  - azure
  - avm
rank: 24
---

# HashiCorp/azure-verified-modules

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/hashicorp/skills/azure-verified-modules)

## 概述

Azure Verified Modules (AVM) skill covers the mandatory and recommended requirements for building Terraform modules that meet AVM certification standards. It defines rules for provider versions, variable and output structure, code style, testing tooling, and breaking change management. The requirements are organized by severity: MUST, SHOULD, and MAY.
Instead of manually cross-referencing 37 AVM requirements across multiple spec pages, this skill surfaces the exact rule, severity level, and correct HCL pattern for any part of the module you are working on.

**中文名称**：Azure 验证模块
**供应商**：hashicorp
**分类**：DevOps / Infra

## 使用场景

- Checking whether a new Terraform module meets AVM certification before submitting it
- Setting provider version constraints for azurerm and azapi correctly
- Structuring variables with proper types, descriptions, and nullable settings
- Writing output blocks that avoid leaking sensitive data or entire resource objects
- Adding feature toggle variables when introducing new resources in minor versions

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
- [HashiCorp/azure-verified-modules 详情页](https://officialskills.sh/hashicorp/skills/azure-verified-modules)
- [源代码仓库](https://github.com/hashicorp/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
