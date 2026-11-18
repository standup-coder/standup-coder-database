---
id: key-management
type: atomic-skill
title: Key Management
nameZh: 密钥管理
domain: security
tags: security, kms, hsm, encryption, key-rotation
catalogSource: internal
catalogFile: atomic-skills/key-management.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 密钥管理
> 基于 KMS / HSM 设计并运营密钥全生命周期，含轮换 / 吊销 / 审计。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `scope` (string, **必填**)
- `provider` (string, 可选) 取值: aws-kms/gcp-kms/azure-keyvault/hashicorp-vault/hsm
- `rotationDays` (number, 可选) 默认: `90`
## 输出
- `keyInventory` (array, 可选)
- `rotationPlan` (object, 可选)
- `auditLog` (array, 可选)
## 核心要点

密钥管理的灾难只有两种：丢了和泄漏了；KMS 不是用来"存"密钥，是用来"使用"密钥而不暴露明文。

## 关键要点

- envelope encryption（DEK + KEK）
- CMK 永远不出 KMS
- 轮换不等于重新加密历史数据
- BYOK / HYOK 适用合规场景
- audit log 必须不可删除

## 最佳实践

- rotation 自动化与 alerting
- IAM policy 限定 kms:Decrypt 范围
- 使用 grant 而非 share key
- 定期跑 rotate + restore drill

## 反模式

- ❌ 密钥落 git / env 文件
- ❌ 一个 CMK 多业务复用
- ❌ 从不 rotate
- ❌ 没 backup 直接 disable key

## 分级掌握

- **Junior**: 能用 KMS 加解密数据
- **Mid**: 能落地 envelope + rotation + audit
- **Senior**: 能驱动组织级密钥治理与合规对齐

## 参考资源

- [AWS KMS Best Practices](https://docs.aws.amazon.com/kms/latest/developerguide/best-practices.html) — doc
- [NIST SP 800-57](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final) — doc
- [HashiCorp Vault Transit](https://developer.hashicorp.com/vault/docs/secrets/transit) — doc

## 相关 Skills
_见所属 composite skill 或 role_