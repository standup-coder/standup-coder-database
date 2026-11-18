---
id: interaction-design
type: atomic-skill
title: Interaction Design
nameZh: 交互设计
domain: design
tags: design, interaction, ux, motion, flow
catalogSource: internal
catalogFile: atomic-skills/interaction-design.json
catalogAddedAt: 2026-07-26
operation: design
level: mid
---

# 交互设计
> 产品体验中的交互流程 / 微交互 / 动效 / 反馈设计。
## 操作语义
- 类型: design
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `scenario` (string, **必填**)
- `goal` (string, 可选)
- `constraints` (array, 可选)
## 输出
- `flowDiagram` (string, 可选)
- `prototype` (string, 可选)
- `motionSpec` (object, 可选)
## 核心要点

交互不是把页面连起来，是定义"系统对用户行为的回应"；好的交互让用户不需要思考下一步。

## 关键要点

- 每个动作都有反馈（视觉 / 听觉 / 触觉）
- 动效是因果不是装饰（200-300ms）
- edge case 优先于 happy path
- 减少决策点 > 增加引导
- 可逆性 > 二次确认

## 最佳实践

- flow 先 happy path 再 error / empty / loading
- Lottie / Rive 做复杂动效
- usability test 5 人足够
- 原型保真度按阶段升级（low → mid → high）

## 反模式

- ❌ 动效炫技拖慢操作
- ❌ 错误信息不可恢复
- ❌ 同一动作多入口结果不一致
- ❌ 只做 happy path 上线

## 分级掌握

- **Junior**: 能画基础流程图
- **Mid**: 能完整覆盖状态 + 动效 spec
- **Senior**: 能驱动产品交互范式与跨端一致性

## 参考资源

- [About Face](https://www.cooper.com/journal/2014/8/about-face-the-essentials-of-interaction-design) — book
- [Material Motion](https://m3.material.io/styles/motion/overview) — doc
- [NN/g Articles](https://www.nngroup.com/articles/) — article

## 相关 Skills
_见所属 composite skill 或 role_