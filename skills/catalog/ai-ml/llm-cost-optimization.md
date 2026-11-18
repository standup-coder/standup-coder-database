---
id: llm-cost-optimization
type: atomic-skill
title: LLM Cost Optimization
nameZh: LLM 成本优化
domain: ai-ml
tags: ai-ml, cost-optimization, prompt-caching, model-routing, token-budget
catalogSource: internal
catalogFile: atomic-skills/llm-cost-optimization.json
catalogAddedAt: 2026-07-29
operation: ai-ml
level: mid
---

# LLM 成本优化

> 在不牺牲质量底线的前提下系统性压降 LLM 调用成本:模型路由、prompt caching、批处理与 token 治理的组合拳。学完本技能,你能看懂 LLM 账单、为每类任务选对模型、用评估集证明"省了钱但没掉质量",并搭起预算监控与熔断。

## 这个技能解决什么问题

LLM 应用的成本曲线与流量成正比,而大多数团队连"哪个功能烧掉了多少钱"都答不上来。成本失控的典型路径是:

| 痛点 | 现状 | 优化后 |
|---|---|---|
| **账单线性上涨** | 流量翻倍,账单翻倍,毛利被吃掉 | 70% 的简单请求路由到小模型,成本下降 40-70% |
| **旗舰模型被大材小用** | 分类、抽取、格式化这类简单任务也调用最贵的模型 | 任务分级路由:简单任务小模型,复杂推理才上旗舰 |
| **重复花费** | 相同的 FAQ 问题反复全价调用 | 语义缓存命中直接零成本返回,25-35% 的重复查询被吸收 |
| **长系统提示全价计费** | 每次请求把 2000 token 的系统提示重复计费 | prompt caching 命中后输入单价降至 10%-50% |
| **预算不可控** | 没有归因、没有告警,agent 循环失控产生天价账单 | 按任务/用户归因 + 日预算告警 + 会话熔断 |

学完之后你应该能:

- 拆解一次 API 调用的成本构成(输入/输出/缓存/嵌入的单价差异),并估算单请求成本
- 设计模型路由/级联方案:什么任务走小模型、什么任务上旗舰、置信度不足如何回退
- 用评估集证明每一次成本优化的质量影响——"省了多少钱,质量掉了没有"
- 规划缓存友好的提示词布局,让 prompt cache 命中率可测量
- 搭建成本归因仪表盘与熔断机制,让预算处于受控状态

## 前置知识

动手前,建议先掌握(按依赖顺序):

1. **基础提示工程**([prompt-engineering](../ai-ml/prompt-engineering.md))——了解 system/user prompt、max_tokens、temperature,成本优化是在调用层做文章
2. **API 调用与 token 概念**([claude-api](../ai-ml/claude-api.md))——会用代码发请求、读 usage 字段(输入/输出 token 数),这是测量成本的前提
3. **基础评估方法**([llm-evaluation](../ai-ml/llm-evaluation.md)前半部分)——成本优化最大的风险是质量滑坡,必须会用评估集量化"质量底线"

如果从零开始,先读完上述三条再回来;本技能不再解释 API 基本用法。

## 核心概念

本技能由六个概念组成,按"看懂成本 → 砍掉成本 → 管住成本"的顺序排列。

### 1. 成本构成拆解:token 计价模型

LLM 按 token 计费,但不同 token 的单价差异巨大——这是所有优化策略的出发点:

| token 类型 | 相对单价 | 说明 |
|---|---|---|
| 输入 token(普通) | 基准价 | 系统提示、消息历史、检索资料都算输入 |
| 输出 token | 3-5 倍于输入 | 生成内容,通常无法缓存,最贵 |
| 缓存命中输入 | 输入价的 10%-50% | 稳定前缀命中缓存后大幅降价 |
| 嵌入 token | 远低于生成价 | embedding API 便宜,但量大时也需计入 |
| 工具调用/function 参数 | 按输入计价 | 工具定义会反复计入每次请求 |

**三个被低估的事实**:

