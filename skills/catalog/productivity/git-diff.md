---
id: git-diff
type: atomic-skill
title: Git Diff
nameZh: Git差异
domain: productivity
tags: git, diff, vcs
catalogSource: internal
catalogFile: atomic-skills/git-diff.json
catalogAddedAt: 2026-07-26
operation: vcs
level: junior
---

# Git差异
> 显示提交、分支或工作树之间的变更，输出结构化差异块
## 操作语义
- 类型: vcs
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `base` (string, 可选) — Base reference (commit SHA, branch name, or tag)
- `head` (string, 可选) — Head reference to compare against base (defaults to working tree)
- `paths` (array, 可选) — Limit diff to specific file paths or glob patterns
- `staged` (boolean, 可选) — Show staged changes (git diff --cached) 默认: `false`
- `unified` (number, 可选) — Number of context lines around each hunk 默认: `3`
- `stat` (boolean, 可选) — Return diffstat summary instead of full diff 默认: `false`
- `nameOnly` (boolean, 可选) — Return only changed file names 默认: `false`
- `ignoreWhitespace` (boolean, 可选) — Ignore whitespace-only changes 默认: `false`
## 输出
- `files` (array, **必填**) — List of changed files with per-file diff details
- **summary** (object,必填):
  - `filesChanged` (number, 可选)
  - `totalAdditions` (number, 可选)
  - `totalDeletions` (number, 可选)
- `rawDiff` (string, 可选) — Raw unified diff output for direct consumption
## 核心要点

git diff 看似只是文本对比，但 merge-base 计算、rename 检测、submodule 差异和超大 diff 截断才是 agent 真正要处理的工程问题。

## 关键要点

- 三点 diff（A...B）基于 merge-base，两点 diff（A..B）是直接比较——agent 必须根据语义选择
- rename 检测（-M）和 copy 检测（-C）影响 diff 结构，关闭时 rename 会显示为 delete + add
- 超大 diff（如 lock 文件变更）会淹没真正有意义的代码变更，需按路径过滤
- staged vs unstaged vs untracked 是三种不同状态，agent 需明确用户意图
- submodule 和 symlink 的 diff 输出格式特殊，解析器必须处理

## 最佳实践

- 默认使用 --stat 获取概览，用户确认后再获取完整 diff
- 对 lock 文件（package-lock.json / yarn.lock）自动跳过或仅报告 stat
- 提供 nameOnly 模式让 agent 先了解变更范围再决定是否深入
- 限制 maxDiffSize 并在超限时返回截断标记而非静默丢弃
- 结合 git log --oneline 提供变更上下文（谁在什么时候改的）

## 反模式

- ❌ 把整个 monorepo 的 diff 一次性塞进 LLM context 导致 token 溢出
- ❌ 不区分 staged/unstaged 导致 agent 基于错误的变更集做判断
- ❌ 忽略 rename 检测导致将文件移动误判为大规模删除+新增
- ❌ 对 binary 文件尝试文本 diff 产生乱码输出
- ❌ 在 shallow clone 中执行跨 commit diff 导致 missing object 错误

## 分级掌握

- **Junior**: 能执行基本 git diff、区分 staged/unstaged、读取 unified diff 格式
- **Mid**: 能处理 rename 检测、三点 diff 语义、按路径过滤、解析 hunk 结构
- **Senior**: 能为 agent 设计 diff 策略：智能截断、lock 文件过滤、与 code review 流程集成、增量 context 构建

## 参考资源

- [Git Diff Documentation](https://git-scm.com/docs/git-diff) — doc
- [Pro Git - Git Tools Revision Selection](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection) — article

## 相关 Skills
_见所属 composite skill 或 role_