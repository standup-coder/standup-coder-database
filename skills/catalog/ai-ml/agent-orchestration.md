---
id: agent-orchestration
type: atomic-skill
title: Agent Orchestration
nameZh: Agent 编排
domain: ai-ml
tags: agent, llm, orchestration, multi-agent
catalogSource: internal
catalogFile: atomic-skills/agent-orchestration.json
catalogAddedAt: 2026-07-26
operation: ai-llm
level: senior
---

# Agent 编排

> 让多个 LLM Agent 分工、通信、协作并**可靠地收敛于正确答案**:难点不是让它们跑起来,而是让它们停下、不跑偏、可追踪。

## 这个技能解决什么问题

单次 LLM 调用能答好一个问题,但解决"查资料 → 分析 → 写报告 → 校验"这类多步任务,需要 Agent:循环调用模型、工具与外部世界,直到任务完成。再往上,多个 Agent 分工(一个调研、一个撰写、一个审查)能并行推进,但也带来了失控风险:

| 问题 | 现象 | 本技能给出的解法 |
|---|---|---|
| **不知道什么时候停** | 两个 Agent 互相"你说得对,我补充一下",token 烧完才被硬截断 | 显式终止条件:最大步数 + 目标判定 + 置信阈值 |
| **跑偏不收敛** | Agent 在无关方向上越走越远,答案越来越长但越来越错 | 终止条件 + supervisor 收敛 + 确定性流程包裹 |
| **状态混乱** | Agent 之间的消息丢失、重复、顺序错乱,无法复现 | 状态集中在编排器,消息带 trace_id/step_id |
| **角色重叠** | 三个 Agent 都想做总结,决策权不清 | 角色契约:输入/输出/职责边界写死 |
| **为了多而多** | 简单任务套了 5 个 Agent,延迟和成本翻倍 | 从单 Agent 起步的拓扑选型标准 |
| **一挂全挂** | 一个工具超时,整个编排卡死 | 超时、重试与降级的容错设计 |

学完之后你应该能:

- 讲清单 Agent 循环(感知-规划-行动-观察)的每一步与数据流
- 在 ReAct 与 plan-execute 两种范式之间做出有依据的选择
- 按选型标准选择 supervisor / swarm / hierarchical / pipeline 拓扑,并画拓扑图
- 设计状态管理与循环控制(最大步数、终止条件、状态集中)
- 实现超时/重试/降级容错,并设计可观测的 trace
- 用 LangGraph 或手写循环实现一个完整的多 Agent 系统

## 前置知识

动手前,建议先掌握(按依赖顺序):

1. **工具调用设计**([tool-use-design](../ai-ml/tool-use-design.md))——Agent 的"手脚",循环里每轮行动都要用工具,工具质量决定 Agent 上限
2. **高级提示工程**([prompt-engineering-advanced](../ai-ml/prompt-engineering-advanced.md))——ReAct 范式、系统提示设计与红队测试
3. **LLM 评估**([llm-evaluation](../ai-ml/llm-evaluation.md))——终止条件与收敛判定需要"如何度量任务成功"的方法
4. **基础 API 调用**([api-call](../security/api-call.md))——能写代码调 LLM API,因为本技能全部是代码
5. **安全基础**([guardrails-safety](../ai-ml/guardrails-safety.md))——多 Agent 会放大注入风险,需要安全边界意识

如果你是从零开始:先读完 1-3 再回来。本技能默认你**写过完整的 tool loop**(单 Agent 循环的手写版)。

## 核心概念

本技能由六个概念组成:第 1-2 个是范式(单 Agent 怎么转、两种主循环怎么写),第 3-4 个是拓扑与状态(多个 Agent 怎么组织、状态放哪),第 5-6 个是可靠性与可观测(怎么不挂、怎么查)。

### 1. 单 Agent 循环:感知-规划-行动-观察

一切编排的地基是单个 Agent 的循环。经典表述是 ReAct(Reason + Act),四个阶段循环往复:

```text
┌────────────────────────────────────────────┐
│  感知(Observation)                          │
│  把环境信息(用户问题、工具结果、历史)汇入上下文 │
└──────────────────┬─────────────────────────┘
                   ↓
┌────────────────────────────────────────────┐
│  规划(Thought)                              │
│  模型推理:现在状态如何?下一步该做什么?        │
└──────────────────┬─────────────────────────┘
                   ↓
┌────────────────────────────────────────────┐
│  行动(Action)                               │
│  调用工具 / 输出最终答案(二者互斥)            │
└──────────────────┬─────────────────────────┘
                   ↓
   若行动是工具调用 → 执行工具,结果作为新的感知,回到循环
   若行动是最终答案 → 循环终止
```

