---
id: ssr-hydration
type: atomic-skill
title: SSR & Hydration
nameZh: 服务端渲染与水合
domain: frontend
tags: frontend, ssr, hydration, rsc, streaming
catalogSource: internal
catalogFile: atomic-skills/ssr-hydration.json
catalogAddedAt: 2026-07-29
operation: frontend
level: senior
---

# 服务端渲染与水合
> 理解 SSR/SSG/ISR/RSC 各渲染策略与水合机制，为页面选择正确的渲染方案并排查水合类故障。
## 操作语义
- 类型: frontend
## 何时使用
- 页面有 SEO 或首屏速度硬需求，需要在 CSR/SSR/SSG/ISR/RSC 间做选型
- 排查水合类故障：hydration mismatch 报错、首屏闪烁、"能看见但点不动"
- 评估 Next.js/Nuxt 等元框架的渲染配置是否合理
## 何时不使用
- 纯内部系统（登录后才可见）——CSR + 骨架屏通常够用，SSR 徒增服务成本与复杂度
## 输入参数
- `pageType` (string, **必填**) — 页面特征（内容型/交互型/个性化程度）
- `framework` (string, 可选) — next/nuxt/sveltekit/astro
- `issue` (string, 可选) — 故障排查场景的现象描述
## 输出
- `strategy` (string) — 渲染策略选型与理由
- `diagnosis` (string) — 水合问题根因与修复（排查场景）
## 核心要点

SSR 解决"首帧快 + 可被爬虫读"，代价是水合：HTML 先到但要等 JS 接管才可交互，选型就是在这组权衡里找平衡。

## 关键要点

- 策略光谱按"内容新鲜度 × 个性化程度"选：SSG（构建期，内容站）→ ISR（定时再生，商品页）→ SSR（请求期，个性化页）→ CSR（登录后应用）
- Hydration mismatch 三大来源：时间/随机数（服务端与客户端算出不同值）、仅客户端状态（localStorage/媒体查询）参与首次渲染、HTML 被浏览器纠正（p 套 div 等非法嵌套）
- 修 mismatch 的正解是消除差异源（把仅客户端内容延迟到 effect 后渲染），suppressHydrationWarning 只用于时间戳等确知无害处
- Streaming SSR + Suspense：外壳先出、慢数据块后到，把 TTFB 与慢接口解耦
- RSC（React Server Components）与 SSR 是两回事：RSC 决定"组件在哪执行、JS 是否下发"，SSR 决定"首帧 HTML 在哪生成"；RSC 的收益是服务端组件零客户端 JS
- 水合成本与组件树大小成正比——"能看见但点不动"窗口期长，说明该做代码分割或选择性/渐进水合（islands 架构）
- SSR 下服务端代码跑在每个请求上：内存泄漏、全局单例污染（跨请求共享状态）是后端级事故
## 最佳实践

- 默认从最静态的策略开始（SSG/ISR），确有个性化需求再升级到 SSR——反向降级的成本高得多
- 个性化内容用"静态外壳 + 客户端填充"或 Edge 渲染，避免整页 SSR
- 对 hydration 报错零容忍：mismatch 意味着某处逻辑在两端不一致，掩盖警告等于埋雷
- 压测 SSR 服务并配缓存与降级（SSR 失败回退 CSR），渲染服务是生产依赖

## 反模式

- ❌ 全站无脑 SSR——大多数页面用 SSG/ISR 更快更便宜
- ❌ 在渲染路径读 window/localStorage（服务端直接崩或产生 mismatch）
- ❌ 用 useEffect + setState 强制二次渲染来"修" mismatch，掩盖根因且引入闪烁
- ❌ SSR 模块顶层缓存用户数据，导致跨请求数据串号

## 分级掌握

- **Junior**: 能说清 CSR/SSR/SSG 差异，理解水合是什么
- **Mid**: 能按页面特征选策略，独立排查 hydration mismatch
- **Senior**: 能设计流式/选择性水合架构、Edge 渲染与缓存分层，治理 SSR 服务的稳定性

## 参考资源

- [Next.js — Rendering](https://nextjs.org/docs/app/building-your-application/rendering) — doc
- [Josh Comeau — The Perils of Rehydration](https://www.joshwcomeau.com/react/the-perils-of-rehydration/) — article
- [Patterns.dev — Rendering Patterns](https://www.patterns.dev/vanilla/rendering-patterns/) — doc
- [Islands Architecture (Astro)](https://docs.astro.build/en/concepts/islands/) — doc

## 相关 Skills

- [web-performance-audit](./web-performance-audit.md) — TTFB/LCP/INP 是渲染策略的验收指标
- [state-management](./state-management.md) — 服务端状态注水与客户端状态的边界