1. **输出比输入贵 3-5 倍**:约束输出长度(max_tokens、要求"简洁回答"、结构化输出限字段)往往比压缩输入更划算
2. **一次对话的成本 = 每轮输入之和 + 最后一轮输出**:多轮对话中,历史全部重发,轮次越多输入成本越高——这是缓存能大展身手的地方
3. **嵌入成本是"线下的"**:向量化文档一次性付出,但数据量大或频繁重建索引时,也成为账单上不可忽视的一项

先测量再优化是第一条定律:在代码里记录每次调用的 usage,按任务维度聚合,你才能回答"哪个功能烧了多少钱"。

### 2. Prompt Caching:稳定前缀的折扣

原理:模型服务商把请求的公共前缀(系统提示、工具定义、few-shot 示例)缓存起来,下次请求命中前缀时,命中部分按折扣价计费(Anthropic 约 1/10,OpenAI 约 1/2),且首 token 延迟更低。

**命中条件只有一条:前缀必须逐字节稳定**。以下做法会弄丢缓存:

- ❌ 系统提示里插入当前时间/随机 id/会话 id
- ❌ 每次请求动态重排指令段落顺序
- ❌ 把用户个性化信息拼进系统提示的前部(应放用户消息里)

**缓存友好布局**:

```text
[系统提示(固定):角色/规则/输出规范]   ← 稳定,吃缓存
[工具定义(固定):同一套工具]           ← 稳定,吃缓存
[few-shot 示例(固定)]                 ← 稳定,吃缓存
[检索资料(按问题变化)]                ← 易变,放后面
[用户消息/历史(每轮都变)]             ← 易变,放最后
```

判断标准:**稳定的内容放在前面,易变的内容放在后面**。长系统提示场景(如 5000+ token 的系统提示 + 工具定义)整体可省 45-80% 输入成本。缓存有 TTL(通常几分钟到几小时),短时间内的连续请求命中率最高——聊天场景每轮都命中,离线批任务随手重建前缀则命中不了。

### 3. 模型路由与级联:最大杠杆

把 70% 的简单请求从旗舰路由到小模型,通常能省 40-70% 成本,而且是对质量影响最可控的一刀。核心是**任务分级**:

| 任务类型 | 例子 | 建议档位 |
|---|---|---|
| 简单分类/抽取 | 情感分类、关键词抽取、格式转换 | 小模型(gpt-4o-mini / haiku 级) |
| 中等理解 | 摘要、问答(资料已给全) | 中型模型 |
| 复杂推理 | 多步推理、代码生成、Agent 规划 | 旗舰模型 |
| 高风险任务 | 法律/医疗建议、支付决策 | 旗舰 + 人工兜底 |

**级联模式(cascade)**:小模型先答,置信度不足再升级到大模型——实践中可省 40-70%:

```text
请求 → 小模型 → 输出 + 置信度评分
                   ├─ 置信度高 → 直接返回
                   └─ 置信度低/格式校验失败 → 升级大模型重答
```

**回退策略**(路由决策本身可能出错):

- 格式回退:小模型输出解析失败 → 自动升级
- 质量回退:评估集上小模型分数跌破底线 → 该任务整体调高模型档位
- 限流回退:小模型服务限流 → 排队或临时升级大模型,而不是失败

路由实现有两种:规则路由(按任务类型硬编码,简单可靠)与语义路由(用 embedding 或小模型判断请求类型,灵活但多一次调用成本)。**先用规则,量大了再上语义路由**。

### 4. 批处理与异步:Batch API 五折

所有非实时任务都可以走 Batch API:离线评估、批量标注、内容生成、报表摘要。OpenAI 与 Anthropic 均对 Batch API 提供 **50% 折扣**,24 小时内返回结果(通常更快)。

| 维度 | 实时(Sync) | 批处理(Batch) |
|---|---|---|
| 价格 | 全价 | 5 折 |
| 延迟 | 秒级 | 分钟到 24 小时 |
| 适用 | 用户在线等待 | 离线任务、可排队任务 |
| 失败处理 | 单请求重试 | 整个 batch 提交后可查状态 |

