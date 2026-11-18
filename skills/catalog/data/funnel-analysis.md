---
id: funnel-analysis
type: atomic-skill
title: Funnel Analysis
nameZh: 漏斗分析
domain: data
tags: analytics, funnel, conversion, growth, product
catalogSource: internal
catalogFile: atomic-skills/funnel-analysis.json
catalogAddedAt: 2026-07-26
operation: analytics
level: mid
---

# 漏斗分析
> 定义多步转化漏斗，定位最大流失环节，输出优先级优化建议。
## 操作语义
- 类型: analytics
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `steps` (array, **必填**) — 有序步骤事件列表
- `windowMinutes` (number, 可选) 默认: `1440`
- `segment` (string, 可选)
## 输出
- `stepConversion` (array, 可选)
- `biggestDropStep` (string, 可选)
- `recommendations` (array, 可选)
## 核心要点

漏斗的价值在于让"流失"具象化，但不要忘记：漏斗外的回头客可能比漏斗内的更值钱。

## 关键要点

- 步骤事件命名稳定
- 设定合适的转化窗口
- 识别"必经"vs"可选"步骤
- 漏斗 + 分群（设备 / 渠道）才看得见真相
- 关注绝对人数而非仅比例

## 最佳实践

- 用统一埋点 schema 防止漂移
- 与 cohort 联动看长期演化
- 漏斗发现的瓶颈用 A/B 验证修复有效性
- 关注非线性路径（用户跳步）

## 反模式

- ❌ 步骤定义混乱，分子分母错位
- ❌ 用 7 天窗口分析 30 天周期产品
- ❌ 把"漏斗"当唯一分析视角，忽略路径分析

## 分级掌握

- **Junior**: 能搭单一漏斗看转化率
- **Mid**: 能多维度拆解 + 识别瓶颈步骤
- **Senior**: 能驱动跨团队转化优化项目

## 参考资源

- [Amplitude Funnel Analysis](https://amplitude.com/blog/funnel-analysis) — article
- [Mixpanel: Path & Funnel](https://docs.mixpanel.com/docs/reports/funnels) — doc

## 相关 Skills
_见所属 composite skill 或 role_