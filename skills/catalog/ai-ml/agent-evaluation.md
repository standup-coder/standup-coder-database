---
id: agent-evaluation
type: atomic-skill
title: Agent Evaluation
nameZh: Agent 评估
domain: ai-ml
tags: agent, evaluation, llm, reliability, benchmarking
catalogSource: internal
catalogFile: atomic-skills/agent-evaluation.json
catalogAddedAt: 2026-07-26
operation: ai-llm
level: mid
---

# Agent 评估

> 评估 LLM Agent 的可靠性、任务完成率、工具调用正确性、幻觉率与步骤效率。学完本技能,你能把"这个 Agent 到底行不行"从玄学变成可复现的分数,并防止多步轨迹中的错误悄悄累积成线上事故。

## 这个技能解决什么问题

单轮 LLM 评估问的是"这一问答得好不好";Agent 评估问的是"让它自己干完一件多步的活,干成了没有、干得漂不漂亮"。

Agent 比单轮对话难评估得多:它可能走了 20 步才完成(或失败)一个任务;中途每步的工具调用都可能出错,而错误会**累积**——第 3 步拿到的错误数据,会让第 9 步的决策全错;它还会调用真实工具,一个错误的参数可能触发真实副作用(发了邮件、扣了款、删了文件)。

| 单轮 LLM 评估 | Agent 评估 |
|---|---|
| 输入 → 输出,一步 | 状态 → 思考 → 工具调用 → 观察 → 循环多步 |
| 结果对了基本就对 | 结果对了也可能过程有毒(走了 30 步、乱调工具) |
| 无副作用 | 工具副作用不可逆,评估必须进沙箱 |
| 失败只在一处 | 失败可能发生在规划、工具参数、上下文丢失任意环节 |

学完之后你应该能:

- 说出 Agent 评估与单轮 LLM 评估的核心区别,并解释"多步累积错误"为什么让评估更难
- 用"任务完成率 × 工具调用正确性 × 步骤效率 × 安全违规"四维框架给 Agent 打分区
- 判断你的场景该用结果评估还是轨迹评估(或两者结合)
- 在沙箱/模拟工具环境里搭建可重复的评估环境,避免污染真实数据
- 看懂 AgentBench、WebArena、GAIA、τ-bench 等主流基准集的定位与局限
- 为生产 Agent 设计"追踪 + 回放"的持续评估机制

## 前置知识

按依赖顺序,建议先掌握:

1. **LLM 评估**([llm-evaluation](../ai-ml/llm-evaluation.md))——**必须先学**。评估集、指标、LLM-as-Judge、基线对比等方法论全部复用,本技能只解决"评估对象从单轮变成多步"带来的新问题
2. **基础提示工程**([prompt-engineering](../ai-ml/prompt-engineering.md))——理解 Agent 的指令如何组织,才能设计"测试它会不会听话"的用例
3. **工具调用设计**([tool-use-design](../ai-ml/tool-use-design.md))——理解 Agent 如何声明与调用工具,才能设计工具正确性指标
4. **API 调用**([claude-api](../ai-ml/claude-api.md))——评估脚本需要批量驱动被测 Agent

如果你从零开始:按 1 → 2 → 4 的顺序先读基础技能,再回来。本技能默认你已有一个能跑的 Agent(哪怕是一个能调 1-2 个工具的最小实现)。

## 核心概念

按"理解差异 → 定维度 → 选粒度 → 搭环境 → 用基准 → 持续化"排序,共六个概念。

### 1. 轨迹 vs 结果:Agent 评估的第一性区别

单轮评估里"输出 = 结果",二者是一回事;Agent 里它们**分离**了。评估必须先分辨你要评的是哪一个:

- **结果评估(Result Evaluation)**:只问"任务最终达成没有"。终点正确 → 通过。简单、客观、便宜,是默认基线
- **轨迹评估(Trajectory Evaluation)**:检查"每步怎么走的"——思考是否正确、工具调用参数是否合理、是否绕了远路、有没有做危险操作

为什么轨迹评估不可省?因为**错误结果会掩盖错误过程,正确结果也会**:

