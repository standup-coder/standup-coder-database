---
id: security-scan
type: atomic-skill
title: Security Scan
nameZh: 安全扫描
domain: security
tags: security, scan, sast, sca, devsecops
catalogSource: internal
catalogFile: atomic-skills/security-scan.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 安全扫描
> 运行综合安全扫描（SAST / SCA / 容器 / IaC / secret）并合并 finding。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `target` (string, **必填**)
- `types` (array, 可选)
## 输出
- `findings` (array, 可选)
- `deduped` (array, 可选)
- `riskScore` (number, 可选)
## 核心要点

多类扫描的最大成本不是跑工具，而是去重与分诊；不去重的 finding 列表会让开发疲劳到放弃。

## 关键要点

- SAST 看代码 / SCA 看依赖 / IaC 看配置 / secret 看泄漏 / DAST 看运行时
- 工具结果合并到 SARIF
- CVE + reachability + KEV 三维分诊
- severity threshold 渐进收紧
- 把 finding 接 ticket + SLA

## 最佳实践

- 统一 normalizer（DefectDojo / Faraday）
- PR / merge / nightly 三档扫描节奏
- 高严重度自动建 ticket
- baseline 留住已知 false positive

## 反模式

- ❌ 每工具独立看不去重
- ❌ severity 全 critical 引发疲劳
- ❌ 扫描完不接修复流程
- ❌ 不区分 reachable vs not

## 分级掌握

- **Junior**: 能跑单类扫描
- **Mid**: 能合并多类 + 分诊 + ticket 流
- **Senior**: 能驱动组织级 security scan 平台与 SLA 治理

## 参考资源

- [OWASP DevSecOps](https://owasp.org/www-project-devsecops-guideline/) — doc
- [DefectDojo](https://www.defectdojo.org/) — doc
- [SARIF Spec](https://sarifweb.azurewebsites.net/) — spec

## 相关 Skills
_见所属 composite skill 或 role_