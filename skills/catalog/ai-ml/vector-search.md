---
id: vector-search
type: atomic-skill
title: Vector Search
nameZh: 向量检索
domain: ai-ml
tags: vector, ann, retrieval, rag
catalogSource: internal
catalogFile: atomic-skills/vector-search.json
catalogAddedAt: 2026-07-26
operation: ai-llm
level: mid
---

# 向量检索

> 把"语义上最相关"从算法题变成工程题:理解 ANN 索引的代价结构,在召回率、延迟、内存之间做显式取舍,并会用过滤、混合检索与重排把 top-k 的质量顶上去。学完本技能,你能独立为数据规模与延迟预算选索引、配查询,并交付可量化的检索服务。

## 这个技能解决什么问题

嵌入(embeddings)把文本变成了向量,但"在 100 万条向量里找最相似的 10 条"本身是一个搜索问题。直接全量扫描(O(N) 距离计算)在小规模可行,规模一大就崩;而解决方案(ANN)各有各的代价,选错就是召回暴跌或内存爆炸:

| 问题 | 拍脑袋做法 | 本技能的做法 |
|---|---|---|
| **数据量一大查询就慢** | 全量暴力扫描,1 万条延迟还能忍,百万条直接超时 | 用 HNSW / IVF 等 ANN 索引,用可调的召回率换延迟 |
| **召回率、延迟、内存说不清** | 索引参数随便设,上线才发现 top-k 全是噪音 | 理解三角权衡,按指标预算(recall@k / P95)配参数 |
| **过滤条件失效** | 元数据过滤后套全量 ANN,过滤 99% 数据仍扫全部 | 按过滤基数选 pre-filter / post-filter,必要时分区 |
| **专有名词检索不到** | 纯向量检索,"SKU-4821"这种词召回率极低 | BM25 + 向量混合检索,RRF 融合两路结果 |
| **top-1 不准** | 直接信向量分数最高的一条 | 用 cross-encoder reranker 做精排,显著提升 top-k 精度 |
| **向量库选型靠迷信** | 看博客推荐就上,迁移一次成本巨大 | 按规模/部署成本/生态做对比表再定 |

学完之后你应该能:

- 解释 HNSW、IVF、PQ 的工作原理(直觉层面),并说出各自的代价结构
- 在"召回率 / 延迟 / 内存"三角里做出有依据的取舍,并说出你的指标预算
- 为高基数/低基数过滤字段选择正确的过滤时机,避免过滤后仍扫全表
- 实现 BM25 + 向量的混合检索与 RRF 融合,理解它为什么更稳
- 判断什么时候该加 reranker、加在哪个环节、预算多少延迟
- 在 pgvector / Qdrant / Weaviate / Milvus 之间做出有理由的选择

## 前置知识

动手前,建议先掌握(按依赖顺序):

1. **向量嵌入设计**([embeddings-design](../ai-ml/embeddings-design.md))——向量从哪来、cosine/dot/euclidean 的区别、归一化,本技能消费这些向量
2. **基础提示工程**([prompt-engineering](../ai-ml/prompt-engineering.md))——理解检索结果最终会进入 LLM 上下文,检索质量与生成质量的关系
3. **数据库查询基础**([postgresql-query-patterns](../data/postgresql-query-patterns.md))——如果选 pgvector,索引、EXPLAIN、B-tree 的基础概念会直接迁移
4. **评估指标**([llm-evaluation](../ai-ml/llm-evaluation.md))——recall@k、延迟分位数(P95)这些本技能反复使用的度量

如果从零开始,建议路径:先跑通 [embeddings-design](../ai-ml/embeddings-design.md) 的示例 1(手写 top-k),再回来学本技能的索引与工程化。

## 核心概念

本技能由六个概念组成,按"原理 → 决策 → 工程"排序:前三个是索引原理与代价,后三个是查询质量与选型。

### 1. 精确检索(KNN)与 ANN:问题与妥协

**精确最近邻(KNN,暴力扫描)**:把 query 与库里每条向量算距离,排序取 top-k。结果精确无误,但复杂度 O(N×D)(N 向量数、D 维度)。1 万条可行,100 万条×1536 维单次查询就是 15 亿次浮点乘加,延迟不可接受。

