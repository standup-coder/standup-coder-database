---
id: db-transaction
type: atomic-skill
title: Database Transaction & Isolation
nameZh: 数据库事务与隔离级别
domain: backend
tags: backend, transaction, isolation-level, mvcc, locking, acid
catalogSource: internal
catalogFile: atomic-skills/db-transaction.json
catalogAddedAt: 2026-07-29
operation: backend
level: mid
---

# 数据库事务与隔离级别
> 理解 ACID、四种隔离级别的异常现象与 MVCC 实现，为并发写场景选择正确的隔离级别与锁策略。
## 操作语义
- 类型: backend
## 何时使用
- 并发写同一行数据出现丢失更新、余额算错等"偶发"数据错误
- 设计扣减类业务（库存/余额/配额）需要选隔离级别与锁方案
- 排查死锁、长事务导致的锁等待与连接池耗尽
## 何时不使用
- 跨服务的数据一致性——单机事务管不到，去看 saga/outbox（[event-driven-architecture](./event-driven-architecture.md)）
- 纯读分析查询的性能问题——那是索引与执行计划的领域
## 输入参数
- `concurrencyScenario` (string, **必填**) — 并发读写模式描述
- `database` (string, 可选) — PostgreSQL / MySQL(InnoDB) 等
## 输出
- `isolationChoice` (string) — 隔离级别选择与理由
- `lockStrategy` (string) — 乐观/悲观锁方案
- `anomalyAnalysis` (string) — 该方案仍可能出现的异常与兜底
## 核心要点

隔离级别是"性能换正确性"的旋钮：Read Committed（PG 默认）下丢失更新完全可能发生，大多数并发 bug 不是数据库的错，而是开发者以为自己拿到了比实际更强的隔离保证。

## 关键要点

- 四级别与异常对照：Read Uncommitted（脏读）→ Read Committed（不可重复读）→ Repeatable Read（幻读*）→ Serializable（无异常）；*PG 的 RR 基于快照实际已挡住幻读，MySQL InnoDB 靠间隙锁近似做到
- 丢失更新的经典形态：`读值 → 内存计算 → 写回`，两个事务交错执行后只剩一个的效果；解法按代价排序：原子 UPDATE（`SET x = x - 1`）> 乐观锁版本号 > `SELECT FOR UPDATE` > 提升隔离级别
- MVCC 的本质：写不阻塞读、读不阻塞写——每个事务看自己的快照；代价是 PG 的表膨胀（dead tuple 需 VACUUM）与 MySQL 的 undo log 增长
- 长事务是隐形杀手：阻碍 VACUUM/undo 清理、持锁时间长、放大死锁概率；事务里禁止调外部 API 或等用户输入
- 死锁不可完全避免，只能降低概率（按固定顺序访问资源）+ 快速检测重试（数据库会自动选一个牺牲者回滚）
- Serializable 不是免费午餐：PG 的 SSI 在冲突时抛序列化错误，应用必须实现重试循环才算真正用对
## 最佳实践

- 默认 Read Committed + 显式锁/原子更新处理关键写路径，只在证明必要时提升隔离级别
- 乐观锁用于低冲突（后台编辑），悲观锁用于高冲突热点行（秒杀库存）
- 事务保持短小：只包住"必须原子"的语句，预查询与后处理放事务外
- 给应用层写统一的"序列化失败/死锁重试"包装（指数退避，最多 3 次）

## 反模式

- ❌ `SELECT` 读出余额，在应用代码里加减后 `UPDATE` 写回（教科书级丢失更新）
- ❌ 事务中调用第三方 HTTP 接口，把秒级延迟变成秒级持锁
- ❌ 全局把隔离级别拉到 Serializable "求安心"，吞吐掉一个量级还不写重试
- ❌ 用应用层分布式锁替代数据库事务做单库原子性

## 分级掌握

- **Junior**: 能说清四种隔离级别对应的异常现象，会写原子 UPDATE
- **Mid**: 能为具体业务选隔离级别与锁策略，会排查死锁日志与长事务
- **Senior**: 理解 MVCC 实现差异（PG vs InnoDB），能设计高并发扣减方案并量化吞吐/正确性权衡

## 参考资源

- [PostgreSQL 官方 — Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html) — doc
- [MySQL 官方 — InnoDB Transaction Isolation Levels](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html) — doc
- 《Designing Data-Intensive Applications》Ch.7 Transactions — book
- [Jepsen — Consistency Models 图谱](https://jepsen.io/consistency) — doc

## 相关 Skills

- [idempotency-design](./idempotency-design.md) — 重试安全的另一半
- [sql-optimization](../data/sql-optimization.md)
- [database-design](../data/database-design.md)
