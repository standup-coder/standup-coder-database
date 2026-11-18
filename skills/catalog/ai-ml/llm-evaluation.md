---
id: llm-evaluation
type: atomic-skill
title: LLM Evaluation
nameZh: LLM 评估
domain: ai-ml
tags: llm, evaluation, quality, regression
catalogSource: internal
catalogFile: atomic-skills/llm-evaluation.json
catalogAddedAt: 2026-07-26
operation: ai-llm
level: mid
---

# LLM 评估

> 为 LLM 应用建立离线与在线评估体系:评估集、指标、judge 模型、回归测试。学完本技能,你能把"这模型好不好用"变成可量化、可对比、可防止退化的工程问题。

## 这个技能解决什么问题

传统软件有单元测试兜底,LLM 应用没有"编译错误"——它永远在输出,只是有时输出错的。更麻烦的是,**LLM 的输出会悄悄退化**:换个模型版本、改一段 prompt、加一个 few-shot 示例,某个角落的正确率就掉了,而你上线前可能完全看不出。

| 痛点 | 没评估体系的做法 | 有评估体系的做法 |
|---|---|---|
| 换模型/换 prompt 后变差 | 上线后用户投诉才发现 | 上线前跑回归,分数对比直接拦截 |
| 不知道改得好不好 | "感觉变好了" | 基线 v0 → v1 分数,一目了然 |
| 坏 case 说不清 | 零散截图,无法归类 | 评估集分桶,坏 case 自动归类 |
| 无法防模型升级退化 | 祈祷供应商别改模型 | 固定模型快照 + 定期回归 |

学完之后你应该能:

- 为任意 LLM 任务定义评估维度(准确性 / 鲁棒性 / 幻觉 / 格式 / 延迟成本),并说出各自怎么测
- 构建一个防泄漏、覆盖边界样本的评估集,并写清标注规范
- 算准准确率、精确率、召回率与 F1,知道多分类和"答非所问"该用什么指标
- 正确使用 LLM-as-Judge,并规避位置偏差、自偏袒、啰嗦偏好三大坑
- 用 Promptfoo 或手写脚本跑通一次可复现的评估,并把轻量回归接入 CI

## 前置知识

按依赖顺序,建议先掌握:

1. **基础提示工程**([prompt-engineering](../ai-ml/prompt-engineering.md))——评估的对象就是 prompt,理解消息结构与 few-shot 才能写清"评估什么"
2. **API 调用**([claude-api](../ai-ml/claude-api.md))——评估要批量发请求(几十到几百次),需要能写脚本调模型
3. **Python 基础**——示例脚本是可运行 Python,需要能读懂并修改

如果你从零开始:先读完 [prompt-engineering](../ai-ml/prompt-engineering.md) 的阶段一,再回来;本技能默认你已会调 API。

## 核心概念

按"是什么 → 怎么建 → 怎么量 → 怎么自动化"排序,共六个概念。

### 1. 为什么必须评估:回归风险

LLM 应用的每个环节都会"悄悄变":供应商升级模型、你改 prompt、切换 few-shot 示例、换了向量库……任何一个变化都可能让某类输入从对变错,而**大部分变化在少量人工试测里根本看不出来**。

评估的本质是给变化装上"回归护栏":把行为冻结成可重复测量的基线,任何变更上线前先对比基线。这和传统工程的回归测试是同一个思想,区别只在于 LLM 的测试输入输出是概率性的、需要统计口径。

两个必须建立的纪律:

- **模型版本要 pin(锁定)**:评估分数只在"同一模型快照"下可对比。换模型版本等于换了一个被测对象,基线作废
- **评估先于变更**:任何 prompt/模型改动,先想"我用什么分数判断这次改动成功",再动手改

### 2. 评估维度:五个面

一个任务的好坏通常不止"答得对",至少要从五个维度看。**维度决定你收集什么、测什么**:

