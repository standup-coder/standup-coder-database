---
id: model-evaluation
type: atomic-skill
title: Model Evaluation
nameZh: 模型离线评估
domain: data
tags: data, model-evaluation, metrics, cross-validation, calibration
catalogSource: internal
catalogFile: atomic-skills/model-evaluation.json
catalogAddedAt: 2026-07-29
operation: data
level: mid
---

# 模型离线评估
> 用正确的指标、正确的数据切分和诚实的基线评估模型：让离线数字尽可能预示线上表现。
## 操作语义
- 类型: data
## 何时使用
- 模型上线前需要可信的离线验证与模型间比较
- 离线指标与线上业务指标持续背离，需要重审评估体系
- 评审他人模型时判断"这个 AUC 可信吗"
## 何时不使用
- 需要因果结论（模型带来多少增量收入）——离线评估回答不了，要上线实验（[experiment-design](./experiment-design.md)）
## 输入参数
- `task` (string, **必填**) — 任务类型（分类/回归/排序）与业务目标
- `dataStructure` (string, **必填**) — 数据的时间/分组结构
- `classBalance` (number, 可选) — 正例比例
## 输出
- `metricChoice` (object) — 主指标 + 辅助指标与选择理由
- `splitStrategy` (string) — 切分方案（时间/分组/分层）
- `verdict` (string) — 与基线对比的结论及置信度
## 核心要点

评估的两大失败模式：指标选错（不平衡数据看 accuracy）和切分方式与部署场景不符（时序数据用随机切分）。切分方式必须模拟真实部署：模型将来用过去预测未来，评估就必须按时间切。

## 关键要点

- 不平衡分类看 PR 曲线不看 ROC：正例 1% 时 AUC-ROC 0.9 可能毫无用处（大量假阳性被海量真阴性稀释），PR-AUC 与 precision@k 更贴近业务体感
- 阈值指标（precision/recall/F1）依赖切点选择，报告时必须说明阈值怎么定的；排序场景直接用排序指标（NDCG/MAP/recall@k）
- 数据有分组就用 GroupKFold：同一用户的样本分散在训练与测试集里，等于考试前看过答案（组泄漏）
- 概率要做校准检查：AUC 只管排序不管概率数值，用概率做决策（定价/风控额度）前先看校准曲线/Brier score，必要时 Platt/isotonic 校准
- 没有基线的评估无意义：先立"多数类/均值/当前规则/上一版模型"四种基线，新模型赢不了简单基线是常态而非意外
- 离线-线上鸿沟的三大来源：训练服务偏斜、数据漂移、反馈环（模型自己影响了未来数据分布）——离线提升 <2% 时大概率在线上测不出来
## 最佳实践

- 一次评估三份数据：训练（拟合）、验证（调参/选模型）、测试（只在最终报告用一次）——测试集被反复用来选模型就失效了
- 报告置信区间：小测试集上 0.81 vs 0.79 的差异很可能是噪声，用 bootstrap 或跨折方差量化
- 按关键切片分别评估（新老用户/地区/设备），整体指标好但关键切片崩的模型不能上线
- 评估代码与指标定义进版本库，跟模型一起评审

## 反模式

- ❌ 不平衡数据报 accuracy（99% 负例时全预测负例就有 99% 准确率）
- ❌ 时序数据随机切分，模型"用未来预测过去"刷高指标
- ❌ 在测试集上反复调参，测试集实质变成第二个验证集
- ❌ 只报一个总指标，不看切片、不看校准、不比基线

## 分级掌握

- **Junior**: 能为分类/回归任务选对指标并正确实施交叉验证
- **Mid**: 能设计时间/分组切分方案，做校准与切片分析，识别评估泄漏
- **Senior**: 能设计离线-在线指标映射体系，制定团队模型准入评估标准

## 参考资源

- [scikit-learn — Model evaluation 官方指南](https://scikit-learn.org/stable/modules/model_evaluation.html) — doc
- [scikit-learn — Cross-validation 与常见陷阱](https://scikit-learn.org/stable/modules/cross_validation.html) — doc
- 《Designing Machine Learning Systems》(Chip Huyen) Ch.6 — book
- [Google — ML Test Score 论文](https://research.google/pubs/the-ml-test-score-a-rubric-for-ml-production-readiness-and-technical-debt-reduction/) — paper

## 相关 Skills

- [feature-engineering](./feature-engineering.md) — 泄漏审计的另一半
- [experiment-design](./experiment-design.md) — 离线过关后的在线验证
- [llm-evaluation](../ai-ml/llm-evaluation.md) — 生成式模型的评估分支
