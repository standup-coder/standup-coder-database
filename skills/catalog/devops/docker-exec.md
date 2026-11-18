---
id: docker-exec
type: atomic-skill
title: Docker Exec
nameZh: Docker 容器执行
domain: devops
tags: docker, container, exec, ops
catalogSource: internal
catalogFile: atomic-skills/docker-exec.json
catalogAddedAt: 2026-07-26
operation: container
level: junior
---

# Docker 容器执行
> 在运行中的 Docker 容器内执行命令
## 操作语义
- 类型: container
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `container` (string, **必填**) — 容器名称或 ID
- `command` (string, **必填**) — 要执行的命令
- `workdir` (string, 可选) — 容器内工作目录
- `user` (string, 可选) — 执行用户（默认 root）
- `timeout` (number, 可选) — 超时时间（毫秒） 默认: `30000`
## 输出
- `stdout` (string, **必填**) — 标准输出
- `stderr` (string, **必填**) — 标准错误
- `exitCode` (number, **必填**) — 退出码
## 核心要点

在容器里跑命令是 agent 隔离危险动作的首选沙箱，但配置错了反而是最大攻击面。

## 关键要点

- 默认非 root（USER 1000），禁用 --privileged
- 只挂载必要 volume，禁挂 docker.sock 与 / 根目录
- 设资源限制：--cpus / --memory / --pids-limit
- 网络默认 none 或专属 bridge，按需开放
- 执行前 image digest 锁定，避免 latest tag 被偷换

## 最佳实践

- 为每次 exec 创建一次性容器（--rm），不复用
- 使用 read-only 文件系统 + tmpfs /tmp
- Capabilities drop ALL，按需 add
- 采集容器 stdout/stderr 到统一日志，不落容器内
- 为高危镜像跑 trivy / grype 扫漏洞

## 反模式

- ❌ 挂 -v /:/host 直接逃逸
- ❌ --privileged + --network host 给 agent，等同裸跑
- ❌ 镜像用 :latest，无版本固定
- ❌ 一个容器里跑多个 exec，状态污染
- ❌ 把 secrets 通过 ENV 传入并 docker inspect 暴露

## 分级掌握

- **Junior**: 能 docker run 跑命令、理解 -v / -e / --rm 含义
- **Mid**: 能配置非 root、资源限制、capabilities drop、image 锁定
- **Senior**: 能为 agent 平台设计容器沙箱体系：镜像扫描 / runtime 加固 / 逃逸检测 / 配额治理

## 参考资源

- [Docker security best practices](https://docs.docker.com/engine/security/) — doc
- [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker) — doc
- [gVisor: container sandbox](https://gvisor.dev/) — doc

## 相关 Skills
_见所属 composite skill 或 role_