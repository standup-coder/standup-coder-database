---
title: 检查清单：提交前（与 agent 协作版）
category: checklists
tags: [git, 检查清单, 质量]
updated: 2026-09-29
---

# 检查清单：提交前（与 agent 协作版）

每次 `git commit` 前过一遍。前三条是与 agent 协作特有的——agent 很勤快，勤快本身就是风险。

## Agent 协作特有

- [ ] **diff 里没有"顺手改动"**：逐个文件过 `git diff`，每个文件你都能回答"为什么改它"。答不上来的，单独拎出来问 agent——很可能是它自作主张的"优化"。
- [ ] **没有残留调试产物**：`console.log` / `print` / 注释掉的代码块 / 临时 mock 数据 / 硬编码的本地路径。
- [ ] **agent 声称的验证你都见过输出**："测试通过"必须是你亲眼看过的输出，或自己重跑的命令。没见过 = 没通过。

## 通用

- [ ] 测试全绿（且知道哪些测试**本来**就该跑）。
- [ ] 新增行为有测试覆盖；修 bug 的提交附带了回归测试。
- [ ] `git status` 干净：没有意外文件被加入（构建产物、日志、`.env`）。
- [ ] 敏感信息扫描：密钥、token、内网地址、真实用户数据没有出现在 diff 里。
- [ ] 提交信息说清"为什么"，不只是"改了什么"；单一意图（功能/修复/重构不混提）。
- [ ] 分支策略符合团队约定（不是直接提交在主干上）。

## 快速命令

```bash
git diff --stat              # 先看形状：改动分布是否与预期一致
git diff                     # 逐文件过（agent 顺手改动在这里现形）
git grep -nE "console\.log|TODO|FIXME" -- ':!node_modules'   # 调试产物扫描
```

## 相关

- git 卫生技能：[../../skills/git-hygiene/SKILL.md](../../skills/git-hygiene/SKILL.md)
- PR 描述生成：[../prompts/pr-description.md](../prompts/pr-description.md)
