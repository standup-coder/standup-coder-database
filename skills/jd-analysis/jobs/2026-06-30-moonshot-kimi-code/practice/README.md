# 原子化实操指导（practice/）

> [本 JD README](../README.md) ｜ [START-HERE](../START-HERE.md) ｜ [学习总览](../study/00-overview.md) ｜ [专项入口](../../../README.md)

---

## 这里是什么 / 和 study 的关系

| | `study/`（学） | `practice/`（造，本目录） |
|---|---|---|
| 组织 | 按**技能维度**（TS/Loop/Tool…） | 按**项目里程碑** M1-M6 |
| 颗粒度 | 技能 → 步骤（概念+练习） | 里程碑 → **Task → 原子动作** |
| 目标 | 学会某能力 | 一步步造出 `my-coding-agent` |
| 形态 | 打卡 + 检验 | 可照抄的命令/代码骨架 + 检验 |

> 用法：study 告诉你「Loop 怎么学」，practice 告诉你「现在打开终端敲什么、在哪个文件写什么」。两者映射同一个里程碑，可交叉对照。

---

## 统一格式

每个里程碑文件 = N 个 **Task**，每个 Task：

- **目标**：这一步造出什么
- **原子步骤**：`- [ ]` 可勾选的具体动作（命令 / 文件改动 / 代码骨架）
- **✓ 检验**：达成标准
- **⚠️ 卡点**：常见坑（视情况）

---

## 里程碑索引（对齐主线项目 `my-coding-agent`）

| 里程碑 | 文件 | 产出 | 周 |
|--------|------|------|----|
| M1 最小 Agent Loop | [m1-agent-loop.md](./m1-agent-loop.md) | 能调模型+读文件回答问题 | W1-2 |
| M2 仓库工具集 | [m2-repo-tools.md](./m2-repo-tools.md) | 编辑/搜索/测试/沙箱/Git 全套 | W3-4 |
| M3 上下文管理 | [m3-context.md](./m3-context.md) | 文件选择+RAG+压缩+预算 | W5-6 |
| M4 稳定性 | [m4-stability.md](./m4-stability.md) | 错误恢复+续跑+验证 | W7-8 |
| M5 可观测+评测 | [m5-observability-eval.md](./m5-observability-eval.md) | trace+评测集+SWE-bench | W9-10 |
| M6 打磨+复盘 | [m6-polish.md](./m6-polish.md) | MCP/Subagent/博客/开源 | W11-12 |

---

## 约定

- 命令默认在 `my-coding-agent/` 项目根执行
- 语言主 **TypeScript**，评测/索引辅以 **Python**
- 每完成一个原子步骤把 `[ ]` 改成 `[x]`
- 卡住看对应 `study/` 文件的「学/资源」，或 `../shared/resources.md`