**近似最近邻(ANN)**:牺牲极小召回换取数量级的速度提升——通过索引结构跳过大量不可能命中的向量。**关键概念:召回率(recall@k)** = ANN 找到的 top-k 与精确 top-k 的重合比例。生产系统通常接受 recall@10 = 0.9x(即与暴力搜索相比丢掉 5%-10% 的命中)。

**怎么用**:先跑通精确检索(小数据量做基准),再引入 ANN 并量化 recall 损失——**没有精确检索基准的 ANN 参数是盲调**。

### 2. ANN 算法直觉:HNSW / IVF / PQ

三个主流思路,理解它们各自的"作弊方式":

| 算法 | 核心直觉 | 查询复杂度 | 内存 | 典型用途 |
|---|---|---|---|---|
| **HNSW** | 多层"社交网络":上层稀疏快搜,下层精细定位;跳着走,不走全图 | O(log N) 量级 | 高(图结构 + 全部向量) | 默认首选:高召回 + 低延迟 |
| **IVF** | 把空间聚类成 K 个桶,先找最近的几个桶,再在桶内暴力扫 | O(N/K) 量级 | 中 | 内存敏感的大规模 |
| **PQ(乘积量化)** | 把向量切成 m 段,每段用码本压缩成字节;距离用查表近似 | 同 IVF | 低(压缩存储) | 超大库 + 低内存 |

**HNSW 直觉**:想象城市地铁图。粗层(站少)决定"大致方向",细层(站多)精确到"哪个出口"。查询从顶层开始逐层下探,每次只走最近邻居——代价是每个节点都存了若干"指针"(邻居表),内存开销大,建索引慢,但查询极快、召回优秀,所以是**现代向量库默认索引**。

**IVF 直觉**:图书馆先按分类(聚类中心)找到书架,再在书架上逐本找。训练阶段对数据 K-means 聚类出 K 个中心;查询只进最近的 nprobe 个桶。nprobe 越大召回越高、越慢。

**PQ 直觉**:把每个向量压成"一段段短码",距离计算变成查预计算好的小表。召回损失最大,但内存可以压到 1/10 以下,适合"大于内存放不下"的超大规模。

| 决策问题 | 答案 |
|---|---|
| 100 万条以下、追求最简单可靠 | HNSW 默认参数,pq 不碰 |
| 千万级以上且内存是瓶颈 | IVF-PQ,用 recall 实验定 nprobe |
| 需要定期全量重建 | IVF 重建比 HNSW 便宜,但多数场景 HNSW 也可接受 |

### 3. 召回率 / 延迟 / 内存三角权衡

所有 ANN 参数都是这个三角形的滑块:

```
           召回率(recall@k)
            /\
           /  \
          /    \
   低延迟 ←------→ 低内存
```

- **HNSW 的 ef_search / M**:ef_search 越大召回越高延迟越高;M(每节点连接数)越大召回越高,但内存与建索引时间越大
- **IVF 的 nprobe**:越大越接近暴力,延迟线性上升
- **PQ 的 m / 码本位数**:压缩越狠内存越低,召回损失越大

**工程纪律**:**先定指标预算,再调参数**。例如:"recall@10 ≥ 0.95,P95 延迟 ≤ 50ms"——在预算内找最小内存配置,而不是"把召回调到最好看"。

**怎么用**:任何参数改动跑三件套:①在小样本精确检索基准上对照 recall;②批量压测 P95;③查监控确认内存余量。三者缺一,不能上线。

### 4. 元数据过滤:pre-filter 与 post-filter

业务查询几乎都带过滤条件:租户(tenant_id)、时间范围、文档类型、ACL 权限。向量库处理过滤有两条路线:

| 方式 | 流程 | 适用 | 风险 |
|---|---|---|---|
| **pre-filter** | 先按过滤条件圈定候选集,再在圈内做 ANN | 过滤后数据量仍然可观 | 过滤后集合太小 → 图和聚类失效,退化成扫描 |
| **post-filter** | 先 ANN 取 top-k(如 200),再过滤掉不满足条件者 | 过滤条件能筛掉大部分 | 过滤后剩余不足 k,结果空洞 |

