---
id: onboarding
type: atomic-skill
title: Customer Onboarding
nameZh: 客户引导
domain: product
tags: customer-success, onboarding, activation, ttfv, lifecycle
catalogSource: internal
catalogFile: atomic-skills/onboarding.json
catalogAddedAt: 2026-07-26
operation: customer-success
level: mid
---

# 客户引导
> 设计结构化的客户引导流程，缩短首价值时间（TTFV），降低早期流失。
## 操作语义
- 类型: customer-success
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `segment` (string, **必填**) — 客户分层（SMB / Mid / Enterprise）
- `milestones` (array, 可选)
- `kickoffMode` (any, 可选) 取值: self-serve/high-touch/hybrid 默认: `"self-serve"`
- `durationDays` (number, 可选) 默认: `30`
## 输出
- `playbook` (string, 可选)
- `ttfvDays` (number, 可选)
- `healthScoreInitial` (number, 可选)
## 核心要点

客户引导决定 12 个月续约率：首价值时间（TTFV）每缩短 1 天，留存提升肉眼可见。

## 关键要点

- 北极星：TTFV / Activation rate
- 里程碑必须可量化、有反馈
- 产品引导（PLG）与人工引导（high-touch）按 ARR 分层
- 健康分早期信号 > 等到流失再救
- onboarding 是产品的一部分，不是 CSM 的私事

## 最佳实践

- kickoff 30 分钟内确认成功标准
- 产品内引导 + 邮件序列双通道
- 每个 milestone 完成自动 check-in
- 把 onboarding 数据接入产品分析

## 反模式

- ❌ 一份 PDF 发完算 onboarding
- ❌ 里程碑只有时间没有内容
- ❌ 客户卡住无人发现，30 天后才发现没用
- ❌ CSM 与 PM 隔离，引导 ≠ 产品改进闭环

## 分级掌握

- **Junior**: 能跑标准 onboarding playbook
- **Mid**: 能按客户分层设计 TTFV / 里程碑 / 健康分
- **Senior**: 能驱动 onboarding 与产品 / CRM / 增长闭环

## 参考资源

- [Wes Bush: Product-Led Growth](https://productled.com/blog) — doc
- [Gainsight: Customer Onboarding Best Practices](https://www.gainsight.com/customer-onboarding/) — article

## 相关 Skills
_见所属 composite skill 或 role_