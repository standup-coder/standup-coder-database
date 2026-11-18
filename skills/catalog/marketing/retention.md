---
id: retention
type: atomic-skill
title: Retention Strategy
nameZh: 留存策略
domain: marketing
tags: growth, retention, lifecycle, product, analytics
catalogSource: internal
catalogFile: atomic-skills/retention.json
catalogAddedAt: 2026-07-26
operation: growth
level: mid
---

# 留存策略
> 诊断留存曲线，识别驱动因子，设计实验 / lifecycle 项目提升长期留存。
## 操作语义
- 类型: growth
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `product` (string, **必填**)
- `retentionType` (any, 可选) 取值: n-day/unbounded/rolling/bracket 默认: `"n-day"`
- `lookbackDays` (number, 可选) 默认: `90`
## 输出
- `retentionCurve` (array, 可选)
- `drivers` (array, 可选)
- `experiments` (array, 可选)
## 核心要点

没有留存就没有增长：获客是借钱，留存是还款，曲线压平之前所有付费投放都是漏水。

## 关键要点

- 区分 n-day vs unbounded retention，含义不同
- aha moment 与 magic number 是产品化留存的钥匙
- cohort 看趋势，funnel 看断点
- "产品作为习惯"才是长期留存
- natural frequency 决定衡量周期

## 最佳实践

- 先把曲线压平，再考虑获客提速
- lifecycle program（onboarding / engaged / at-risk / win-back）分层
- 用因果实验验证驱动因子
- 与产品 backlog 联动

## 反模式

- ❌ 只看 D1，长尾全忽略
- ❌ 把短期回访当真留存
- ❌ 靠 push 频率换 DAU 数字游戏
- ❌ 没找到 aha moment 就大投放

## 分级掌握

- **Junior**: 能跑出留存矩阵看 D1/D7/D30
- **Mid**: 能识别 aha moment 与驱动因子、设计实验
- **Senior**: 能驱动跨产品留存战略与 lifecycle 体系

## 参考资源

- [Reforge Retention Series](https://www.reforge.com/programs/retention-engagement) — doc
- [Andrew Chen: Power user curve](https://andrewchen.com/power-user-curve/) — article
- [Brian Balfour: Retention as growth foundation](https://brianbalfour.com/essays/retention-engagement-growth) — article

## 相关 Skills
_见所属 composite skill 或 role_