---
id: rag-pipeline-design
type: atomic-skill
title: RAG Pipeline Design
nameZh: RAG 管道架构设计
domain: ai-ml
level: senior
tags: rag, retrieval, architecture, llm, vector-search, hybrid-search
catalogSource: internal
catalogFile: atomic-skills/rag-pipeline-design.json
catalogAddedAt: 2026-07-26
operation: ai-llm
---

# RAG 管道架构设计

> 架构生产级 RAG 系统:多源摄取、高级分块策略、混合检索、重排序、查询变换与可观测性。区别于 [rag-pipeline](../ai-ml/rag-pipeline.md)(做什么/最小闭环),本技能解决的是"成千上万文档、多租户、要持续更新、质量可度量"的**生产级架构决策**。

## 这个技能解决什么问题

demo 级 RAG(固定分块 + 向量检索 + 直接生成)能回答演示问题,但一上生产就暴露四类硬问题:

| 问题 | demo 表现 | 生产要求 |
|---|---|---|
| **召回不准** | 专有名词/型号/代码符号搜不到(纯向量) | 混合检索 + 重排序 |
| **回答不忠** | 生成给不出引用,错了没法核查 | 引用链路 + faithfulness 评估 |
| **知识过期** | 文档更新了,索引还是旧的 | 增量索引 + 软删除 + 版本化 |
| **质量不可见** | "感觉还行" | Ragas 量化 + 检索/生成 trace |

**学完之后你应该能**:

- 根据文档类型(代码/表格/Markdown/PDF)选择分块策略,并论证
- 设计 dense + sparse + rerank 的检索链路,给出何时需要哪一层
- 为质量、延迟、成本设定量化目标,并用 Ragas 闭环度量
- 设计多租户隔离与增量索引更新方案
- 建立"检索失败兜底"策略,消灭无来源幻觉

## 前置知识

- [rag-pipeline](../ai-ml/rag-pipeline.md) — 本技能是它的生产升级;没跑通过最小闭环先回去
- [embeddings-design](../ai-ml/embeddings-design.md) — 嵌入模型选型与分块策略(本技能直接复用其"分块"决策)
- [vector-search](../ai-ml/vector-search.md) — ANN 索引、混合检索、RRF(本技能的检索层实现)
- [llm-evaluation](../ai-ml/llm-evaluation.md) — 评估基础;Ragas 是其 RAG 特化
- [system-design](../backend/system-design.md) — 扩展性/多租户/高可用的系统视角

## 核心概念

### 1. 质量三角:faithfulness / context-recall / answer-relevancy

Ragas 把 RAG 质量拆成三个可量化维度,评估时三条都要看:

| 维度 | 问的问题 | 测什么 | 典型坏例 |
|---|---|---|---|
| **faithfulness(忠实度)** | 答案是否都能由检索上下文支撑? | 幻觉程度 | 答里 30% 是模型自己编的 |
| **context-recall(召回率)** | 检索到的上下文是否覆盖了答案所需信息? | 检索漏没漏 | 关键事实没检索到 |
| **answer-relevancy(相关性)** | 答案是否切题、针对该问题? | 答非所问程度 | 答了相邻问题 |

**关键洞察**:三者对应管道不同环节——recall 归检索层,faithfulness 归生成层,relevancy 两边都沾。**指标降了先定位环节,别盲目调参**。

### 2. 分块策略:决定检索天花板

分块在检索之前决定了"可检索的单元"长什么样:

| 策略 | 做法 | 适用 | 缺陷 |
|---|---|---|---|
| 固定长度(512 token) | 一刀切 | 均匀文本 | 切断语义/表格 |
| 句子/段落分块 | 按自然边界 | 一般文档 | 长段落爆窗 |
| **结构感知分块** | 按 Markdown 标题/代码函数/表格行 | 代码、MD、表格 | 需要解析器 |
| **语义分块** | 按嵌入相似度切 | 主题跳跃的文档 | 计算成本 |

**实践规则**:chunk 上限 ≤ 检索结果的拼接预算(如 top-4 × 500 token);父子块(父块给上下文、子块做检索)解决"小块精确、大块完整"的矛盾。

### 3. 检索链路:三层递进

```
查询 ──→ 召回(recall 层)──→ 精排(rerank 层)──→ 生成
          dense + sparse       cross-encoder      + 引用
          (向量 + BM25)        (top-50 → top-5)
```

| 层 | 作用 | 常用实现 | 何时需要 |
|---|---|---|---|
| 召回 | 从百万级候选中快速取 50 | 向量(HNSW) + BM25 双路,RRF 融合 | 永远需要 |
| 精排 | 50 → 5,提高 precision | Cross-Encoder(如 bge-reranker) | 质量不够时再加 |
| 生成 | 用精排结果 + 引用作答 | LLM + 引用格式约束 | 永远需要 |

