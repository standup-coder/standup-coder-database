---
id: search-code
type: atomic-skill
title: Search Code
nameZh: 代码搜索
domain: backend
tags: search, grep, code
catalogSource: internal
catalogFile: atomic-skills/search-code.json
catalogAddedAt: 2026-07-26
operation: search
level: junior
---

# 代码搜索
> 在代码库中搜索正则模式、符号或文本，返回结构化匹配结果
## 操作语义
- 类型: search
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `pattern` (string, **必填**) — Regex or literal pattern to search for
- `paths` (array, 可选) — Directories or files to search in (defaults to workspace root)
- `filePattern` (string, 可选) — Glob pattern to filter files (e.g., '*.ts', '*.{js,jsx}')
- `caseSensitive` (boolean, 可选) — Whether the search is case-sensitive 默认: `true`
- `wholeWord` (boolean, 可选) — Match whole words only (word boundary anchors) 默认: `false`
- `contextLines` (number, 可选) — Number of lines to show before and after each match 默认: `2`
- `maxResults` (number, 可选) — Maximum number of matches to return 默认: `100`
- `excludePatterns` (array, 可选) — Glob patterns to exclude (e.g., ['node_modules/**', 'dist/**'])
- `searchType` (string, 可选) 取值: regex/literal/symbol — Search mode: regex pattern, literal string, or symbol definition 默认: `"regex"`
## 输出
- `matches` (array, **必填**) — List of search matches with location info
- **summary** (object,必填):
  - `totalMatches` (number, 可选)
  - `filesSearched` (number, 可选)
  - `filesWithMatches` (number, 可选)
  - `truncated` (boolean, 可选)
  - `duration` (number, 可选)
## 核心要点

代码搜索的难点不在 grep 本身，而在正则灾难性回溯、大仓库性能、结果排序相关性以及将搜索结果转化为 agent 可理解的上下文。

## 关键要点

- 正则表达式可能触发灾难性回溯（catastrophic backtracking），必须设置超时或限制模式复杂度
- 大仓库（>100k 文件）搜索必须排除 node_modules/.git/dist 等目录，否则耗时数十秒
- 搜索结果需要按相关性排序（精确匹配 > 部分匹配），而非仅按文件路径字母序
- symbol 搜索（函数/类定义）比文本搜索更精准，应优先使用 AST 或 LSP 能力
- 返回给 LLM 的结果必须截断，100 条匹配中通常只有前 10-20 条有分析价值

## 最佳实践

- 默认排除 node_modules/.git/dist/build/vendor 和二进制文件
- 提供 contextLines 让 agent 看到匹配行的上下文，减少二次读取
- 对超长匹配结果实现分页（maxResults + truncated 标记）
- 优先使用 ripgrep（rg）而非 grep，性能差距 10-100 倍
- symbol 模式下结合 tree-sitter 或 LSP 精确定义，避免注释/字符串中的误匹配

## 反模式

- ❌ 用 `.*` 或 `(a+)+` 等模式触发正则回溯导致搜索挂起
- ❌ 在 monorepo 中不排除 node_modules 导致搜索 50 万个文件
- ❌ 返回 1000 条匹配结果全部塞给 LLM 浪费 token
- ❌ 不区分大小写搜索 'class' 匹配到注释中的 'Class' 产生噪音
- ❌ 搜索二进制文件（图片/字体）产生乱码输出

## 分级掌握

- **Junior**: 能执行基本文本/正则搜索、理解匹配结果、使用文件过滤
- **Mid**: 能处理正则安全、大仓库性能优化、结果排序与截断、多模式组合搜索
- **Senior**: 能为 agent 设计搜索策略：symbol-aware 搜索、增量索引、语义搜索与文本搜索混合、结果摘要生成

## 参考资源

- [Ripgrep - Recursively Search Directories](https://github.com/BurntSushi/ripgrep) — doc
- [Regular Expression Catastrophic Backtracking](https://www.regular-expressions.info/catastrophic.html) — article

## 相关 Skills
_见所属 composite skill 或 role_