**关键认知**:pre-filter 不是免费的——HNSW 图遍历无法利用 B-tree 索引,过滤条件让索引失效是常见陷阱。两个实战原则:

1. **过滤基数决定策略**:高基数过滤字段(如 tenant_id 有 10 万租户)→ 按字段分区/集合隔离,根本不做统一图;低基数(只有 3 个类型)→ post-filter 即可,把 top-k 放大到 5-10 倍再滤
2. **先过滤再检索做不到位时,扩大初步 top-k 兜底**:post-filter 时取 `k' = k × 5` 再滤,避免滤完不够用

### 5. 混合检索:BM25 + 向量,RRF 融合

纯向量检索的盲区:精确匹配型信号。专有名词("SKU-4821")、代码符号、型号字符串,语义相似度往往不如关键词精确命中可靠。**混合检索 = 一路 BM25(关键词)+ 一路向量(语义),然后把两路结果合并成一个 top-k**。

合并方法中工程上最稳的是 **RRF(Reciprocal Rank Fusion)**:给每条文档在两路结果中的排名取倒数求和,排名越靠前得分越高,不需要对齐两路的分数尺度:

```
score(d) = 1/(60 + rank_bm25(d)) + 1/(60 + rank_vector(d))
```

(常数 60 是 RRF 原文参数,平滑作用;只依赖排名,不依赖分数)

RRF 的好处:**两路使用的模型/metric 无需一致**,天然规避了"向量分数与 BM25 分数量纲不同怎么加权"的问题。

**怎么用**:BM25 用全文检索能力即可(Postgres 自带 tsvector、Qdrant 自带 BM25 或接外部、OpenSearch 等);RRF 合并后仍有过滤与 rerank 等后续环节。

| 场景 | 纯向量 | 混合 |
|---|---|---|
| 口语化、语义化提问 | ✅ 强 | ✅ 强 |
| 专有名词、型号、代码标识符 | ❌ 弱 | ✅ 强 |
| 一词多义需语境消歧 | ✅ 强 | 两路并用,仍强 |

### 6. Rerank:什么时候需要,预算多少

向量检索(双塔)是**粗排**:它用"一次性编码"换速度,天然损失精度。**Reranker(cross-encoder)** 把 query 与每条候选拼接后一起编码,注意力可以在 query 与文档之间互相看,精度显著更高,但代价是**每条候选都要过一次模型**——延迟与费用线性增长。

**决策准则**:

- top-1 必须准(问答、任务助手)→ 需要 rerank
- top-k 够了再人工挑(搜索列表)→ 视候选数滥用程度而定
- 候选 > 20 条时,先粗排取 10-20 条再 rerank —— rerank 只花在这 10-20 条上

**部署形态**:生产系统把 reranker 单独部署成服务(或用量化小模型),与主链路并行/串行;延迟预算 20-50ms 量级时用小模型(如 bge-reranker-base,百毫秒内);预算更紧就考虑"最后一公里才 rerank"(只有最终 top-5 过 reranker)。

## 学习路径

按 6-8 周规划,三阶段与 mid 定位匹配:到阶段三你应能独立交付一个可量化的检索服务。

### 阶段一:跑通(第 1-2 周)——会用

**目标**:能对已有向量库(或本地 demo)完成 top-k 查询,理解索引参数的意义。

- 掌握一个向量库(建议 pgvector 或 Qdrant)的建索引、写入、查询全流程
- 理解 HNSW 的 ef_search / M 参数对召回与延迟的影响
- 会写 recall@k 评估脚本(对照精确检索)

**验收标准**:

- [ ] 在 pgvector(或 Qdrant)里建好 1 万条向量的 HNSW 索引,跑通 5 条真实查询
- [ ] 用精确检索做基准,写出 recall@10 评估脚本并跑出 HNSW 的召回率
- [ ] 调高/调低 ef_search,记录 P95 延迟与 recall@10 的变化,写一段结论

### 阶段二:工程化(第 3-5 周)——会取舍

**目标**:能在指标预算下配置索引,并实现过滤与混合检索。

- 掌握元数据过滤的 pre/post 取舍与分区策略
- 实现 BM25 + 向量 + RRF 的混合检索
- 会评估 reranker 的收益与成本,知道什么时候加

