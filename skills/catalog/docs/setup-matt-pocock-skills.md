---
type: external
source: skills-sh
sourceUrl: https://www.skills.sh/mattpocock/skills/setup-matt-pocock-skills
title: setup-matt-pocock-skills
nameZh: 工程技能仓库初始化
category: 工程实践/代码质量
tags: [MattPocock, 工程实践/代码质量]
rank: 48
id: setup-matt-pocock-skills
domain: docs
domainLabel: 文档
catalogSource: skills-sh
catalogFile: 48_工程技能仓库初始化.md
catalogAddedAt: 2026-07-26
---
# setup-matt-pocock-skills（工程技能仓库初始化）

> 为仓库配置 issue tracker、triage 标签与领域文档布局

## 概述

Configure this repo for the engineering skills — set up its issue tracker, triage label vocabulary, and domain doc layout. Run once before first use of the…

## 使用场景

- Explores the current repo to detect GitHub/GitLab remotes, existing `AGENTS.md` or `CLAUDE.md`, and domain doc layout before prompting
- Walks through three guided decisions one at a time: issue tracker location (GitHub, GitLab, local markdown, or custom), triage label vocabulary mapping, and domain doc structure (single or multi-context)
- Writes an `## Agent skills` block to the appropriate root file and creates three reference docs under `docs/agents/` that downstream skills (`to-issues`, `triage`, `diagnose`, `tdd`, `improve-codebase-architecture`) will read
- Allows editing of the draft configuration before committing changes; re-running is only needed if switching trackers or restarting from scratch
- Issue tracker — where issues live (GitHub by default; local markdown is also supported out of the box)
- Triage labels — the strings used for the five canonical triage roles

## 能力说明

Configuration scaffold for engineering skills to locate issue tracker, triage labels, and domain documentation.
- Explores the current repo to detect GitHub/GitLab remotes, existing `AGENTS.md` or `CLAUDE.md`, and domain doc layout before prompting
- Walks through three guided decisions one at a time: issue tracker location (GitHub, GitLab, local markdown, or custom), triage label vocabulary mapping, and domain doc structure (single or multi-context)
- Writes an `## Agent skills` block to the appropriate root file and creates three reference docs under `docs/agents/` that downstream skills (`to-issues`, `triage`, `diagnose`, `tdd`, `improve-codebase-architecture`) will read
- Allows editing of the draft configuration before committing changes; re-running is only needed if switching trackers or restarting from scratch
SKILL.md
Scaffold the per-repo configuration that the engineering skills assume:
- Issue tracker — where issues live (GitHub by default; local markdown is also supported out of the box)
- Triage labels — the strings used for the five canonical triage roles
- Domain docs — where `CONTEXT.md` and ADRs live, and the consumer rules for reading them
This is a prompt-driven skill, not a deterministic script. Explore, present what you found, confirm with the user, then write.
Look at the current repo to understand its starting state. Read whatever exists; don't assume:

## 风险与注意事项

暂无来源说明

## 参考链接

- 原文：https://www.skills.sh/mattpocock/skills/setup-matt-pocock-skills
- 仓库：https://github.com/mattpocock/skills
- 指标：安装数 445.4K，GitHub Stars 179.4K
