---
id: agent-memory-design
type: atomic-skill
title: Agent Memory Design
nameZh: Agent 记忆设计
domain: ai-ml
tags: ai-ml, agent-memory, long-term-memory, episodic, retrieval
catalogSource: internal
catalogFile: atomic-skills/agent-memory-design.json
catalogAddedAt: 2026-07-29
operation: ai-ml
level: senior
---

# Agent 记忆设计

> 为 AI Agent 设计分层记忆系统:短期会话状态、长期语义/情景/程序记忆的写入、检索、更新与遗忘策略。学完本技能,你能设计出"该记的记得住、该忘的忘得掉、检索准而不噪"的四层记忆架构,并用量化评估证明记忆对任务成功率的贡献。

## 这个技能解决什么问题

没有记忆的 agent 每个会话都"失忆":用户上次说过的事这次再解释一遍;跨会话的偏好、约定、历史决策全部丢失。而随意堆记忆的 agent 又走向另一个极端:什么都记导致检索噪声、错误记忆长期误导行为、隐私数据永久留存。

| 痛点 | 没有记忆系统 | 有设计不当的记忆系统 | 有分层记忆系统 |
|---|---|---|---|
| **跨会话连续性** | 用户每次都要重新交代背景 | 记住了,但分不清新旧,旧偏好覆盖新决定 | 情景记忆按时间组织,新旧冲突按策略消解 |
| **上下文窗口** | 长对话塞满窗口,费用暴涨、早期信息丢失 | 全部对话历史向量化,检索回来大量寒暄噪声 | 窗口只放"摘要+本轮",细节按需检索 |
| **知识沉淀** | 每次问答都从零推理 | 把检索到的内容当记忆,来源与事实混淆 | 语义记忆只存"验证过的事实",带来源与置信度 |
| **出错代价** | 无 | 一条错误偏好永久生效,污染之后所有会话 | 写入前验证 + 用户可见可删 + 定期遗忘 |

学完之后你应该能:

- 用认知科学四类型(工作/情景/语义/程序)分析你的 agent 需要哪几类记忆,并映射到具体存储
- 用 checkpointer/会话状态管理实现跨会话的短期记忆(可恢复、可摘要压缩)
- 设计写入策略:何时写、写什么、如何摘要化,避免重复条目与半成品堆积
- 设计检索策略:相关性 + 时效 + 重要性混合排序,并控制注入预算
- 设计更新、冲突消解与遗忘机制(TTL/衰减/容量淘汰),并把隐私合规纳入架构

## 前置知识

动手前,建议先掌握(按依赖顺序):

1. **上下文窗口管理**([context-window-management](../ai-ml/context-window-management.md))——记忆与窗口的分工:窗口放不下是引入外部记忆的出发点
2. **检索技术**([rag-pipeline](../ai-ml/rag-pipeline.md)或[vector-search](../ai-ml/vector-search.md))——语义记忆的检索底座;本技能的长期记忆建立在向量检索之上
3. **嵌入表示**([embeddings-design](../ai-ml/embeddings-design.md))——理解 embedding 相似度的能力边界(它不懂时间、不懂重要性,这是混合排序存在的原因)
4. **Agent 编排基础**([agent-orchestration-design](../ai-ml/agent-orchestration-design.md))——记忆在 agent 循环里处于什么位置;评估方法见[agent-evaluation](../ai-ml/agent-evaluation.md)

如果从零开始,先读完上述四条再回来;本技能默认你已实现过基本 RAG 检索。

## 核心概念

本技能由六个概念组成,按"认知模型 → 分层实现 → 存取策略"的顺序排列。

### 1. 记忆四类型:认知模型与 Agent 映射

认知科学把记忆分为四类,Agent 的记忆设计直接借用这套分类——每一类有不同来源、不同存储、不同检索方式:

| 类型 | 是什么 | Agent 中的对应 | 存储载体 | 检索方式 |
|---|---|---|---|---|
| **工作记忆** | 当前任务瞬间持有的状态 | 上下文窗口 + scratchpad(思考草稿) | 模型上下文 | 无(一直在窗口里) |
| **情景记忆** | 发生过的事(谁、何时、什么) | 会话记录、事件日志 | 时序日志/图存储 | 时间 + 实体过滤 |
| **语义记忆** | 事实与偏好(不依赖具体时间) | 用户画像、知识条目、项目约定 | 向量库/结构化表 | embedding 相似度 + 元数据过滤 |
| **程序记忆** | 怎么做事的技能与规则 | 工具用法、流程模板、决策规则 | 代码/规则库/提示模板 | 按任务类型路由 |

