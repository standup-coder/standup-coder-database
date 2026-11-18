---
id: data-analyst
type: role
title: Data Analyst
nameZh: 数据分析师
domain: data
level: mid
tags: data, sql, bi, analytics, visualization
catalogSource: internal
catalogFile: roles/data-analyst.json
catalogAddedAt: 2026-07-29
experience: 1-4 years
education: 统计/数学/经济/CS 或相关
responsibilities: 用 SQL 从数仓提取并清洗数据 | 搭建与维护 BI 看板和业务报表 | 用漏斗/同期群等方法回答业务问题 | 设计并解读 A/B 实验 | 把分析结论转化为可执行的业务建议
mainSkills: data-quality-management
atomicSkills: database-query, sql-optimization, analytics, funnel-analysis, cohort-analysis, data-quality, parse-json-log, read-file
relatedRoles: data-scientist, data-engineer, product-manager
---

# 数据分析师

> 用数据回答业务问题：从取数、清洗到看板与实验解读，是业务决策的"事实提供方"。与数据科学家的分工是"解释过去、监控现在"，而非"预测未来、构建模型"。

## 职责

- 用 SQL 从数据仓库提取、清洗、聚合数据，保证口径一致
- 搭建与维护 BI 看板（Tableau/Power BI/Looker）与例行业务报表
- 用漏斗、同期群、留存等分析框架回答"为什么涨/为什么跌"
- 设计并解读 A/B 实验，把统计结论翻译成业务语言
- 与产品/运营协作，把分析结论转化为可执行建议并跟踪落地效果

## 核心能力(主 Skills)

- [data-quality-management](../data/data-quality-management.md) — 口径治理与数据可信度是分析结论的前提

## 基础操作(原子 Skills)

- [database-query](../data/database-query.md) — SQL 是本岗位第一技能（所有 JD 的共同硬要求）
- [sql-optimization](../data/sql-optimization.md) — 大表查询与看板性能
- [analytics](../data/analytics.md) — 指标体系与埋点消费
- [funnel-analysis](../data/funnel-analysis.md) — 转化诊断
- [cohort-analysis](../data/cohort-analysis.md) — 留存与用户分群
- [data-quality](../data/data-quality.md) — 数据校验与异常发现
- [parse-json-log](../data/parse-json-log.md) — 半结构化数据处理
- [read-file](../productivity/read-file.md)

## 与数据科学家的分工（365DataScience/Indeed 市场共识）

| 维度 | 数据分析师 | [数据科学家](./data-scientist.md) |
|---|---|---|
| 核心问题 | 发生了什么、为什么 | 将会发生什么、如何自动化决策 |
| 主要产出 | 看板、报表、分析报告、实验解读 | 模型、算法、预测服务 |
| 技能重心 | SQL、BI 工具、统计描述、业务理解 | Python/R、机器学习、统计推断、工程化 |
| 招聘量 | 更大（几乎所有行业都需要） | 相对少而深 |

## 经验门槛

| 维度 | 要求 |
|------|------|
| 经验 | 1-4 年；应届可入（本岗位是数据职业的主流入口） |
| 学历 | 统计/数学/经济/CS 或相关；转行者以项目集证明能力 |
| 核心技术 | SQL（硬门槛）、Excel、至少一个 BI 工具（Tableau/Power BI/Looker）、统计基础（假设检验/置信区间） |
| 加分项 | Python（pandas）、A/B 实验经验、dbt/数仓建模认知、行业业务知识 |

## 学习路径

### 入门 → Mid（本 role）
- SQL 练到肌肉记忆：窗口函数、多表 join、CTE 是面试与日常的分水岭
- 掌握一个 BI 工具并做出 3 个可讲故事的看板（含指标口径文档）
- 用 [funnel-analysis](../data/funnel-analysis.md) 与 [cohort-analysis](../data/cohort-analysis.md) 各完成一次真实业务诊断

### Mid → Senior Analyst / 转型
- 纵深：实验设计与因果推断（→ [experiment-design](../data/experiment-design.md)、[causal-inference](../data/causal-inference.md)），从"报数"升级到"归因"
- 转 [data-scientist](./data-scientist.md)：补 Python 建模主线（statistical-modeling → feature-engineering → model-evaluation）
- 转 [data-engineer](./data-engineer.md)：补管道与数仓（data-pipeline-build → warehouse-design）

## 相关角色

- [data-scientist](./data-scientist.md) — 建模纵深方向
- [data-engineer](./data-engineer.md) — 数据基建方向
- [product-manager](./product-manager.md) — 最紧密的需求方

## 参考资源

- [365DataScience — Data Analyst vs Data Scientist](https://365datascience.com/career-advice/data-analyst-vs-data-scientist-skills-education-job-requirements/) — article
- [roadmap.sh — SQL](https://roadmap.sh/sql) — doc
- [Google Data Analytics Certificate（岗位技能面基准）](https://www.coursera.org/professional-certificates/google-data-analytics) — doc
