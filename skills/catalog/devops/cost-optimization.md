---
id: cost-optimization
type: atomic-skill
title: Cost Optimization
nameZh: 成本优化
domain: devops
tags: ops, finops, cost, cloud, optimization
catalogSource: internal
catalogFile: atomic-skills/cost-optimization.json
catalogAddedAt: 2026-07-26
operation: ops
level: mid
---

# 成本优化
> 通过 right-sizing / 长期合约 / 弹性伸缩 / 废弃资源清理持续优化云与基础设施成本。
## 操作语义
- 类型: ops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `scope` (string, **必填**)
- `lookbackDays` (number, 可选) 默认: `30`
## 输出
- `savings` (number, 可选)
- `recommendations` (array, 可选)
- `wasteList` (array, 可选)
## 核心要点

FinOps 的核心是把成本可视化到 owner，然后用工程力量优化；按部门分账后浪费下降 30% 是常态。

## 关键要点

- cost = unit cost × usage × rate
- tag 治理是分账前提
- commitment（RI / Savings Plan）vs spot vs on-demand
- autoscaling > over-provisioning
- 废弃资源（unattached EBS / orphan IP）每月扫

## 最佳实践

- tagging policy 强制执行
- 每月 cost review 与 owner 对齐
- showback → chargeback 渐进
- spot 用于 stateless 与批处理

## 反模式

- ❌ 集中成本看板没人看
- ❌ RI 买完未利用率
- ❌ autoscaling 只伸不缩
- ❌ 只看 invoice 不看单位经济模型

## 分级掌握

- **Junior**: 能跑 cost report 找 top spend
- **Mid**: 能落地 tagging + 长期合约 + autoscaling
- **Senior**: 能驱动组织级 FinOps 文化与 unit economics 治理

## 参考资源

- [FinOps Foundation](https://www.finops.org/) — doc
- [AWS Cost Explorer](https://docs.aws.amazon.com/cost-management/) — doc
- [GCP Billing Reports](https://cloud.google.com/billing/docs/reports) — doc

## 相关 Skills
_见所属 composite skill 或 role_