**验收标准**:

- [ ] 在索引里加入 tenant_id / 时间字段,分别实现 pre-filter 与 post-filter,对比延迟与召回,写下选择依据
- [ ] 实现混合检索并跑通 RRF 融合,在专有名词型 query 上对比"纯向量 vs 混合"的命中率
- [ ] 部署(或用 API 模拟)一个 reranker,量化它对 top-5 精度的提升与延迟代价

### 阶段三:独立交付(第 6-8 周)——能定方案

**目标**:能独立为规模与预算选型、配参、交付。

- 掌握向量库选型对比表(pgvector/Qdrant/Weaviate/Milvus 的规模与成本口径)
- 能写出"索引配置 + 查询计划 + 监控指标"的交付文档
- 掌握批量写入、连接池等吞吐工程

**验收标准**:

- [ ] 为一个明确场景(数据规模、QPS、P95 预算)写出选型对比与最终方案,含索引参数与理由
- [ ] 方案落地后完成性能压测报告:recall@k、P95 延迟、内存占用三项齐全
- [ ] 交付一份包含监控指标(查询延迟、召回漂移)与重建/升级流程的运维文档

## 分步实操:从裸向量到可交付检索服务

下面的流程适用于"把一批向量变成查询服务"。**先建评估基准,再优化——先证明 HNSW 没丢太多召回,再谈参数调优**。

```
第 1 步:准备评估集与基准        (query + 精确检索的 ground truth)
   ↓
第 2 步:选库与建索引            (按规模/部署成本选型)
   ↓
第 3 步:验证召回:ANN vs 精确    (recall@k 必须量化)
   ↓
第 4 步:加过滤与混合检索        (逐步叠加,每步都要跑分)
   ↓
第 5 步:压测与定参数            (延迟预算内调 ef_search/nprobe)
   ↓
第 6 步:上线监控与重建流程
```

### 第 1 步:准备评估集与基准

- 100-200 条真实 query + 每条对应的正确答案(来自标注或日志)
- 用**暴力扫描**跑一遍精确 top-10 作为 ground truth——这是后面一切 recall 计算的参照

### 第 2 步:选库与建索引

按第 6 节与示例 3 的选型口径决定(pgvector 起步最省钱,专用库便于选址与扩展)。建 HNSW 索引,初始参数用默认。

### 第 3 步:验证召回

在评估集上跑 recall@10,与第 1 步对照。**若 recall < 0.9 先查 embedding 质量与分块,再调索引参数**——索引挽回不了嵌入的缺陷。

### 第 4 步:加过滤与混合检索

按过滤基数决定 pre/post;加 BM25 路做混合,R RF 融合;每条改动都重跑评估集与延迟采样,记录"改动 → 召回/延迟 → 结论"。

### 第 5 步:压测与定参数

用批量压测(如 1000 条 query 并发)调 ef_search / nprobe:在 P95 ≤ 预算的前提下取 recall 最高的配置。记录内存峰值。

### 第 6 步:上线监控与重建流程

监控查询 P95、recall 抽样、索引大小;写 embedding 升级/重建 SOP(重建 = 全量重新嵌入 + 换索引,期间用灰度或双写)。

## 示例

三个完整示例,覆盖本技能核心场景。示例 1 建议先跑通(pgvector 需要本地 PostgreSQL,或用 Docker 起一个);示例 2 用 Qdrant 展示混合检索;示例 3 是选型评估脚本。

### 示例 1:pgvector 从建表到 ANN 检索(含过滤)

