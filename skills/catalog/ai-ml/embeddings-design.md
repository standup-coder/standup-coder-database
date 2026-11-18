---
id: embeddings-design
type: atomic-skill
title: Embeddings Design
nameZh: 向量嵌入设计
domain: ai-ml
tags: llm, embeddings, rag, vector
catalogSource: internal
catalogFile: atomic-skills/embeddings-design.json
catalogAddedAt: 2026-07-26
operation: ai-llm
level: senior
---

# 向量嵌入设计

> 把"哪段文本和这个问题最相关"变成可量化、可实验、可迁移的工程决策:选模型、定距离、切分块、建评估。学完本技能,你能为一个具体语料(语言、领域、规模)设计出可复现的嵌入方案,并用检索命中率证明它的质量,而不是"感觉差不多"。

## 这个技能解决什么问题

RAG(检索增强生成)系统的效果上限由检索决定,而检索的上限由嵌入质量决定。但"嵌入"这条链路上一旦拍脑袋,问题会在一层层放大:

| 问题 | 拍脑袋做法 | 本技能的做法 |
|---|---|---|
| **召回不到相关文档** | 默认用英文通用模型处理中文/领域语料 | 按语言与领域选型,用离线评估集量化命中率 |
| **句子被切碎、语义丢失** | 固定 512 字符切块,句子拦腰截断 | 按句子/段落/结构边界切块,overlap 兜底 |
| **查询与文档相似度算不准** | 不知道 cosine / dot / euclidean 的区别,混用 | 归一化 + 与向量库 metric 严格对齐 |
| **维度与成本失控** | 一律选最大维度模型,索引与延迟爆炸 | 按规模与延迟预算选维度,Matryoshka 截断 |
| **检索质量无从改进** | 一轮轮换模型碰运气,没有对照 | 先建检索评估集,每次改动都有 hit@k / nDCG 分数 |
| **领域词永远召回不到** | 换三个模型都一样差,束手无策 | 知道什么时候微调值得,什么时候不值得 |

学完之后你应该能:

- 为一个具体语料(语言/领域/规模/延迟预算)选出 2-3 个候选嵌入模型,并说出取舍理由
- 解释 cosine、dot product、euclidean 三者的数学关系,并按要求归一化向量、对齐向量库 metric
- 设计分块策略实验:对比 chunk size、overlap、边界方式的检索命中率,而不是拍脑袋定 512
- 用多向量(父子块)方案解决"小块精确、大块有上下文"的矛盾
- 搭建离线检索评估集(query → 相关文档),用 hit@k / MRR / nDCG 量化嵌入质量
- 判断"该不该微调嵌入",包括成本、风险与收益的评估(大多数项目答案是不该)

## 前置知识

动手前,建议先掌握(按依赖顺序):

1. **基础提示工程与生成调用**([prompt-engineering](../ai-ml/prompt-engineering.md))——理解 LLM 与 API 的基本调用方式,嵌入 API 的调用方式与之同构
2. **代码级 API 调用**([claude-api](../ai-ml/claude-api.md))——本技能所有实验都要用代码批量调用 embedding API
3. **评估基线概念**([llm-evaluation](../ai-ml/llm-evaluation.md))——准确率、召回率、排序类指标(nDCG/MRR)的基本含义
4. **向量检索基础**:如果还没接触过,建议先读 [vector-search](../ai-ml/vector-search.md) 的"精确检索 vs ANN"一节,了解嵌入向量被消费的下游

如果你是从零开始,先读完上面四条链条的前半部分再回来;本技能默认你已会调 API、会写简单的 Python 脚本。

## 核心概念

本技能由六个概念组成,按"理解 → 应用"排序:前三节解决"什么是嵌入、怎么算相似、怎么选模型",后三节解决"怎么切块、怎么多级检索、怎么评估与迭代"。

### 1. 嵌入的本质:把语义变成可计算的几何

嵌入(embedding)是把文本映射到高维向量空间(如 1536 维)的函数,其核心性质是:**语义相近的文本,向量距离近;语义无关的文本,向量距离远**。

