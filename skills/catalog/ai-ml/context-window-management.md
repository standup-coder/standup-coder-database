---
id: context-window-management
type: atomic-skill
title: Context Window Management
nameZh: 上下文窗口管理
domain: ai-ml
level: mid
tags: ai-ml, context-engineering, llm, token-budget, compaction
catalogSource: internal
catalogFile: atomic-skills/context-window-management.json
catalogAddedAt: 2026-07-29
operation: ai-ml
---

# 上下文窗口管理

> 把上下文当作稀缺资源经营:用最小的高信号 token 集合换取最大输出质量,对抗长上下文的注意力衰减与成本膨胀。学完本技能,你能为任何任务设计出"预算分配 + 压缩 + 检索化"的完整上下文方案。

## 这个技能解决什么问题

模型上下文窗口在变大,但"能塞进去"不等于"该塞进去"。本技能解决三个生产中最常见的问题:

| 问题 | 表象 | 解决手段 |
|---|---|---|
| **注意力衰减(context rot)** | 塞得越多,模型越忽略中段信息;关键指令被淹没 | 位置编排 + 预算分配 |
| **长程任务窗口耗尽** | 多轮工具调用的 Agent 跑到一半就爆窗或质量崩 | 压缩 / 外部状态 / 子代理 |
| **token 成本线性膨胀** | 输入随会话增长,成本跟着涨,缓存还老 miss | 稳定前缀 + prompt caching |

**学完之后你应该能**:

- 给上下文的每个成分(系统提示/历史/检索/工具结果)定 token 预算
- 用"丢哪段不会变差"的方法做上下文审计
- 为长程 Agent 设计压缩、结构化笔记、子代理三种方案
- 布局提示词命中 KV cache,省下 45-80% 输入成本
- 识别"该压缩"与"不该压缩"的内容边界(约束必须原文保留)

## 前置知识

- [prompt-engineering](../ai-ml/prompt-engineering.md) — 系统提示怎么写、结构如何组织
- [llm-cost-optimization](../ai-ml/llm-cost-optimization.md) — 成本视角:计费、缓存、路由
- [agent-memory-design](../ai-ml/agent-memory-design.md) — 窗口之外的长期状态放哪(进阶,可与本技能并行读)
- **基础 API 概念**:token、max_tokens、消息数组结构

## 核心概念

### 1. 位置效应:窗口不是一个均匀的存储

模型对上下文的注意力**不均匀**:开头(primacy)与结尾(recency)的信息召回率显著高于中段。这正是 "Lost in the Middle"(Liu et al., 2024)论文的实证结论。

```
注意力分布(示意)
高 ████                                            ████
   ████                                          ██████
中 ████              ██              ██          ████████
   ████            █████           ██████▄     ██████████
低 ████▄▄▄▄▄▄▄▄▄▄▄██████▄▄▄▄▄▄▄▄▄▄████████▄▄▄████████████
   开 头      ↑ 中段(最容易丢)      ↑        结 尾
```

**推论**:最重要的指令放开头或结尾;多个约束不要堆在中段;长文档里检索出来的关键段落,放最前面或紧跟用户问题。

### 2. token 预算:给上下文分成分记账

生产系统给每个成分设上限,超限触发对应策略(而不是"还能塞就塞"):

| 成分 | 参考预算 | 超限策略 |
|---|---|---|
| 系统提示 | ≤2K(精简到最小完备) | 砍历史包袱,不是加内容 |
| 对话历史 | ≤8K | 压缩 / 截断 / 窗口外落盘 |
| 检索内容 | ≤4K | 只留最相关段,降 top-k |
| 工具结果 | ≤4K(或截断+落盘) | 分页 / 摘要 / 存文件引用 |
| 用户最新指令 | 完整保留 | 永不压缩 |

预算分配是**设计决策**,写进代码/提示词,而不是运行时 panic。

### 3. 压缩三策略:什么时候用哪个

| 策略 | 做法 | 信息损失 | 适用 |
|---|---|---|---|
| **摘要化(compaction)** | 把历史对话压缩成摘要,重启会话 | 高,错误会复利 | 长会话里程碑处 |
| **滑动窗口** | 只保留最近 N 轮 | 中,早期细节全丢 | 简单短会话 |
| **关键信息提取** | 把"必须逐字保留"的抽到外部文件,用时再读 | 低(按需) | 长程 Agent |

**铁律**:约束、规格、代码、待办——这些需要**逐字引用**的内容,绝不摘要;只压缩过程性内容(插曲、已完成的中间推理)。这就是"结构化笔记"策略:把 todo/进展写到窗口外的文件,需要时读取,窗口里只留指针和当前步。

### 4. 检索优于全量塞入(just-in-time context)

