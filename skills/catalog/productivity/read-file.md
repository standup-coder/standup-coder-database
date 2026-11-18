---
id: read-file
type: atomic-skill
title: Read File
nameZh: 读取文件
domain: productivity
tags: file, io, basic
catalogSource: internal
catalogFile: atomic-skills/read-file.json
catalogAddedAt: 2026-07-26
operation: filesystem
level: junior
---

# 读取文件
> 读取指定路径的文件内容
## 操作语义
- 类型: filesystem
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `path` (string, **必填**) — 文件路径（相对或绝对）
- `encoding` (string, 可选) 取值: utf-8/utf-16/ascii/binary 默认: `"utf-8"`
- `maxSize` (number, 可选) — 最大读取字节数 默认: `10485760`
## 输出
- `content` (string, **必填**) — 文件内容
- `size` (number, **必填**) — 文件大小（字节）
- `encoding` (string, 可选) — 实际使用的编码
- `lastModified` (string, 可选) — 最后修改时间
## 核心要点

读文件看似简单，但路径穿越、编码错乱、超大文件三类问题足以让一个 agent 失控。

## 关键要点

- 路径必须 resolve + 校验是否落在 workspace 内
- 默认 UTF-8，遇二进制（图片/PDF）走专用 reader
- 超过阈值的大文件应只读前 N 行或返回 stream 句柄
- 隐私敏感文件（.env / id_rsa / *.pem）默认禁读
- 读到的内容不应直接喂给 LLM，要先做 size / 类型判断

## 最佳实践

- fs.promises.readFile + 显式 encoding，避免 Buffer 误用
- 提供 lineRange 参数（startLine / endLine）以支持节选
- 对超大文件用 readline 流式读取，每读一行可终止
- 检测 BOM 并正确处理 UTF-16 / GBK 等遗留编码
- 审计日志记录被读取的 path 与 byteCount

## 反模式

- ❌ 把 10GB 日志一次 readFile 进内存导致 OOM
- ❌ 不校验路径直接读取 ../../etc/passwd
- ❌ 盲目把整个文件塞进 LLM prompt 触发上下文超限
- ❌ 忽略 EISDIR / ENOENT / EACCES 错误统一抛 generic error
- ❌ 读取二进制文件不做 base64 转码导致下游解析错乱

## 分级掌握

- **Junior**: 能正确读取小文件、处理常见错误码、识别编码
- **Mid**: 能流式读大文件、实现 lineRange / 节选、设计路径沙箱
- **Senior**: 能为 agent 设计读文件策略：分级阈值、敏感路径拦截、与 LLM context 协同

## 参考资源

- [Node.js readline streaming](https://nodejs.org/api/readline.html) — doc
- [How big is too big? File size in LLM context](https://www.anthropic.com/news/contextual-retrieval) — article

## 相关 Skills
_见所属 composite skill 或 role_