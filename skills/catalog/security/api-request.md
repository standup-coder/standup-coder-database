---
id: api-request
type: atomic-skill
title: API Request
nameZh: API请求
domain: security
tags: http, api, network
catalogSource: internal
catalogFile: atomic-skills/api-request.json
catalogAddedAt: 2026-07-26
operation: network
level: junior
---

# API请求
> 发送结构化 HTTP API 请求，支持认证、重试逻辑和响应校验
## 操作语义
- 类型: network
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `url` (string, **必填**) — Target API endpoint URL (must be absolute)
- `method` (string, **必填**) 取值: GET/POST/PUT/PATCH/DELETE/HEAD/OPTIONS — HTTP method to use 默认: `"GET"`
- `headers` (object, 可选) — Request headers (Content-Type, Authorization, etc.)
- `body` (object, 可选) — Request payload (auto-serialized based on Content-Type)
- `queryParams` (object, 可选) — URL query parameters to append
- **auth** (object):
  - `type` (string, 可选) 取值: bearer/basic/apiKey/oauth2
  - `token` (string, 可选)
  - `username` (string, 可选)
  - `password` (string, 可选)
- `timeout` (number, 可选) — Request timeout in milliseconds 默认: `30000`
- `retries` (number, 可选) — Number of retry attempts on transient failure 默认: `2`
- `validateStatus` (array, 可选) — Accepted HTTP status codes 默认: `[200,201,202,204]`
## 输出
- `status` (number, **必填**) — HTTP response status code
- `statusText` (string, 可选) — HTTP response status text
- `headers` (object, 可选) — Response headers
- `body` (object, **必填**) — Parsed response body (JSON object or string)
- `duration` (number, **必填**) — Request duration in milliseconds
- `retryCount` (number, 可选) — Number of retries performed
## 核心要点

API 请求的难点不在发出去，而在认证过期、幂等性、速率限制和响应不确定性——agent 必须像人类工程师一样处理边界情况。

## 关键要点

- 必须区分可重试错误（网络超时/429）和不可重试错误（401/400），盲目重试会放大故障
- 认证 token 有生命周期，agent 需处理 401 后自动刷新 token 再重试一次
- POST/PUT 等非幂等请求重试前必须确认服务端幂等性，否则可能产生重复数据
- 响应体可能是 JSON/XML/HTML/纯文本，必须根据 Content-Type 选择解析策略
- 内网地址（169.254.169.254 等）必须拦截，防止 SSRF 攻击

## 最佳实践

- 使用指数退避（exponential backoff）重试，避免雪崩
- 设置合理超时（连接 5s + 读取 30s），防止 agent 长时间挂起
- 请求前校验 URL scheme 和 host，拒绝 file:// 和元数据端点
- 记录请求的 method/url/status/duration 用于审计追踪
- 对大响应体设置 maxResponseSize，超限则截断并标记

## 反模式

- ❌ 对所有错误码统一重试导致 400 Bad Request 被反复发送
- ❌ 把 API Key 硬编码在请求参数中而非从环境变量/密钥管理读取
- ❌ 不设置超时让 agent 在慢接口上无限等待
- ❌ 忽略 429 响应的 Retry-After 头直接立即重试
- ❌ 将完整响应体（可能含敏感数据）直接写入日志或传给 LLM

## 分级掌握

- **Junior**: 能正确构造 GET/POST 请求、解析 JSON 响应、处理基本错误码
- **Mid**: 能实现认证刷新、指数退避重试、SSRF 防护、响应体大小限制
- **Senior**: 能为 agent 设计完整的 API 调用策略：幂等性判断、熔断器模式、多区域 failover、与 LLM 工具调用协议集成

## 参考资源

- [MDN HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview) — doc
- [AWS SDK Retry and Exponential Backoff](https://docs.aws.amazon.com/general/latest/gr/api-retries.html) — doc

## 相关 Skills
_见所属 composite skill 或 role_