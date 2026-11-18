---
id: rag-pipeline
type: atomic-skill
title: RAG Pipeline
nameZh: RAG 检索增强生成
domain: ai-ml
tags: rag, llm, retrieval, knowledge
catalogSource: internal
catalogFile: atomic-skills/rag-pipeline.json
catalogAddedAt: 2026-07-26
operation: ai-llm
level: mid
---

# RAG 检索增强生成

> 把"让模型基于你的资料回答"从口头需求变成一条可运行的流水线:摄取、分块、嵌入、检索、生成、引用,每一步都有明确的正确姿势与常见翻车点。学完本技能,你能独立搭出一条端到端 RAG,并知道它的天花板在哪里、瓶颈怎么找。

## 这个技能解决什么问题

大模型的知识截止与幻觉问题,让"直接问模型"在知识密集型场景(客服、内部知识库、文档问答)不可用。RAG(Retrieval-Augmented Generation)的答案是:**回答前先去资料里检索,只让模型基于检索到的证据说话**。但 RAG 不是"写 20 行代码就完事"——链路每一环都在暗中决定成败:

| 问题 | 拍脑袋做法 | 本技能的做法 |
|---|---|---|
| **答案张冠李戴** | 检索随便写,模型一本正经编 | 高质量分块 + 检索,生成时强制"仅依据证据" |
| **知识更新了答案还是旧的** | 文档改了,索引从不重建 | 明确的摄取链路与索引更新机制 |
| **答不出来还硬答** | 检索为空也让模型自由发挥 | 显式兜底:没证据就说"不知道" |
| **用户无法验证** | 回答没有出处 | 结构化引用:每句话/每条答案带来源 |
| **检索烂但不知道烂在哪** | 直接调 prompt,越调越乱 | 评估闭环:RAG 评价指标量化"哪一环在拖后腿" |
| **方案越堆越复杂** | agent + 多路检索一起上,基线都没打 | 从最小 baseline 起步,按数据迭代 |

学完之后你应该能:

- 讲清 RAG 八步链路(解析 → 清洗 → 分块 → 嵌入 → 索引 → 检索 → 生成 → 引用)每步的输入、输出与高频错误
- 搭出一条端到端最小可运行 RAG(纯 API 组装,不依赖重框架)
- 解释"检索质量是天花板,生成质量是地板",并知道如何用评估数据定位瓶颈
- 在"RAG vs 长上下文直塞"之间做出有依据的取舍
- 返回带引用、带置信度、带兜底的结构化答案
- 建立 50-200 条评估问答对,用 groundedness / faithfulness 等指标监控质量

## 前置知识

动手前,建议先掌握(按依赖顺序):

1. **向量嵌入设计**([embeddings-design](../ai-ml/embeddings-design.md))——分块与嵌入,链路的第一段
2. **向量检索**([vector-search](../ai-ml/vector-search.md))——链路的中段,检索质量与索引配置
3. **基础提示工程**([prompt-engineering](../ai-ml/prompt-engineering.md))——链路的末段,把证据组织进 prompt
4. **结构化输出与评估基础**([llm-evaluation](../ai-ml/llm-evaluation.md))——引用、置信度、faithfulness 指标的量化方法

如果从零开始:先把上面四条各读前半部分(能调 API、能算 top-k 即可),再回来;本技能会把它们串成一条流水线。

## 核心概念

本技能由六个概念组成,按"链路 → 质量 → 取舍 → 决策"排序:前三节解决"流水线怎么搭",后三节解决"质量怎么保、方案怎么选"。

### 1. RAG 八步链路总览:每步的输入输出与常见错误

一条 RAG 流水线的完整环节(前五步是"建库"(离线,可批量),后三步是"问答"(在线,单次)):

```
离线摄取(建知识库)                    在线问答
①解析 → ②清洗 → ③分块 → ④嵌入 → ⑤索引   ⑥检索 → ⑦生成 → ⑧引用
```

