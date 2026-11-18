---
id: k8s-troubleshooting
type: atomic-skill
title: Kubernetes Troubleshooting
nameZh: K8s 故障排查
domain: devops
tags: kubernetes, troubleshooting, debug, oncall, ops
catalogSource: internal
catalogFile: atomic-skills/k8s-troubleshooting.json
catalogAddedAt: 2026-07-26
operation: ops
level: mid
---

# K8s 故障排查
> 排查 K8s 在 pod / service / 网络 / 存储 / 控制面层的故障。
## 操作语义
- 类型: ops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `symptom` (string, **必填**)
- `namespace` (string, 可选)
- `cluster` (string, 可选)
## 输出
- `rootCause` (string, 可选)
- `evidence` (array, 可选)
- `remediation` (string, 可选)
## 核心要点

K8s 故障 80% 落在 4 类：镜像 / 资源 / 网络 / probe；先按这 4 类做 bisect 比直接读 etcd 快十倍。

## 关键要点

- kubectl describe + events 第一步
- CrashLoopBackOff 看 logs --previous
- pending pod 看 scheduler events
- DNS 问题先 nslookup 再看 CoreDNS
- OOMKilled 看 limits

## 最佳实践

- stern / k9s 做多 pod 日志聚合
- ephemeral debug container 上线
- cluster-level audit log 集中存
- kube-state-metrics + Prometheus 看趋势

## 反模式

- ❌ 一上来 kubectl exec 改 pod
- ❌ 不看 events 只看 logs
- ❌ 一遇问题 restart pod
- ❌ limits 不设导致互相挤

## 分级掌握

- **Junior**: 能 describe / logs 排查单 pod
- **Mid**: 能跨 namespace / 网络 / DNS 多维诊断
- **Senior**: 能驱动 K8s 平台稳定性与诊断工具体系

## 参考资源

- [K8s Troubleshooting docs](https://kubernetes.io/docs/tasks/debug/) — doc
- [k9s](https://k9scli.io/) — doc
- [Stern](https://github.com/stern/stern) — doc

## 相关 Skills
_见所属 composite skill 或 role_