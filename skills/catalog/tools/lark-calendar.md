---
type: external
source: skills-sh
sourceUrl: https://www.skills.sh/site/open.feishu.cn/lark-calendar
title: lark-calendar
nameZh: 飞书日历
category: Lark/飞书办公协同
tags: [飞书, Lark, Lark/飞书办公协同]
rank: 30
id: lark-calendar
domain: tools
domainLabel: Lark/飞书
catalogSource: skills-sh
catalogFile: 30_飞书日历.md
catalogAddedAt: 2026-07-26
---
# lark-calendar（飞书日历）

> 飞书日历(Calendar)日程管理能力

## 概述

Install the lark-calendar skill for your AI agent. Published on open.feishu.cn.

## 使用场景

- Install the lark-calendar skill for your AI agent. Published on open.feishu.cn.

## 能力说明

开始前先读 `../lark-shared/SKILL.md`（认证、权限处理）。
CRITICAL — 凡涉及预约日程/会议室、调整时间或查询/搜索会议室，第一步 MUST 读 `references/lark-calendar-schedule-meeting.md`。仅编辑字段（改标题/描述）或增删参会人（不涉及时间和会议室）时可跳过，直接读 `references/lark-calendar-update.md`。
日程操作默认使用 `--as user`（查看和管理当前用户的日程）。`--as bot` 只能访问 bot 自己的（空）日历，会拿到空结果——不要用 bot 身份查用户日程。
```
lark-cli calendar +agenda --as bot
lark-cli calendar +agenda --as user
```

## 风险与注意事项

暂无来源说明

## 参考链接

- 原文：https://www.skills.sh/site/open.feishu.cn/lark-calendar
- 指标：安装数 451,684