```python
# 场景:PostgreSQL + pgvector 的最小完整链路
# 依赖: pip install psycopg2-binary openai numpy
# 前置:本地 PostgreSQL 启用 pgvector(见参考资源,"pgvector 安装"文档)
import os
import psycopg2
import numpy as np
from openai import OpenAI

MODEL = "text-embedding-3-small"
DIM = 1536  # 必须与模型输出维度一致

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

def embed(texts):
    resp = client.embeddings.create(model=MODEL, input=texts)
    v = np.array([d.embedding for d in resp.data], dtype="float32")
    return v / np.linalg.norm(v, axis=1, keepdims=True)   # 归一化:dot==cosine

conn = psycopg2.connect("dbname=vecdb user=postgres")
cur = conn.cursor()

# 1. 建表:embedding 列 _value 用 vector 类型
cur.execute(f"CREATE EXTENSION IF NOT EXISTS vector")
cur.execute(f"""CREATE TABLE IF NOT EXISTS docs (
    id SERIAL PRIMARY KEY,
    tenant_id INT NOT NULL,
    doc_type TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding vector({DIM}))""")

# 2. 建 HNSW 索引:cosine 距离,16 连接(默认规模够用)
cur.execute(f"""CREATE INDEX IF NOT EXISTS docs_hnsw_idx
    ON docs USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64)""")

# 3. 写入(带元数据:租户、类型——过滤与路由用)
docs = [
    (1, "support", "退款政策:签收后 7 天内可无理由退款,运费买家承担。"),
    (1, "support", "配送范围:全国主要城市,偏远地区时效延长 2-3 天。"),
    (2, "manual",  "会员权益:年度会员享受专属客服、生日礼券、双倍积分。"),
]
vecs = embed([d[2] for d in docs])
for (t, ty, text), v in zip(docs, vecs):
    cur.execute("INSERT INTO docs (tenant_id, doc_type, content, embedding) VALUES (%s,%s,%s,%s)",
                (t, ty, text, v.tolist()))
conn.commit()

# 4. 查询:tenant 过滤 + 余弦近邻,ef_search 调高保证召回(查询期才生效)
def search(query, tenant_id, k=2):
    qv = embed([query])[0].tolist()
    cur.execute(f"""
        SELECT id, content, 1 - (embedding <=> %s::vector) AS sim
        FROM docs
        WHERE tenant_id = %s                 -- 元数据过滤:先圈定租户数据
        ORDER BY embedding <=> %s::vector    -- '<=>' 是 cosine 距离(越小越近)
        LIMIT %s""", (qv, tenant_id, qv, k))
    return cur.fetchall()

for q in ["怎么退款?", "会员有什么?"]:
    print(f"Q: {q}  (tenant=2 看不到另租户的数据)")
    for row in search(q, tenant_id=2):
        print(f"  sim={row[2]:.3f}  {row[1]}")
```

**要点**:`vector_cosine_ops` 表明排序用 cosine——与写入前归一化(dot==cosine)吻合,metric 与归一化必须一致(查 [embeddings-design](../ai-ml/embeddings-design.md) 概念 2);过滤写在 WHERE 里会跳过 HNSW 上的无效遍历,这正是"低基数过滤字段先圈定再检索";ef_search 在查询期可动态调,是上线后调召回/延迟的最便宜旋钮。

### 示例 2:Qdrant 混合检索(BM25 + 向量 + RRF)

