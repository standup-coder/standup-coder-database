---
id: docker-essentials
type: atomic-skill
title: Docker Essentials
nameZh: Docker 基础
domain: devops
tags: docker, container, image, devops, build
catalogSource: internal
catalogFile: atomic-skills/docker-essentials.json
catalogAddedAt: 2026-07-26
operation: devops
level: junior
---

# Docker 基础
> 使用 Docker 构建 / 分发 / 运行容器：Dockerfile 编写、镜像优化、镜像仓库流程。
## 操作语义
- 类型: devops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `baseImage` (string, **必填**)
- `multistage` (boolean, 可选) 默认: `true`
- `target` (any, 可选) 取值: dev/prod 默认: `"prod"`
## 输出
- `dockerfile` (string, 可选)
- `imageSize` (number, 可选)
- `layers` (array, 可选)
## 核心要点

镜像越小、越确定、越安全。Dockerfile 写法决定整个 supply chain 风险。

## 关键要点

- 多阶段构建 (multi-stage) 分离 build 与 runtime
- 基础镜像锁 digest 而非 tag
- COPY 顺序按变更频率从低到高，优化缓存
- USER 非 root，HEALTHCHECK 指令必备
- 生产镜像禁装 curl/git/vim 等无用工具

## 最佳实践

- 用 distroless / chainguard / alpine 做 runtime base
- 用 buildx 跨架构构建
- docker scout / trivy 扫漏洞
- 镜像仓库做 retention policy 控成本

## 反模式

- ❌ 一行 RUN 跑 50 条命令难以调试
- ❌ 把 secrets 写进 Dockerfile / ENV
- ❌ 用 root 跑容器并 --privileged
- ❌ COPY . /app 把 .git / node_modules 一起塞进镜像

## 分级掌握

- **Junior**: 能写基础 Dockerfile 跑应用
- **Mid**: 能多阶段、缓存优化、漏洞扫描
- **Senior**: 能制定团队镜像规范：base、扫描、retention、SBOM

## 参考资源

- [Docker Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/) — doc
- [Distroless images](https://github.com/GoogleContainerTools/distroless) — doc
- [Chainguard images](https://www.chainguard.dev/chainguard-images) — doc

## 相关 Skills
_见所属 composite skill 或 role_