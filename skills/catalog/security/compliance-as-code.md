---
id: compliance-as-code
type: atomic-skill
title: Compliance as Code
nameZh: 合规即代码
domain: security
tags: compliance, opa, governance, automation, devsecops
catalogSource: internal
catalogFile: atomic-skills/compliance-as-code.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 合规即代码
> 用代码（OPA / Rego / Cloud Custodian）表达与执行合规控制点，持续收集 evidence。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `framework` (any, **必填**) 取值: soc2/iso27001/pci-dss/cis/custom
- `enforcement` (any, 可选) 取值: advisory/mandatory 默认: `"advisory"`
## 输出
- `policies` (array, 可选)
- `evidence` (array, 可选)
- `violations` (array, 可选)
## 核心要点

Compliance as Code 把 control 从 PDF 拽进 Git，让 evidence 在 CI 里自然生长。

## 关键要点

- policy = code = test = evidence
- OPA / Rego 是事实标准
- admission control（Kyverno / Gatekeeper）拦截违规
- Cloud Custodian / Steampipe 巡检云资源
- control mapping 一份多用（SOC2 / ISO 复用）

## 最佳实践

- policy 与应用一同 PR review
- advisory → mandatory 渐进推进
- evidence 自动归档（Drata / Vanta API）
- control owner + due date 落到 Jira

## 反模式

- ❌ policy 写完不跑、不监控漂移
- ❌ advisory 永久 advisory，不进入 mandatory
- ❌ evidence 仍靠人工截图
- ❌ 一份 control 写多次没复用

## 分级掌握

- **Junior**: 能写简单 OPA 策略与单测
- **Mid**: 能集成 admission / cloud scan / evidence pipeline
- **Senior**: 能把 compliance-as-code 推到组织级，并对齐多个框架

## 参考资源

- [Open Policy Agent](https://www.openpolicyagent.org/docs/) — doc
- [Kyverno](https://kyverno.io/docs/) — doc
- [Cloud Custodian](https://cloudcustodian.io/) — doc

## 相关 Skills
_见所属 composite skill 或 role_