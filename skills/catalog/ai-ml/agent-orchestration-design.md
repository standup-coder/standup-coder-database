---
contentStatus: outline
id: agent-orchestration-design
type: composite-skill
title: Agent Orchestration Design
nameZh: Agent 编排设计
domain: ai-ml
tags: agent, orchestration, tool-use, multi-agent, ai
catalogSource: internal
catalogFile: skills/agent-orchestration-design.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 6
---

# Agent 编排设计

> 设计多 Agent 编排:角色拆解 → 工具注册 → 控制流 → 记忆与状态 → 评测与追踪,六步走完一个可上线的多 Agent 系统。本技能是 AI/ML 路径的**架构收口**:[agent-orchestration](../ai-ml/agent-orchestration.md) 教你怎么实现单个循环,这里教你怎么设计整个系统。

## 这个技能解决什么问题

单 Agent 能完成简单任务,但任务一复杂(多目标、多工具、长流程),就会出现三类问题,这正是编排设计要解决的:

| 问题 | 单 Agent 表现 | 编排设计的手段 |
|---|---|---|
| **单点失控** | 一个 Agent 又规划又执行,步骤一多就乱、错一步全崩 | 拆角色 + 控制流约束 |
| **工具乱用** | 该调的不调、不该调的乱调 | 工具注册与权限边界 |
| **不可评估** | 跑完不知道好坏,改无可改 | 评测集 + 追踪贯穿 |

**学完之后你应该能**:

- 判断一个任务"该不该多 Agent"(多数任务不该)
- 从需求拆出角色、工具、控制流、记忆四份设计文档
- 为你的编排选拓扑(single / supervisor / swarm / graph)并论证
- 设计评测集与追踪方案,让系统"可度量地变好"

## 前置知识

- [agent-orchestration](../ai-ml/agent-orchestration.md) — 单 Agent 循环的实现基础(ReAct / plan-execute)
- [tool-use-design](../ai-ml/tool-use-design.md) — 工具如何设计、描述、注册
- [agent-memory-design](../ai-ml/agent-memory-design.md) — 记忆与状态设计(步骤 4 的直接输入)
- [agent-evaluation](../ai-ml/agent-evaluation.md) — 轨迹/结果评估方法(步骤 5 的直接输入)
- [llm-app-development](../ai-ml/llm-app-development.md) — 建议先走完它(单 Agent 端到端),再来学多 Agent

> 硬门槛:没做过一个完整的单 Agent 项目前,不要直接多 Agent。编排设计放大的是能力,也放大复杂度。

## 核心概念

### 1. 先问:这个任务需不需要多 Agent?

多 Agent 不是勋章。判断清单(全部满足才考虑):

- 任务含**多个必须分开的角色**(如"写代码的人"和"审查代码的人"不能是同一个人格)
- 各角色需要**不同的工具集与权限**(研究者能查库、执行者能写文件)
- 任务可**并行或分阶段**拆解,拆了不损失一致性
- 单 Agent 实测失败(不是"感觉会失败")

```
任务复杂 →
├─ 单 Agent 能完成?→ 用单 Agent(默认!)
├─ 需要不同人格/工具集?→ supervisor 或 graph
├─ 大量并行子任务?→ swarm(扇出+聚合)
└─ 顺序依赖的多阶段?→ pipeline 或 graph
```

> 反模式:为了"演示多 Agent"而拆 Agent——成本翻倍、延迟翻倍、错误传播翻倍。

### 2. 角色拆解:职责与人格分离

每个角色 = 身份(persona)+ 职责(responsibility)+ 工具集(tools)+ 输出契约(output contract):

| 角色 | 人格 | 职责 | 工具 | 输出 |
|---|---|---|---|---|
| 规划者(Planner) | 严谨项目经理 | 拆任务、排顺序 | 无(或只读) | 任务清单 |
| 研究者(Researcher) | 好奇心强的信息员 | 查资料、汇总证据 | 搜索、爬虫、向量库 | 带引用的报告 |
| 执行者(Executor) | 动手派工程师 | 改代码、写文件 | 文件读写、运行命令 | 代码 + 验证结果 |
| 审查者(Reviewer) | 挑剔的质检员 | 复核结果、挑错 | 只读工具 | 审查意见 |