**判断标准**:用户是否在线等待?不是 → 走 Batch。生产实践里最容易犯的错是"实时接口和离线批任务混在一起",白白放弃 50% 折扣。

### 5. 输出长度控制与应用层缓存

**输出长度控制**(成本最低的优化):

- `max_tokens` 设合理上限:摘要任务 200 token 就够,别默认 4096
- 指令层面约束:"回答控制在 3 句话以内""只输出 JSON 字段 A、B"
- 结构化输出天然压缩:只要需要的字段,不要自由发挥

**应用层语义缓存(semantic caching)**:在你自己这一侧缓存 LLM 输出,把"相同的问题"变成"零成本重放":

```text
用户问题 → 向量化 → 与缓存条目比对(相似度阈值,如 0.92)
              ├─ 命中 → 直接返回缓存的答案(零 LLM 成本)
              └─ 未命中 → 调 LLM → 存入缓存(带时间戳与来源)
```

适用场景:客服 FAQ(25-35% 的查询语义重复)、知识库问答、报表解读。三个必须处理的细节:

1. **相似度阈值**:过高命中少,过低答非所问;用一小批真实查询调参
2. **时效失效**:政策、价格类信息会变,缓存条目带 TTL 或按来源文档版本失效
3. **结果可变性**:涉及个性化/时效性的回答不要缓存(如"我的订单状态")

语义缓存与 prompt caching 不同:前者缓存"答案"(你自己的层),后者缓存"前缀"(服务商层),两者叠加使用。

### 6. 预算监控与成本-质量权衡实验

**没有归因就没有优化**:所有请求打 tag(`feature`、`user_id`、`tenant`、`model`),聚合后你能回答:哪个功能最烧钱?哪个用户异常?agent 会话平均成本是多少?

**最小监控体系**:

- 用量记录:每次调用落 usage 明细(输入/输出 token、缓存命中、模型、功能 tag)
- 仪表盘:按天/按功能/按模型聚合成本,环比看趋势
- 告警:日预算超支告警、单会话成本突增告警(agent 循环失控的典型信号)
- 熔断:单会话 token 上限、单日预算硬上限,超限自动降级(降模型档位或拒绝)

**成本-质量权衡实验方法**(每次优化必须走完):

1. 建/复用评估集(≥50 条,覆盖各任务类型)
2. 量当前基线:成本(每千请求美元)与质量(评估分数)
3. 实施一项优化(只改一个变量:换模型档位 / 加缓存 / 加批处理)
4. 重跑评估:质量不跌破底线(由你定义,如准确率 ≥95%)→ 保留;跌破 → 回滚
5. 记录成本下降幅度与质量变化,形成决策记录

**质量底线**是业务决策不是技术决策:内部工具可以接受"省 60% 成本、质量降 2 分",面向客户的产品可能完全不行。每季度重估模型选型——模型价格与能力迭代极快,半年前的路由决策可能已经过时。

## 学习路径

按 6-8 周规划,达标才进入下一阶段。本技能定位 mid,结束时你能独立交付一套"测量 → 优化 → 治理"的成本体系。

### 阶段一:地基——看懂账单(第 1-2 周)

**目标**:能回答"每个功能每月烧多少钱、单次调用成本多少"。

- 掌握 token 计价模型与输入/输出价差
- 会读 API 的 usage 字段并落库记录
- 掌握 max_tokens、输出约束、批处理 API 的基本用法

**验收标准**:

- [ ] 为你的应用写一个调用记录脚本:每次调用记录模型、输入/输出 token、缓存命中、功能 tag,落成 CSV/表
- [ ] 用一周真实流量跑出"按功能聚合的成本报表",说出成本前三的功能
- [ ] 把一类离线任务改走 Batch API,实测单次调用成本下降约 50%

### 阶段二:工程化——路由 + 缓存组合拳(第 3-5 周)

**目标**:让 60%+ 的请求不再打旗舰模型,并用评估集证明质量无损。

- 掌握任务分级与级联路由的实现(含格式回退与质量回退)
- 掌握缓存友好布局与命中率观测
- 掌握语义缓存与阈值调参