**设计的起点不是"我要用向量库",而是"我的 agent 需要记住哪几类东西"**:

- 对话助手:工作记忆(本轮)+ 情景记忆(用户说过什么)+ 语义记忆(用户偏好)
- 编码 agent:工作记忆 + 程序记忆(仓库约定、工具流程)+ 语义记忆(项目事实)
- 客服 agent:情景记忆(工单历史)为主,语义记忆(政策)来自知识库而非记忆系统

> **要点**:最常见的错误是用"对话历史向量化"充当全部记忆——它既没有情景记忆的时序结构,也没有语义记忆的事实可靠性,检索回来全是噪声。四类记忆用四种不同的存取策略。

### 2. 短期记忆:会话状态管理

短期记忆 = 会话内状态:消息历史、工具调用结果、agent 的中间推理。问题在于**窗口放不下、进程会重启**——所以需要外部化的会话状态管理。

| 方案 | 机制 | 适用 |
|---|---|---|
| 纯上下文窗口 | 全部历史留在窗口里 | 短会话、单轮任务 |
| **checkpointer(会话持久化)** | 每轮状态存盘,可恢复、可续聊 | 多轮对话、可中断任务(事实标准) |
| 滚动摘要压缩 | 超窗时把旧轮次摘要化,替换原文 | 长会话必须配合博客 |
| 摘要 + 完整存储 | 窗口放摘要,历史全文归档可查 | 需要追溯细节的生产场景 |

**LangGraph 的 checkpointer/thread 模式是事实标准**:每个会话(thread)的状态在每轮之后持久化,新请求可以基于上次状态继续;状态里可以放消息列表、计数器、变量。配合"滚动摘要":状态里维护一个 `summary` 节点,当历史超出预算(如 3000 token)时,把最早的轮次交给 LLM 压缩成摘要,用摘要替换原文——**先摘要再截断,而不是硬砍**。

### 3. 长期记忆:存储选型

长期记忆不是一种存储,而是"按记忆类型选存储":

| 存储 | 适合的记忆 | 优势 | 劣势 |
|---|---|---|---|
| **向量库**(pgvector/Qdrant 等) | 语义记忆:偏好、事实条目 | 自然语言查询、相似度召回 | 不懂时间/重要性/冲突,需要元数据补齐 |
| **结构化表**(SQL/键值) | 情景记忆的实体、程序记忆的规则 | 精确过滤、时序列举、事务一致 | 无法语义匹配 |
| **图存储** | 实体关系(用户-项目-决策) | 关系查询、路径推理 | 写入复杂、运维成本高 |
| **混合**(向量 + 元数据 + 表) | 生产默认 | 各取所长 | 需要同步与一致性处理 |

生产默认是混合:记忆条目结构化(内容 + 来源会话 + 时间戳 + 置信度 + 类别 + 访问次数),内容字段建向量索引用于语义召回,**元数据字段用于时效与重要性过滤**。纯向量库解决一切是设计偷懒——embedding 相似度无法回答"这条记忆是不是最新的""这条被用户纠正过没有"。

### 4. 写入策略:何时写、写什么

记忆质量 80% 由写入决定。写入不是"每轮都记",而是三条原则:

**① 显式优先**:先只做"用户明确要求记住的",再逐步引入自动抽取。显式记忆(用户说"以后叫我 Allen")错误率最低、价值最直接。

**② 写入时机分两路**:

| 路径 | 时机 | 优点 | 缺点 | 用途 |
|---|---|---|---|---|
| **hot path(实时)** | 对话中逐轮抽取 | 即时生效 | 延迟敏感、质量低、易重复 | 显式记忆、关键事件 |
| **background(后台批处理)** | 会话结束后统一提炼 | 质量高、可去重合并 | 延迟生效 | 隐式偏好、会话摘要(生产主力) |

生产系统多用"hot 记关键事实 + background 提炼全量":会话结束后,LLM 把整轮对话提炼为"值得长期记住的条目列表",再与存量记忆做去重、合并、冲突检测。