数据流规则(决定了代码怎么写):

- **唯一的持久状态是消息历史**(messages),循环的每一轮就是追加一条助手消息(含 thought 与 tool_calls)和对应的工具结果
- **模型看到的"感知"= 全部历史 + 本轮工具结果**,不需要额外的黑板
- **终止判定 = 模型不再要求调用工具**,或达到最大轮数
- 工具结果与 tool_call 必须**按序成对**回传,顺序错误模型会"失忆"(参照 [tool-use-design](../ai-ml/tool-use-design.md) 示例 1)

> **要点**:单 Agent 循环的核心不是"聪明",是**纪律**——历史只增不改、终止条件显式、每轮都是同一形态。先把纪律做到位,再谈多 Agent。

### 2. 两种主范式:ReAct 与 plan-execute

多步任务的循环有两种主流写法,决定 Agent 的"行为风格":

| 维度 | ReAct(边想边做) | plan-execute(先规划再执行) |
|---|---|---|
| 节奏 | 一步一推理,观察结果再走下一步 | 先产出完整计划(步骤列表),再逐步执行 |
| 适应性 | 高:途中发现新信息可随时改道 | 低:计划定后不易中途大变 |
| 可预测性 | 低:行为依赖每一步的模型判断 | 高:计划可审查、可人工批准后再执行 |
| 失败模式 | 反复原地打转、在错误路径上越走越远 | 计划本身错误 → 整个执行白费(但发现得早) |
| 成本 | 每步一次调用,步数不可控 | 规划一次 + 每步一次,步数先已知 |
| 适合 | 探索性任务:排障、问答、研究 | 确定性任务:批量处理、数据流水线、报告生成 |

**选型判断**:

- 任务有明确、可枚举的步骤(清洗 → 转换 → 汇总)→ plan-execute
- 任务要边做边发现(排查故障、开放式调研)→ ReAct
- 折中方案:**plan-execute + 执行中允许修订计划**(每执行几步让模型检查计划是否仍成立),这是生产中最常见的形态

> **要点**:ReAct 是"走一步看一步",plan-execute 是"先画地图再出发"。地图能人工审查是 plan-execute 最大的工程价值——**让 LLM 的决策暴露在可审查的位置**,而不是藏在每一步里。

### 3. 多 Agent 拓扑:四种模式与选型标准

多 Agent 不是"放更多模型",而是**把决策权分配出去**。四种主流拓扑:

| 拓扑 | 结构 | 什么时候用 | 典型框架支持 |
|---|---|---|---|
| **Pipeline(流水线)** | Agent A → B → C 串行,各干一段(如 调研→撰写→校对) | 阶段天然顺序、前步输出是后步输入 | 手写即可,LangGraph |
| **Supervisor(主管-工人)** | 一个 supervisor 把任务分派给 worker,汇总/仲裁结果 | 任务可分解、结果需要收敛与质量把关 | LangGraph、AutoGen |
| **Hierarchical(层级)** | supervisor 套 supervisor,多级树 | 任务规模大、子域多,单层主管管不过来 | LangGraph、AutoGen |
| **Swarm(群体协作)** | 对等 Agent 互相传递消息,动态交接 | 角色对等、边界模糊的协作(客服转接链) | OpenAI Swarm、CrewAI |

**选型标准(按顺序问)**:

1. 任务**必须先全部完成才能开始下段**吗?→ Pipeline
2. 结果需要**统一收敛、质量把关**吗?→ Supervisor
3. 子任务**是否足够独立、可并行**?→ 并行 worker 挂在 supervisor 下
4. 任务域是否**大到单主管决策不过来**?→ Hierarchical 分层
5. 参与方**真实对等、无领导小组**?→ 才考虑 Swarm

> **Select 铁律**:从单 Agent + 工具起步,证明单 Agent 撑不住(输出质量、步数、延迟),再上多 Agent。**为了多而多是反模式**,多 Agent 的复杂度(状态、通信、调试)是平方级增长的。

### 4. 状态管理与循环控制

系统里的一切可变数据都叫状态:消息历史、中间结果、计数器、任务队列。铁律:

- **Agent 本身无状态**:模型每次调用之间不保留任何记忆,状态一律存在编排器(或外部存储/记忆服务)
- **状态集中**在编排器:没有"Agent 私有变量",任何一步可被 dump 出来复现
- **状态是消息历史 + 上下文变量 + 运行元数据**(步数、耗时、花费),三者分开管理

循环控制(让系统**必须能停**)三件套:

1. **最大步数**:循环级硬上限(如 25 轮)——防死循环的最后闸门,超限走"尽力回答 + 声明未完成"
2. **目标判定**:定义"任务完成"的可检查条件——输出通过 schema 校验?所有必查项已查?计划步骤全部执行?
3. **置信阈值/收敛判定**:重复产出相同(或高度相似)结果达到 N 次 → 判定已收敛,停止——防"两个 Agent 互相吹捧"的经典死循环

```text
终止条件优先级:目标达成 > 收敛判定 > 最大步数 > 外部超时
```

> **要点**:终止条件是**编排器的职责,不是模型的自觉**。模型说"我完成了"不算数,编排器按可检查条件判定才算数。

### 5. 容错与超时

多 Agent 系统的故障面比单 Agent 大:LLM 调用可能失败,工具可能超时,子 Agent 可能产出垃圾。容错设计四层:

1. **调用层**:LLM/工具调用带超时(LLM 60s、工具 10-30s),失败按重试策略(指数退避 1-3 次)自动重试
2. **步骤层**:单步失败不炸整个系统——supervisor 收到失败步骤后,可选"重试该步 / 换 Agent 重做 / 标记跳过继续"
3. **编排层**:整个 run 有总超时与预算上限(token 数、花费、步数),超预算走优雅降级(返回已完成部分 + 未完成清单)
4. **语义层**:子 Agent 输出要过 schema 校验与质量检查(空输出、废话检测),不合格打回重做(重做上限 2 次)

**结构性兜底**:把 LLM 的自由决策用确定性流程包裹——固定流程(Pipeline 阶段顺序、必做清单)由代码执行,LLM 只填"内容空位"。决策面越小,系统越稳(参考"示例 3"的 check_plan 执行器)。

### 6. 可观测性:每一步都可追溯

多 Agent 调试的痛点:出了错不知道是哪个 Agent、哪一步、哪条消息导致的。对策——**全链路 trace**:

| 追踪字段 | 内容 | 用途 |
|---|---|---|
| `trace_id` | 一次任务的全局 ID | 聚合整条链 |
| `step_id` | 单个循环步的唯一 ID,记录父 step_id | 还原拓扑与嵌套关系 |
| `agent` / `tool` | 当前执行者与工具名 | 定位责任方 |
| `thought` / `args` / `result` | 模型推理、调用参数、工具结果 | 复盘每一步决策 |
| `duration` / `cost` / `tokens` | 每步耗时与花费 | 优化成本与延迟 |

落地方式:手写 JSONL 日志(每步一行)或接标准可观测性栈([distributed-tracing](../devops/distributed-tracing.md) 的思路在 Agent 场景同样适用:trace_id 贯穿、采样存储、关联查询)。**trace 不是上线后才加,是从第一个 demo 就带**——没有 trace 的多 Agent 系统,出问题只能靠猜。

## 学习路径

按 8-12 周规划,每阶段有验收标准,达标才进入下一阶段。

### 阶段一:单 Agent 循环(第 1-3 周)——Junior 水平

**目标**:手写一个带工具、带终止条件的 ReAct 循环。

- 理解感知-规划-行动-观察的数据流与消息历史规则
- 实现最大步数、目标判定两种终止条件
- 会为循环加 trace_id/step_id 日志

**验收标准**:

- [ ] 手写 ReAct 循环(参考示例 1),接 3 个工具跑通一个多步任务
- [ ] 故意让模型陷入循环(给它一个无法完成的任务),验证最大步数生效并输出"未完成"声明
- [ ] 输出一份 JSONL trace,能说出任意一步的 agent、tool、耗时

### 阶段二:范式与拓扑(第 4-7 周)——Mid 水平

**目标**:掌握两种范式,能实现 supervisor + worker 拓扑。

- 对比 ReAct 与 plan-execute,为任务选型并说明理由
- 用 LangGraph 实现 supervisor + worker(或手写轮询式 supervisor)
- 状态集中管理,消息带 trace_id

