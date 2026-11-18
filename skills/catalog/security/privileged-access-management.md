---
id: privileged-access-management
type: atomic-skill
title: Privileged Access Management
nameZh: 特权访问管理
domain: security
tags: security, pam, privileged, jit, identity
catalogSource: internal
catalogFile: atomic-skills/privileged-access-management.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 特权访问管理
> 为特权账号 / Secret / JIT 访问设计与运营 PAM 体系。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `scope` (string, **必填**)
- `mode` (string, 可选) 取值: vault/jit/session-recording
## 输出
- `policy` (object, 可选)
- `sessionLogs` (array, 可选)
- `accessRequests` (array, 可选)
## 核心要点

PAM 的核心不是把密码锁起来，而是把"特权"从常驻变成临时（JIT），从口令变成会话审计。

## 关键要点

- 永久 root → JIT root
- 所有特权会话录像与审计
- break-glass 账户必须监控
- Vault / CyberArk / Teleport 选型
- workflow approval（双人原则）

## 最佳实践

- SSH 用 short-lived cert 替代 key
- 生产数据库走 bastion + session record
- JIT 申请与 ticketing 联动
- 定期回看 break-glass 审计

## 反模式

- ❌ Excel 管理特权口令
- ❌ shared root 账号没人负责
- ❌ session 录像但没人看
- ❌ JIT 永久授权变常驻

## 分级掌握

- **Junior**: 能用 Vault 管理 secret
- **Mid**: 能落地 JIT + session record 流程
- **Senior**: 能驱动组织级 PAM 与零信任体系

## 参考资源

- [HashiCorp Vault](https://developer.hashicorp.com/vault) — doc
- [Teleport](https://goteleport.com/docs/) — doc
- [NIST PAM](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63-3.pdf) — doc

## 相关 Skills
_见所属 composite skill 或 role_