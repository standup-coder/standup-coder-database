---
id: ab-testing
type: atomic-skill
title: A/B Testing
nameZh: A/B 实验
domain: marketing
tags: ab-test, experiment, growth, statistics, product
catalogSource: internal
catalogFile: atomic-skills/ab-testing.json
catalogAddedAt: 2026-07-26
operation: growth
level: mid
---

# A/B 实验
> 设计与分析 A/B 实验，覆盖样本量计算、随机化、显著性检验与护栏指标。
## 操作语义
- 类型: growth
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `hypothesis` (string, **必填**)
- `metric` (string, **必填**) — 主要指标（OEC）
- `mde` (number, 可选) — 最小可检测效应
- `alpha` (number, 可选) 默认: `0.05`
- `power` (number, 可选) 默认: `0.8`
## 输出
- `sampleSize` (number, 可选)
- `durationDays` (number, 可选)
- `result` (object, 可选)
- `decision` (any, 可选) 取值: ship/kill/iterate
## 核心要点

A/B 实验是因果推断工具，不是 dashboard：没有正确的样本量与护栏，结果即噪声。

## 关键要点

- 先算样本量再开实验
- 分流必须随机且可验证（SRM 检测）
- OEC 要兼顾业务价值与长期影响
- 护栏指标防止短期收益伤害长期
- 不显著 ≠ 没差异

## 最佳实践

- minimum detectable effect 与业务影响匹配
- 至少跑一个完整业务周期
- 提前注册分析方案，禁止 p-hacking
- 小流量长尾观察延迟效应

## 反模式

- ❌ 每天看 p 值，显著就停
- ❌ 同一用户被多个实验互相污染
- ❌ 只看主指标忽略护栏
- ❌ 把波动当显著

## 分级掌握

- **Junior**: 能跑标准 A/B 看显著性
- **Mid**: 能设计 OEC / 护栏 / SRM 检查
- **Senior**: 能设计实验平台与治理：互斥层、CUPED、长期效应

## 参考资源

- [Trustworthy Online Controlled Experiments (Kohavi)](https://www.cambridge.org/core/books/trustworthy-online-controlled-experiments/) — book
- [Statsig docs: Sample Ratio Mismatch](https://docs.statsig.com/experiments-plus/sample-ratio-mismatch) — doc

## 相关 Skills
_见所属 composite skill 或 role_