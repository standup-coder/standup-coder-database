---
contentStatus: outline
id: llm-app-development
type: composite-skill
title: LLM App Development
nameZh: LLM 应用开发
domain: ai-ml
tags: llm, rag, prompt-engineering, evaluation, guardrails
catalogSource: internal
catalogFile: skills/llm-app-development.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 6
---

# LLM 应用开发

> 面向生产环境构建 LLM 应用:需求定义 → 提示策略 → 检索增强 → 评估体系 → 安全护栏 → 部署监控,六步走完整流程。本技能是 AI/ML 路径的**端到端收口**:把前面所有原子技能串成一个能上线的产品。

## 这个技能解决什么问题

单个原子技能教你"怎么写 prompt""怎么搭检索""怎么评估";本技能回答的是把它们**串起来**的问题:

| 问题 | 原子技能视角 | 本技能视角 |
|---|---|---|
| 从哪开始? | 各技能各说各的 | 六步顺序:需求先于一切 |
| 怎么做取舍? | 每个技能内部最优 | 全链路权衡(检索贵还是生成贵?) |
| 怎样算做完? | 每步有自己的验收 | 评估达标 + 护栏 + 监控三关全过 |
| 上线后谁负责? | 无人负责 | 监控指标 + 回归机制 |

**学完之后你应该能**:

- 把模糊需求收敛成用例:输入/输出/质量门槛/失败容忍
- 按"先 prompt 后 RAG,再护栏"的顺序推进,每步可量化
- 设计评估基线 + 上线监控两组指标
- 用完整案例模式(本技能附带"文档问答助手")举一反三

## 前置知识

本技能是复合技能,前置即其六步各自依赖的原子能力:

1. [prompt-engineering](../ai-ml/prompt-engineering.md) — 步骤 2 提示策略
2. [rag-pipeline](../ai-ml/rag-pipeline.md) / [rag-pipeline-design](../ai-ml/rag-pipeline-design.md) — 步骤 3 检索增强
3. [llm-evaluation](../ai-ml/llm-evaluation.md) — 步骤 4 评估体系
4. [guardrails-safety](../ai-ml/guardrails-safety.md) — 步骤 5 安全护栏
5. [context-window-management](../ai-ml/context-window-management.md) — 贯穿全流程的窗口预算
6. [api-call](../security/api-call.md) — 调用与错误处理底座

> 建议顺序:先补 1-3,走到步骤 5-6 时再回来补 4-6。本技能正文会标注每步需要的前置。

## 核心概念

### 1. 六步工作流总览

```
[需求]
   ↓
步骤 1: scope   — 用例定义与质量门槛(输入:需求;输出:用例卡片)
   ↓
步骤 2: prompt  — 提示策略(输入:用例;输出:prompt 基线)
   ↓
步骤 3: rag     — 检索增强(输入:prompt;输出:知识接入)
   ↓
步骤 4: eval    — 评估体系(输入:全链路;输出:基线分数)
   ↓
步骤 5: guardrails — 护栏与安全(输入:评估;输出:策略)
   ↓
步骤 6: deploy  — 部署与监控(输入:全链路;输出:上线)
   ↓
[持续迭代:监控 → 案例回流 → 回到步骤 4]
```

**关键认识**:这不是瀑布,是螺旋——步骤 4 的评估集从步骤 1 的用例里长出来,步骤 6 的线上数据回流更新评估集。离线评估与线上观测是同一件事的两面。

### 2. 用例卡片:一切的源头(步骤 1)

一张用例卡片回答六个问题:

| 字段 | 问题 | 示例(文档问答助手) |
|---|---|---|
| 输入 | 用户给什么? | 自然语言问题 |
| 输出 | 用户得到什么? | 答案 + 引用来源 |
| 质量门槛 | 什么样算好? | 引用正确率 ≥95%,无来源幻觉 = 0 |
| 失败容忍 | 什么样算不能忍? | 答非所问 > 5%、致命错误(法律/医疗) |
| 使用者 | 谁用?什么水平? | 内部员工,操作文档 |
| 边界 | 不做什么? | 不做跨文档推理、不做闲聊 |

