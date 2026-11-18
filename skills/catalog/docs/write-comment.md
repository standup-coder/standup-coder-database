---
id: write-comment
type: atomic-skill
title: Write Comment
nameZh: 写注释
domain: docs
tags: comment, doc, code
catalogSource: internal
catalogFile: atomic-skills/write-comment.json
catalogAddedAt: 2026-07-26
operation: documentation
level: junior
---

# 写注释
> 添加、更新或删除代码注释和文档标注，支持语言感知的格式化
## 操作语义
- 类型: documentation
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `filePath` (string, **必填**) — Target file path to add comments to
- **target** (object):
  - `type` (string, 可选) 取值: function/class/variable/block/line/file-header — Type of code element to annotate
  - `name` (string, 可选) — Name of the target element (function/class/variable name)
  - `line` (number, 可选) — Line number for line/block comments
- `content` (string, **必填**) — Comment text content (plain text, will be formatted per language)
- `style` (string, 可选) 取值: jsdoc/typedoc/pydoc/godoc/rustdoc/javadoc/inline/block — Documentation comment style (auto-detected from language if omitted)
- `action` (string, **必填**) 取值: add/update/remove — Whether to add new, update existing, or remove a comment 默认: `"add"`
- `language` (string, 可选) — Programming language (auto-detected from file extension if omitted)
- `tags` (array, 可选) — Documentation tags to include (e.g., ['@param', '@returns', '@throws'])
## 输出
- `success` (boolean, **必填**) — Whether the comment operation succeeded
- `filePath` (string, **必填**) — Path of the modified file
- `commentText` (string, **必填**) — The formatted comment text that was written
- **lineRange** (object):
  - `start` (number, 可选)
  - `end` (number, 可选)
- `previousComment` (string, 可选) — The previous comment text (for update/remove actions)
## 核心要点

写注释的难点不在语法，而在判断什么值得注释、如何与现有文档风格一致、以及避免注释与代码不同步变成谎言。

## 关键要点

- 不同语言的文档注释格式差异大（JSDoc vs pydoc vs godoc），必须语言感知
- 好的注释解释 why 而非 what——agent 不应为显而易见的代码添加冗余注释
- 更新注释比新增更难：必须定位现有注释块、保留有效内容、合并新信息
- 注释位置错误（如放在函数体内部而非声明前）会破坏 IDE 的文档提示
- 生成代码（*.generated.* / *.min.js）不应被注释，会破坏构建流程

## 最佳实践

- 检测文件已有注释风格（JSDoc vs 普通 //）并保持一致
- 对函数注释自动推断 @param/@returns 类型签名
- update 操作时 diff 新旧注释，保留人工编写的描述部分
- 注释内容简洁（1-3 行），复杂逻辑建议重构代码而非写长注释
- 写入后验证文件仍可正常解析（无语法错误引入）

## 反模式

- ❌ 为每行代码都加注释（// increment i by 1）产生噪音
- ❌ 注释内容与代码实际行为不一致（过时注释比没有注释更有害）
- ❌ 在 minified 文件中插入注释破坏压缩格式
- ❌ 不检测已有注释直接叠加导致重复文档块
- ❌ 用英文注释写中文项目（或反之）导致团队阅读困难

## 分级掌握

- **Junior**: 能为函数/类添加基本文档注释、使用正确的语言格式
- **Mid**: 能检测并匹配现有风格、推断类型签名、安全更新已有注释
- **Senior**: 能为 agent 设计注释策略：判断注释必要性、保持注释与代码同步、多语言项目统一文档规范

## 参考资源

- [JSDoc Reference](https://jsdoc.app/) — doc
- [Clean Code - Comments Chapter](https://www.oreilly.com/library/view/clean-code-a/9780136083238/) — article

## 相关 Skills
_见所属 composite skill 或 role_