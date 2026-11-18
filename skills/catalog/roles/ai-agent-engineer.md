---
id: ai-agent-engineer
type: role
title: AI Agent Engineer
nameZh: AI Agent 工程师
domain: ai-ml
level: senior
tags: agent, llm, mcp, orchestration, evaluation, prompt-engineering
catalogSource: internal
catalogFile: roles/ai-agent-engineer.json
catalogAddedAt: 2026-07-26
experience: 3+ years(含 1+ 年 Agent/LLM 系统生产经验)
education: CS / SE / 相关领域
responsibilities: 架构多 Agent 系统拓扑 | 开发与维护 MCP 服务器 | 设计高级系统提示与思维链策略 | 构建生产 RAG 管道 | 建立 Agent 评估体系 | 实现 Agent 可观测性 | 协作防范 Agentic 安全威胁
mainSkills: agent-orchestration-design, llm-app-development
atomicSkills: agent-orchestration, mcp-server-development, agent-evaluation, prompt-engineering-advanced, rag-pipeline-design, tool-use-design, llm-evaluation, embeddings-design, vector-search, system-design, code-review, read-file, write-file, api-call, run-tests
---

# AI Agent 工程师

> 设计并上线可靠、可观测、具备可度量任务成功率的生产级 Agentic 系统。本角色页是你的**成长路径导航**:所有技能、学习顺序、验收标准都在这里,先读完再决定从哪开始。

## 这个角色解决什么问题

LLM 单独调用只能"回答问题";Agent 让它"完成任务"。本角色负责的是两者之间的工程鸿沟:

| 要解决的问题 | 具体表现 | 对应技能 |
|---|---|---|
| 模型只会答,不会做 | 需要调用工具、读写文件、执行代码 | [tool-use-design](../ai-ml/tool-use-design.md) |
| 单次调用做不完复杂任务 | 多步流程、多 Agent 协作、状态管理 | [agent-orchestration](../ai-ml/agent-orchestration.md) |
| 模型不了解你的业务数据 | 需要检索增强、知识注入 | [rag-pipeline-design](../ai-ml/rag-pipeline-design.md) |
| 改了 prompt/流程,不知道有没有变好 | 需要量化评估,而不是"感觉还行" | [agent-evaluation](../ai-ml/agent-evaluation.md) |
| Agent 乱调工具、越权、被注入 | 需要护栏与安全设计 | [guardrails-safety](../ai-ml/guardrails-safety.md) |
| 线上出了问题没法查 | 需要追踪、可观测性 | agent-orchestration-design 的 tracing 环节 |

## 职责

- 架构多 Agent 系统拓扑(单一 Agent / Supervisor / Swarm / 图编排)
- 开发与维护 MCP 服务器,管理工具注册与权限
- 设计高级系统提示与思维链策略
- 构建生产 RAG 管道(解析 → 分块 → 嵌入 → 检索 → 生成)
- 建立 Agent 评估体系(离线基线 + 线上监控)
- 实现 Agent 可观测性(追踪、指标、回放)
- 协作防范 Agentic 安全威胁(注入、越权、数据泄漏)

## 能力地图

### 主技能(复合工作流,能独立交付完整项目)

- [agent-orchestration-design](../ai-ml/agent-orchestration-design.md) — 设计多 Agent 编排:角色拆解 → 工具注册 → 控制流 → 记忆 → 评测 → 追踪
- [llm-app-development](../ai-ml/llm-app-development.md) — 端到端 LLM 应用:需求 → 数据 → 检索 → 生成 → 评估 → 护栏 → 上线

### 基础操作(原子技能,逐条打地基)

