---
id: vpc-security-groups
type: atomic-skill
title: VPC & Security Groups
nameZh: VPC 与安全组
domain: security
tags: security, vpc, security-group, network, segmentation
catalogSource: internal
catalogFile: atomic-skills/vpc-security-groups.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# VPC 与安全组
> 设计 VPC 拓扑与安全组规则，强制网络分段与最小信任。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `vpc` (string, **必填**)
- `tier` (string, 可选) 取值: public/app/data
## 输出
- `subnetMap` (object, 可选)
- `sgRules` (array, 可选)
- `nacl` (array, 可选)
## 核心要点

安全组是 stateful，NACL 是 stateless，分清楚再设计；不要试图用安全组实现复杂网络策略，那是 NetworkPolicy / firewall 的活。

## 关键要点

- SG = stateful，NACL = stateless
- public / app / data 三层分段
- SG reference SG > IP allow list
- 默认 deny + 最小放行
- 跨 VPC 走 PrivateLink / Transit Gateway

## 最佳实践

- SG 名称约定 service-tier-direction
- IaC 管理 SG 不手工改
- 定期审 unused SG 删除
- 高危端口（22/3389）走 bastion / SSM

## 反模式

- ❌ 0.0.0.0/0 + 22/3389 直暴露
- ❌ app tier 直连 internet
- ❌ 一个 SG 复用多服务
- ❌ NACL 当 stateful 用配错

## 分级掌握

- **Junior**: 能写基础 SG / NACL
- **Mid**: 能设计三层分段 + IaC 管理
- **Senior**: 能驱动组织级 landing zone 网络架构

## 参考资源

- [AWS VPC Best Practices](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-best-practices.html) — doc
- [AWS Security Groups vs NACLs](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html) — doc
- [AWS Network Firewall](https://docs.aws.amazon.com/network-firewall/) — doc

## 相关 Skills
_见所属 composite skill 或 role_