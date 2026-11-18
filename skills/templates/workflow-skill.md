---
# === 必填字段 ===
id: kebab-case-skill-id
type: composite-skill
title: Skill English Title
nameZh: 技能中文名
domain: frontend | backend | ...
domainLabel: 领域
tags: [tag1, tag2]

# === 来源 ===
catalogSource: internal
catalogFile: skills/<id>.json
catalogAddedAt: 2026-07-26

# === 工作流特有 ===
workflow:
  - step: 1
    name: step name
    action: 一句话说明
    inputs: [...]
    outputs: [...]
  - step: 2
    name: ...
    action: ...

# === 可选 ===
errorHandling: stop | continue | fallback
author: skills-database-team
status: mature
relatedSkills: [other-id, ...]
---

# 技能中文名

> 一句话概述:这个技能解决什么问题。

## 何时使用

- 场景 1
- 场景 2

## 何时不使用

- 反例 1

## 工作流

```
[输入]
   ↓
步骤 1: 名称
   ↓
步骤 2: 名称
   ↓
[输出]
```

### 步骤 1: 名称

做什么、输入是什么、产出什么。

### 步骤 2: 名称

做什么、输入是什么、产出什么。

## 输入

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| field1 | string | 是 | 描述 |
| field2 | object | 否 | 描述 |

## 输出

| 字段 | 类型 | 说明 |
|------|------|------|
| field1 | string | 描述 |

## 错误处理

策略: `stop | continue | fallback`

- 错误 A → 怎么办
- 错误 B → 怎么办

## 学习要点

- 要点 1
- 要点 2

## 最佳实践

- 实践 1
- 实践 2

## 反模式

- ❌ 不要 X
- ❌ 不要 Y

## 相关 Skills

- [other-id](../<domain>/<id>.md)