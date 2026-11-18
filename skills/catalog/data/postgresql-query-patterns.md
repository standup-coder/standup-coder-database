---
type: external
source: qoder-community
sourceUrl: https://qoder-community.pages.dev/zh/skills/postgres
title: PostgreSQL 查询
nameZh: PostgreSQL 查询
category: 数据
tags: ["数据","sql","database","postgresql","query"]
rank: 7
id: postgresql-query-patterns
domain: data
domainLabel: 安全
catalogSource: qoder
catalogFile: PostgreSQL查询.md
catalogAddedAt: 2026-07-26
---

# PostgreSQL 查询

> 在 PostgreSQL 数据库上执行安全的只读 SQL 查询和数据分析

## 概述

在 PostgreSQL 数据库上执行安全的只读 SQL 查询和数据分析

### 示例

```
-- 请帮我分析用户活跃情况-- 查询过去 30 天的日活跃用户-- 按天统计，包含周同比增长
SELECT date_trunc('day', created_at) as date, COUNT(DISTINCT user_id) as dau, LAG(COUNT(DISTINCT user_id), 7) OVER (ORDER BY date_trunc('day', created_at)) as dau_7d_agoFROM eventsWHERE event_type = 'page_view' AND created_at >= NOW() - INTERVAL '30 days'GROUP BY 1ORDER BY 1;
```
= NOW() - INTERVAL '30 days'GROUP BY 1ORDER BY 1;">

## 使用场景

- 数据库查询和分析
- 报表数据提取
- 数据质量检查
- 性能诊断查询
- 数据探索

## 能力说明

- **安全查询**：只读操作，防止意外修改
- **复杂查询**：支持 JOINs、子查询、CTEs
- **数据分析**：聚合、窗口函数
- **结果格式化**：清晰的输出格式

## 风险与注意事项

- 仅支持只读操作
- 大表查询注意性能
- 使用 EXPLAIN 分析查询计划
- 敏感数据注意脱敏

## 参考链接

- 原文：https://qoder-community.pages.dev/zh/skills/postgres