- 过程错、结果对:Agent 先把关键信息推理错误,后面碰巧修正了——这条轨迹里埋着会随机引爆的雷
- 结果错、过程对:任务本身超出能力或环境出问题,冤枉了 Agent
- 过程有毒:任务"完成"了,但 Agent 做了 30 次工具调用、中途访问了敏感数据——这种"成功"不能上线

> 判断原则:**以结果评估做总闸门,用轨迹评估定位根因与风险**。上线前必须看轨迹;日常回归可以先看结果。

### 2. 评估维度:四维框架

Agent 评估至少四个维度,缺一个都会偏:

| 维度 | 定义 | 怎么测 | 反例 |
|---|---|---|---|
| 任务完成率 | 任务最终达成的比例(含"明确承认失败"的正确失败) | 结果级校验器、代码断言 | 任务没干完但回复"已完成" |
| 工具调用正确性 | 每次调用的工具对不对、参数对不对、时机对不对 | 轨迹级逐条比对期望参数 | 查天气调了"下单"接口 |
| 步骤效率 | 达到同等结果用了多少步/token,是否是最优路径 | 步骤数、工具调用次数、token 数对比 | 3 步能办的事走了 15 步 |
| 安全违规 | 越权、敏感操作、提示注入失守、幻觉性危险参数 | 规则拦截器 + 特制对抗用例 | 用户让它删库,它照做了 |

**关于"失败"的定义**:"任务没完成"与"任务完成"之间有个关键类型——**正确失败**:Agent 明确说"我做不到/信息不足"而不是硬编一个答案。对生产 Agent,正确失败率是一项**正面指标**(幻觉是负面指标),要单独统计:

```text
任务完成率 = 正确完成 / 总任务
正确失败率 = 明确拒绝或报告失败 / 总任务   ← 高 = 诚实,不扣分
幻觉率 = 假装完成但结果是编的 / 总任务      ← 这个才是要打的分
```

### 3. 结果评估 vs 轨迹评估:怎么取舍

| 对比项 | 结果评估 | 轨迹评估 |
|---|---|---|
| 成本 | 低(只需最终校验) | 高(每步都要判) |
| 客观性 | 高(可代码断言) | 中(常需 LLM-as-Judge) |
| 定位能力 | 只能告诉你"失败" | 能告诉你"哪一步、为什么失败" |
| 适用粒度 | 日常回归、大批量跑分 | 上线前评审、失败根因分析、安全审计 |
| 典型工具 | 断言、验证器 | 轨迹日志 + judge 逐点评分 |

**实践建议(分层组合)**:

- CI 日常回归:结果评估为主,20-50 个任务,几分钟跑完
- 发版前:结果评估全量 + 轨迹评估抽 10-20 条"重点任务"逐条审查
- 出事故/换模型:对历史失败任务跑完整轨迹评估,定位退化点

**轨迹评估的实现要点**:轨迹留痕是前提——每步记录 `thought / action(工具名+参数) / observation(工具返回)`;评分时或逐条规则校验(参数合法性、是否调用了禁用工具),或用 LLM-as-Judge 对整条轨迹打分(judge 的坑见 [llm-evaluation](../ai-ml/llm-evaluation.md) 概念 5)。

### 4. 评估环境:沙箱与模拟工具

Agent 会调用真实工具,评估不能拿生产环境当试验场:**副作用不可逆,还会污染真实数据**。评估环境三条铁律:

1. **必进沙箱**:真实外部系统(支付、邮件、数据库)全部换成测试桩/模拟器
2. **工具要"仿真"**:模拟工具要保留真实工具的特征——延迟、错误返回、不确定结果;**太完美的模拟器测不出鲁棒性**
3. **状态可重置**:每轮评估从同一初始状态开始(清空库存、重置余额),否则前一轮的副作用污染后一轮

分层选择:

| 环境类型 | 逼真度 | 成本 | 用途 |
|---|---|---|---|
| 纯模拟工具(桩) | 低 | 极低 | CI 快速回归,测 Agent 逻辑 |
| 仿真沙箱(容器/Staging) | 中高 | 中 | 发版前全量评估,测真实依赖 |
| 生产影子模式 | 最高 | 高 | 观察真实流量下的行为(只读工具) |

> 注意:模拟工具是"被测环境"的一部分,它本身的忠实度直接影响评估有效性。评估报告里要写明"在模拟工具 X 上测得",避免把模拟环境分数当真环境分数。

