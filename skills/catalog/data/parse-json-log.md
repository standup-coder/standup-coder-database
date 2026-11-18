---
id: parse-json-log
type: atomic-skill
title: Parse JSON Log
nameZh: 解析 JSON 日志
domain: data
tags: log, json, parser, ops
catalogSource: internal
catalogFile: atomic-skills/parse-json-log.json
catalogAddedAt: 2026-07-26
operation: data
level: junior
---

# 解析 JSON 日志
> 解析并过滤结构化 JSON 日志
## 操作语义
- 类型: data
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `content` (string, **必填**) — 日志内容（多行 JSON）
- `filter` (object, 可选) — 过滤条件，如 { level: 'ERROR' }
- **timeRange** (object):
  - `start` (string, 可选)
  - `end` (string, 可选)
- `limit` (number, 可选) — 返回最大条目数 默认: `100`
## 输出
- `entries` (array, **必填**) — 解析后的日志条目
- `matchedCount` (number, **必填**) — 匹配条数
- `totalCount` (number, **必填**) — 总条数
- `summary` (object, 可选) — 级别分布等统计
## 核心要点

JSON 日志解析是可观测性入口：schema 漂移、超大行、嵌套字段是三大坑。

## 关键要点

- 日志单行 JSON（NDJSON）是事实标准，禁用多行 pretty print
- 必须容忍 schema 漂移：未知字段忽略、缺失字段默认值
- 超长行（> 1MB）应截断或转 reference 存对象存储
- 时间字段用 ISO 8601 + 时区，禁用本地时间
- level / service / trace_id 是检索黄金三件套

## 最佳实践

- 解析失败的行进 dead-letter，不丢弃，便于回溯
- 用 streaming JSON parser 处理大批量日志
- 把嵌套对象 flatten 成 dot notation，方便索引
- 为关键字段建立 schema 版本，向后兼容
- 解析后注入 ingestion_time，识别延迟链路

## 反模式

- ❌ 用 JSON.parse 一行一行同步 parse 100k 行，CPU 拉满
- ❌ 解析失败直接 drop 日志，事故复盘无证据
- ❌ 把整个 message 字段 base64 后塞进搜索引擎
- ❌ 不区分 level，全部当 INFO 索引爆磁盘
- ❌ trace_id 缺失却号称"我们有可观测"

## 分级掌握

- **Junior**: 能 parse NDJSON、提取 level / message / timestamp
- **Mid**: 能处理 schema 漂移、dead-letter、流式 parse 大文件
- **Senior**: 能制定全公司日志规范：schema 版本 / 关键字段 / 与 trace 关联

## 参考资源

- [NDJSON spec](http://ndjson.org/) — doc
- [OpenTelemetry Logs Data Model](https://opentelemetry.io/docs/specs/otel/logs/data-model/) — doc
- [Elastic Common Schema (ECS)](https://www.elastic.co/guide/en/ecs/current/index.html) — doc

## 相关 Skills
_见所属 composite skill 或 role_