**③ 写什么由"记忆价值"判断**:判断标准不是"出现了信息",而是——

- 这条信息未来还会用到吗?(一次性任务细节不记)
- 不记的代价是什么?(用户重复解释的代价 > 存储代价才记)
- 是与用户/项目相关的事实,还是通用知识?(通用知识该去知识库,不该进记忆)

**摘要化**是写入的核心工艺:一条记忆 = 结构化条目(类型 + 内容一句话 + 时间戳 + 来源会话 + 置信度),而不是原文片段。可追溯、可去重、可失效。

### 5. 检索策略:混合排序与注入预算

检索时机的三条触发规则:用户直接问"我上次说的……"、任务需要历史上下文、agent 判断当前决策依赖过去。检索不是"查一次",而是"选什么进窗口":

**混合排序**(纯相似度不够):

```text
最终得分 = w1 × 相关性(embedding 相似度)
         + w2 × 时效性(按记忆类型衰减:偏好类慢衰减,事件类快衰减)
         + w3 × 重要性(访问频率、用户手动置顶、置信度)
         + 硬性过滤(与当前用户/任务无关的条目直接排除)
```

| 系数 | 调控什么 | 例子 |
|---|---|---|
| 相关性 w1 | 语义匹配度 | "帮我订之前那家餐厅" 命中餐厅偏好条目 |
| 时效性 w2 | 旧信息 vs 新信息 | 用户上个月说"不吃辣",昨天说"想吃辣"——昨天的赢 |
| 重要性 w3 | 高频/显式置顶的条目 | 用户手动标记"最重要的约定"优先 |

**注入预算**:检索结果 top-k 后按预算截断(如 ≤1K token),宁缺毋滥——记忆系统反过来挤爆上下文窗口是常见事故。做法:先并行检索(语义 + 时序 + 实体),合并打分,取 Top K,再按权重重排,截断注入。

### 6. 更新、遗忘与记忆压缩

**更新比写入难**:新信息与旧记忆冲突时,三条路——覆盖(新信息明确否定旧信息)、合并(同主题合并去重)、共存(都保留,靠检索排序分新旧)。生产建议:显式覆盖走"DELETE + INSERT"(保留操作日志),隐式冲突走"共存 + 时间戳排序"。

**遗忘是特性不是缺陷**:

| 遗忘机制 | 做法 | 适用 |
|---|---|---|
| TTL 过期 | 条目带过期时间(如临时约定 30 天) | 临时性信息 |
| 频率衰减 | 长期未访问的条目降权,最终淘汰 | 一次性的偏好 |
| 容量上限 | 超出上限按"重要性 × 新鲜度"淘汰最差者 | 所有长时记忆 |
| 用户删除 | 用户可见、可删、可关 | 隐私与纠错底线 |

**记忆压缩(分层记忆)**:原始记录 → 摘要 → 事实,三层递进:

```text
第 1 层:原始会话记录(全文,按 TTL 归档,可追溯)
第 2 层:会话摘要(每会话一条,供上下文工程使用)
第 3 层:事实条目(跨会话提炼的长期事实,语义记忆的主体)
```

检索时按需取层:日常用第 3 层(便宜、精准),需要细节时回溯第 1 层。**隐私与合规**:记忆存的是用户数据——必须支持"查看我记住了什么、删除任意条目、关闭记忆"三件事;敏感类别(健康/财务/位置)默认不自动抽取或脱敏存储;记忆条目与用户强绑定,多租户严格隔离。隐私问题先解决,再谈记忆,否则记忆系统本身就是合规事故源。

## 学习路径

按 8-10 周规划,达标才进入下一阶段。本技能定位 senior,三阶段覆盖从补基础到生产专家。

### 阶段一:地基——会话状态与显式记忆(第 1-2 周)

**目标**:实现跨会话可恢复的短期记忆 + 用户显式要求的最简长期记忆。

- 掌握 checkpointer/thread 会话持久化模式
- 掌握滚动摘要压缩(先摘要再截断)
- 掌握"显式记忆"的最小闭环:用户说"记住 X" → 存 → 检索 → 应用

**验收标准**:

