---
id: docker-to-k8s
type: atomic-skill
title: Docker to Kubernetes
nameZh: Docker 迁移到 K8s
domain: devops
tags: kubernetes, docker, migration, manifest, helm
catalogSource: internal
catalogFile: atomic-skills/docker-to-k8s.json
catalogAddedAt: 2026-07-26
operation: ops
level: mid
---

# Docker 迁移到 K8s
> 将 Docker 容器化应用迁移至 K8s：manifest / config / secret / 上线策略全覆盖。
## 操作语义
- 类型: ops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `source` (string, **必填**) — compose 文件或 docker run 命令
- `target` (string, 可选) 取值: raw-yaml/helm/kustomize
## 输出
- `manifests` (array, 可选)
- `secrets` (array, 可选)
- `migrationPlan` (object, 可选)
## 核心要点

compose → k8s 不是 1:1 翻译；网络 / 存储 / 健康检查 / lifecycle 这四件事必须按 K8s 思维重写，否则迁移即事故。

## 关键要点

- compose service → Deployment + Service
- volumes → PVC + StorageClass
- depends_on 改 readiness probe
- env_file → ConfigMap / Secret
- restart 策略 → Deployment / StatefulSet 选型

## 最佳实践

- kompose convert 起步，再人工调
- Helm chart 抽 values 复用
- 迁移前先做 dry-run + canary
- health probe（liveness / readiness / startup）必须配齐

## 反模式

- ❌ 直接 kompose 输出上生产
- ❌ 不区分 stateless / stateful
- ❌ docker logs 习惯换成 stdout 日志规范
- ❌ 把 docker-compose volume 翻译成 hostPath

## 分级掌握

- **Junior**: 能跑 kompose 输出基础 manifest
- **Mid**: 能完整迁移含状态服务并配 probe
- **Senior**: 能驱动组织级容器化与 K8s 标准化

## 参考资源

- [Kompose](https://kompose.io/) — doc
- [K8s Migration Guide](https://kubernetes.io/docs/concepts/workloads/) — doc
- [Helm](https://helm.sh/docs/) — doc

## 相关 Skills
_见所属 composite skill 或 role_