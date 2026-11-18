---
id: cloud-ir-playbook
type: atomic-skill
title: Cloud Incident Response Playbook
nameZh: 云事件响应 Playbook
domain: security
tags: security, ir, playbook, cloud, incident
catalogSource: internal
catalogFile: atomic-skills/cloud-ir-playbook.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 云事件响应 Playbook
> 为云常见场景撰写并执行事件响应 Playbook。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `scenario` (string, **必填**) 取值: credential-leak/crypto-mining/data-exfil/s3-public/ransomware/container-escape
- `cloud` (string, 可选) 取值: aws/azure/gcp
## 输出
- `playbook` (string, 可选)
- `containActions` (array, 可选)
- `evidenceList` (array, 可选)
## 核心要点

Playbook 不是事后再写，是事前预演；事件发生那 15 分钟你不会再想着读手册。

## 关键要点

- contain / eradicate / recover 三段
- IR role + readonly + forensics 预先建好
- snapshot 优于 destroy（forensics）
- 通讯通道与正常通道分离
- 复盘做 blameless post-mortem

## 最佳实践

- 每季度跑 tabletop drill
- 关键 playbook 自动化（Lambda / Step Functions）
- 把 timeline 自动归档
- 与法务 / PR 提前定义触发条件

## 反模式

- ❌ 事件中匆忙建 IR role
- ❌ 直接 terminate 实例丢失证据
- ❌ 通过日常 IM 通讯泄漏给攻击者
- ❌ 没有 post-mortem 重复踩坑

## 分级掌握

- **Junior**: 能执行已有 playbook 步骤
- **Mid**: 能撰写场景级 playbook 并演练
- **Senior**: 能驱动组织级 IR 体系与跨部门协同

## 参考资源

- [NIST SP 800-61](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final) — doc
- [AWS IR Guide](https://docs.aws.amazon.com/security-ir/latest/userguide/welcome.html) — doc
- [SANS Incident Handler Handbook](https://www.sans.org/white-papers/33901/) — doc

## 相关 Skills
_见所属 composite skill 或 role_