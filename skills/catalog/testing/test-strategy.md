---
id: test-strategy
type: atomic-skill
title: Test Strategy
nameZh: 测试策略
domain: testing
tags: testing, strategy, qa, pyramid, shift-left
catalogSource: internal
catalogFile: atomic-skills/test-strategy.json
catalogAddedAt: 2026-07-26
operation: testing
level: senior
---

# 测试策略
> 设计测试策略：金字塔 / 环境 / 数据 / shift-left & shift-right。
## 操作语义
- 类型: testing
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `system` (string, **必填**)
- `riskProfile` (string, 可选) 取值: low/medium/high
## 输出
- `strategyDoc` (string, 可选)
- `coverageGoals` (object, 可选)
- `testTypes` (array, 可选)
## 核心要点

测试策略的目标是"在不同阶段以最低成本拦截不同风险"；不是写更多测试，而是写对的测试在对的位置。

## 关键要点

- pyramid（unit > integration > e2e）
- shift-left（IDE / pre-commit）+ shift-right（canary / observability）
- 测试数据治理与生产隔离
- flaky test 零容忍
- risk-based 而非 coverage-driven

## 最佳实践

- contract testing 替代脆弱 e2e
- feature flag + canary 做 shift-right
- pre-commit 跑 unit + lint
- flaky test 自动 quarantine + alert

## 反模式

- ❌ e2e 占比过高引发雪崩
- ❌ 只追求 100% line coverage
- ❌ 测试数据用生产 dump
- ❌ flaky test 长期不修

## 分级掌握

- **Junior**: 能写各类型测试
- **Mid**: 能设计金字塔与 shift-left
- **Senior**: 能驱动组织级测试战略与质量文化

## 参考资源

- [Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) — article
- [Google Testing Blog](https://testing.googleblog.com/) — article
- [Continuous Delivery](https://continuousdelivery.com/) — book

## 相关 Skills
_见所属 composite skill 或 role_