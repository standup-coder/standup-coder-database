---
id: github-actions
type: atomic-skill
title: GitHub Actions
nameZh: GitHub Actions
domain: devops
tags: ci-cd, github, actions, automation, devops
catalogSource: internal
catalogFile: atomic-skills/github-actions.json
catalogAddedAt: 2026-07-26
operation: devops
level: mid
---

# GitHub Actions
> 编写 GitHub Actions 工作流，覆盖 CI / CD / 发布自动化与可复用 composite action。
## 操作语义
- 类型: devops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `purpose` (any, **必填**) 取值: ci/cd/release/scheduled/reusable
- `runner` (any, 可选) 取值: ubuntu-latest/macos-latest/windows-latest/self-hosted 默认: `"ubuntu-latest"`
- `triggers` (array, 可选)
## 输出
- `workflowYaml` (string, 可选)
- `jobs` (array, 可选)
## 核心要点

GitHub Actions 是开发者的瑞士军刀，但默认配置不够安全，必须主动加固。

## 关键要点

- pin action 到 SHA，不用 @main
- 最小权限 GITHUB_TOKEN（permissions: read）
- OIDC 联邦认证替代 long-lived secret
- 关键作业用 environment + required reviewers
- 复用 reusable workflow 替代 copy-paste

## 最佳实践

- actionlint / zizmor 静态扫
- 缓存 dependency 加速 ci（actions/cache）
- 失败重试用 nick-fields/retry
- 把 release 切到 release-please / changesets

## 反模式

- ❌ secret 写在 workflow 文件里
- ❌ pull_request_target 接收 fork PR 不审计
- ❌ 大仓 monorepo 全量 CI，每次 30 分钟
- ❌ self-hosted runner 暴露在公网无沙箱

## 分级掌握

- **Junior**: 能写 CI 跑测试和 lint
- **Mid**: 能用 reusable workflow / matrix / cache 优化
- **Senior**: 能制定全组织 Actions 安全规范、OIDC 改造、合规审计

## 参考资源

- [GitHub Actions security hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions) — doc
- [OIDC for cloud auth](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect) — doc

## 相关 Skills
_见所属 composite skill 或 role_