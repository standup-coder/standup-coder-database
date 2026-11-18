---
id: cloudflare-manager
type: atomic-skill
title: Cloudflare Manager
nameZh: Cloudflare 管理
domain: devops
tags: cdn, cloudflare, edge, waf, dns
catalogSource: internal
catalogFile: atomic-skills/cloudflare-manager.json
catalogAddedAt: 2026-07-26
operation: devops
level: mid
---

# Cloudflare 管理
> 管理 Cloudflare 上的 DNS / CDN / WAF / Workers / Zero Trust，交付快速安全韧性的边缘应用。
## 操作语义
- 类型: devops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `zone` (string, **必填**)
- `feature` (any, 可选) 取值: dns/cdn/waf/workers/zero-trust/pages
## 输出
- `config` (object, 可选)
- `ruleId` (string, 可选)
## 核心要点

Cloudflare 把网络栈搬到边缘，运维只需专注规则；但规则一爆，全球流量同时受影响。

## 关键要点

- DNS / CDN / WAF / Workers 是同一个控制面
- WAF 必须先 log only 跑一周再 enforce
- Cache Rules / Page Rules 优先级互通
- Workers 适合 A/B / 鉴权 / 重写，不适合长任务
- Zero Trust 替代 VPN 是趋势

## 最佳实践

- Terraform Provider 管理配置
- 规则变更分 staging zone
- 关键域名启 DNSSEC / Always Use HTTPS / HSTS
- Cloudflare Tunnel 替代公网暴露

## 反模式

- ❌ 直接在 Dashboard 改规则不入 git
- ❌ WAF 全开 enforce 误杀业务
- ❌ 同一个 API token 给所有团队
- ❌ Workers 写复杂业务逻辑无回滚

## 分级掌握

- **Junior**: 能配 DNS / 基础 cache rule
- **Mid**: 能写 Workers / WAF / IaC 化
- **Senior**: 能设计跨账号 Cloudflare 治理与边缘架构

## 参考资源

- [Cloudflare Docs](https://developers.cloudflare.com/) — doc
- [Terraform Cloudflare provider](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs) — doc

## 相关 Skills
_见所属 composite skill 或 role_