| 维度 | 测什么 | 怎么测 | 适用场景 |
|---|---|---|---|
| 准确性 | 答案与正确答案的吻合度 | 参考答案比对、judge 打分 | 分类、抽取、问答 |
| 鲁棒性 | 输入扰动下的稳定性(错别字、换表述、加噪音) | 对评估集做扰动,对比分数 | 面向真实用户的任务 |
| 幻觉(faithfulness) | 输出是否忠于给定材料,有没有编造 | 逐句检查"是否有依据" | RAG、总结、引用类任务 |
| 格式合规 | 输出是否可解析(JSON 合法、字段齐全、类型正确) | 解析器校验 + schema 校验 | 所有结构化输出 |
| 延迟与成本 | 每次请求耗时、token 消耗 | 计时 + usage 统计 | 生产性能与账单 |

> 关键判断题:**任务类型决定维度优先级**。金融抽取任务,准确性 + 格式 > 一切;客服总结,幻觉最重要;用户会乱打字,鲁棒性是底线。

### 3. 评估集构建:评估的地基

评估集是"尺子",尺子歪了,所有分数都是假的。四条建设原则:

**① 真实采样为主,合成样本为辅**。从真实流量/用户输入中随机采样,保证分布与线上一致。合成样本只用来补"线上太少但重要"的场景(如罕见投诉类型)。

**② 覆盖三类样本**:

| 样本类型 | 作用 | 例子(客服分类) |
|---|---|---|
| 正常样本 | 测主路径准确率 | 常规好评/差评 |
| 边界样本 | 测划界能力 | "东西坏了但客服态度好" |
| 对抗样本 | 测防御能力 | 提示注入、长文本、乱码输入 |

**③ 标注规范文档化**。每条样本必须能回答"为什么这条算对/错"——两个标注者标准不一致,评估集就是噪声源。规范的例子:"整体体验以用户最终感受为准,单一环节差评但被妥善解决 → mixed"。

**④ 防泄漏三隔离**:评估集 ≠ few-shot 示例集(示例抄评估集 = 考试漏题);评估集 ≠ 训练/微调数据;评估集一旦定稿,标注后不许再改(改 = 移动靶)。

小建议:评估集从 20-50 条起步,再逐步扩到 200+;**宁可 50 条真实,不要 200 条凑数**。

### 4. 指标:从准确率到 F1

先分清两类指标:

- **参考型指标**:需要人工/已知正确答案(golden answer),如准确率、精确率、召回率、F1、ROUGE/BLEU(文本相似度)
- **无参考型指标**:不需要标准答案,如幻觉率(答案是否忠于材料)、格式合规率、延迟

多分类任务**只看准确率会骗人**:95% 样本都是"好评"时,全答"好评"就有 95% 准确率,但差评全错。这时要看**每个类别的精确率(答对该类/答成该类)与召回率(答对该类/该类总数)**,并关注 F1:

```text
精确率 = 预测为该类的样本中,真正是该类的比例
召回率 = 该类的样本中,被正确预测的比例
F1 = 2 × 精确率 × 召回率 / (精确率 + 召回率)
```

对输出是自由文本的任务(总结、问答),参考型指标改用"要点命中率":把答案按要点拆成清单,人工或 judge 逐点判断"提到/没提到",统计命中比例——这比 BLEU/ROUGE(逐字相似)更反映真实质量。

### 5. LLM-as-Judge:用法与三大坑

让一个"裁判模型"给输出打分或做两两对比,叫 LLM-as-Judge。它便宜、可扩展,是当前主流做法,但**裁判本身也是 LLM,会带偏倚**:

| 偏倚 | 现象 | 缓解办法 |
|---|---|---|
| 位置偏差 | 两个答案对比时,无脑偏好排在前面的 | 把 A/B 顺序互换各评一次,取一致结论 |
| 自偏袒 | 裁判与选手同模型时,偏好"自己"的输出 | 裁判用不同模型家族(如生成用 A,裁判用 B) |
| 啰嗦/冗长偏好 | 越长越详细越容易得高分 | 裁判提示里明确"不因长度加分,只看内容质量" |

**使用守则**:

1. 裁判 prompt 给**明确打分标准**(分档描述 + 正反例),不要"1-10 打分"
2. 每次都让裁判**给出打分理由**(reason),分数可审计
3. **结构化输出**:要求裁判输出 JSON(`{"score": ..., "reason": ...}`),便于解析
4. 关键判断(如"是否越权")用**确定性规则**替代裁判:能代码判断的绝不用裁判

