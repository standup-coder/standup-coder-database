---
id: log-parser
type: atomic-skill
title: Log Parser
nameZh: 日志解析
domain: devops
tags: log, parse, observability
catalogSource: internal
catalogFile: atomic-skills/log-parser.json
catalogAddedAt: 2026-07-26
operation: logging
level: junior
---

# 日志解析
> 解析结构化和非结构化日志文件，提取模式并识别异常
## 操作语义
- 类型: logging
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `source` (string, **必填**) — Log file path or glob pattern (e.g., /var/log/app/*.log)
- `format` (string, 可选) 取值: json/text/syslog/apache/nginx/custom — Log format to parse 默认: `"text"`
- `pattern` (string, 可选) — Custom regex pattern for 'custom' format extraction
- `level` (string, 可选) 取值: TRACE/DEBUG/INFO/WARN/ERROR/FATAL — Minimum log level to include in results
- **timeRange** (object):
  - `start` (string, 可选)
  - `end` (string, 可选)
- `grep` (string, 可选) — Filter lines matching this regex pattern
- `tail` (number, 可选) — Return only the last N lines (like tail -n) 默认: `1000`
- `groupBy` (string, 可选) 取值: level/source/time_bucket — Group parsed entries by field for aggregation
## 输出
- `entries` (array, **必填**) — Parsed log entries
- **summary** (object,必填):
  - `totalLines` (number, 可选)
  - `parsedLines` (number, 可选)
  - `unparsedLines` (number, 可选)
  - `levelCounts` (object, 可选)
  - `errorRate` (number, 可选)
  - `timeSpan` (object, 可选)
- `anomalies` (array, 可选) — Detected anomalies (error spikes, unusual patterns)
## 核心要点

日志解析的难点不在正则匹配，而在时间戳格式混乱、多行堆栈关联、编码不一致和海量数据下的采样策略。

## 关键要点

- 时间戳格式千差万别（ISO8601/Unix epoch/Apache CLF），必须自动检测或显式指定
- 多行日志（Java stacktrace、Python traceback）需要关联逻辑，不能逐行独立解析
- 生产日志可能混杂多种格式（应用日志 + 框架日志），需要多 pattern 回退
- 日志中可能包含 PII（邮箱/手机号/IP），解析后传给 LLM 前需脱敏
- 大文件（>100MB）必须流式处理，不能一次性加载到内存

## 最佳实践

- 优先尝试 JSON 格式解析，失败后回退到正则 pattern 匹配
- 对多行日志实现 continuation 检测（以空格/tab 开头或无时间戳前缀的行归属上一条）
- 提供 tail 模式避免全量读取，agent 通常只需要最近的错误
- 输出 summary 统计（error rate / level 分布）让 agent 快速判断是否需要深入
- 对无法解析的行保留原文并标记，而非静默丢弃

## 反模式

- ❌ 用单一正则硬编码所有日志格式，遇到新格式直接崩溃
- ❌ 把 10GB 日志全部解析后塞进 LLM context
- ❌ 忽略多行堆栈导致每条 trace 行被当作独立错误
- ❌ 不处理时区信息导致跨时区日志时间线错乱
- ❌ 将包含用户密码/token 的日志原文传给 LLM 分析

## 分级掌握

- **Junior**: 能解析标准 JSON 日志、按 level 过滤、提取时间戳和消息
- **Mid**: 能处理多行堆栈、多格式回退、时间范围过滤、生成统计摘要
- **Senior**: 能为 agent 设计日志分析策略：流式采样、异常检测、PII 脱敏、与告警系统集成

## 参考资源

- [Grok Patterns - Logstash](https://www.elastic.co/guide/en/logstash/current/plugins-filters-grok.html) — doc
- [The Twelve-Factor App - Logs](https://12factor.net/logs) — article

## 相关 Skills
_见所属 composite skill 或 role_