---
type: external
source: skills-sh
sourceUrl: https://www.skills.sh/vercel-labs/agent-skills/web-design-guidelines
title: web-design-guidelines
nameZh: Web 设计规范审查
category: Vercel官方
tags: [Vercel, Vercel官方, 官方]
rank: 9
id: web-design-guidelines
domain: tools
domainLabel: Vercel
catalogSource: skills-sh
catalogFile: 09_Web设计规范审查.md
catalogAddedAt: 2026-07-26
---
# web-design-guidelines（Web 设计规范审查）

> 按 Web Interface Guidelines 审查 UI 代码合规性

## 概述

Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site…

## 使用场景

- Fetches the latest guidelines from a remote source before each review, ensuring rules stay current
- Accepts file paths or patterns as arguments; prompts for files if none provided
- Outputs findings in a terse `file:line` format for quick scanning and remediation
- Covers design, accessibility, and UX best practices as defined in the guidelines repository
- Fetch the latest guidelines from the source URL below
- Read the specified files (or prompt user for files/pattern)

## 能力说明

Audit UI code against Vercel's Web Interface Guidelines for design and accessibility compliance.
- Fetches the latest guidelines from a remote source before each review, ensuring rules stay current
- Accepts file paths or patterns as arguments; prompts for files if none provided
- Outputs findings in a terse `file:line` format for quick scanning and remediation
- Covers design, accessibility, and UX best practices as defined in the guidelines repository
SKILL.md
Review files for compliance with Web Interface Guidelines.
- Fetch the latest guidelines from the source URL below
- Read the specified files (or prompt user for files/pattern)
- Check against all rules in the fetched guidelines
- Output findings in the terse `file:line` format
Fetch fresh guidelines before each review:

## 风险与注意事项

暂无来源说明

## 参考链接

- 原文：https://www.skills.sh/vercel-labs/agent-skills/web-design-guidelines
- 仓库：https://github.com/vercel-labs/agent-skills
- 指标：安装数 480.5K，GitHub Stars 29.3K
