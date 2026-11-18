---
id: fine-tuning
type: atomic-skill
title: Fine-Tuning
nameZh: 模型微调
domain: ai-ml
level: senior
tags: llm, fine-tuning, sft, lora, dpo
catalogSource: internal
catalogFile: atomic-skills/fine-tuning.json
catalogAddedAt: 2026-07-26
operation: ai-llm
---

# 模型微调

> 用数据改变模型行为:规划并执行 SFT / LoRA / DPO,覆盖数据治理、训练、评估与部署。学完本技能,你能判断"该不该微调",并在该微调时走完整流程而不是瞎训。

## 这个技能解决什么问题

微调是改变模型行为的最后手段,也是最昂贵的。本技能解决三个问题:

| 问题 | 表象 | 微调能解决的 |
|---|---|---|
| **输出风格/格式不达标** | prompt 怎么写都偏离你的格式、语气、领域术语 | ✅ 学风格/格式最有效 |
| **知识不够** | 模型不知道你的私有文档内容 | ⚠️ 效果差且易幻觉,优先 RAG |
| **行为偏好不对** | 模型不分轻重、拒绝该拒绝的、迎合不该迎合的 | ✅ DPO/RLHF 有效 |

**学完之后你应该能**:

- 用决策树判断:prompt → RAG → 微调,当前问题该走哪一步
- 区分 SFT / LoRA / QLoRA / DPO 的适用场景与成本量级
- 准备 1k 条高质量训练数据(去重、平衡、格式规范)
- 跑通留出集评估,量化微调收益与通用能力损失
- 识别灾难性遗忘与幻觉加剧的迹象并止损

## 前置知识

- [prompt-engineering](../ai-ml/prompt-engineering.md) — 先知道 prompt 的上限,才能判断"该不该微调"
- [llm-evaluation](../ai-ml/llm-evaluation.md) — 评估集与指标是微调成败的度量衡
- **Python 与 HuggingFace 基础**:能读懂 transforme、datasets、peft 的基本用法
- **GPU 概念**:知道显存、batch size、梯度;不是必须自己训,但要能看懂训练日志

> ⚠️ 硬门槛:如果没上过两种以上"prompt+RAG 打满"的方案,先别微调。微调前必须先量化基线。

## 核心概念

### 1. 决策树:什么时候才该微调

```
任务效果不满意?
├─ prompt 是否已打满?(评估集 + 多轮迭代)
│   └─ 没有 → 先做 prompt 工程,回来再评
├─ 问题是否"知识缺失"?(问私有文档/新产品)
│   └─ 是 → 用 RAG 注入知识,别微调
├─ 问题是"输出格式/风格/领域语气"?
│   └─ 是 → SFT/LoRA,这是微调的主场
├─ 问题是"行为偏好"(拒绝/权衡/安全)?
│   └─ 是 → DPO/RLHF,需要成对偏好数据
└─ 都不是 → 回到任务定义,别靠微调硬凑
```

**关键判断**:微调学"怎么说话",不学"知道什么"。知识靠 RAG,风格靠微调,偏好靠 DPO。

### 2. 三种主要方法

| 方法 | 原理 | 改动参数 | 数据 | 成本 | 适用 |
|---|---|---|---|---|---|
| 全参 SFT | 全部权重微调 | 100% | 10k+ | 极高 | 大预算、领域模型化 |
| LoRA | 低秩适配器,只训两个小矩阵 | <1% | 1k-5k | 低 | 默认首选 |
| QLoRA | LoRA + 4bit 量化基座 | <1% | 1k-5k | 最低 | 单卡可跑 |
| DPO | 偏好优化,直接在成对数据上学 | 同 LoRA 规模 | 成对(chosen/rejected) | 中 | 行为对齐 |

**LoRA 直觉**:不修改原权重 W,而是学一个低秩增量 ΔW = A×B(A、B 是小矩阵)。推理时 W' = W + α·A×B,可插拔、可合并、可叠多个适配器。

### 3. 数据质量 >> 数据数量

- **1k 高质量样本胜过 100k 低质量**——微调是从样本里学分布,脏样本直接学进去
- 三条铁律:**去重**(重复样本导致过拟合)、**平衡**(类别分布均匀)、**规范性**(格式一致,模板统一)
- 按主题分桶,保证每个用途都有代表性样本
- 训练集与评估集(留出集)**严格分离**,防止泄漏虚高

**数据格式(SFT 对话模板)**:

