---
type: external
source: skills-sh
sourceUrl: https://www.skills.sh/site/open.feishu.cn/lark-wiki
title: lark-wiki
nameZh: 飞书知识库
category: Lark/飞书办公协同
tags: [飞书, Lark, Lark/飞书办公协同]
rank: 39
id: lark-wiki
domain: tools
domainLabel: Lark/飞书
catalogSource: skills-sh
catalogFile: 39_飞书知识库.md
catalogAddedAt: 2026-07-26
---
# lark-wiki（飞书知识库）

> 飞书知识库(Wiki)文档空间能力

## 概述

Install the lark-wiki skill for your AI agent. Published on open.feishu.cn.

## 使用场景

- 如果目标是“部门”，先判断身份，再决定是否继续。
- `--as bot` 对应 `tenant_access_token`。官方限制：这种身份下不能使用部门 ID (`opendepartmentid`) 添加知识空间成员。
- 遇到“部门 + --as bot”时，禁止先调用 `lark-cli wiki +member-add` 试错；直接说明该路径不可行。
- 如果用户明确要求“以 bot 身份运行”，且目标是部门，必须停下说明 bot 路径无法完成，不要静默切到 `--as user`。

## 能力说明

CRITICAL — 开始前 MUST 先用 Read 工具读取 `../lark-shared/SKILL.md`，其中包含认证、权限处理
成员管理硬限制：
- 如果目标是“部门”，先判断身份，再决定是否继续。
- `--as bot` 对应 `tenant_access_token`。官方限制：这种身份下不能使用部门 ID (`opendepartmentid`) 添加知识空间成员。
- 遇到“部门 + --as bot”时，禁止先调用 `lark-cli wiki +member-add` 试错；直接说明该路径不可行。
- 如果用户明确要求“以 bot 身份运行”，且目标是部门，必须停下说明 bot 路径无法完成，不要静默切到 `--as user`。
知识空间和节点都是用户的个人资源，策略上应优先显式使用 `--as user`（CLI 的 `--as` 默认值为 `auto`，不带 `--as` 时常被解析成 `bot`，列出的是应用所属空间而非用户的）。仅当用户明确要求“应用 / bot 视角”时才用 `--as bot`（仍受上面的成员管理硬限制约束）。

## 风险与注意事项

暂无来源说明

## 参考链接

- 原文：https://www.skills.sh/site/open.feishu.cn/lark-wiki
- 指标：安装数 451,316
