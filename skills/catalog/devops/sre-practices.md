---
id: sre-practices
type: atomic-skill
title: SRE Engineer
nameZh: SRE 工程师
domain: devops
tags: sre, reliability, slo, on-call, toil
catalogSource: internal
catalogFile: atomic-skills/sre-engineer.json
catalogNote: id renamed from sre-engineer to avoid collision with roles/sre-engineer
catalogAddedAt: 2026-07-26
operation: ops
level: senior
---

# SRE 工程师
> 以 SRE 视角运营：基于 SLO 驱动可靠性、error budget、on-call 与 toil 削减。
## 操作语义
- 类型: ops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `service` (string, **必填**)
- `sloTarget` (number, 可选)
## 输出
- `sloDoc` (string, 可选)
- `errorBudget` (object, 可选)
- `toilReport` (object, 可选)
## 核心要点

SRE 不是"会写代码的运维"，是用工程方法管理可靠性；SLO + error budget 是和产品讨价还价的硬通货。

## 关键要点

- SLI → SLO → SLA 由内向外
- error budget 是发布速度与稳定性 trade-off 单位
- toil < 50% 工作量
- blameless culture
- oncall 健康度同等重要

## 最佳实践

- 每服务 1-3 个 SLI 不要堆
- 错预算耗尽冻发布
- 把 toil 季度盘点列优先级
- oncall 轮换 + handoff 模板

## 反模式

- ❌ SLO 写了不与产品挂钩
- ❌ error budget 没人看
- ❌ toil 占 80% 工作
- ❌ oncall 长期一两个人扛

## 分级掌握

- **Junior**: 能轮 oncall + 写 runbook
- **Mid**: 能搭 SLO + error budget 与产品对齐
- **Senior**: 能驱动组织级 SRE 文化与跨团队 reliability 战略

## 参考资源

- [Google SRE Book](https://sre.google/sre-book/table-of-contents/) — book
- [SLO Calculator](https://sre.google/workbook/implementing-slos/) — doc
- [Increment: On-Call](https://increment.com/on-call/) — article

## 相关 Skills
_见所属 composite skill 或 role_