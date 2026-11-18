---
id: write-e2e-tests
type: atomic-skill
title: Write E2E Tests
nameZh: 编写端到端测试
domain: testing
tags: testing, e2e, playwright, cypress, qa
catalogSource: internal
catalogFile: atomic-skills/write-e2e-tests.json
catalogAddedAt: 2026-07-26
operation: testing
level: mid
---

# 编写端到端测试
> 编写端到端测试，覆盖关键用户旅程，稳定性优先于覆盖率。
## 操作语义
- 类型: testing
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `app` (string, **必填**)
- `framework` (string, 可选) 取值: playwright/cypress/webdriverio/puppeteer
- `browser` (string, 可选) 取值: chromium/firefox/webkit
## 输出
- `specs` (array, 可选)
- `fixtures` (array, 可选)
- `ciConfig` (string, 可选)
## 核心要点

e2e 的敌人不是 bug 是 flaky；与其追求高覆盖率，不如做 5 条永远绿色的关键路径。

## 关键要点

- data-testid > CSS selector
- auto-wait > sleep
- fixtures 隔离测试数据
- 关键 journey ≤ 10 条 e2e
- 失败截图 / 录像 / trace 默认开

## 最佳实践

- Playwright 默认开 trace + retry=2
- 与 backend mock 解耦或用专用环境
- CI 串行 vs 并行做 sharding
- flaky 自动 quarantine + 24h SLA 修复

## 反模式

- ❌ 测试依赖 sleep(3000)
- ❌ 一条 e2e 覆盖整个产品
- ❌ 生产数据库做 e2e
- ❌ flaky 测试占用 main 仍合并

## 分级掌握

- **Junior**: 能写基础 e2e spec
- **Mid**: 能控 flaky + 设计 fixture
- **Senior**: 能驱动 e2e 战略与质量门禁

## 参考资源

- [Playwright](https://playwright.dev/) — doc
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices) — doc
- [Test Automation University](https://testautomationu.applitools.com/) — doc

## 相关 Skills
_见所属 composite skill 或 role_