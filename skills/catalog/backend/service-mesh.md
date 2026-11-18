---
id: service-mesh
type: atomic-skill
title: Service Mesh
nameZh: 服务网格
domain: backend
tags: microservices, service-mesh, istio, linkerd, observability
catalogSource: internal
catalogFile: atomic-skills/service-mesh.json
catalogAddedAt: 2026-07-26
operation: microservices
level: senior
---

# 服务网格
> 采用服务网格（Istio / Linkerd）实现流量治理、零信任安全与可观测。
## 操作语义
- 类型: microservices
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `platform` (any, **必填**) 取值: istio/linkerd/consul/cilium
- `clusterScale` (string, 可选)
- `requirements` (array, 可选)
## 输出
- `meshConfig` (object, 可选)
- `trafficPolicies` (array, 可选)
- `mTLSConfig` (object, 可选)
## 核心要点

服务网格把通用网络能力（mTLS、重试、熔断、tracing）下沉到 sidecar，但代价是复杂度与延迟。

## 关键要点

- 三大能力域：traffic（路由/重试/熔断）、security（mTLS/AuthZ）、observability（tracing/metrics）
- Istio 功能全但重；Linkerd 轻量；Cilium 走 eBPF 路线
- Sidecar 模式 vs Sidecar-less（ambient mesh）权衡延迟与隔离
- 灰度/金丝雀靠 VirtualService 实现，比应用内 SDK 解耦
- mTLS 默认开启可零信任，但需处理证书轮转
- 网格 ≠ 银弹：服务数 <10 的小系统不必上

## 最佳实践

- 渐进式接入：先观测，再 mTLS，最后流量策略
- 为每个服务定义 SLO，结合网格指标闭环
- 限制 sidecar CPU/Mem，避免吃掉应用资源
- 升级网格用 canary 策略，先升 sidecar 再升 control plane
- 明确网格能力边界，应用 SDK 不再做重试/熔断

## 反模式

- ❌ 服务数极少就上 Istio，复杂度远超收益
- ❌ 应用 SDK 与 mesh 同时做重试，导致雪崩
- ❌ Sidecar 与应用容器共享 limit 导致 OOM
- ❌ 策略写死在 yaml 没版本化
- ❌ mTLS 半开半关，留下安全死角

## 分级掌握

- **Junior**: 能在测试集群部署 Istio/Linkerd，理解 sidecar 概念
- **Mid**: 能配置 VirtualService、DestinationRule、PeerAuthentication 等
- **Senior**: 能在多集群、多租户场景做网格架构选型与演进

## 参考资源

- [Istio Docs](https://istio.io/latest/docs/) — doc
- [Linkerd Docs](https://linkerd.io/2/) — doc
- [Service Mesh Patterns](https://www.oreilly.com/library/view/istio-in-action/9781617295829/) — book
- [Ambient Mesh (Istio)](https://istio.io/latest/blog/2022/introducing-ambient-mesh/) — article
- [eBPF & Cilium](https://cilium.io/) — tool

## 相关 Skills
_见所属 composite skill 或 role_