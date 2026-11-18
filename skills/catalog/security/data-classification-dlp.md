---
id: data-classification-dlp
type: atomic-skill
title: Data Classification & DLP
nameZh: 数据分类与 DLP
domain: security
tags: security, data, dlp, classification, pii
catalogSource: internal
catalogFile: atomic-skills/data-classification-dlp.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 数据分类与 DLP
> 对数据敏感度进行分类，结合 DLP 扫描 / 脱敏 / 策略控制防止泄漏。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `scope` (string, **必填**)
- `classes` (array, 可选)
- `tool` (string, 可选) 取值: macie/gcp-dlp/purview/bigid
## 输出
- `classification` (object, 可选)
- `leakRisks` (array, 可选)
- `policies` (array, 可选)
## 核心要点

没有分类的 DLP 是无差别拦截，会被业务规避；先做 classification，再 DLP，才是可执行路径。

## 关键要点

- 四级分类（public / internal / confidential / restricted）
- auto-tag + manual review 结合
- DLP 在通道（email / chat / upload）拦截
- tokenization > masking
- data lineage 配合分类

## 最佳实践

- Macie / DLP 自动扫描 + label
- 高敏数据走专用 KMS
- DLP rule 与分类绑定
- 每年 review 分类标准

## 反模式

- ❌ DLP 一刀切阻断引发业务绕道
- ❌ 数据无分类直接上 DLP
- ❌ 只扫 storage 不扫 channel
- ❌ 分类标准长期不更新

## 分级掌握

- **Junior**: 能用工具做基础分类扫描
- **Mid**: 能落地 classification + DLP policy 闭环
- **Senior**: 能驱动组织级 data governance 战略

## 参考资源

- [AWS Macie](https://docs.aws.amazon.com/macie/) — doc
- [GCP DLP](https://cloud.google.com/dlp/docs) — doc
- [Microsoft Purview](https://learn.microsoft.com/en-us/purview/) — doc

## 相关 Skills
_见所属 composite skill 或 role_