> 判断口诀:**能规则判断的不用 judge,能 judge 判断的不用人工**。judge 是人工与代码之间的桥梁,不是万能替代品。

### 6. 评估落地:离线、在线与工具链

**离线评估(开发期)**:固定评估集 + 固定指标,每次变更跑一遍,对比基线。回答"这次改动好了还是坏了"。

**在线评估(生产期)**:影子模式——把生产流量复制一份给新版本,旧版本照常服务,新版本只记录不对外,事后对比两边输出。没有风险地观察"真实分布下新版本表现如何"。更进一步是人工抽检 + 用户反馈(点赞/点踩)闭环,作为离线评估的补充证据。

**工具简评**(都真实存在,按需选用):

| 工具 | 定位 | 适合谁 | 一句话点评 |
|---|---|---|---|
| [Promptfoo](https://www.promptfoo.dev/) | 配置文件驱动的评估框架 | 想快速接 CI 的人 | 声明式 eval,可输出日志并 diff 对比 |
| [Ragas](https://github.com/explodinggradients/ragas) | RAG 专用指标库 | RAG 应用 | 现成的 faithfulness/context 指标 |
| [DeepEval](https://github.com/confident-ai/deepeval) | Python 评估框架 | 重度 Python 团队 | 指标丰富,与 pytest 集成顺手 |
| [LangSmith](https://docs.smith.langchain.com/) | LLM 应用观测 + 评估平台 | 用 LangChain 的团队 | 追踪 + 评估一体,适合生产 |

**CI 接入思路**:轻量级评估集(20-50 条)进 CI,每次 prompt/代码变更触发;全量评估集(200+ 条)定时或发布前跑。CI 失败条件:准确率低于基线阈值、无参考型指标恶化、格式合规率跌破 100%。

## 学习路径

按 4-6 周规划,每阶段有可勾选验收标准。

### 阶段一:会量(第 1 周)

**目标**:能对一个已有任务建立最小评估集并跑出基线分数。

- 掌握五个评估维度与任务类型对应关系
- 能构造 20-50 条覆盖三类样本的评估集
- 会写脚本批量调用模型并计算准确率

**验收标准**:

- [ ] 选一个现有任务(如分类),人工标注 ≥20 条评估集,写出标注规范(哪些算对、哪些算错、边界怎么判)
- [ ] 写脚本跑出基线准确率与每个类别的精确率/召回率
- [ ] 说出你的任务最重要的两个维度是什么、为什么

### 阶段二:会判(第 2-3 周)

**目标**:能用 LLM-as-Judge 评估自由文本类任务,并规避三大偏倚。

- 掌握 judge prompt 写法(打分标准 + 理由 + JSON 输出)
- 掌握位置偏差的 A/B 互换法、自偏袒的跨家族裁判法
- 会把坏 case 归类,输出失败分析

**验收标准**:

- [ ] 为总结类任务写 judge prompt,10 条样本跑通,输出可解析 JSON
- [ ] 同一对比任务跑"正序 / 反序"两组,统计一致率;结果为"判给了先出现的答案"的样本占比
- [ ] 给评估集跑出 ≥5 条坏 case,按失败类型(幻觉/遗漏/格式/风格)归类,各写一句根因

### 阶段三:会守(第 4-6 周)

**目标**:能建立防退化的回归体系,覆盖离线 + 在线。

- 会用 Promptfoo 或手写脚本把评估接进 CI
- 理解影子模式的部署方式与踩坑
- 能设计"基线对比 + 阈值拦截"的回归规则

**验收标准**:

- [ ] 用 Promptfoo(或自写脚本)把 ≥20 条评估集接进 CI,一次人为引入的"prompt 退化改动"被 CI 拦截
- [ ] 写一份《评估维护规范》:评估集更新流程、标注规范、阈值设定与告警、模型版本 pin 策略
- [ ] 说出影子模式与 A/B 测试的区别,并设计一个影子模式的实验计划(流量切分、指标、决策时间)

## 分步实操:从零建立评估体系

纪律与提示工程一致:**先建尺子,再量**。顺序错了就会陷入"越调越糊涂"。

```
第 1 步 定义任务与评估维度      → 一张表:维度 × 测法 × 阈值
   ↓
第 2 步 采样与标注评估集(≥20 条) → 评估集文件(JSON/CSV)+ 标注规范
   ↓
第 3 步 实现指标与 baseline 脚本 → baseline 分数(记录模型版本!)
   ↓
第 4 步 给坏 case 归类,定位根因
   ↓
第 5 步 单选 judge / 上 CI 回归
   ↓
第 6 步 维护:更新评估集 + 重新基线
```

### 第 1 步:定义任务与维度

一句话写清输入输出,然后从五个维度里挑 2-3 个作为**必须量化**的,给出各自阈值(如:准确率 ≥ 90%、格式合规 = 100%、幻觉率 ≤ 5%)。

### 第 2 步:采样与标注

从真实数据采样(别只挑好的),补边界与对抗样本。逐条标注正确答案,同时写标注规范。输出存成一个文件,例如 `evals/classify_eval.jsonl`,一行一条:`{"input": "...", "gold": "negative", "note": "边界:整体差评但客服态度好"}`。

### 第 3 步:基线脚本

写脚本:读评估集 → 批量调用模型 → 计算指标 → 打印分数,**同时记录模型 ID 与参数**。把输出存到 `evals/results/` 留档。

### 第 4 步:坏 case 分析

把错例全打出来,按概念 2 的维度归类。这一步产出的是"下次改什么"的清单——**改 prompt 的输入是失败分析,不是灵感**。

### 第 5 步:固化与自动化

自由文本任务选好 judge 方案(概念 5);写 CI 步骤:每次 push 跑轻量评估,对比基线,超阈值失败(示例 3)。

### 第 6 步:维护

评估集是活资产:线上出现新类型错误,就在评估集里补样本→更新基线;标注规范有歧义,就重写规范条目。**每次评估集变更都单独提交,配基线分数**,保证历史可比。

## 示例

三个示例覆盖评估的主干:手写全流程 → 用现成工具 → 接入 CI。示例 1 建议完整跑通,示例 2、3 可直接复制改造。

### 示例 1:手写评估脚本(准确率 + F1 + LLM-as-Judge 位置互换)

一个自包含的评估脚本:部分用例用规则判分(分类),部分用例用 judge 判分(总结质量),其中 judge 对比做正反序两次取一致结论,演示位置偏差的规避。

```python
# llm_quick_eval.py — 手写最小评估脚本(分类 + judge 对比)
import json
from collections import Counter
from openai import OpenAI

client = OpenAI()

# ---------- 1. 评估集:分类用例(gold 是标准答案) ----------
CLASSIFY_EVAL = [
    {"input": "包装很精致,味道也好", "gold": "positive"},
    {"input": "外卖迟到一小时,汤都洒了", "gold": "negative"},
    {"input": "客服不错但退款太慢", "gold": "mixed"},
    {"input": "便宜但质量一言难尽", "gold": "negative"},
    {"input": "退款成功,平台给力", "gold": "positive"},
]

# ---------- 2. judge 对比用例:A/B 是两个候选输出 ----------
JUDGE_EVAL = [
    {
        "task": "把下面的话改写成 20 字以内的道歉短信",
        "a": "非常抱歉给您带来不便,我们会尽快处理。",
        "b": "抱歉抱歉,我们加急处理,请您耐心等待,感谢理解,对不起。",
    },
]

JUDGE_PROMPT = """你是客观的文本质量评审员。比较下面两个候选输出(A/B),
从「信息完整、简洁、语气得体」三方面评判,选更优的一个。
规则:只比较内容质量,不因 A 或 B 的长短加分。

候选 A: {a}
候选 B: {b}

只输出 JSON: {{"winner": "A|B|tie", "reason": "一句话理由"}}"""

def classify(text: str) -> str:
    """调用模型分类(被测对象)。"""
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user",
                   "content": f"把反馈分为 positive/negative/mixed,只看整体体验。\n反馈:{text}"}],
        temperature=0,
    )
    return resp.choices[0].message.content.strip().lower()

def judge_winner(a: str, b: str) -> str:
    """裁判模型对比,返回 winner。"""
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user",
                   "content": JUDGE_PROMPT.format(a=a, b=b)}],
        temperature=0,
    )
    return json.loads(resp.choices[0].message.content)["winner"]

# ---------- 3. 跑分类评估:准确率 + 每类精确率/召回率/F1 ----------
def f1(p, r):
    return 0.0 if p + r == 0 else 2 * p * r / (p + r)

correct = 0
gold_counts, pred_counts, hit_counts = Counter(), Counter(), Counter()
for case in CLASSIFY_EVAL:
    pred = classify(case["input"])
    gold = case["gold"]
    correct += (pred == gold)
    gold_counts[gold] += 1
    pred_counts[pred] += 1
    if pred == gold:
        hit_counts[gold] += 1

print(f"准确率: {correct}/{len(CLASSIFY_EVAL)} = {correct/len(CLASSIFY_EVAL):.0%}")
for label in gold_counts:
    p = hit_counts[label] / pred_counts[label] if pred_counts[label] else 0
    r = hit_counts[label] / gold_counts[label] if gold_counts[label] else 0
    print(f"类别 {label}: 精确率 {p:.0%}  召回率 {r:.0%}  F1 {f1(p, r):.0%}")

# ---------- 4. 跑 judge 对比:正序 + 反序,规避位置偏差 ----------
for case in JUDGE_EVAL:
    w1 = judge_winner(case["a"], case["b"])          # 正序
    w2 = judge_winner(case["b"], case["a"])          # 反序(互换位置)
    # 反序的 winner 映射回正序坐标
    w2_normalized = {"A": "B", "B": "A"}.get(w2, w2)
    print(f"正序判定: {w1}  反序判定(归一化): {w2_normalized}  一致: {w1 == w2_normalized}")
```

**要点**:分类部分用规则判分(准确率/F1),总结部分用 judge——按任务类型选判分方式;judge 对比做**正反序双跑**,位置偏差会被暴露;所有调用 `temperature=0` 保证评估本身可复现。**评估脚本与被测应用的代码是同等级资产,要进 git、要留档结果。**

### 示例 2:用 Promptfoo 声明式评估

Promptfoo 用 YAML 声明评估集与断言,一条命令跑完,适合直接进 CI。

```yaml
# promptfooconfig.yaml — 分类任务评估
prompts:
  # 被测的两版 prompt:一个零样本,一个 few-shot,直接对比
  - "把反馈分为 positive/negative/mixed。\n反馈:{{input}}"
  - |
    把反馈分为 positive/negative/mixed,只看整体体验。
    反馈:客服不错但退款太慢 → mixed
    反馈:包装很精致,味道也好 → positive
    反馈:{{input}}

providers:
  - id: openai:gpt-4o-mini
    config:
      temperature: 0   # 固定随机性,保证分数可复现

tests:
  # 每一条测试:输入 + 期望(golden)
  - vars: { input: "包装很精致,味道也好" }
    assert:
      - type: equals
        value: positive
  - vars: { input: "便宜但质量一言难尽" }
    assert:
      - type: equals
        value: negative
  - vars:
      input: "客服不错但退款太慢"
    assert:
      # 边界样本:两个版本都判 mixed 才算过
      - type: equals
        value: mixed
```

```bash
# 安装并运行:输入 API key 后一行出报告(通过率、逐条断言结果)
npm install -g promptfoo
promptfoo eval          # 跑当前目录的 promptfooconfig.yaml
promptfoo view          # 本地打开对比面板,看两版 prompt 的逐条差异
```

**要点**:prompt 版本、评估集、断言(assert)全在 YAML 里,天然可进 git;**"prompt 也是被测代码"**——换 prompt 就是换被测程序,分数对比由 promptfoo 输出。`providers` 可换成任意模型,换模型时直接对比"同评估集、不同 provider"的分数,这就是模型回归测试。

### 示例 3:把回归接进 CI(GitHub Actions)

轻量评估集每次 push 跑,全量评估发布前跑;任一低于基线的断言直接失败 CI,从机制上拦住"悄悄退化"。

```yaml
# .github/workflows/llm-eval.yml — LLM 回归(轻量版)
name: llm-eval
on:
  push:
    paths: ["prompts/**", "app/**", "evals/**"]  # prompt/代码/评估集变更都触发
  workflow_dispatch: {}                          # 手动触发跑全量

jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: 安装 promptfoo
        run: npm install -g promptfoo

      - name: 跑轻量回归(基线 evals/ci-set)
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: promptfoo eval --config evals/ci-set.yaml --output results/ci.json

      - name: 断言:通过率不低于 90% 且不较基线退化
        run: |
          node -e "
            const r = require('./results/ci.json');
            const pass = r.results.filter(x => x.success).length / r.results.length;
            console.log('通过率:', pass);
            if (pass < 0.9) { console.error('低于阈值 90%,CI 失败'); process.exit(1); }
          "

      - name: 上传评估结果留档
        uses: actions/upload-artifact@v4
        with:
          name: eval-results
          path: results/
```

**要点**:CI 的价值在"**自动化 + 历史留档**"——push 即测,结果存档可回溯。真实项目里再把"对比上一次基线"做成一步(差值超阈值即失败)。注意 **API key 走 GitHub Secrets,绝不写死在 workflow 里**。CI 集成细节可参考 [github-actions](../devops/github-actions.md)。

## 练习

按顺序完成,产出建议放入 `personal/` 留档。

### 基础练习

- [ ] **P1-1 维度清单**:为你的主任务写一张《评估维度表》(五维度 × 用不用 × 怎么测 × 阈值),至少选 2 个维度给出可量化阈值
- [ ] **P1-2 建 20 条评估集**:从真实数据采样 20 条(含 ≥3 条边界、≥2 条对抗),写标注规范,存成 jsonl,人工标注完毕
- [ ] **P1-3 跑基线**:写脚本跑出基线准确率与每类 F1,记录模型 ID 与 temperature,结果存档

### 进阶练习

- [ ] **P2-1 Judge 三件套**:为总结/问答任务写 judge prompt(打分标准 + 理由 + JSON),测 10 条,统计可解析率与理由质量
- [ ] **P2-2 位置偏差实验**:构造 5 组"A 明显优于 B"的对比,正反序各评一次,统计一致率;若 < 80%,改进 judge prompt 后重测
- [ ] **P2-3 失败画像**:从基线错例里挑 5-8 条,按"幻觉/遗漏/格式/风格"归类,写一份失败分析,给每条配一个修改假设

### 挑战练习

- [ ] **P3-1 CI 回归**:用 Promptfoo 或示例 3 的 workflow,把 ≥20 条评估集接入 CI;人为提交一次故意变差的 prompt,验证 CI 能拦下
- [ ] **P3-2 双模型互判**:选 2 个不同家族模型互为 judge,对比两者判定一致率,验证自偏袒是否存在并量化
- [ ] **P3-3 影子模式方案**:为你的应用写一份影子模式上线方案(流量复制方式、对比指标、观察周期、决策规则、回滚条件),如条件允许真正实施一周

## 自测题

先独立作答,再对照答案。答不出的题回看对应章节。

1. 为什么"感觉变好了"不能作为换模型/prompt 的依据?评估要解决的核心风险是什么?
2. 请列出评估的五个维度,并说明"用户会乱打字的应用"最该重视哪两个维度?
3. 95% 样本是"好评"的分类任务,准确率 95% 意味着什么?该看什么指标?
4. 评估集、few-shot 示例集、微调数据三者的关系是什么?泄漏的后果?
5. LLM-as-Judge 的三大偏倚是什么?位置偏差怎么规避?
6. 影子模式与 A/B 测试的区别是什么?影子模式的价值在哪?
7. 你的评估 CI 每次跑准确率都略低,可能是随机性没固定。该修什么?
8. 裁判模型与生成模型该不该同款?为什么?

<details>
<summary>答案</summary>

1. 评估针对的核心风险是**回归**:输出概率性 + 供应链可变(模型升级、prompt 改动),任何变更都可能让部分输入悄悄变错,人工试测看不出;只有固定评估集 + 基线分数的对比才算证据。
2. 五个维度:准确性、鲁棒性、幻觉(faithfulness)、格式合规、延迟与成本。用户乱打字 → 最重视鲁棒性(输入扰动)与准确性;另:若做 RAG,幻觉也要高优先级。
3. 准确率 95% 可能是"全答好评"刷出来的,差评类全错也被平均分掩盖。要看每类的精确率/召回率/F1,尤其是少数类的召回率。
4. 三者必须严格分离:评估集与 few-shot 示例重叠 = 考试漏题;与微调数据重叠 = 训练集泄漏。后果:离线分数虚高,线上原形毕露。
5. 位置偏差(A/B 先出现的被偏爱)、自偏袒(裁判与生成同模型)、啰嗦偏好(长的得高分)。位置偏差:正反序各评一次取一致结论。
6. 影子模式是"新旧版本同时跑、新版本不对外、事后对比",无用户风险地观察真实分布表现;A/B 是"真实分流给用户"。影子模式先于 A/B 验证"新版在真实流量下会不会变差"。
7. 把 temperature 固定为 0(必要时用 seed),并固定模型版本;否则每次运行都是不同的抽样结果,分数差异是噪声不是质量变化。
8. 不建议同款。同模型当裁判会偏袒自己的输出(自偏袒);用不同家族模型做裁判,可以交叉验证,结论更可信。
</details>

## 常见错误与反模式

- ❌ **没有评估集就评审新模型**——"看起来差不多"无法对比;先建基线再谈换模型
- ❌ **评估集与 few-shot 示例同源**——数据泄漏,分数虚高,上线翻车
- ❌ **只报准确率,不看分桶**——类别不均是常态,少数类全错也"平均 95%";分桶看每类精确率/召回率/F1
- ❌ **裁判和选手用同一个模型**——自偏袒,judge 分数系统性偏高;换模型家族做裁判
- ❌ **judge 不问理由**——没有 reason 的分数无法审计、无法定位失败;裁判必须给打分理由
- ❌ **评估不固定 temperature/seed**——每次跑分都是不同抽样,基线无意义
- ❌ **评估集一次定稿永不更新**——新失败类型出现时,评估集要补样本并重新基线,但要防止天天改(移动靶)
- ❌ **CI 接全量评估集**——几百条 × 每轮 push,慢且烧钱;轻量集进 CI,全量定时跑
- ❌ **上线前不跑回归**——模型升级/提示词变更没有护栏,退化只能等用户发现
- ❌ **在线评估只有"用户点踩"**——幸存者偏差,大多数用户不反馈;影子模式 + 主动抽检补盲区

## 参考资源

- [Promptfoo](https://www.promptfoo.dev/) — 工具,配置文件驱动的评估框架,适合 CI
- [Ragas](https://github.com/explodinggradients/ragas) — 工具,RAG 专用评估指标库
- [DeepEval](https://github.com/confident-ai/deepeval) — 工具,Python 评估框架,与 pytest 集成
- [LangSmith Evaluation](https://docs.smith.langchain.com/evaluation) — 文档,在线评估与追踪平台
- [LLM-as-Judge (Zheng et al.)](https://arxiv.org/abs/2306.05685) — 论文,judge 方法与偏倚实验的原始出处
- [Evaluating LLM Apps (Hamel Husain)](https://hamel.dev/blog/posts/evals/) — 文章,生产级评估的实践总结
- [Anthropic — Using Language Models as Judges](https://www.anthropic.com/engineering/building-effective-agents) — 文档,judge 使用与偏倚的综合建议(英文;亦可搜索同主题新版文章)

## 相关 Skills

- [prompt-engineering](../ai-ml/prompt-engineering.md) — 前置基础,评估的对象是 prompt 及其版本
- [agent-evaluation](../ai-ml/agent-evaluation.md) — 进阶:评估从"单轮对话"升级到"多步 Agent 轨迹"
- [rag-pipeline-design](../ai-ml/rag-pipeline-design.md) — 落地场景:RAG 的幻觉/上下文指标在这里用
- [llm-cost-optimization](../ai-ml/llm-cost-optimization.md) — 维度之一:延迟与 token 成本的量化与优化
- [github-actions](../devops/github-actions.md) — 落地场景:把回归测试接进 CI 流水线