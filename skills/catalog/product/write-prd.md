---
id: write-prd
type: atomic-skill
title: Write PRD
nameZh: 撰写 PRD
domain: product
tags: product, prd, requirement, spec, pm
catalogSource: internal
catalogFile: atomic-skills/write-prd.json
catalogAddedAt: 2026-07-26
operation: product
level: mid
---

# 撰写 PRD
> 撰写 PRD：在 how 之前对齐 what 与 why。
## 操作语义
- 类型: product
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `feature` (string, **必填**)
- `template` (string, 可选) 取值: amazon-press-release/lean/classic
## 输出
- `prd` (string, 可选)
- `openQuestions` (array, 可选)
- `successMetrics` (array, 可选)
## 核心要点

PRD 不是给工程的"任务书"，是给所有 stakeholder 的"对齐契约"；写不清楚 why，工程就只能猜。

## 关键要点

- Problem → User → Value → Solution 顺序
- 成功指标必须可量化
- open questions 显式列出
- 边界（out of scope）与 in scope 同等重要
- release criteria 早写

## 最佳实践

- Amazon working backwards / press release 模板
- 与 design / eng 并行写 spike
- review 时按 stakeholder 视角分轮
- PRD 版本化（Git or Notion 历史）

## 反模式

- ❌ 先写 Solution 后补 Problem
- ❌ 没有 metric 的 PRD
- ❌ "详细需求"列 200 条把工程压垮
- ❌ 上线后 PRD 不更新成历史文档

## 分级掌握

- **Junior**: 能用模板写一份功能 PRD
- **Mid**: 能驱动 stakeholder review 并量化指标
- **Senior**: 能落地 PRD 体系并驱动 product discovery 文化

## 参考资源

- [Amazon Working Backwards](https://www.amazon.com/Working-Backwards-Insights-Stories-Secrets/dp/1250267595) — book
- [Lenny PRD template](https://www.lennysnewsletter.com/p/the-ultimate-guide-to-writing-prds) — article
- [Marty Cagan: Inspired](https://svpg.com/inspired-how-to-create-products-customers-love/) — book

## 相关 Skills
_见所属 composite skill 或 role_