**验收标准**:

- [ ] 实现规则路由:三类任务(简单/中等/复杂)分到对应模型,评估集上质量不跌破底线,附成本对比表(优化前后每千请求成本)
- [ ] 系统提示改造为缓存友好布局,实测命中率 ≥60%,输入成本下降符合预期
- [ ] 为重复度最高的功能加语义缓存,用真实查询调好相似度阈值,命中率与准确率双达标

### 阶段三:治理——归因、告警与熔断(第 6-8 周)

**目标**:让成本处于"可解释、可预测、可干预"的状态,能独立交付成本体系。

- 掌握按功能/用户/租户的归因埋点
- 掌握预算告警与 agent 会话熔断
- 掌握成本-质量实验流程与决策记录规范

**验收标准**:

- [ ] 完成埋点 + 仪表盘:按天/功能/模型聚合,能 5 分钟内回答"昨天哪个功能烧了多少"
- [ ] 设好三级告警(日预算/单会话突增/单用户异常)与熔断(会话 token 上限),并演练一次触发-降级-恢复
- [ ] 完成 2 次完整的成本-质量实验(换模型档位、加缓存),各留下"基线→优化后"的对比记录,决策可回溯

## 分步实操:一次完整的成本优化周期

适用于任何"账单在涨但不知道从哪下手"的应用。**先建测量与评估基准,再动手优化**——顺序反了就是拍脑袋砍模型。

```
第 1 步:埋点与归因                 (回答"钱花在哪")
   ↓
第 2 步:建质量底线与评估集          (回答"能不能省")
   ↓
第 3 步:任务分级,上模型路由         (最大杠杆)
   ↓
第 4 步:缓存两件套:predict 前缀 + 语义缓存
   ↓
第 5 步:离线任务迁移批处理
   ↓
第 6 步:告警、熔断与季度重估
```

### 第 1 步:埋点与归因

- 封装统一调用入口,每次调用记录:`model`、`prompt_tokens`、`completion_tokens`、`cache_read_tokens`、`feature`、`user_id`、`timestamp`
- 按功能聚合,输出成本 Top 10 清单——**优化优先级来自这份清单,不是直觉**

### 第 2 步:建质量底线与评估集

- 为 Top 3 烧钱功能各建一个 ≥50 条的评估集(真实输入 + 人工标注的理想输出)
- 给每个功能定"质量底线"(如准确率 ≥ 95%、字段缺失率 = 0)——这是所有优化的红线
- 跑一遍当前模型配置,记录基线质量与基线成本

### 第 3 步:任务分级 + 模型路由

从最烧钱的功能开始:如果它是简单任务(分类/抽取/格式化),直接切小模型 → 跑评估集 → 不跌破底线就保留。复杂任务上"小模型先答 + 置信度/格式校验失败升级"的级联。

### 第 4 步:缓存两件套

1. **prompt caching**:系统提示与工具定义去动态化(把时间戳/会话 id 移到用户消息),确保前缀逐字节稳定
2. **语义缓存**:对重复度高的功能(FAQ 类)加答案缓存,先用 3 天真实流量统计语义重复率,重复率 <10% 的功能不值得加

### 第 5 步:迁移批处理

把离线任务(评估、标注、批量生成)逐个从同步接口切到 Batch API,注意:任务入口延迟放宽到小时级,提交后轮询状态,结果落库。

### 第 6 步:治理与重估

- 设日预算告警与熔断;agent 加单会话 token 上限
- 每季度重估:模型价格、新模型能力、任务分布变化——路由表应该是活的

## 示例

三个示例:示例 1 是路由 + 缓存的核心链路,建议动手跑通;示例 2、3 是批处理与治理的参考实现。

### 示例 1:模型路由 + 应用层语义缓存

