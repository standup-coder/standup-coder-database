---
id: bundler-optimization
type: atomic-skill
title: Bundler Optimization
nameZh: 构建产物优化
domain: frontend
tags: frontend, vite, webpack, tree-shaking, code-splitting
catalogSource: internal
catalogFile: atomic-skills/bundler-optimization.json
catalogAddedAt: 2026-07-29
operation: frontend
level: mid
---

# 构建产物优化
> 用 Vite/Webpack 等构建工具的分包、tree-shaking 与产物分析能力，把 JS/CSS 体积压到预算内。
## 操作语义
- 类型: frontend
## 何时使用
- 首屏 JS 超出预算（经验红线：首屏压缩后 JS > 200KB 就该动手）
- 性能审计归因到"脚本下载/解析/执行耗时"类瓶颈
- 依赖升级/新增后产物体积突增，需要定位增量来源
## 何时不使用
- 产物已经很小但页面仍慢——瓶颈可能在渲染或接口，先审计再优化
- 内部工具页对体积不敏感——优化 ROI 低于业务开发
## 输入参数
- `bundler` (string, **必填**) — vite/webpack/rspack/esbuild
- `budget` (object, 可选) — 体积预算（如首屏 gzip ≤ 200KB）
- `statsFile` (string, 可选) — 构建产物分析文件
## 输出
- `analysis` (object) — 产物构成：模块体积 Top N、重复依赖、未摇掉的死代码
- `changes` (array) — 配置/代码改动清单与预期收益
- `budgetGate` (object) — CI 体积门禁配置
## 核心要点

产物优化三板斧：先分析（找到大头）→ 再分包（按需加载）→ 后摇树（消除死代码），顺序不能反。

## 关键要点

- 一切从产物分析开始：rollup-plugin-visualizer / webpack-bundle-analyzer 看清"什么占了体积"，最大的模块通常不是你以为的那个
- Code splitting 两个天然切分点：路由级（动态 import 页面）与重库级（图表/编辑器/富文本按需加载）
- Tree-shaking 生效前提：ESM 语法 + 包的 sideEffects 声明正确；CommonJS 依赖摇不动
- 重复依赖是隐形杀手：同一个库的多版本（lodash 4.17.20 + 4.17.21）会被完整打包两份，用依赖去重与 resolutions/overrides 解决
- barrel file（index.ts 全量 re-export）会破坏按需加载，直接 import 深路径或用编译期插件转换
- 现代产物策略：以 ES2020+ 为基线产出，放弃 IE 转译可省 10-20% 体积
- 压缩链路：minify（terser/esbuild）之后必须开 gzip/brotli 传输压缩，两者收益叠加
## 最佳实践

- 体积预算写进 CI（size-limit/bundlesize），超预算构建失败，防止体积温水煮青蛙
- 引重依赖前先查 bundlephobia，多数场景 dayjs 可替代 moment、原生 fetch 可替代 axios
- 动态 import 配合 prefetch 提示：拆出去的包在空闲时预取，兼顾首屏与后续体验
- lockfile diff 纳入 code review，依赖增量可见

## 反模式

- ❌ 不看分析报告，凭感觉"优化"配置
- ❌ 把所有东西都动态 import——过度分包造成请求瀑布，比大包更慢
- ❌ 为省体积手写"精简版"库函数，引入维护成本与正确性风险
- ❌ vendor 一把梭：所有依赖打进一个 chunk，任何依赖变更都打爆全部缓存

## 分级掌握

- **Junior**: 会看产物分析报告，能做路由级动态 import
- **Mid**: 能诊断 tree-shaking 失效与重复依赖，建立体积预算门禁
- **Senior**: 能设计 monorepo 级构建策略（共享 chunk、缓存策略、构建性能）并推动依赖治理

## 参考资源

- [Vite — Build Optimizations](https://vite.dev/guide/features.html#build-optimizations) — doc
- [webpack — Code Splitting](https://webpack.js.org/guides/code-splitting/) — doc
- [Bundlephobia](https://bundlephobia.com/) — tool
- [size-limit](https://github.com/ai/size-limit) — tool

## 相关 Skills

- [web-performance-audit](./web-performance-audit.md) — 确认体积确实是瓶颈后再动手
- [micro-frontend](./micro-frontend.md) — 微前端下的共享依赖策略