- 为什么不能直接用字符/词频?因为"苹果"与"水果"没有共同字符,但语义相关;词频向量(one-hot / TF-IDF)感知不到同义与语义关联
- 嵌入模型(如 text-embedding-3、BGE、M3E)在海量"相似句对"语料上训练,学到的是语义坐标,而不是词面
- 把文本切成多段后各自嵌入,就得到了一批"语义点";查询(query)同样被嵌入成一个点,检索 = 找离 query 最近的文档点

**怎么用**:
- 查询与文档必须用**同一个模型**生成向量,否则坐标空间不同,距离无意义
- 向量是"静态资产":一次计算,长期复用;但模型一换,全部重算(见概念 6 与常见错误)

### 2. 距离度量:cosine / dot / euclidean 与归一化

给定两个向量 **a**、**b**,三种常用度量的定义与关系:

| 度量 | 定义 | 取值范围 | 特点 |
|---|---|---|---|
| **cosine(余弦)** | a·b / (|a||b|) | [-1, 1] | 只看方向不看长度;最常用的语义相似度 |
| **dot(点积)** | Σ aᵢ·bᵢ | 无界 | 方向和长度都算;内积越大越相似 |
| **euclidean(L2)** | √(Σ (aᵢ-bᵢ)²) | [0, +∞) | 距离越小越相似;对向量长度敏感 |

**关键数学事实**:如果所有向量都做 **L2 归一化**(除以自身模长,使 |v| = 1),那么:

- cosine(a, b) = a·b(点积)
- euclidean²(a, b) = 2 − 2·cosine(a, b)(单调等价)

也就是说,**归一化之后,三种度量排序结果完全一致**。因此工程上常见的做法是:归一化存储向量,用 dot product 计算(计算最快,且许多向量库 dot 有硬件加速),语义上等价于 cosine。

**怎么用**:
- 存储/查询前先归一化,然后全文统一用 dot —— 这是大多数生产系统的默认
- 如果模型输出未归一化(部分模型如此),在索引与查询两端都做归一化,**缺一端就会检索错乱**
- 向量库(见 [vector-search](../ai-ml/vector-search.md))的 metric 参数必须与你的归一化方案一致:pgvector 的 `vector_cosine_ops` 内部按 cosine 实现;改 metric 必须重建索引

### 3. 嵌入模型选型:语言 / 领域 / 维度 / 成本

选型是嵌入设计的第一步,也是最容易被"默认用 GPT 配套模型"带偏的一步。判断维度:

**语言匹配**:中文语料用纯英文模型,检索质量常常显著劣化(英文模型的中文子空间表达粗糙);中文场景优先考虑 BGE-M3、M3E、text-embedding-3(多语言)等对中文有专项训练或覆盖的模型。

**领域匹配**:代码、法律、医疗、金融都有领域专用模型或在通用模型上表现更好的选择;判断依据是**评测数据**,不是宣传语。

**维度与成本**:维度越高,单向量体积越大 → 索引内存、查询延迟、存储成本按比例上升。text-embedding-3 支持 Matryoshka 式降维(如 3072 → 512),即用同一模型输出低维向量,精度损失远小于换小模型——这是"维度与成本"的关键工具。

| 模型(示例) | 语言 | 维度(可配置) | 适合规模 | 成本特征 | 典型用途 |
|---|---|---|---|---|---|
| OpenAI text-embedding-3-small | 多语言 | 512~1536 | 中小 | 低价、API 托管 | 通用 RAG 默认候选 |
| OpenAI text-embedding-3-large | 多语言 | 256~3072 | 中 | 高价;Matryoshka 降维 | 对精度敏感的通用场景 |
| BGE-M3(FlagOpen) | 中英多语言 | 1024 | 中大规模 | 开源可自托管 | 中文语料强候选 |
| M3E / bge-zh 系 | 中文 | 768 | 中小 | 开源 | 纯中文语料候选 |
| Cohere embed-v3 | 多语言 | 1024 | 中 | 按量计价 | 多语言生产场景 |
| 领域专用(如代码检索模型) | 视领域 | 不定 | 视领域 | 开源/托管 | 代码、法律、医疗等垂直检索 |