- [ ] 用 LangGraph(checkpointer)实现跨会话续聊:会话 A 里设的状态/变量,会话 B 可读取
- [ ] 实现滚动摘要:超窗后旧轮次被摘要替换,继续 10 轮对话,窗口 token 数保持有界
- [ ] 实现显式记忆闭环:3 条显式记忆(偏好/称呼/约定)跨会话生效,可列出、可删除

### 阶段二:架构——分层记忆与自动写入(第 3-5 周)

**目标**:设计四层架构,实现自动抽取写入与混合排序检索。

- 掌握写入双路径(hot path + background)与去重合并
- 掌握相关性 + 时效 + 重要性混合排序与注入预算
- 掌握记忆条目结构化(类型/内容/时间/来源/置信度)

**验收标准**:

- [ ] 实现 background 会话提炼:一次对话产生结构化记忆条目 ≥3 条,与存量去重合并,重复条目为零
- [ ] 实现混合排序检索:构造"旧信息 vs 新信息"冲突场景(如吃辣偏好变更),验证新记忆赢出
- [ ] 检索注入预算生效:100 条记忆的场景下,注入窗口的内容 ≤1K token,且答对率 ≥90%(你的测试集)

### 阶段三:生产专家——更新、遗忘、评估与合规(第 6-10 周)

**目标**:设计可维护、可评估、合规的生产级记忆系统,并量化记忆对任务成功率的贡献。

- 掌握冲突消解(覆盖/合并/共存)与操作审计
- 掌握遗忘机制(TTL/衰减/容量)与分层压缩(原始→摘要→事实)
- 掌握记忆质量评估:抽样人审 + 有/无记忆 A/B 对比

**验收标准**:

- [ ] 实现三层记忆(原始/摘要/事实)与至少两种遗忘机制,并用数据证明:半年模拟数据下检索噪声不增长
- [ ] 完成"有记忆 vs 无记忆"的 A/B 实验:同一任务两套 agent 各跑 30 次,给出记忆带来的成功率提升百分比
- [ ] 记忆界面三件套(查看/删除/关闭)可用;敏感条目默认不自动抽取;写出一页《记忆数据合规说明》

## 分步实操:为对话 Agent 加上分层记忆

下面的流程适用于任何"多轮对话 agent 记不住事"的改造。**先定义记忆需求与评估方法,再写存储**——先写代码再想需求,大概率制造检索垃圾场。

```
第 1 步:定义记忆需求与评估集       (回答"要记住什么、怎么算成功")
   ↓
第 2 步:短期记忆:checkpointer + 滚动摘要
   ↓
第 3 步:显式记忆闭环(最小可行)
   ↓
第 4 步:后台提炼与结构化管理
   ↓
第 5 步:混合排序检索 + 注入预算
   ↓
第 6 步:更新、遗忘、合规与评估
```

### 第 1 步:定义记忆需求与评估集

- 列出记忆需求:用户显式要求的?跨会话的偏好?项目约定?历史决策?每类标"价值/频率"
- 建评估集:30 个"需要记忆才能答对"的任务(如"我说过我不吃香菜,现在点个菜")+ 10 个"必须遗忘才能答对"的任务(如"我改主意了")——**这是记忆系统的验收测试**

### 第 2 步:短期记忆

- 接入 checkpointer:每轮状态持久化,thread 按用户会话隔离
- 加滚动摘要:历史超过预算时,LLM 摘要旧轮次替换之;摘要本身也在状态里

### 第 3 步:显式记忆闭环

- "记住 X" 意图识别(规则或小模型)→ 结构化条目(类别/内容/时间/来源)→ 存库
- 每轮开始前检索相关条目注入系统提示(严格预算)

### 第 4 步:后台提炼

- 会话结束事件 → 后台 LLM 提炼"值得长期记住的条目列表" → 与存量做去重与冲突检测 → 落库
- 条目带置信度:模型提炼的置信度 0-1,低置信度走"待确认"而非直接入库

### 第 5 步:混合排序检索

- 检索触发规则(见核心概念 5)→ 多路召回(语义 + 时序 + 实体)→ 加权混合排序 → 预算截断注入

### 第 6 步:更新、遗忘、合规与评估

- 冲突消解策略落地 + 操作日志(TTL/覆盖/删除都留痕)
- 用户查看/删除/关闭入口
- 跑评估集,对比"有记忆 vs 无记忆";上线后抽样人审记忆质量,持续修正写入规则

