---
id: growth-automation
type: atomic-skill
title: Growth Automation
nameZh: 增长自动化
domain: marketing
tags: growth, automation, crm, lifecycle, marketing
catalogSource: internal
catalogFile: atomic-skills/growth-automation.json
catalogAddedAt: 2026-07-26
operation: growth
level: mid
---

# 增长自动化
> 基于触发器 / 分群 / 多通道，自动化运营用户全生命周期（欢迎 / 激活 / 召回 / 挽留）。
## 操作语义
- 类型: growth
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `journey` (any, **必填**) 取值: welcome/activation/reengagement/churn-save/cross-sell
- `triggers` (array, 可选)
- `channels` (array, 可选)
- `controlGroup` (boolean, 可选) 默认: `true`
## 输出
- `automationId` (string, 可选)
- `expectedLift` (number, 可选)
- `abtestPlan` (object, 可选)
## 核心要点

增长自动化的杀手不是策略不够，而是消息疲劳与对照组缺失让 ROI 永远算不清。

## 关键要点

- 每个 journey 必须有控制组
- 渠道 + 频次 + 时段建立全局疲劳上限
- 触发器与目标对齐，避免无关推送
- 关注 long-term 指标而非首点击率
- 自动化不能取代洞察，只能放大洞察

## 最佳实践

- 先 A/B 验证增量再上线全量
- unsubscribe / 偏好中心是合规底线
- 与 lifecycle stage 强绑定，不重复触达
- journey 自动化与 CRM 打分联动

## 反模式

- ❌ 全量推送一律算"自动化"
- ❌ 没有对照组，无法度量增量
- ❌ 渠道各自为战，用户被多次打扰
- ❌ 触发器漂移而无人监控

## 分级掌握

- **Junior**: 能搭单一 journey 跑通触发
- **Mid**: 能 A/B + 控制组度量增量、设疲劳上限
- **Senior**: 能搭组织级增长自动化框架与归因体系

## 参考资源

- [Reforge Growth Series](https://www.reforge.com/programs/growth-series) — doc
- [Braze Lifecycle Guide](https://www.braze.com/resources/articles/best-practices-customer-lifecycle-marketing) — article

## 相关 Skills
_见所属 composite skill 或 role_