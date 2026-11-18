---
id: prototype
type: atomic-skill
title: Prototype
nameZh: 原型设计
domain: design
tags: design, prototype, figma, usability, validation
catalogSource: internal
catalogFile: atomic-skills/prototype.json
catalogAddedAt: 2026-07-26
operation: design
level: mid
---

# 原型设计
> 在投入工程实现前，用不同保真度原型验证创意。
## 操作语义
- 类型: design
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `idea` (string, **必填**)
- `fidelity` (string, 可选) 取值: paper/low/mid/high
- `audience` (string, 可选)
## 输出
- `artifact` (string, 可选)
- `testPlan` (object, 可选)
- `decisions` (array, 可选)
## 核心要点

原型的价值是"以小成本拒绝坏想法"；选错保真度等于在错误问题上投精力。

## 关键要点

- fidelity 与决策成本匹配
- 一次只验证 1-2 个假设
- 让用户用，别让用户看
- paper > Figma > coded 渐进
- 失败原型也是产出

## 最佳实践

- 5 用户法则做 usability test
- Figma + Maze / UserTesting 做远程测试
- 记录决策日志（decided / parked / killed）
- 高保真前先低保真过一轮

## 反模式

- ❌ 一上来就高保真
- ❌ 只给 stakeholder 看不让用户用
- ❌ 原型当成最终设计
- ❌ 同一原型反复打磨不验证

## 分级掌握

- **Junior**: 能做 mid-fi Figma 原型
- **Mid**: 能选 fidelity 与跑 usability test
- **Senior**: 能驱动组织级 prototype-driven 决策文化

## 参考资源

- [IDEO Prototyping](https://www.ideo.com/journal/prototyping) — article
- [Maze](https://maze.co/) — doc
- [Sprint by Jake Knapp](https://www.thesprintbook.com/) — book

## 相关 Skills
_见所属 composite skill 或 role_