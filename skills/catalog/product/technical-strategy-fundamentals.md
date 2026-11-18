---
id: technical-strategy-fundamentals
type: atomic-skill
title: Technical Strategy (Fundamentals)
nameZh: 技术战略（基础）
domain: product
tags: leadership, strategy, architecture, cto, tech-investment
catalogSource: internal
catalogFile: atomic-skills/technical-strategy-fundamentals.json
catalogAddedAt: 2026-07-26
operation: leadership
level: senior
---

# 技术战略（基础）
> 定义与业务目标对齐的技术战略：架构 / build vs buy / 技术投入。
## 操作语义
- 类型: leadership
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `horizon` (string, **必填**) 取值: 1y/3y/5y
- `businessGoals` (array, 可选)
## 输出
- `strategyDoc` (string, 可选)
- `bets` (array, 可选)
- `kpi` (array, 可选)
## 核心要点

技术战略不是技术清单，是"为什么不做某些事"的判断；好的战略让团队 80% 决策无需上层介入。

## 关键要点

- 战略 = 诊断 + 引导政策 + 一致行动（Rumelt）
- build vs buy vs partner 三选一
- 技术债与 product velocity 的 trade-off
- 技术 bets 要能落到季度
- 废止策略与新增同等重要

## 最佳实践

- Wardley Map 看技术演进
- tech radar 公开化
- 每年回顾 bets 命中率
- strategy memo 不超过 6 页

## 反模式

- ❌ "我们要 AI" 这种伪战略
- ❌ 战略写完锁抽屉
- ❌ 什么都做的"全面战略"
- ❌ 技术债持续记账不还

## 分级掌握

- **Junior**: 能理解战略文档
- **Mid**: 能在团队级落地 tech bets
- **Senior**: 能驱动公司级技术战略与多年投入

## 参考资源

- [Good Strategy Bad Strategy](https://www.goodbadstrategy.com/) — book
- [Wardley Maps](https://medium.com/wardleymaps) — article
- [Will Larson: Engineering Strategy](https://lethain.com/strategy/) — article

## 相关 Skills
_见所属 composite skill 或 role_