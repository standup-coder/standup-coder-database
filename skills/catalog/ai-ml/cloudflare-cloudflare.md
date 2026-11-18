---
type: external
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/cloudflare/skills
title: "Cloudflare/cloudflare"
nameZh: "Cloudflare 平台"
category: "DevOps / Infra"
tags: ["cloudflare","workers","edge","deployment"]
rank: 25
id: cloudflare-cloudflare
domain: ai-ml
domainLabel: AI/ML/LLM
catalogSource: voltagent
catalogFile: cloudflare-cloudflare.md
catalogAddedAt: 2026-07-26
---

# Cloudflare/cloudflare

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://officialskills.sh/cloudflare/skills/cloudflare)

## 概述

A broad reference skill for Cloudflare development, spanning Workers, Pages, storage (KV, D1, R2), AI (Workers AI, Vectorize, Agents SDK), networking (Tunnel, Spectrum), security (WAF, DDoS), and infrastructure-as-code (Terraform, Pulumi). Biases towards retrieval from Cloudflare docs over pre-trained knowledge.
Cloudflare's product surface changes frequently and spans many SDKs and APIs — this skill pulls up-to-date docs across Workers, storage, AI, networking, and IaC so recommendations reflect current behavior rather than stale training data.

**中文名称**：Cloudflare 平台
**供应商**：cloudflare
**分类**：DevOps / Infra

## 使用场景

- Picking the right Cloudflare primitives (Workers, Pages, D1, R2, Durable Objects) for a new project
- Wiring up Workers AI or Vectorize into an existing application
- Standing up a Cloudflare Tunnel or Spectrum listener for an internal service
- Configuring WAF and DDoS protections for a production domain
- Managing Cloudflare resources as code via Terraform or Pulumi

## 能力说明

- **安装方式**：`npx skills add https://github.com/cloudflare/skills` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/cloudflare/skills](https://github.com/cloudflare/skills)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Cloudflare/cloudflare 详情页](https://officialskills.sh/cloudflare/skills/cloudflare)
- [源代码仓库](https://github.com/cloudflare/skills)
- [officialskills.sh 平台](https://officialskills.sh/)