**怎么用**:
- 选型不是"选一个",而是"选出 2-3 个候选 + 设计对比实验"(见概念 6 与分步实操);MTEB / BEIR 榜单只能给方向,不能替你决定
- 把 **embedding 模型版本**视为 schema:记录在配置中,升级 = 索引重建(见常见错误)

### 4. 分块策略:chunk size / overlap / 边界

嵌入服务的对象是"块"(chunk),不是整篇文档。切块错误会让再好的模型也召回不到正确段落。

**核心矛盾**:
- 块太小 → 单个块丢失上下文(代词、条件、例外条款被切断),语义不完整,检索得分偏低
- 块太大 → 一个块包含多主题,query 与块的部分内容相似但被整体"稀释",且超出上下文预算

**三个可调旋钮与常识起点**:

| 旋钮 | 含义 | 实战起点 | 说明 |
|---|---|---|---|
| chunk_size | 每块目标长度 | 300-500 token(中文约 400-700 字) | 以句子/段落为计量单位而非固定字符 |
| overlap | 相邻块重叠 | 10%-20% | 缓解"关键句恰好落在边界"被切开 |
| 边界方式 | 在哪切 | 段落/标题优先,句子兜底 | 固定字节切块是最差默认 |

**边界方式对比**:

| 方式 | 优点 | 缺点 | 适用 |
|---|---|---|---|
| 固定字符/字节 | 实现最简单、可预测 | 句子腰斩、语义断裂 | 只适合极早期原型 |
| 按句子切分 | 语义完整,实现简单 | 无结构感知,长段落被拆 | 通用文档的默认 |
| 按段落/标题(结构感知) | 保持章节语境,块内主题一致 | 实现要解析 Markdown/标题 | 结构化文档(手册、规范) |
| 语义切分(模型判边界) | 主题一致度最高 | 额外模型调用成本、不可控 | 高质量检索的进阶选项 |

> **要点**:以上所有选项都在骗你——真正决定参数的是**你的评估集上的命中率实验**,不是任何文章推荐的"默认值"。分块策略与模型选型一起做正交实验(见示例 2)。

### 5. 多向量与父子块:兼顾精确与上下文

"小块精确、大块有上下文"是固定分块的死结,多向量方案把这个矛盾拆成两层:

- **子块(child chunk)**:小粒度(如一个段落),**用于检索**——query 更容易在小粒度上取得高相似度
- **父块(parent chunk)**:大粒度(如一个章节或整节),**用于生成**——携带完整上下文给 LLM 回答

**父子块检索流程**:query → 对子块向量检索 top-k → 取出每个命中子块的父块 → (去重)把父块文本送入 LLM。子块只当"指针",内容消耗的是父块。

类似的层级思路还有 **summary + chunks**:为每个章节生成一段 summary 并嵌入 summary,检索命中 summary 后取对应章节全文。

| 方案 | 检索粒度 | 生成粒度 | 代价 |
|---|---|---|---|
| 平面分块 | 块=生成单位 | 同左 | 实现最简单 |
| 父子块 | 子块(小) | 父块(大) | 多存一层向量 + 映射表 |
| summary+原文 | summary(小) | 原文(大) | 多一次 LLM 摘要调用 |

> **要点**:多向量不是默认方案。先验证"平面分块 + 好的边界"够不够,再上复杂度——它是命中率不足时性价比最高的第二招。

### 6. 嵌入质量评测与"是否微调"决策

**评测**:没有评估,选型全是玄学。最低成本的评估集构造:

- 采样 50-200 条真实 query(从日志、模拟提问、业务同事处收集)
- 人工标注每条 query 对应的**正确答案所在的文档与段落**(可多个)
- 指标:检索 top-k 是否包含正确答案 → **hit@k**(最直觉);排序质量 → **MRR / nDCG**(详见 [llm-evaluation](../ai-ml/llm-evaluation.md))

评估集是"审计资产":模型升级、分块改动、甚至语种分布变化,都拿它跑回归。

**微调决策**:当评估集显示"领域术语/表达方式在所有候选通用模型上都显著差"(如内部代码符号、法律条文编号、医学缩写),才考虑微调。微调嵌入需要:领域内正负样本对(数量级 1 万+)、训练流水线、以及**微调后必须重建全部索引的重成本**。

