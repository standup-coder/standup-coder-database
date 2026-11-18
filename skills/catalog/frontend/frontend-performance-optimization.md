---
id: frontend-performance-optimization
type: composite-skill
title: Frontend Performance Optimization
nameZh: 前端性能优化
domain: frontend
tags: performance, core-web-vitals, lcp, inp, performance-budget
catalogSource: internal
catalogFile: skills/frontend-performance-optimization.json
catalogAddedAt: 2026-07-29
stepCount: 4
level: senior
---

# 前端性能优化

> 以 Core Web Vitals 为北极星的完整性能工程闭环：真实用户测量 → 瓶颈归因 → 针对性优化 → 预算防回归

## 何时使用

- LCP/INP/CLS 未达 Google "Good" 阈值（2.5s/200ms/0.1），影响转化率或 SEO 排名
- 用户抱怨"页面慢"但团队拿不出数据说清慢在哪一段
- 大版本重构/迁移后需要建立性能基线与防回归机制

## 何时不使用

- 内部低频工具页——优化收益覆盖不了工程成本，先解决功能正确性
- 还没有真实流量的原型——没有 RUM 数据，实验室指标容易误导优先级

## 工作流

```
[输入: 目标页面 + 业务指标（转化/留存）]
  ↓
步骤 1: measure — 建立 RUM + Lab 双通道基线
  ↓
步骤 2: diagnose — 按指标拆解瓶颈并归因
  ↓
步骤 3: optimize — 按 ROI 排序执行优化
  ↓
步骤 4: guard — 性能预算 + CI 门禁防回归
  ↓
[输出: 达标的 CWV + 可持续的防回归体系]
```

### 步骤 1: measure

**目标**：先测量再优化——建立真实用户监控（RUM）与实验室（Lighthouse/WebPageTest）双通道基线，明确 p75 分位的真实体验。
**输入**：目标页面清单、现有监控（CrUX/自建 RUM）。
**输出**：各页面 LCP/INP/CLS/TTFB 的 p75 基线，按设备/网络/地域分层；实验室 trace 存档。
**失败处理**：无 RUM 时先接 web-vitals 库（几行代码）跑一周再继续；只有实验室数据时明确标注"未经真实用户验证"，避免优化错方向。

### 步骤 2: diagnose

**目标**：把"页面慢"翻译成可动手的瓶颈清单：LCP 拆为 TTFB/资源加载/渲染延迟，INP 归因到具体长任务与事件处理器，CLS 定位到具体位移元素。
**输入**：步骤 1 的基线数据与 DevTools performance trace。
**输出**：瓶颈清单（每项含指标影响量化 + 根因 + 候选方案），按"影响 × 实施成本"排出优先级。
**失败处理**：RUM 与实验室结论冲突时以 RUM 为准（实验室环境测不出真实设备/网络分布）；归因不清时用 Performance API 打自定义标记细分阶段。

### 步骤 3: optimize

**目标**：按优先级执行优化，每项改动独立验证效果。典型手段：LCP——关键资源预加载、图片优化（格式/尺寸/优先级）、SSR/流式渲染；INP——长任务切片、减少主线程 JS、web worker；CLS——尺寸占位、字体加载策略。
**输入**：步骤 2 的优先级清单。
**输出**：每项优化的前后对比数据（实验室 + 灰度 RUM），合入主干的改动集。
**失败处理**：单项优化上线后 p75 无显著改善时回查归因假设（常见：优化了均值但 p75 由另一批设备主导）；多项优化互相干扰时逐项灰度而非打包上线。

### 步骤 4: guard

**目标**：把成果固化为机制：性能预算（bundle 体积/请求数/CWV 阈值）+ CI 门禁（Lighthouse CI）+ RUM 告警，让回归在合码前被拦截。
**输入**：步骤 3 达成的指标水位。
**输出**：性能预算文档、CI 检查配置、RUM 告警规则、值班响应约定。
**失败处理**：CI 实验室数据抖动导致误报时用多次运行取中位数 + 设置容差带；预算被业务需求突破时走显式评审（记录决策），禁止静默放宽阈值。

## 输入参数

- `target_pages`（必填）— 待优化页面与对应业务指标
- `current_monitoring`（可选）— 现有 RUM/CrUX 数据源
- `budget_constraints`（可选）— 可投入的工程资源与截止时间

## 输出

- 达标的 Core Web Vitals（p75 分位）与前后对比报告
- 瓶颈归因文档与优化决策记录
- 性能预算 + CI 门禁 + 告警的防回归体系

## 学习要点

- p75 RUM 是唯一真值：实验室分数是调试工具不是目标，"Lighthouse 100 分但用户觉得慢"是真实存在的
- 归因先于动手：没有量化归因的优化是抽奖，最常见的浪费是优化了不在关键路径上的资源
- 防回归比优化更重要：没有预算与门禁，三个月后指标必然回到原点

## 相关 Skills

- [web-performance-audit](./web-performance-audit.md) — 步骤 1-2 的审计方法
- [browser-rendering](./browser-rendering.md) — 渲染管线的原理底座
- [bundler-optimization](./bundler-optimization.md) — JS 体积优化的实施手段
- [ssr-hydration](./ssr-hydration.md) — LCP/TTFB 优化的架构选项
