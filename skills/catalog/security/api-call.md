---
id: api-call
type: atomic-skill
title: api-call
nameZh: API调用
domain: security
tags: api, http, atomic
catalogSource: internal
catalogFile: atomic-skills/api-call.json
catalogAddedAt: 2026-07-26
operation: network
level: junior
---

# API调用
> 发起HTTP API请求并返回响应
## 操作语义
- 类型: network
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `url` (string, **必填**) — API endpoint URL
- `method` (string, **必填**) 取值: GET/POST/PUT/DELETE/PATCH
- `headers` (object, 可选) — HTTP headers
- `body` (object, 可选) — Request body
## 输出
- `status` (number, 可选)
- `data` (any, 可选)
- `headers` (object, 可选)
## 核心要点

API 调用是 agent 与外部系统对接的主要通道，重试、限流、超时、签名是基本功。

## 关键要点

- 必须设连接超时与读取超时，且 < 上游 SLA
- 幂等性：GET/PUT/DELETE 天然幂等，POST 需 Idempotency-Key
- 重试策略用指数退避 + jitter，并区分可重试错误（5xx / 429 / 网络）与不可重试（4xx 业务）
- 认证凭据从 Secret Manager 拉取，禁止硬编码
- 响应必须设最大 size，避免攻击者用大响应体打爆
- 所有出站请求要走统一 HTTP Client（共享重试、metrics、tracing）

## 最佳实践

- 使用熔断器（circuit breaker）保护下游，连续失败自动切断
- 为每个出站调用注入 trace_id / x-request-id
- 记录 latency / status / size 三件套指标到 Prometheus
- 实现 rate-limit 客户端：尊重 Retry-After 与 X-RateLimit-* 响应头
- 对外部 API 写 contract test，依赖更新前先跑

## 反模式

- ❌ 不设超时导致 agent 整体卡死
- ❌ 4xx 也无脑重试，浪费配额
- ❌ 把响应全量塞 LLM context
- ❌ API key 写在代码或日志里
- ❌ 对幂等性无概念，重复扣费 / 双发邮件

## 分级掌握

- **Junior**: 能正确发起 GET/POST 请求、处理 status / 超时 / 基础认证
- **Mid**: 能实现重试 / 熔断 / 限流客户端、写 contract test
- **Senior**: 能设计跨服务出站调用治理：统一 client / 全局 SLO / 熔断策略 / 凭据轮换

## 参考资源

- [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/) — doc
- [AWS Architecture: Exponential Backoff and Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/) — article
- [Stripe Idempotent Requests](https://stripe.com/docs/api/idempotent_requests) — doc

## 相关 Skills
_见所属 composite skill 或 role_