| 情况 | 建议 |
|---|---|
| 通用语料、术语正常 | 不微调;做选型 + 分块实验即可 |
| 领域术语多但样本不足 1 万对 | 不微调;尝试查询改写 / 词典扩展(见 [rag-pipeline-design](../ai-ml/rag-pipeline-design.md)) |
| 样本充足、通用模型明显劣势 | 微调(如 [fine-tuning](../ai-ml/fine-tuning.md));先小规模验证再全量 |
| 语料是代码 | 优先考虑代码专用嵌入模型,不要从零微调 |

## 学习路径

按 6-10 周规划,三阶段与 senior 定位匹配:从能调用 API 到能对生产索引做架构级决策。

### 阶段一:地基(第 1-2 周)——能调用、能解释

**目标**:跑通嵌入 API,理解向量与相似度的几何意义。

- 掌握 embedding API 的调用与批量嵌入的成本意识
- 理解 cosine / dot / euclidean 的数学关系与归一化的作用
- 能用 numpy 手写 top-k 检索(不需要向量库)

**验收标准**:

- [ ] 用代码批量把一个 100 条文本的语料嵌入,并手写余弦相似度 top-3 检索
- [ ] 验证一个数学事实:归一化后 cosine 排序 == dot 排序,并写下一段解释
- [ ] 说出 5 种以上"语义相关但无共同字符"的中文例子,证明自己理解了嵌入的语义本质

### 阶段二:工程化(第 3-5 周)——能选型、能实验

**目标**:为一个真实语料完成模型选型与分块实验,并建立评估集。

- 掌握评估集构造(query → 相关文档)与 hit@k / MRR 计算
- 掌握分块三旋钮(chunk size / overlap / 边界)的正交实验方法
- 会按语言/领域/维度/成本列出候选模型并跑对比

**验收标准**:

- [ ] 为你的语料建立 ≥50 条评估集,写出标注规则
- [ ] 完成 ≥2 个嵌入模型 × ≥2 种分块策略的对比实验,得到对比表并写出结论
- [ ] 用 Matryoshka 降维实验(如 1536 → 512)验证维度压缩后的 hit@k 损失,并与换小模型对比

### 阶段三:生产专家(第 6-10 周)——能做架构级决策

**目标**:处理多向量、微调决策与嵌入版本治理。

- 掌握父子块 / summary 多级检索的设计与实现
- 能写出"是否微调"的定量决策报告
- 把 embedding 模型版本纳入 schema 管理:升级流程 = 重建索引 + 回归评估

**验收标准**:

- [ ] 在已有平面分块系统上实现父子块检索,对比 hit@k 提升,并量化索引空间增量
- [ ] 用评估集证明或证伪一次"微调必要性"假设,给出数据与结论
- [ ] 写出一份嵌入升级 SOP:新模型 → 重建索引 → 评估回归 → 灰度切换,并演练一次

## 分步实操:一次完整的嵌入方案设计

下面流程适用于任何"给语料定嵌入方案"的任务。**顺序是先建评估基准,再动任何旋钮**——否则你无法判断改动是好是坏。

```
第 1 步:采样语料 + 构造评估集      (一切实验的裁判)
   ↓
第 2 步:跑基线(默认模型 + 简单分块) (对照点)
   ↓
第 3 步:模型选型实验(2-3 个候选)   (每步都对照基线)
   ↓
第 4 步:分块策略正交实验
   ↓
第 5 步:维度/成本调优
   ↓
第 6 步:定稿 + 写入配置与迁移文档
```

### 第 1 步:采样语料 + 构造评估集

- 从真实语料随机采样(覆盖各章节,而非只取前几页);query 尽量来自线上日志或真实提问
- 每 1 条 query 标注 1-3 个正确答案所在段落;标注规则文档化
- 评估集与未来分块实验**共用同一批 query**,保证可比

### 第 2 步:跑基线

用"任意一个说得过去的模型 + 按段落切块"先跑一遍,记录 hit@1 / hit@5 / MRR。**这是后续所有对比的坐标零点**。

### 第 3 步:模型选型实验

