---
id: api-development
type: atomic-skill
title: API Development
nameZh: API 开发
domain: backend
tags: api, rest, graphql, backend, contract
catalogSource: internal
catalogFile: atomic-skills/api-development.json
catalogAddedAt: 2026-07-26
operation: backend
level: mid
---

# API 开发
> 设计并实现可上线的 HTTP / GraphQL API，覆盖契约、错误码、版本、鉴权、限流与文档。
## 操作语义
- 类型: backend
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `apiSpec` (string, **必填**) — OpenAPI / GraphQL Schema 内容
- `style` (any, 可选) 取值: rest/graphql/grpc 默认: `"rest"`
- `auth` (any, 可选) 取值: none/apiKey/jwt/oauth2 默认: `"jwt"`
- `language` (string, 可选) — 实现语言（如 node、go、python）
## 输出
- `code` (string, 可选) — 生成的服务端代码（路由 + handler + DTO）
- `docs` (string, 可选) — OpenAPI / API.md 文档
- `tests` (string, 可选) — 契约测试与示例
## 核心要点

API 是产品的契约，它的稳定性、可观测性和可演进性比性能更重要。

## 关键要点

- 契约先行：OpenAPI / GraphQL SDL 是开发与协作的唯一事实源
- 错误码体系：业务码 ≠ HTTP 码，需建立稳定的业务 error code
- 版本策略：URL versioning（/v1/）vs Header versioning，需选定并坚持
- 幂等性：写操作应支持 Idempotency-Key，避免网络重试导致脏数据
- 分页/排序/筛选用统一约定（cursor 优先于 offset）
- 可观测性：每个 API 必须输出 trace_id / latency / error_rate
- 安全：永远校验输入，永远不信任前端，敏感字段需脱敏

## 最佳实践

- 使用 OpenAPI 3.1+ 自动生成 client、server stub、文档，单源驱动
- 返回 RFC 7807 Problem Details 风格的错误体
- 限流要分级：全局 + 用户 + IP，并暴露 X-RateLimit-* 响应头
- 为破坏性变更准备 deprecation 周期（公告 + Sunset Header + 监控）
- 契约测试（Pact / Schemathesis）保护前后端联调

## 反模式

- ❌ 把所有错误都返回 200 + body.code，让 HTTP 语义失效
- ❌ GET 接口带副作用（计数、扣费）
- ❌ 频繁修改字段名而不走 deprecation 流程
- ❌ 鉴权粒度只到登录态，未做资源级权限
- ❌ 把数据库 schema 直接当 API 输出，导致内部模型泄漏

## 分级掌握

- **Junior**: 能按规范实现 CRUD 接口，处理常见错误码与基础鉴权
- **Mid**: 能主导 API 设计评审，建立错误码体系、版本策略与契约测试
- **Senior**: 能制定团队 API 标准、主导跨服务接口治理、设计 SDK 与 deprecation 流程

## 参考资源

- [API Design Patterns (JJ Geewax)](https://www.manning.com/books/api-design-patterns) — book
- [Google API Design Guide (AIP)](https://google.aip.dev/) — doc
- [OpenAPI Specification 3.1](https://spec.openapis.org/oas/v3.1.0) — doc
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/) — doc
- [Stripe API Reference (业内标杆)](https://stripe.com/docs/api) — article

## 相关 Skills
_见所属 composite skill 或 role_