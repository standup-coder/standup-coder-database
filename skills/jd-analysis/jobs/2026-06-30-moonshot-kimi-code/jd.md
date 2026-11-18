# JD 解析：Coding Agent 研发工程师 · Kimi Code（Moonshot AI）

> 沉淀时间：2026-07-02
> JD 来源：Moonshot AI（月之暗面）官方招聘，发布于 2026-06-30
> 解析视角：skills-database 框架（主技能 / 原子技能体系）
> 学习入口：[START-HERE](./START-HERE.md) ｜ [学习总览](./study/00-overview.md) ｜ [实操 practice](./practice/README.md)
> 导航：[本 JD README](./README.md) ｜ [专项入口](../../README.md) ｜ [通用技能库](../../shared/skills-library.md)

---

## 一、岗位本质（一句话）

构建 **模型之外的关键系统**，让 Coding Agent 能在真实代码仓库、真实工具链、真实开发流程中**稳定、可靠、可验证**地完成任务，并通过 **trace / 评测 / 数据**持续进化。

> 关键判断：这不是「让模型生成代码」的岗，而是「让 Agent 在真实软件工程中可靠工作」的系统工程岗。模型是别人的能力，**执行循环、工具系统、上下文工程、可观测性**才是这个岗位要交付的东西。

---

## 二、需要掌握的技能（分层技能树）

### A. 工程基础（硬功底，必备）
| # | 技能 | 说明 |
|---|------|------|
| A1 | 至少一门强类型/系统语言 | TypeScript / Python / Go / Rust，并能快速迁移新技术栈 |
| A2 | 软件工程基本功 | 架构、复杂系统设计、工程质量 |
| A3 | 命令行 / Shell | 命令执行、脚本编排 |

### B. LLM Agent 核心机制（岗位地基，必备）
| # | 技能 | 为什么需要 |
|---|------|-----------|
| B1 | **Agent Loop** | 执行循环是整个系统的骨架 |
| B2 | **Tool Use / Function Calling** | Agent 调用工具的根本机制 |
| B3 | **Context Engineering** | 上下文决定 Agent 上限 |
| B4 | **Planning / 任务拆解** | 长任务不迷路的核心 |
| B5 | **Memory / 长期记忆** | 历史、状态、跨会话记忆 |
| B6 | **Prompt Engineering** | 调 prompt、拆 prompt |
| B7 | **MCP（Model Context Protocol）** | 工具/上下文接入标准 |
| B8 | **Subagent / Multi-agent** | 任务分发与协作 |

### C. Coding Agent 系统工程（岗位核心交付物）
#### C1. 执行循环优化（Agent Loop 的实战）
- 任务拆解（Task Decomposition）
- 工具调用编排
- 结果观察（Observation）
- **错误恢复（Error Recovery）** ← 明确点名
- **长任务续跑（Long-task Resume）** ← 明确点名
- 最终验证（Final Verification） ← 明确点名

#### C2. 仓库级工具系统（Repository Tooling）
- 文件编辑（File Edit）
- 命令执行（Command Execution）
- 代码搜索（Code Search）
- 测试运行（Test Running）
- Git 工作流（Git Workflow）
- **沙箱（Sandbox）** ← 加分项但岗位强相关
- **远程执行（Remote Execution）** ← 加分项但岗位强相关
- 插件系统（Plugin System）

#### C3. 仓库级上下文工程（Repo-level Context Eng）
- 代码检索（Code Retrieval）
- 文件选择（File Selection）
- 上下文压缩（Context Compression）
- 历史轨迹管理（Trajectory Management）
- 任务状态维护（Task State Maintenance）
- 长期记忆（Long-term Memory）

### D. 质量与进化（可观测 / 可评测，岗位差异化能力）
| # | 技能 | 作用 |
|---|------|------|
| D1 | **Evaluation / 评测集构建** | 构建失败样本、评测集 |
| D2 | **Benchmark** | 量化 Agent 能力 |
| D3 | **Observability / 可观测性** | trace、指标、监控 |
| D4 | **Trace Analysis / 轨迹分析** | 定位 Agent 为什么失败 |
| D5 | 数据飞轮 | trace → 失败样本 → 评测 → 模型协同进化 |

