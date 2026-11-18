---
id: cloud-risk-management
type: atomic-skill
title: Cloud Risk Management
nameZh: 云风险管理
domain: security
tags: security, risk, governance, cloud, compliance
catalogSource: internal
catalogFile: atomic-skills/cloud-risk-management.json
catalogAddedAt: 2026-07-26
operation: security
level: senior
---

# 云风险管理
> 基于结构化框架识别 / 评估 / 处置 / 监控云安全风险。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `scope` (string, **必填**)
- `framework` (string, 可选) 取值: nist-rmf/iso-27005/fair/csa-ccm
## 输出
- `riskRegister` (array, 可选)
- `treatments` (array, 可选)
- `residualRisk` (object, 可选)
## 核心要点

风险管理不是"识别一堆未知威胁"，是"用 likelihood × impact 把不确定性压缩为决策"。没有 owner 的风险等于没有。

## 关键要点

- risk = likelihood × impact
- treatment 四选一（accept / mitigate / transfer / avoid）
- residual risk 一定要 owner 签字
- risk register 持续更新而非一次性
- inherent vs residual 区别清楚

## 最佳实践

- 用 FAIR 做量化（货币化）风险
- CSA CCM 对齐云控制点
- risk register 进 GRC 工具
- 每季度复盘风险变化

## 反模式

- ❌ 风险无 owner 永远 high
- ❌ mitigate 完不更新 residual
- ❌ 只看 inherent risk 不看实际控制
- ❌ risk register 静态化

## 分级掌握

- **Junior**: 能维护风险登记册
- **Mid**: 能驱动 treatment 决策与 owner 落实
- **Senior**: 能驱动组织级风险治理与高管对齐

## 参考资源

- [NIST RMF](https://csrc.nist.gov/projects/risk-management) — doc
- [CSA CCM](https://cloudsecurityalliance.org/research/cloud-controls-matrix/) — doc
- [FAIR Institute](https://www.fairinstitute.org/) — doc

## 相关 Skills
_见所属 composite skill 或 role_