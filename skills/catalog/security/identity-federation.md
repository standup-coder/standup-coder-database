---
id: identity-federation
type: atomic-skill
title: Identity Federation
nameZh: 身份联邦
domain: security
tags: identity, federation, saml, oidc, sso
catalogSource: internal
catalogFile: atomic-skills/identity-federation.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 身份联邦
> 通过 SAML / OIDC / SCIM 在 IdP / 云 / SaaS 之间实现身份联邦。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `idp` (string, **必填**)
- `sp` (string, **必填**)
- `protocol` (string, 可选) 取值: saml/oidc/scim
## 输出
- `trustConfig` (object, 可选)
- `attributeMapping` (object, 可选)
- `testResult` (object, 可选)
## 核心要点

身份联邦的复杂度不在协议，而在 attribute mapping + lifecycle；SCIM 同步比 SAML 更容易出事。

## 关键要点

- OIDC > SAML（新系统优先）
- SCIM 做 lifecycle 自动化
- NameID 选 immutable 字段
- Just-in-Time provisioning vs SCIM 推送
- IdP 是单点失败点要 HA

## 最佳实践

- certificate rotation 自动化
- 断言签名 + 加密双开
- group → role 映射可审计
- IdP 故障要有备用本地账号 break-glass

## 反模式

- ❌ NameID 用 email 后续改邮箱炸
- ❌ 不做 SCIM 离职账号长期残留
- ❌ 一个 IdP cert 永不轮换
- ❌ SP-initiated 与 IdP-initiated 混用没 RelayState

## 分级掌握

- **Junior**: 能配置一个 SAML / OIDC SP
- **Mid**: 能落地 SCIM lifecycle + attribute mapping
- **Senior**: 能驱动组织级 IdP 战略与 zero-trust 联邦

## 参考资源

- [OIDC Spec](https://openid.net/specs/openid-connect-core-1_0.html) — spec
- [SAML Bindings](https://docs.oasis-open.org/security/saml/v2.0/saml-bindings-2.0-os.pdf) — spec
- [SCIM 2.0](https://datatracker.ietf.org/doc/html/rfc7643) — spec

## 相关 Skills
_见所属 composite skill 或 role_