```python
# 场景:一个混合任务 API——简单任务(分类)走小模型,复杂任务(推理问答)走旗舰;
# 相同问题先查语义缓存,命中则零成本返回。
import json
import time
from openai import OpenAI

client = OpenAI()

# ── 语义缓存:粗粒度实现,生产建议用向量库(见 rag-pipeline) ──
class SemanticCache:
    """按输入文本的精确/近似重复做缓存。这里用归一化文本精确匹配 +
    简单 n-gram 相似度近似;生产环境换成 embedding 相似度。"""

    def __init__(self, ttl_seconds: int = 3600):
        self.entries = {}          # key -> {"answer": str, "ts": float}
        self.ttl = ttl_seconds

    def _normalize(self, text: str) -> str:
        return text.strip().lower().replace("?", "?")

    def get(self, question: str):
        key = self._normalize(question)
        e = self.entries.get(key)
        if e and time.time() - e["ts"] < self.ttl:
            return e["answer"]
        return None

    def put(self, question: str, answer: str):
        key = self._normalize(question)
        self.entries[key] = {"answer": answer, "ts": time.time()}

cache = SemanticCache()

# ── 路由:任务分级 + 级联回退 ──
SMALL_MODEL = "gpt-4o-mini"   # 简单任务
BIG_MODEL = "gpt-4o"          # 复杂推理

def route(task_type: str) -> str:
    """规则路由:按任务类型选模型档位。"""
    return {  # 简单/中等任务 → 小模型;复杂 → 旗舰
        "classify": SMALL_MODEL, "extract": SMALL_MODEL, "summarize": SMALL_MODEL,
        "reason": BIG_MODEL, "agent_plan": BIG_MODEL,
    }.get(task_type, BIG_MODEL)

def call_llm(task_type: str, user_text: str, system: str = "") -> tuple[str, str]:
    """返回 (答案, 实际使用模型)。级联:小模型输出/schema 异常时升级旗舰。"""
    model = route(task_type)
    resp = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system or "你是任务执行器,按需回答。"},
            {"role": "user", "content": user_text},
        ],
        temperature=0,
    )
    answer = resp.choices[0].message.content.strip()
    # 级联回退:小模型输出过短/疑似敷衍(这里是简化的质量信号),升级旗舰重答
    if model == SMALL_MODEL and len(answer) < 10 and task_type in ("reason", "agent_plan"):
        resp = client.chat.completions.create(
            model=BIG_MODEL,
            messages=[{"role": "user", "content": user_text}],
            temperature=0,
        )
        return resp.choices[0].message.content.strip(), BIG_MODEL
    return answer, model

def answer(task_type: str, question: str) -> dict:
    """统一入口:语义缓存 → LLM(带路由)。"""
    cached = cache.get(question)
    if cached:
        return {"answer": cached, "model": "cache", "cost": 0}
    answer_text, model = call_llm(task_type, question)
    if task_type in ("classify", "summarize"):   # 只缓存确定性任务的答案
        cache.put(question, answer_text)
    return {"answer": answer_text, "model": model, "cost": "按模型计价"}

# ── 自测:同一问题问两次,第二次应命中缓存 ──
q1 = "把这句评论分类:服务很好但出餐太慢"
print(answer("classify", q1))
print(answer("classify", q1))   # 第二次:model=cache,cost=0
```

**要点**:三个设计决策——① 路由按任务类型硬编码,简单可靠,是最先上的一版;② 语义缓存只对"确定性任务"开(分类/摘要),推理问答的答案可能因上下文变化,不缓存;③ 级联回退用"产出质量信号"触发(这里简化为长度,生产用 schema 校验失败/置信度分数),保证小模型答不好时有升级通道,质量有兜底。

### 示例 2:离线任务走 Batch API(五折)

