---
id: zero-trust-cloud
type: atomic-skill
title: Zero Trust Cloud
nameZh: 零信任云
domain: security
tags: security, zero-trust, cloud, identity, micro-segmentation
catalogSource: internal
catalogFile: atomic-skills/zero-trust-cloud.json
catalogAddedAt: 2026-07-26
operation: security
level: senior
---

# 零信任云
> 在云端实施零信任架构：身份感知代理 / 微分段 / 持续验证。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `scope` (string, **必填**)
- `pillar` (string, 可选) 取值: identity/device/network/application/data
## 输出
- `architecture` (object, 可选)
- `policies` (array, 可选)
- `gaps` (array, 可选)
## 核心要点

零信任不是产品，是"never trust, always verify"的实施路线；先收身份与网络，再收设备与数据，最后是应用。

## 关键要点

- 身份是新边界（identity-first）
- BeyondCorp / NIST SP 800-207 是标准
- IAP（Identity-Aware Proxy）替代 VPN
- micro-segmentation 替代扁平网络
- 持续验证 > 一次认证

## 最佳实践

- SSO + MFA + 设备状态绑定
- IAP 灰度替换 VPN
- 应用层做 mTLS + service mesh
- 日志统一到 SIEM 做 continuous verification

## 反模式

- ❌ VPN 一通就是 flat 网络
- ❌ 设备状态不进 trust 决策
- ❌ mTLS 只在新服务，旧服务豁免
- ❌ 一次认证终身有效

## 分级掌握

- **Junior**: 能解释 zero trust 五支柱
- **Mid**: 能落地 IAP + MFA + 微分段
- **Senior**: 能驱动组织级 zero trust 战略与多年路线图

## 参考资源

- [NIST SP 800-207](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-207.pdf) — doc
- [BeyondCorp](https://cloud.google.com/beyondcorp) — doc
- [Cloudflare Zero Trust](https://www.cloudflare.com/zero-trust/) — doc

## 相关 Skills
_见所属 composite skill 或 role_