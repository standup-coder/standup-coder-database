---
id: cloud-firewall-waf
type: atomic-skill
title: Cloud Firewall & WAF
nameZh: 云防火墙与 WAF
domain: security
tags: security, waf, firewall, ddos, l7
catalogSource: internal
catalogFile: atomic-skills/cloud-firewall-waf.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 云防火墙与 WAF
> 运营云防火墙与 WAF，过滤 L3/L4/L7 攻击，调优规则与速率限制。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `target` (string, **必填**)
- `provider` (string, 可选) 取值: aws-waf/cloudflare/azure-frontdoor/gcp-armor
- `ruleset` (string, 可选) 取值: owasp-crs/managed/custom
## 输出
- `rules` (array, 可选)
- `blockedSamples` (array, 可选)
- `falsePositives` (array, 可选)
## 核心要点

WAF 规则不是装上就完事，是要调出业务可用的"误杀率 / 漏杀率"平衡；OWASP CRS 默认规则上线前必须 staging。

## 关键要点

- count mode → block mode 渐进
- rate limit 看每身份维度（IP / token / user）
- managed rules + custom rules 组合
- WAF + CDN + L4 firewall 分层
- log 入 SIEM 做长期分析

## 最佳实践

- CRS 部署先开 paranoia=1 观察 2 周
- bot management 单独规则集
- 紧急 rule 走 hot-fix workflow
- 定期审 false positive 调整 exception

## 反模式

- ❌ 一上来 paranoia=4 直接 block
- ❌ 不区分登录 / 注册 / API 端点的 rate limit
- ❌ WAF block 但没 log 到 SIEM
- ❌ managed rule 从不 review

## 分级掌握

- **Junior**: 能配置基础 WAF 规则
- **Mid**: 能调优 false positive 与 rate limit
- **Senior**: 能驱动组织级 WAF 战略与 bot 管控

## 参考资源

- [OWASP CRS](https://coreruleset.org/) — doc
- [AWS WAF](https://docs.aws.amazon.com/waf/) — doc
- [Cloudflare WAF](https://developers.cloudflare.com/waf/) — doc

## 相关 Skills
_见所属 composite skill 或 role_