**为什么纯向量不够**:专有名词、型号、代码符号是"关键词匹配"友好型,BM25 召回它们的能力远超向量;向量负责语义相似。双路召回 + RRF 融合是生产默认。

### 4. 查询变换:问题不好,检索白做

用户查询往往"太短/太泛/太口语",直接拿去检索效果差。三个常用变换:

| 变换 | 做法 | 适用 |
|---|---|---|
| **multi-query** | 把问题扩写成多个角度分别检索 | 宽泛问题(多角度) |
| **HyDE** | 先让模型生成假设答案,用答案检索 | 短查询、query-document 词面差异大 |
| **step-back** | 泛化成上位问题再检索,再回到原问题 | 具体但需要背景的问题 |

> **要点**:变换有成本(多一次 LLM 或更多检索)。先量化"不改查询的基线",改完真的涨分再用。

### 5. 引用链路:让每个答案可验证

```
生成的答案段 ──→ [引用: doc-42 / chunk-7 / 行 12-15] ──→ 可点击溯源
```

实现三件套:

1. 检索时保留**来源元数据**(doc_id、chunk_id、页码/行号)
2. 生成 prompt 要求"只依据给定上下文,输出引用标记"
3. 客户端校验:引用必须落在检索结果集合内,否则标记为无来源

**业务价值**:faithfulness 是机器评估,引用是人工核查的最终手段。

### 6. 知识更新:索引的增删改查

| 操作 | 策略 |
|---|---|
| 新增/修改 | 增量索引(upsert 到同一集合) |
| 删除 | 软删除(标记 + 过滤)或物理删除 |
| 大规模改动 | 重建索引 + 版本化快照,灰度切换 |
| 一致性 | 源文档 hash 入库,摄取时比对 |

**多租户隔离**:用 namespace 或元数据过滤器(tenant_id)隔离集合,检索时强制过滤——防跨租户泄漏是第一安全要求。

### 7. 失败兜底:召回为空时不幻觉

```
检索结果为空或分数低于阈值:
  → 明确回复"未找到相关信息" + 建议扩展查询
  → 绝不生成"没有来源的猜测性回答"
```

阈值(score cutoff)要按数据分布调,防止把"低分但有价值"的也滤掉。

## 学习路径

建议 4-6 周,前置是 [rag-pipeline](../ai-ml/rag-pipeline.md) 与 [vector-search](../ai-ml/vector-search.md) 已达标。

### 阶段一:能架构 demo+(第 1-2 周)——Junior 水平

**目标**:从 demo 升级到"结构完整但非生产"的系统(混合检索 + 简单引用)。

- 掌握三类分块策略并会按文档类型选择
- 会搭 dense + BM25 双路召回 + RRF
- 会加基础引用(输出带 doc_id)

**验收标准**:

- [ ] 对一份混杂文档(代码 + 表格 + 正文),选分块策略并论证
- [ ] 双路召回比纯向量在专有名词查询上召回率提升,有数据
- [ ] 答案能携带可验证引用,回答"每个说法从哪来的"

### 阶段二:能量化(第 3-4 周)——Mid 水平

**目标**:Ragas 三指标闭环 + 查询变换 + context 压缩。

- 掌握 faithfulness / context-recall / answer-relevancy 的意义与度量
- 会做 multi-query / HyDE 的实验对比
- 会加 rerank 并量化其提升

**验收标准**:

- [ ] 建立 Ragas 评估集(≥50 问),跑出三指标基线
- [ ] 做一次查询变换实验,记录三指标变化与成本
- [ ] 加 reranker,对比加前后的 context-recall 与最终答案质量

### 阶段三:能上生产(第 5-6 周)——Senior 水平

**目标**:多租户、增量索引、可观测性、质量回归。

- 掌握命名空间隔离与索引更新策略
- 会为每次检索写 trace(query → chunks → answer)
- 能把三指标接进 CI 回归

**验收标准**:

- [ ] 系统支持多租户隔离,跨租户检索测试 0 泄漏
- [ ] 文档更新后索引一致性有验证机制(删/改/增全覆盖)
- [ ] 每次检索可 trace,三指标回归接入 CI,有基线阈值

## 分步实操

```
第 1 步 定义质量目标(三指标 + 延迟 + 成本数字)
   ↓
第 2 步 建基线:BM25 + top-k + 直出(用最简单组合先测)
   ↓
第 3 步 迭代检索:双路召回 → rerank,每步量化
   ↓
第 4 步 迭代生成:引用 + 失败兜底 + context 压缩
   ↓
第 5 步 生产化:多租户 / 增量索引 / trace / CI 回归
```

### 第 1-2 步:先量化,再优化

先接受"现在很差"的基线:BM25 单路 + top-4 + 直出。跑 Ragas 三指标,记录。**所有后续改动的胜负都对照这个基线**。

