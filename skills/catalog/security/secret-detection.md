---
id: secret-detection
type: atomic-skill
title: Secret Detection
nameZh: 密钥泄漏检测
domain: security
tags: security, secrets, detection, pre-commit, devsecops
catalogSource: internal
catalogFile: atomic-skills/secret-detection.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 密钥泄漏检测
> 在代码 / git 历史 / 日志 / CI 产物中检测并治理泄漏密钥。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `repo` (string, **必填**)
- `tool` (string, 可选) 取值: gitleaks/trufflehog/detect-secrets/github-secret-scan
- `scanHistory` (boolean, 可选) 默认: `true`
## 输出
- `findings` (array, 可选)
- `falsePositives` (array, 可选)
- `remediation` (array, 可选)
## 核心要点

检测到 secret 不是任务的终点，是起点；rotate + audit 才是真正的修复。删 commit 不能挽回已泄漏。

## 关键要点

- pre-commit + CI + history 三层扫描
- rotate > rewrite history
- allowlist 必须有 expiry 注释
- 区分高熵 false positive 与真 secret
- 与 IdP / KMS 联动一键吊销

## 最佳实践

- gitleaks pre-commit hook 默认开
- GitHub Push Protection 一定开
- detect 后立即 rotate + audit upstream
- 把 finding 接 ticket + SLA

## 反模式

- ❌ 只删 commit 不 rotate
- ❌ 把 secret rewrite history 当修复
- ❌ allowlist 永久放行
- ❌ 只扫 main 不扫 feature 分支

## 分级掌握

- **Junior**: 能跑 gitleaks 并修复单条
- **Mid**: 能搭三层扫描 + rotate workflow
- **Senior**: 能驱动组织级 secret 治理与零容忍文化

## 参考资源

- [gitleaks](https://github.com/gitleaks/gitleaks) — doc
- [TruffleHog](https://github.com/trufflesecurity/trufflehog) — doc
- [GitHub Push Protection](https://docs.github.com/en/code-security/secret-scanning/push-protection-for-repositories-and-organizations) — doc

## 相关 Skills
_见所属 composite skill 或 role_