**验收标准**:

- [ ] 用 LangGraph(或手写)实现 supervisor + 3 个 worker 的任务分发与结果收敛
- [ ] 同一任务分别用 ReAct 与 plan-execute 实现,记录步数、token、成功率,写对比结论
- [ ] 为系统画出拓扑图,标注每条边的消息格式

### 阶段三:生产专家(第 8-12 周)——Senior 水平

**目标**:可终止、可观测、可演进的生产级多 Agent 系统。

- 容错四层(调用/步骤/编排/语义)全部落地
- 收敛判定与预算控制,超限优雅降级
- 团队级 trace 规范与评测基线

**验收标准**:

- [ ] 为系统注入 3 类故障(工具超时、LLM 失败、子 Agent 输出垃圾),系统自动恢复或优雅降级,无人值守
- [ ] 建立任务成功率基线(评估集 ≥30 条,[agent-evaluation](../ai-ml/agent-evaluation.md) 方法),后续改动对照基线
- [ ] 输出《编排设计文档》:拓扑图、终止条件、状态定义、容错策略、trace 字段规范

## 分步实操:从零构建一个可收敛的多 Agent 系统

**先定终止条件与评估,再写任何 Agent**——没有"完成标准"的系统,写出来就是失控的。

```
第 1 步:定义任务与成功标准
   ↓
第 2 步:单 Agent 循环打底(带工具)
   ↓
第 3 步:加终止条件三件套(步数/目标/收敛)
   ↓
第 4 步:选拓扑,拆角色,定消息契约
   ↓
第 5 步:加容错(超时/重试/打回重做)
   ↓
第 6 步:接 trace,建评估基线
```

### 第 1 步:定义任务与成功标准

- 任务一句话:输入什么、输出什么、给谁用
- 成功标准可检查:输出 schema 校验通过?所有必查项齐备?人工抽检通过率?

### 第 2 步:单 Agent 打底

- 用 [tool-use-design](../ai-ml/tool-use-design.md) 的工具写好工具集,接入手写循环(示例 1 的骨架)
- 先证明单 Agent + 工具能完成 80% 场景,再谈拆分

### 第 3 步:终止条件三件套

- 最大步数(硬上限)→ 目标判定(输出校验)→ 收敛判定(结果重复)
- 写测试验证每条终止路径都能触发

### 第 4 步:拓扑与角色契约

- 按选型标准选拓扑;每个 Agent 写角色卡片:职责 / 输入 schema / 输出 schema / 工具子集 / 禁止事项
- 定义消息格式(JSON schema),边与边的消息必须可校验

### 第 5 步:容错

- 所有外部调用(LLM/工具)加超时与重试;子 Agent 输出过校验,不合格打回重做(上限 2 次);全程预算控制

### 第 6 步:trace 与评估

- 每步一行 JSONL(字段见概念 6);建 ≥30 条评估集记录成功率基线;此后每次改动对照基线

## 示例

三个示例分别覆盖:手写循环(范式 1)、框架实现(拓扑)、plan-execute(范式 2 + 确定性包裹)。示例 1、3 零依赖可跑,示例 2 需要 LangGraph。

### 示例 1:手写 ReAct 循环(带终止条件三件套)

