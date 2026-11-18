---
id: cohort-analysis
type: atomic-skill
title: Cohort Analysis
nameZh: 同期群分析
domain: data
tags: analytics, retention, cohort, product, growth
catalogSource: internal
catalogFile: atomic-skills/cohort-analysis.json
catalogAddedAt: 2026-07-26
operation: analytics
level: mid
---

# 同期群分析
> 按获客日期或属性分群用户，追踪留存 / 活跃 / 收入曲线随时间变化。
## 操作语义
- 类型: analytics
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `eventTable` (string, **必填**)
- `cohortDimension` (string, **必填**) — 分群维度（注册周 / 渠道 / 设备）
- `metric` (any, 可选) 取值: retention/revenue/frequency 默认: `"retention"`
- `windowDays` (number, 可选) 默认: `90`
## 输出
- `cohortMatrix` (array, 可选)
- `insights` (array, 可选)
- `chartUrl` (string, 可选)
## 核心要点

Cohort 是看清增长真相的显微镜：整体平均会撒谎，分群才不会。

## 关键要点

- 按获客日期 / 渠道 / 设备分群
- 关注 D1/D7/D30 留存形状
- 后期 cohort 改善 = 产品改进；恶化 = 模型恶化
- 区分纯粹留存与"复活"
- Cohort 越细，样本噪声越大

## 最佳实践

- 用 cohort 矩阵替代单一留存数
- 稳定 cohort 来对比版本变更
- 与漏斗联动，定位掉队 cohort 的具体步骤
- 识别"产品市场契合度"信号

## 反模式

- ❌ 只看整体 DAU 增长
- ❌ 把不同获客渠道 cohort 强行平均
- ❌ 缺乏长尾观察，断言 PMF

## 分级掌握

- **Junior**: 能跑出留存矩阵
- **Mid**: 能联动 cohort + funnel 定位
- **Senior**: 能用 cohort 驱动产品/增长决策

## 参考资源

- [Andrew Chen: Power user curve](https://andrewchen.com/power-user-curve/) — article
- [Mixpanel cohort guide](https://mixpanel.com/blog/cohort-analysis-guide/) — article

## 相关 Skills
_见所属 composite skill 或 role_