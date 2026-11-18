---
id: cache-strategy
type: atomic-skill
title: Cache Strategy
nameZh: 缓存策略
domain: backend
tags: backend, redis, caching, cache-aside, consistency
catalogSource: internal
catalogFile: atomic-skills/cache-strategy.json
catalogAddedAt: 2026-07-29
operation: backend
level: mid
---

# 缓存策略
> 为读多写少的热点数据设计缓存层（以 Redis 为主）：选对读写模式、防住穿透/击穿/雪崩三大事故、想清一致性代价。
## 操作语义
- 类型: backend
## 何时使用
- 数据库读 QPS 逼近瓶颈且流量呈明显热点分布（二八定律成立）
- 同一份计算结果被高频重复请求（商品详情、配置、排行榜）
- 外部 API 有调用配额或高延迟，需要本地兜底
## 何时不使用
- 写多读少或每次读的数据都不同——命中率撑不起缓存的复杂度
- 业务要求强一致读（余额、库存扣减的判定读）——缓存的本质是接受陈旧数据
## 输入参数
- `dataProfile` (string, **必填**) — 数据的读写比、热点分布、容忍陈旧时长
- `consistencyNeed` (string, 可选) — 最终一致可接受的时间窗口
## 输出
- `pattern` (string) — 读写模式选择（cache-aside/read-through/write-behind）
- `keyDesign` (object) — key 命名、TTL、淘汰策略
- `protection` (string) — 穿透/击穿/雪崩的防护方案
## 核心要点

缓存的第一性问题不是"怎么加"而是"接受多旧的数据、错了怎么办"。Cache-aside（读时旁路加载 + 写时删缓存）是 90% 场景的默认答案，其余模式都要有明确理由。

## 关键要点

- 三大事故与解法：**穿透**（查不存在的 key 直达 DB）→ 空值缓存或布隆过滤器；**击穿**（热 key 过期瞬间并发重建）→ 互斥锁重建或逻辑过期；**雪崩**（大批 key 同时过期）→ TTL 加随机抖动
- "先更新 DB 再删缓存"（Cache-Aside 写路径）优于"先删缓存再更新 DB"：后者在并发下更容易把旧值写回缓存
- 删缓存而非改缓存：更新缓存值在并发写下会产生写序错乱，删掉让下次读重建更安全
- TTL 是最后的兜底一致性：即使删缓存失败，数据最迟在 TTL 后回正——所以永不过期的业务缓存是危险设计
- Redis 单线程模型：单个 O(N) 大命令（KEYS、大集合 SMEMBERS）会阻塞所有请求；大 key（>10KB 高频访问）是隐形炸弹
- 本地缓存（Caffeine）+ 分布式缓存两级结构可再降一个数量级延迟，但引入节点间不一致，需要失效广播
## 最佳实践

- key 规范：`业务:实体:id` 分层命名 + 统一 TTL 策略文档化，禁止无 TTL 的 key
- 缓存重建加互斥（singleflight/分布式锁），同一 key 只放一个请求穿透到 DB
- 监控三指标：命中率（<80% 要审视）、大 key、慢命令日志
- 缓存失败要降级不要报错：Redis 挂了应退化为直查 DB + 限流，而非全站 5xx

## 反模式

- ❌ 把缓存当唯一存储：Redis 里的数据没有落库，重启即业务事故
- ❌ 事务里同步双写"DB + 缓存"并假设两者都成功
- ❌ 用 KEYS/SCAN 全量遍历做业务逻辑
- ❌ 缓存对象越塞越大（整个聚合根序列化进一个 key），每次读浪费 95% 字段

## 分级掌握

- **Junior**: 能正确实现 cache-aside 读写路径并解释为什么删缓存而非改缓存
- **Mid**: 能防护穿透/击穿/雪崩，会排查命中率下降与大 key 问题
- **Senior**: 能设计多级缓存与失效广播体系，量化一致性窗口并向业务方讲清代价

## 参考资源

- [Redis 官方 — Caching 模式文档](https://redis.io/docs/latest/develop/use/patterns/) — doc
- [AWS — Caching Best Practices](https://aws.amazon.com/caching/best-practices/) — doc
- [Facebook — Scaling Memcache at Facebook (NSDI'13)](https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf) — paper
- 《Designing Data-Intensive Applications》Ch.5 Replication（陈旧读语义） — book

## 相关 Skills

- [performance-optimization](./performance-optimization.md) — 先定位瓶颈再决定是否上缓存
- [database-query](../data/database-query.md)
- [circuit-breaker](./circuit-breaker.md) — 缓存故障时的降级
