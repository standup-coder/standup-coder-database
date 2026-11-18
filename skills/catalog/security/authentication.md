---
id: authentication
type: atomic-skill
title: Authentication
nameZh: 身份认证
domain: security
tags: security, authentication, oauth, jwt, identity
catalogSource: internal
catalogFile: atomic-skills/authentication.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 身份认证
> 实现身份认证流程，覆盖密码、OAuth2/OIDC、JWT、Session 与多因子等场景。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `method` (any, **必填**) 取值: password/oauth2/oidc/magic-link/passkey/saml
- `mfaRequired` (boolean, 可选) 默认: `false`
- `sessionType` (any, 可选) 取值: cookie/jwt/opaque-token 默认: `"cookie"`
## 输出
- `tokens` (object, 可选)
- `userId` (string, 可选)
- `expiresAt` (string, 可选)
## 核心要点

Authentication 是安全的第一道闸：自己造比用 IdP 风险高十倍，能委托就别自研。

## 关键要点

- 密码哈希用 Argon2id / bcrypt，禁用 MD5/SHA1
- JWT 慎用：默认过期 ≤ 15min + refresh token 轮换
- OIDC > OAuth2，标准化 id_token 验证
- passkey / WebAuthn 是钓鱼免疫的未来
- session 存储优先选 server-side（Redis）

## 最佳实践

- 登录失败次数限速 + 验证码 + 账户锁定
- 凭据传输强制 HTTPS + Secure / HttpOnly / SameSite cookie
- 集成 IdP（Auth0 / Clerk / Cognito）替代自研
- 审计登录、登出、密码重置等关键事件

## 反模式

- ❌ 明文 / 可逆加密保存密码
- ❌ JWT 写敏感信息且永不过期
- ❌ 同时支持太多第三方 IdP 但不做 SSO 整合
- ❌ 把 session token 放 localStorage 暴露给 XSS

## 分级掌握

- **Junior**: 能集成 OAuth2 / OIDC 完成登录
- **Mid**: 能设计 session / token 体系、MFA、限速
- **Senior**: 能制定企业级身份架构：SSO / passkey / 风险引擎

## 参考资源

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) — doc
- [OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/draft-ietf-oauth-security-topics/) — doc
- [WebAuthn Guide](https://webauthn.guide/) — doc

## 相关 Skills
_见所属 composite skill 或 role_