与其把"可能用到的资料"全放窗口,不如:

```
全量塞入(反模式)            按需检索(推荐)
┌──────────────────┐      ┌──────────────────┐
│ 100 docs 全放窗口 │  →   │ 系统提示  2K      │
│ (贵、稀释注意力)  │      │ 当前步必需 4K    │ ← 只有这一步需要的东西
└──────────────────┘      │ 外部索引   ∞     │ ← 用 RAG/文件按需拉取
                          └──────────────────┘
```

这正是 [rag-pipeline-design](../ai-ml/rag-pipeline-design.md) 存在的意义:检索把"可能用到"变成"当前一步必需"。

### 5. KV cache 与缓存友好的布局

LLM 推理时,每轮请求都要处理输入前缀。若多次请求的前缀相同,服务端可缓存该前缀的 KV 状态,命中则省 45-80% 输入成本与延迟。

**让缓存命中的布局原则**:

- 稳定内容(系统提示、工具定义、静态 few-shot)**放前**、易变内容(用户新输入、时间戳、动态检索结果)**放后**
- 每轮变化的随机 id、时间戳**不要插在系统提示里**
- 多用户的共享指令结构化,与每用户差异部分分离

```
✅ 缓存友好: [稳定系统提示][稳定工具定义][用户历史][新问题]
❌ 缓存杀手: [时间戳开头][稳定内容][随机 id 中间][用户内容]
```

### 6. 长程 Agent 三板斧(Anthropic 实践)

1. **压缩(compaction)**:接近上限时,让模型摘要历史并重启会话,保留决策与待办原文
2. **结构化笔记**:把状态写进窗口外文件(todo.md / notes.md),按需读取
3. **子代理**:每个子任务用干净窗口,只回传结论——窗口不再随任务线性增长

## 学习路径

建议 3-4 周,与 [llm-evaluation](../ai-ml/llm-evaluation.md) 并行效果更好(你会需要"量化压缩损失"的能力)。

### 阶段一:能记账(第 1 周)——Junior 水平

**目标**:理解 token 计费与位置效应,能做基本的历史截断。

- 掌握窗口成分结构与预算概念
- 会用 token 工具精确计数
- 会写基础的滑动窗口截断

**验收标准**:

- [ ] 能说出自己常用模型的上下文上限与计费规则
- [ ] 对"系统提示/历史/检索"三类成分,能估算各自 token 占比
- [ ] 写一个能跑的历史截断工具(保留最近 N 轮),并说明丢了什么

### 阶段二:能设计(第 2-3 周)——Mid 水平

**目标**:预算分配 + 压缩 + 检索化的完整方案。

- 掌握摘要化 / 滑动窗口 / 关键信息提取的取舍
- 会做"上下文审计"(后面有步骤)
- 布局兼顾 KV cache 命中

**验收标准**:

- [ ] 为一个长会话场景设计预算表 + 压缩触发条件,并实现
- [ ] 审计一段真实会话,找出 ≥3 处"删掉不影响输出"的内容
- [ ] 改造一版提示词布局,命中缓存并测出成本下降数据

### 阶段三:能架构(第 4 周)——Senior 水平

**目标**:长程 Agent 记忆分层与多代理窗口架构,量化压缩损失。

- 掌握"摘要 vs 原文保留"的边界判断
- 会用子代理隔离窗口
- 能量化压缩对任务质量的影响

**验收标准**:

- [ ] 为一个长程 Agent 设计"窗口 + 外部笔记 + 子代理"三层架构
- [ ] 测试两版(压缩 vs 不压缩)在 20+ 任务上的分数差,给出结论
- [ ] 你设计的方案通过一次 50 轮以上的压力测试(质量不回退)

## 分步实操

```
第 1 步 盘点:这个任务的上下文由哪些成分组成?
   ↓
第 2 步 定预算:每个成分的上限与超限策略
   ↓
第 3 步 布局:稳定前缀在前,易变内容在后
   ↓
第 4 步 实现截断/压缩/外部化三件套
   ↓
第 5 步 审计:dump 真实会话,逐段问"删掉会变差吗"
   ↓
第 6 步 度量:压缩前后跑评估集,量化损失
```

### 第 1-2 步:盘点与预算

写出你的消息数组结构,标注每个成分:大小、稳定性(每轮变不变)、用途。然后按"这个成分对当前输出是否必需"分配预算。

### 第 3 步:布局

按缓存友好原则重排:稳定在前、易变在后。检查有没有把"用户新消息"插在中间的习惯。

### 第 4 步:三件套

- **截断**:工具结果只保留最近 / 最高分部分
- **摘要**:里程碑处请模型写"进展摘要(含决策与待办原文)"
- **外部化**:todo、状态、长文档写文件,窗口只留指针