对候选模型逐一嵌入全部文档(评估集规模下成本可忽略),重跑同一批检索,记录对比表。淘汰明显垫底的,再对剩余候选做维度实验。

### 第 4 步:分块策略正交实验

固定模型,在 chunk_size ∈ {250, 400, 600} × overlap ∈ {0%, 15%} × 边界 ∈ {固定, 句子} 上跑正交实验(9 组以内,可控)。看 hit@k 与"邻居块冗余度"两项指标。

### 第 5 步:维度与成本调优

用 Matryoshka 降维逐步压缩维度,记录 hit@k 拐点;综合索引内存(维度 × 向量数 × 4 字节)与查询延迟(可取 [vector-search](../ai-ml/vector-search.md) 的延迟预算视角)定最终维度。

### 第 6 步:定稿与治理

- 把 `{model, version, dimension, metric, chunk 参数}` 写入配置(视为 schema)
- 记录:检索使用方(索引构建)与查询方必须同模型同 metric,否则返工(见常见错误)

## 示例

三个完整示例,覆盖本技能核心场景。示例 1 建议先跑通,示例 2、3 在示例 1 基础上演进。

### 示例 1:最小语义检索(embedding API + 余弦相似度)

```python
# 场景:把一段客服文档集做成"用自然语言提问"的检索 demo
# 依赖: pip install openai numpy
import os
import numpy as np
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
MODEL = "text-embedding-3-small"   # 候选模型之一,可按需替换为其他厂商/自托管模型

def embed(texts: list[str]) -> np.ndarray:
    """批量嵌入并 L2 归一化:归一化后 dot == cosine,计算最快。"""
    resp = client.embeddings.create(model=MODEL, input=texts)
    vecs = np.array([d.embedding for d in resp.data], dtype="float32")
    return vecs / np.linalg.norm(vecs, axis=1, keepdims=True)

# 语料:三段"块"(真实项目里来自分块器)
docs = [
    "退款政策:商品签收后 7 天内可申请无理由退款,运费由买家承担。",
    "配送范围:目前支持全国主要城市,偏远地区时效延长 2-3 天。",
    "会员权益:年度会员享受专属客服、生日礼券与双倍积分。",
]
doc_vecs = embed(docs)

def search(query: str, k: int = 2) -> list[tuple[int, float]]:
    """查询 → top-k,返回 (文档下标, 相似度)。"""
    qv = embed([query])[0]
    scores = doc_vecs @ qv                     # 归一化向量的点积 == 余弦相似度
    top = np.argsort(-scores)[:k]
    return [(int(i), float(scores[i])) for i in top]

for q in ["买的东西能退吗?", "会员有什么好处?", "什么时候能送到?"]:
    print(f"Q: {q}")
    for i, s in search(q):
        print(f"  {s:.3f}  {docs[i]}")
```

**要点**:归一化后点积即余弦,是生产检索的标准姿势;模型与维度收敛于配置常量,便于后续升级替换;评估时用同一批 query 换模型重跑即可对比(设计上预留了"refactor 成实验"的空间)。

### 示例 2:分块策略对比实验(数据驱动定参数)