```python
# 场景:Qdrant 的混合检索:一路 BM25(关键词)+ 一路向量(语义),RRF 融合
# 依赖: pip install qdrant-client openai numpy
# 前置:本地启动 qdrant(docker run -p 6333:6333 qdrant/qdrant)
import os
import numpy as np
from qdrant_client import QdrantClient
from qdrant_client.models import (VectorParams, Distance, PointStruct,
                                  HybridFusion, Fusion, QueryRequest)

client = QdrantClient(url="http://localhost:6333")
COLL = "hybrid_demo"

# 1. 建集合:向量 + 关键词(全文索引)双路能力都启用
if not client.collection_exists(COLL):
    client.create_collection(
        collection_name=COLL,
        vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
        sparse_vectors_config={"bm25": {}},   # 稀疏向量路径 → 文本检索(BM25 风格)
    )

from openai import OpenAI
oai = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
def embed(texts):
    resp = oai.embeddings.create(model="text-embedding-3-small", input=texts)
    v = np.array([d.embedding for d in resp.data], dtype="float32")
    return v / np.linalg.norm(v, axis=1, keepdims=True)

# 2. 写入:普通向量 + 稀疏向量(近似 BM25 的关键词信号)
docs = [
    ("SKU-4821 电池出现鼓包,请联系售后更换。", "sku 4821 电池 鼓包 售后 更换"),
    ("退款政策:签收后 7 天内可无理由退款,运费买家承担。", "退款 政策 签收 7 天 无理由 运费"),
    ("会员双倍积分仅限年度会员,生日当月生效。", "会员 双倍 积分 年度 生日"),
]
point_ids = client.upsert(COLL, points=[
    PointStruct(id=i, vector=embed([t])[0].tolist(),
                payload={"text": t},
                sparse_vector={"bm25": __import__("qdrant_client").models.SparseVector(
                    indices=[w2i.get(w)] if False else [], values=[])})
    for i, (t, kw) in enumerate(docs)
])  # 说明:生产环境用官方 sparse embedder 或本地 BM25 词典,此行为示意
# 简化正确做法:用 Qdrant 的 FastEmbed 派生稀疏向量(见参考资源 Qdrant Hybrid Search)
_ = point_ids

# 3. 混合查询:两路召回 + RRF 融合
resp = client.query_points(
    collection_name=COLL,
    prefetch=[
        QueryRequest(query=[0.01] * 1536,  # 示意:真实应传 query 向量(见下)
                     using="", limit=5),
    ],
    query=Fusion(fusion=HybridFusion.RRF),
)
# 真实代码:prefetch 里分别给 dense 向量与 sparse 向量,再 RRF:
#   prefetch=[QueryRequest(query=dense_vec, using="", limit=5),
#             QueryRequest(query=sparse_vec, using="bm25", limit=5)],
#   query=Fusion(fusion=HybridFusion.RRF)
print("示例目的:展示 RRF 融合的调用形态;完整可运行版见 Qdrant 官方 hybrid search 教程")
```

**要点**:RRF 只依赖两路的排名,天然免疫"BM25 分数与余弦分数量纲不同"问题——这是它成为生产默认融合方式的原因;`sparse_vectors_config` 让一路关键词检索与向量路并存,不需要第二个系统;注意 dense 与 sparse 两路的 top-k(limit)各自独立控制,是延迟预算的两个旋钮。完整可运行代码以 Qdrant 官方教程为准(见参考资源)。

### 示例 3:选型决策脚本(按规模算成本)

```python
# 场景:在 pgvector / Qdrant / Weaviate / Milvus 之间做定量选型
# 输入:向量数 N、维度 D、QPS、P95 预算;输出:内存口径与部署成本量级
def estimate(engine, n_docs, dim, qps, p95_ms):
    """返回 {内存估算(GB), 部署成本量级, 结论}。数值为工程估算口径,供决策不供报价。"""
    vec_bytes = n_docs * dim * 4             # float32 每向量字节数
    hnsw_overhead = vec_bytes * 1.5          # HNSW 图结构 ≈ 1.3-2x 向量体量

    if engine == "pgvector":
        mem = (vec_bytes + hnsw_overhead) / 2**30
        return {"mem_gb": round(mem, 1),
                "deploy": "复用现有 PostgreSQL:零新组件,运维最省",
                "verdict": "N ≤ 500 万、已有 PG 的场景首选;超大规模或高 QPS 要评估"}
    if engine == "qdrant":
        mem = (vec_bytes + hnsw_overhead) / 2**30 * 1.2
        return {"mem_gb": round(mem, 1),
                "deploy": "自托管单机/集群,或托管云服务;内存磁盘分层成熟",
                "verdict": "中等规模 + 混合检索 + 过滤是甜点区;文档生态好"}
    if engine == "weaviate":
        mem = (vec_bytes + hnsw_overhead) / 2**30 * 1.2
        return {"mem_gb": round(mem, 1),
                "deploy": "自托管/托管;图式 schema 与权限/VPC 能力强",
                "verdict": "需要图式建模与细粒度 ACL 时优先考虑"}
    if engine == "milvus":
        mem = vec_bytes / 2**30                 # 支持磁盘索引,内存要求低
        return {"mem_gb": round(mem, 1),
                "deploy": "分布式集群,组件多(coordinator/worker),运维重",
                "verdict": "亿级以上或超大规模 + 强扩展性诉求时才值得"}

for n in [1_000_000, 10_000_000]:
    r = estimate("qdrant", n, 1536, 100, 50)
    print(f"N={n/1e6:.0f}M 维1536 -> 内存≈{r['mem_gb']}GB | {r['verdict']}")
```

