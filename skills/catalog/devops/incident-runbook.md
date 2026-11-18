---
id: incident-runbook
type: atomic-skill
title: Incident Runbook
nameZh: 事件响应手册
domain: devops
tags: sre, runbook, incident, ops, oncall
catalogSource: internal
catalogFile: atomic-skills/incident-runbook.json
catalogAddedAt: 2026-07-26
operation: ops
level: mid
---

# 事件响应手册
> 撰写针对特定事件类的响应手册，明确检测 / 缓解 / 恢复步骤与责任人。
## 操作语义
- 类型: ops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `incidentType` (string, **必填**) — 事件类别（DB 主从延迟 / API 5xx / payment fail）
- `severity` (any, 可选) 取值: SEV1/SEV2/SEV3
- `audience` (any, 可选) 取值: oncall/sre/support 默认: `"oncall"`
## 输出
- `runbookMd` (string, 可选)
- `escalationPath` (array, 可选)
- `validationSteps` (array, 可选)
## 核心要点

凌晨 3 点的告警面前，runbook 是值班人唯一可以信任的伙伴；写得不清等于没写。

## 关键要点

- 每条 runbook 必须有：症状 / 检测 / 缓解 / 恢复 / 升级路径
- 步骤要可复制粘贴执行
- 工具命令固化（kubectl / psql / 自研 cli）
- 与告警一对一绑定
- 定期演练（GameDay）验证有效

## 最佳实践

- 用模板（symptom / impact / detection / mitigation）保持结构
- 版本化、加 lastVerified 字段
- 链接到相关 dashboard / postmortem
- oncall handoff 走 checklist

## 反模式

- ❌ runbook 只写"重启服务"
- ❌ 没有升级路径，事故扩大无人接手
- ❌ 链接全部失效，半年没维护
- ❌ 与告警脱节，oncall 不知道哪条 runbook 对应

## 分级掌握

- **Junior**: 能照 runbook 执行恢复操作
- **Mid**: 能撰写覆盖 detect/mitigate/recover 全流程的 runbook
- **Senior**: 能制定 runbook 治理规范，驱动 GameDay 与告警-runbook 闭环

## 参考资源

- [Google SRE: Postmortem Culture](https://sre.google/sre-book/postmortem-culture/) — doc
- [PagerDuty Runbook Template](https://response.pagerduty.com/before/runbook/) — doc

## 相关 Skills
_见所属 composite skill 或 role_