```python
# 场景:把 1000 条评论的情感标注从实时接口迁到 Batch API,省一半钱。
# 以 OpenAI Batch 为例(Anthropic 流程类似:上传 JSONL → batch → 下载结果)。
import json
import time
from openai import OpenAI

client = OpenAI()

def submit_batch(reviews: list[str], model: str = "gpt-4o-mini") -> str:
    """1) 构造 JSONL 请求文件;2) 上传;3) 提交 batch;返回 batch_id。"""
    tasks = [
        {
            "custom_id": f"review-{i}",
            "method": "POST",
            "url": "/v1/chat/completions",
            "body": {
                "model": model,
                "messages": [
                    {"role": "system", "content": "把评论分为 positive/negative/neutral,只输出一个词"},
                    {"role": "user", "content": r},
                ],
                "temperature": 0,
            },
        }
        for i, r in enumerate(reviews)
    ]
    # 生产环境:写入 .jsonl 文件后用 client.files.create 上传,这里为了可运行直接内存构造
    lines = "\n".join(json.dumps(t, ensure_ascii=False) for t in tasks)
    import io
    file = client.files.create(
        file=io.BytesIO(lines.encode("utf-8")), purpose="batch"
    )
    batch = client.batches.create(
        input_file_id=file.id,
        endpoint="/v1/chat/completions",
        completion_window="24h",
    )
    return batch.id

def poll_and_collect(batch_id: str, timeout_hours: int = 24) -> dict[str, str]:
    """2) 轮询状态(生产用异步任务);3) 结果按 custom_id 收集。"""
    deadline = time.time() + timeout_hours * 3600
    while time.time() < deadline:
        b = client.batches.retrieve(batch_id)
        if b.status in ("completed", "failed", "cancelled"):
            break
        time.sleep(60)                      # 每分钟轮询一次
    assert b.status == "completed", f"batch 状态异常: {b.status}"
    out = {}
    for line in client.files.content(b.output_file_id).text.splitlines():
        item = json.loads(line)
        out[item["custom_id"]] = json.loads(item["response"]["body"]["choices"][0]["message"]["content"])
    return out

# 使用(注释掉以免产生真实费用,演示完整调用链)
# batch_id = submit_batch(["味道不错", "太慢了", "一般般吧"])
# results = poll_and_collect(batch_id)
# print(results)   # {'review-0': 'positive', ...}
print("Batch 流程:提交 JSONL → 24h 内完成 → 成本约为实时接口的 50%")
```

**要点**:Batch API 的要点不是代码,而是架构决策——① 结果与请求用 `custom_id` 一一对应,方便落库;② 轮询是示例,生产应放到消息队列/定时任务里;③ 批任务必须对延迟无感(离线评估、数据标注天然适合)。成本节省是"白拿的":同样的模型同样的质量,只是牺牲了实时性。

### 示例 3:成本归因与熔断监控

```python
# 场景:统一调用入口里记录用量并做熔断;数据落表后用 SQL/仪表盘聚合。
# 这里给出记录与熔断的核心逻辑(生产配套 Langfuse 或自建表)。
import time
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class UsageLog:
    entries: list[dict] = field(default_factory=list)

    def record(self, feature: str, user_id: str, model: str,
               prompt_tokens: int, completion_tokens: int, cache_hit_tokens: int = 0):
        """每次调用必须记录:没有归因就没有优化。"""
        self.entries.append({
            "ts": datetime.now().isoformat(),
            "feature": feature, "user_id": user_id, "model": model,
            "prompt_tokens": prompt_tokens, "completion_tokens": completion_tokens,
            "cache_hit_tokens": cache_hit_tokens,
            # 单价示例(美元/1M token,按实际账单维护):输入 $3,输出 $15,缓存命中 $0.3
            "cost_usd": prompt_tokens * 3 / 1e6 + completion_tokens * 15 / 1e6
                        + cache_hit_tokens * 0.3 / 1e6,
        })

# ── 会话熔断:防止 agent 循环失控 ──
class SessionBudget:
    """单会话预算:token 上限 + 单日预算上限,超限熔断。"""

    def __init__(self, max_tokens: int = 200_000, max_cost_usd: float = 5.0):
        self.max_tokens = max_tokens
        self.max_cost = max_cost_usd
        self.used_tokens = 0
        self.used_cost = 0.0

    def spend(self, prompt_tokens: int, completion_tokens: int, cost_usd: float) -> bool:
        """尝试记一笔开销,返回是否允许继续。"""
        if (self.used_tokens + prompt_tokens + completion_tokens > self.max_tokens
                or self.used_cost + cost_usd > self.max_cost):
            # 熔断:记录并拒绝后续调用(生产:报警 + 降级到小模型/只读模式)
            print(f"[熔断] 会话已用 {self.used_cost:.2f}$ / {self.used_tokens} tokens")
            return False
        self.used_tokens += prompt_tokens + completion_tokens
        self.used_cost += cost_usd
        return True

# ── 演练:agent 循环模拟 ──
budget = SessionBudget(max_tokens=100_000, max_cost_usd=1.0)
round_no = 1
while True:
    ok = budget.spend(prompt_tokens=8_000, completion_tokens=1_500, cost_usd=0.05)
    if not ok:
        print(f"第 {round_no} 轮被熔断,循环终止")
        break
    round_no += 1
```

