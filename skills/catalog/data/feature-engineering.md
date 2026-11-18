---
id: feature-engineering
type: atomic-skill
title: Feature Engineering
nameZh: 特征工程
domain: data
tags: data, feature-engineering, leakage, encoding, ml-pipeline
catalogSource: internal
catalogFile: atomic-skills/feature-engineering.json
catalogAddedAt: 2026-07-29
operation: data
level: mid
---

# 特征工程
> 把原始数据转化为模型可用的特征：数值/类别/时间三类处理套路、target leakage 识别、训练-服务一致性保障。
## 操作语义
- 类型: data
## 何时使用
- 表格数据建模（风控/推荐/预测），特征质量决定模型上限
- 模型离线指标好、线上表现差，怀疑泄漏或训练-服务偏斜
- 特征越堆越多，需要系统性筛选与治理
## 何时不使用
- 图像/文本/语音端到端深度学习——表示学习已取代手工特征，精力放在数据质量与增强上
## 输入参数
- `rawData` (object, **必填**) — 原始字段与业务含义
- `target` (string, **必填**) — 预测目标与预测时点
- `servingContext` (string, 可选) — 线上特征获取方式与延迟约束
## 输出
- `featureSpec` (object) — 特征清单（变换逻辑、时间窗口、缺失策略）
- `leakageAudit` (string) — 泄漏检查结论
- `consistencyPlan` (string) — 训练-服务一致性方案
## 核心要点

每个特征都要过一个问题："预测时点能拿到这个值吗？"用了预测时点之后才产生的信息就是 target leakage——它让离线指标虚高到不可思议，上线后即刻现形。离线 AUC 高得反常（>0.95）第一反应应该是怀疑泄漏而不是庆祝。

## 关键要点

- 泄漏三大来源：目标泄漏（特征由标签衍生，如"是否退款"预测"是否欺诈"）、时间泄漏（用未来数据算历史特征）、预处理泄漏（在全量数据上 fit scaler/encoder 再切分训练测试）
- 类别特征编码按基数选：低基数 one-hot、高基数 target encoding（必须 out-of-fold 计算否则就是泄漏）或 embedding；树模型可直接吃序数编码
- 时间特征双通道：周期性用 sin/cos 编码（小时/星期），趋势性用距今天数；时序数据的滑窗统计（过去 7/30 天均值）是最强特征家族
- 缺失本身常是信号：先加 is_missing 指示列再填充；树模型可以原生处理缺失，线性模型必须填充
- 训练-服务偏斜（training-serving skew）：离线批处理与在线实时计算的同名特征逻辑不一致——特征平台/feature store 的核心存在理由就是同一份定义两处复用
- 特征选择的现实顺序：先删（近）零方差与高缺失率 → 再删互相关 >0.95 的冗余 → 最后用模型重要性/置换重要性裁剪；不要一上来就跑穷举搜索
## 最佳实践

- 预处理全部进 pipeline（sklearn Pipeline/Spark ML），fit 只发生在训练折内——这一条同时消灭预处理泄漏与上线不一致
- 每个特征写一行文档：业务含义、计算窗口、可用时点、负责人
- 用时间切分验证特征有效性（见 [model-evaluation](./model-evaluation.md)），随机切分会掩盖时间泄漏
- 上线后监控特征分布漂移（PSI/KS），特征坏掉往往早于指标坏掉

## 反模式

- ❌ 在 train_test_split 之前做标准化/编码/填充
- ❌ target encoding 直接在全量训练集上算均值
- ❌ 特征窗口写"最近 7 天"却在服务端实现成"自然周"，离线在线各算各的
- ❌ 一次性造几千个自动特征全喂给模型，不做泄漏审计

## 分级掌握

- **Junior**: 能完成数值/类别/时间特征的标准变换并放进 pipeline
- **Mid**: 能识别与修复三类泄漏，设计滑窗统计特征，做特征筛选
- **Senior**: 能设计 feature store 与一致性保障机制，制定团队特征治理规范

## 参考资源

- 《Feature Engineering for Machine Learning》(Zheng & Casari, O'Reilly) — book
- [scikit-learn — Common pitfalls: Data leakage](https://scikit-learn.org/stable/common_pitfalls.html#data-leakage) — doc
- 《Designing Machine Learning Systems》(Chip Huyen) Ch.5 — book
- [Google — Rules of Machine Learning](https://developers.google.com/machine-learning/guides/rules-of-ml) — doc

## 相关 Skills

- [model-evaluation](./model-evaluation.md) — 验证特征真实增益
- [data-quality](./data-quality.md) — 特征的上游防线
- [statistical-modeling](./statistical-modeling.md)