| 步骤 | 输入 → 输出 | 这一步的常见错误 |
|---|---|---|
| ①解析 | 源文档(PDF/Word/HTML/MD)→ 纯文本 | PDF 表格被拆成碎片;扫描件 OCR 缺失 |
| ②清洗 | 纯文本 → 干净文本 | 页眉页脚/重复内容污染;编码乱码不处理 |
| ③分块 | 文本 → 语义完整的块 | 固定字节切块腰斩句子;块内多主题稀释信号 |
| ④嵌入 | 块 → 向量 | 模型选错(语言/领域);查询与索引模型不一致 |
| ⑤索引 | 向量 + 元数据 → 向量库 | 无元数据无法过滤;索引与原文分离设计缺失 |
| ⑥检索 | query → top-k 块 | 只看 top-1;专有名词语义检索失手;无过滤 |
| ⑦生成 | 证据 + query → 答案 | 证据超窗被硬截断;prompt 没约束"只依据证据" |
| ⑧引用 | 答案 → 答案 + 来源 | 不返回来源;引用与证据块失联无法回溯 |

**怎么用**:任何一步出问题,先在评估上定位(见概念 6),不要从第八步往前瞎调。八步是"脚手架",不是教条——小原型可以合并(如 ①②③ 先用现成 loader),但每丢一步都要知道丢了什么。

### 2. 检索质量如何影响生成:天花板与地板

RAG 的核心不等式:**检索上限决定生成上限**。

- 检索不到相关证据 → 模型再好也只能"不知道"或幻觉——这是天花板
- 检索到了但 prompt 组织差、被截断、被淹没 → 证据到了手上也用不好——这是地板
- 检索到"看似相关实则无关"的噪音块 → 生成被带偏(这是 RAG 特有的幻觉来源)

**怎么用**:质量出问题时,先回答三个问题:①证据在不在检索结果里?没有 → 检查分块/嵌入/检索(上游)。②证据在,但答案没用上 → 检查 prompt 组织/截断(下游)。③证据进 prompt 了,仍答错 → 检查模型与指令遵循。**评估工具见概念 6:context recall 回答①,faithfulness 回答③**。

### 3. RAG vs 长上下文直塞:什么时候用哪个

长上下文模型(100K+ tokens)兴起后,"把所有资料塞进窗口让模型自己找"成了 RAG 的竞争者。两者不是非此即彼,而是按任务特征选:

| 维度 | RAG | 长上下文直塞 |
|---|---|---|
| 知识库规模 | 大规模、持续增长 | 小(单文档几十页内) |
| 更新频率 | 高:改文档重索引即可 | 低:每次改动要重发全文本 |
| 成本 | 检索便宜、生成省 token | 每次问答全量过上下文,贵 |
| 准确性 | 聚焦证据,减少噪音干扰 | 大上下文下模型注意力稀释(lost in the middle) |
| 延迟 | 多一次检索跳转 | 短(无检索) |
| 引用可追溯 | 天然带来源 | 来源追踪困难 |

**工程判断**:资料总量 / 单次问答需要的资料量 ≫ 1 且持续增长 → RAG;一个固定文档反复问、规模可控 → 直塞更快更省(或两者结合:先 RAG 检索,检索不到时升级为大窗口直塞)。

> **要点**:RAG 不是"先进",直塞不是"落伍"。判断口径是规模、更新频率与引用需求(详见 [context-window-management](../ai-ml/context-window-management.md) 的上下文预算视角)。

### 4. 查询改写:让问题先被问对

用户问题通常太模糊、太短,直接拿去检索命中率有限。查询改写(query rewriting)是检索侧的"翻译官",三类主流手法:

| 手法 | 做法 | 适用 | 代价 |
|---|---|---|---|
| **Multi-query** | 一个问题扩写成多个角度分别检索 | 问题宽泛、多面 | 检索次数 ×N |
| **HyDE** | 先让 LLM 基于问题写一段"假设答案",用它检索 | 表达差异大(query 与文档措辞不同) | 多一次生成调用 |
| **Step-back** | 把具体问题泛化成原理性问题再检索 | 追问"为什么"类问题 | 多一次生成 + 结果需回代 |