```python
"""最小但完整的 ReAct 循环:感知-规划-行动-观察,带步数上限与收敛判定。

环境:Python 3.10+,pip install openai;需要 OPENAI_API_KEY。
工具:简化版天气查询与城市搜索(用字典模拟真实后端)。
"""
import json
from openai import OpenAI

client = OpenAI()

TOOLS = [
    {"type": "function", "function": {
        "name": "search_city",
        "description": "按名称搜索城市,返回城市 ID。何时用:用户提到城市名但你需要城市 ID 时。",
        "parameters": {"type": "object", "properties": {
            "name": {"type": "string", "description": "城市名,如 '北京'"}},
            "required": ["name"], "additionalProperties": False},
    }},
    {"type": "function", "function": {
        "name": "get_weather",
        "description": "查询城市天气。前置:city_id 必须来自 search_city 的返回。",
        "parameters": {"type": "object", "properties": {
            "city_id": {"type": "string", "description": "城市 ID,来自 search_city"}},
            "required": ["city_id"], "additionalProperties": False},
    }},
]

CITIES = {"101010100": "北京", "101020100": "上海"}
WEATHER = {"101010100": "晴,-2°C", "101020100": "小雨,8°C"}

def execute_tool(name: str, args: dict) -> str:
    if name == "search_city":
        for cid, city in CITIES.items():
            if city == args["name"]:
                return json.dumps({"city_id": cid, "name": city})
        return '{"error": "未找到该城市", "retryable": false, "hint": "请确认城市名是否正确"}'
    if name == "get_weather":
        return json.dumps({"city_id": args["city_id"], "weather": WEATHER.get(args["city_id"], "无数据")})
    return '{"error": "未知工具"}'

def run_agent(user_input: str, max_steps: int = 8) -> str:
    messages = [{"role": "user", "content": user_input}]
    last_answers: list[str] = []          # 用于收敛判定

    for step in range(max_steps):
        # ── 规划:模型决定是调用工具还是直接回答 ──
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            tools=TOOLS,
            tool_choice="auto",
            temperature=0,
        )
        msg = resp.choices[0].message

        if not msg.tool_calls:
            # ── 目标判定 1:模型给出最终答案 → 收敛性检查后终止 ──
            answer = msg.content or ""
            last_answers.append(answer)
            if len(last_answers) >= 2 and last_answers[-1] == last_answers[-2]:
                return answer                       # 连续两次答案相同,判定收敛
            if step == max_steps - 1:
                return answer + "\n[提示:已达最大步数,答案可能不完整]"
            # 模型提前回答但任务可能未完:再给一次机会观察
            messages.append(msg.model_dump(exclude_none=True))
            continue

        # ── 行动:执行全部工具调用 ──
        messages.append(msg.model_dump(exclude_none=True))
        for call in msg.tool_calls:
            result = execute_tool(call.function.name, json.loads(call.function.arguments))
            messages.append({"role": "tool", "tool_call_id": call.id, "content": result})
            print(f"[step {step}] {call.function.name}({call.function.arguments}) → {result}")

    # ── 目标判定 2:步数耗尽,优雅降级 ──
    return "未能在限制步数内完成,请提供更多信息或拆分任务。"

print(run_agent("北京和上海今天天气怎么样?"))
```

**要点**:① 终止条件三件套都在编排器手里(步数上限、答案收敛、降级声明),不依赖模型自觉;② 工具结果即时打印形成 trace;③ "连续两次相同答案"是防抖的收敛判定——两 Agent 互相吹捧时,重复输出会触发它:④ 全流程零框架依赖,先理解循环再上框架。

### 示例 2:Supervisor + Worker 拓扑(LangGraph)

```python
"""supervisor + 3 worker:调研报告生成器。
supervisor 分派任务并汇总;worker 各司其职(搜索/分析/撰写)。

环境:Python 3.10+,pip install langgraph openai langchain-openai
需要 OPENAI_API_KEY。运行:python supervisor_demo.py
"""
from typing import Literal, TypedDict
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# ── 状态:集中在图里,任何节点可读可写 ──
class State(TypedDict):
    topic: str            # 任务主题
    research: str         # worker1 产出:资料
    plan: str             # worker2 产出:提纲
    report: str           # worker3 产出:成稿
    attempts: int         # 打回重做计数(语义层容错)

# ── supervisor:分派与汇总(用结构化输出决定交给谁/是否结束) ──
def supervisor(state: State) -> dict:
    prompt = f"""你是编辑,主题:{state['topic']}。
    已完成的环节:资料={'有' if state.get('research') else '无'},提纲={'有' if state.get('plan') else '无'},成稿={'有' if state.get('report') else '无'}。
    决定下一步:research(缺资料)/ plan(缺提纲)/ write(缺成稿)/ finish(全部完成)。只输出一个词。"""
    decision = llm.invoke(prompt).content.strip().lower()
    if decision not in ("research", "plan", "write", "finish"):
        decision = "research"                     # 兜底:模型乱说就重来缺失环节
    print(f"[supervisor] → {decision}")
    return {"attempts": state.get("attempts", 0) + 1}

# ── worker:各干一段,输出契约固定(字典返回) ──
def do_research(state: State) -> dict:
    result = llm.invoke(f"为「{state['topic']}」列出 5 条关键事实,每条约 30 字。").content
    if len(result) < 20:                          # 语义层校验:空话输出打回
        print("  [research] 输出过短,标记失败")
        return {"research": "【资料不足,需重试】"}
    return {"research": result}

def do_plan(state: State) -> dict:
    return {"plan": llm.invoke(f"基于以下资料写提纲(3 节):\n{state['research']}").content}

def do_write(state: State) -> dict:
    return {"report": llm.invoke(f"按提纲成稿 150 字:\n提纲:{state['plan']}\n资料:{state['research']}").content}

def should_retry(state: State) -> Literal["research", "write", END]:
    """打回重做判断:资料不足且未超 2 次 → 重做 research;否则继续。"""
    if "资料不足" in state.get("research", "") and state.get("attempts", 0) < 4:
        return "research"
    return "write" if not state.get("report") else END

# ── 构图:确定性流程 + LLM 决策点(supervisor) ──
g = StateGraph(State)
g.add_node("supervisor", supervisor)
g.add_node("research", do_research)
g.add_node("plan", do_plan)
g.add_node("write", do_write)
g.set_entry_point("supervisor")
g.add_conditional_edges("supervisor",
    lambda s: s["plan"] if s.get("plan") else ("research" if not s.get("research") else "plan"),
    {"research": "research", "plan": "plan", "write": "write", "finish": END})
g.add_edge("research", "plan")
g.add_edge("plan", "write")
g.add_conditional_edges("write", should_retry, {"research": "research", "write": "write", END: END})

app = g.compile()
result = app.invoke({"topic": "大语言模型的工具调用机制", "attempts": 0})
print("\n===== 成稿 =====")
print(result["report"])
```