**要点**:熔断的触发阈值来自归因数据——先要知道"正常会话平均花多少",才能定"异常阈值"。生产实现建议:用量直接上报到 Langfuse 等可观测平台,在平台层做仪表盘与告警,而不是自己从零建;熔断则必须在应用层(平台告警有延迟,挡不住循环)。

## 练习

按顺序完成,产出建议放入 `personal/` 留档。

### 基础练习(阶段一对应)

- [ ] **P1-1 单请求成本公式**:写出你常用模型的一次调用成本公式(含输入/输出/缓存三类 token 的单价),并用手头 10 次真实调用验证估算误差
- [ ] **P1-2 用量埋点**:给应用加统一调用包装,记录 usage 与 feature tag,跑一周真实流量,输出"按功能聚合成本 Top 5"报表
- [ ] **P1-3 批处理迁移**:把一类离线任务(如评估集打分)迁移到 Batch API,对比同量任务的实时价格与批处理价格,写实测记录

### 进阶练习(阶段二对应)

- [ ] **P2-1 规则路由落地**:选 2-3 个任务类型实现规则路由 + 评估集验证,输出"优化前后每千请求成本对比 + 质量分数对比"表
- [ ] **P2-2 缓存友好改造**:把系统提示去动态化、稳定前缀,实测缓存命中率与输入成本变化;记录改造前后各一次样例请求的 usage 字段
- [ ] **P2-3 语义缓存调参**:为 FAQ 功能加语义缓存,用 50 条真实查询调相似度阈值,画出"命中率 vs 答非所问率"的曲线,选定工作点

### 挑战练习(阶段三对应)

- [ ] **P3-1 级联路由 + 回退**:实现"小模型先答 + 格式/置信度回退",评估集上验证:成本下降 % 与质量不降(或可控下降),记录回退率
- [ ] **P3-2 熔断演练**:为 agent 应用实现会话 token 上限 + 日预算告警,模拟一次失控循环,记录熔断时间点、告警内容与恢复流程
- [ ] **P3-3 季度重估流程**:写一份《模型选型重估清单》:何时重估、对比哪些候选、用什么评估集、如何决策回滚;用你手头的应用走一遍

## 自测题

先独立作答,再对照题后答案。答不出的题对应回看相关章节。

1. 一次 API 调用里,哪类 token 单价最高?为什么"压缩输出"通常比"压缩输入"更划算?
2. Prompt caching 命中的唯一条件是什么?举两个会弄丢缓存的反例。
3. 路由/级联方案里,小模型答得不好时怎么发现、怎么兜底?
4. 批处理 API 适合什么任务、不适合什么任务?代价是什么?
5. 语义缓存和 prompt caching 的区别是什么?各缓存在哪一层?
6. 你要给一个"用户问订单状态"的功能加缓存,应该加吗?为什么?
7. 老板说"把小模型全换成最便宜的模型,能省一大笔"。你按什么流程回应?(说出至少 4 步)
8. 预算告警和熔断的区别是什么?为什么平台级告警不能替代应用层熔断?

<details>
<summary>答案</summary>