| 技能 | 一句话能力 |
|---|---|
| [prompt-engineering-advanced](../ai-ml/prompt-engineering-advanced.md) | 用评估集驱动、结构化约束、程序化优化管理提示词 |
| [tool-use-design](../ai-ml/tool-use-design.md) | 设计工具 schema 与调用循环,让模型安全可靠地使用工具 |
| [agent-orchestration](../ai-ml/agent-orchestration.md) | 实现单 Agent 循环与多 Agent 拓扑、状态与容错 |
| [mcp-server-development](../ai-ml/mcp-server-development.md) | 用 MCP 协议封装工具为可复用服务 |
| [rag-pipeline-design](../ai-ml/rag-pipeline-design.md) | 设计生产级检索增强管道:混合检索、重排、评估闭环 |
| [embeddings-design](../ai-ml/embeddings-design.md) | 选型嵌入模型、设计分块策略、评测检索质量 |
| [vector-search](../ai-ml/vector-search.md) | 选型向量库、调 ANN 参数、做混合检索 |
| [llm-evaluation](../ai-ml/llm-evaluation.md) | 构建评估集、选指标、接回归测试 |
| [agent-evaluation](../ai-ml/agent-evaluation.md) | 评估轨迹与结果、搭评测沙箱、做持续评估 |
| [system-design](../backend/system-design.md) | 系统级权衡:扩展性、可靠性、成本 |
| [code-review](../backend/code-review.md) | 审查代码质量与安全风险 |
| [api-call](../security/api-call.md) | 正确、安全地调用外部 API |
| [run-tests](../testing/run-tests.md) | 建立测试基线,防止回归 |

## 前置知识

开始本路径前,建议先具备:

- **编程基础**:Python 或 TypeScript 任一熟练(所有示例都会用到)
- **HTTP 与 API**:[api-call](../security/api-call.md) 的要求——会发请求、读文档、处理错误
- **基础提示工程**:[prompt-engineering](../ai-ml/prompt-engineering.md) 的内容(什么是 system/user prompt、temperature)
- **命令行与 git**:能跑脚本、管理代码版本

如果这些都还没有,先补前置再开始;本路径默认你"会写代码、会调 API"。

## 学习路径

总周期建议 **10-14 周**(每天 1-2 小时)。四阶段,每阶段有明确的验收标准,达标再前进——不要跳级。

### 阶段一:原子打底(第 1-4 周)

**目标**:掌握所有基础操作的"能用"水平,重点是提示工程、评估、检索三块地基。

**学习顺序**(按依赖排列):

1. [prompt-engineering](../ai-ml/prompt-engineering.md) → [prompt-engineering-advanced](../ai-ml/prompt-engineering-advanced.md)(2 周)
2. [llm-evaluation](../ai-ml/llm-evaluation.md)(与提示工程并行,评估是它的一部分)
3. [embeddings-design](../ai-ml/embeddings-design.md) → [vector-search](../ai-ml/vector-search.md)(1 周)
4. [rag-pipeline-design](../ai-ml/rag-pipeline-design.md)(1 周,串起检索三件套)

**验收标准**:

- [ ] 对任意分类/抽取任务,能写出评估集 + 基线 + 一次可解释的 prompt 提升(记录 diff 与分数)
- [ ] 用嵌入 + 向量库搭出一个可检索的文档库,回答准确率 ≥ 你说的基线
- [ ] 能说出 RAG 八步流程中每一步的常见错误
- [ ] 完成 [prompt-engineering-advanced](../ai-ml/prompt-engineering-advanced.md) 的 P1、P2 练习

### 阶段二:Agent 进阶(第 5-8 周)

**目标**:掌握工具调用、单一 Agent 循环、MCP 封装,能做"能干活"的 Agent。

**学习顺序**:

1. [tool-use-design](../ai-ml/tool-use-design.md)(1 周)
2. [agent-orchestration](../ai-ml/agent-orchestration.md)(1.5 周)
3. [mcp-server-development](../ai-ml/mcp-server-development.md)(1 周)
4. [agent-evaluation](../ai-ml/agent-evaluation.md)(0.5 周,紧接着做评估)

**验收标准**:

- [ ] 独立实现一个带 3+ 工具的单一 Agent(工具描述、调用循环、错误处理齐全)
- [ ] 用 MCP SDK 写一个最小 server,能在 Inspector 里调试
- [ ] 给你的 Agent 建评估:至少 20 条任务集,记录任务完成率,做过一次改进并看到分数变化
- [ ] 完成 [tool-use-design](../ai-ml/tool-use-design.md) 的挑战练习

### 阶段三:复合串联(第 9-12 周)

**目标**:用两个主技能把原子能力串成完整项目——先做一个 RAG 应用,再做一个多 Agent 系统。

**学习顺序**:

1. [llm-app-development](../ai-ml/llm-app-development.md)——跟着完整案例做一个"文档问答助手"(2 周)
2. [agent-orchestration-design](../ai-ml/agent-orchestration-design.md)——做一个多 Agent 编排项目,如"文档调研 Agent"(2 周)

**验收标准**:

- [ ] 项目一:文档问答助手上线,含评估基线(准确率/引用正确率)、护栏、监控指标
- [ ] 项目二:多 Agent 系统,含拓扑图、状态设计、评估集、追踪视图
- [ ] 两个项目都在 `personal/` 下留档,写明架构决策与踩坑记录
- [ ] 给同事/朋友演示一次,收集真实反馈并迭代一轮

### 阶段四:岗位对齐(持续)

**目标**:对照真实 JD 与职责清单查漏,面向面试与工作场景。

- 对照本文档「职责」逐条自评,把短板技能补到 Mid 以上
- 用 [role-fit.js](../../tools/role-fit.js) 跑一次自评(`node tools/role-fit.js ai-agent-engineer`),记录差距
- 关注 [guardrails-safety](../ai-ml/guardrails-safety.md) 与可观测性实践——这是 senior 岗位的加分项

**验收标准**:

- [ ] 职责 7 条,每条都能举出一个自己做过的实例(项目或练习)
- [ ] 对"如何评估一个 Agent 是否变好了"有 3 分钟清晰的回答
- [ ] 能手绘一个多 Agent 系统的拓扑 + 状态流转 + 评估闭环

## 技能依赖图谱

```
提示工程 ──→ 提示工程(高级)
                    │
LLM 评估 ←──────────┘─────→ Agent 评估
                    │          ↑
嵌入设计 → 向量检索 → RAG 管道设计 ──┘
                                    │
工具调用设计 → Agent 编排 → MCP 服务器开发
                    │              │
                    └──→ LLM 应用开发(端到端项目)
                              │
                    Agent 编排设计(多 Agent 项目)
```

**阅读方式**:箭头指向"需要前置"。先学左边的,再学右边的;评估能力贯穿全程,因为它决定你每次改动是否有依据。

## 经验门槛

| 维度 | 要求 |
|------|------|
| 经验 | 3+ 年(含 1+ 年 Agent/LLM 系统生产经验) |
| 学历 | CS / SE / 相关领域 |
| 核心技术 | Python / TypeScript,LangGraph / AutoGen / CrewAI 等 Agent 框架,MCP 协议与 SDK(TS / Python),向量数据库(pgvector / Weaviate / Qdrant),LLM 评估工具(Ragas / DeepEval / LangSmith),OpenAI / Anthropic / 开源模型 API,可观测性工具(LangSmith / Langfuse / Helicone) |

## 自评清单

对照职责逐条自评(0-3 分,3 = 能独立交付):

- [ ] 能架构多 Agent 系统拓扑并说明选型理由(0-3 分:__)
- [ ] 能开发 MCP 服务器并设计工具权限(0-3 分:__)
- [ ] 能设计带约束体系的系统提示并通过红队测试(0-3 分:__)
- [ ] 能构建生产 RAG 管道并量化检索/生成质量(0-3 分:__)
- [ ] 能建立 Agent 评估体系(离线 + 线上)(0-3 分:__)
- [ ] 能实现追踪与回放,定位线上问题(0-3 分:__)
- [ ] 能识别并缓解提示注入、越权风险(0-3 分:__)

自评总分 < 12:回到阶段一;12-18:补齐短板进阶段三;> 18:准备面试与实战验证。

## 相关角色

- [ai-ml-engineer](../roles/ai-ml-engineer.md) — 偏模型与算法,本角色偏 Agent 系统架构
- [backend-developer](../roles/backend-developer.md) — 本角色的工程底座

## 参考资源

- [Anthropic Agent 设计指南](https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems) — 官方文档,兜底/缓存/错误处理三大原则
- [OpenAI Agents 文档](https://platform.openai.com/docs/guides/agents) — 官方文档,Agent 设计模式
- [LangGraph 文档](https://langchain-ai.github.io/langgraph/) — 工具,图编排实现参考
- [Ragas](https://docs.ragas.io/) — 工具,RAG 评估
- [DeepEval](https://github.com/confident-ai/deepeval) — 工具,LLM 应用测试