```json
[
  {"role": "system", "content": "你是客服质检助手..."},
  {"role": "user", "content": "用户:东西坏了。客服:建议联系厂家。"},
  {"role": "assistant", "content": "{\"grade\": \"C\", \"issues\": [\"未提供解决方案\"], \"suggestion\": \"...\"}"}
]
```

### 4. 训练与评估:两个绑定的循环

```
数据准备 → 基线评估(微调前先测!)
   ↓
训练(记录每步 loss)
   ↓
留出集评估 ↔ 通用 benchmark 评估(并行!)
   ↓
达标?→ 部署前再跑一次回归对比
```

**两条评估缺一不可**:

- **专项评估**:你的目标任务,留出集上对比微调前后分数
- **通用评估**:MMLU 等通用 benchmark(或至少 3-5 个常识任务),**专测"忘没忘"**——灾难性遗忘是微调头号风险

### 5. 灾难性遗忘与幻觉加剧

症状与对应处理:

| 症状 | 原因 | 处理 |
|---|---|---|
| 通用能力下降(数学/推理变差) | 学习率过高、数据单一、步数过多 | 降 LR、加通用数据、提前 early stop |
| 专项任务过拟合(训练集 99% / 留出 60%) | 数据量不足、重复多 | 去重、扩数据、LoRA 降 rank |
| 幻觉反而加剧 | 让模型背知识、数据含错误信息 | 停训,回 RAG 路线 |

## 学习路径

建议 4-6 周,前提是你已掌握前置技能。

### 阶段一:能跑通(第 1-2 周)——Junior 水平

**目标**:用现成脚本对开源小模型(7B/13B)完成一次 LoRA 微调,并完成留出集对比。

- 掌握 HuggingFace PEFT + TRL 的最小流程
- 会做基础数据清洗(去重、格式转换)
- 会跑留出集评估并对比基线

**验收标准**:

- [ ] 用 QLoRA 在 7B 模型上完成一次 SFT,训练 loss 下降且留出集分数 **高于基线**
- [ ] 能说出你改了哪些超参、为什么
- [ ] 训练日志与评估结果沉淀在 `personal/` 下

### 阶段二:能治理(第 3-4 周)——Mid 水平

**目标**:数据治理、超参调优、双轨评估(专项 + 通用)。

- 掌握数据分桶、平衡、去重的完整流程
- 能做学习率 / rank / epoch 的消融对比
- 会检测灾难性遗忘并止损

**验收标准**:

- [ ] 数据清洗前后各训一版,量化数据质量对分数的贡献
- [ ] 完成一次"专项分数 vs 通用分数"的双轨对比,并给出权衡结论
- [ ] 复现一次过拟合,并成功用 early stop / 降 LR 救回

### 阶段三:能决策(第 5-6 周)——Senior 水平

**目标**:方案选型(SFT vs DPO vs RLHF)、成本建模、上生产。

- 掌握 DPO 成对数据的构造与训练
- 能对"微调 vs RAG vs 提示工程"给出成本-收益模型
- 能把微调模型接入服务并做灰度回归

**验收标准**:

- [ ] 为同一任务分别准备 SFT 与 DPO 数据,对比两种方案的输出差异
- [ ] 写一份"该不该微调"的决策文档(含基线数据、成本估算、风险清单)
- [ ] 微调模型上线前完成专项 + 通用 + 安全三条回归,记录对比表

## 分步实操:一次完整的 LoRA 微调

```
第 1 步 确认该微调        ← 决策树 + 基线已打满
   ↓
第 2 步 准备数据(500-2k 条)
   ↓
第 3 步 清洗与格式化(去重/平衡/模板化)
   ↓
第 4 步 切留出集(90/10,分层抽样)
   ↓
第 5 步 配置 QLoRA 训练(学习率/rank/epoch)
   ↓
第 6 步 训练 + 盯 loss
   ↓
第 7 步 双轨评估(专项 + 通用)
   ↓
第 8 步 决策:合并适配器上生产 / 回炉 / 放弃
```

### 第 1 步:确认该微调

跑决策树;如果走到"风格/格式"或"偏好"分支,继续;否则停。

### 第 2-3 步:数据准备与清洗

- 收集真实样本,宁缺毋滥
- 去重(embedding 相似度或哈希)、按标签平衡、统一模板
- 人工抽检 10%,确保格式与标注一致性

### 第 4 步:留出集

- 按主题分层抽 10%,**训练前就隔离**,不与训练集交叉

