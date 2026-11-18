---
type: external
source: skills-sh
sourceUrl: https://www.skills.sh/site/open.feishu.cn/lark-contact
title: lark-contact
nameZh: 飞书通讯录
category: Lark/飞书办公协同
tags: [飞书, Lark, Lark/飞书办公协同]
rank: 32
id: lark-contact
domain: tools
domainLabel: Lark/飞书
catalogSource: skills-sh
catalogFile: 32_飞书通讯录.md
catalogAddedAt: 2026-07-26
---
# lark-contact（飞书通讯录）

> 飞书通讯录(Contact)联系人能力

## 概述

Install the lark-contact skill for your AI agent. Published on open.feishu.cn.

## 使用场景

- Install the lark-contact skill for your AI agent. Published on open.feishu.cn.

## 能力说明

user 身份和 bot 身份是两条完全独立的路径。先确定当前身份,再按下表选命令:
想做什么
user 身份
bot 身份
按姓名 / 邮箱搜员工拿 open_id
[`+search-user`](https://open.feishu.cn/.well-known/skills/lark-contact/references/lark-contact-search-user.md)
不支持
已知 open_id 取他人资料
`+search-user --user-ids `
[`+get-user --user-id `](https://open.feishu.cn/.well-known/skills/lark-contact/references/lark-contact-get-user.md)
查看自己
`+get-user` 或 `+search-user --user-ids me`

## 风险与注意事项

暂无来源说明

## 参考链接

- 原文：https://www.skills.sh/site/open.feishu.cn/lark-contact
- 指标：安装数 451,622