### 第 5-6 步:审计与度量

审计问题清单:

- [ ] 这段系统提示有没有废话(能删 30% 吗)?
- [ ] 这些历史轮次还有用吗(已被摘要代替)?
- [ ] 这个工具结果很重要吗(原文已在文件里)?
- [ ] 检索段落与当前问题真的相关吗?

度量方法:压缩前后各跑一遍评估集,比较分数差。**预算的 ROI 是"每 token 对质量的边际贡献"**。

## 示例

### 示例 1:上下文预算管理器

```python
import tiktoken

encoder = tiktoken.encoding_for_model("gpt-4o")

BUDGETS = {
    "system": 2_000,      # 系统提示上限
    "history": 8_000,     # 历史上限
    "retrieval": 4_000,   # 检索内容上限
    "tool_result": 4_000, # 单次工具结果上限
}

def count_tokens(text: str) -> int:
    return len(encoder.encode(text))

def fit_to_budget(text: str, budget: int, tail: bool = True) -> str:
    """按 token 预算截断:头部保留(指令)或尾部保留(结果)。"""
    tokens = encoder.encode(text)
    if len(tokens) <= budget:
        return text
    kept = tokens[-budget:] if tail else tokens[:budget]
    return encoder.decode(kept)

def assemble(system: str, history: list[str], retrieval: list[str], question: str):
    """组装一条符合预算的请求——超限即截断,而不是硬塞。"""
    system = fit_to_budget(system, BUDGETS["system"], tail=False)
    history = fit_to_budget("\n".join(history), BUDGETS["history"], tail=True)
    retrieval = fit_to_budget("\n".join(retrieval), BUDGETS["retrieval"], tail=True)
    return f"{system}\n\n【历史】\n{history}\n\n【资料】\n{retrieval}\n\n【问题】\n{question}"

# 用法:assemble() 保证总量可控,关键内容(问题)永远完整保留
```

**要点**:截断是有损的兜底,不是首选。真正的方案是"不产生那么多 token"(见示例 2)。

### 示例 2:长程 Agent 的里程碑压缩

```python
async def maybe_compact(session, history: list[dict], threshold: int = 30_000):
    """历史接近阈值时,摘要压缩并重启会话上下文。"""
    total = sum(count_tokens(m["content"]) for m in history)
    if total < threshold:
        return history

    # 让模型写一份"保留决策与待办的摘要"
    summary = await llm.chat([
        {"role": "system", "content": COMPRESS_PROMPT},
        {"role": "user", "content": json.dumps(history, ensure_ascii=False)},
    ])

    # 压缩后的会话:原文保留【决策/待办/约束】,其余进摘要
    return [
        {"role": "system", "content": session.system_prompt},
        {"role": "assistant", "content": f"[已压缩的中段进展]\n{summary}"},
    ] + history[-2:]  # 最近两轮原文保留,保证连贯

COMPRESS_PROMPT = """把下面的对话压缩成结构化进展摘要。必须原文保留:
1. 已做出的关键决策与理由
2. 待办事项与负责人
3. 不可变的约束与规格
其余过程性内容(中间推理、试探)概括即可。输出格式:
决策:...
待办:...
约束:...
进展:..."""
```

**要点**:压缩的成败在"原文保留了什么"。决策/待办/约束逐字保留,过程性内容才允许概括——错误才不会复利。

### 示例 3:缓存友好的请求布局

```python
# ❌ 缓存杀手:时间戳与随机 id 在开头,稳定内容被"污染"
messages = [
    {"role": "system", "content": f"[{datetime.now()}] 你是客服助手。"},  # 每轮都变!
    {"role": "system", "content": SYSTEM_RULES},                          # 稳定,却排在变的后头
    {"role": "user", "content": question},
]

# ✅ 缓存友好:稳定前缀在前,易变内容在后
messages = [
    {"role": "system", "content": SYSTEM_RULES},     # 稳定前缀
    {"role": "system", "content": TOOL_DEFINITIONS}, # 稳定,一起命中缓存
    {"role": "user", "content": question},
]

# 多用户场景:共享指令在前,用户差异在后
messages = [
    {"role": "system", "content": SHARED_RULES},       # 所有用户共享 → 命中
    {"role": "system", "content": f"用户偏好:{user_profile}"},  # 每用户一段 → 只 miss 这一段
    {"role": "user", "content": question},
]
```

**要点**:缓存按前缀匹配。把"所有请求共有"的部分放最前、合并成一块,命中率最高。

## 练习

产出放入 `personal/` 留档。

### 基础练习(阶段一对应)

