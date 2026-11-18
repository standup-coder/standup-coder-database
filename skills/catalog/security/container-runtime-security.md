---
id: container-runtime-security
type: atomic-skill
title: Container Runtime Security
nameZh: 容器运行时安全
domain: security
tags: container, runtime-security, ebpf, falco, k8s
catalogSource: internal
catalogFile: atomic-skills/container-runtime-security.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 容器运行时安全
> 基于 eBPF / syscall 监控容器运行时威胁并响应。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `cluster` (string, **必填**)
- `tool` (string, 可选) 取值: falco/tetragon/sysdig/aqua
- `ruleset` (string, 可选)
## 输出
- `events` (array, 可选)
- `alerts` (array, 可选)
- `response` (object, 可选)
## 核心要点

Runtime 是最后一道防线；好的 runtime 安全工具不是看告警数量，而是看"能区分异常 vs 业务正常"。

## 关键要点

- eBPF 优于内核模块（无停机）
- 规则按 syscall / file / network / process 维度分层
- detect → alert → block 渐进推进
- profile-based detection > 静态规则
- 与 K8s audit log 关联

## 最佳实践

- 先观察 2 周再上 block
- 规则与命名空间 / workload 解耦
- 高危事件直推 SOC / on-call
- Falco 规则进 Git 做版本管理

## 反模式

- ❌ 默认规则一上即 block
- ❌ 不区分 dev / prod 环境
- ❌ 告警过载导致疲劳

## 分级掌握

- **Junior**: 能部署 Falco 看告警
- **Mid**: 能写自定义规则与降噪
- **Senior**: 能搭组织级 runtime detection 体系并对接 SOC

## 参考资源

- [Falco](https://falco.org/docs/) — doc
- [Tetragon](https://tetragon.io/docs/) — doc
- [CNCF Cloud Native Security Whitepaper](https://github.com/cncf/tag-security) — doc

## 相关 Skills
_见所属 composite skill 或 role_