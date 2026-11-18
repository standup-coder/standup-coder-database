---
id: cloud-encryption
type: atomic-skill
title: Cloud Encryption
nameZh: 云加密
domain: security
tags: security, encryption, kms, cloud, data-protection
catalogSource: internal
catalogFile: atomic-skills/cloud-encryption.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 云加密
> 在云上实现静态 / 传输 / 使用中加密，配合 KMS、信封加密与密钥全生命周期管理。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `scope` (any, **必填**) 取值: at-rest/in-transit/in-use/full
- `kmsBackend` (any, 可选) 取值: aws-kms/gcp-kms/azure-keyvault/hsm
- `keyRotationDays` (number, 可选) 默认: `365`
## 输出
- `policyDocument` (object, 可选)
- `rotationSchedule` (string, 可选)
## 核心要点

加密三态：静态、传输、使用中。多数事故不在算法弱，而在密钥管理混乱。

## 关键要点

- 信封加密：DEK 加密数据，KEK（KMS）加密 DEK
- 客户管理密钥（CMK）vs 服务托管
- TLS 1.2+ 强制，禁用旧协议
- confidential computing（SEV / SGX）实现 in-use 加密
- 密钥生命周期：create / rotate / revoke / destroy 全审计

## 最佳实践

- 默认开启 EBS / S3 / RDS 加密
- 密钥按业务域隔离
- 导入自带密钥（BYOK / HYOK）以满足合规
- 与 IAM 联动控制 key 使用权

## 反模式

- ❌ 一把 KEK 解所有库
- ❌ 密钥永不轮换
- ❌ 把 KEK 与数据放同一账号无隔离
- ❌ TLS 用自签证书且无验证

## 分级掌握

- **Junior**: 能开启服务级加密
- **Mid**: 能设计 CMK / 信封加密 / 轮换
- **Senior**: 能制定组织级密钥治理与合规对齐

## 参考资源

- [AWS KMS Best Practices](https://docs.aws.amazon.com/kms/latest/developerguide/best-practices.html) — doc
- [Google Cloud KMS](https://cloud.google.com/kms/docs) — doc
- [NIST SP 800-57 Key Management](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-57pt1r5.pdf) — doc

## 相关 Skills
_见所属 composite skill 或 role_