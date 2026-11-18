---
id: run-shell-command
type: atomic-skill
title: Run Shell Command
nameZh: 执行 Shell 命令
domain: backend
tags: shell, exec, cli, ops
catalogSource: internal
catalogFile: atomic-skills/run-shell-command.json
catalogAddedAt: 2026-07-26
operation: system
level: junior
---

# 执行 Shell 命令
> 在受控环境下执行 Shell 命令并捕获输出
## 操作语义
- 类型: system
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `command` (string, **必填**) — 要执行的 shell 命令
- `cwd` (string, 可选) — 工作目录（可选）
- `timeout` (number, 可选) — 超时时间（毫秒） 默认: `30000`
- `env` (object, 可选) — 额外环境变量
## 输出
- `stdout` (string, **必填**) — 标准输出
- `stderr` (string, **必填**) — 标准错误
- `exitCode` (number, **必填**) — 退出码
## 核心要点

执行 shell 命令是 agent 能力最强但最危险的操作；输入消毒、超时、白名单是三道生死线。

## 关键要点

- 永远不要用 string 拼接构造命令，必须用 argv 数组
- 必须设超时（默认 ≤30s），无超时等于无穷阻塞
- 必须设最大输出缓冲（防止 OOM 和日志爆炸）
- env 显式传递，避免污染来自宿主的敏感变量
- shell: false 是默认值，shell: true 仅在显式需要管道时打开
- 退出码非 0 ≠ 失败：grep / diff 等以非 0 表达正常状态

## 最佳实践

- 建立命令白名单（git / ls / cat...）+ 黑名单（rm -rf / curl ... | sh）
- 通过 spawn 而非 exec 处理大输出，stream 转 line-by-line
- 为高危命令引入二次确认（destructive=true 标记）
- 所有命令执行落审计日志：cmd / args / cwd / exitCode / duration
- 在容器或 chroot 中跑非可信命令

## 反模式

- ❌ execSync(`rm -rf ${userInput}`) — 命令注入经典反例
- ❌ 不设超时导致 agent 卡死
- ❌ 把 stdout 全量塞回 LLM context 导致 token 爆炸
- ❌ 依赖 shell 解析特殊字符却没引号转义
- ❌ 在生产环境直接以 root 跑 agent 命令

## 分级掌握

- **Junior**: 能用 spawn 安全执行预定义命令，处理 exit code 和超时
- **Mid**: 能设计命令白名单 + 沙箱，处理流式大输出与跨平台差异
- **Senior**: 能为 agent 平台制定命令安全规范，含审计、配额、危险动作拦截策略

## 参考资源

- [Node.js child_process 官方文档](https://nodejs.org/api/child_process.html) — doc
- [OWASP Command Injection](https://owasp.org/www-community/attacks/Command_Injection) — article
- [execa: better child_process](https://github.com/sindresorhus/execa) — doc

## 相关 Skills
_见所属 composite skill 或 role_