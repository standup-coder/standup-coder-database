---
id: experiment-design
type: atomic-skill
title: Experiment Design (A/B Testing)
nameZh: 实验设计与 A/B 测试
domain: data
tags: data, ab-testing, experimentation, sample-size, hypothesis-testing
catalogSource: internal
catalogFile: atomic-skills/experiment-design.json
catalogAddedAt: 2026-07-29
operation: data
level: mid
---

# 实验设计与 A/B 测试
> 设计可信的在线对照实验：算对样本量、选对随机化单元、避开偷看/多重检验/网络效应等系统性陷阱。
## 操作语义
- 类型: data
## 何时使用
- 产品改动上线前需要量化因果影响（转化率/留存/收入）
- 多个方案争执不下，需要数据而非嗓门决策
- 算法/模型迭代需要在线验证离线指标的真实增益
## 何时不使用
- 样本量根本不够（低流量 × 小效应 = 实验永远跑不出结论）——改用前后对比 + [causal-inference](./causal-inference.md) 方法
- 干预有强网络效应（社交/市场双边）且无法切换随机化单元——个体随机化的结论是错的
- 伦理或战略性不可逆决策（品牌重塑）——不是所有问题都该 A/B
## 输入参数
- `hypothesis` (string, **必填**) — 假设（改动 X 会使指标 Y 变化 Z%）
- `metrics` (object, **必填**) — 核心指标 + 护栏指标
- `traffic` (number, 可选) — 可用流量规模
## 输出
- `design` (object) — 随机化单元、分组比例、样本量、实验时长
- `analysisPlan` (string) — 统计方法、多重检验校正、提前终止规则
- `readout` (string) — 结论模板（效应量 + 置信区间 + 决策建议）
## 核心要点

实验的可信度在开跑前就决定了：样本量计算、随机化单元、指标与分析计划必须事先写死（pre-registration 思想）。跑起来再改规则的实验，p 值只是装饰品。

## 关键要点

- 样本量四要素：基线率、最小可检测效应（MDE）、显著性水平 α（惯例 0.05）、功效 1-β（惯例 0.8）——MDE 定得过于乐观是"实验没结论"的第一原因
- 随机化单元 ≥ 分析单元：按用户随机化就按用户分析；按页面浏览随机化但按用户分析会低估方差、假阳性膨胀
- 偷看问题（peeking）：每天看一次 p<0.05 就停，实际假阳性率可达 30%+；解法是固定时长或用序贯检验（mSPRT/always-valid p-values）
- 多重检验：同时看 20 个指标，纯靠运气也会有 1 个显著——核心指标唯一化，探索性指标用 Bonferroni/BH 校正
- 常见效应陷阱：新奇效应（前几天虚高，至少跑 1-2 个完整业务周期）、辛普森悖论（分流量渠道看方向可能反转）、SRM（分组样本比例失衡说明分流有 bug，结论直接作废）
- 结论表述用效应量 + 置信区间，"不显著"≠"无效应"——可能只是功效不足
## 最佳实践

- 实验前写一页实验文档：假设、指标、样本量、时长、终止规则、决策矩阵（显著正/负/不显著各怎么办）
- 上线前跑 A/A 实验校验分流系统与统计管道（应有 ~5% 假阳性率）
- 每次 readout 先查 SRM（卡方检验分组比例），再看指标
- 护栏指标（延迟/崩溃率/退订）与核心指标同权重对待，赢了转化输了体验不算赢

## 反模式

- ❌ 跑到显著就停（optional stopping），不显著就"再跑一周试试"
- ❌ 实验中途改流量分配比例，引入时间混杂
- ❌ 对着 20 个细分维度切片找"显著的那一组"来讲故事（p-hacking）
- ❌ 拿实验期间指标直接外推年化收益（新奇效应 + 季节性都没扣）

## 分级掌握

- **Junior**: 能算样本量、跑标准两组实验并正确解读置信区间
- **Mid**: 能识别 SRM/偷看/多重检验问题，设计含护栏指标的完整实验方案
- **Senior**: 能搭建实验平台规范（序贯检验/方差缩减 CUPED），处理网络效应与切换随机化单元

## 参考资源

- 《Trustworthy Online Controlled Experiments》(Kohavi, Tang & Xu) — book
- [Evan Miller — How Not To Run an A/B Test](https://www.evanmiller.org/how-not-to-run-an-ab-test.html) — article
- [Microsoft ExP 平台论文与博客](https://exp-platform.com/) — doc
- [Spotify Engineering — Choosing a Sequential Testing Framework](https://engineering.atspotify.com/2023/03/choosing-sequential-testing-framework-comparisons-and-discussions/) — article

## 相关 Skills

- [causal-inference](./causal-inference.md) — 不能做实验时的替代方案
- [funnel-analysis](./funnel-analysis.md) — 实验指标常来自漏斗
- [analytics](./analytics.md)