**要点**:① 状态集中在 State dict,任何节点可读写,天然可 dump 复现;② supervisor 的"决策点"显式暴露——模型只输出一个枚举词,乱说由代码兜底;③ 语义层容错:worker 输出过短 → 打回 research(带重试上限),这就是"打回重做"模式;④ 终止 = finish 分支或图结构走完,无死循环可能(图上没有回环到 supervisor 的死路,重试有上限)。

### 示例 3:Plan-Execute 范式(先规划再执行 + 可审查计划)

```python
"""plan-execute 手写版:先产出可审查计划,再逐步执行,每步校验。

与 ReAct 的区别:规划一次到位,执行器按计划走,每步只做"填空"。
环境:Python 3.10+,pip install openai;需要 OPENAI_API_KEY。
"""
import json
from openai import OpenAI

client = OpenAI()

# ── 第 1 阶段:规划(只做一次,产出结构化计划) ──
def make_plan(task: str) -> list[dict]:
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": (
            "把任务拆成 2-4 个顺序步骤。每个步骤输出 JSON:"
            '{"step": 序号, "action": "做什么", "check": "如何判定这步完成"}。'
            f"任务:{task}"
        )}],
        response_format={"type": "json_object"},
        temperature=0,
    )
    plan = json.loads(resp.choices[0].message.content)
    steps = plan.get("steps", [])
    # 规划结果也要校验:步骤数、字段齐全,失败则重试一次
    assert 2 <= len(steps) <= 4, "计划步骤数异常"
    return steps

# ── 第 2 阶段:执行(每步:生成 → 校验 → 通过才进入下一步) ──
def execute_plan(task: str, steps: list[dict]) -> list[str]:
    outputs, context = [], ""
    for i, s in enumerate(steps, 1):
        # 每步是"填空":只完成本步骤,输入是上一步的产出
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": (
                f"总任务:{task}\n当前步骤 {i}/{len(steps)}:{s['action']}\n"
                f"上一步产出:\n{context or '(无)'}\n只完成当前步骤,简短输出。"
            )}],
            temperature=0,
        )
        out = resp.choices[0].message.content.strip()
        # 校验:空输出/过短 → 重试一次,仍失败则标记跳过并继续
        if len(out) < 10:
            out = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": f"上一步输出无效,请重新执行:{s['action']}"}],
            ).choices[0].message.content.strip()
            if len(out) < 10:
                out = f"[步骤 {i} 执行失败,已跳过]{s['action']}"
        outputs.append(out)
        context = out
        print(f"[执行] 步骤 {i}/{len(steps)} ✓ ({s['action']})")
    return outputs

# ── 执行器:确定性流程包裹,LLM 只填内容空位 ──
task = "写一份 200 字的产品发布公告,面向开发者"
plan = make_plan(task)
print("=== 计划(可人工审查/修改)===")
for s in plan:
    print(f"  {s['step']}. {s['action']}  [完成判定:{s['check']}]")

outputs = execute_plan(task, plan)
print("\n=== 最终拼接(确定性流程)===")
print("\n\n".join(outputs))
```

