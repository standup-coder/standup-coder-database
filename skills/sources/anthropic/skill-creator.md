---
source: anthropic-skills
sourceUrl: https://github.com/anthropics/skills/tree/main/skills/skill-creator
title: skill-creator
name: skill-creator
nameZh: Skill 创建器（skill-creator）
category: 开发与元工具（example-skills 插件）
tags: [skill, creation, eval, benchmark, description-optimization, meta]
rank: 5
plugin: example-skills
license: Apache 2.0
hasReferences: true
references: [references/schemas.md, agents/analyzer.md, agents/comparator.md, agents/grader.md, assets/eval_review.html, eval-viewer/generate_review.py, eval-viewer/viewer.html, scripts/aggregate_benchmark.py, scripts/generate_report.py, scripts/improve_description.py, scripts/package_skill.py, scripts/quick_validate.py, scripts/run_eval.py, scripts/run_loop.py, scripts/utils.py]
---

# skill-creator

> Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, edit, or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy.

## 概述

`skill-creator` 是用来"造 skill 的 skill"——元工具。它把创建、改进、评测 skill 的整套流程打包：起草 SKILL.md → 写测试用例 → 跑 eval → 用 viewer 看结果 → 据反馈迭代 → 用 description 优化器调触发准确率。整套循环可重复，直到满意，并能扩测试集、上规模再跑。

## 使用场景

- 用户想从头创建一个 skill。
- 编辑 / 优化既有 skill。
- 跑 eval 测试 skill 是否好用，或做带方差分析的基准测试。
- 优化 skill 的 description 字段，让它在该触发时触发、不该触发时不触发。

## 能力说明

### 创建 skill 的总流程

- 决定 skill 要做什么、大致怎么做。
- 写草稿。
- 写几个测试 prompt，带着 skill 跑（claude-with-access-to-the-skill）。
- 帮用户定性与定量评估：
  - 后台跑的同时，如果没有现成定量 eval 就起草一些（有就按原样或按需修改），然后讲给用户听。
  - 用 `eval-viewer/generate_review.py` 把结果展示给用户看，也让他们看定量指标。
- 据用户评估反馈（以及定量基准暴露的明显缺陷）改写 skill。
- 重复直到满意。
- 扩大测试集，更大规模再跑一遍。

### 与用户沟通

skill creator 的用户编码熟练度跨度很大——从被 Claude 启发的 plumber 到 npm 老手。请关注上下文线索，默认按这种粒度措辞：

- "evaluation" 和 "benchmark" 算边界词但可用。
- "JSON" 和 "assertion" 在用之前要先看到用户确实懂这些的线索。

不确定时简短解释术语没问题。

### 创建 skill — 步骤

**1. Capture Intent**

从对话历史里先抽取信息（用户说"把这个变成 skill"时，工具序列、步骤、纠正、I/O 格式都在历史里）。然后澄清：

1. 这个 skill 要让 Claude 做什么？
2. 什么时候触发？（用户短语/上下文）
3. 期望输出格式？
4. 要不要搭测试用例？输出可客观验证的 skill（文件变换、数据提取、代码生成、固定流程）受益；输出主观的（写作风格、艺术）通常不需要。按类型给默认建议，但让用户定。

**2. Interview and Research**

主动问边界情况、I/O 格式、示例文件、成功标准、依赖。把这些理清之前不要写测试 prompt。可检查可用 MCP 做研究；有 subagent 就并行研究，否则内联。带着上下文来，减少用户负担。

**3. Write the SKILL.md**

按访谈结果填写各组件（frontmatter、描述、主体说明、示例、边界等）。

### 评测与迭代

- 用 `scripts/run_eval.py` / `scripts/run_loop.py` 在测试集上跑 skill。
- `scripts/aggregate_benchmark.py` 做带方差分析的基准测试。
- `eval-viewer/generate_review.py` 生成可视化结果。
- `scripts/improve_description.py` 优化 description 字段以提升触发准确率。
- `scripts/quick_validate.py` 快速校验 skill 结构。
- `scripts/package_skill.py` 打包 skill。
- `scripts/generate_report.py` 生成报告。

### 子代理

`agents/` 下有三个子代理，分别用于分析、对比、打分：

- `analyzer.md` — 分析 skill。
- `comparator.md` — 对比多个版本。
- `grader.md` — 打分。

## 参考资源

- `references/schemas.md` — skill 结构 schema
- `agents/analyzer.md`, `agents/comparator.md`, `agents/grader.md` — 子代理
- `assets/eval_review.html` — 评估评审页
- `eval-viewer/generate_review.py`, `eval-viewer/viewer.html` — 评估可视化
- `scripts/` — `aggregate_benchmark.py`, `generate_report.py`, `improve_description.py`, `package_skill.py`, `quick_validate.py`, `run_eval.py`, `run_loop.py`, `utils.py`

## 原文链接

- 仓库路径：https://github.com/anthropics/skills/tree/main/skills/skill-creator
- SKILL.md 原文：https://raw.githubusercontent.com/anthropics/skills/main/skills/skill-creator/SKILL.md
