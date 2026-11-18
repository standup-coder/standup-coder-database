---
id: slo-error-budget
type: atomic-skill
title: SLO & Error Budget
nameZh: SLO 与错误预算
domain: devops
tags: sre, slo, sli, error-budget, reliability
catalogSource: internal
catalogFile: atomic-skills/slo-error-budget.json
catalogAddedAt: 2026-07-26
operation: observability
level: senior
---

# SLO 与错误预算
> 定义 SLI/SLO 并运营错误预算，平衡可靠性与特性迭代速度。
## 操作语义
- 类型: observability
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `service` (string, **必填**)
- `userJourneys` (array, 可选)
- `businessTier` (any, 可选) 取值: critical/important/best-effort
## 输出
- `sliDefinitions` (array, 可选)
- `sloTargets` (array, 可选)
- `errorBudgetPolicy` (object, 可选)
## 核心要点

100% 可用是错觉：用 SLO 把可靠性定量为预算，超支就停发布，节省就投资速度。

## 关键要点

- SLI（指标）→ SLO（目标）→ SLA（合同），方向不能反
- SLI 选 user-centric：成功率、延迟 P99，而非主机 CPU
- SLO 必须低于 100%，预算 = 1 - SLO，例如 99.9% 月预算 ≈ 43.2 分钟
- 错误预算耗尽 → 发布冻结 + 全员投入可靠性，是组织契约
- 多窗口 burn rate 告警比固定阈值更敏锐
- 重要 user journey 比单服务 SLO 更有意义（多服务组合）

## 最佳实践

- 从 1-2 个核心 SLI 开始，逐步扩展，避免指标洪水
- 用 28 天滚动窗口而非自然月，减少边界跳变
- SLO 定下来要有 review 周期（季度），随业务调整
- 预算耗尽政策写进团队制度，不靠人情豁免
- 把 SLO 状态做成 dashboard，全员可见

## 反模式

- ❌ 追求 99.99%+ 但没有对应基础设施投入
- ❌ SLI 选错（看主机指标而非用户体验）
- ❌ 预算耗尽却继续发布，SLO 沦为摆设
- ❌ SLO 和 SLA 混淆，把对外承诺当内部目标
- ❌ 全公司一个 SLO，无视服务分级

## 分级掌握

- **Junior**: 理解 SLI/SLO/SLA 区别，能为已有指标定 SLO
- **Mid**: 能设计基于 user journey 的 SLO 与多窗口 burn rate 告警
- **Senior**: 能推动错误预算政策落地，调和业务速度与可靠性

## 参考资源

- [Site Reliability Engineering (Google)](https://sre.google/sre-book/table-of-contents/) — book
- [The Site Reliability Workbook](https://sre.google/workbook/table-of-contents/) — book
- [Implementing SLOs (Alex Hidalgo)](https://www.oreilly.com/library/view/implementing-service-level/9781492076803/) — book
- [Multi-window Burn Rate Alerts](https://sre.google/workbook/alerting-on-slos/) — article
- [Sloth (SLO generator)](https://github.com/slok/sloth) — tool

## 相关 Skills
_见所属 composite skill 或 role_