**要点**:① 计划先产出且**可人工审查**——这是 plan-execute 对 ReAct 的核心工程优势;② 执行阶段每步只做"填空",上下文是上一步产出,模型决策面被压缩到最小;③ 每步有校验与重试,失败"标记跳过继续",不炸整条链;④ 把 LLM 决策用确定性循环包裹(步骤顺序、校验、拼接都是代码),这是生产系统稳定性的关键。

## 练习

按顺序完成,产出放进 `personal/` 留档。

### 基础练习

- [ ] **P1-1 手写 ReAct**:实现示例 1 的循环并接 3 个自选工具跑通一个 3 步任务;判定:全程无人干预,输出正确
- [ ] **P1-2 终止条件实验**:给循环设 3 种终止(步数上限/收敛判定/目标判定),各构造一个触发场景;判定:每种都按预期触发并留下 trace
- [ ] **P1-3 trace 字段**:为循环输出 JSONL(每行含 step_id/agent/tool/thought/耗时);判定:能凭日志还原一次完整运行

### 进阶练习

- [ ] **P2-1 范式对比实验**:同一任务(如"调研并总结一个技术话题")分别用 ReAct 与 plan-execute 实现;判定:记录步数/token/成功率,写出差异结论与选型建议
- [ ] **P2-2 supervisor 实现**:用 LangGraph 或手写实现 supervisor + 3 worker(参考示例 2);判定:10 个不同任务成功率 ≥80%,且无死循环
- [ ] **P2-3 角色契约文档**:为你的系统写角色卡片(职责/输入 schema/输出 schema/工具子集/禁止事项);判定:另一人按卡片能写出对等的 worker

### 挑战练习

- [ ] **P3-1 故障注入测试**:向系统注入工具超时、LLM 报错、子 Agent 输出垃圾三类故障;判定:无人值守下系统自动恢复或优雅降级,不挂死
- [ ] **P3-2 预算与收敛治理**:实现 token/花费/步数三重预算与收敛判定,超限优雅降级;判定:预算超限时返回"已完成部分 + 未完成清单"
- [ ] **P3-3 团队级交付**:输出《编排设计文档》(拓扑图/终止条件/状态定义/容错/trace 规范)+ 30 条评估集基线;判定:文档可指导他人复现系统,改动对照基线有记录

## 自测题

先独立作答,再对照题后答案。答不出的题对应回看相关章节。

1. 单 Agent 循环的四个阶段是什么?循环的终止由谁判定、依据什么?
2. ReAct 与 plan-execute 各自适合什么任务?"走一步看一步"与"先画地图再出发"各自的失败模式是什么?
3. 四种多 Agent 拓扑是什么?选型时第一个该问的问题是什么?
4. "Agent 是无状态的"是什么意思?状态应该放在哪里?为什么?
5. 两个 Agent 互相"你说得对,我补充"停不下来,你靠什么机制让它停?(至少两条)
6. 子 Agent 返回了一段空话作为"调研结果",你的系统在哪一层、用什么机制处理?
7. trace_id 与 step_id 各解决什么问题?子 Agent 的步骤如何关联到一次任务?
8. 你的系统 supervisor 一步失败,整个 run 崩溃。按容错四层,应该在哪一层做什么?
9. 为什么说"模型说'我完成了'不算数"?目标判定应该基于什么?
10. 什么信号出现时,你应该把单 Agent 拆成多 Agent?(说出两个正当理由)

<details>
<summary>答案</summary>

