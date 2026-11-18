---
id: write-file
type: atomic-skill
title: write-file
nameZh: 写文件
domain: productivity
tags: file, write, atomic
catalogSource: internal
catalogFile: atomic-skills/write-file.json
catalogAddedAt: 2026-07-26
operation: file
level: junior
---

# 写文件
> 将内容写入指定路径的文件
## 操作语义
- 类型: file
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `path` (string, **必填**) — File path to write to
- `content` (string, **必填**) — Content to write
- `append` (boolean, 可选) — Append to existing file 默认: `false`
## 输出
- `success` (boolean, 可选)
- `path` (string, 可选)
- `bytesWritten` (number, 可选)
## 核心要点

写文件是 agent 与外部世界交互的最危险动作之一：一次错误的覆盖足以让一整天的工作付诸东流。

## 关键要点

- 区分 create / overwrite / append 三种语义，不能混用
- 写之前先校验目标路径白名单与禁写名单（.env / secrets/ / *.key）
- 大文件写入应分块（streaming），避免一次性占满内存
- 原子写入需 write-temp + rename，避免中途崩溃产生半文件
- 编码必须显式指定（UTF-8），不要依赖系统默认
- 权限必须最小化：默认 0644，敏感文件 0600

## 最佳实践

- 所有写操作必须先经 dryRun / diff 阶段供人类确认
- 失败回滚：写前快照原内容，失败时恢复
- 为 agent 配置 sandbox：把 workspace 之外路径全部 deny
- 对二进制写入使用 Buffer 而非 string 拼接
- 日志中只记录 path + bytesWritten，不要把 content 全文落盘

## 反模式

- ❌ 直接 fs.writeFileSync 全量覆盖未做幂等校验
- ❌ 把用户输入路径直接拼接到目标地址（路径穿越）
- ❌ 为了"一次成功"而把 maxFileSize 上限调到无穷
- ❌ 在循环里同步写小文件（应改为批量或异步并发）
- ❌ 失败后无回滚，留下半文件污染下游

## 分级掌握

- **Junior**: 能正确调用 writeFile 写入指定路径，知道处理 ENOENT / EACCES
- **Mid**: 能实现原子写入、路径白名单、回滚机制，处理大文件流式写入
- **Senior**: 能为 agent runtime 设计沙箱写入策略，包含审计日志、配额控制、敏感路径拦截

## 参考资源

- [Node.js fs.promises 官方文档](https://nodejs.org/api/fs.html#promises-api) — doc
- [Atomic file writes (write-file-atomic)](https://github.com/npm/write-file-atomic) — doc
- [OWASP Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal) — article

## 相关 Skills
_见所属 composite skill 或 role_