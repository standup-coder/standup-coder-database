---
id: service-health-check
type: atomic-skill
title: Service Health Check
nameZh: 服务健康检查
domain: devops
tags: ops, healthcheck, liveness, readiness, k8s
catalogSource: internal
catalogFile: atomic-skills/service-health-check.json
catalogAddedAt: 2026-07-26
operation: ops
level: junior
---

# 服务健康检查
> 实现服务级健康检查端点，与负载均衡和编排平台对接。
## 操作语义
- 类型: ops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `service` (string, **必填**)
- `checks` (array, 可选)
## 输出
- `endpoints` (array, 可选)
- `response` (object, 可选)
## 核心要点

liveness 与 readiness 写错是 K8s 最常见自伤；liveness 拉 DB = 一次 DB 抖动重启全集群。

## 关键要点

- liveness：进程是否存活
- readiness：是否能接流量
- startup：慢启动应用专用
- liveness 不查依赖
- readiness 可以查关键依赖

## 最佳实践

- liveness 仅看自身（HTTP 200）
- readiness 查关键 dep 但 fail open
- timeout < 探测周期 / 2
- startup probe 给慢启动留时间

## 反模式

- ❌ liveness 查 DB 引发雪崩
- ❌ 探测周期 1s 把服务压垮
- ❌ readiness 不区分启动 vs 退出
- ❌ response 200 但 body 是 error

## 分级掌握

- **Junior**: 能实现 HTTP 200 端点
- **Mid**: 能正确区分 3 类 probe + dep 处理
- **Senior**: 能驱动跨服务健康检查标准与 SLO 联动

## 参考资源

- [K8s Configure Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) — doc
- [Google SRE Book: Load Balancing](https://sre.google/sre-book/load-balancing-frontend/) — book
- [Spring Boot Actuator](https://docs.spring.io/spring-boot/reference/actuator/) — doc

## 相关 Skills
_见所属 composite skill 或 role_