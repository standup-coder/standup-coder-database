---
id: risk-management
type: atomic-skill
title: Risk Management
nameZh: 风险管理
domain: product
tags: leadership, risk, governance, project, process
catalogSource: internal
catalogFile: atomic-skills/risk-management.json
catalogAddedAt: 2026-07-26
operation: leadership
level: senior
---

# 风险管理
> 通用风险管理框架：识别 / 分析 / 处置 / 监控工程、供应商与项目风险。
## 操作语义
- 类型: leadership
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `scope` (string, **必填**)
- `domain` (string, 可选) 取值: engineering/project/vendor/security/compliance
## 输出
- `riskRegister` (array, 可选)
- `treatments` (array, 可选)
- `residualRisk` (object, 可选)
## 核心要点

风险管理的关键不是消灭风险，是把"未知的不确定"变成"已知的取舍"；reside risk 必须有 owner 签字才算闭环。

## 关键要点

- risk = likelihood × impact
- 4 种处置（accept / mitigate / transfer / avoid）
- inherent vs residual 一定区分
- risk register 持续更新
- red flag 早升级

## 最佳实践

- 每 initiative 一份风险登记
- 高 residual risk 走 exec 评审
- 与 OKR / roadmap 绑定
- 定期复盘风险预测准确度

## 反模式

- ❌ 一份 risk register 写完锁柜
- ❌ 所有风险都 mitigate 不分优先级
- ❌ owner 写「TBD」永远不落实
- ❌ 只盯技术风险忽视组织 / 供应商风险

## 分级掌握

- **Junior**: 能识别 / 登记项目风险
- **Mid**: 能跑 treatment 决策与 owner 闭环
- **Senior**: 能驱动组织级 risk governance 与高管对齐

## 参考资源

- [PMBOK Risk Management](https://www.pmi.org/pmbok-guide-standards) — doc
- [NIST Risk Management](https://csrc.nist.gov/projects/risk-management) — doc
- [HBR: Managing Risks](https://hbr.org/2012/06/managing-risks-a-new-framework) — article

## 相关 Skills
_见所属 composite skill 或 role_