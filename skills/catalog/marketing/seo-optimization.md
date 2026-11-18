---
id: seo-optimization
type: atomic-skill
title: SEO Optimization
nameZh: SEO 优化
domain: marketing
tags: seo, marketing, organic, growth, content
catalogSource: internal
catalogFile: atomic-skills/seo-optimization.json
catalogAddedAt: 2026-07-26
operation: marketing
level: mid
---

# SEO 优化
> 通过技术 SEO / on-page / 内容策略 / 外链建设提升自然搜索可见度。
## 操作语义
- 类型: marketing
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `site` (string, **必填**) — 网站域名
- `audit` (any, 可选) 取值: technical/on-page/content-gap/backlink/full 默认: `"full"`
- `market` (string, 可选) 默认: `"global"`
## 输出
- `issues` (array, 可选)
- `recommendations` (array, 可选)
- `prioritizedBacklog` (array, 可选)
## 核心要点

SEO 是技术、内容、外链三角飞轮，任一边长期失修都会让另外两边白费力气。

## 关键要点

- Core Web Vitals 与排名直接相关
- search intent > keyword volume
- internal linking 是被低估的杠杆
- GEO（Generative Engine Optimization）成新战场
- E-E-A-T 决定 YMYL 类目可见度

## 最佳实践

- 用 GSC / Ahrefs / Semrush 三件套定期审计
- 为关键词集群建立 pillar page + cluster
- schema.org 标记结构化数据
- 定期清理 thin / duplicate content

## 反模式

- ❌ 关键词堆砌
- ❌ 买垃圾外链触发惩罚
- ❌ JS 渲染但不做 SSR / prerender
- ❌ 忽视 mobile / 速度，Core Web Vitals 全红

## 分级掌握

- **Junior**: 能跑技术 SEO 审计、修基础问题
- **Mid**: 能搭关键词地图、internal linking、CWV 优化
- **Senior**: 能驱动跨团队 SEO 战略、GEO 适配、品牌可见度

## 参考资源

- [Google Search Central](https://developers.google.com/search) — doc
- [Ahrefs SEO Guide](https://ahrefs.com/blog/seo/) — doc
- [Core Web Vitals](https://web.dev/vitals/) — doc

## 相关 Skills
_见所属 composite skill 或 role_