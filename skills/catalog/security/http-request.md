---
id: http-request
type: atomic-skill
title: HTTP Request
nameZh: HTTP请求
domain: security
tags: http, request, network
catalogSource: internal
catalogFile: atomic-skills/http-request.json
catalogAddedAt: 2026-07-26
operation: network
level: junior
---

# HTTP请求
> 执行底层 HTTP 请求，完全控制方法、头部、请求体和响应处理
## 操作语义
- 类型: network
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `url` (string, **必填**) — Target URL (must include scheme, e.g., https://api.example.com/data)
- `method` (string, 可选) 取值: GET/POST/PUT/PATCH/DELETE/HEAD/OPTIONS — HTTP method 默认: `"GET"`
- `headers` (object, 可选) — Request headers as key-value pairs
- `body` (object, 可选) — Request body (auto-serialized to JSON unless Content-Type specifies otherwise)
- `timeout` (number, 可选) — Request timeout in milliseconds 默认: `30000`
- `followRedirects` (boolean, 可选) — Whether to follow HTTP redirects automatically 默认: `true`
- `maxRedirects` (number, 可选) — Maximum number of redirects to follow 默认: `5`
- `responseType` (string, 可选) 取值: json/text/arraybuffer/stream — Expected response body format 默认: `"json"`
- `proxy` (string, 可选) — Proxy URL to route the request through
## 输出
- `status` (number, **必填**) — HTTP response status code
- `statusText` (string, 可选) — HTTP status text (e.g., 'OK', 'Not Found')
- `headers` (object, 可选) — Response headers
- `body` (object, **必填**) — Parsed response body
- `duration` (number, **必填**) — Total request duration in milliseconds
- `redirects` (array, 可选) — List of redirect URLs followed
- `size` (number, 可选) — Response body size in bytes
## 核心要点

HTTP 请求的底层难点在于 DNS 缓存、TLS 证书链验证、重定向安全、连接复用和响应体流式处理——这些决定了 agent 网络调用的可靠性。

## 关键要点

- 与 api-request 的区别：http-request 是底层原语，不含业务级认证/重试/校验逻辑
- 重定向可能跨域泄露 Authorization 头，必须在跨域 redirect 时自动剥离敏感头
- TLS 证书验证不能跳过（rejectUnauthorized: false），否则 agent 易受中间人攻击
- 大响应体（文件下载）必须用 stream 模式，不能缓冲到内存
- HTTP/2 多路复用和连接池影响并发请求性能，agent 批量调用时需考虑

## 最佳实践

- 默认 HTTPS，仅在明确指定时允许 HTTP（开发环境）
- 设置合理的 connect timeout（5s）和 read timeout（30s）分离
- 跨域重定向时自动移除 Authorization/Cookie 头防止凭据泄露
- 对 stream 响应提供背压（backpressure）控制，防止内存溢出
- 记录请求的 url/method/status/duration 用于调试和审计

## 反模式

- ❌ 设置 rejectUnauthorized: false 跳过证书验证（安全漏洞）
- ❌ 不限制重定向次数导致无限循环
- ❌ 将 50MB 响应体一次性读入内存导致 OOM
- ❌ 在 URL 中拼接敏感参数（?token=xxx）而非使用 Authorization 头
- ❌ 忽略 HTTP 响应的 Content-Encoding（gzip/br）导致解析失败

## 分级掌握

- **Junior**: 能发送基本 GET/POST 请求、解析 JSON 响应、处理常见状态码
- **Mid**: 能处理重定向安全、TLS 验证、流式响应、连接超时分离
- **Senior**: 能为 agent 设计网络层：连接池管理、SSRF 防护、HTTP/2 复用、熔断器与背压控制

## 参考资源

- [Node.js HTTP/HTTPS Module](https://nodejs.org/api/http.html) — doc
- [OWASP SSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html) — article

## 相关 Skills
_见所属 composite skill 或 role_