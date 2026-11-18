---
id: multi-cloud-security
type: atomic-skill
title: Multi-Cloud Security
nameZh: 多云安全
domain: security
tags: security, multi-cloud, governance, posture, vendor-neutral
catalogSource: internal
catalogFile: atomic-skills/multi-cloud-security.json
catalogAddedAt: 2026-07-26
operation: security
level: senior
---

# 多云安全
> 在 AWS / Azure / GCP 之间设计统一安全态势，避免锁定与盲区。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `clouds` (array, **必填**)
- `domain` (string, 可选) 取值: identity/network/data/workload
## 输出
- `controlMatrix` (object, 可选)
- `gaps` (array, 可选)
- `unifiedTooling` (array, 可选)
## 核心要点

多云安全不是把单云方案叠三遍；要先选定 control framework（CSA / NIST），再选跨云工具填齐控制点。

## 关键要点

- CSA CCM / NIST CSF 做 control framework
- 统一 IdP（SSO + SCIM）防身份分裂
- CSPM / CNAPP 类工具替代各家原生
- 日志统一到一个 SIEM
- IaC 多云 abstraction（Terraform 模块化）

## 最佳实践

- 先 control matrix 再选工具
- 主云 + 次云模式优于平等多云
- 认证 / 网络 / 数据三层各自统一
- 事件响应 playbook 跨云一致

## 反模式

- ❌ 每朵云独立 SSO
- ❌ 多 SIEM 数据分裂
- ❌ 只用云原生工具被锁定
- ❌ 没有统一 IaC 出现配置漂移

## 分级掌握

- **Junior**: 能用 CNAPP 工具看多云态势
- **Mid**: 能落地 control matrix + 统一 IdP
- **Senior**: 能驱动组织级多云治理战略

## 参考资源

- [CSA Cloud Controls Matrix](https://cloudsecurityalliance.org/research/cloud-controls-matrix/) — doc
- [NIST CSF](https://www.nist.gov/cyberframework) — doc
- [Wiz / Orca / Prisma Cloud](https://www.wiz.io/academy) — doc

## 相关 Skills
_见所属 composite skill 或 role_