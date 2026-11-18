---
id: causal-inference
type: atomic-skill
title: Causal Inference
nameZh: 因果推断
domain: data
tags: data, causal-inference, did, psm, instrumental-variables, confounding
catalogSource: internal
catalogFile: atomic-skills/causal-inference.json
catalogAddedAt: 2026-07-29
operation: data
level: senior
---

# 因果推断
> 在不能做随机实验时，用 DID/PSM/IV/断点回归等方法从观测数据中估计因果效应，并诚实交代每个方法背后的假设。
## 操作语义
- 类型: data
## 何时使用
- 干预已经发生且无法重来（政策上线/价格调整/功能全量），要回答"它带来了多少"
- A/B 不可行：伦理限制、流量不够、网络效应、不可逆决策
- 预测模型给出高相关特征，业务想知道"动这个特征有没有用"
## 何时不使用
- 能做随机实验就做实验（[experiment-design](./experiment-design.md)）——任何观测方法的假设都比随机化脆弱
- 只需要预测不需要干预决策——预测模型不需要因果正确也能预测得准
## 输入参数
- `treatment` (string, **必填**) — 干预及其发生机制（谁、为何、何时被处理）
- `data` (object, **必填**) — 面板/截面结构、可观测协变量
## 输出
- `identificationStrategy` (string) — 识别策略选择（DID/PSM/IV/RDD）与关键假设
- `estimate` (object) — 效应估计 + 置信区间
- `robustness` (string) — 稳健性检验（安慰剂/平行趋势/敏感性分析）结果
## 核心要点

因果推断的核心是识别策略而不是估计技术：先回答"凭什么这个对比能当因果"（依赖什么不可检验的假设），再谈用什么模型算。回归控制变量 ≠ 因果识别——没测到的混杂（unobserved confounding）不会因为你多加了 100 个特征而消失。

## 关键要点

- 混杂结构决定方法：能观测全部混杂 → 匹配/PSM/回归调整；有平行趋势的前后对照 → DID；有外生冲击 → IV；有清晰的资格阈值 → 断点回归（RDD）
- DID 的命门是平行趋势假设：处理组与对照组在干预前的趋势必须平行——画出干预前多期趋势图是最低要求，事件研究图（event study）是标准做法
- PSM 只解决"可观测"混杂：匹配后要检查协变量平衡（SMD<0.1），并用敏感性分析（Rosenbaum bounds/E-value）量化"要多强的未观测混杂才能推翻结论"
- IV 的两个条件一强一弱都致命：相关性可检验（第一阶段 F>10），排他性不可检验只能论证——弱工具变量的估计比不用还糟
- RDD 是观测方法里内部效度最高的：阈值附近近似随机；代价是结论只适用于阈值附近人群（局部效应）
- 对撞偏差（collider bias）：控制变量不是越多越好，控制了处理和结果共同影响的变量反而引入新偏差——画 DAG 再决定控制什么
## 最佳实践

- 每个分析先画因果图（DAG）明确假设，再据此选择控制/不控制哪些变量
- 标配安慰剂检验：假装干预发生在更早时点/给未处理组，如果也"显著"说明识别策略有问题
- 报告写清楚：识别假设、假设不成立时结论怎么歪、效应适用于哪个人群（ATE/ATT/LATE）
- 多方法交叉验证：DID 与 PSM-DID 结论一致时可信度显著提升

## 反模式

- ❌ "回归里控制了很多变量所以是因果"——遗漏变量偏差从来不因变量多而消失
- ❌ DID 不查平行趋势直接报效应
- ❌ 把预测模型的特征重要性（SHAP）当因果效应指导业务干预
- ❌ 事后找一个"看起来外生"的工具变量，不做弱工具与排他性论证

## 分级掌握

- **Junior**: 能解释混杂/对撞概念，读懂 DID 与匹配分析报告
- **Mid**: 能独立实施 DID/PSM 并完成平行趋势与平衡性检验
- **Senior**: 能设计识别策略组合（IV/RDD/合成控制），主持因果分析评审并量化假设敏感性

## 参考资源

- 《Causal Inference: The Mixtape》(Scott Cunningham, 免费在线) — book https://mixtape.scunning.com/
- 《The Effect》(Nick Huntington-Klein, 免费在线) — book https://theeffectbook.net/
- 《Mostly Harmless Econometrics》(Angrist & Pischke) — book
- [Microsoft — DoWhy/EconML 因果推断库](https://github.com/py-why/dowhy) — doc

## 相关 Skills

- [experiment-design](./experiment-design.md) — 能随机化时的第一选择
- [statistical-modeling](./statistical-modeling.md) — 估计工具的基础
- [analytics](./analytics.md)