**判断准则**:先看检索失败的原因——是"用户没问清"就上改写,是"措辞不匹配"就上 HyDE,是"需要背景概念"就上 step-back。**不要三件套全上**(延迟与成本会翻倍,收益未必叠加)。实现顺序建议:multi-query 最先(无模型依赖、只加检索次数),HyDE 其次,step-back 最后。

### 5. 引用、置信度与兜底:结构化答案

RAG 的第二个生产级要求:**答案必须可验证**。返回结构建议:

```json
{
  "answer": "签收后 7 天内可无理由退款,运费由买家承担。",
  "citations": [{"doc_id": "refund-policy-2024", "chunk_id": 3, "snippet": "…7 天内可申请无理由退款…"}],
  "confidence": 0.87
}
```

- **citations**:每条关键结论挂到具体的块(snippet 能直接回溯);无引用的断言视为可疑
- **confidence**:由"证据强度 + 模型一致性"估算(简单实现:检索得分均值 / 答案自评;严格实现见 [rag-pipeline-design](../ai-ml/rag-pipeline-design.md) 的评估闭环)
- **兜底三连**:检索为空 → 明确回答"未找到相关信息";证据冲突 → 列出冲突双方不做裁决;低置信 → 给答案同时问澄清问题或建议人工

**怎么用**:prompt 里写死"仅依据提供的资料回答;资料中找不到答案时,回答『未找到相关信息』";结构化输出用 JSON mode / function calling 兜底(见 [prompt-engineering](../ai-ml/prompt-engineering.md) 概念 3)。

### 6. 评估闭环:不给幻觉留口子

RAG 的质量命题是"有没有按证据说话",需要专门的指标(与普通问答不同):

| 指标 | 回答的问题 | 怎么测 |
|---|---|---|
| **Faithfulness(忠实度)** | 答案是否都有证据支撑(不编造) | LLM-as-judge 逐句核对答案 vs 证据 |
| **Answer Relevancy** | 答案是否答了所问 | LLM 评分或人工 |
| **Context Precision / Recall** | 检索到的证据准不准、全不全 | 对照人工标注的"标准证据块" |
| **Groundedness** | 生成是否完全基于检索上下文 | 答案中"无出处断言"占比 |

工具:Ragas、DeepEval 等已把上述指标做成库(见参考资源)。**工程纪律**:先建 50-200 条(问题, 标准答案, 标准证据块)评估集,任何改动(分块、检索、prompt)都跑回归——没评估的 RAG 是"感觉还行"的 RAG。

## 学习路径

按 6-8 周规划,三阶段与 mid 定位匹配:到阶段三你能独立交付一条有评估、有兜底的 RAG。

### 阶段一:跑通最小 RAG(第 1-2 周)

**目标**:用 API 组装出一条端到端可问答的流水线(不依赖重框架)。

- 掌握八步链路的每一步在代码里对应什么
- 会用内存向量(不接外部库)跑通检索 + 生成
- 理解"证据 → prompt → 答案"的组织方式

**验收标准**:

- [ ] 跑通示例 1(纯 API 最小 RAG),换自己的 20 篇文档能答对 3-5 个事实性问题
- [ ] 能说出八步链路中,每一步的输入、输出与常见错误各一条
- [ ] 写出一段"资料里没有答案"的问题,确认系统会说"未找到相关信息"而不是硬答

### 阶段二:工程质量(第 3-5 周)

**目标**:引入检索质量手段与评估,让链路可量化。

- 掌握查询改写(multi-query 起步)与引用返回
- 建立评估集,用 Ragas/DeepEval 跑出 faithfulness / context recall
- 掌握 RAG vs 长上下文的取舍判断

**验收标准**:

- [ ] 建 ≥50 条评估问答对,跑通 Ragas(含 faithfulness 与 context recall)并记录基线分数
- [ ] 实现 multi-query 改写,在同一评估集上对比改前改后的 context recall
- [ ] 为你的场景写一页"RAG vs 直塞"决策说明,含数据量、更新频率、引用需求三项依据

