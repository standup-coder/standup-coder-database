---
id: tencent-cloud-lighthouse
type: atomic-skill
title: Tencent Cloud Lighthouse
nameZh: 腾讯云轻量应用服务器
domain: devops
tags: cloud, tencent, lighthouse, iaas, lightweight
catalogSource: internal
catalogFile: atomic-skills/tencent-cloud-lighthouse.json
catalogAddedAt: 2026-07-26
operation: ops
level: mid
---

# 腾讯云轻量应用服务器
> 为中小业务与原型场景开通并运营腾讯云轻量应用服务器。
## 操作语义
- 类型: ops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `region` (string, **必填**)
- `bundle` (string, 可选)
- `image` (string, 可选) 取值: ubuntu/centos/debian/wordpress/docker
## 输出
- `instanceId` (string, 可选)
- `publicIp` (string, 可选)
- `snapshot` (object, 可选)
## 核心要点

Lighthouse 是腾讯云的"轻量套餐机"，便宜上手快，但弹性 / 安全组 / IAM 比 CVM 弱；适合个人站、原型，不适合生产关键链路。

## 关键要点

- 套餐式计费（不可拆分）
- 内置防火墙 ≠ 完整 SG
- 可平滑升级到 CVM
- 快照与回滚是基本能力
- 海外节点流量套餐有限

## 最佳实践

- 首次开通走 image 模板减少手动安装
- 快照 + 备份双保险
- 与 COS / CDN 配套用降成本
- sshd / fail2ban 必装

## 反模式

- ❌ 当生产 K8s / 高可用使用
- ❌ 不开快照直接升级被坑
- ❌ 把同一套餐多业务挤一台
- ❌ 默认密码不改

## 分级掌握

- **Junior**: 能开通 + SSH 部署应用
- **Mid**: 能落地快照备份 + 自动化部署
- **Senior**: 能驱动多区域 + 套餐选型策略

## 参考资源

- [腾讯云 Lighthouse 文档](https://cloud.tencent.com/document/product/1207) — doc
- [Lighthouse vs CVM](https://cloud.tencent.com/document/product/1207/45449) — doc
- [腾讯云控制台](https://console.cloud.tencent.com/lighthouse) — doc

## 相关 Skills
_见所属 composite skill 或 role_