**设计原则**:

- 角色数 = 职责维度数,不要一个角色干三件事(人格会分裂)
- 每个角色只看到自己需要的工具(权限最小化)——研究者给不了写文件权限
- 输出契约要结构化(JSON),否则下游消费不了

### 3. 控制流:四种拓扑怎么选

| 拓扑 | 结构 | 适合 | 代价 |
|---|---|---|---|
| **single** | 一个 Agent 循环 | 简单任务(默认) | — |
| **supervisor** | 一个主管调度多个 worker | 角色分工明确 | 主管是单点 |
| **swarm** | 扇出到 N 个相同 worker,聚合结果 | 大量独立子任务 | 结果一致性弱 |
| **graph / pipeline** | 节点按 DAG 连接,状态显式流转 | 顺序依赖的多阶段 | 配置复杂 |

```
supervisor 拓扑(示意)
        ┌───────────┐
        │ supervisor │← 分配任务/汇总
        └──┬───┬───┬┘
      ┌────┘   │   └────┐
      ▼        ▼        ▼
  researcher executor reviewer
```

**控制流设计要点**:

- 每个节点定义:输入契约 → 处理 → 输出契约 → 失败处理
- 显式终止条件:最大步数/超时/目标达成,缺一不可
- 循环必须有限:任何节点不得无限重试(次数上限 + 逃生舱直接回人工)

### 4. 记忆与状态:谁记什么、存哪

| 记忆层 | 内容 | 存储 | 谁可读写 |
|---|---|---|---|
| 工作记忆 | 当前步骤上下文 | 窗口内 | 当前节点 |
| 任务状态 | todo / done / 阻塞 | 外部文件或状态库 | 所有节点 |
| 长期记忆 | 跨会话的领域知识 | 向量库 | 按需检索 |

**三原则**:

1. **状态外置**:todo、结论、证据放窗口外文件,Agent 崩溃不丢
2. **最小可见**:节点只看到自己需要的状态片段(研究者不需要执行者的全部日志)
3. **显式同步**:节点间通信走结构化消息(JSON),不走"让下一个 Agent 猜"

### 5. 评测与追踪:让系统可度量

- **结果评估**:任务完成率/输出质量(见 [agent-evaluation](../ai-ml/agent-evaluation.md))
- **轨迹评估**:步骤效率(绕路没有)、工具正确性(该调用什么)
- **追踪**:每个请求一个 trace_id,贯穿所有节点:谁调了什么工具、花了多少步、失败在哪

```
trace 示例(JSONL 一行)
{"trace_id":"t-001","node":"researcher","step":3,"tool":"web_search",
 "input":"...","latency_ms":1200,"error":null,"tokens":512}
```

**可观测性优先级**:先能回放失败(轨迹),再谈优化(指标),最后自动化回归。

## 学习路径

建议 4-6 周,前置 [agent-orchestration](../ai-ml/agent-orchestration.md) 与 [llm-app-development](../ai-ml/llm-app-development.md) 已达标。

### 阶段一:能拆(第 1-2 周)——Junior 水平

**目标**:给现有任务做"该不该多 Agent"评审,能手绘拓扑图。

- 掌握判断清单与四种拓扑
- 会写角色卡(身份/职责/工具/输出)
- 能识别单 Agent 即可的任务

**验收标准**:

- [ ] 拿 3 个任务(含一个明显不需要多 Agent 的)跑判断清单,结论正确
- [ ] 为一个多 Agent 任务画出拓扑图,标注节点契约
- [ ] 能口头论证"为什么不用单 Agent"

### 阶段二:能建(第 3-4 周)——Mid 水平

**目标**:用框架(LangGraph / AutoGen)实现一个小型多 Agent 系统。

- 会实现 supervisor 拓扑(规划→执行→审查)
- 会设计状态外置与结构化消息
- 会为每个节点加 trace 埋点

