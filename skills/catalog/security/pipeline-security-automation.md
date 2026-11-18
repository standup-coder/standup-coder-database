---
id: pipeline-security-automation
type: atomic-skill
title: Pipeline Security Automation
nameZh: 流水线安全自动化
domain: security
tags: security, devsecops, cicd, shift-left, pipeline
catalogSource: internal
catalogFile: atomic-skills/pipeline-security-automation.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 流水线安全自动化
> 在 CI/CD pipeline 中自动化安全检查：SAST / SCA / IaC 扫描 / secret 检测 / 镜像签名。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `pipeline` (string, **必填**)
- `stages` (array, 可选)
## 输出
- `gates` (array, 可选)
- `findings` (object, 可选)
- `signedArtifacts` (array, 可选)
## 核心要点

DevSecOps 的本质是"安全检查与构建并轨"；速度与安全只能靠工具自动化解决，不能靠纪律。

## 关键要点

- shift-left 多层（pre-commit / PR / merge / build）
- gate 分 advisory vs blocking
- severity 阈值 + KEV 名单 release gate
- SBOM + signing（Cosign / SLSA）
- 把误报治理也自动化

## 最佳实践

- pre-commit hook 跑 secret + lint
- PR 跑 SAST + IaC + SCA
- release 必须 signed + provenance
- 失败 gate 必须有 escalation 流程

## 反模式

- ❌ gate 太严直接 disable
- ❌ 一切 advisory 永远不 block
- ❌ 安全工具结果不接 ticket 流
- ❌ 只扫 main 不扫 PR

## 分级掌握

- **Junior**: 能在 CI 接入单类安全扫描
- **Mid**: 能搭多层 gate + signing + provenance
- **Senior**: 能驱动组织级 DevSecOps 战略与 supply chain 治理

## 参考资源

- [OWASP DevSecOps](https://owasp.org/www-project-devsecops-guideline/) — doc
- [SLSA Framework](https://slsa.dev/) — doc
- [Sigstore Cosign](https://docs.sigstore.dev/cosign/) — doc

## 相关 Skills
_见所属 composite skill 或 role_