### 第 5-6 步:训练

- 起点建议:LoRA rank=16, lr=2e-4, epochs=3, 7B 模型
- 每步记录 loss;loss 震荡/不降 → 降 LR 或查数据

### 第 7-8 步:评估与决策

- 专项留出集 + 3 个通用任务双轨对比
- 专项升、通用不降 → 成功;专项升、通用大跌 → 权衡或回炉
- 收益 < 3-5% 且成本高 → 考虑放弃,回到 prompt

## 示例

### 示例 1:LoRA 微调最小闭环(HuggingFace TRL)

```python
# 依赖: pip install transformers datasets peft trl bitsandbytes
from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model
from trl import SFTTrainer, SFTConfig

# 1. 加载 4bit 量化的 7B 基座(QLoRA)
bnb = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4")
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3.1-8B-Instruct",
    quantization_config=bnb, device_map="auto",
)
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.1-8B-Instruct")
tokenizer.pad_token = tokenizer.eos_token

# 2. 挂 LoRA 适配器
lora = LoraConfig(r=16, lora_alpha=32, target_modules=["q_proj", "v_proj"], lora_dropout=0.05, task_type="CAUSAL_LM")
model = get_peft_model(model, lora)

# 3. 训练数据: [{instruction, output}] 格式的 jsonl
train = load_dataset("json", data_files="train.jsonl", split="train")
eval_ds = load_dataset("json", data_files="eval.jsonl", split="train")

cfg = SFTConfig(
    output_dir="./lora-out", max_seq_length=1024,
    per_device_train_batch_size=4, per_device_eval_batch_size=4,
    learning_rate=2e-4, num_train_epochs=3, logging_steps=10,
    evaluation_strategy="steps", eval_steps=100,
)
trainer = SFTTrainer(model=model, args=cfg, train_dataset=train, eval_dataset=eval_ds, tokenizer=tokenizer)
trainer.train()

# 4. 保存适配器(不合并,保持可插拔)
trainer.model.save_pretrained("./lora-adapter")
print("训练完成:适配器在 ./lora-adapter")
```

**要点**:QLoRA 让单卡(24G)也能训 8B;适配器只有几十 MB,可版本化、可回滚、可叠加。

### 示例 2:微调前后双轨评估

```python
import json
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1")  # vLLM 部署的微调模型

TASKS = {
    "专项-质检打分": EVAL_QA,       # 你的留出集
    "通用-简单数学": MATH_SAMPLES,  # "17+25=?"
    "通用-常识问答": COMMONSENSE,   # "水在多少度沸腾?"
}

def evaluate(model_endpoint, name, samples):
    correct = 0
    for s in samples:
        r = client.chat.completions.create(
            model=model_endpoint,
            messages=[{"role": "user", "content": s["q"]}],
            temperature=0,
        )
        if judge(r.choices[0].message.content, s["gold"]):
            correct += 1
    acc = correct / len(samples)
    print(f"{name}: {acc:.1%}")
    return acc

print("=== 基线(微调前) ===")
for name, samples in TASKS.items():
    evaluate("base-model", name, samples)

print("=== 微调后 ===")
for name, samples in TASKS.items():
    evaluate("lora-merged", name, samples)
```

**要点**:专项分看收益,通用分看"忘没忘"。两个数都记录,缺一个都不是完整评估。

### 示例 3:DPO 成对数据示例

```json
[
  {
    "prompt": "用户:这个订单什么时候到?客服:我查一下,请稍等。",
    "chosen": "您好,您的订单预计明天下午送达,单号 SF123456,可点链接实时追踪:https://...",
    "rejected": "明天到。"
  },
  {
    "prompt": "用户:你们怎么这么慢,我要投诉!客服:非常抱歉给您带来不便。",
    "chosen": "非常理解您的心情。您的订单因天气原因延误,我已为您申请运费减免,预计后天送达。",
    "rejected": "天气原因,没办法,耐心等吧。"
  }
]
```

**要点**:chosen/rejected 必须同一 prompt、只差"偏好"维度;数据来自真实案例或人工构造都可以,但成对差异要明显。

## 练习

产出请放入 `personal/` 留档。

### 基础练习(阶段一对应)

- [ ] **P1-1 决策树实战**:列出你工作中的 3 个"想用微调解决"的问题,逐个跑决策树,书面给出"该不该微调 / 该走哪条路"的结论与理由
- [ ] **P1-2 最小微调**:用 QLoRA 微调一个小模型(7B 以下),完成训练 + 留出集对比,记录训练时长与显存占用
- [ ] **P1-3 数据清洗**:取 500 条原始对话,做去重 + 格式统一 + 抽检,记录清洗前后样本数与质量变化

