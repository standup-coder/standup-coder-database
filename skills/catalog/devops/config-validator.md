---
id: config-validator
type: atomic-skill
title: Config Validator
nameZh: 配置校验
domain: devops
tags: ops, config, validation, schema, lint
catalogSource: internal
catalogFile: atomic-skills/config-validator.json
catalogAddedAt: 2026-07-26
operation: ops
level: junior
---

# 配置校验
> 基于 schema 与策略校验配置文件（YAML / JSON / TOML / env）。
## 操作语义
- 类型: ops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `file` (string, **必填**)
- `schema` (string, 可选)
- `strict` (boolean, 可选) 默认: `true`
## 输出
- `valid` (boolean, 可选)
- `errors` (array, 可选)
- `warnings` (array, 可选)
## 核心要点

配置错误是生产事故 Top3，但成本最低的拦截点是 PR 阶段的 schema 校验；写一次 schema 长期受益。

## 关键要点

- JSON Schema / Cue / Pkl 都可用
- pre-commit + CI 双层校验
- env 配置走 typed config 库
- 业务约束做自定义 validator
- 区分 syntax / semantic 两类错误

## 最佳实践

- 用 Ajv / yamale / cue vet 做 lint
- schema 与代码同 repo 版本化
- config 失败要 fail-fast
- 错误信息附 fix snippet

## 反模式

- ❌ 运行时才发现 typo
- ❌ schema 写完不更新
- ❌ 靠注释约束代替 schema
- ❌ config 散落多处难校验

## 分级掌握

- **Junior**: 能写 JSON Schema 校验 config
- **Mid**: 能 PR-time + runtime 双层校验
- **Senior**: 能驱动组织级 config 治理与 schema-first 文化

## 参考资源

- [JSON Schema](https://json-schema.org/) — doc
- [Cue](https://cuelang.org/docs/) — doc
- [Pkl](https://pkl-lang.org/) — doc

## 相关 Skills
_见所属 composite skill 或 role_