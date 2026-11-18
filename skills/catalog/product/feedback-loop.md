---
id: feedback-loop
type: atomic-skill
title: Feedback Loop
nameZh: 反馈闭环
domain: product
tags: product, feedback, voice-of-customer, closed-loop, cs
catalogSource: internal
catalogFile: atomic-skills/feedback-loop.json
catalogAddedAt: 2026-07-26
operation: product
level: mid
---

# 反馈闭环
> 设计端到端的客户反馈闭环：采集 / 分诊 / 优先级 / 行动 / 回告。
## 操作语义
- 类型: product
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `channels` (array, **必填**)
- `slaDays` (number, 可选) 默认: `14`
## 输出
- `intakeFlow` (string, 可选)
- `prioritizationMatrix` (object, 可选)
- `closeBackTemplate` (string, 可选)
## 核心要点

没有"close back"的反馈系统是单向漏斗：用户感觉到没人听，只会沉默离开。

## 关键要点

- 多渠道汇聚到统一入口
- 量化优先级（影响 × 频率 × 客户分层）
- 与 Roadmap 双向绑定
- 行动后必须主动回告反馈方
- 区分可执行反馈 vs 只是抱怨

## 最佳实践

- 用 Productboard / Aha! / Linear 做汇聚
- 建立 weekly triage 节奏与 SLA
- 把 close-back 自动化（CRM 触发器）
- NPS 后必接 follow-up 访谈

## 反模式

- ❌ NPS 数字党，只看分数不看评论
- ❌ support / sales 反馈进不了 Roadmap
- ❌ 功能上线但用户不知道（无回告）

## 分级掌握

- **Junior**: 能采集与归档反馈
- **Mid**: 能 triage、优先级、闭环回告
- **Senior**: 能搭组织级 VoC 体系并驱动产品决策

## 参考资源

- [Reforge: Voice of Customer](https://www.reforge.com/blog/voice-of-customer) — article
- [Productboard playbooks](https://www.productboard.com/glossary/customer-feedback-loop/) — doc

## 相关 Skills
_见所属 composite skill 或 role_