### 进阶练习(阶段二对应)

- [ ] **P2-1 超参消融**:固定其他变量,分别试 lr ∈ {1e-4, 2e-4, 5e-4},记录三组专项分,给出结论
- [ ] **P2-2 双轨评估**:训练一版后,在专项留出集 + ≥3 个通用任务上做对比,写一份"收益 vs 遗忘"权衡报告
- [ ] **P2-3 过拟合演练**:故意用数据重复的训练集训一版,复现过拟合,再用 early stop / 降 LR 救回

### 挑战练习(阶段三对应)

- [ ] **P3-1 DPO 对比**:为同一任务构造 200 对 chosen/rejected,训一版 DPO,与 SFT 版对比行为差异
- [ ] **P3-2 成本模型**:写一份决策文档:微调(算 GPU 时长/人力/数据成本)vs 长期调用 API,给出盈亏平衡点
- [ ] **P3-3 灰度回归**:把微调模型用 vLLM 部署,设计并执行"专项 + 通用 + 安全"三回归,输出上线决策报告

## 自测题

1. 一个"模型答不出私有文档问题"的场景,决策树会让你走哪条路?为什么?
2. SFT 和 DPO 的数据差异是什么?
3. LoRA 为什么不改原权重?rank 大小与什么相关?
4. 为什么 1k 条高质量 > 100k 条低质量?
5. 灾难性遗忘怎么检测?两个缓解手段?
6. 训练集 loss 很低但留出集分数没涨,最可能的原因是什么?
7. 微调后的模型幻觉反而加重,说明什么?

<details>
<summary>答案</summary>

1. RAG 注入知识。微调学"说话方式"不学"知识",知识缺失靠检索
2. SFT 需要"输入→期望输出"对;DPO 需要"同一 prompt 的 chosen/rejected 成对偏好"
3. LoRA 学低秩增量 ΔW=A×B,推理时 W'=W+αAB,原权重冻结。rank 越大表达力越强,但过大会过拟合,一般 8-64
4. 微调从样本分布学习,脏/重复样本会被"学到";且低质量数据的噪声会淹没少数好样本的信号
5. 训练前后在通用 benchmark(数学/推理/常识)上对比。缓解:降学习率、加通用数据、提前 early stop
6. 过拟合(或数据泄漏):模型背了训练集,学到的模式没泛化。检查去重、留出集隔离、epoch 数
7. 训练数据里可能含错误信息,或任务本身需要知识而模型在"编"——停下来,回到 RAG 路线,别加大微调力度
</details>

## 常见错误与反模式

- ❌ **为了让模型学新知识而微调**——效果差且幻觉加剧,知识该走 RAG
- ❌ **prompt 没打满就微调**——基线都没量化,微调收益无从判断
- ❌ **数据没清洗就训练**——脏数据、重复样本直接学进权重
- ❌ **全参微调小数据集**——过拟合 + 烧钱 + 忘掉通用能力
- ❌ **只盯训练 loss 不看留出集**——loss 下降 ≠ 任务变好
- ❌ **只测专项不测通用**——专项升、通用崩,上线就翻车
- ❌ **微调成本不算账**——GPU 时长 + 人力比直接调 API 贵时,别逞强
- ❌ **训练集与评估集同源**——分数虚高,上线打脸
- ❌ **一次改多个超参**——不知道是哪个变量起了作用

## 参考资源

- [LoRA (Hu et al., 2021)](https://arxiv.org/abs/2106.09685) — 论文,低秩适配原始方法
- [QLoRA (Dettmers et al., 2023)](https://arxiv.org/abs/2305.14314) — 论文,4bit 量化微调
- [DPO (Rafailov et al., 2023)](https://arxiv.org/abs/2305.18290) — 论文,直接偏好优化
- [Hugging Face PEFT](https://github.com/huggingface/peft) — 工具,LoRA/QLoRA 实现
- [Hugging Face TRL](https://github.com/huggingface/trl) — 工具,SFT/DPO 训练器
- [Axolotl](https://github.com/OpenAccess-AI-Collective/axolotl) — 工具,全流程微调框架
- [OpenAI 微调指南](https://platform.openai.com/docs/guides/fine-tuning) — 官方文档,数据准备与超参建议