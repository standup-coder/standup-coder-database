---
id: http-health-check
type: atomic-skill
title: HTTP Health Check
nameZh: HTTP 健康探测
domain: security
tags: http, health, monitoring, ops
catalogSource: internal
catalogFile: atomic-skills/http-health-check.json
catalogAddedAt: 2026-07-26
operation: network
level: junior
---

# HTTP 健康探测
> 发送 HTTP 请求验证端点健康状态
## 操作语义
- 类型: network
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `url` (string, **必填**) — 探测目标 URL
- `method` (string, 可选) 取值: GET/HEAD/POST 默认: `"GET"`
- `headers` (object, 可选) — 请求头
- `expectedStatus` (array, 可选) — 期望的 HTTP 状态码 默认: `[200,204]`
- `timeout` (number, 可选) — 超时时间（毫秒） 默认: `5000`
## 输出
- `healthy` (boolean, **必填**) — 是否健康
- `statusCode` (number, **必填**) — 实际状态码
- `responseTime` (number, **必填**) — 响应时间（毫秒）
- `body` (string, 可选) — 响应体（截断）
## 核心要点

健康检查是服务的脉搏：liveness / readiness / startup 三类语义不能混淆。

## 关键要点

- liveness：进程是否活着（失败重启）
- readiness：是否准备好接流量（失败摘流）
- startup：是否完成启动（避免启动期 liveness 误杀）
- 健康端点本身必须超快、无外部依赖
- 健康检查不应消耗业务配额或写日志

## 最佳实践

- 健康端点路径标准化：/healthz / /readyz / /startupz
- readiness 应聚合关键依赖（DB / cache / 上游）状态
- 响应体保持极简（200 / 503 + JSON），便于 LB 解析
- 为 K8s 配置合理 periodSeconds + failureThreshold
- 加入 timeout，避免被慢检查拖死

## 反模式

- ❌ liveness 检查跑业务查询，导致雪崩自杀
- ❌ readiness 不检查依赖，启动后立即收流但 500 全部
- ❌ 健康端点开认证，自检失败
- ❌ 把健康检查日志当业务日志输出，刷爆磁盘
- ❌ failureThreshold = 1，网络抖动直接重启

## 分级掌握

- **Junior**: 能实现 /healthz 返回 200，理解 liveness vs readiness
- **Mid**: 能设计聚合依赖的 readiness、配置合理 K8s probe 参数
- **Senior**: 能为大型系统设计健康检查体系：分级语义 / 雪崩保护 / 与 SLO 关联

## 参考资源

- [Kubernetes Liveness/Readiness Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) — doc
- [Microsoft: Health Endpoint Monitoring Pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/health-endpoint-monitoring) — article

## 相关 Skills
_见所属 composite skill 或 role_