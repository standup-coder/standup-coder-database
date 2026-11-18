---
id: secrets-management
type: atomic-skill
title: Secrets Management
nameZh: 凭据管理
domain: security
tags: security, secrets, vault, devops, compliance
catalogSource: internal
catalogFile: atomic-skills/secrets-management.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 凭据管理
> 安全地存储 / 分发 / 轮换 / 审计应用凭据（API key / DB / TLS 证书等）。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `secretName` (string, **必填**)
- `backend` (any, 可选) 取值: vault/aws-sm/gcp-sm/sealed-secrets/sops 默认: `"vault"`
- `rotationDays` (number, 可选) 默认: `90`
## 输出
- `reference` (string, 可选)
- `version` (string, 可选)
## 核心要点

Secrets 的本质是"who can read what when"：泄露不是技术问题而是治理失败。

## 关键要点

- 永远不要把 secret 写进代码 / 镜像 / 日志
- 动态凭据 > 静态凭据（短期 token + 自动轮换）
- 应用启动时拉取，运行时缓存，定时刷新
- audit log 必开，谁访问了哪个 secret 何时
- break-glass 流程预设：紧急访问可追溯

## 最佳实践

- HashiCorp Vault / AWS SM / GCP SM 任选其一统一
- GitOps 用 SealedSecrets / SOPS 加密入库
- CI/CD 通过 OIDC 动态拿 secret 而非长期 key
- 凭据轮换测试自动化覆盖

## 反模式

- ❌ secret 直接写 helm values
- ❌ 所有服务共享同一个超大权限的 root token
- ❌ rotation 半年不跑，泄露后无法快速止血
- ❌ 审计日志关掉省成本

## 分级掌握

- **Junior**: 能从 vault 读取 secret 注入应用
- **Mid**: 能设计轮换、动态凭据、CI OIDC 流程
- **Senior**: 能建立组织级 secret 治理：分级、审计、break-glass、合规

## 参考资源

- [HashiCorp Vault](https://developer.hashicorp.com/vault) — doc
- [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/) — doc
- [SOPS](https://github.com/getsops/sops) — doc

## 相关 Skills
_见所属 composite skill 或 role_