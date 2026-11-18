---
id: analytics
type: atomic-skill
title: Analytics
nameZh: 产品分析
domain: data
tags: analytics, event-tracking, data, product, dashboard
catalogSource: internal
catalogFile: atomic-skills/analytics.json
catalogAddedAt: 2026-07-26
operation: analytics
level: mid
---

# 产品分析
> 设计事件埋点 schema，搭建 dashboard，用数据回答产品 / 业务问题。
## 操作语义
- 类型: analytics
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `question` (string, **必填**) — 业务问题
- `dataSource` (string, 可选)
- `metric` (string, 可选)
## 输出
- `sql` (string, 可选)
- `chart` (object, 可选)
- `insights` (array, 可选)
## 核心要点

分析师 80% 时间在和数据质量斗争，20% 在思考；好的埋点 schema 让这个比例倒过来。

## 关键要点

- 事件命名约定先行（Object_Action）
- property 维度可枚举与可索引性 trade-off
- 北极星指标 + 输入指标 + 护栏指标三层
- 区分用户级 / 事件级 / 会话级聚合
- self-serve dashboard > 一次性 SQL

## 最佳实践

- 用 tracking plan（Avo / Iteratively）做埋点治理
- 与产品 launch 同期上 dashboard
- 关键指标做 alert，异常自动通知
- 把分析查询固化为 dbt model

## 反模式

- ❌ 每个 PM 自定义事件命名
- ❌ 一张大宽表回答所有问题
- ❌ 一个事件几十个 property，难索引
- ❌ 只看头部指标忽略 cohort / funnel 分解

## 分级掌握

- **Junior**: 能用 BI 工具回答常见问题
- **Mid**: 能设计 tracking plan 与 self-serve dashboard
- **Senior**: 能驱动组织级数据消费文化与指标治理

## 参考资源

- [Amplitude blog](https://amplitude.com/blog) — article
- [Avo tracking plan](https://www.avo.app/) — doc

## 相关 Skills
_见所属 composite skill 或 role_