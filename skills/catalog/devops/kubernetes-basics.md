---
id: kubernetes-basics
type: atomic-skill
title: Kubernetes Basics
nameZh: Kubernetes 基础
domain: devops
tags: kubernetes, container, orchestration, devops, cloud-native
catalogSource: internal
catalogFile: atomic-skills/kubernetes-basics.json
catalogAddedAt: 2026-07-26
operation: devops
level: junior
---

# Kubernetes 基础
> 掌握 K8s 核心对象（Pod / Deployment / Service / Ingress / ConfigMap / Secret）部署与运维应用。
## 操作语义
- 类型: devops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `workload` (string, **必填**) — 应用名称
- `replicas` (number, 可选) 默认: `2`
- `image` (string, 可选)
- `namespace` (string, 可选) 默认: `"default"`
## 输出
- `manifests` (array, 可选)
- `applyResult` (object, 可选)
## 核心要点

K8s 是约定优先于代码的平台：先理解对象关系图，再写 yaml 才不会迷路。

## 关键要点

- Pod 是最小部署单元但不直接管理；用 Deployment / StatefulSet
- 一定声明 resources.requests/limits
- liveness / readiness / startup 三种 probe
- Service ClusterIP/NodePort/LoadBalancer/ExternalName 各有用途
- ConfigMap 与 Secret 分开，且 Secret 用 SealedSecrets / SOPS 加密入库

## 最佳实践

- namespace 隔离环境与团队
- 用 kustomize / helm 管理 manifest
- 通过 HPA / VPA 自动扩缩
- PodDisruptionBudget 保证发布期间可用性

## 反模式

- ❌ 不设 limits 导致单 Pod 吃光节点
- ❌ 把 latest 镜像直接部署到生产
- ❌ Secret 明文写在 manifest
- ❌ 直接 kubectl edit 改生产对象不入 git

## 分级掌握

- **Junior**: 能写 Deployment + Service 暴露应用
- **Mid**: 能用 helm / kustomize、配置 HPA / probe
- **Senior**: 能设计平台级 K8s 治理（多租、配额、安全基线）

## 参考资源

- [Kubernetes Docs](https://kubernetes.io/docs/) — doc
- [Kubernetes Patterns (book)](https://k8spatterns.io/) — book
- [Helm Charts](https://helm.sh/docs/) — doc

## 相关 Skills
_见所属 composite skill 或 role_