1. 输出 token(约为输入的 3-5 倍);因为输出无法缓存且单价高,约束 max_tokens 与"简洁回答"直接减少最贵的部分
2. 前缀逐字节稳定;反例:系统提示里插时间戳/随机 id、每次请求重排指令段落顺序
3. 通过产出信号发现:结构化输出解析失败、置信度分数低、输出过短/答非所问;兜底是级联升级到旗舰模型重答,或任务整体调高档位
4. 适合:离线、可等待(评估/标注/批量生成),代价是延迟从秒级变成分钟到 24 小时;用户在线等待的实时交互不适合
5. 语义缓存缓存在"你自己的应用层",缓存"答案",命中零成本;prompt caching 缓存在"服务商层",缓存"请求前缀",命中只降输入单价;两者叠加
6. 不应该(除非刻意延迟):订单状态时效性强,缓存会返回过期状态,答错比花钱更糟;时效性问题不缓存
7. 先量当前预算与质量基线 → 用小模型跑评估集对比质量 → 看是否跌破质量底线 → 若跌破,改为按任务分级路由(简单任务用小模型、复杂保留旗舰)再评估 → 用数据说话,而不是直接全换
8. 告警是"事后通知"(已经烧超才知道),熔断是"事中拦截"(超限即拒绝继续);平台告警有延迟,agent 循环几十秒就能烧掉一天预算,必须应用层在调用前拦截
</details>

## 常见错误与反模式

- ❌ **不做测量直接砍模型档位**——质量崩了才发现省的钱远小于流失的用户;先埋点、先建评估基线
- ❌ **所有任务共用一个旗舰模型**——简单任务在为智商溢价买单;按任务分级路由
- ❌ **实时接口和离线批任务混在一起**——白白放弃 50% 批处理折扣;延迟无感的任务全走 Batch
- ❌ **每轮请求动态拼接系统提示**(插入当前时间/会话 id)——prompt cache 全 miss;稳定内容在前、易变内容在后
- ❌ **给时效性内容加语义缓存**——订单状态、价格类回答缓存后答错比花钱更糟;只缓存确定性任务
- ❌ **只优化不评估**——换了模型没有评估集,质量滑坡没人知道;每次优化跑同一评估集
- ❌ **没有归因就设告警**——不知道"正常是多少",告警阈值全靠猜;先归因再定阈值
- ❌ **agent 不设会话预算**——循环失控直到账单爆炸;会话 token 上限 + 日预算熔断
- ❌ **路由表写死之后不复评**——模型价格与能力半年一变;季度重估路由决策

## 参考资源

- [Anthropic — Prompt caching 文档](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) — 官方文档,缓存机制与缓存友好布局
- [OpenAI — Prompt caching 文档](https://platform.openai.com/docs/guides/prompt-caching) — 官方文档,缓存命中条件与计价
- [OpenAI — Batch API 文档](https://platform.openai.com/docs/guides/batch) — 官方文档,五折批处理流程
- [Anthropic — Batch Processing 文档](https://docs.anthropic.com/en/docs/build-with-claude/batch-processing) — 官方文档,Anthropic 批处理流程
- [OpenAI — Models 定价页](https://platform.openai.com/docs/models) — 文档,各模型输入/输出单价(季度重估必查)
- [Kong — LLM Cost Optimization Strategies](https://konghq.com/blog/enterprise/llm-cost-optimization) — 文章,成本优化策略综述
- [LiteLLM](https://github.com/BerriAI/litellm) — 工具,统一多模型接入与路由(含成本统计)
- [Langfuse](https://langfuse.com/) — 工具,LLM 可观测性与成本归因(trace 级计价)

## 相关 Skills

- [context-window-management](../ai-ml/context-window-management.md) — token 预算的窗口视角,与成本优化互为表里
- [llm-evaluation](../ai-ml/llm-evaluation.md) — 质量底线的验证手段,每次优化的评估集底座
- [fine-tuning](../ai-ml/fine-tuning.md) — 小模型替代旗舰的另一条路径(微调后的模型更便宜)
- [rag-pipeline-design](../ai-ml/rag-pipeline-design.md) — 检索与语义缓存的实现底座;检索成本也是成本
- [llm-app-development](../ai-ml/llm-app-development.md) — 完整应用开发流程,本技能的落地场景