### 阶段三:独立交付(第 6-8 周)

**目标**:交付可维护、可回归、有兜底的 RAG 服务。

- 掌握引用结构化返回与兜底三连
- 会做"检索 vs 生成"的瓶颈归因(三步定位法)
- 掌握最小成本结构:监控、回归、增量更新

**验收标准**:

- [ ] 交付一条带结构化解(答案+引用+置信度)与兜底逻辑的 RAG,跑通 3 种异常输入(空检索/冲突证据/低置信)
- [ ] 做一次瓶颈归因演练:人工破坏检索(如换烂分块),用评估指标定位问题环节并修复
- [ ] 知识库更新演练:改 1 篇文档 → 重索引 → 评估集回归,全程记录

## 分步实操:端到端 RAG 从 0 到 1

**先建评估问答对,再搭链路**——否则你无法判断链路改得好不好。

```
第 1 步:收集语料 + 建 20 条评估问答对   (标出标准答案与标准证据块)
   ↓
第 2 步:搭最小链路:解析 → 分块 → 嵌入  (结果:向量 + 内存索引)
   ↓
第 3 步:接检索:query → top-k 块         (先不管质量,跑通闭环)
   ↓
第 4 步:接生成:证据 → prompt → 答案     (带引用与兜底)
   ↓
第 5 步:扩评估集到 50+ 条,跑指标        (faithfulness / context recall 基线)
   ↓
第 6 步:按指标迭代(改写/分块/检索),每次改动留记录
```

### 第 1 步:语料 + 评估问答对

从真实使用场景收集问题(客服记录、团队提问、常见 FAQ 变形);每条标注:问题、标准答案、答案所依据的原文段落。20 条起步,50+ 条进阶段二。

### 第 2 步:最小摄取

解析:先只支持 Markdown / txt(绕开 PDF 解析的坑);分块:按段落 + 句子兜底(见 [embeddings-design](../ai-ml/embeddings-design.md) 概念 4);嵌入:任意说得过去的模型,固定版本号。

### 第 3 步:最小检索

先不过度设计:内存里 numpy 算 top-k 即可(示例 1 就是这种形态)。跑通"问题 → 块"的闭环,人工看 10 条检索结果像不像样——**这一步是评估检索的起点**。

### 第 4 步:最小生成

prompt 模板固定三段:角色(仅依据资料回答)、证据(带编号引用)、兜底规则(无证据 → "未找到相关信息")。要求模型输出 JSON(答案 + 引用编号列表)。

### 第 5 步:量化

评估集全部跑一遍:context recall(code)、faithfulness(code)、答案是否带引用(人工抽查)。记录基线分数——之后每一次改动都对照它。

### 第 6 步:迭代

按"瓶颈定位 → 单点修改 → 回归"循环:recall 低改检索侧,faithfulness 低改 prompt 侧。**一次只改一处**,每次记录分数变化(参考 [prompt-engineering-advanced](../ai-ml/prompt-engineering-advanced.md) 的评估驱动理念)。

## 示例

三个完整示例:示例 1 是纯 API 最小闭环(建议先跑通),示例 2 是带改写与引用的生产风格链路,示例 3 是评估闭环的最小实现。

### 示例 1:最小可运行 RAG(纯 API 组装,无框架)

