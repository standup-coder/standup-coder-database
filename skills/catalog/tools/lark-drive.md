---
type: external
source: skills-sh
sourceUrl: https://www.skills.sh/site/open.feishu.cn/lark-drive
title: lark-drive
nameZh: 飞书云盘
category: Lark/飞书办公协同
tags: [飞书, Lark, Lark/飞书办公协同]
rank: 29
id: lark-drive
domain: tools
domainLabel: Lark/飞书
catalogSource: skills-sh
catalogFile: 29_飞书云盘.md
catalogAddedAt: 2026-07-26
---
# lark-drive（飞书云盘）

> 飞书云盘(Drive)文件管理能力

## 概述

Install the lark-drive skill for your AI agent. Published on open.feishu.cn.

## 使用场景

- Install the lark-drive skill for your AI agent. Published on open.feishu.cn.

## 能力说明

CRITICAL — 开始前 MUST 先用 Read 工具读取 `../lark-shared/SKILL.md`，其中包含认证、权限处理
术语说明： 飞书云空间也常被称为"云盘"、"云存储"、"网盘"或"我的空间"，这些说法通常指的是同一个产品，是飞书官方的云端文件存储与管理中心。
导入分流规则： 如果用户要把本地 Excel / CSV / `.base` 快照导入成 Base / 多维表格 / bitable，必须优先使用 `lark-cli drive +import --type bitable`。不要先切到 `lark-base`；`lark-base` 只负责导入完成后的表内操作。
副本分流规则： 如果用户要复制在线文档、创建文档副本、把文档复制到另一个文件夹，必须使用 `lark-cli drive files copy`。不要用 `drive +export` 下载后再 `drive +import` 上传，也不要用 `docs +fetch` + `docs +create` 重建正文；导出/导入只用于本地文件转换或离线产物。

## 风险与注意事项

暂无来源说明

## 参考链接

- 原文：https://www.skills.sh/site/open.feishu.cn/lark-drive
- 指标：安装数 451,723