### 第 3 步:检索层迭代

每次只加一层:先加向量路看 recall,再加 RRF 融合,再加 rerank 看 precision。每步跑三指标,记录"哪步带来了提升"。

### 第 4 步:生成层迭代

引用格式进 prompt(top-4 带 doc_id,要求输出 `[doc-42]`);召回为空时输出既定兜底话术;检索上下文过长时做 context 压缩(只留最相关句)。

### 第 5 步:生产化

租户隔离(元数据过滤)、增量索引、trace 埋点(query_id 贯穿)、CI 回归(push 即跑 50 问评估)。

## 示例

### 示例 1:混合检索 + RRF 融合

```python
from rank_bm25 import BM25Okapi
import numpy as np

def hybrid_search(query: str, docs: list[dict], embed_fn, top_k: int = 5, k: int = 60):
    """dense + sparse 双路召回,RRF 融合取 top_k。docs: [{id, text}]"""
    # 1. 向量路(伪代码,实际用向量库)
    dense_hits = vector_db.search(embed_fn(query), top_k=k)   # [{id, score}]

    # 2. 稀疏路:BM25
    corpus = [d["text"] for d in docs]
    bm25 = BM25Okapi([doc.split() for doc in corpus])
    scores = bm25.get_scores(query.split())
    sparse_hits = sorted(
        ({"id": docs[i]["id"], "score": float(s)} for i, s in enumerate(scores)),
        key=lambda h: h["score"], reverse=True,
    )[:k]

    # 3. RRF 融合:1/(k + rank) 求和,对分数尺度不敏感
    rrf = {}
    for hits in (dense_hits, sparse_hits):
        for rank, h in enumerate(hits):
            rrf[h["id"]] = rrf.get(h["id"], 0) + 1.0 / (k + rank + 1)

    return sorted(rrf.items(), key=lambda x: x[1], reverse=True)[:top_k]
```

**要点**:RRF 用排名而非分数融合,两条路的分数尺度不同也能公平比较——这是它成为默认的原因。

### 示例 2:Ragas 三指标评估

```python
# pip install ragas langchain-openai
from ragas import EvaluationDataset, evaluate
from ragas.metrics import faithfulness, context_recall, answer_relevancy
from ragas.llms import LangchainLLMWrapper
from langchain_openai import ChatOpenAI

# 每个样本:question 问题 / contexts 检索到的上下文 / answer 模型答案 / ground_truth 标准答案
dataset = EvaluationDataset.from_list([
    {
        "user_input": "退款政策是几天?",
        "retrieved_contexts": ["本店支持 7 天无理由退款..."],  # 检索层输出
        "response": "支持 7 天无理由退款。",                    # 生成层输出
        "reference": "7 天无理由退款",                          # 金标准
    },
    # ... 至少 50 条
])

result = evaluate(
    dataset,
    metrics=[faithfulness, context_recall, answer_relevancy],
    llm=LangchainLLMWrapper(ChatOpenAI(model="gpt-4o-mini")),
)
print(result)
# {'faithfulness': 0.92, 'context_recall': 0.78, 'answer_relevancy': 0.85}
```

**要点**:三个指标各测一层——recall 低改检索,faithfulness 低改生成(及引用约束),别一把梭。

### 示例 3:带引用的生成与失败兜底

```python
SYSTEM = """你是知识库问答助手。规则:
1. 只依据【资料】作答,每个事实后标注来源 [编号](如 [1][2])
2. 【资料】无法支撑的问题,回答"未找到相关信息",并建议换个问法
3. 绝不编造来源编号之外的引用"""

def answer(question: str, hits: list[dict]) -> str:
    if not hits or hits[0]["score"] < SCORE_THRESHOLD:
        return "未找到相关信息。建议:补充关键词或换个问法重试。"  # 兜底:不幻觉

    context = "\n\n".join(f"[{h['id']}] {h['text']}" for h in hits[:4])
    resp = llm.chat([
        {"role": "system", "content": SYSTEM},
        {"role": "user", "content": f"【资料】\n{context}\n\n【问题】{question}"},
    ], temperature=0)
    return validate_citations(resp, {h["id"] for h in hits})  # 校验引用都在检索集内

def validate_citations(answer: str, allowed: set[str]) -> str:
    import re
    cited = set(re.findall(r"\[(\d+)\]", answer))
    if cited - allowed:
        return f"[引用校验失败,已拦截: {cited - allowed}] " + answer
    return answer
```

**要点**:兜底话术 + 引用白名单校验,双保险消灭"无来源幻觉"。

## 练习

产出放入 `personal/` 留档。

### 基础练习(阶段一对应)

