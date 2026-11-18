---
id: competitive-analysis
type: atomic-skill
title: Competitive Analysis
nameZh: 竞品分析
domain: product
tags: product, strategy, competitive, research, positioning
catalogSource: internal
catalogFile: atomic-skills/competitive-analysis.json
catalogAddedAt: 2026-07-26
operation: product
level: mid
---

# 竞品分析
> 系统分析竞品的产品 / 定位 / 定价 / 路线，支撑产品战略与决策。
## 操作语义
- 类型: product
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `scope` (string, **必填**) — 分析范围（feature / pricing / GTM / full）
- `competitors` (array, 可选)
- `market` (string, 可选)
## 输出
- `matrix` (object, 可选)
- `swot` (object, 可选)
- `recommendations` (array, 可选)
## 核心要点

竞品分析不是抄功能，而是看清自己在谁的"替代方案"上、能赢谁、不与谁正面打。

## 关键要点

- 先定决策场景（融资 / 立项 / 定价 / 营销）
- 区分 direct / indirect / aspirational 三类竞品
- feature parity 是平庸的开始，差异化才是赢点
- pricing 与 packaging 的差异往往最值钱
- JTBD 视角：竞品是其他可解此 job 的方式

## 最佳实践

- 用 SWOT / Porter 五力定方向
- 每季度更新竞品 dashboard
- 与销售前线 + 客户访谈交叉验证
- 产出"何时选我们 / 何时不选"对照表

## 反模式

- ❌ 列功能表对比打勾，沦为参数战
- ❌ 只看头部 1 家直接对手
- ❌ 靠官网截图，不做实际试用与客户访谈
- ❌ 竞品分析不进决策，沦为孤立报告

## 分级掌握

- **Junior**: 能输出竞品功能 / 定价对照表
- **Mid**: 能做 JTBD 视角分析、影响产品路线
- **Senior**: 能驱动定位与差异化战略，整合销售 / 客户 / 市场反馈

## 参考资源

- [Reforge: Competitive Strategy](https://www.reforge.com/blog/competitive-positioning) — article
- [April Dunford: Obviously Awesome (positioning)](https://www.aprildunford.com/obviously-awesome) — book
- [JTBD](https://jtbd.info/) — doc

## 相关 Skills
_见所属 composite skill 或 role_