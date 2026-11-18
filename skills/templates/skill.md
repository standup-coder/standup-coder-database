---
# === 必填字段 ===
id: kebab-case-id
type: role | composite-skill | atomic-skill | external
title: English Title
nameZh: 中文名

# === 分类 ===
domain: frontend | backend | mobile | ai-ml | data | devops | security | testing | design | product | marketing | docs | productivity | tools | uncategorized
domainLabel: 人类可读的领域名
level: junior | mid | senior | lead      # role/atomic 用
tags: [tag1, tag2]

# === 来源 ===
catalogSource: anthropic | mcpmarket | skills-sh | qoder | voltagent | internal
catalogFile: 原文件名(用于 sources/ 反查)
catalogAddedAt: 2026-07-26

# === 可选 ===
maturity: 0-100
status: draft | reviewed | mature | deprecated
relatedSkills: [other-skill-id, ...]
duplicateOf: canonical-skill-id   # 本条是其它 skill 的跨源转载时,指向 canonical 版本的 id
---

# 中文标题

> 一句话定义:这个 skill 是什么、解决什么问题、学完后能做什么(教材式,不是索引卡)。

## 这个技能解决什么问题

说明学习者会遇到什么痛点,以及学完本技能后能达成的能力(用"你能..."句式列 3-5 条,可度量)。

## 前置知识

按依赖顺序列出应先掌握的技能(带仓库内相对链接),并说明如果从零开始怎么走。没有前置则写"无"。

## 核心概念

把本技能拆成 3-6 个概念,按"理解 → 应用"排序。每个概念:
- 是什么(定义 + 为什么重要)
- 怎么用(关键做法、参数、判断标准)
- 适用/不适用(必要时用对比表格)

## 学习路径

按周/阶段拆分(如 阶段一地基 → 阶段二工程化 → 阶段三自动化),每阶段:
- 目标:一句话
- 要掌握什么(bullet)
- **验收标准**:可勾选 checkbox 列表,达标才进入下一阶段

### 阶段一:xxx

**目标**:...

- 掌握 ...

**验收标准**:

- [ ] 可验证的产出 1
- [ ] 可验证的产出 2

## 分步实操

一条完整的、可照做的操作流程(步骤图 + 每步说明)。顺序:**先建评估/验收基准,再动手**。每步给出输入输出。

## 示例

2-3 个完整示例,覆盖核心场景。可运行代码优先。每个示例末尾加"**要点**"说明设计决策。

### 示例 1:xxx

```python
# 完整可运行
```

**要点**:...

## 练习

按阶段分组、可勾选。每项有明确产出,建议产出放入 `personal/` 留档:

### 基础练习

- [ ] P1-x 练习名:动作 + 产出 + 判定标准

### 进阶练习

- [ ] P2-x ...

### 挑战练习

- [ ] P3-x ...

## 自测题

5-10 道题,先独立作答再对照答案。答案折叠在 `<details>` 里。题目要能检验"是否真学会"而非记忆。

## 常见错误与反模式

- ❌ 错误做法——正确做法/后果

## 参考资源

- [名称](url) — 类型(论文/文档/工具/书),一句话说明用途

## 相关 Skills

- [skill-id](../<domain>/<id>.md) — 关系(前置/进阶/落地场景)