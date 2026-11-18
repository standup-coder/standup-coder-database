---
type: external
source: mcpmarket
sourceUrl: https://mcpmarket.com/zh/tools/skills/gh-issues-auto-fixer
title: GH Issues Auto-Fixer
nameZh: GitHub Issue 自动修复器
category: DevOps 自动化
tags: ["GitHub","Issue","PR","自动化","子代理","Code Review","Claude Code"]
rank: 2
publisher: openclaw
installs: 312k
id: gh-issues-auto-fixer
domain: tools
domainLabel: 未分类
catalogSource: mcpmarket
catalogFile: gh-issues-auto-fixer.md
catalogAddedAt: 2026-07-26
---

# GitHub Issue 自动修复器

> Automates the end-to-end GitHub issue lifecycle by spawning sub-agents to implement code fixes, open pull requests, and resolve review comments.

## 概述

GH Issues Auto-Fixer 自动化处理 GitHub issue 的完整生命周期。它会派生子代理定位问题、实现代码修复、提交 Pull Request,并响应 review 评论直至问题闭环,大幅降低维护者的重复劳动。

## 使用场景

- 批量处理仓库 backlog 中的小修小补 issue
- 为新上报的 bug 自动生成修复 PR 草稿
- 在 review 阶段自动回应 reviewer 的修改建议

## 能力说明

- 派生多个子代理并行处理 issue 的不同子任务
- 自动生成代码改动并创建带描述的 PR
- 解析 review 评论并迭代修改代码
- 与 GitHub CLI 深度集成,完成 issue 关闭、标签管理等操作

## 风险与注意事项

自动化修改代码存在引入回归的风险,建议在 CI 严格把关并限制可触碰的仓库范围;子代理并发可能消耗较多 token 配额。

## 参考链接

- 详情页:https://mcpmarket.com/zh/tools/skills/gh-issues-auto-fixer