```python
# 场景:20 篇文档 → 自然语言问答,零外部依赖(内存向量)
# 依赖: pip install openai numpy
import os
import re
import numpy as np
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
EMB = "text-embedding-3-small"
GEN = "gpt-4o-mini"

def embed(texts: list[str]) -> np.ndarray:
    resp = client.embeddings.create(model=EMB, input=texts)
    v = np.array([d.embedding for d in resp.data], dtype="float32")
    return v / np.linalg.norm(v, axis=1, keepdims=True)   # 归一化,点积即余弦

# ── ① 解析 + ② 清洗(示意:直接给干净文本;真实项目从 loader 开始)──
corpus = """
退款政策:商品签收后 7 天内可申请无理由退款,运费由买家承担。
配送范围:支持全国主要城市,偏远地区(新疆、西藏)时效延长 2-3 天。
会员权益:年度会员享受专属客服、生日礼券与双倍积分。
薪资结构:工资由基本工资与绩效奖金组成,绩效按月考核评定。
"""

# ── ③ 分块:按句子切(中文以句号/问号/感叹号为界)──
def chunk_by_sentence(text: str) -> list[str]:
    sents = [s.strip() for s in re.split(r"(?<=[。！？!?])", text) if s.strip()]
    return sents

chunks = chunk_by_sentence(corpus)
print(f"分块得到 {len(chunks)} 个块")

# ── ④ 嵌入 + ⑤ 索引(内存版)──
chunk_vecs = embed(chunks)
DOC_IDS = list(range(len(chunks)))

def retrieve(query: str, k: int = 2) -> list[tuple[int, float]]:
    """⑥ 检索:query 向量 → top-k 块,返回 (块号, 相似度)。"""
    qv = embed([query])[0]
    scores = chunk_vecs @ qv
    top = np.argsort(-scores)[:k]
    return [(int(i), float(scores[i])) for i in top]

def answer(query: str) -> str:
    """⑦ 生成 + ⑧ 引用:证据编号带入 prompt,答案带引用。"""
    hits = retrieve(query)
    evidence = "\n".join(f"[{i}] {chunks[i]}" for i, _ in hits)
    resp = client.chat.completions.create(
        model=GEN,
        messages=[
            {"role": "system", "content":
                "仅依据提供的资料回答。资料中找不到答案时,回答『未找到相关信息』。"
                "引用资料使用 [编号] 标注。"},
            {"role": "user", "content": f"资料:\n{evidence}\n\n问题:{query}"},
        ],
        temperature=0,
    )
    return resp.choices[0].message.content

# 跑三条真实问题(含一条"资料里没有"的负例)
for q in ["运费谁出?", "会员有什么福利?", "公司食堂几点开门?"]:
    print(f"\nQ: {q}\nA: {answer(q)}")
```

**要点**:八步链路在这里压缩成了五个函数,但每一步的职责仍在(注释标注了 ①-⑧);负例问题验证兜底规则真的生效;`temperature=0` + 显式兜底语句是"不幻觉"的两道基础防线;这个 60 行版本就是后续所有工程的骨架,不要一上来就换框架。

### 示例 2:生产风格链路(multi-query 改写 + 结构化引用 + 兜底)

```python
# 场景:在上一个示例骨架上,加查询改写与结构化输出
# 依赖: pip install openai numpy
import os
import json
import re
import numpy as np
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
EMB, GEN = "text-embedding-3-small", "gpt-4o-mini"

def embed(texts):
    resp = client.embeddings.create(model=EMB, input=texts)
    v = np.array([d.embedding for d in resp.data], dtype="float32")
    return v / np.linalg.norm(v, axis=1, keepdims=True)

CHUNKS = [s.strip() for s in re.split(r"(?<=[。！？!?])", """
退款政策:商品签收后 7 天内可申请无理由退款,运费由买家承担。
配送范围:支持全国主要城市,偏远地区(新疆、西藏)时效延长 2-3 天。
会员权益:年度会员享受专属客服、生日礼券与双倍积分。
""") if s.strip()]
chunk_vecs = embed(CHUNKS)

def multi_query_rewrite(query: str, n: int = 3) -> list[str]:
    """⑧(检索侧)把宽泛问题拆成多个角度,分别检索再合并。"""
    resp = client.chat.completions.create(
        model=GEN,
        messages=[{"role": "user", "content":
            f"把下面问题拆成 {n} 个更具体的子问题,只输出 JSON 数组,不要解释。\n问题:{query}"}],
        response_format={"type": "json_object"},
        temperature=0,
    )
    try:
        return json.loads(resp.choices[0].message.content)["queries"]
    except Exception:
        return [query]   # 改写失败就退回原问题,链路不中断

def retrieve_all(queries: list[str], k: int = 2) -> list[int]:
    """多路召回:每个子问题取 top-k,合并去重。"""
    seen, order = set(), []
    for q in queries:
        scores = chunk_vecs @ embed([q])[0]
        for i in np.argsort(-scores)[:k]:
            if int(i) not in seen:
                seen.add(int(i)); order.append(int(i))
    return order

def answer_structured(query: str) -> dict:
    rewritten = multi_query_rewrite(query)
    hit_ids = retrieve_all(rewritten)
    evidence = "\n".join(f"[{i}] {CHUNKS[i]}" for i in hit_ids)
    resp = client.chat.completions.create(
        model=GEN,
        messages=[{"role": "system", "content":
            '仅依据资料回答。无证据时 answer 填"未找到相关信息",citations 为空数组。'
            "输出 JSON:{'answer': str, 'citations': [int], 'confidence': float}"},
            {"role": "user", "content": f"资料:\n{evidence}\n\n问题:{query}\n原问题改写:{rewritten}"}],
        response_format={"type": "json_object"},
        temperature=0,
    )
    out = json.loads(resp.choices[0].message.content)
    out["retrieved_chunks"] = hit_ids          # 记录实际召回,便于评估回溯
    return out

print(json.dumps(answer_structured("会员有什么好处?主要有哪些权益?"), ensure_ascii=False, indent=2))
```

