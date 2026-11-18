---
id: chaos-engineering
type: atomic-skill
title: Chaos Engineering
nameZh: 混沌工程
domain: testing
tags: chaos, resilience, fault-injection, testing
catalogSource: internal
catalogFile: atomic-skills/chaos-engineering.json
catalogAddedAt: 2026-07-26
operation: testing
level: senior
---

# 混沌工程
> 通过受控故障注入实验主动发现系统薄弱环节，避免事故先于实验发生。
## 操作语义
- 类型: testing
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `system` (string, **必填**)
- `hypothesis` (string, **必填**) — 稳态假设
- `blastRadius` (string, 可选) — 影响半径
## 输出
- `experimentPlan` (object, 可选)
- `rollbackProcedure` (string, 可选)
- `findings` (array, 可选)
## 核心要点

混沌工程不是搞破坏，是用科学方法验证系统在故障下仍能保持稳态。

## 关键要点

- 四步骤：定义稳态 → 假设故障下仍稳态 → 注入故障 → 验证假设
- 从最小爆炸半径开始：dev → staging → prod 单实例 → prod 全量
- 经典实验：网络延迟/丢包、依赖宕机、CPU/Mem 打满、磁盘填满
- 需要可观测体系 + 可一键回滚作为前提
- Game Day：组织级演练，不仅测系统也测应急响应
- 重点不在 'breaking things'，在 'learning from breaking'

## 最佳实践

- 实验前写明假设、稳态指标、abort 条件
- 工作时段做 + 通知相关方，禁夜间偷袭
- 每次实验产出报告：发现/根因/修复 action item
- 把混沌实验编入 CI/CD（如 prod 每周注入轻量故障）
- 从依赖故障入手，再到自身故障，最后跨区故障

## 反模式

- ❌ 没有假设直接乱注故障，无从验证
- ❌ 无 abort 机制，影响扩散后才人工干预
- ❌ 只在 staging 做，prod 永远不知真实韧性
- ❌ 不留报告，发现的问题不进 backlog
- ❌ 把混沌当 KPI 比赛，追求注故障次数

## 分级掌握

- **Junior**: 能在 staging 用工具注入简单故障并观察
- **Mid**: 能设计带稳态假设的实验，组织 Game Day
- **Senior**: 能推动跨团队混沌工程文化与 prod 自动化注入

## 参考资源

- [Chaos Engineering (O'Reilly)](https://www.oreilly.com/library/view/chaos-engineering/9781492043850/) — book
- [Principles of Chaos](https://principlesofchaos.org/) — doc
- [Chaos Mesh](https://chaos-mesh.org/) — tool
- [Gremlin](https://www.gremlin.com/) — tool
- [Netflix Chaos Monkey](https://netflix.github.io/chaosmonkey/) — tool

## 相关 Skills
_见所属 composite skill 或 role_