1. 感知-规划-行动-观察;终止由**编排器**判定,依据:目标达成(输出校验通过)/ 收敛判定(结果重复)/ 最大步数,优先级按此顺序
2. ReAct 适合探索性任务(排障、开放研究),失败模式是错误路径上越走越远;plan-execute 适合步骤明确的任务,失败模式是计划错了整个白费,但计划可人工审查、发现得早
3. Pipeline / Supervisor / Hierarchical / Swarm;第一个问题:"任务必须先全部完成才能开始下段吗"(决定是否 Pipeline),以及更前置的"单 Agent 是否已经证明撑不住"
4. 模型每次调用之间没有记忆,不保留任何可变状态;状态集中在编排器(或外部存储);只有集中,才能 dump、复现、恢复
5. 收敛判定(连续相同/相似输出 N 次即终止)+ 最大步数硬上限;必要时 supervisor 仲裁
6. 语义层校验:子 Agent 输出过 schema/质量检查,不合格打回重做,重做上限 2 次,超限标记失败继续或降级
7. trace_id 聚合一次任务的整条链,step_id 还原每一步的嵌套关系(父 step_id 表示谁调了谁);子 Agent 记录任务级 trace_id 与自己的 step_id 树
8. 步骤层:supervisor 收到失败后选择重试该步/换 Agent/标记跳过继续,而不是向上抛;同时编排层有总预算兜底
9. 因为模型对"完成"的判断不可检查、不可复现;目标判定必须基于可检查条件(输出 schema、必查项清单、计划步骤完成度)
10. 单 Agent 在评估集上证明不够(质量不达标/步数爆炸/延迟超标)或任务天然需要并行与专业分工;反之,"为了多而多"是反模式
</details>

## 常见错误与反模式

- ❌ **无终止条件,靠超时硬截断**——token 烧完才停;终止三件套:步数上限 + 目标判定 + 收敛判定
- ❌ **Agent 互相吹捧死循环**——"你说得对"(收敛判定)识别重复输出即终止
- ❌ **为了多 Agent 而多 Agent**——简单任务被复杂化;先证明单 Agent 撑不住
- ❌ **所有 Agent 共享全部上下文**——token 爆炸 + 相互干扰;只给每个 Agent 需要的输入
- ❌ **Agent 角色重叠**——决策权不清、互相抢活;角色契约:职责/输入/输出/工具子集写死
- ❌ **状态散落在各 Agent 的"记忆"里**——无法复现;状态集中,Agent 无状态
- ❌ **模型说完成就结束**——不可检查;目标判定用 schema/必查项,编排器说了算
- ❌ **一步失败全链崩溃**——容错四层:调用重试、步骤打回、编排预算、语义校验
- ❌ **没有 trace 就上线**——出问题靠猜;trace_id/step_id 从第一个 demo 就带
- ❌ **LLM 管流程,代码管内容**——决策面太大;确定性流程包裹,LLM 只填空

## 参考资源

- [ReAct: Synergizing Reasoning and Acting (Yao et al.)](https://arxiv.org/abs/2210.03629) — 论文,单 Agent 循环的奠基范式
- [Plan-and-Solve Prompting (Wang et al.)](https://arxiv.org/abs/2305.04091) — 论文,计划先行范式的依据
- [LangGraph](https://github.com/langchain-ai/langgraph) — 工具,图式编排框架,StateGraph 与 supervisor 模式
- [LangGraph 官方文档](https://langchain-ai.github.io/langgraph/) — 文档,多 Agent 拓扑的实现参考
- [AutoGen (Microsoft)](https://github.com/microsoft/autogen) — 工具,对话式多 Agent 框架
- [CrewAI](https://github.com/crewAIInc/crewAI) — 工具,角色制多 Agent 框架
- [Building Effective Agents (Anthropic)](https://www.anthropic.com/research/building-effective-agents) — 官方文章,workflow 与 Agent 的工程模式(含多 Agent 拓扑建议)
- [Multi-Agent Research System (Anthropic)](https://github.com/anthropics/multi-agent-research-system) — 工具,生产级多 Agent 编排参考实现(含 trace 与终止设计)

## 相关 Skills

- [tool-use-design](../ai-ml/tool-use-design.md) — 前置,Agent 循环的行动层依赖的工具设计
- [agent-orchestration-design](../ai-ml/agent-orchestration-design.md) — 进阶,完整的编排设计工作流(需求→角色→工具→控制流→记忆→评测)
- [agent-memory-design](../ai-ml/agent-memory-design.md) — 配套,跨会话记忆/状态的外部化设计
- [agent-evaluation](../ai-ml/agent-evaluation.md) — 配套,多 Agent 系统的评测方法与基线
- [llm-evaluation](../ai-ml/llm-evaluation.md) — 前置,评估集的建立与度量
- [continuous-agent-loop](../security/continuous-agent-loop.md) — 配套,长驻循环 Agent 的安全审计
- [distributed-tracing](../devops/distributed-tracing.md) — 配套,trace 方法论在 Agent 场景的落地
- [mcp-server-development](../ai-ml/mcp-server-development.md) — 配套,Agent 的工具来源