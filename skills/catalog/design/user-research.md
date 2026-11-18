---
id: user-research
type: atomic-skill
title: User Research
nameZh: 用户研究
domain: design
tags: ux, research, user, discovery, insight
catalogSource: internal
catalogFile: atomic-skills/user-research.json
catalogAddedAt: 2026-07-26
operation: design
level: mid
---

# 用户研究
> 设计与执行用户访谈 / 问卷 / 可用性测试，沉淀为可行动洞察与设计输入。
## 操作语义
- 类型: design
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `method` (any, **必填**) 取值: interview/survey/usability-test/diary-study/card-sorting
- `objective` (string, **必填**) — 研究目标与决策场景
- `sampleSize` (number, 可选) 默认: `8`
- `personas` (array, 可选)
## 输出
- `insights` (array, 可选)
- `recommendations` (array, 可选)
- `evidence` (array, 可选)
- `report` (string, 可选)
## 核心要点

用户研究的价值不在数据多寡，而在能不能驱动一个真实的产品决策。

## 关键要点

- 先定决策场景，再选方法
- 定性挖洞察，定量验规模
- 8 人访谈可发现 80% 可用性问题
- 区分用户说的 vs 用户做的
- 研究输出必须有 next action

## 最佳实践

- 每轮研究都有 hypothesis 与 kill criteria
- 原始素材（录音 / 笔记）归档可回放
- 与 PM/设计 共听访谈，避免转述失真
- JTBD 框架捕捉动机

## 反模式

- ❌ 做完研究只产出"用户喜欢…"
- ❌ 问引导性问题
- ❌ 把 NPS 当唯一指标
- ❌ 小样本就推全局结论

## 分级掌握

- **Junior**: 能执行访谈与可用性测试
- **Mid**: 能选方法、控偏差、写洞察报告
- **Senior**: 能搭研究体系、与产品决策闭环

## 参考资源

- [NN/g UX Research Methods](https://www.nngroup.com/articles/which-ux-research-methods/) — article
- [JTBD framework](https://jtbd.info/) — doc

## 相关 Skills
_见所属 composite skill 或 role_