### E. 产品与方法论（软实力中的硬实力）
- **AI 编程工具高强度使用**：能说清不同工具（Cursor / Copilot / Claude Code / Codex / Windsurf 等）在 **上下文 / 工具调用 / 任务规划 / 编辑体验 / 失败恢复** 五维上的差异
- **产品 sense + 实验品味**：从反馈/trace/评测中发现问题、验证改进
- **追问本质**：「这个能力解决了什么真实问题？它是否真的让 Agent 变强？能否被观测/评测/持续改进？」

### F. 软技能 / 文化匹配
- 强自驱（主动发现、拆解、推动）
- 批判性思维（「发现垃圾的眼睛」，敢喷也接受被喷）
- 英文阅读沟通（跟进海外社区与前沿项目）
- 热爱 AI 编程工具，但**不是「离开 AI 就写不了代码」**（AI 能写的你能写，AI 不能写的你也能写）

---

## 三、主技能 vs 原子技能映射（贴合 skills-database 框架）

### 主技能（mainSkills）— 复合能力
```
agent-loop-engineering      # 执行循环工程（拆解/调用/观察/恢复/续跑/验证）
repo-tooling-system         # 仓库级工具系统（编辑/执行/搜索/测试/Git/沙箱/远程）
repo-context-engineering    # 仓库级上下文工程（检索/选择/压缩/轨迹/状态/记忆）
agent-evaluation            # 评测与基准（失败样本/评测集/Benchmark）
agent-observability         # 可观测性与 trace 分析
agent-model-coevolution     # Agent 与模型协同进化
```

### 原子技能（atomicSkills）— 可直接组合的能力
```
file-edit, command-exec, code-search, test-run, git-ops,
sandbox-exec, remote-exec, context-compress, code-retrieval,
file-selection, trajectory-management, task-state-maintain,
trace-collect, trace-analyze, failure-case-mining, eval-set-build,
prompt-engineering, tool-use, planning, memory-management, mcp-integration
```

---

## 四、优先级与差距速查（学习/补能建议）

| 优先级 | 能力 | 建议动作 |
|--------|------|----------|
| P0 必备 | Agent Loop / Tool Use / Context Eng | 动手实现一个最小可用 Coding Agent Loop |
| P0 必备 | TS 或 Python 工程力 | 读/改一个真实开源 Coding Agent 源码 |
| P1 核心 | 错误恢复 / 长任务续跑 / 最终验证 | 设计「失败-重试-校验」闭环 |
| P1 核心 | 评测 + Trace 分析 | 搭一个能看 trace、能跑评测的 pipeline |
| P2 加分 | 沙箱 / 远程执行 / 插件系统 | 调研 Firecracker、gVisor、MCP server 生态 |
| P2 加分 | 多工具批判性对比 | 写一篇五维对比报告（上下文/工具调用/规划/编辑/恢复） |
| P3 持续 | 海外前沿跟进 | 关注 SWE-bench、Agent benchmarks、各家技术博客 |

---

## 准备计划索引（逐维度展开 + 12 周路线图）

技能拆解已展开为可执行计划，主线项目 `my-coding-agent`：12 周内做出一个「能修 issue → 改代码 → 跑测试 → 提 PR」且全程可观测、可评测的开源 Coding Agent。

| 维度 | 文件 | 核心交付 |
|------|------|---------|
| 总览 | [00-overview](./study/00-overview.md) | 能力矩阵 · 12 周路线图 · 主线项目 |
| 01 工程基础 | [01](./study/01-engineering.md) | TS/Python · 测试/CI · Git 工程化 |
| 02 Agent 机制 | [02](./study/02-agent-mechanisms.md) | Loop/Tool/Context/Plan/Memory/MCP/Subagent |
| 03 系统工程（核心） | [03](./study/03-system-engineering.md) | 执行循环/仓库工具/上下文工程 |
| 04 质量进化 | [04](./study/04-quality.md) | Eval/SWE-bench/Observability/Trace |
| 05 产品方法 | [05](./study/05-product.md) | 六款工具五维对比 |
| 06 软技能 | [06](./study/06-soft-skills.md) | STAR 故事库 · 资产沉淀 |

