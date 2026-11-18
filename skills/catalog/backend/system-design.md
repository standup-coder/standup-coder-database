---
id: system-design
type: atomic-skill
title: System Design
nameZh: 系统设计
domain: backend
tags: system-design, scalability, capacity-planning, distributed-systems
catalogSource: internal
catalogFile: atomic-skills/system-design.json
catalogAddedAt: 2026-07-26
operation: architecture
level: senior
---

# 系统设计
> 把产品需求转化为端到端的系统设计，覆盖容量估算、数据建模、失败模式与演进路径。
## 操作语义
- 类型: architecture
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `scenario` (string, **必填**) — 业务场景（如：设计 IM、订单系统）
- **scale** (object):
  - `dau` (number, 可选)
  - `qps` (number, 可选)
  - `dataSize` (string, 可选)
- `slo` (object, 可选) — 可用性 / 延迟 / 一致性 SLO
## 输出
- `highLevelDiagram` (string, 可选)
- `componentBreakdown` (array, 可选)
- `dataModel` (string, 可选)
- `capacityEstimation` (object, 可选)
- `failureModes` (array, 可选)
- `evolutionPath` (string, 可选)
## 核心要点

系统设计是从模糊需求到可执行蓝图的能力，关键是估算、抽象与失败思维。

## 关键要点

- 需求澄清：功能 + 非功能 + 规模（永远先反问，再设计）
- 容量估算：QPS、存储、带宽、连接数 — Back-of-the-envelope 是基本功
- 数据模型先于服务设计：错的数据模型无法用代码修复
- 一致性模型选择：strong / read-your-writes / eventual，对应不同业务可接受度
- 失败思维：每个组件假设会挂，问'谁是 SPOF'与'数据如何恢复'
- 演进路径：MVP → 垂直拆分 → 水平扩展 → 多活，分阶段不要一步到位
- 经典模式：缓存、消息队列、读写分离、CQRS、事件驱动、Saga

## 最佳实践

- 用 4 步法答系统设计：澄清 → 估算 → 高层设计 → 深度细化
- 画图先画数据流而非组件框，箭头方向 = 调用 / 数据流向
- 在白板/文档中显式列出权衡（latency vs consistency vs cost）
- 为每个外部依赖设计降级 / 熔断 / 重试 / 隔离
- 把容量数字写进文档：'订单 5000 QPS、单条 2KB → 10 MB/s 写入'

## 反模式

- ❌ 上来就画微服务架构图，未做需求澄清和估算
- ❌ 把 NoSQL 当万能药，不分析读写模式
- ❌ 忽略冷启动 / 缓存击穿 / 重试风暴的失败链
- ❌ '最终一致性'当万灵丹，业务要求强一致也用 eventual
- ❌ 把所有同步调用改异步，监控和补偿没跟上

## 分级掌握

- **Junior**: 能复述常见模式并在引导下完成单业务场景设计
- **Mid**: 能独立主导中等规模系统设计评审，做出量化估算与权衡
- **Senior**: 能驾驭多团队、多区域、千万级 DAU 的系统设计，建立公司级模式库

## 参考资源

- [System Design Interview Vol 1 & 2 (Alex Xu)](https://www.systeminterview.com/) — book
- [Designing Data-Intensive Applications](https://dataintensive.net/) — book
- [ByteByteGo Newsletter](https://bytebytego.com/) — article
- [High Scalability Blog](http://highscalability.com/) — article
- [Google SRE Book](https://sre.google/sre-book/table-of-contents/) — book

## 相关 Skills
_见所属 composite skill 或 role_