**要点**:multi-query 的好处在于宽泛问题分角度召回,合并结果让证据更全(代价是 N 倍检索,先只加这一招);结构化输出把"答案/引用/置信度"变成机器可消费的契约,下游(UI、客服工单)不用解析自由文本;`retrieved_chunks` 回传是为了评估闭环——每次问答都留下"查了什么"的痕迹。

### 示例 3:最小评估闭环(自实现 faithfulness + context recall)

```python
# 场景:不依赖 Ragas 也能先跑起来的最小评估:两个核心指标
# 依赖: pip install openai numpy
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
GEN = "gpt-4o-mini"

# 评估集:(问题, 标准答案, 标准证据块)——标准证据块在真实项目来自人工标注
EVAL = [
    ("运费谁出?", "运费由买家承担", "退款政策:…7 天内可申请无理由退款,运费由买家承担。"),
    ("会员有积分吗?", "未找到相关信息", "会员权益:年度会员享受专属客服、生日礼券与双倍积分。"),
]

def context_recall(retrieved: list[str], gold: str) -> float:
    """检索侧指标:标准证据块是否被召回(在 top-k 里查到即 1.0)。"""
    return 1.0 if any(gold in c for c in retrieved) else 0.0

def faithfulness(answer: str, retrieved: list[str]) -> float:
    """生成侧指标:答案的每个断言是否都有证据支撑(LLM-as-judge)。"""
    evidence = "\n".join(f"[{i}] {c}" for i, c in enumerate(retrieved))
    resp = client.chat.completions.create(
        model=GEN,
        temperature=0,
        messages=[{"role": "user", "content": (
            f"资料:\n{evidence}\n\n答案:{answer}\n\n"
            "逐句检查答案是否都能从资料中找到依据。"
            "返回 JSON:{\"supported\": bool, \"unsupported_claims\": [str]}")}],
        response_format={"type": "json_object"},
    )
    out = json.loads(resp.choices[0].message.content)
    return float(out["supported"])

# 模拟一次回归:换了一种检索/分块之后,重跑评估集
def run_regression(retrieve_fn):
    cr, fa = 0.0, 0.0
    for q, gold_answer, gold_chunk in EVAL:
        retrieved = retrieve_fn(q)
        cr += context_recall(retrieved, gold_chunk)
        # 生成(faithfulness 评估需要真实答案,这里用评估集标注答案近似)
        fa += faithfulness(gold_answer, retrieved)
    n = len(EVAL)
    print(f"context_recall={cr/n:.0%}  faithfulness={fa/n:.0%}")

run_regression(lambda q: ["退款政策:签收后 7 天内可无理由退款,运费由买家承担。"])
```

