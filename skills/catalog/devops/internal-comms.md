---
type: external
source: anthropic-skills
sourceUrl: https://github.com/anthropics/skills/tree/main/skills/internal-comms
title: internal-comms
name: internal-comms
nameZh: 内部沟通（internal-comms）
category: 企业与沟通（example-skills 插件）
tags: [communication, internal-comms, status-report, newsletter, faq, incident-report]
rank: 13
plugin: example-skills
license: Apache 2.0
hasReferences: true
references: [examples/3p-updates.md, examples/company-newsletter.md, examples/faq-answers.md, examples/general-comms.md]
id: internal-comms
domain: devops
domainLabel: DevOps
catalogSource: anthropic
catalogFile: internal-comms.md
catalogAddedAt: 2026-07-26
---

# internal-comms

> A set of resources to help me write all kinds of internal communications, using the formats that my company likes to use. Claude should use this skill whenever asked to write some sort of internal communications (status reports, leadership updates, 3P updates, company newsletters, FAQs, incident reports, project updates, etc.).

## 概述

`internal-comms` 是一套资源，帮助 Claude 用公司偏好的格式撰写各类内部沟通。当被要求写任何形式的内部沟通时使用——状态报告、领导层更新、3P 更新、公司通讯、FAQ、事故报告、项目更新等。

## 使用场景

- 状态报告（status reports）。
- 领导层更新（leadership updates）。
- 3P 更新（Progress / Plans / Problems）。
- 公司通讯（company newsletters）。
- FAQ。
- 事故报告（incident reports）。
- 项目更新（project updates）。
- 其他形式的内部沟通。

## 能力说明

该 skill 提供示例模板库，覆盖公司常用的内部沟通格式。每类示例展示结构与语气基线，Claude 据此产出符合公司风格的内部沟通内容。

### 示例类型

`examples/` 目录下：

- **3p-updates.md** — Progress / Plans / Problems 三段式更新。
- **company-newsletter.md** — 公司通讯。
- **faq-answers.md** — FAQ 回答。
- **general-comms.md** — 通用内部沟通。

## 参考资源

- `examples/3p-updates.md` — 3P 更新模板
- `examples/company-newsletter.md` — 公司通讯模板
- `examples/faq-answers.md` — FAQ 回答模板
- `examples/general-comms.md` — 通用沟通模板

## 原文链接

- 仓库路径：https://github.com/anthropics/skills/tree/main/skills/internal-comms
- SKILL.md 原文：https://raw.githubusercontent.com/anthropics/skills/main/skills/internal-comms/SKILL.md
