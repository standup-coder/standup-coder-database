---
id: grpc
type: atomic-skill
title: gRPC
nameZh: gRPC 服务开发
domain: backend
tags: backend, grpc, protobuf, rpc, streaming, microservices
catalogSource: internal
catalogFile: atomic-skills/grpc.json
catalogAddedAt: 2026-07-29
operation: backend
level: mid
---

# gRPC 服务开发
> 用 gRPC + Protobuf 构建强契约、高性能的服务间通信：选对场景、管好契约演进、用好 deadline 与流式模式。
## 操作语义
- 类型: backend
## 何时使用
- 内部微服务间高频调用，需要低延迟与强类型契约
- 需要流式语义：服务端推送、客户端上传流、双向实时通道
- 多语言团队共享同一套接口定义（proto 即文档即代码）
## 何时不使用
- 面向浏览器/第三方开发者的公开 API——REST+JSON 的生态与可调试性仍占优（gRPC-Web 有代理成本）
- 团队小、服务少、性能无压力——REST 的低门槛更划算
## 输入参数
- `serviceScenario` (string, **必填**) — 调用方/被调方、频率、延迟要求
- `streamingNeed` (string, 可选) — 是否需要流式及方向
## 输出
- `protoDesign` (object) — service/message 定义与版本演进策略
- `callConfig` (object) — deadline、重试、负载均衡配置
- `interopPlan` (string) — 与 REST/网关的互通方案
## 核心要点

gRPC 的核心价值是"契约先行"：proto 文件是唯一事实源，代码生成消灭手写序列化与文档漂移。用 gRPC 却不管契约演进纪律，等于放弃了它最大的好处。

## 关键要点

- 四种调用模式：unary（默认）、server streaming（进度推送/大结果分页）、client streaming（批量上传）、bidirectional（实时对话）；流式连接是有状态的，LB 与重连都更复杂，非必要不用
- Protobuf 演进纪律：字段编号永不复用、删字段用 `reserved`、新字段必须可选语义——破坏这三条会造成静默数据损坏（比编译错误更可怕）
- Deadline 是第一公民：每个调用都应带 deadline 并沿调用链传播（deadline propagation），无 deadline 的 gRPC 调用等于无限期挂起授权
- 错误模型：用标准 status code（NOT_FOUND/INVALID_ARGUMENT/UNAVAILABLE）+ google.rpc.ErrorInfo 携带细节；只有 UNAVAILABLE/DEADLINE_EXCEEDED 类才值得重试
- HTTP/2 多路复用意味着一个 TCP 连接跑所有请求：L4 负载均衡会把流量钉在一个后端，生产必须用 L7/客户端 LB（如 xDS、k8s headless service + 客户端轮询）
- 消息大小默认上限 4MB：大文件走对象存储传引用，不要调大上限硬塞
## 最佳实践

- proto 单独入库（或 monorepo 单独目录）+ buf 做 breaking change 检测，CI 里挡住不兼容变更
- 生成代码不入库（构建期生成），避免手改生成物
- 统一拦截器做鉴权、日志、metrics、重试，业务 handler 保持纯净
- 对外暴露时用 grpc-gateway/Envoy 转译 REST，一套 proto 两种协议

## 反模式

- ❌ 复用已删除字段的编号，旧客户端把新数据解析成完全错误的含义
- ❌ 不设 deadline，下游卡死时调用链全线挂起、线程池耗尽
- ❌ 对非幂等方法配自动重试，重复扣款
- ❌ 用双向流实现本可 unary 的请求响应，换来复杂的连接管理

## 分级掌握

- **Junior**: 能定义 proto 并实现 unary 服务，理解 status code 语义
- **Mid**: 能正确配置 deadline/重试/LB，管理 proto 版本演进，用 buf 挡破坏性变更
- **Senior**: 能做 gRPC vs REST 选型论证，设计流式方案与多语言契约治理体系

## 参考资源

- [gRPC 官方文档 — Core Concepts](https://grpc.io/docs/what-is-grpc/core-concepts/) — doc
- [Protobuf 官方 — Language Guide (proto3)](https://protobuf.dev/programming-guides/proto3/) — doc
- [buf — Breaking Change Detection](https://buf.build/docs/breaking/overview) — doc
- [Google Cloud — gRPC vs REST 选型指南](https://cloud.google.com/blog/products/api-management/understanding-grpc-openapi-and-rest-and-when-to-use-them) — article

## 相关 Skills

- [api-design](./api-design.md) — REST 侧的契约设计对照
- [idempotency-design](./idempotency-design.md) — 重试安全的前提
- [service-mesh](./service-mesh.md) — mTLS/流量治理的基础设施化
