---
id: sql-optimization
type: atomic-skill
title: SQL Optimization
nameZh: SQL 优化
domain: data
tags: database, sql, optimization, index, performance
catalogSource: internal
catalogFile: atomic-skills/sql-optimization.json
catalogAddedAt: 2026-07-26
operation: database
level: mid
---

# SQL 优化
> 通过执行计划 / 索引 / 改写 / schema 优化分析与加速慢 SQL。
## 操作语义
- 类型: database
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `sql` (string, **必填**)
- `engine` (string, 可选) 取值: postgres/mysql/sqlserver/oracle/clickhouse
- `plan` (string, 可选)
## 输出
- `recommendations` (array, 可选)
- `rewrittenSql` (string, 可选)
- `expectedSpeedup` (number, 可选)
## 核心要点

SQL 优化先看 plan 再看 schema 再看 index；不看 plan 就改 SQL 等于盲调。

## 关键要点

- EXPLAIN ANALYZE > EXPLAIN
- covering index 大幅减少 IO
- sargable 表达式可走索引
- N+1 是 ORM 头号杀手
- partition / 分库分表是最后手段

## 最佳实践

- 慢 SQL 监控 + 自动捕获
- index 加之前先 hypopg 模拟
- 改写复杂 SQL 用 CTE 提升可读
- 每次 schema 变更跑 EXPLAIN diff

## 反模式

- ❌ "加 index 解千愁"加爆 IO
- ❌ SELECT * 在大宽表
- ❌ ORM 把 N+1 隐藏
- ❌ 函数包裹列导致索引失效

## 分级掌握

- **Junior**: 能读 EXPLAIN 加索引
- **Mid**: 能改写 SQL + schema tuning
- **Senior**: 能驱动数据库性能体系与 query governance

## 参考资源

- [Use The Index, Luke!](https://use-the-index-luke.com/) — doc
- [PostgreSQL EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) — doc
- [High Performance MySQL](https://www.oreilly.com/library/view/high-performance-mysql/9781492080503/) — book

## 相关 Skills
_见所属 composite skill 或 role_