---
source: skills-sh
sourceUrl: https://www.skills.sh/vercel-labs/agent-skills/vercel-react-best-practices
title: vercel-react-best-practices
nameZh: Vercel React 最佳实践
category: Vercel官方
tags: [Vercel, Vercel官方, 官方]
rank: 4
---
# vercel-react-best-practices（Vercel React 最佳实践）

> Vercel 工程团队的 React / Next.js 性能优化指南

## 概述

React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js…

## 使用场景

- Organized into 8 categories from critical (eliminating waterfalls, bundle optimization) to low priority (advanced patterns), each with specific, actionable rules prefixed for easy reference
- Covers server-side performance including React.cache() deduplication, parallel fetching, and serialization minimization
- Addresses client-side concerns: re-render optimization through memoization and dependency management, rendering performance with CSS strategies and hydration patterns
- Includes JavaScript-level optimizations like DOM batching, caching, and Set/Map lookups for O(1) performance
- Each rule includes detailed explanations, incorrect and correct code examples, and contextual guidance for automated refactoring and code generation
- Writing new React components or Next.js pages

## 能力说明

React and Next.js performance optimization across 70 rules prioritized by impact.
- Organized into 8 categories from critical (eliminating waterfalls, bundle optimization) to low priority (advanced patterns), each with specific, actionable rules prefixed for easy reference
- Covers server-side performance including React.cache() deduplication, parallel fetching, and serialization minimization
- Addresses client-side concerns: re-render optimization through memoization and dependency management, rendering performance with CSS strategies and hydration patterns
- Includes JavaScript-level optimizations like DOM batching, caching, and Set/Map lookups for O(1) performance
- Each rule includes detailed explanations, incorrect and correct code examples, and contextual guidance for automated refactoring and code generation
SKILL.md
Comprehensive performance optimization guide for React and Next.js applications, maintained by Vercel. Contains 70 rules across 8 categories, prioritized by impact to guide automated refactoring and code generation.
Reference these guidelines when:
- Writing new React components or Next.js pages
- Implementing data fetching (client or server-side)
- Reviewing code for performance issues

## 风险与注意事项

暂无来源说明

## 参考链接

- 原文：https://www.skills.sh/vercel-labs/agent-skills/vercel-react-best-practices
- 仓库：https://github.com/vercel-labs/agent-skills
- 指标：安装数 569.5K，GitHub Stars 29.3K
