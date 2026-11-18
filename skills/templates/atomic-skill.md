---
# === 必填字段 ===
id: kebab-case-atomic-id
type: atomic-skill
title: Atomic Skill English Title
nameZh: 原子技能中文名
domain: frontend | backend | ...
domainLabel: 领域
level: junior | mid | senior
tags: [tag1, tag2]

# === 来源 ===
catalogSource: internal
catalogFile: atomic-skills/<id>.json
catalogAddedAt: 2026-07-26

# === 操作特定 ===
operation: read | write | execute | analyze | transform | query | monitor
tools: [tool-name, ...]    # 映射到的工具/MCP

# === 可选 ===
constraints: ["约束 1", "约束 2"]
errors:
  - code: E001
    name: error name
    message: 错误描述
author: skills-database-team
status: mature
relatedSkills: [other-id, ...]

# === 学习字段(可选,推荐) ===
learning:
  summaryZh: 一句话核心要点
  keyPoints:
    - 要点 1
    - 要点 2
  bestPractices:
    - 实践 1
    - 实践 2
  antiPatterns:
    - 反模式 1
    - 反模式 2
  resources:
    - title: 资源名
      url: https://...
      type: book | doc | video
  maturityLevels:
    junior: 入门水平
    mid: 中级水平
    senior: 资深水平
---

# 原子技能中文名

> 一句话概述:这个原子技能做什么。

## 操作语义

- 类型: read / write / execute / ...
- 映射工具: tool1, tool2

## 何时使用

- 场景 1
- 场景 2

## 何时不使用

- 反例 1

## 输入参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
|------|------|------|------|------|
| param1 | string | 是 | - | 描述 |
| param2 | number | 否 | 10 | 描述 |

## 输出

| 字段 | 类型 | 说明 |
|------|------|------|
| result | any | 描述 |

## 约束

- 约束 1
- 约束 2

## 错误码

| Code | 名称 | 含义 | 处理 |
|------|------|------|------|
| E001 | name | 含义 | 怎么办 |

## 核心要点

- 要点 1
- 要点 2
- 要点 3

## 最佳实践

- 实践 1
- 实践 2

## 反模式

- ❌ 反模式 1
- ❌ 反模式 2

## 分级掌握

- **Junior**: 能正确调用,理解基本参数
- **Mid**: 能处理边界情况与常见错误
- **Senior**: 能组合其他 skills,优化性能与可靠性

## 相关 Skills

- [other-id](../<domain>/<id>.md)