- [ ] **P1-1 成分盘点**:选一个你手头的 LLM 应用,列出消息数组的全部成分、各自 token 占比与稳定性,画一张占比图
- [ ] **P1-2 截断工具**:写一个支持"保留头部/保留尾部/按预算截断"的上下文工具函数,并在真实会话上测试
- [ ] **P1-3 位置实验**:构造 10 块文档的问答场景,把答案分别放开头/中间/结尾,各跑 10 次,验证位置效应

### 进阶练习(阶段二对应)

- [ ] **P2-1 预算方案**:为"客服长会话"设计预算表(system/history/retrieval/tool),实现超限策略,并用真实数据验证
- [ ] **P2-2 上下文审计**:dump 一条真实长会话,逐段标注"必需 / 可压缩 / 可删",至少找出 3 处可删内容
- [ ] **P2-3 缓存改造**:把现有请求改造成缓存友好布局,测改造前后的输入 token 成本差(命中场景)

### 挑战练习(阶段三对应)

- [ ] **P3-1 压缩对比实验**:同一任务跑 20 个用例,分别用"全文 / 压缩后"喂给模型,量化分数差与成本差
- [ ] **P3-2 长程 Agent 压力测试**:实现"里程碑压缩 + 外部笔记"的长程 Agent,连续跑 50+ 轮,记录质量曲线
- [ ] **P3-3 架构设计**:为"多文件代码库问答 Agent"设计窗口架构(主窗口 + 子代理窗口 + 索引),画图并写决策理由

## 自测题

1. 为什么中段信息最容易丢?设计提示词时怎么利用这一点?
2. 摘要化压缩最大的风险是什么?怎么缓解?
3. 哪些内容绝对不压缩?为什么?
4. KV cache 命中的条件是什么?什么布局能提高命中率?
5. 工具结果特别大(10 万 token)时,标准处理是什么?
6. "滑动窗口"和"摘要化"各适合什么场景?
7. 预算分配的判据是什么?(什么算"该给预算")

<details>
<summary>答案</summary>

1. 模型对开头/结尾注意力更强(位置偏差,Lost in the Middle)。利用:关键指令放首尾,长文档关键资料紧挨用户问题
2. 摘要丢细节、错误复利。缓解:决策/待办/约束逐字保留,只概括过程性内容;压缩后跑评估验证
3. 约束、规格、代码、待办、下一道必须逐字执行的指令。因为它们需要精确引用,丢了就出错
4. 多次请求的输入前缀完全一致。布局:稳定内容(系统提示/工具定义)聚拢放前、易变内容(时间戳/新问题)放后;动态内容别插系统提示
5. 截断 + 分页 + 落盘存引用:只把摘要/指针放入窗口,原文写文件,需要时按需读取
6. 滑动窗口适合短会话/早期阶段的简单场景;摘要化适合长程任务里程碑,且要与原文保留配合
7. "删掉这段,输出会不会变差"。会变差→保留(给预算);不会→删或压缩。预算的 ROI 是每 token 的边际质量贡献
</details>

## 常见错误与反模式

- ❌ **窗口能塞就塞**——把整个知识库/全部历史无差别塞进请求
- ❌ **关键约束埋在 3 万 token 的中段**——然后抱怨模型"不听话"
- ❌ **摘要压缩一切**——把需要逐字引用的规格、代码、约束也压缩了
- ❌ **动态内容插在请求开头**——时间戳/随机 id 放最前,KV cache 每轮全 miss
- ❌ **只压缩不度量**——压缩后不跑评估,不知道丢了什么
- ❌ **工具结果全文入窗**——一次 10 万 token 的工具返回毁掉整个会话
- ❌ **从不审计**——上下文越堆越长,没人问"这段还有用吗"
- ❌ **超窗才慌**——没有预算与触发条件,爆窗时只能随机截断

## 参考资源

- [Anthropic — Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — 官方工程文,压缩/结构化笔记/子代理三板斧
- [Liu et al. — Lost in the Middle (TACL 2024)](https://arxiv.org/abs/2307.03172) — 论文,位置偏差实证
- [Anthropic — Prompt caching 文档](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) — 官方文档,缓存命中的布局要求
- [LangChain — Context Engineering 专题](https://blog.langchain.com/context-engineering-for-agents/) — 文章,工程实践综述

## 相关 Skills

- [agent-memory-design](../ai-ml/agent-memory-design.md) — 窗口外的状态去哪:长期记忆设计(进阶)
- [llm-cost-optimization](../ai-ml/llm-cost-optimization.md) — 预算与缓存本技能的成本视角
- [prompt-engineering](../ai-ml/prompt-engineering.md) — 窗口里放什么,前提是知道怎么组织提示
- [rag-pipeline-design](../ai-ml/rag-pipeline-design.md) — "按需检索进窗口"的工程实现