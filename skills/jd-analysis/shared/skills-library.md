# 通用技能库

> 跨 JD 沉淀的核心能力清单。每项标注「哪些 JD 需要」，避免重复解析。
> 命名空间建议：`<domain>.<skill>`，与各 JD 的主技能/原子技能映射对齐。

---

## 领域 A · Agent 工程（AI Agent 通用）

| 技能 ID | 技能 | 要点 | 需要 JD |
|---------|------|------|---------|
| `agent.loop` | Agent Loop | 感知→思考→行动→观察循环；停止条件；防死循环 | ✓ moonshot-kimi-code |
| `agent.tool-use` | Tool Use | schema 定义、参数校验、错误回喂、并行调用 | ✓ moonshot-kimi-code |
| `agent.context-eng` | Context Engineering | 窗口管理、压缩、选择、Lost-in-the-middle | ✓ moonshot-kimi-code |
| `agent.planning` | Planning | ReAct / Plan-and-Execute / Reflexion | ✓ moonshot-kimi-code |
| `agent.memory` | Memory | 短期/长期/向量/结构化任务状态 | ✓ moonshot-kimi-code |
| `agent.prompt` | Prompt Engineering | 分层 system prompt、few-shot、调优与归因 | ✓ moonshot-kimi-code |
| `agent.mcp` | MCP | server/client、tools/resources/prompts、接入 | ✓ moonshot-kimi-code |
| `agent.subagent` | Subagent/Multi-agent | 委派、上下文隔离、信息损失 | ✓ moonshot-kimi-code |

## 领域 B · Coding Agent 系统工程

| 技能 ID | 技能 | 要点 | 需要 JD |
|---------|------|------|---------|
| `cagent.exec-recovery` | 错误恢复 | 错误分类、重试上限、checkpoint、死循环检测 | ✓ moonshot-kimi-code |
| `cagent.long-resume` | 长任务续跑 | 状态持久化、上下文重建（非暴力重放） | ✓ moonshot-kimi-code |
| `cagent.verify` | 最终验证 | 编译/测试/回归/diff审查/目标对齐 | ✓ moonshot-kimi-code |
| `cagent.file-edit` | 文件编辑 | 整文件/行号/search-replace/patch 各自失败模式 | ✓ moonshot-kimi-code |
| `cagent.code-search` | 代码搜索 | grep + 语义双模 | ✓ moonshot-kimi-code |
| `cagent.test-run` | 测试运行 | 选择性跑、结构化失败回喂 | ✓ moonshot-kimi-code |
| `cagent.sandbox` | 沙箱/远程执行 | 白名单/Docker/微VM trade-off | ✓ moonshot-kimi-code |
| `cagent.file-selection` | 文件选择 | import 关系/历史/语义排序 | ✓ moonshot-kimi-code |
| `cagent.rag` | 代码检索 RAG | embedding/chunk/混合检索/rerank | ✓ moonshot-kimi-code |

## 领域 C · 质量与进化

| 技能 ID | 技能 | 要点 | 需要 JD |
|---------|------|------|---------|
| `quality.eval` | 评测集构建 | 任务定义/判定/防污染/分桶 | ✓ moonshot-kimi-code |
| `quality.benchmark` | Benchmark | SWE-bench 等 | ✓ moonshot-kimi-code |
| `quality.observability` | 可观测性 | trace schema/指标/viewer | ✓ moonshot-kimi-code |
| `quality.trace-analysis` | Trace 分析 | 失败归类/成败对比/根因定位 | ✓ moonshot-kimi-code |

## 领域 D · 工程基础

| 技能 ID | 技能 | 要点 | 需要 JD |
|---------|------|------|---------|
| `eng.typescript` | TypeScript | 类型系统/异步流式/工程化 | ✓ moonshot-kimi-code |
| `eng.python` | Python | SDK/评测脚本 | ✓ moonshot-kimi-code |
| `eng.testing-ci` | 测试与 CI | mock LLM、Actions | ✓ moonshot-kimi-code |
| `eng.shell` | Shell/进程 | child_process、退出码、超时 | ✓ moonshot-kimi-code |
| `eng.git` | Git 工程化 | diff/patch/分支/回滚 | ✓ moonshot-kimi-code |

## 领域 E · 产品与方法论

| 技能 ID | 技能 | 要点 | 需要 JD |
|---------|------|------|---------|
| `product.tool-critique` | 工具五维对比 | 上下文/工具调用/规划/编辑/恢复 | ✓ moonshot-kimi-code |
| `product.experiment` | 实验设计 | 控制变量/显著性/多维指标 | ✓ moonshot-kimi-code |

---

## 维护说明

- 新 JD 解析后，把用到的技能在此表的「需要 JD」列追加 `✓ <slug>`。
- 全新技能（表里没有的）新增一行，领域归类。
- 岗位专属、不具通用性的技能**不进**此表，留在该 JD 内。