## 示例

三个示例:示例 1 是四层记忆核心(建议跑通),示例 2 是短期记忆的框架做法,示例 3 是更新与遗忘策略。

### 示例 1:分层记忆系统(带摘要的存取)

```python
# 场景:对话 agent 的记忆核心——三层记忆(原始/摘要/事实)+ 混合检索 + 遗忘。
import time
import json
from dataclasses import dataclass, field

@dataclass
class MemoryItem:
    """一条结构化事实记忆:类型/内容/时间/来源/置信度/访问次数。"""
    mem_type: str            # "preference" | "fact" | "episodic" | "rule"
    content: str
    ts: float = field(default_factory=time.time)
    source: str = ""
    confidence: float = 1.0
    visits: int = 0

class LayeredMemory:
    """三层记忆:raw(原始会话)→ summary(摘要)→ facts(事实条目)。"""

    def __init__(self, max_facts: int = 50, ttl_days: float = 90):
        self.raw: dict[str, str] = {}      # 会话id -> 原始记录
        self.summaries: dict[str, str] = {}  # 会话id -> 摘要
        self.facts: list[MemoryItem] = []
        self.max_facts = max_facts
        self.ttl_seconds = ttl_days * 86400

    # ── 写入:三层各写各的 ──
    def record_session(self, session_id: str, transcript: str, summary: str,
                       new_facts: list[tuple[str, str, float]]):
        """会话结束后调用:原始记录归档,摘要入库,事实条目去重合并后入库。"""
        self.raw[session_id] = transcript
        self.summaries[session_id] = summary
        for mem_type, content, confidence in new_facts:
            self._upsert_fact(mem_type, content, confidence)

    def _upsert_fact(self, mem_type: str, content: str, confidence: float):
        """去重合并:同类型同主题的条目合并,保留新时间戳。"""
        for f in self.facts:
            # 简化判重:同一类型且内容关键词重叠(生产用 embedding 相似度)
            if f.mem_type == mem_type and self._overlap(f.content, content) > 0.6:
                f.content = content          # 新信息覆盖旧内容
                f.ts = time.time()
                f.confidence = max(f.confidence, confidence)
                return
        self.facts.append(MemoryItem(mem_type=mem_type, content=content,
                                     confidence=confidence))

    @staticmethod
    def _overlap(a: str, b: str) -> float:
        """粗暴的文本重叠度:共有字符比例。生产用 embedding。"""
        sa, sb = set(a), set(b)
        return len(sa & sb) / max(1, len(sa | sb))

    # ── 检索:混合排序(相关性模拟 + 时效 + 重要性)+ 预算注入 ──
    def retrieve(self, query: str, budget_chars: int = 600,
                 now: float | None = None) -> list[str]:
        now = now or time.time()
        scored = []
        for f in self.facts:
            if now - f.ts > self.ttl_seconds:
                continue                        # 遗忘:TTL 过期不检索
            relevance = self._overlap(query, f.content)   # 简化相关性
            freshness = min(1.0, 30 * 86400 / max(1, now - f.ts))  # 30 天内线性衰减
            importance = min(1.0, 0.3 + 0.1 * f.visits + 0.6 * f.confidence)
            scored.append((0.5 * relevance + 0.3 * freshness + 0.2 * importance, f))
        scored.sort(key=lambda x: -x[0])
        # 注入预算:截断到 budget
        out, used = [], 0
        for _, f in scored:
            if used + len(f.content) > budget_chars:
                break
            out.append(f"[{f.mem_type}] {f.content}")
            used += len(f.content)
        return out

# ── 自测:写入两轮会话,验证冲突消解与遗忘 ──
mem = LayeredMemory()
mem.record_session("s1", "对话1全文", "摘要1",
                   [("preference", "用户不吃香菜", 0.9)])
mem.record_session("s2", "对话2全文", "摘要2",
                   [("preference", "用户现在吃香菜了", 0.95)])   # 冲突:覆盖
for r in mem.retrieve("今天给用户点个菜,注意忌口"):
    print("检索命中:", r)   # 应只出现新偏好("现在吃香菜"),旧条目被合并覆盖
```