```python
# 场景:同一评估集上对比"固定 300 字" vs "按句子切分 + 20% overlap",以 hit@k 定分块方案
# 依赖: pip install openai numpy jieba   (jieba 仅用于中文句切分的简易实现)
import re
import os
import numpy as np
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
MODEL = "text-embedding-3-small"

def embed(texts):
    resp = client.embeddings.create(model=MODEL, input=texts)
    v = np.array([d.embedding for d in resp.data], dtype="float32")
    return v / np.linalg.norm(v, axis=1, keepdims=True)

def chunk_fixed(text, size=300):
    """固定字符切块(坏基线:可能把句子腰斩,中文按字切)。"""
    return [text[i:i + size] for i in range(0, len(text), size)]

def chunk_by_sentence(text, size=300, overlap=0.2):
    """按句切分,句子跨块时保留 overlap 让边界句不丢失。"""
    sents = [s for s in re.split(r"(?<=[。！？!?])", text) if s.strip()]
    chunks, cur = [], ""
    for s in sents:
        if len(cur) + len(s) > size and cur:
            chunks.append(cur)
            cur = s  # 新块起点是"撞到上限"的那一句
        else:
            cur += s
    if cur:
        chunks.append(cur)
    return chunks

# 评估集:(query, 正确答案所在的原始段落列表)
EVAL = [
    ("运费谁出?", ["商品签收后 7 天内可申请无理由退款,运费由买家承担"]),
    ("会员有积分吗?", ["年度会员享受专属客服、生日礼券与双倍积分"]),
    # …… 实际项目至少 50 条,这里节选 2 条示意
]

# 读入长文档(这里用拼接的示例文本模拟)
FULL_DOC = ("退款政策:商品签收后 7 天内可申请无理由退款,运费由买家承担。"
            "配送范围:目前支持全国主要城市,偏远地区时效延长 2-3 天。"
            "会员权益:年度会员享受专属客服、生日礼券与双倍积分。")

def hit_rate(reader):
    """对每种分块策略:建索引 → 逐 query 检索 → 统计 top-3 是否含标注段落。"""
    chunks = reader(FULL_DOC)
    vecs = embed(chunks)
    hits = 0
    for q, golds in EVAL:
        qv = embed([q])[0]
        top_idx = np.argsort(-(vecs @ qv))[:3]
        hit = any(any(g in chunks[i] for g in golds) for i in top_idx)
        hits += hit
        print(f"  {q!r:20} -> {'✓' if hit else '✗'}  @{len(chunks)}块")
    return hits / len(EVAL)

print("方案 A:固定 300 字切块")
print(f"  hit@3 = {hit_rate(lambda t: chunk_fixed(t, 300)):.0%}")
print("方案 B:按句子切分 + overlap 兜底")
print(f"  hit@3 = {hit_rate(lambda t: chunk_by_sentence(t, 300)):.0%}")
```

**要点**:两种方案共用一个评估集 → 分数可直接对比;overlap 的真正作用不是"多存几个字",而是保住"答案句恰好跨边界"的丢失场景;真实项目把 reader 换成参数化配置,实验就变成一份可回归的脚本。

### 示例 3:父子块检索(小粒度召回 + 大粒度生成)

```python
# 场景:平面分块命中率不足时,升级为"子块检索 → 父块生成"
# 依赖: pip install openai numpy
import os
import numpy as np
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
MODEL = "text-embedding-3-small"

def embed(texts):
    resp = client.embeddings.create(model=MODEL, input=texts)
    v = np.array([d.embedding for d in resp.data], dtype="float32")
    return v / np.linalg.norm(v, axis=1, keepdims=True)

# 文档:parent = 整节,child = 节内段落(子块与父块各建索引)
PARENTS = [
    {"id": "p1", "text": "退款政策:商品签收后 7 天内可申请无理由退款,运费由买家承担。拒收商品请勿拆封。"},
    {"id": "p2", "text": "配送范围:目前支持全国主要城市,偏远地区(新疆、西藏)时效延长 2-3 天。"},
]
CHILDREN = [
    {"id": "c1", "parent": "p1", "text": "商品签收后 7 天内可申请无理由退款"},
    {"id": "c2", "parent": "p1", "text": "运费由买家承担,拒收商品请勿拆封"},
    {"id": "c3", "parent": "p2", "text": "支持全国主要城市配送"},
    {"id": "c4", "parent": "p2", "text": "偏远地区(新疆、西藏)时效延长 2-3 天"},
]

child_texts = [c["text"] for c in CHILDREN]
child_vecs = embed(child_texts)
# 父块只存文本,不参与检索(或按需也嵌入,用于 summary 方案)

def retrieve_parent(query: str, k: int = 2) -> list[dict]:
    """子块检索 → 映射回父块 → 去重。"""
    qv = embed([query])[0]
    scores = child_vecs @ qv
    top = np.argsort(-scores)[:k]
    parent_ids, seen = [], set()
    for i in top:                       # 按分数从高到低取,父块只取一次
        pid = CHILDREN[int(i)]["parent"]
        if pid not in seen:
            seen.add(pid)
            parent_ids.append(pid)
    return [p for p in PARENTS if p["id"] in parent_ids]

for q in ["偏远地区多久能到?", "没拆封的拒收品怎么办?"]:
    print(f"Q: {q}")
    for p in retrieve_parent(q):
        print(f"  -> 父块 {p['id']}: {p['text']}")
```