- [ ] **P1-1 分块对比**:取 100 页混合文档(代码 + 表格 + 正文),分别用固定/结构感知/语义分块,对比检索命中率,写结论
- [ ] **P1-2 双路召回**:实现 dense + BM25 + RRF,在 10 个专有名词查询上对比纯向量,量化 recall 提升
- [ ] **P1-3 引用链路**:实现带 doc_id 引用的问答,人工核查 20 条回答的引用准确率

### 进阶练习(阶段二对应)

- [ ] **P2-1 Ragas 闭环**:建 ≥50 问评估集,跑三指标基线,记录
- [ ] **P2-2 查询变换实验**:multi-query / HyDE 各跑一轮,对比三指标与成本,给出"用不用"的结论
- [ ] **P2-3 Rerank 实验**:加 cross-encoder,对比加前后的 context-recall 与答案忠实度

### 挑战练习(阶段三对应)

- [ ] **P3-1 多租户隔离**:实现命名空间隔离,写跨租户检索测试,证明 0 泄漏
- [ ] **P3-2 增量索引**:实现 upsert + 软删除,验证"改一篇文档后 30 分钟内检索结果一致"
- [ ] **P3-3 CI 回归**:把 Ragas 三指标接进 CI(push 触发,50 问),设基线阈值,演示一次"回归被拦下"的场景

## 自测题

1. context-recall 低,问题出在哪层?应该改什么?
2. 为什么生产默认混合检索?BM25 强在哪、向量强在哪?
3. RRF 为什么用排名不用分数?
4. 结构感知分块解决什么问题?父子块解决什么?
5. 什么情况下 reranker 是必要的?
6. 查询变换有哪些?什么时候不值得用?
7. 召回为空时的正确行为是什么?为什么?
8. 多租户检索的第一安全要求是什么?

<details>
<summary>答案</summary>

1. 检索层。应该改召回策略(分块/混合检索/查询变换),不是改生成 prompt
2. BM25 强在关键词精确匹配(专有名词/型号/代码符号),向量强在语义相似。互补,双路召回 + RRF 是生产默认
3. 两条路的分数尺度不同(向量可能是余弦,BM25 是词频统计),排名可比,分数不可比
4. 结构感知解决"固定分块切断语义单元";父子块解决"小块检索精确、大块上下文完整"的矛盾
5. 召回 top-50 里混入大量不相关、top-5 直接取前几容易偏时;rerank 能在最后一步提高 precision
6. multi-query/HyDE/step-back。查询本身已清晰、基线 recall 已高、或成本敏感时,不值得
7. 明确回复"未找到相关信息",绝不生成无来源猜测——幻觉的第一性价比防线
8. 跨租户信息 0 泄漏:namespace/元数据过滤强制隔离,并有测试证明
</details>

## 常见错误与反模式

- ❌ **用固定 512-token 分块处理所有文档类型**——代码/表格/Markdown 各有最优策略
- ❌ **只用向量相似度**——专有名词/型号/代码符号召回率低,漏检直接丢分
- ❌ **检索超出窗口后随机截断**——丢失信息还不提示用户
- ❌ **不返回引用**——生成结果无从核查,faithfulness 无从谈起
- ❌ **评估只靠主观体验**——没有量化指标与回归,改崩了都不知道
- ❌ **召回为空还硬答**——无来源幻觉,最伤可信度
- ❌ **一次改多环节**——改了分块又加 rerank 又换嵌入,指标变了不知道谁的功劳
- ❌ **忽略租户隔离**——跨租户泄露是安全事故,不是性能问题
- ❌ **索引从不更新**——知识过期,回答风干

## 参考资源

- [Advanced RAG Techniques Overview](https://arxiv.org/abs/2312.10997) — 综述,生产 RAG 技术全景
- [Ragas](https://github.com/explodinggradients/ragas) — 工具,三指标评估框架
- [LlamaIndex 文档](https://docs.llamaindex.ai/en/stable/) — 文档,分块/索引/查询引擎参考
- [pgvector](https://github.com/pgvector/pgvector) — 工具,Postgres 向量扩展
- [HyDE (Gao et al.)](https://arxiv.org/abs/2212.10496) — 论文,假设文档扩展
- [LangChain Contextual Compression](https://python.langchain.com/docs/how_to/contextual_compression/) — 文档,检索结果压缩

## 相关 Skills

- [rag-pipeline](../ai-ml/rag-pipeline.md) — 前置基础,本技能的生产升级
- [embeddings-design](../ai-ml/embeddings-design.md) — 分块与嵌入策略的直接输入
- [vector-search](../ai-ml/vector-search.md) — 检索层实现细节
- [llm-evaluation](../ai-ml/llm-evaluation.md) — Ragas 之外的评估方法学
- [context-window-management](../ai-ml/context-window-management.md) — 检索结果如何进窗口、不爆预算
- [system-design](../backend/system-design.md) — 多租户/扩展性/高可用视角