**要点**:选型的本质是"现有运维体系 vs 检索特性"的权衡——pgvector 省组件但承担 PostgreSQL 的扩展边界,专用库特性全但多一套系统要养;内存估算口径(向量 × 4 字节 × HNSW 开销)在任何库上都成立,先算它再谈特性;千万级以上优先验证磁盘索引与量化(IVF-PQ)能力,避免内存预算失控。

## 练习

按顺序完成。每项都有明确产出,建议把产出放进 `personal/` 目录留档。

### 基础练习(阶段一对应)

- [ ] **P1-1 精确 vs ANN**:在你的语料(≥1 万条)上实现暴力检索与 HNSW 检索,写出 recall@10 与单查询延迟对比表
- [ ] **P1-2 参数敏感性**:固定其他条件,分别扫描 ef_search ∈ {8, 32, 128} 与 M ∈ {8, 16, 32},记录 recall 与 P95 变化
- [ ] **P1-3 过滤实验**:加一个租户字段,对比 pre-filter 与 post-filter 在低基数(2 个值)与高基数(1 万个值)下的延迟与结果质量

### 进阶练习(阶段二对应)

- [ ] **P2-1 混合检索**:实现 BM25 + 向量 + RRF,构造 20 条"专有名词型"query,对比纯向量 vs 混合的命中率并写结论
- [ ] **P2-2 Rerank 决策**:用 reranker 对比 top-5 精度提升与延迟代价,写"加不加 reranker"的决策记录(含预算口径)
- [ ] **P2-3 写交付文档**:为你的检索服务写配置文档:索引参数、metric、过滤策略、混合检索开关,附每个配置的理由

### 挑战练习(阶段三对应)

- [ ] **P3-1 压测报告**:对你的部署做 1000 query 压测,产出 recall@k、P95/P99 延迟、内存峰值报告,并给出达标配置
- [ ] **P3-2 重建演练**:模拟 embedding 模型升级:全量重建 → 评估回归 → 灰度切换,记录时间与回滚预案
- [ ] **P3-3 多租户隔离设计**:设计一个 3 租户的隔离方案(分区 vs filter vs 独立集合),量化各自的延迟与运维成本,写选型报告

## 自测题

先独立作答,再对照题后答案。答不出的题对应回看相关章节。

1. 用一句话分别说明 HNSW、IVF、PQ 各自"抄了近道"在哪里?
2. 你的系统要求 P95 ≤ 50ms 且 recall@10 ≥ 0.95,现有配置 recall 0.98 但 P95 是 90ms。你调哪个参数?为什么?
3. pre-filter 和 post-filter 各自在什么场景下会翻车?高基数过滤字段的正确做法是什么?
4. RRF 为什么不需要对齐两路检索的分数尺度?它的输入是什么?
5. 什么时候必须加 reranker,什么时候不该加?reranker 的延迟成本发生在哪一段?
6. 1500 万条 × 1536 维的语料,首选哪类索引与哪类库?你的理由里至少包含两个量化依据
7. 你的候选 top-k 里出现了"关键词完全无关但向量相似"的结果,这是哪个环节的问题?先查什么?
8. 为什么说"recall 是 ANN 相对精确检索的回退率"?没有精确基准时,recall 数字意味着什么?

<details>
<summary>答案</summary>