---

## 五、一句话能力画像（自检）

> 「我能搭出一个**带执行循环、仓库工具、上下文管理、可观测、可评测**的 Coding Agent，并且能从 trace 里找出它为什么迷路、让它下次不迷路。」

满足这句话 ≈ 匹配本岗位核心画像。

---

## 附录：JD 原文存档

> Coding Agent 研发工程师 | Kimi Code
> 全职 | 技术类 | 发布于 2026-06-30

**职位描述**
Kimi Code 是 Moonshot AI 面向开发者打造的 Coding Agent。我们在寻找 Coding Agent 研发工程师，一起建设模型之外的关键系统：让模型能在真实代码仓库、真实工具链和真实开发流程中完成任务，而不只是生成代码。

**我们在解决什么问题**
今天的 Coding Agent 还远没有到最终形态。它们会写代码，但也会迷路、重复、误解上下文、错误调用工具、无法恢复失败，在长任务中丢失目标。我们关心的问题是：如何让 Agent 在真实软件工程任务中更稳定、更可靠、更可验证，并且能够通过 trace、评测和数据持续进化。

**你会做什么**
- 参与 Kimi Code 核心功能和工程架构建设，构建 Coding Agent 系统；
- 设计和优化 Coding Agent 的执行循环，包括任务拆解、工具调用、结果观察、错误恢复、长任务续跑和最终验证；
- 建设面向真实代码仓库的工具系统，包括文件编辑、命令执行、代码搜索、测试运行、Git 工作流、沙箱与远程执行等能力；
- 研究代码仓库级别的上下文工程，包括代码检索、文件选择、上下文压缩、历史轨迹管理、任务状态维护和长期记忆；
- 基于真实用户任务和 Agent trace，构建失败样本、评测集和分析工具，定位 Agent 为什么失败，以及如何让它下次成功；
- 与模型团队协作，从 Agent 侧探索模型能力边界，推动模型与 Coding Agent 系统共同进化。

**我们希望你**
- 有扎实的软件工程能力，熟悉 TypeScript/Python/Go/Rust 等至少一种语言，并能快速掌握新技术栈；
- 是 AI 编程工具的高强度用户，能说清楚不同工具在上下文、工具调用、任务规划、编辑体验、失败恢复上的差异；
- 理解 LLM Agent 基本机制：Agent Loop、Tool Use、Context Engineering、Planning、Memory、Prompt Engineering；
- MCP、Subagent、Multi-agent、Evaluation、Observability 等；
- 有较强的自驱力，能主动发现问题、拆解问题并推动解决；
- 有一双发现垃圾的眼睛，能喷人，也接受被喷。

**加分项**
- 有自己的开源项目，或深度参与过开源项目；
- 做过 CLI、IDE 插件、开发者工具、代码分析、沙箱、远程执行、插件系统等相关项目；
- 做过 Agent / LLM 应用 / Evaluation / Benchmark / Observability / Trace Analysis 相关工作；
- 对主流 AI 编程工具有深入使用和批判性理解；
- 有较强的产品 sense 和实验品味；
- 有高含金量比赛奖项、论文发表、研究项目等；
- 英文阅读和沟通能力良好。

**我们喜欢这样的人**
你不一定什么都会，但真的热爱 AI 编程工具。你可以是工程能力强的人（架构、工具、平台、复杂系统、工程质量），也可以是对 Agent 行为敏感的人（分析 trace、拆解 prompt、研究 workflow 和评测方法）。你使用 AI 写代码是为了更快、更大胆地解决问题，而不是因为离开 AI 就写不了代码。你不止「实现需求」，而是会追问这个能力是否真的解决了真实问题、是否让 Agent 变强、能否被观测/评测/持续改进。
