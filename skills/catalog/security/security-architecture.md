---
id: security-architecture
type: atomic-skill
title: Security Architecture
nameZh: 安全架构
domain: security
tags: security, threat-modeling, zero-trust, compliance, defense-in-depth
catalogSource: internal
catalogFile: atomic-skills/security-architecture.json
catalogAddedAt: 2026-07-26
operation: security
level: senior
---

# 安全架构
> 设计覆盖身份、数据保护、网络与威胁建模的安全架构，落地纵深防御与合规要求。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `system` (string, **必填**) — 目标系统描述
- `assets` (array, **必填**) — 需保护的资产
- `threats` (array, 可选)
- `compliance` (array, 可选)
## 输出
- `threatModel` (string, 可选) — STRIDE / PASTA 威胁模型
- `controls` (array, 可选)
- `trustBoundaries` (string, 可选)
- `dataFlowDiagram` (string, 可选)
- `complianceMapping` (object, 可选)
## 核心要点

安全架构的目的不是杜绝风险，而是把风险降到业务可接受范围内，并能被审计。

## 关键要点

- 纵深防御：单点失守不应导致整体失守，至少两层独立控制
- 最小权限 + 默认拒绝：所有访问默认 deny，按需 allow
- 零信任：never trust, always verify — 不依赖网络位置判断信任
- 数据分级：公开 / 内部 / 机密 / 极密，对应不同保护强度
- 威胁建模：STRIDE 系统化识别 Spoofing/Tampering/Repudiation/Info disclosure/DoS/Elevation
- 密钥/凭证：永远不入库、不入日志，使用 KMS / Vault 集中管理
- 可审计：所有敏感操作必须有不可篡改的审计日志

## 最佳实践

- 在设计阶段做 Threat Modeling 评审，不要等上线再补
- 把安全控制写成代码（Policy as Code，OPA/Cedar），可测试可版本化
- 数据全程加密：传输 TLS 1.3+、存储 AES-256，敏感字段额外字段级加密
- 使用 SBOM + 依赖扫描（Snyk/Trivy/Dependabot）防供应链攻击
- 定期红蓝对抗 + 桌面演练，验证响应流程

## 反模式

- ❌ 把安全当合规打勾，仅做表面控制
- ❌ VPN = 安全：登入即获完全信任，违反零信任
- ❌ 硬编码 API key 在代码里、commit 到 Git
- ❌ 日志记录敏感字段（密码 / token / 身份证）
- ❌ 权限设计过度复杂，最终全员 admin

## 分级掌握

- **Junior**: 了解 OWASP Top 10，能在引导下加入基础控制（输入校验、鉴权、加密）
- **Mid**: 能独立完成系统的威胁建模、控制设计与合规映射
- **Senior**: 能主导组织级安全架构、零信任演进与红蓝对抗体系建设

## 参考资源

- [Threat Modeling: Designing for Security (Adam Shostack)](https://shostack.org/books/threat-modeling-book) — book
- [OWASP Top 10 / ASVS](https://owasp.org/www-project-top-ten/) — doc
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) — doc
- [Google BeyondCorp](https://cloud.google.com/beyondcorp) — article
- [Microsoft STRIDE Threat Model](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats) — doc

## 相关 Skills
_见所属 composite skill 或 role_