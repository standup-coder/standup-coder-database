---
id: incident-response
type: atomic-skill
title: Incident Response
nameZh: 事件响应
domain: devops
tags: ops, incident, oncall, sre, postmortem
catalogSource: internal
catalogFile: atomic-skills/incident-response.json
catalogAddedAt: 2026-07-26
operation: ops
level: mid
---

# 事件响应
> 响应生产事件：检测 / 分诊 / 沟通 / 缓解 / 复盘。
## 操作语义
- 类型: ops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `alert` (string, **必填**)
- `severity` (string, 可选) 取值: sev1/sev2/sev3/sev4
## 输出
- `timeline` (array, 可选)
- `mitigation` (string, 可选)
- `postmortem` (string, 可选)
## 核心要点

Incident response 的核心是"先减损后查因"；oncall 的任务是把客户痛苦降下去，复盘的任务是别再发生。

## 关键要点

- IC（incident commander）单点决策
- mitigate > root-cause（事件中）
- comms / ops / scribe 角色分离
- severity 决定升级路径
- blameless postmortem 文化

## 最佳实践

- runbook + alert 链接互绑
- sev1 触发自动 conf bridge
- every postmortem with action items + owner
- 每月 chaos drill 演练

## 反模式

- ❌ 事件中找 root cause 优先于 mitigate
- ❌ oncall 无 runbook 全靠脑
- ❌ postmortem 找替罪羊
- ❌ 同类事件反复发生但不归因

## 分级掌握

- **Junior**: 能按 runbook 处理 sev3/4
- **Mid**: 能担任 IC 处理 sev1/2 并写 postmortem
- **Senior**: 能驱动组织级 IR 文化与跨部门协同

## 参考资源

- [Google SRE Book: Managing Incidents](https://sre.google/sre-book/managing-incidents/) — book
- [PagerDuty Response](https://response.pagerduty.com/) — doc
- [Incident.io blog](https://incident.io/blog) — article

## 相关 Skills
_见所属 composite skill 或 role_