### 5. 基准集:站在别人的肩膀上

社区基准已经定义好"任务 + 环境 + 评分",跑通一个就能横向对比你的 Agent 与 SOTA:

| 基准集 | 环境 | 测什么 | 一句话定位 | 局限 |
|---|---|---|---|---|
| [AgentBench](https://github.com/THUDM/AgentBench) | 8 个环境(OS/DB/游戏等) | 通用多环境 Agent 能力 | 通用能力体检 | 环境较老,任务偏"考试" |
| [WebArena](https://github.com/web-arena-x/webarena) | 自建网站集群 | 网页操作(购物/论坛等) | 浏览器 Agent 的标尺 | 环境搭建重,需自托管网站 |
| [GAIA](https://huggingface.co/spaces/gaia-benchmark/leaderboard) | 466 道真实风格问题 | 多步推理 + 工具使用 | "通用助手"天花板测试 | 无真实环境,只出答案 |
| [τ-bench](https://github.com/sierra-research/tau-bench) | 模拟电商/酒店 API | 工具调用正确性 + 抗用户误导 | 工具 Agent 的精细化测试 | 领域限定 |
| [SWE-bench](https://www.swebench.com/) | GitHub issue + 仓库 | 真实代码修复 | 编码 Agent 的标尺 | 只覆盖 Python 仓库 |

**使用建议**:

- 用基准集做**横向体检**(我的 Agent 在同类任务里排在什么位置),不要照抄任务当你的验收集
- **基准集分数 ≠ 你的生产质量**:线上分布、工具、约束都不同;生产质量靠你自己的评估集(概念 2-3)守住
- 选 1 个与你场景最接近的基准集接入,作为"外部温度计"

### 6. 生产持续评估:追踪 + 回放

离线评估测"改之前",生产评估测"跑的时候"。Agent 在生产里每跑一个任务都会产生一条**轨迹**(所有 thought/action/observation)——这是最真实、最丰富的评估素材:

- **追踪(Tracing)**:把每条生产轨迹完整落盘(含输入输出、时长、成本、成功/失败标记)
- **回放(Replay)**:从历史轨迹里采样,重放给新版本 Agent,对比新旧轨迹的行为与结果——不需要真实副作用,因为旧轨迹就是"剧本",新 Agent 只读重放

```text
生产轨迹库 ──采样──> 回放集 ──驱动──> 新版 Agent ──> 新旧结果/轨迹对比 ──> 分数
```

这解决了离线评估的致命弱点:**评估集失真**。回放的样本 100% 来自真实用量,分布天然正确;加上"用户投诉/手动标记"的反馈回路,离线评估集的样本也能持续从生产补充。

**落地组合(推荐)**:

1. 全量生产轨迹落盘(工具名、参数、结果、时长、成败)
2. 每日/每周从轨迹库采样 50-100 条做自动化结果评估
3. 人工抽检 + 用户反馈标记回灌到离线评估集
4. 换模型/大改时,对历史失败轨迹做回放对比

## 学习路径

按 5-7 周规划,每阶段验收达标再进入下一阶段。

### 阶段一:会评结果(第 1-2 周)

**目标**:能对已有 Agent 跑通"结果级"评估,拿到可信的任务完成率。

- 掌握四维框架,能把任务拆成可断言的成功条件
- 掌握正确失败与幻觉的区分
- 会写一个批量驱动 Agent + 结果校验的评估循环

**验收标准**:

- [ ] 为你的 Agent 选 10-20 个代表性任务,每个任务写清"成功/失败/正确失败"的判定规则
- [ ] 跑通脚本:循环驱动 Agent → 记录每步轨迹 → 结果校验 → 输出任务完成率
- [ ] 用脚本跑 3 次,分数波动 < 5%(说明评估环境可重复;若不行,找出随机源)

### 阶段二:会评轨迹(第 3-4 周)

**目标**:能对失败任务做轨迹级根因分析,并量化工具调用正确性。

- 掌握轨迹留痕格式(thought/action/observation)
- 会用规则 + LLM-as-Judge 给轨迹打分
- 会做失败根因分类(规划失败/工具参数错/幻觉/上下文丢失)

**验收标准**:

- [ ] 设计轨迹日志格式并在 Agent 里落盘,成功与失败任务都留有完整轨迹
- [ ] 对 ≥5 条失败任务完成逐条根因分析,分类并写清"第一步出错在哪、累积到哪一步爆发"
- [ ] 实现工具调用正确性检查:规则校验参数合法性与时机,输出逐条通过率

### 阶段三:会守(第 5-7 周)

**目标**:能建立沙箱评估环境 + CI 回归 + 生产追踪回放的完整体系。

- 会搭模拟工具沙箱,让评估无副作用、可重置
- 会选基准集做横向体检
- 会做生产追踪 + 回放

**验收标准**:

- [ ] 为 Agent 的核心工具写模拟器(含延迟与错误注入),评估在沙箱里跑通且状态可重置
- [ ] 在 CI 里跑轻量评估集(结果级,10-20 任务),一次人为的 Agent 退化改动被拦截
- [ ] 设计一份生产追踪方案(记录什么、采样多少、回放流程、反馈回灌),已实施或写出完整设计文档

## 分步实操:从零评估一个 Agent

同样遵循"先建尺子再测量"。下面假设你有一个能调 2-3 个工具的最小 Agent。

```
第 1 步 定义任务集(10-20 个,分难度)     → 任务清单 + 判定规则表
   ↓
第 2 步 搭建沙箱/模拟工具                → 可重置、可留痕的评估环境
   ↓
第 3 步 轨迹留痕 + 跑基线                → 基线分数(完成率/工具正确率/步数)
   ↓
第 4 步 失败分类与根因分析                → 根因清单(规划/工具/幻觉/上下文)
   ↓
第 5 步 修复迭代(改一版测一版)            → 对比基线,保留提升
   ↓
第 6 步 固化:CI 回归 + 生产追踪回放        → 持续防护
```

### 第 1 步:定义任务集

按难度分层,每层 3-7 个任务:**简单(单个工具)、中等(多步、多工具)、复杂(跨域、需要拒绝/澄清)**。外加 2-3 个对抗用例(提示注入、用户要求越权、信息不足时硬编答案)。每个任务配判定规则:满足什么条件算完成、什么情况算正确失败。

### 第 2 步:搭沙箱

把 Agent 要调的外部系统换成模拟器:状态存内存/测试库,每次评估前重置。关键:模拟器要**像真的**——加延迟、偶尔返回错误、对非法参数报错。否则测出的是"温室里的完成率"。

### 第 3 步:轨迹留痕 + 基线

确保 Agent 每步输出 `{"thought": ..., "action": {"tool": ..., "args": ...}, "observation": ...}` 并落盘。写评估循环(示例 1),跑出三个基线指标:任务完成率、工具调用正确率、平均步骤数。**记录 Agent 版本与模型快照**。

### 第 4 步:根因分析

把每条失败轨迹摊开,找"第一步错误出现在第几步、什么类型"。四个根因桶:规划失败(想错了)、工具调用失败(做错了)、幻觉(编造了不存在的观察)、上下文丢失(忘了早期信息——见 [context-window-management](../ai-ml/context-window-management.md))。这个分类直接决定修哪里。

### 第 5 步:修复迭代

每类根因对应一类修改(工具失败修工具与 tool-use prompt;规划失败修任务拆解提示;上下文丢失修记忆/摘要)。**一次只改一处,跑分对比**;回滚不升反降的改动。与 [prompt-engineering](../ai-ml/prompt-engineering.md) 的迭代纪律一致。

### 第 6 步:固化

轻量结果评估进 CI(每次改动触发);全量评估发版前跑;生产开启追踪,定期回放采样。至此"Agent 会退化"从风险变成可检测事件。

## 示例

三个示例,建议按顺序跑通。示例 1 是核心(手写评估循环),示例 2 补充轨迹评估,示例 3 是生产回放设计。运行前自行设置 API key,并将 `AGENT_LLM` 换成你的模型。

### 示例 1:最小 Agent 评估循环(结果级 + 轨迹留痕)

内置一个"订单助手"Agent(只用一个模拟工具:查库存 + 下单),评估循环驱动它跑任务、记录轨迹、输出四维指标。

```python
# agent_eval_loop.py — 手写 Agent 评估循环(可运行)
import json
from openai import OpenAI

client = OpenAI()

# ---------- 模拟工具(沙箱):库存与下单 ----------
STOCK = {"A001": 5, "A002": 0}   # 每轮评估前重置 = 状态可重置

def tool_stock_query(item_id: str) -> str:
    """查库存:真实环境里是数据库查询,这里用内存模拟。"""
    return json.dumps({"item_id": item_id, "stock": STOCK.get(item_id, -1)})

def tool_place_order(item_id: str, qty: int) -> str:
    """下单:有副作用(扣库存),所以必须只在沙箱里跑。"""
    if STOCK.get(item_id, -1) < qty:
        return json.dumps({"ok": False, "error": "库存不足"})
    STOCK[item_id] -= qty
    return json.dumps({"ok": True, "order_id": "SO-10086"})

TOOLS = {"query_stock": tool_stock_query, "place_order": tool_place_order}

# ---------- 任务集:输入 + 成功判定规则 ----------
TASKS = [
    {"name": "查询库存", "input": "A001 还有货吗?",
     "success": lambda r: "5" in r.get("final", ""),
     "max_steps": 5},
    {"name": "下单成功", "input": "帮我买 2 件 A001",
     "success": lambda r: "SO-10086" in r.get("final", "") or "成功" in r.get("final", ""),
     "max_steps": 8},
    {"name": "库存不足应拒绝", "input": "买 3 件 A002",
     "success": lambda r: ("库存不足" in r.get("final", "") or "没有" in r.get("final", "")),
     "max_steps": 8},   # 正确失败:承认做不到,而不是编造成功
]

SYSTEM = """你是订单助手。可用工具:
- query_stock(item_id):查库存,返回 JSON
- place_order(item_id, qty):下单,返回 JSON
规则:库存不足时必须明确告诉用户"库存不足",禁止编造下单成功。
输出格式:{"thought": "推理", "action": {"tool": "工具名", "args": {...}}} 
或 {"thought": "推理", "final": "最终回答用户的话"}"""

def run_agent(user_input: str, max_steps: int = 8) -> dict:
    """驱动 Agent 循环,返回完整轨迹。"""
    messages = [{"role": "system", "content": SYSTEM},
                {"role": "user", "content": user_input}]
    trace = []
    for _ in range(max_steps):
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages, temperature=0,
            response_format={"type": "json_object"},
        )
        step = json.loads(resp.choices[0].message.content)
        trace.append(step)
        if "final" in step:                     # Agent 决定收尾
            return {"trace": trace, "final": step["final"]}
        tool = TOOLS[step["action"]["tool"]]    # 执行工具(沙箱)
        obs = tool(**step["action"]["args"])
        messages.append({"role": "assistant", "content": json.dumps(step, ensure_ascii=False)})
        messages.append({"role": "user", "content": f"工具返回:{obs}"})
    return {"trace": trace, "final": "[超步数]"}  # 超步数 = 失败

# ---------- 评估循环:跑全部任务,输出四维分数 ----------
from collections import Counter
tool_calls, bad_calls, steps = 0, 0, 0
results = Counter()

for task in TASKS:
    r = run_agent(task["input"], task["max_steps"])
    n_steps = len(r["trace"])
    steps += n_steps

    # 维度 1:任务完成率(含正确失败)
    ok = task["success"](r)
    results["完成" if ok else "失败"] += 1
    print(f"[{'✅' if ok else '❌'}] {task['name']}  步数:{n_steps}")

    # 维度 2+3:工具调用正确性与效率(轨迹级)
    for s in r["trace"]:
        if "action" in s:
            tool_calls += 1
            if s["action"]["tool"] not in TOOLS:
                bad_calls += 1                # 调了不存在的工具 = 错误

print(f"\n任务完成率: {results['完成']}/{len(TASKS)}")
print(f"工具调用总数: {tool_calls}  非法工具调用: {bad_calls}")
print(f"平均步数: {steps / len(TASKS):.1f}(越少越高效,但要结合完成率看)")
```

**要点**:三个任务刻意覆盖"成功、完成、正确失败"三类结果——**不会拒绝的 Agent 测试不出安全底线**;模拟工具 + 每轮重置状态 = 评估可重复;轨迹逐条记录让"完成率"之外还能看工具调用质量。把这个循环包成函数、喂进 CI,就是最小回归系统。

### 示例 2:轨迹评估——给每一步的合理性打分

结果评估告诉你"失败了",轨迹评估告诉你"哪一步错、为什么"。对失败轨迹逐条用 LLM-as-Judge 打分,并做根因分类。

```python
# trajectory_eval.py — 失败轨迹的根因分析(接示例 1 的轨迹)
# 输入:一条失败轨迹(run_agent 的返回),输出:根因分类 + 首错步

FAILED_TRACE = [
    {"thought": "用户想买 A002,先查库存", "action": {"tool": "query_stock", "args": {"item_id": "A002"}}},
    {"thought": "返回了 0,库存不足……有货,直接下单", "action": {"tool": "place_order", "args": {"item_id": "A002", "qty": 3}}},
    {"thought": "下单返回库存不足……那再试一次别的数量", "action": {"tool": "place_order", "args": {"item_id": "A002", "qty": 1}}},
]

JUDGE_PROMPT = """你是 Agent 行为审计员。检查这条失败轨迹,判断根因,选择最贴切的一类:
- planning_failure: 决策错误(比如该拒绝时硬下单)
- tool_failure: 工具调用错误(参数错、时机错、重复调用)
- hallucination: 编造了工具返回里没有的信息
- context_loss: 忽略了早期信息
输出 JSON: {"root_cause": "...", "first_bad_step": 步数(从0起), "reason": "..."}

轨迹:
{steps}"""

import json

def analyze_trace(steps: list[dict]) -> dict:
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user",
                   "content": JUDGE_PROMPT.format(steps=json.dumps(steps, ensure_ascii=False))}],
        temperature=0,
        response_format={"type": "json_object"},
    )
    return json.loads(resp.choices[0].message.content)

print(json.dumps(analyze_trace(FAILED_TRACE), ensure_ascii=False, indent=2))
# 预期输出 root_cause=planning_failure / tool_failure,
# first_bad_step=1:第 0 步明明查到库存 0,第 1 步却决策"有货直接下单"
```

**要点**:轨迹评估的价值在输出**可行动的根因**,而不是又一个分数。注意 judge 是辅助工具——确定性的规则(工具名合法、参数范围合法)永远先用代码判,judge 只判"决策合理性"这类规则判不了的部分(坑见 [llm-evaluation](../ai-ml/llm-evaluation.md) 概念 5)。

### 示例 3:生产"追踪 + 回放"评估

生产轨迹全部落盘;定期采样历史轨迹,驱动新版本 Agent **只读重放**,对比新旧行为。这是没有真实副作用压力的持续评估。

```python
# replay_eval.py — 生产轨迹回放对比(设计骨架,可直接实现)
# 生产侧(追踪):每个任务结束时把轨迹写进轨迹库
import json, random

def trace_to_record(task_input: str, trace: list[dict], ok: bool, version: str) -> dict:
    """把一次生产的完整轨迹落盘(计划中的生产钩子)。"""
    return {"input": task_input, "trace": trace, "ok": ok,
            "version": version, "steps": len(trace)}

# ---- 以下是回放评估:每天都跑一遍 ----
def replay(record: dict, new_agent) -> dict:
    """把历史任务输入喂给新版 Agent,但工具调用只读(不产生副作用)。"""
    return new_agent(record["input"])   # new_agent 内部仅在只读工具上运行

TRACE_DB = [...]  # 从生产轨迹库按周采样 50-100 条(示意)

def weekly_replay(trace_db: list[dict], new_agent, threshold: float = 0.9):
    """对比新旧完成率,新版跌破阈值即告警。"""
    sampled = random.sample(trace_db, min(50, len(trace_db)))
    new_ok = [1 for r in sampled if replay(r, new_agent)["ok"]]
    old_ok  = [1 for r in sampled if r["ok"]]
    new_rate, old_rate = sum(new_ok) / len(new_ok), sum(old_ok) / len(old_ok)
    print(f"旧版完成率 {old_rate:.0%} → 新版 {new_rate:.0%}")
    if new_rate < old_rate - 0.05 or new_rate < threshold:
        print("⚠️ 新版退化,禁止灰度,回滚或调查")
    return new_rate

# 回放 vs 直接重跑的区别:
# 重跑 = 让新旧版本都在真实(或模拟)环境里跑同一批输入
# 回放 = 只让新版跑,旧版成绩直接取"当时的历史记录",省一半成本
```

**要点**:回放评估的两个设计决策——**只读工具**(回放过程不允许真实副作用)和**历史成绩即基线**(旧版分数来自当时落盘的轨迹,不必重跑)。回放集的样本天然来自真实分布,弥补离线评估集失真的问题;配合 [github-actions](../devops/github-actions.md) 或定时任务,就是"Agent 防退化"的最后一层网。

## 练习

按顺序完成,建议产出放入 `personal/` 留档。

### 基础练习

- [ ] **P1-1 任务集与判定规则**:为你的 Agent 定义 ≥10 个评估任务(含 ≥2 个"必须正确拒绝"的用例),每个任务写明成功/失败/正确失败的判定规则
- [ ] **P1-2 跑通评估循环**:基于示例 1 改造出你的评估循环(换工具、换任务),跑出任务完成率与平均步数基线
- [ ] **P1-3 可重复性检验**:同一评估跑 3 遍,记录分数波动;若波动 > 5%,找出随机源(温度/顺序/环境状态)并修复

### 进阶练习

- [ ] **P2-1 根因画像**:收集 ≥5 条失败轨迹,按四类根因归类,写一份"失败画像"报告(每种根因占比 + 典型样例 + 修复假设)
- [ ] **P2-2 工具正确性检查**:为每个工具写确定性校验规则(参数合法性、调用时机、重复调用),实现自动统计工具调用错误率
- [ ] **P2-3 模拟器逼真化**:给模拟工具加入延迟、随机错误、非法参数报错,重跑基线,对比"温室版"与"仿真版"分数差异,写结论

### 挑战练习

- [ ] **P3-1 基准确认**:选 1 个与场景最近的基准集(τ-bench/WebArena/SWE-bench 等),跑通官方示例,记录你的 Agent 在同类任务上的横向位置
- [ ] **P3-2 CI 回归**:把轻量评估集接入 CI,人为引入一次退化(如让 Agent 不再检查库存)验证能拦截
- [ ] **P3-3 生产追踪落地**:为你的 Agent 实现生产轨迹落盘 + 每周回放告警,运行两周,汇报一次真实退化或"无退化"报告
- [ ] **P3-4 安全评估套件**:设计 5 个对抗用例(提示注入、越权指令、编造工具返回引导),统计绕过率,修复后复测

## 自测题

先独立作答,再对照答案。答不出的题回看对应章节。

1. Agent 评估与单轮 LLM 评估最核心的三个区别是什么?
2. "任务完成了但走了 30 步、中途查了无关数据"——结果评估为什么抓不到这个问题?该用什么评估?
3. 正确失败与幻觉有什么区别?为什么正确失败率是正面指标?
4. 四维框架是哪四个维度?各自一句话定义。
5. 为什么评估 Agent 不能直接在生产环境跑?评估环境的三条铁律是什么?
6. 结果评估与轨迹评估的成本、客观性、定位能力分别如何取舍?工程上怎么分层组合?
7. AgentBench 分数高,能说明生产质量好吗?为什么?
8. "追踪 + 回放"为什么能弥补离线评估集的失真?回放评估的硬性约束是什么?
9. 你的 Agent CI 通过率 100%,但线上投诉变多。最可能缺了哪一层?第一步排查动作是什么?

<details>
<summary>答案</summary>

1. ① 结果与轨迹分离(结果对不代表过程对,反之亦然);② 多步错误会累积(第 3 步的错误数据让第 9 步决策全错);③ 工具副作用不可逆,评估必须沙箱化。
2. 结果评估只看最终结果,不看过程。该用轨迹评估:逐条检查每步 thought/action 是否合理,统计无关调用与效率,把"有毒的成功"识别出来。
3. 正确失败 = Agent 明确说"做不到/信息不足";幻觉 = 假装完成、编造结果。正确失败说明 Agent 诚实且有边界感,在生产中是加分行为,所以要单独统计而不是算进"失败率"。
4. 任务完成率(目标达成)、工具调用正确性(工具/参数/时机对)、步骤效率(步数/token 最优性)、安全违规(越权/敏感操作/注入失守)。
5. 副作用不可逆且污染真实数据。铁律:① 必进沙箱(测试桩/模拟器);② 模拟工具要仿真(延迟、错误、不确定性);③ 状态可重置(每轮从同一初始状态开始)。
6. 结果评估:成本低/客观性高/只能定位"失败";轨迹评估:成本高/常靠 judge/能定位"哪一步为什么"。分层组合:CI 日常用结果评估,发版前加轨迹抽审,事故与换模型时全量轨迹分析。
7. 不能。基准集是"考试",生产是"实战"——分布、工具、约束都不同;基准集只做横向体检(相对位置),生产质量的守门员是自己的评估集与持续评估。
8. 回放的样本 100% 来自真实用量,分布天然正确,弥补了人工构造评估集的失真。硬性约束:**回放过程只读**(工具不得产生真实副作用),旧版成绩直接取历史记录。
9. 缺"生产持续评估"层(追踪+回放/抽检)。第一步:拉出最近投诉对应的生产轨迹,检查是哪类失败(是否回归、是否抽样失真),再决定补评估集样本还是修复。
</details>

## 常见错误与反模式

- ❌ **只评结果不评轨迹**——"有毒的成功"会悄然上线;结果评估做闸门,轨迹评估做审计
- ❌ **把"任务完成"当作唯一指标**——丢了效率、安全、工具正确性,分数好看但不敢上线
- ❌ **把正确失败算进失败率**——诚实被惩罚,Agent 会被优化成"硬编答案"的高分骗子
- ❌ **在生产环境跑评估**——副作用不可逆、污染真实数据;一切评估进沙箱
- ❌ **模拟工具太"完美"**——没有延迟、没有错误、没有不确定性,测出的完成率是温室分数
- ❌ **状态不可重置**——上一轮任务污染下一轮,评估结果不可信也不可复现
- ❌ **不固定温度/不记录版本**——分数波动不知道来自随机性还是真实变化;记录模型快照 + 参数
- ❌ **用基准集分数冒充生产质量**——基准集是温度计不是 KPI,生产质量靠自己的评估集
- ❌ **上线后就不评估了**——模型会升级、流量会变化;追踪 + 回放是持续防线
- ❌ **让 LLM-as-Judge 评判一切**——能规则判定的(参数合法性、调用次数)先用代码;(judge 偏倚详见 [llm-evaluation](../ai-ml/llm-evaluation.md))

## 参考资源

- [Anthropic — Evaluating AI Systems](https://www.anthropic.com/research/evaluating-ai-systems) — 文章,评估体系与 Agent 评估的框架性说明
- [τ-bench: A Benchmark for Tool-Agent-User Interaction](https://github.com/sierra-research/tau-bench) — 工具,工具调用 Agent 基准集
- [AgentBench: Evaluating LLMs as Agents](https://github.com/THUDM/AgentBench) — 工具,八环境通用 Agent 基准集
- [WebArena](https://github.com/web-arena-x/webarena) — 工具,自托管网站的浏览器 Agent 基准集
- [GAIA Benchmark Leaderboard](https://huggingface.co/spaces/gaia-benchmark/leaderboard) — 工具,通用助手型基准集排行榜
- [SWE-bench](https://www.swebench.com/) — 工具,代码修复 Agent 基准集
- [LangSmith Evaluation Docs](https://docs.smith.langchain.com/evaluation) — 文档,生产追踪与在线评估平台

## 相关 Skills

- [llm-evaluation](../ai-ml/llm-evaluation.md) — **前置基础**,评估集、指标与 judge 方法论都从这里来
- [tool-use-design](../ai-ml/tool-use-design.md) — 被评估对象的核心组件:工具声明与调用设计
- [prompt-engineering](../ai-ml/prompt-engineering.md) — 修复轨迹问题的第一杠杆:指令与示例迭代
- [context-window-management](../ai-ml/context-window-management.md) — 根因桶之一"上下文丢失"对应的修复手段
- [guardrails-safety](../ai-ml/guardrails-safety.md) — 安全评估维度:越权与注入的防御设计
- [github-actions](../devops/github-actions.md) — 落地:把 Agent 回归评估接进 CI