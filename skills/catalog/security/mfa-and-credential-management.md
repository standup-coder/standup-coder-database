---
id: mfa-and-credential-management
type: atomic-skill
title: MFA & Credential Management
nameZh: 多因子与凭据管理
domain: security
tags: security, mfa, credential, phishing, identity
catalogSource: internal
catalogFile: atomic-skills/mfa-and-credential-management.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 多因子与凭据管理
> 推行 MFA，管理凭据全生命周期（签发 / 轮换 / 吊销），防钓鱼与撞库。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `scope` (any, **必填**) 取值: workforce/customer/machine
- `mfaMethods` (array, 可选)
## 输出
- `enrollmentRate` (number, 可选)
- `phishingResistant` (boolean, 可选)
## 核心要点

MFA 不等于安全：SMS 与 TOTP 可被钓鱼，只有 WebAuthn / FIDO2 才是钓鱼免疫。

## 关键要点

- phishing-resistant 才是金标准
- admin / privileged 必须强制 FIDO2
- TOTP 兼容旧用户但需逐步替换
- 凭据生命周期：issue → rotate → revoke 全部审计
- 撞库防御：rate limit + breach password check

## 最佳实践

- 推 passkey / FIDO2 给关键账号
- 把 MFA 注册嵌入 onboarding 不可跳过
- 提供 self-service backup code 与设备管理
- 与 SIEM 联动，检测异常登录

## 反模式

- ❌ 只支持 SMS MFA
- ❌ admin 与普通用户用同样 MFA 强度
- ❌ 丢手机就重置全部 MFA 而无身份验证
- ❌ 凭据吊销后没有 session revocation

## 分级掌握

- **Junior**: 能配 TOTP / push MFA
- **Mid**: 能推 FIDO2 / passkey、设计凭据生命周期
- **Senior**: 能制定组织级身份与凭据治理：分级、自动化、合规

## 参考资源

- [NIST 800-63B Digital Identity Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html) — doc
- [CISA: Phishing-Resistant MFA](https://www.cisa.gov/sites/default/files/publications/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf) — doc
- [WebAuthn / passkey](https://passkeys.dev/) — doc

## 相关 Skills
_见所属 composite skill 或 role_