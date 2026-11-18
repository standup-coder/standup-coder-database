---
id: container-image-scanning
type: atomic-skill
title: Container Image Scanning
nameZh: 容器镜像扫描
domain: security
tags: security, container, scanning, sbom, devsecops
catalogSource: internal
catalogFile: atomic-skills/container-image-scanning.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 容器镜像扫描
> 在 CI 与镜像仓库阶段扫描容器镜像的漏洞 / 凭据 / license / 策略风险。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `image` (string, **必填**)
- `scanner` (any, 可选) 取值: trivy/grype/snyk/docker-scout 默认: `"trivy"`
- `severityThreshold` (any, 可选) 取值: LOW/MEDIUM/HIGH/CRITICAL 默认: `"HIGH"`
## 输出
- `vulnerabilities` (array, 可选)
- `sbom` (object, 可选)
- `blocked` (boolean, 可选)
## 核心要点

镜像扫描的价值不在"扫到了"而在"能不能阻断"——CI 不阻断的扫描等于没做。

## 关键要点

- shift-left：构建期扫 + registry 扫 + runtime 扫三道
- SBOM（CycloneDX / SPDX）是合规基线
- 优先级：Critical 立即阻断，High 7 天 fix
- base image 是最大风险源，固定 + 定期升级
- secrets in image 与 vuln 同样致命

## 最佳实践

- Trivy / Grype 接入 GH Actions / GitLab CI
- image signing（cosign）+ verification
- 建立 vulnerability triage 流程与 SLA
- 与 SBOM 仓库（Dependency-Track）联动

## 反模式

- ❌ 只扫不阻断，报告石沉海底
- ❌ allow-list 漏洞太宽
- ❌ 只扫 application layer 不扫 base
- ❌ CVE 修复用"换 base 但不测试"

## 分级掌握

- **Junior**: 能跑 trivy scan 并读懂报告
- **Mid**: 能集成 CI 阻断 + SBOM + signing
- **Senior**: 能制定组织级镜像供应链安全策略与合规对齐

## 参考资源

- [Trivy](https://aquasecurity.github.io/trivy/) — doc
- [cosign](https://docs.sigstore.dev/cosign/overview/) — doc
- [CycloneDX](https://cyclonedx.org/) — doc

## 相关 Skills
_见所属 composite skill 或 role_