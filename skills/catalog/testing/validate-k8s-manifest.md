---
id: validate-k8s-manifest
type: atomic-skill
title: Validate Kubernetes Manifest
nameZh: 校验 K8s 清单
domain: testing
tags: kubernetes, validation, yaml, ops
catalogSource: internal
catalogFile: atomic-skills/validate-k8s-manifest.json
catalogAddedAt: 2026-07-26
operation: validation
level: junior
---

# 校验 K8s 清单
> 使用 kubeval 或 kubectl 校验 Kubernetes YAML 清单
## 操作语义
- 类型: validation
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `manifestPath` (string, 可选) — YAML 文件路径
- `manifestContent` (string, 可选) — YAML 内容（与路径二选一）
- `strict` (boolean, 可选) — 是否启用严格模式 默认: `true`
## 输出
- `valid` (boolean, **必填**) — 是否通过校验
- `errors` (array, **必填**) — 错误信息列表
- `warnings` (array, **必填**) — 警告信息列表
## 核心要点

K8s manifest 校验是阻止"上线即事故"的最后一道闸：schema / 策略 / 安全三层都要过。

## 关键要点

- schema 校验（kubeval / kubeconform）确保字段合法
- 策略校验（OPA / Kyverno）确保符合组织规则
- 安全校验（kube-linter / Polaris）防 privileged / 无 limits
- 配置校验（kustomize build）确保 overlay 渲染正确
- CI 中失败即阻断，不发布破坏性 manifest

## 最佳实践

- 把 kubeconform + kyverno + kube-linter 放进 pre-commit
- 为不同环境维护 policy bundle（dev / stg / prod 严苛度递增）
- mutating policy 自动注入 limits / probes，减少人为失误
- 与 GitOps 联动：违反策略的 PR 自动 block
- 校验报告附文件 + 行号 + 修复建议，便于研发修复

## 反模式

- ❌ 只跑 kubectl apply --dry-run=client，错过策略层问题
- ❌ CI 校验失败但不阻断，问题滚到生产
- ❌ 所有环境共享同一套策略，导致 dev 限制过死或 prod 太松
- ❌ 每次新建集群手写 manifest，无 schema check
- ❌ 安全策略只测试不强制，开发绕过即可

## 分级掌握

- **Junior**: 能用 kubeconform 跑 schema 校验，看懂常见报错
- **Mid**: 能编写 Kyverno / OPA 策略，整合到 CI
- **Senior**: 能为平台设计多环境策略体系，覆盖 schema / 策略 / 安全 / GitOps 闭环

## 参考资源

- [kubeconform](https://github.com/yannh/kubeconform) — doc
- [Kyverno](https://kyverno.io/docs/) — doc
- [kube-linter](https://docs.kubelinter.io/) — doc

## 相关 Skills
_见所属 composite skill 或 role_