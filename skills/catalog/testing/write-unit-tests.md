---
id: write-unit-tests
type: atomic-skill
title: Write Unit Tests
nameZh: 编写单元测试
domain: testing
tags: testing, unit-test, tdd, quality, jest
catalogSource: internal
catalogFile: atomic-skills/write-unit-tests.json
catalogAddedAt: 2026-07-26
operation: testing
level: mid
---

# 编写单元测试
> 编写快速 / 独立 / 确定性的单元测试，覆盖关键路径与边界场景。
## 操作语义
- 类型: testing
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `target` (string, **必填**) — 被测代码路径
- `framework` (string, 可选) 取值: jest/vitest/pytest/go-test/junit
## 输出
- `tests` (array, 可选)
- `coverage` (object, 可选)
## 核心要点

单元测试是文档 + 重构安全网；写到 mock 大于真实代码就该停，往集成测试上移。

## 关键要点

- AAA 模式（Arrange / Act / Assert）
- 一个测试一个断言主题
- edge case 优先于 happy path
- mock 边界（外部 IO）而非内部实现
- fast / isolated / deterministic

## 最佳实践

- 测试名 should_X_when_Y 表达意图
- 用 fixture / factory 而非全局 setup
- 每次失败都看 message 是否清晰
- CI 内 < 2 分钟跑完

## 反模式

- ❌ mock 内部函数等于测 mock 自己
- ❌ 一个 test 几十个断言
- ❌ 测试依赖顺序 / 全局状态
- ❌ 只测 happy path

## 分级掌握

- **Junior**: 能写基础断言测试
- **Mid**: 能用 fixture + edge case 完整覆盖
- **Senior**: 能驱动 TDD 文化与可维护测试架构

## 参考资源

- [xUnit Test Patterns](http://xunitpatterns.com/) — book
- [Kent Beck TDD](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530) — book
- [Jest docs](https://jestjs.io/docs/getting-started) — doc

## 相关 Skills
_见所属 composite skill 或 role_