**验收标准**:

- [ ] supervisor 拓扑跑通三个角色,任务完成率有记录
- [ ] 手动杀死一个节点,系统能恢复(状态外置生效)
- [ ] 追踪能回放一次完整失败轨迹

### 阶段三:能评(第 5-6 周)——Senior 水平

**目标**:评测集 + 追踪 + 回归闭环,能对比两种拓扑并做出决策。

- 会建任务评估集(≥20 条)与轨迹指标
- 会做拓扑对比实验(supervisor vs graph)
- 能把评估接进 CI 回归

**验收标准**:

- [ ] 评估集 + 结果/轨迹双指标闭环,一次改进有数字
- [ ] 对比过两种拓扑,输出决策报告(含延迟/成本/成功率)
- [ ] 回归 CI:改代码后自动跑评估,有基线阈值

## 分步实操:文档调研 Agent(完整案例)

目标是"给一个主题,产出带引用来源的调研报告"。演示六步走完全流程。

### 步骤 1:需求澄清(第 1 天)

**产出:任务定义 + 判断清单**。

- 任务:输入主题,输出 ≤800 字调研报告,每条结论带来源 URL
- 判断清单:需要"查"(研究者)与"写/核"(写作者+审查者)两种角色 → ✅ 多 Agent
- 拓扑候选:supervisor(角色分工明确)
- 质量门槛:引用真实率 ≥95%、报告结构符合模板

**决策**:规模小但角色分明 → supervisor 三节点(研究→写作→审查)。

### 步骤 2:角色拆解(第 1-2 天)

**产出:三张角色卡**。

| 角色 | 人格 | 职责 | 工具 | 输出契约 |
|---|---|---|---|---|
| researcher | 严谨信息员 | 检索 3 个来源并摘录关键事实(带 URL) | web_search, fetch | `{facts: [{claim, url, quote}]}` |
| writer | 结构化写作者 | 按模板组织报告,每条结论标 `[n]` | 无 | `{report_md, citations}` |
| reviewer | 苛刻质检员 | 核对引用真实性与模板合规 | 只读:report | `{passed, issues[]}` |

**设计决策**:writer 不给工具(只消费 facts);reviewer 只读(无副作用)——权限最小化防止越权。

### 步骤 3:工具注册(第 2-3 天)

**产出:工具清单 + 描述**。

```python
tools = [
    {
        "name": "web_search",
        "description": "搜索互联网,返回前 5 条结果的标题与 URL。用于查找主题资料。",
        "parameters": {"query": {"type": "string", "description": "搜索词"}},
    },
    # fetch:抓取 URL 正文前 2000 字
]
```

**设计决策**:工具描述写明"何时用",比写"能干什么"更能引导模型;参数用最小集,减少模型填错。

### 步骤 4:控制流(第 3-5 天)

**产出:拓扑图 + 节点契约**。

```
[主题] → researcher(1-3 轮检索) → writer(1 轮成稿) → reviewer(最多 2 轮修订)
                                              ↑____|issues 非空且轮次 < 2 ____|
成功信号:reviewer passed=true
终止条件:✅ 上限 6 步;⏱ 超时 120s;🚨 逃生舱(3 次失败 → 转人工)
```

**设计决策**:revision 循环限 2 轮——避免"审查者永远挑毛病"的死循环;失败 3 次直接人工兜底,不无限重试。

### 步骤 5:记忆与状态(第 5-6 天)

**产出:状态文件设计**。

```json
{
  "task_id": "t-001",
  "topic": "RAG 评估方法",
  "facts": [{"claim": "…", "url": "…"}],
  "draft": "…",
  "review": {"passed": false, "issues": ["引用[3]无法验证"]},
  "status": "in_progress"
}
```

**设计决策**:facts/draft/review 全外置到状态文件——researcher 结束后 writer 从文件读,不依赖进程内变量;每一步落盘,崩溃可恢复。

### 步骤 6:评测与追踪(第 6-7 天)

**产出:评估集 + trace 埋点**。