**要点**:两个指标分工明确——context_recall 管"证据找没找到"(检索引擎的 KPI),faithfulness 管"答案有没有编"(生成侧的 KPI),**检索与生成分开评估才能定位瓶颈**;LLM-as-judge 的可靠性依赖"资料+答案"同框逐句核对,这是 Ragas 同款思路的自实现版;真实项目直接把这段换成 Ragas,评估集格式不变(Ragas 教程见参考资源)。

## 练习

按顺序完成。每项都有明确产出,建议把产出放进 `personal/` 目录留档。

### 基础练习(阶段一对应)

- [ ] **P1-1 最小 RAG**:跑通示例 1,换成你自己的 20 篇文档(纯文本即可),建立 5 条问题-答案对照
- [ ] **P1-2 八步默写**:不看笔记写出八步链路及每步一个常见错误,再对照正文修正
- [ ] **P1-3 兜底验证**:构造 3 个"资料里没有答案"的问题,验证系统如实回复而非编造,记录输出

### 进阶练习(阶段二对应)

- [ ] **P2-1 评估集**:为你的语料建 ≥50 条评估问答对(含标准证据块),用示例 3 的脚本跑出 context_recall 与 faithfulness 基线
- [ ] **P2-2 multi-query**:实现查询改写并对比改前改后的 context_recall,写结论(提升多少、代价多少)
- [ ] **P2-3 取舍文档**:为你的场景写一页"RAG vs 长上下文直塞"决策说明,包含数据量、更新频率、引用需求三个维度

### 挑战练习(阶段三对应)

- [ ] **P3-1 瓶颈归因**:人为制造检索退化(如换烂分块),用指标定位问题环节,再修复并恢复指标,全程记录
- [ ] **P3-2 结构化契约**:把答案升级为"答案+引用+置信度"结构化输出,并用 3 种异常输入(空检索/冲突证据/低置信)验证行为
- [ ] **P3-3 更新演练**:知识库改 1 篇文档 → 重索引 → 评估回归,输出一份更新 SOP(含失败回滚)

## 自测题

先独立作答,再对照题后答案。答不出的题对应回看相关章节。

1. 八步链路中,哪三步是离线建库?哪三步是每次问答都发生?各自的作用是什么?
2. "答案错了"时,如何用两个指标快速判断瓶颈在检索还是生成?判断依据是什么?
3. 用户的资料总量 500 万字、每次问答平均只需要 3000 字、每月更新一次。你会选 RAG 还是直塞?理由至少两条
4. multi-query 和 HyDE 各解决什么问题?它们的代价分别是什么?
5. 检索结果里出现了"相关但错误"的证据块时,faithfulness 指标会怎样表现?这个坑说明评估要看什么?
6. 为什么检索为空时"让模型自由发挥"是反模式?正确做法是什么?
7. 引用的最小可信单元是什么?为什么引用不能只给"文档标题"?
8. 你的系统 context_recall=0.6、faithfulness=0.95。用户还是觉得答案不准,你的排查顺序是什么?

<details>
<summary>答案</summary>

1. 离线:③分块、④嵌入、⑤索引(有时含①②解析清洗,一次性批量);在线:⑥检索、⑦生成、⑧引用(每次问答都执行)。①②是建库前置,视资料形态而定
2. context_recall 低(证据没召回来)→ 检索/分块问题,查上游;context_recall 高但 faithfulness 低(证据在但答案编造)→ prompt/生成问题,查下游;两者都高还错 → 看证据本身对不对、模型指令遵循
3. 选 RAG:①500 万字每次直塞 3000 字,成本与注意力稀释都不可接受,检索聚焦才是正解;②有引用可回溯,改文档只需重索引。若资料只有几千字且无更新,才考虑直塞
4. multi-query 解决"问题太宽泛、单次检索不全面",代价是检索次数 ×N;HyDE 解决"query 与文档措辞差异大",代价是多一次假设文档生成调用
5. faithfulness 可能依然高分(答案每个断言都"有出处",但出处本身是错块)——这暴露单指标盲区:必须同时看 context precision(召回的块里有多少是对的)。评估是组合拳,不是单指标
6. 自由发挥会绕过证据产幻觉,且用户无法察觉"这是编的";正确做法是显式兜底:返回"未找到相关信息",或降级(转人工/问澄清问题/升级宽窗口)
7. 引用的最小单元是"文档/章节/块 + 可定位片段(snippet)",只给文档标题无法定位到具体句子,用户没法验证"这句是不是原文说的"
8. 先查 context_precision(召回的块准不准):recall 0.6 说明有 40% 该召回的没召回,但用户感知差还可能因为召回的块全是噪音——按"召回全不全 → 召回准不准 → 生成忠不忠"三步定位,一次只动一处
</details>

