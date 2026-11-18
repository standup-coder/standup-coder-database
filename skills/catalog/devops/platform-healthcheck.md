---
id: platform-healthcheck
type: atomic-skill
title: Platform Health Check
nameZh: 平台健康检查
domain: devops
tags: ops, sre, healthcheck, monitoring, platform
catalogSource: internal
catalogFile: atomic-skills/platform-healthcheck.json
catalogAddedAt: 2026-07-26
operation: ops
level: mid
---

# 平台健康检查
> 在基础设施 / 服务 / 依赖层面持续做平台级健康检查。
## 操作语义
- 类型: ops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `scope` (string, **必填**)
- `cadence` (string, 可选) 取值: 1m/5m/15m/1h
## 输出
- `status` (object, 可选)
- `degraded` (array, 可选)
- `sloImpact` (object, 可选)
## 核心要点

平台健康检查不是 ping 服务存活，而是"端到端业务关键路径 + 依赖层 + 容量水位"三维持续观测。

## 关键要点

- liveness / readiness / synthetic 三层
- dependency health 用 circuit breaker 暴露
- SLO burn rate 是核心信号
- multi-region 检查防单点假阳
- health endpoint 不能拖慢业务

## 最佳实践

- synthetic 跑业务关键路径
- health endpoint < 100ms
- datadog / pingdom 多 vendor 互备
- 把 health → SLO → alert 链路打通

## 反模式

- ❌ liveness 拉 DB 引发雪崩
- ❌ health endpoint 不区分 dep / self
- ❌ 没有 synthetic 端到端验证
- ❌ 一秒钟探测淹没下游

## 分级掌握

- **Junior**: 能配置基础 health probe
- **Mid**: 能搭 synthetic + SLO + alert 链路
- **Senior**: 能驱动平台级可用性体系与 multi-region health

## 参考资源

- [Google SRE Book: SLOs](https://sre.google/sre-book/service-level-objectives/) — book
- [K8s probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) — doc
- [Datadog Synthetics](https://docs.datadoghq.com/synthetics/) — doc

## 相关 Skills
_见所属 composite skill 或 role_