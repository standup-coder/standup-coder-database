---
title: 提示词模板：向 agent 报告一个 bug
category: prompts
tags: [调试, 提问]
updated: 2026-09-29
---

# 提示词模板：向 agent 报告一个 bug

## 何时用

发现了 bug 要让 agent 修。"它坏了帮我修"会让 agent 盲目猜测；按本模板提供结构化信息，能跳过大半的无效探索。

## 模板

```text
现象：<看到的错误行为，引用完整的报错信息/日志，不要转述>
复现步骤：
1. <精确到操作的步骤>
2. ...
期望：<正确行为应该是什么>
环境：<OS / 运行时版本 / 触发的分支或提交>
已排除：<你已经验证过不是原因的假设，如"回退到上一版提交就正常">
约束：<修复的边界，如"不要改公共接口签名">
```

## 变量说明

| 变量 | 说明 |
| --- | --- |
| 现象 | **贴原始报错**。转述过的报错（"报了个类型错误"）丢失了最关键的具体信息 |
| 已排除 | 最容易被忽略、价值最高的变量——它直接删掉了 agent 会浪费轮次的探索方向 |
| 约束 | 防止 agent 用"重写成另一个方案"来逃避真正的修复 |

## 提示

- 能给出"从哪个提交开始坏的"（用 `git bisect` 或回忆）比十个猜测都管用。
- 报完之后让 agent 先**说修复思路再动手**，确认方向一致再改代码。
- 修复完成后要求补一个能复现该 bug 的回归测试，见 [TDD 循环](../workflows/tdd-loop-with-agent.md)。

## 相关

- 系统化调试技能：[../../skills/systematic-debugging/SKILL.md](../../skills/systematic-debugging/SKILL.md)
- 调试会话示例：[../transcripts/example-session-bug-hunt.md](../transcripts/example-session-bug-hunt.md)