## 常见错误与反模式

- ❌ **检索结果一股脑塞进 prompt,超出上下文窗口**——超窗硬截断会随机丢证据;按相关性裁剪,预算内放最相关的,并告知截断
- ❌ **不返回引用**——用户无法验证,幻觉无从追责;结构化返回 citations + snippet
- ❌ **评估只看主观体验**——"感觉准多了"不积累;评估集 + faithfulness/context recall 才是证据
- ❌ **知识源更新但索引不重建**——索引是快照,过期即错;更新走"重新摄取 + 重建/增量 + 回归"
- ❌ **检索为空让模型自由发挥**——幻觉的第一来源;显式"未找到相关信息"
- ❌ **复杂方案堆砌**——agent + 多路检索 + 图谱一起上,零基线对照;先最小 RAG + 20 条评估,按数据加复杂度
- ❌ **八步链路跳过清洗**——PDF 页眉页脚、重复文本进索引,检索噪音与 token 浪费一起涨
- ❌ **query 与索引用的模型不一致**——坐标系错乱检索失效(反复出现的第一杀手)
- ❌ **评估集与 few-shot/演示数据同源**——分数虚高;评估集独立采样、标注规则文档化

## 参考资源

- [Retrieval-Augmented Generation (Lewis et al., 2020)](https://arxiv.org/abs/2005.11401) — 论文,RAG 原始论文,理解"检索+生成"范式的出发点
- [Ragas](https://github.com/explodinggradients/ragas) — 工具,faithfulness / context recall 等 RAG 指标的评估库
- [LangChain RAG Tutorial](https://python.langchain.com/docs/tutorials/rag/) — 文档,用框架搭 RAG 的官方入门(LangChain 版)
- [LlamaIndex Docs](https://docs.llamaindex.ai/) — 文档,数据框架版 RAG 教程(Loader/Index/Query 三层)
- [RAG 101 (NVIDIA)](https://developer.nvidia.com/blog/rag-101-retrieval-augmented-generation-questions-answered/) — 文章,RAG 概念与常见问题全景
- [Advanced RAG (NVIDIA)](https://developer.nvidia.com/blog/advanced-retrieval-augmented-generation-from-theory-to-llamaindex-implementation/) — 文章,查询改写、重排等进阶技术的工程化
- [How to Evaluate RAG (Vectara)](https://vectara.com/blog/how-to-evaluate-rag/) — 文章,评估指标与失败定位指南

## 相关 Skills

- [embeddings-design](../ai-ml/embeddings-design.md) — 前置,链路 ③④ 的正确姿势
- [vector-search](../ai-ml/vector-search.md) — 前置,链路 ⑤⑥ 的索引与检索
- [rag-pipeline-design](../ai-ml/rag-pipeline-design.md) — 进阶,生产级架构:混合检索、Rerank、评估闭环、可观测性
- [prompt-engineering](../ai-ml/prompt-engineering.md) — 前置,链路 ⑦ 的证据组织与指令约束
- [llm-evaluation](../ai-ml/llm-evaluation.md) — 评估方法,指标定义与评估集规范
- [context-window-management](../ai-ml/context-window-management.md) — 相关,检索结果与上下文预算的配合