**要点**:子块在"多少个字内最像 query"上做文章,父块在"给 LLM 的上下文完整度"上做文章,两者解耦;父块按分数顺序去重,保证 top-k 预算不被同一个父块占满;这个模式是生产 RAG 命中率不足时的第二标准招(第一招是先查分块与选型)。

## 练习

按顺序完成。每项都有明确产出,建议把产出放进 `personal/` 目录留档。

### 基础练习(阶段一对应)

- [ ] **P1-1 最小检索**:用任意 embedding API 完成示例 1 的检索 demo,换成 50 条你自己的语料并跑通 5 条 query
- [ ] **P1-2 度量关系验证**:写脚本验证"归一化后 cosine 排序 == dot 排序",并验证 euclidean 与 cosine 的单调关系
- [ ] **P1-3 反例观察**:找出 3 条"查询与答案无共同字符但语义相关"和 3 条"有共同字符但语义无关"的例子,分别看检索得分,写下观察

### 进阶练习(阶段二对应)

- [ ] **P2-1 评估集**:为你的语料构造 ≥50 条(query → 相关段落)评估集,标注规则写成文档
- [ ] **P2-2 模型对比**:≥2 个嵌入模型在同一评估集上跑对比,产出 hit@1 / hit@5 / MRR 对比表与结论
- [ ] **P2-3 分块正交实验**:chunk size × overlap × 边界方式的正交实验(至少 6 组),产出对比表并确定你的语料最优参数
- [ ] **P2-4 维度调优**:用 Matryoshka 降维画 hit@k-维度曲线,选出"精度损失可接受的最小维度"

### 挑战练习(阶段三对应)

- [ ] **P3-1 父子块升级**:在平面分块系统上实现父子块检索,量化 hit@k 增益与索引体积增量,写决策记录
- [ ] **P3-2 微调决策报告**:收集领域术语失败案例,写一份"该不该微调"的数据驱动报告(含样本量估算与成本估算)
- [ ] **P3-3 版本治理演练**:模拟 embedding 模型升级:新模型 → 全量重建 → 评估回归 → 灰度切换,产出升级 SOP 与回滚预案

## 自测题

先独立作答,再对照题后答案。答不出的题对应回看相关章节。

1. 为什么服务端存储/检索的向量必须与查询向量归一化方式一致?归一化之后 dot 和 cosine 是什么关系?
2. 你的语料是中文技术文档,评估集显示英文通用模型 hit@5 只有 40%。你的下一步动作按优先级排序是什么?(三件事)
3. Matryoshka 维度压缩解决什么问题?它和"换一个更小的模型"的本质区别是什么?
4. 固定 512 字符切块在中文语料上的两个典型问题是什么?overlap 解决的是哪一个?
5. 父子块方案里,检索粒度和生成粒度分别是谁?为什么这样分工?
6. hit@k、MRR、nDCG 各自回答什么问题?构造评估集时最少需要哪些标注信息?
7. 什么条件下"微调嵌入"才是合理决策?微调前必须满足的两个前提是什么?
8. 检索服务端仍在使用 text-embedding-3-small 的旧索引,而查询端误切成了 large 模型。会发生什么?如何用一句话向同事解释?

<details>
<summary>答案</summary>

