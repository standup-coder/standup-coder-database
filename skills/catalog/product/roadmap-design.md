---
id: roadmap-design
type: atomic-skill
title: Roadmap Design
nameZh: 产品路线图设计
domain: product
tags: product, roadmap, strategy, planning, pm
catalogSource: internal
catalogFile: atomic-skills/roadmap-design.json
catalogAddedAt: 2026-07-26
operation: product
level: senior
---

# 产品路线图设计
> 平衡战略 / 用户价值 / 工程容量来设计产品路线图。
## 操作语义
- 类型: product
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `horizon` (string, **必填**) 取值: quarter/half/year
- `themes` (array, 可选)
- `capacity` (object, 可选)
## 输出
- `roadmap` (array, 可选)
- `themes` (array, 可选)
- `risks` (array, 可选)
## 核心要点

Roadmap 不是 feature 列表，是"问题优先级 + 可信度"；按 outcome 而非 output 编排，能避免过承诺。

## 关键要点

- outcome > output（NorthStar metric 驱动）
- Now / Next / Later 替代精确日期
- theme 比单点 feature 稳定
- capacity 留 20-30% buffer
- 每季度 review，不锁年度

## 最佳实践

- ProductBoard / Productplan / Linear 做工具
- roadmap 公开 → 反馈 → 复盘形成节奏
- 与 OKR 双向映射
- 风险列在 roadmap 上而非藏起来

## 反模式

- ❌ 把销售承诺直接当 roadmap
- ❌ Gantt 精确到天的年计划
- ❌ feature factory 思维
- ❌ roadmap 不公开内部各 stakeholder 信息差

## 分级掌握

- **Junior**: 能维护季度 roadmap
- **Mid**: 能 outcome 驱动 + theme 编排
- **Senior**: 能驱动组织级 roadmap 治理与战略对齐

## 参考资源

- [Product Roadmaps Relaunched](https://www.amazon.com/Product-Roadmaps-Relaunched-Set-Direction/dp/149197172X) — book
- [ProductPlan](https://www.productplan.com/learn/) — doc
- [Reforge: Roadmap](https://www.reforge.com/blog/lean-roadmap) — article

## 相关 Skills
_见所属 composite skill 或 role_