- 评估集:10 个主题,金标准含"必须出现的事实点"与"引用合法性"
- 指标:任务完成率、引用真实率(抽样人工核)、平均步数
- 追踪:trace_id 贯穿三个节点,每步记 tool/latency/error

**验收**:10 主题 × 3 次跑,记录成功率与平均耗时;失败案例回放轨迹定位环节。

## 示例

### 示例 1:LangGraph supervisor 最小实现

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated

class State(TypedDict):
    topic: str
    facts: list[dict]
    report: str
    review_issues: list[str]
    turns: int

def researcher(state: State) -> dict:
    facts = search_and_extract(state["topic"])        # 调工具
    return {"facts": facts}

def writer(state: State) -> dict:
    report = compose_report(state["facts"])            # 纯 LLM 成稿
    return {"report": report}

def reviewer(state: State) -> dict:
    issues = check_report(state["report"], state["facts"])  # 只读核查
    return {"review_issues": issues, "turns": state["turns"] + 1}

def route(state: State):
    if not state["review_issues"] or state["turns"] >= 2:
        return END
    return "writer"                                    # 最多修订 2 轮

g = StateGraph(State)
g.add_node("researcher", researcher)
g.add_node("writer", writer)
g.add_node("reviewer", reviewer)
g.set_entry_point("researcher")
g.add_edge("researcher", "writer")
g.add_edge("writer", "reviewer")
g.add_conditional_edges("reviewer", route, {"writer": "writer", END: END})
app = g.compile()

result = app.invoke({"topic": "RAG 评估方法", "turns": 0})
print(result["report"], "issues:", result["review_issues"])
```

**要点**:状态显式在 State 里流转;循环次数由 turns 字段硬限制;reviewer 只读(tools 里不给写权限)。

### 示例 2:角色提示词模板(researcher)

```python
RESEARCHER_PROMPT = """你是调研员,负责收集可验证的事实。
规则:
1. 用 web_search 检索,最多 3 轮,每轮换关键词
2. 每轮选择 1 个最有价值的结果用 fetch 抓取
3. 只输出 JSON:{{"facts": [{{"claim": "…", "url": "…", "quote": "原文摘录"}}]}}
4. 摘录必须逐字取自原文(quote),不得改写
5. 找不到可靠来源时,facts 可以为空,但不得编造
当前主题: {topic}"""
```

**要点**:输出契约 JSON 化 + "quote 必须逐字" + "不得编造"三约束,直接决定下游 writer 的引用真实率。

### 示例 3:追踪埋点

```python
import json, time, uuid

def traced_call(node: str, tool: str, fn, **kwargs):
    trace_id = kwargs.pop("trace_id", str(uuid.uuid4()))
    start = time.time()
    try:
        result = fn(**kwargs)
        error = None
    except Exception as e:
        result, error = None, str(e)
    record({
        "trace_id": trace_id, "node": node, "tool": tool,
        "latency_ms": int((time.time() - start) * 1000),
        "error": error, "ts": time.time(),
    })
    if error:
        raise
    return result
