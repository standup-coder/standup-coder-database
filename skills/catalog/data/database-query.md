---
id: database-query
type: atomic-skill
title: database-query
nameZh: 数据库查询
domain: data
tags: database, query, atomic
catalogSource: internal
catalogFile: atomic-skills/database-query.json
catalogAddedAt: 2026-07-26
operation: database
level: junior
---

# 数据库查询
> 执行数据库查询并返回结果
## 操作语义
- 类型: database
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `query` (string, **必填**) — SQL query to execute
- `connection` (string, 可选) — Connection string or identifier
## 输出
- `rows` (array, 可选)
- `affected` (number, 可选)
## 核心要点

数据库查询是 agent 接触真实业务的关键路径，注入、慢查询、锁三把刀必须先收好。

## 关键要点

- 永远使用参数化查询，禁止字符串拼接
- 只读连接与读写连接分离，agent 默认走只读
- 所有查询必须有超时与最大行数限制
- EXPLAIN 是改 SQL 前的必修课
- 事务保持短小，避免 long-running transaction 锁表

## 最佳实践

- 为 agent 配置 row-level / column-level 权限，限制可见数据
- 关键查询加 statement_timeout（PG）/ MAX_EXECUTION_TIME（MySQL）
- N+1 查询用 JOIN / IN / DataLoader 批量化
- 使用 read replica 跑分析型查询，避免影响 OLTP
- 把慢查询日志接入 Prometheus 与告警

## 反模式

- ❌ `SELECT * FROM users WHERE id=` + userInput — 注入经典
- ❌ SELECT * 拉百万行进 agent context
- ❌ 在循环里跑单条 SQL（N+1）
- ❌ 事务里 sleep 或调外部 API，长时间持锁
- ❌ 生产库直连 agent 无审计无配额

## 分级掌握

- **Junior**: 能写参数化查询，看懂 EXPLAIN 主要算子
- **Mid**: 能优化索引、消除 N+1、配置超时与行数限制
- **Senior**: 能为 agent 平台设计数据库访问治理：行列权限 / 审计 / 慢查询闭环 / 读写分离

## 参考资源

- [Use The Index, Luke](https://use-the-index-luke.com/) — doc
- [PostgreSQL EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) — doc
- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection) — article

## 相关 Skills
_见所属 composite skill 或 role_