1. HNSW:用多层图跳过大部分节点,只沿"大致方向"走;IVF:先聚类分桶,只进最近的几个桶;PQ:把向量压成短码 + 查表算近似距离
2. 调低 ef_search(如 128 → 32):它是查询期直接换"召回↔延迟"的旋钮,不动索引结构;recall 0.98 有 3 个点富余,让出部分换延迟达标
3. pre-filter 在"过滤后集合太小"时翻车(图和聚类失效退化成扫描);post-filter 在"过滤筛掉大部分候选"时翻车(结果空洞)。高基数字段(租户)用分区/集合隔离,让每个分区的图自己管自己
4. RRF 只吃"排名"(rank),不吃分数:score = Σ 1/(60+rank);因此两路分数量纲不同、模型不同都可以融合
5. 必须加:top-1 直接对外(问答、任务助手)、候选少(≤20)且精度要求高;不该加:top-k 列表给人挑、延迟预算极紧。成本发生在"候选 × 每对 query-文档过一次模型",所以先粗排砍到 10-20 条再 rerank
6. 索引选 IVF-PQ(或带磁盘索引的库),库选 Milvus/Qdrant 这类原生大库:内存估算 1500 万 × 1536 × 4B ≈ 92GB(裸向量),HNSW 再 ×1.5 ≈ 138GB——单机内存吃不消,需要量化压缩与磁盘索引
7. 先查 embedding 质量与分块粒度(向量侧),再查是否需要混合检索补关键词路——"语义像但词面无关"是双塔模型的正常缺陷,不是索引 bug
8. recall@k 衡量 ANN 找回的 top-k 与精确 top-k 的重合度——它是相对暴力搜索的"损失率";没有精确基准时"recall 0.9"无参照系,可能意味着 ANN 找回了 90% 的"本来就错的答案"。所以先跑精确基准是铁律
</details>

## 常见错误与反模式

- ❌ **把全文塞进向量库 payload**——查询吞吐与存储被文本拖垮;向量库只存 id + 元数据,原文放对象存储/数据库,查到时再取
- ❌ **只看 top-1,不做重排**——向量粗排的 top-1 只是"最像",不是"最对";该 rerank 就 rerank
- ❌ **过滤条件筛掉 99% 数据仍走全量 ANN**——图上过滤是陷阱;低基数用 post-filter + 放大 top-k,高基数做分区
- ❌ **上线随意改 embedding 模型却不重建索引**——坐标系变了,检索静默失效;模型版本当 schema 管
- ❌ **对 ID 类精确查询也走向量检索**——"查用户 4821 的资料"应该走 B-tree/主键,向量检索解决的是语义搜索,不是查字典
- ❌ **ANN 参数盲调**——没有精确检索基准就调 ef_search,是"把噪音调到更好看"
- ❌ **没有延迟预算就定索引**——指标预算是先决条件,参数是预算内的选择
- ❌ **混合检索只加不测**——加了 BM25 路不上评估集验证,可能召回没变、延迟翻倍

## 参考资源

- [pgvector](https://github.com/pgvector/pgvector) — 工具,PostgreSQL 向量扩展:安装、HNSW/IVFFlat 索引与算子文档
- [HNSW Paper (Malkov & Yashunin)](https://arxiv.org/abs/1603.09320) — 论文,HNSW 原始论文,理解图结构与参数
- [Qdrant Hybrid Search 教程](https://qdrant.tech/articles/hybrid-search/) — 文档,稀疏+稠密向量与 RRF 的官方示例
- [Hybrid Search Explained (Weaviate)](https://weaviate.io/blog/hybrid-search-explained) — 文章,混合检索原理与 RRF 的工程细节
- [Reranking (Cohere)](https://docs.cohere.com/docs/reranking) — 文档,cross-encoder reranker 的 API 与用法
- [Milvus 文档](https://milvus.io/docs) — 文档,大规模向量库的索引与部署
- [FAISS](https://github.com/facebookresearch/faiss) — 工具,Facebook 的向量索引库,IVF/PQ/HNSW 的参考实现
- [Similarity Search (Pinecone)](https://www.pinecone.io/learn/series/faiss/) — 文章,IVF/PQ/HNSW 的图解教程,适合建立直觉

## 相关 Skills

- [embeddings-design](../ai-ml/embeddings-design.md) — 前置,向量怎么生产、怎么归一化、metric 怎么对齐
- [rag-pipeline](../ai-ml/rag-pipeline.md) — 落地场景,检索是 RAG 链路的入口
- [rag-pipeline-design](../ai-ml/rag-pipeline-design.md) — 进阶,混合检索、Rerank 与查询改写在生产架构中的组合
- [qdrant-skills](../ai-ml/qdrant-skills.md) — 工具速查,用 Qdrant 落地本技能的索引与查询
- [llm-evaluation](../ai-ml/llm-evaluation.md) — 评估方法,recall@k / 延迟分位数的正式定义
- [postgresql-query-patterns](../data/postgresql-query-patterns.md) — 基础,选 pgvector 时需要的 SQL 技能