```

**要点**:一个装饰器搞定全链路追踪;失败时 error 字段保留现场——回放能力是优化的前提。

## 练习

产出放入 `personal/` 留档。

### 基础练习(阶段一对应)

- [ ] **P1-1 判断清单**:取 4 个任务(含闲聊助手/客服分流/代码生成/多源调研),逐个跑判断清单,书面结论
- [ ] **P1-2 角色卡**:为一个任务写 3 张角色卡(身份/职责/工具/输出契约),互相评审一次
- [ ] **P1-3 拓扑画图**:画 supervisor 与 pipeline 两种拓扑,标注每个节点的输入输出

### 进阶练习(阶段二对应)

- [ ] **P2-1 最小实现**:用 LangGraph 实现 supervisor 三节点,跑通 5 个任务,记录成功率
- [ ] **P2-2 恢复演练**:运行中手动中断,用状态文件恢复继续,验证"崩溃不丢"
- [ ] **P2-3 轨迹回放**:构造一次失败,用 trace 回放定位到具体节点,写根因说明

### 挑战练习(阶段三对应)

- [ ] **P3-1 评估闭环**:建 20 条任务评估集,跑通"改进→分数上升",保存对比数据
- [ ] **P3-2 拓扑对比**:同一任务分别用 supervisor 与 graph 实现,对比成功率/延迟/成本,输出决策报告
- [ ] **P3-3 回归 CI**:把评估接进 CI(push 自动跑),设阈值,演示一次回归被拦下

## 自测题

1. 判断"该不该多 Agent"的第一问题是什么?
2. supervisor 拓扑的最大风险是什么?怎么缓解?
3. 角色设计里"权限最小化"具体指什么?
4. 为什么状态要外置?窗口内记状态会怎样?
5. 循环节点的"逃生舱"指什么?为什么必须?
6. 评测与追踪哪个优先?为什么?
7. 节点间通信为什么要结构化消息?
8. 评估集里"金标准"最少要含哪两类信息?

<details>
<summary>答案</summary>

1. "单 Agent 能不能完成?"——不能才是多 Agent 的理由;为演示而拆是反模式
2. 主管是单点:它乱全乱。缓解:主管只做调度不做业务、限制其上下文、失败时直接转人工
3. 每个角色只拿到完成职责所需的工具与权限:研究者不能写文件、审查者只读。防越权与误操作
4. 窗口有上限且会压缩丢失;外置(todo/结论/证据落文件或状态库)崩溃可恢复、节点共享一致视图
5. 失败若干次后直接转人工/终止的兜底路径。没有它,循环节点会无限重试烧钱烧时间
6. 先追踪(能回放失败)再评测(指标)。没有轨迹,指标降了都不知道为什么
7. 结构化就是契约:下游确定的字段名与类型,不用"猜上游意图",错误尽早暴露
8. 必须出现的事实点(测召回)+ 输出格式/引用合法性要求(测规范)。只用"像不像"当金标准测不出漏事实
</details>

## 常见错误与反模式

- ❌ **为多 Agent 而多 Agent**——成本/延迟/错误传播三倍,收益为零
- ❌ **一个角色干三件事**——人格分裂,输出不稳定
- ❌ **给所有角色同样的工具**——研究者能写文件,出错面无限放大
- ❌ **状态藏在窗口里**——崩溃全丢,节点间靠猜
- ❌ **无限重试的循环**——审查者永远挑毛病,钱烧完才停
- ❌ **节点间传自由文本**——下游解析靠运气
- ❌ **上线前才想评估**——没有评估集就没有"敢改"的底气
- ❌ **不做追踪**——线上失败无法重放,永远靠猜
- ❌ **没有逃生舱**——系统卡死时无路可退

## 参考资源

- [Anthropic — Building effective agents](https://www.anthropic.com/research/building-effective-agents) — 官方文章,何时单/多 Agent 的判断
- [LangGraph 文档](https://langchain-ai.github.io/langgraph/) — 工具,graph 编排实现
- [OpenAI — Multi-agent research system](https://openai.com/index/browse-compound/) — 案例,多 Agent 生产实践
- [AutoGen 文档](https://microsoft.github.io/autogen/) — 工具,对话式多 Agent 框架
- [AgentBench](https://github.com/THUDM/AgentBench) — 基准,多 Agent 任务评估

## 相关 Skills

- [agent-orchestration](../ai-ml/agent-orchestration.md) — 前置:单 Agent 循环实现
- [tool-use-design](../ai-ml/tool-use-design.md) — 工具注册与描述设计
- [agent-memory-design](../ai-ml/agent-memory-design.md) — 状态与记忆设计
- [agent-evaluation](../ai-ml/agent-evaluation.md) — 结果与轨迹评估
- [llm-app-development](../ai-ml/llm-app-development.md) — 单 Agent 端到端,建议先完成
- [guardrails-safety](../ai-ml/guardrails-safety.md) — 多 Agent 的越权与注入防线
- [context-window-management](../ai-ml/context-window-management.md) — 各节点窗口预算