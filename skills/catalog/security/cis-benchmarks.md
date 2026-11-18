---
id: cis-benchmarks
type: atomic-skill
title: CIS Benchmarks
nameZh: CIS 基线
domain: security
tags: security, cis, benchmark, hardening, compliance
catalogSource: internal
catalogFile: atomic-skills/cis-benchmarks.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# CIS 基线
> 应用 CIS 基线对操作系统 / 云 / K8s 做 baseline 加固。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `target` (string, **必填**)
- `profile` (string, 可选) 取值: level-1/level-2
- `tool` (string, 可选) 取值: cis-cat/lynis/kube-bench/inspec/docker-bench
## 输出
- `passed` (array, 可选)
- `failed` (array, 可选)
- `score` (number, 可选)
- `remediation` (array, 可选)
## 核心要点

CIS Benchmarks 是一套被广泛接受的基线"最大公约数"；不要全照搬，按业务环境裁剪 Level 1 / Level 2，并把它落到 IaC 而非手册。

## 关键要点

- Level 1（基础）vs Level 2（深度）
- 把 benchmark 转 IaC 模板可复用
- kube-bench / docker-bench / lynis 自动化
- 裁剪要保留可追溯的 rationale
- 与 SOC2 / ISO / PCI 控制点映射

## 最佳实践

- 周期性扫描入 CI/CD
- 失败项必须有 owner + due date
- IaC 修复优先于手动 patch
- 把裁剪决策写入安全 runbook

## 反模式

- ❌ Level 2 一刀切引发业务故障
- ❌ 一次性扫描无后续治理
- ❌ 把 benchmark 当合规终点而非起点
- ❌ 不裁剪导致 false positive 淹没

## 分级掌握

- **Junior**: 能运行 kube-bench / lynis 并解读结果
- **Mid**: 能裁剪 baseline 并 IaC 化
- **Senior**: 能驱动组织级 baseline 治理与多框架映射

## 参考资源

- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks) — doc
- [kube-bench](https://github.com/aquasecurity/kube-bench) — doc
- [Lynis](https://cisofy.com/lynis/) — doc

## 相关 Skills
_见所属 composite skill 或 role_