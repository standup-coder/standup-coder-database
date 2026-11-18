---
id: performance-optimization
type: atomic-skill
title: Performance Optimization
nameZh: 性能优化
domain: backend
tags: performance, profiling, optimization, latency, throughput
catalogSource: internal
catalogFile: atomic-skills/performance-optimization.json
catalogAddedAt: 2026-07-26
operation: engineering
level: senior
---

# 性能优化
> 通过性能剖析识别瓶颈，针对热点采用可量化收益的优化手段，避免主观猜测。
## 操作语义
- 类型: engineering
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `target` (any, **必填**) 取值: frontend/backend/database/mobile — 优化对象层级
- `metric` (any, **必填**) 取值: latency/throughput/memory/cpu/ttfb/lcp/fcp — 目标指标
- `baseline` (object, 可选) — 当前基线值（如 P99=800ms）
- `goal` (object, 可选) — 目标值（如 P99<300ms）
- `profileData` (string, 可选) — 火焰图/性能 trace 文件路径
## 输出
- `bottlenecks` (array, 可选)
- `recommendations` (array, 可选)
- `expectedGain` (string, 可选)
- `rolloutPlan` (string, 可选)
## 核心要点

性能优化必须 measure-first：没有数据的优化是赌博，错误的优化是技术债。

## 关键要点

- 先确立基线和 SLO，再做优化；优化收益必须可量化
- Amdahl 定律：优化非热点代码收益极低，先用 profiler 找 top 5 热点
- 前端三大指标 LCP / INP / CLS 决定 Core Web Vitals 评分
- 后端常见瓶颈层级：DB > 网络 > 序列化 > 业务逻辑 > GC
- 数据库优化的杠杆点：索引 > 查询改写 > schema 重构 > 分库分表
- 并发不等于并行；锁竞争和上下文切换是隐形成本
- 缓存是把双刃剑：解决性能但引入一致性问题

## 最佳实践

- 建立持续性能 CI（Lighthouse CI / k6 / JMeter）防止回退
- 使用 USE 方法（Utilization/Saturation/Errors）系统化排查资源瓶颈
- 数据库：开 slow query log + EXPLAIN ANALYZE，索引覆盖率 > 95%
- 前端：route-level code splitting + critical CSS + image lazy load
- 服务端：连接池 / 批处理 / 异步化，但保留可观测性
- 记录每次优化的 before/after 指标，沉淀团队 playbook

## 反模式

- ❌ 凭直觉优化（'我觉得这里慢'），实际瓶颈在别处
- ❌ 微优化早于架构优化（如循环展开却不改 N+1 查询）
- ❌ 缓存击穿不防护，雪崩时拖垮 DB
- ❌ 为了 P99 牺牲 P50 平均体验
- ❌ 性能改善后不加监控，几个月后悄无声息回退

## 分级掌握

- **Junior**: 能使用 profiler 定位明显热点，应用常见手段（索引、缓存、压缩）
- **Mid**: 能系统化做性能基线、压测、回归，并主导单系统优化项目
- **Senior**: 能制定全链路性能标准、容量规划，并指导跨团队的 SLO 治理

## 参考资源

- [Systems Performance (Brendan Gregg)](https://www.brendangregg.com/systems-performance-2nd-edition-book.html) — book
- [High Performance Browser Networking (Ilya Grigorik)](https://hpbn.co/) — book
- [web.dev Performance](https://web.dev/performance/) — doc
- [Use Method (Brendan Gregg)](https://www.brendangregg.com/usemethod.html) — article
- [PostgreSQL EXPLAIN 可视化](https://explain.dalibo.com/) — tool

## 相关 Skills
_见所属 composite skill 或 role_