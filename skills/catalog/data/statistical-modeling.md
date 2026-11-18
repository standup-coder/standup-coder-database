---
id: statistical-modeling
type: atomic-skill
title: Statistical Modeling
nameZh: 统计建模
domain: data
tags: data, statistics, regression, glm, inference
catalogSource: internal
catalogFile: atomic-skills/statistical-modeling.json
catalogAddedAt: 2026-07-29
operation: data
level: mid
---

# 统计建模
> 用回归/GLM 等可解释模型回答"变量之间什么关系、有多确定"，并守住模型假设与过拟合两条底线。
## 操作语义
- 类型: data
## 何时使用
- 业务方要的是"解释"（哪些因素影响流失、影响多大）而非纯预测分数
- 样本量中小（几百到几十万行），黑盒模型的增益撑不起可解释性损失
- 需要置信区间与显著性结论支撑决策汇报
## 何时不使用
- 只关心预测精度且特征间高度非线性——梯度提升树/深度模型通常更强
- 数据是观测性的却想下因果结论——回归系数≠因果效应，去看 [causal-inference](./causal-inference.md)
## 输入参数
- `question` (string, **必填**) — 业务问题（解释型/预测型）
- `dataProfile` (object, **必填**) — 因变量类型、样本量、特征结构
## 输出
- `modelSpec` (string) — 模型选择（OLS/logistic/Poisson/混合效应等）与理由
- `diagnostics` (object) — 假设检验结果与修正措施
- `interpretation` (string) — 系数的业务语言解读（含不确定性）
## 核心要点

先分清目标是解释还是预测（Breiman 的"两种文化"）：解释型建模关心系数的无偏与置信区间，预测型只关心泛化误差——两者的模型选择、验证方法、甚至"什么算好模型"都不同，混着做是最常见的错误根源。

## 关键要点

- 按因变量选 GLM 家族：连续→线性回归、二分类→logistic、计数→Poisson/负二项（过度离散时）、比率→Beta；强行用 OLS 拟合非连续因变量会系统性偏差
- 线性回归四大假设按危害排序：独立性（违反最致命，时序/分组数据用混合效应或聚类稳健标准误）> 线性 > 同方差 > 正态（大样本下最不重要）
- 多重共线性只伤系数解释不伤预测：VIF>10 时系数不可信，但预测值仍然可用——处理与否取决于建模目标
- 正则化（Ridge/Lasso）是预测型工具：它以引入偏差换方差，用它之后系数不再适合做解释
- p 值≠效应大小：大样本下万物显著，必须同时报告效应量与置信区间；p=0.049 与 p=0.051 没有本质区别
- 模型比较用场景匹配的指标：解释型看调整 R²/AIC/BIC + 残差诊断，预测型只看留出集误差
## 最佳实践

- 建模前先画图：因变量分布、关键散点、缺失模式——很多规范错误一张图就能避免
- 系数解读写成业务句子（"客单价每涨 10 元，流失几率比上升 3%±1%"），并注明"相关而非因果"
- 用稳健标准误（HC/聚类）作为默认，异方差与组内相关很少能完全排除
- 报告里保留建模决策记录：为什么选这个分布、删了哪些异常点、试过什么没用

## 反模式

- ❌ 逐步回归（stepwise）自动选变量后直接解读 p 值——多重检验让显著性全部失真
- ❌ 把 Lasso 压缩后的系数当"重要性排名"讲给业务听
- ❌ R² 崇拜：为提高 R² 无脑加变量，模型解释力"好看"但泛化崩坏
- ❌ 对观测数据的回归系数用"提升/导致"等因果动词

## 分级掌握

- **Junior**: 能跑通线性/logistic 回归并正确解读系数与置信区间
- **Mid**: 能按数据特征选 GLM、做残差诊断与稳健修正，分清解释与预测两种目标
- **Senior**: 能处理分层/时序结构（混合效应、GEE），主导建模方案评审并向业务翻译不确定性

## 参考资源

- 《An Introduction to Statistical Learning》(James et al., 免费 PDF) — book
- [Breiman — Statistical Modeling: The Two Cultures (2001)](https://projecteuclid.org/journals/statistical-science/volume-16/issue-3/Statistical-Modeling--The-Two-Cultures-with-comments-and-a/10.1214/ss/1009213726.full) — paper
- [statsmodels 官方文档](https://www.statsmodels.org/stable/index.html) — doc
- 《Regression and Other Stories》(Gelman, Hill & Vehtari) — book

## 相关 Skills

- [causal-inference](./causal-inference.md) — 想下因果结论时的正确工具
- [feature-engineering](./feature-engineering.md)
- [model-evaluation](./model-evaluation.md) — 预测型目标的验证方法
