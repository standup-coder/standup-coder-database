---
id: vendor-management
type: atomic-skill
title: Vendor Management
nameZh: 供应商管理
domain: product
tags: leadership, vendor, procurement, sla, governance
catalogSource: internal
catalogFile: atomic-skills/vendor-management.json
catalogAddedAt: 2026-07-26
operation: leadership
level: senior
---

# 供应商管理
> 评估 / 签约 / 监控 / 退出第三方供应商：SaaS / 基础设施 / 服务。
## 操作语义
- 类型: leadership
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `vendor` (string, **必填**)
- `stage` (string, 可选) 取值: evaluate/onboard/monitor/exit
## 输出
- `scorecard` (object, 可选)
- `sla` (object, 可选)
- `exitPlan` (string, 可选)
## 核心要点

供应商管理的失败 80% 不是选错，是签约时没定义"如何退出"；data export + 替代方案应在合同附件里。

## 关键要点

- evaluate（POC + reference）
- contract（SLA + DPA + exit）
- monitor（QBR + scorecard）
- exit（data export + 替代方案）
- SOC2 / ISO 是入门票

## 最佳实践

- scorecard 量化 5-10 项
- QBR 季度定期
- critical 供应商必须有 backup
- price review 每年触发

## 反模式

- ❌ 评估只看 demo 不做 POC
- ❌ 合同没 exit 条款
- ❌ critical SaaS 单 vendor 锁定
- ❌ 不监控就续约

## 分级掌握

- **Junior**: 能跟单一 vendor onboard
- **Mid**: 能跑 evaluate → contract → monitor 全流程
- **Senior**: 能驱动组织级 vendor governance 与 third-party risk

## 参考资源

- [Gartner Vendor Management](https://www.gartner.com/en/insights/vendor-management) — article
- [CSA Vendor Risk](https://cloudsecurityalliance.org/research/topics/third-party-risk-management) — doc
- [NIST SP 800-161](https://csrc.nist.gov/publications/detail/sp/800-161/rev-1/final) — doc

## 相关 Skills
_见所属 composite skill 或 role_