**为什么先写卡片**:所有后续决策(模型选型、RAG 要不要上、护栏多严)都从卡片推导。需求没写清,后面全是白做。

### 3. 质量门槛 → 评估指标:一对一的映射

| 用例卡片的质量要求 | 离线评估指标 | 线上监控指标 |
|---|---|---|
| 引用正确率 ≥95% | faithfulness + 引用白名单校验 | 引用违规率 |
| 无来源幻觉 = 0 | 兜底触发率(该答"不知道"时答了) | 无引用回答占比 |
| 回答切题 | answer-relevancy ≥ 0.85 | 用户改问率(隐式) |
| 延迟可接受 | p95 延迟 < 3s | 延迟分位线 |
| 成本可控 | 单次调用成本 | 成本/会话 |

> **规律**:每个质量要求都要能落到"离线数字 + 线上数字"两个位置。哪个要求没有对应指标,哪个要求就是口号。

### 4. 护栏不是最后加,而是贯穿(步骤 5 提前想)

| 威胁 | 在哪个环节拦 | 手段 |
|---|---|---|
| 提示注入 | 输入侧 | 指令-数据分离、注入检测 |
| 数据泄漏 | 检索侧 | 租户隔离、敏感内容过滤 |
| 无来源幻觉 | 生成侧 | 引用白名单 + 兜底话术 |
| 滥用/越权 | 入口侧 | 鉴权、限流、审计日志 |

**实践**:不要在开发完才加护栏——用例卡片阶段就标注"敏感边界",每步开发时顺手留好护栏接口。

### 5. 上线 = 离线验收 + 监控 + 回流

```
上线三条件:
1. 离线:评估集 ≥50 条,三指标达门槛(例:faithfulness ≥0.9)
2. 监控:延迟/成本/引用违规率/兜底率 四条线就位,有阈值告警
3. 回流:线上失败案例每周人工抽检 ≥20 条,补进评估集
```

回流是螺旋的关键:线上新发现问题 → 进评估集 → 修 → 分数验证 → 上线。

## 学习路径

建议 6-8 周(与 [agent-orchestration-design](../ai-ml/agent-orchestration-design.md) 可先后进行,推荐先完成本技能)。

### 阶段一:能跑通最小闭环(第 1-2 周)——Junior 水平

**目标**:从零做出一个可用 demo(不需要 RAG,直接用 prompt + 评估),完整走一遍六步。

- 会写用例卡片
- 会搭 prompt 基线 + 20 条评估集
- 会做最简单的部署(Python 服务 / 脚本)

**验收标准**:

- [ ] 选一个小任务,写出完整用例卡片(六字段齐全)
- [ ] demo 能答、能评(20 条评估集有分数),记录基线
- [ ] 讲得出"下一步改什么,改完看哪个数"

### 阶段二:能上检索(第 3-5 周)——Mid 水平

**目标**:加上 RAG,把"只靠模型记忆"升级为"靠你提供知识"。

- 会按 [rag-pipeline](../ai-ml/rag-pipeline.md) 接入知识源
- 会做引用链路(答案带来源)
- 会做输入护栏(注入检测 + 敏感词过滤)

**验收标准**:

- [ ] 用你自己的文档(≥50 篇)搭出 RAG 版应用,回答带引用
- [ ] 引用正确率与 faithfulness 有量化记录
- [ ] 输入侧护栏生效:注入样例被拦截,有测试记录

### 阶段三:能上线(第 6-8 周)——Senior 水平

**目标**:评估体系 + 护栏 + 监控三件套齐全,达到"敢上线"标准。

- 评估集 ≥50 条,三指标达门槛
- 输出护栏:引用白名单 + 兜底话术全部生效
- 监控四线就位 + 回流机制建立

**验收标准**:

- [ ] 离线评估达标(在你的项目里写下具体门槛和实测值)
- [ ] 监控面板四条线齐全,演示一次告警触发
- [ ] 回流跑通:从线上捞 20 条失败案例 → 补评估集 → 改进 → 分数上升

## 分步实操:文档问答助手(完整案例)

下面用"操作文档问答助手"贯穿六步,每一步给出决策和产出。

### 步骤 1:scope(第 1 天)

**产出:用例卡片**(见核心概念 2 的示例表)。

**关键决策**:

- 使用者:内部员工 → 不需要多轮对话,单轮问答即可
- 知识源:操作手册 200 篇(Markdown + PDF)→ 需要解析 PDF
- 质量门槛:引用正确率 ≥95%、兜底率 = 0(宁可不答不可瞎答)
- 边界:不做跨文档推理 → 检索 top-4 足够,不需要 agent 化

### 步骤 2:prompt(第 2-3 天)

**产出:prompt v1 + 基线分数**。

```python
SYSTEM = """你是操作文档问答助手。规则:
1. 只依据【资料】回答,每个事实标注来源 [编号]
2. 资料不足时回答"未找到相关信息",不编造
3. 回答控制在 3 句话内,先说结论"""

def ask(question: str, context: str) -> str:
    return llm.chat(
        [{"role": "system", "content": SYSTEM},
         {"role": "user", "content": f"【资料】\n{context}\n\n【问题】{question}"}],
        temperature=0,
    )
```

**关键决策**:temperature=0(事实问答不冒险);先人工写 20 条评估集(从真实工单里采样),跑基线**再**动手改 prompt——基线的分低不重要,重要的是有基线。

### 步骤 3:rag(第 4-10 天)

**产出:知识接入 + 引用链路**。

