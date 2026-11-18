---
id: privacy-engineering
type: atomic-skill
title: Privacy Engineering
nameZh: 隐私工程
domain: security
tags: privacy, gdpr, engineering, consent, dsr
catalogSource: internal
catalogFile: atomic-skills/privacy-engineering.json
catalogAddedAt: 2026-07-26
operation: security
level: senior
---

# 隐私工程
> 把"隐私 by design"嵌入系统：数据最小化 / 同意管理 / 留存 / DSR 履行。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `system` (string, **必填**)
- `jurisdictions` (array, 可选)
## 输出
- `dataInventory` (array, 可选)
- `consentFlow` (object, 可选)
- `dsrRunbook` (string, 可选)
## 核心要点

隐私不是合规部门的事，是工程默认实践。"data minimization + retention + DSR API"是隐私工程三件套。

## 关键要点

- lawful basis 先于 collection
- data inventory + lineage
- DSR（access / delete / export）走自动化
- consent 是状态而非一次性
- pseudonymization > anonymization 易实现

## 最佳实践

- 每新事件先做 PIA / DPIA
- retention 写进 schema 注释 + TTL
- 把 DSR 做成内部 API 给客服调用
- consent log 不可篡改

## 反模式

- ❌ DSR 全靠人工 SQL
- ❌ consent 状态散落多个系统
- ❌ "反正用得到" 收集后没人删
- ❌ 把隐私当法务工作不写进 sprint

## 分级掌握

- **Junior**: 能实现 consent 与 retention 控制
- **Mid**: 能搭 DSR 自动化 + data inventory
- **Senior**: 能驱动组织级 privacy by design 与 DPIA 文化

## 参考资源

- [GDPR.eu](https://gdpr.eu/) — doc
- [NIST Privacy Framework](https://www.nist.gov/privacy-framework) — doc
- [Privacy by Design](https://www.ipc.on.ca/wp-content/uploads/Resources/7foundationalprinciples.pdf) — doc

## 相关 Skills
_见所属 composite skill 或 role_