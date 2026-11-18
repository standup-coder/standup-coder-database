---
id: performance-testing
type: atomic-skill
title: Performance Testing
nameZh: 性能测试
domain: testing
tags: testing, performance, load, stress, k6
catalogSource: internal
catalogFile: atomic-skills/performance-testing.json
catalogAddedAt: 2026-07-26
operation: testing
level: mid
---

# 性能测试
> 设计并执行性能测试：负载 / 压力 / 突发 / 长时，配合真实 workload 建模。
## 操作语义
- 类型: testing
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `target` (string, **必填**)
- `pattern` (string, 可选) 取值: load/stress/spike/soak
- `tool` (string, 可选) 取值: k6/jmeter/gatling/locust/wrk
## 输出
- `metrics` (object, 可选)
- `bottleneck` (string, 可选)
- `recommendation` (array, 可选)
## 核心要点

性能测试最大谎言是"压不出问题"——往往不是系统强，而是 workload 不真实；rps 数字之外的 think time / 分布更关键。

## 关键要点

- load / stress / spike / soak 各有目的
- percentile（p95/p99）> 平均值
- 基于真实流量生成 workload 模型
- 区分 closed model（吞吐）vs open model（到达）
- soak 暴露内存泄漏

## 最佳实践

- k6 / Gatling 写代码化场景
- 与 APM 联动找瓶颈
- 压测前先做基线
- 失败注入 + 性能并行做

## 反模式

- ❌ 只发 GET 不发 POST
- ❌ rps 拉满没 think time
- ❌ 只看平均不看 p99
- ❌ 一次跑完不复测变化

## 分级掌握

- **Junior**: 能跑基础 k6 / wrk
- **Mid**: 能建 workload 模型 + 找瓶颈
- **Senior**: 能驱动组织级容量规划与性能基线

## 参考资源

- [k6.io](https://k6.io/docs/) — doc
- [Brendan Gregg: Performance](https://www.brendangregg.com/methodology.html) — article
- [Performance Testing Guidance](https://learn.microsoft.com/en-us/previous-versions/msp-n-p/bb924375(v=pandp.10)) — doc

## 相关 Skills
_见所属 composite skill 或 role_