---
id: analyze-code
type: atomic-skill
title: Analyze Code
nameZh: 代码分析
domain: data
tags: analysis, code, atomic
catalogSource: internal
catalogFile: atomic-skills/analyze-code.json
catalogAddedAt: 2026-07-26
operation: analysis
level: mid
---

# 代码分析
> 静态分析代码问题
## 操作语义
- 类型: analysis
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
_无明确 schema_
## 输出
_无明确 schema_
## 核心要点

代码分析是 agent 修改代码前的必修课：先读懂依赖、调用图、测试覆盖，再动刀。

## 关键要点

- 静态分析（AST / linter / type checker）+ 动态分析（profile / trace）双管齐下
- agent 应先建立"修改半径"：哪些文件、哪些 caller 受影响
- circular dependency / dead code / 重复代码是常见信号
- 复杂度指标（cyclomatic / cognitive）作为 review 触发阈值
- 安全分析单独一档（CodeQL / Semgrep），不与质量分析混淆

## 最佳实践

- 用语言官方 LSP / type checker 拿到精确符号信息
- 用 ts-morph / tree-sitter 做跨语言 AST 分析
- 把分析结果存为 graph，便于 agent 多轮查询
- 为热点函数建立 baseline 性能指标，回归时报警
- 分析结果应可解释：每条结论附文件 + 行号 + 引用

## 反模式

- ❌ 只用 grep 找用法，错过反射 / 字符串调用
- ❌ 改完代码不重新分析依赖，连锁断裂
- ❌ 把分析报告整段塞 LLM 而不抽取关键事实
- ❌ 忽略 type warning，认为"能跑就行"
- ❌ 安全扫描结果石沉大海，无人 triage

## 分级掌握

- **Junior**: 能读懂 linter / type checker 报告，找到调用点
- **Mid**: 能用 AST 工具分析跨文件依赖，识别循环引用与 dead code
- **Senior**: 能设计 agent 的代码分析 pipeline：图建模 / 修改半径 / baseline 性能 / 安全闭环

## 参考资源

- [tree-sitter: incremental parsing](https://tree-sitter.github.io/tree-sitter/) — doc
- [Semgrep: lightweight static analysis](https://semgrep.dev/) — doc
- [Sourcegraph code intelligence](https://sourcegraph.com/docs/code-search) — doc

## 相关 Skills
_见所属 composite skill 或 role_