**要点**:这个示例浓缩了设计要点——① 写入是"会话结束后的批处理提炼",不是每轮实时写;② 去重合并用同类型 + 内容相似度,新信息覆盖旧信息并抬高置信度;③ 检索用相关性+时效+重要性加权,TTL 过期直接不参与检索(遗忘);④ 注入预算截断防止记忆挤爆窗口。生产环境把"重叠度"换成 embedding 相似度,把"字符预算"换成 token 预算即可。

### 示例 2:短期记忆——LangGraph checkpointer 与滚动摘要

```python
# 场景:多轮对话跨会话可恢复。以 LangGraph 为例(概念性代码,依赖见官方文档)。
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver
from typing import TypedDict

class AgentState(TypedDict):
    messages: list[dict]      # 会话消息(短期记忆的载体)
    summary: str              # 滚动摘要(压缩后的早期历史)
    counter: int              # 会话内变量,跨轮保留

def chat_node(state: AgentState) -> dict:
    """模拟一轮对话:追加消息,必要时压缩摘要。"""
    state["messages"] = state.get("messages", [])
    state["counter"] = state.get("counter", 0) + 1
    # 简化:每 5 轮触发一次摘要压缩(生产按 token 预算判断)
    if len(state["messages"]) >= 5:
        old = state["messages"][:3]
        state["summary"] = (state.get("summary", "") +
                            f" [前{len(old)}条已压缩]")
        state["messages"] = state["messages"][3:]   # 旧消息移出窗口
    return state

# 编译:checkpointer 负责每轮状态持久化,同一 thread 可跨请求恢复
graph = StateGraph(AgentState)
graph.add_node("chat", chat_node)
graph.add_edge(START, "chat")
graph.add_edge("chat", END)
app = graph.compile(checkpointer=InMemorySaver())   # 生产用 Postgres/Redis saver

# 第一次请求(“会话 A”)
app.invoke({"messages": [{"role": "user", "content": "你好"}]},
           config={"configurable": {"thread_id": "session-A"}})
# 第二次请求:还能拿到 session-A 的 counter 与消息历史(跨请求记忆)
r = app.invoke({"messages": [{"role": "user", "content": "继续"}]},
               config={"configurable": {"thread_id": "session-A"}})
print("会话 A 第", r["counter"], "轮(counter 跨请求保留)")
```

**要点**:LangGraph 的记忆分工很清晰——checkpointer 持久化状态(跨请求/跨进程恢复),`summary` 字段做滚动压缩(先摘要再截断,而不是硬砍消息),`thread_id` 做会话隔离。这是短期记忆的事实标准做法,长期记忆(示例 1 的 facts)挂在 agent 节点里按需检索注入即可。

### 示例 3:记忆更新、冲突消解与用户可见可删

```python
# 场景:记忆操作审计 + 冲突消解 + 用户删除。核心思想:所有写操作留痕,用户有最终控制权。
import time

class MemoryStore:
    """带审计日志的记忆存储:UPDATE 显式覆盖,DELETE 用户授权。"""

    def __init__(self):
        self.items: dict[str, dict] = {}
        self.audit_log: list[dict] = []       # 操作审计,合规必需

    def _log(self, op: str, item_id: str, reason: str):
        self.audit_log.append({
            "ts": time.strftime("%Y-%m-%d %H:%M:%S"), "op": op,
            "item_id": item_id, "reason": reason,
        })

    def upsert(self, item_id: str, content: str, updated_by: str):
        """覆盖式更新:新信息明确否定旧信息时使用,写审计。"""
        old = self.items.get(item_id)
        self.items[item_id] = {"content": content, "updated_at": time.time()}
        self._log("UPDATE" if old else "INSERT", item_id,
                  f"by {updated_by}: {old['content'] if old else ''} → {content}")

    def coexist(self, item_id: str, content: str):
        """共存式更新:不确定新旧谁对时,新增条目,检索按时间排序分新旧。"""
        new_id = f"{item_id}#{int(time.time())}"
        self.items[new_id] = {"content": content, "updated_at": time.time()}
        self._log("COEXIST", new_id, f"branch from {item_id}")

    def delete(self, item_id: str, by: str) -> bool:
        """用户或系统授权删除:无论何种原因触发,都写审计。"""
        if item_id not in self.items:
            return False
        del self.items[item_id]
        self._log("DELETE", item_id, f"by {by}")
        return True

    def show_all(self) -> list[str]:
        """用户可见:『我记住了什么』列表。"""
        return [f"[{k}] {v['content']}" for k, v in sorted(
            self.items.items(), key=lambda kv: kv[1]["updated_at"], reverse=True)]

# ── 自测 ──
mem = MemoryStore()
mem.upsert("pref-diet", "用户不吃香菜", updated_by="user")
mem.coexist("pref-diet", "用户现在吃香菜了")     # 隐式冲突:共存,检索按时间分新旧
print("\n".join(mem.show_all()))
mem.delete("pref-diet", by="user")               # 用户删除错误记忆
print("审计日志条数:", len(mem.audit_log))
```

