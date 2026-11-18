---
type: external
source: skills-sh
sourceUrl: https://www.skills.sh/site/open.feishu.cn/lark-task
title: lark-task
nameZh: 飞书任务
category: Lark/飞书办公协同
tags: [飞书, Lark, Lark/飞书办公协同]
rank: 42
id: lark-task
domain: tools
domainLabel: Lark/飞书
catalogSource: skills-sh
catalogFile: 42_飞书任务.md
catalogAddedAt: 2026-07-26
---
# lark-task（飞书任务）

> 飞书任务(Task)待办管理能力

## 概述

Install the lark-task skill for your AI agent. Published on open.feishu.cn.

## 使用场景

- 用户提到「待办 / todo / 任务」时，先判断归属，不要默认走本 skill。
- 走 lark-minutes 的 `minutes +todo`（禁止本 skill）：上下文含 妙记 / 会议纪要 / minute_token / 妙记 URL（`/minutes/`）；或「在某某妙记里新建/修改待办」「妙记 AI 待办」「会议录制里的待办」。
- 走本 skill（lark-task）：任务清单、分配给我、项目待办、截止日期/提醒、子任务、任务清单成员；或 applink 含 `client/todo/task?guid=`；或明确说「飞书任务」「任务中心」「我的任务清单」。
- 禁止：用户要在妙记里加待办时，不要调用 `task tasklists list`、`task +create` 或任何 task 命令去「找清单再放任务」。

## 能力说明

CRITICAL — 开始前 MUST 先用 Read 工具读取 `../lark-shared/SKILL.md`，其中包含认证、权限处理
任务搜索技巧：先区分用户是否特地指定使用搜索 skill，以及是否真的提供了查询关键字（例如任务名称、关键词、片段描述）。如果用户特地指定使用搜索 skill，或明确给出了任务查询关键字，则目标是任务时优先使用 `+search`。如果用户没有特地指定使用搜索 skill，且意图里没有查询关键字，只有范围条件（例如“今年以来”“已完成”“由我创建”“我关注的”），并且使用 `+search` 与 `+get-related-tasks` / `+get-my-tasks` 都能达到目的时，应优先使用列表型能力，而不是搜索型能力。其中，“与我相关 / 我关注的 / 由我创建”等优先考虑 `+get-related-tasks`；“我负责的 / 分配给我”的列表优先考虑 `+get-my-tasks`。不要把时间范围词（例如“今年以来”）本身误当成 `query` 去走搜索。
任务搜索相关性提示：`+search` 当前不会自动判断搜索结果与搜索发起人的相关性。如果用户明确要求搜索“与我相关”的任务，必须先识别具体关系，获取当前用户的 `open_id`，并显式传入对应的 `--assignee`（负责人）、`--creator`（创建人）或 `--follower`（关注人）过滤条件；不能只依赖 `query` 期待自动返回与当前用户相关的任务。
任务清单搜索技巧：任务清单也遵循同样的判断逻辑。先区分用户是否特地指定使用搜索 skill，以及是否真的提供了清单查询关键字（例如清单名称、关键词、片段描述）。如果用户特地指定使用搜索 skill，或明确给出了清单查询关键字，则优先使用 `+tasklist-search`。如果用户没有特地指定使用搜索 skill，且意图里没有查询关键字，只有范围条件（例如“由我创建的任务清单”“今年以来创建的清单”），并且使用搜索或原生列取清单都能达到目的时，应优先使用原生 `tasklists.list` 接口列取清单（先 `schema task.tasklists.list`，再 `lark-cli task tasklists list --as user ...`），再按 `creator`、`created_at` 等字段做本地筛选和分页控制。
意图区分补充：像“搜索飞书中今年以来我关注的任务”这类表达，虽然字面带有“搜索”，但如果没有真正的查询关键字，且本质是在限定“与我相关 + 时间范围”，则应优先走 `+get-related-tasks`；像“搜索飞书中由我创建的任务清单”这类表达，如果没有清单关键字，且本质是在限定“清单范围 + 创建者”，则应优先走原生 `tasklists.list` 后筛选，而不是直接走搜索型 shortcut。
用户身份识别：在用户身份（user identity）场景下，如果用户提到了“我”（例如“分配给我”、“由我创建”），请默认获取当前登录用户的 `open_id` 作为对应的参数值。
术语理解 — 待办 disambiguation（必读）：
- 用户提到「待办 / todo / 任务」时，先判断归属，不要默认走本 skill。
- 走 lark-minutes 的 `minutes +todo`（禁止本 skill）：上下文含 妙记 / 会议纪要 / minute_token / 妙记 URL（`/minutes/`）；或「在某某妙记里新建/修改待办」「妙记 AI 待办」「会议录制里的待办」。
- 走本 skill（lark-task）：任务清单、分配给我、项目待办、截止日期/提醒、子任务、任务清单成员；或 applink 含 `client/todo/task?guid=`；或明确说「飞书任务」「任务中心」「我的任务清单」。
- 禁止：用户要在妙记里加待办时，不要调用 `task tasklists list`、`task +create` 或任何 task 命令去「找清单再放任务」。
友好输出：在输出任务（或清单）的执行结果给用户时，建议同时提取并输出命令返回结果中的 `url` 字段（任务链接），以便用户可以直接点击跳转查看详情。

## 风险与注意事项

暂无来源说明

## 参考链接

- 原文：https://www.skills.sh/site/open.feishu.cn/lark-task
- 指标：安装数 451,229
