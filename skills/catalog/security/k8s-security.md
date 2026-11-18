---
id: k8s-security
type: atomic-skill
title: Kubernetes Security
nameZh: K8s 集群安全
domain: security
tags: kubernetes, security, hardening, network-policy, pss
catalogSource: internal
catalogFile: atomic-skills/k8s-security.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# K8s 集群安全
> K8s 集群端到端加固：控制面 / 网络 / 工作负载 / 供应链。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `cluster` (string, **必填**)
- `profile` (string, 可选) 取值: baseline/restricted
## 输出
- `findings` (array, 可选)
- `hardeningChecklist` (array, 可选)
- `networkPolicies` (array, 可选)
## 核心要点

K8s 安全是分层加固：control plane / node / network / workload / supply chain 每一层都有最小动作集，缺一环都会被打穿。

## 关键要点

- Pod Security Standards（baseline / restricted）替代 PSP
- NetworkPolicy 默认 deny-all
- kube-bench 跑 CIS Benchmark
- admission control（OPA / Kyverno）拦截违规
- 镜像签名（Cosign）+ admission 验证

## 最佳实践

- namespace 级 PSS = restricted
- CNI 选支持 NetworkPolicy 的（Calico / Cilium）
- 关闭 anonymous-auth、自动挂载 SA
- 开启 audit log 并集中存储

## 反模式

- ❌ namespace 不分级，所有 workload 平铺
- ❌ NetworkPolicy 只在生产开
- ❌ control plane 不打补丁
- ❌ 镜像 latest tag 上生产

## 分级掌握

- **Junior**: 能跑 kube-bench 与 PSS
- **Mid**: 能落地 NetworkPolicy + admission 治理
- **Senior**: 能驱动组织级 K8s 安全 baseline 与供应链安全

## 参考资源

- [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/) — doc
- [kube-bench](https://github.com/aquasecurity/kube-bench) — doc
- [Kyverno](https://kyverno.io/) — doc

## 相关 Skills
_见所属 composite skill 或 role_