**要点**:三类操作对应三种语义——明确否定用 `upsert`(覆盖)、不确定用 `coexist`(共存靠时间排序)、纠正错误用 `delete`。所有操作写审计日志,这既是调试手段也是合规要求。用户可见可删是记忆系统的安全底线:**一条错误记忆会复利式地污染之后所有会话,必须让用户有最终控制权**。

## 练习

按顺序完成,产出建议放入 `personal/` 留档。

### 基础练习(阶段一对应)

- [ ] **P1-1 会话恢复**:用 LangGraph checkpointer(或等价方案)实现跨请求续聊:状态含 counter 与消息历史,重启进程后仍可恢复
- [ ] **P1-2 滚动摘要**:实现"超窗 → LLM 摘要旧轮次 → 替换原文",跑 10 轮对话,记录窗口 token 变化曲线,验证有界
- [ ] **P1-3 显式记忆闭环**:实现"记住 X"→存库→检索注入→生效,3 条显式记忆跨会话验证,支持列出与删除

### 进阶练习(阶段二对应)

- [ ] **P2-1 后台提炼**:实现会话结束后的批量提炼(LLM 产出结构化条目),与存量去重合并;跑 10 个会话,统计重复条目率(目标 <10%)
- [ ] **P2-2 混合排序**:实现相关性+时效+重要性加权检索;构造"偏好变更"场景(旧爱新恨)验证新记忆赢出,调权重得到稳定结果
- [ ] **P2-3 注入预算**:实现检索预算截断,测试 100 条记忆场景下注入 ≤1K token,并用 20 条"需记忆才能答对"的问题验证答对率

### 挑战练习(阶段三对应)

- [ ] **P3-1 分层压缩与遗忘**:实现原始→摘要→事实三层 + 两种遗忘机制(TTL/容量),模拟 6 个月数据,验证检索噪声不增长、旧事实正确过期
- [ ] **P3-2 记忆 A/B 实验**:同一任务两套 agent(有/无记忆)各跑 30 次,量化记忆带来的任务成功率提升,写实验报告
- [ ] **P3-3 合规与界面**:实现"查看/删除/关闭记忆"三入口 + 敏感类别(健康/财务)默认不抽取 + 操作审计日志;写一页《记忆数据合规说明》

## 自测题

先独立作答,再对照题后答案。答不出的题对应回看相关章节。

1. 四类记忆(工作/情景/语义/程序)在 Agent 中各对应什么?各用什么存储与检索?
2. "把全部对话历史向量化当记忆"错在哪?正确的做法是什么?
3. 短期记忆超窗时,为什么"先摘要再截断"而不是直接砍?
4. 写入时机有哪两条路径?生产系统为什么以 background 为主?
5. 记忆检索为什么不能只用 embedding 相似度?混合排序的三个权重各解决什么问题?
6. 新记忆与旧记忆冲突时,三种消解策略分别适用什么情况?
7. 遗忘机制有哪几种?为什么"不遗忘"的记忆库最终会失效?
8. 用户说"把我之前说的餐厅偏好删掉,以后别记了"。你需要在系统里落实哪几件事?
9. 你如何证明记忆系统真的有用,而不是自我感觉良好?

<details>
<summary>答案</summary>

