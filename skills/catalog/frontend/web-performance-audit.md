---
id: web-performance-audit
type: atomic-skill
title: Web Performance Audit
nameZh: Web 性能审计
domain: frontend
tags: frontend, performance, core-web-vitals, lighthouse, profiling
catalogSource: internal
catalogFile: atomic-skills/web-performance-audit.json
catalogAddedAt: 2026-07-29
operation: frontend
level: mid
---

# Web 性能审计
> 用可量化指标（Core Web Vitals）定位页面性能瓶颈，产出按收益排序的优化清单。
## 操作语义
- 类型: frontend
## 何时使用
- 页面加载慢/交互卡顿被用户或业务方投诉，需要客观定位瓶颈而非凭感觉优化
- 上线前性能验收，或性能回归（新版本 LCP/INP 恶化）需要归因
- SEO 需求：Core Web Vitals 是搜索排名信号，需要达标证明
## 何时不使用
- 后端接口本身耗时数秒——先做服务端优化，前端审计只能确认"瓶颈不在前端"
- 尚无真实用户流量的原型阶段——过早优化不如先跑通功能
## 输入参数
- `url` (string, **必填**) — 待审计页面
- `device` (string, 可选) — mobile/desktop，默认 mobile（移动端指标普遍更差）
- `fieldData` (object, 可选) — CrUX/RUM 真实用户数据（有则以 field 为准）
## 输出
- `metrics` (object) — LCP/INP/CLS/TTFB/FCP 实测值与达标判定
- `bottlenecks` (array) — 瓶颈清单：现象 → 根因 → 预估收益
- `actionPlan` (array) — 按"收益/成本"排序的优化项
## 核心要点

性能审计的本质是"先测量、再归因、后优化"：没有指标基线的优化都是猜。

## 关键要点

- 三大核心指标各有归因方向：LCP（资源加载链路）、INP（主线程阻塞）、CLS（布局稳定性）
- Lab 数据（Lighthouse）用于复现与调试，Field 数据（CrUX/RUM）才代表真实用户体验，两者结论冲突时以 field 为准
- LCP 优化四步：消除资源发现延迟（preload/优先级提示）→ 压缩传输（格式/CDN）→ 消除渲染阻塞 → 服务端 TTFB
- INP 的常见根因是长任务（>50ms）：用 Performance 面板找 long task，拆分或移出主线程（web worker）
- CLS 几乎总是"无尺寸媒体元素 + 动态注入内容"：为图片/广告位预留尺寸
- 瀑布图（network waterfall）读法：关键路径上的串行链越长越糟，找"链头"而不是逐个优化
## 最佳实践

- 在 CI 中固化性能预算（bundle 大小、LCP 阈值），性能回归当构建失败处理
- 审计报告永远带"预估收益"：砍 300KB JS 和砍 3KB 图片不该并列
- 用 RUM 分位数（p75）而非平均值做结论，平均值会被长尾拉平
- 每轮只验证一个优化假设，混合改动无法归因

## 反模式

- ❌ 不看指标直接上手"优化"（上懒加载、上缓存），可能优化了非瓶颈路径
- ❌ 只跑一次 Lighthouse 就下结论——lab 数据波动大，至少取多次中位数
- ❌ 把 Lighthouse 分数当 KPI 本身：分数是诊断工具，用户体验指标（CWV）才是目标
- ❌ 为 LCP 把所有资源都 preload——优先级提示滥用等于没有优先级

## 分级掌握

- **Junior**: 会跑 Lighthouse/PageSpeed，能读懂三大指标含义
- **Mid**: 能用 Performance/Network 面板归因瓶颈，产出带收益排序的优化清单
- **Senior**: 能建 RUM 体系与性能预算门禁，主导跨团队性能专项并量化业务收益

## 参考资源

- [web.dev — Core Web Vitals](https://web.dev/articles/vitals) — doc
- [Optimize LCP](https://web.dev/articles/optimize-lcp) — doc
- [Chrome DevTools Performance 面板](https://developer.chrome.com/docs/devtools/performance) — doc
- [CrUX（Chrome UX Report）](https://developer.chrome.com/docs/crux) — doc

## 相关 Skills

- [browser-rendering](./browser-rendering.md) — 归因渲染类瓶颈的原理基础
- [bundler-optimization](./bundler-optimization.md) — JS 体积类瓶颈的下游修复手段
- [frontend-architecture-design](./frontend-architecture-design.md)
