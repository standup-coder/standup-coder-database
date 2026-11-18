---
id: storage-security
type: atomic-skill
title: Storage Security
nameZh: 存储安全
domain: security
tags: security, storage, s3, encryption, lifecycle
catalogSource: internal
catalogFile: atomic-skills/storage-security.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 存储安全
> 通过加密 / 公开访问阻断 / 生命周期 / 审计加固云存储（S3 / Blob / GCS）。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `bucket` (string, **必填**)
- `provider` (string, 可选) 取值: s3/gcs/azure-blob/oss
## 输出
- `findings` (array, 可选)
- `encryptionState` (string, 可选)
- `publicAccess` (boolean, 可选)
- `lifecyclePolicy` (object, 可选)
## 核心要点

90% 云数据泄漏的根因是 storage 配置错误，不是 0day。把"public block + encryption + lifecycle + access log"四件事做了能拦下大多数。

## 关键要点

- Block Public Access 账号级开启
- SSE-KMS 优于 SSE-S3
- pre-signed URL 必须有 TTL
- lifecycle 自动迁移冷数据 / 删除
- access log + Athena 做事后审计

## 最佳实践

- IaC 默认所有 bucket 私有
- CSPM 持续扫描 public bucket
- KMS key 与 bucket 一一对应
- object lock 防勒索篡改

## 反模式

- ❌ "暂时" public 后忘了关
- ❌ pre-signed URL 给 7 天 TTL
- ❌ 不开 access log 出事查不到
- ❌ lifecycle 不配置成本失控

## 分级掌握

- **Junior**: 能配置加密与 public block
- **Mid**: 能落地 IaC + CSPM + lifecycle
- **Senior**: 能驱动组织级存储安全 baseline 与勒索防护

## 参考资源

- [AWS S3 Security Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html) — doc
- [GCS Security](https://cloud.google.com/storage/docs/best-practices) — doc
- [Azure Blob Security](https://learn.microsoft.com/en-us/azure/storage/blobs/security-recommendations) — doc

## 相关 Skills
_见所属 composite skill 或 role_