1. 工作记忆=上下文窗口+scratchpad;情景记忆=会话/事件记录,用时间+实体过滤;语义记忆=事实与偏好,向量库+元数据过滤;程序记忆=工具用法与规则,按任务类型路由
2. 对话历史向量化既没有情景记忆的时序结构,也没有语义记忆的事实可靠性,检索回来大量寒暄噪声;正确做法是四类记忆分别建模、分别存取,历史只作原始层归档
3. 硬截断丢失关键细节且不可追溯;摘要保留语义压缩后的信息,配合原文归档可按需回溯
4. hot path(实时抽取,延迟敏感、质量低)与 background(会话后批处理提炼,质量高、可去重) ;生产以 background 为主,因为它能拿到完整会话、产出更可靠
5. embedding 相似度不懂时间、不懂重要性;相关性解决"语义匹配"、时效性解决"旧信息该让位新信息"、重要性解决"高频/显式记忆优先"
6. 覆盖:新信息明确否定旧信息;合并:同主题去重;共存:不确定谁对,都保留靠排序分新旧(并写审计)
7. TTL 过期、频率衰减、容量上限、用户删除;不遗忘的记忆库会累积过期与错误条目,检索噪声持续增长,最终检索结果不可信
8. 删除该条目(写审计)、确认关闭自动记忆抽取、同步调整检索过滤;另外把这次"用户纠正"本身作为信号更新相关条目的置信度
9. 用 A/B 实验:同一任务有/无记忆各跑 N 次对比成功率;加抽样人审与评估集,而不是拍脑袋说"好像记住了"
</details>

## 常见错误与反模式

- ❌ **把全部对话历史向量化当"记忆"**——检索回来的是寒暄噪声;四类记忆分别建模
- ❌ **每轮对话都实时写记忆**——重复条目与半成品结论堆积;hot path 只记关键事实,提炼交给 background
- ❌ **记忆对用户不可见不可删**——错误偏好永久生效还无法纠正;查看/删除/关闭是底线
- ❌ **检索结果不设预算全部注入**——记忆系统反过来挤爆上下文窗口;固定预算 + 截断
- ❌ **只做向量检索,不做时效与重要性处理**——旧信息永远压过新信息;混合排序
- ❌ **记忆与知识库混淆**——通用知识进知识库,记忆只存"与用户/任务相关的事实与偏好"
- ❌ **不区分显式与隐式记忆**——自动抽取的错误率远高于用户主动要求的;显式优先,隐式低置信度走待确认
- ❌ **没有遗忘机制**——记忆库随时间变成检索垃圾场;TTL/衰减/容量/用户删除四件套
- ❌ **把敏感信息当普通记忆自动抽取**——健康/财务/位置默认不抽或脱敏;先解决数据合规再谈记忆

## 参考资源

- [LangGraph — Memory 概念文档](https://langchain-ai.github.io/langgraph/concepts/memory/) — 文档,checkpointer/thread 与记忆的官方实践
- [MemGPT/Letta — Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560) — 论文,分层记忆与自编辑记忆的原始出处
- [Redis — Build smarter AI agents: short-term & long-term memory](https://redis.io/blog/build-smarter-ai-agents-manage-short-term-and-long-term-memory-with-redis/) — 文章,短期/长期记忆的存储实践
- [CoALA — Cognitive Architectures for Language Agents](https://arxiv.org/abs/2309.02427) — 论文,记忆/行动/决策的认知架构框架
- [Generative Agents (Park et al.)](https://arxiv.org/abs/2304.03442) — 论文,代理社会的记忆流与反思机制
- [MemoryBank (Zhong et al.)](https://arxiv.org/abs/2305.10250) — 论文,长时间记忆库与遗忘曲线
- [mem0](https://github.com/mem0ai/mem0) — 工具,开源记忆层(ADD/UPDATE/DELETE 操作与检索)
- [Letta(原 MemGPT)](https://github.com/letta-ai/letta) — 工具,自带记忆层级与自编辑记忆的 agent 框架

## 相关 Skills

- [context-window-management](../ai-ml/context-window-management.md) — 记忆与窗口的分工:窗口放不下是记忆系统的出发点
- [rag-pipeline](../ai-ml/rag-pipeline.md) — 检索技术的共享底座,长期记忆检索复用其管线
- [embeddings-design](../ai-ml/embeddings-design.md) — 记忆条目的向量化与相似度召回
- [agent-orchestration-design](../ai-ml/agent-orchestration-design.md) — 记忆在 agent 循环中的位置与编排
- [agent-evaluation](../ai-ml/agent-evaluation.md) — "有记忆 vs 无记忆"效果评估的方法底座