1. 坐标空间必须一致,距离才有意义;归一化后 dot(a,b) = cosine(a,b),且 euclidean² = 2 − 2cosine,三种度量排序完全一致。缺一端归一化会导致相似度被向量长度污染,检索结果错乱
2. ① 先看评估集与标注质量(query 是否真实、标注是否准确);② 换中文/多语言候选模型(BGE-M3、text-embedding-3 等)重跑;③ 若仍差,再调分块策略。顺序原则:先排除数据问题,再动模型,最后动分块
3. 解决"高维度带来的存储/延迟成本"问题:同一个模型降维输出,语义质量损失远小于换小模型(不同模型的子空间能力不同);Matryoshka 是在"同一语义空间内做精度-成本折中"
4. 句子被拦腰截断导致语义不完整(检索语义被破坏) + 关键句恰好落在块边界丢失(召回遗漏)。overlap 缓解的是后者:让边界句在相邻块中重复出现,至少一个块保留完整句子
5. 检索粒度是子块(小,容易与 query 高相似),生成粒度是父块(大,上下文完整给 LLM)。子块当"指针",内容消费父块
6. hit@k 回答"正确答案在不在前 k 个里"(召回);MRR 回答"第一个正确答案多靠前"(排序);nDCG 回答"相关结果整体排得有多好"(排序质量)。评估集最少需要:query + 正确答案所在文档/段落
7. 条件:① 领域术语在所有候选通用模型上系统性失败(有评估证据);② 有 ≥1 万条领域正负样本对可训练。满足后再评估成本:微调 + 全量索引重建 + 长期版本维护,通常中小项目不值得
8. "两边向量不在同一个坐标系里,检索等于拿米尺量公斤"。解决:模型版本必须写入配置并强制一致,升级走全量重建流程
</details>

## 常见错误与反模式

- ❌ **固定字节切块导致句子腰斩**——语义碎片让"最相似的块"变成"最像的半句话"。按句子/段落边界切,overlap 兜底
- ❌ **不归一化就混用 metrics**——索引端 cosine、查询端 dot,检索结果悄悄变差。归一化 + 全局统一 metric,任何一端改动都要重建
- ❌ **中文语料默认英文模型**——中文子空间表达粗糙,先看语言覆盖,再上评估实验
- ❌ **维度一律最大**——存储与延迟随维度线性涨,用 Matryoshka 找出精度拐点,而不是无脑 3072
- ❌ **线上线下模型不一致**——索引用 A 模型、查询用 B 模型 = 坐标系错乱,检索失效。把 embedding 模型当 schema 管,升级 = 重建
- ❌ **没有评估集就换模型**——"这次好像准了"不是证据。先建 hit@k 基线,每次改动看分数
- ❌ **评估集与演示数据同一批**——命中率虚高,上线即现形。评估集从真实 query 采样,与 demo 语料分离
- ❌ **把整个维度的成本丢给下游**——维度决策要放进延迟预算与存储预算里算,而不是嵌入侧孤立决定
- ❌ **遇到领域词就微调**——没有样本量、没有对比实验就微调,投入产出比极差。先评估、先试查询改写,微调是最后手段

## 参考资源

- [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) — 工具,嵌入模型跨语言/领域排行榜,选型起点
- [BGE Embeddings (FlagEmbedding)](https://github.com/FlagOpen/FlagEmbedding) — 工具,中文友好的开源嵌入模型族(BGE-M3 等)
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings) — 文档,嵌入 API、Matryoshka 降维与距离度量说明
- [Chunking Strategies for LLM Apps (Pinecone)](https://www.pinecone.io/learn/chunking-strategies/) — 文章,分块策略全谱系(Fixed/Recursive/Semantic 等)
- [BEIR Benchmark](https://github.com/beir-cellar/beir) — 工具,零样本检索基准,评估模型"开箱即用"能力的标准数据集
- [Sentence Embeddings (Reimers & Gurevych)](https://arxiv.org/abs/1908.10084) — 论文,Sentence-BERT:现代嵌入检索范式的来源
- [M3E / bge-zh 中文嵌入对比](https://github.com/wangyuxinwhy/uniem) — 工具,中文嵌入模型评估脚本与对比

## 相关 Skills

- [vector-search](../ai-ml/vector-search.md) — 下游消费方,把嵌入投入 ANN 索引与查询
- [rag-pipeline](../ai-ml/rag-pipeline.md) — 落地场景,嵌入是 RAG 摄取链的一环
- [llm-evaluation](../ai-ml/llm-evaluation.md) — 评估方法学,hit@k / nDCG 的指标细节
- [fine-tuning](../ai-ml/fine-tuning.md) — 微调嵌入时的训练流水线,进阶方向
- [rag-pipeline-design](../ai-ml/rag-pipeline-design.md) — 生产级检索架构,查询改写与多路召回弥补嵌入上限
- [claude-api](../ai-ml/claude-api.md) — 接入 API 的基础工程能力