- 摄取:PDF 解析(pdfplumber)→ Markdown 结构感知分块(按 ## 标题)→ 嵌入 → pgvector
- 检索:双路召回(dense + BM25)+ RRF,top-4
- 引用:chunk 元数据带 doc_id,生成 prompt 要求输出 `[编号]`,客户端白名单校验

**关键决策**:分块用"结构感知"而非固定 512——操作手册的标题层级是天然语义边界;检索 top-4 而非 top-8——窗口预算与延迟优先(用例卡片定过)。

### 步骤 4:eval(第 11-14 天)

**产出:评估集 v1(50 条)+ 三指标基线**。

```python
# 评估集来源:真实工单 30 条 + 边界构造 15 条(问不存在的功能)+ 常见误问 5 条
EVAL_SET = [
    {"question": "如何重置密码?", "contexts": [...], "answer": ..., "reference": "重置密码的步骤"},
    {"question": "如何让飞船起飞?", "contexts": [...], "answer": "未找到相关信息", "reference": "未找到相关信息"},  # 兜底用例
]
# 指标:faithfulness / answer-relevancy(ragas)+ 引用白名单通过率(自写)
```

**关键决策**:评估集必须含"边界用例"(不存在的内容)——只测正常问答的评估集测不出兜底是否生效。

### 步骤 5:guardrails(第 15-17 天)

**产出:护栏策略**。

- 输入:注入检测(关键词 + LLM 二次判定)、敏感话题过滤(按部门合规清单)
- 输出:引用白名单校验 + 兜底话术
- 入口:内网 SSO 鉴权 + 每用户限流(10 req/min)+ 审计日志(question/answer/来源全记录)

**关键决策**:审计日志不是可选项——它同时服务安全(追责)与回流(取失败案例)。日志字段在设计护栏时一起定。

### 步骤 6:deploy(第 18-21 天)

**产出:上线三件套**。

- 服务:FastAPI + vLLM 单副本(内网试点),评估集回归脚本进 CI(push 即跑 50 条)
- 监控:延迟 p95 / 成本 / 引用违规率 / 兜底率 四条线,Grafana 告警阈值
- 回流:每周从审计日志抽 20 条失败案例 → 人工标注 → 补评估集 → 触发改进

**关键决策**:先内网灰度两周再全员放开;灰度期重点看"兜底率"——它高说明检索没覆盖真实问题,比分数更能暴露短板。

### 迭代期(第 5-8 周)

每轮迭代 = 回流案例 → 定位环节(检索/生成/护栏)→ 单环节改动 → 评估集验证 → 线上观察。**一次只改一个环节。**

## 示例

### 示例 1:用例卡片模板

```markdown
# 用例卡片:<应用名>
- 输入:__
- 输出:__
- 质量门槛:
  - [ ] 引用正确率 ≥ __%(例 95%)
  - [ ] 兜底触发正确率 ≥ __%(该说"不知道"时说了)
  - [ ] p95 延迟 < __s
- 失败容忍:__
- 使用者:__
- 边界(不做):__
- 敏感边界:__(数据/话题/账号维度)
```

### 示例 2:评估集 + 回流的最小实现

```python
import json, random
from datetime import datetime

def sample_failures(log_path: str, n: int = 20) -> list[dict]:
    """从审计日志捞失败案例(无引用回答 / 用户追问 / 差评)。"""
    with open(log_path) as f:
        logs = [json.loads(l) for l in f]
    fails = [l for l in logs if l.get("no_citation") or l.get("follow_up")]
    return random.sample(fails, min(n, len(fails)))

def append_to_eval_set(cases: list[dict], eval_path: str) -> None:
    """人工标注后补进评估集,附带标注日期。"""
    with open(eval_path, "a") as f:
        for c in cases:
            c["added_at"] = datetime.now().isoformat()
            f.write(json.dumps(c, ensure_ascii=False) + "\n")
```

**要点**:回流机制就是"捞失败 → 标注 → 进评估集"三行函数——但它决定你的系统能否持续变好。

### 示例 3:监控指标计算(伪代码)

```python
def monitor(logs: list[dict]) -> dict:
    total = len(logs)
    return {
        "p95_latency": percentile([l["latency"] for l in logs], 95),
        "cost_per_query": sum(l["cost"] for l in logs) / total,
        "citation_violation_rate": sum(l["violated"] for l in logs) / total,
        "fallback_rate": sum(l["fallback"] for l in logs) / total,   # 该答不知道时答了
        "no_citation_rate": sum(not l["has_citation"] for l in logs) / total,
    }
# 告警阈值示例:p95 > 3s / 引用违规 > 1% / 兜底率 < 5%(过低说明检索摸不到用户痛点)
```

**要点**:兜底率不是越低越好——它低说明"检索没覆盖真实问题但还在硬答"。告警要配"合理区间"而不是单边阈值。

## 练习

产出放入 `personal/` 留档。

### 基础练习(阶段一对应)

- [ ] **P1-1 用例卡片**:为你手头一个真实需求写用例卡片,六字段填满,给同事/朋友评审一次
- [ ] **P1-2 最小闭环**:选小任务(如会议纪要提取),不用 RAG,走完 scope→prompt→eval,记录基线分数
- [ ] **P1-3 失败分析**:取你的 demo 的 20 条回答,按"生成错/数据缺/需求误"分类,写一份改进优先级

### 进阶练习(阶段二对应)

- [ ] **P2-1 RAG 接入**:把 P1-2 升级为带 RAG + 引用,对比接入前后的 faithfulness 与 answer-relevancy
- [ ] **P2-2 输入护栏**:实现注入检测 + 敏感词过滤,构造 10 个攻击样例验证拦截率
- [ ] **P2-3 评估集补全**:给系统补 15 条边界用例(不存在内容/模糊问题/多义词),重跑基线,记录分数变化

### 挑战练习(阶段三对应)

- [ ] **P3-1 监控落地**:实现四条监控线计算 + 告警配置,演示一次告警触发
- [ ] **P3-2 回流闭环**:跑通"捞失败 → 标注 → 补评估 → 改进 → 分数上升"全流程,保留前后对比
- [ ] **P3-3 上线评审**:按"离线达标 + 监控就位 + 回流建立"写一份上线评审报告,模拟答辩

## 自测题

1. 六步工作流的顺序为什么是 scope → prompt → rag?顺序反了会怎样?
2. 用例卡片的"失败容忍"决定后续什么决策?
3. 离线评估指标和线上监控指标的关系?
4. 引用白名单校验拦的是什么?
5. 兜底率为什么不是越低越好?
6. 回流机制的核心动作是什么?它服务哪些目标?
7. 改了一个环节,应该看什么数验证?
8. 护栏什么时候开始在开发流程里出现?为什么?

<details>
<summary>答案</summary>

1. 先定"什么样算好"(scope),再用量化方法造 prompt(prompt),最后才加知识(RAG)。顺序反了会"为 RAG 而 RAG",没有质量标尺,改什么都无法判断好坏
2. 决定模型选型(能不能容忍偶尔错误)、要不要 RAG、护栏的严格程度、评估集边界用例的设计
3. 每个质量要求都要同时有离线数字(评估集)和线上数字(监控),缺一个就变成口号
4. 无来源幻觉:模型引用了检索集之外的"编造来源"。白名单校验让每个 [编号] 都能查到
5. 兜底率过低说明检索没覆盖用户的真实问题,但系统还在硬答——正常区间应该能反映"检索盲区"的存在
6. 捞失败案例 → 人工标注 → 补进评估集 → 改进 → 验证。服务两个目标:持续变好的引擎 + 让评估集跟上真实分布
7. 对应环节的指标:改检索看 context-recall,改生成看 faithfulness,改护栏看拦截率——不要一把梭看总分
8. 从用例卡片阶段就开始想(敏感边界标注),每步开发随手留接口。最后才加护栏会导致接入成本高、留下绕过口子
</details>

## 常见错误与反模式

- ❌ **需求没收敛就开写**——用例卡片六字段空着,后面全链路返工
- ❌ **跳过基线直接调 prompt**——没有起点,改完不知道提升没有
- ❌ **评估集只有正常用例**——测不出兜底、测不出边界
- ❌ **最后才加护栏**——接入难、绕过口子多
- ❌ **监控和离线评估两套数字对不上**——指标口径必须一致
- ❌ **没有回流机制**——系统上线即封版,问题永远躺在线上
- ❌ **一次改多个环节**——指标变了不知道谁的功劳
- ❌ **上线验收只看 demo 演示**——不看评估分数、不看监控曲线
- ❌ **日志不记引用与兜底字段**——回流无米下锅

## 参考资源

- [OpenAI Production Best Practices](https://platform.openai.com/docs/guides/production-best-practices) — 官方文档,评估/监控落地
- [Anthropic — Build with Claude](https://docs.anthropic.com/en/docs/build-with-claude/overview) — 官方文档,agent 与提示最佳实践
- [Ragas](https://github.com/explodinggradients/ragas) — 工具,RAG 评估指标
- [LangSmith](https://www.langchain.com/langsmith) — 工具,追踪与回流
- [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications/) — 标准,护栏威胁清单
- [Instructor](https://github.com/jxnl/instructor) — 工具,结构化输出(评估与护栏都依赖它)

## 相关 Skills

- [prompt-engineering](../ai-ml/prompt-engineering.md) — 步骤 2 的地基
- [rag-pipeline-design](../ai-ml/rag-pipeline-design.md) — 步骤 3 的生产级检索
- [llm-evaluation](../ai-ml/llm-evaluation.md) — 步骤 4 的方法学
- [guardrails-safety](../ai-ml/guardrails-safety.md) — 步骤 5 的威胁清单
- [context-window-management](../ai-ml/context-window-management.md) — 全流程窗口预算
- [agent-orchestration-design](../ai-ml/agent-orchestration-design.md) — 本技能的进阶:需求复杂到单 Agent 不够时
- [llm-cost-optimization](../ai-ml/llm-cost-optimization.md) — 上线后的成本治理