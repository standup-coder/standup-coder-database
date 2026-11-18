---
type: external
source: skills-sh
sourceUrl: https://www.skills.sh/mattpocock/skills/tdd
title: tdd
nameZh: 测试驱动开发(TDD)
category: 工程实践/代码质量
tags: [MattPocock, 工程实践/代码质量]
rank: 8
id: tdd
domain: testing
domainLabel: 测试
catalogSource: skills-sh
catalogFile: 08_测试驱动开发TDD.md
catalogAddedAt: 2026-07-26
---
# tdd（测试驱动开发(TDD)）

> 测试先行地构建功能或修复 bug

## 概述

Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests.

## 使用场景

- Emphasizes integration-style tests that verify behavior through public APIs, not implementation details; tests should survive refactors unchanged
- Requires vertical slicing (one test → one implementation → repeat) instead of horizontal slicing (all tests first, then all code), preventing brittle, behavior-insensitive test suites
- Includes planning phase to confirm interface changes, prioritize behaviors to test, and design for testability before writing code
- Provides refactoring guidelines covering duplication extraction, module deepening, and SOLID principles, applied only after all tests pass

## 能力说明

Test-driven development with vertical slices, behavior-focused tests, and incremental red-green-refactor cycles.
- Emphasizes integration-style tests that verify behavior through public APIs, not implementation details; tests should survive refactors unchanged
- Requires vertical slicing (one test → one implementation → repeat) instead of horizontal slicing (all tests first, then all code), preventing brittle, behavior-insensitive test suites
- Includes planning phase to confirm interface changes, prioritize behaviors to test, and design for testability before writing code
- Provides refactoring guidelines covering duplication extraction, module deepening, and SOLID principles, applied only after all tests pass
SKILL.md
TDD is the red → green loop. This skill is the reference that makes that loop produce tests worth keeping: what a good test is, where tests go, the anti-patterns, and the rules of the loop. Every section applies on every cycle — consult them before and during the loop, not after.
When exploring the codebase, read `CONTEXT.md` (if it exists) so test names and interface vocabulary match the project's domain language, and respect ADRs in the area you're touching.
Tests verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't. A good test reads like a specification — "user can checkout with valid cart" tells you exactly what capability exists — and survives refactors because it doesn't care about internal structure.
See tests.md for examples and mocking.md for mocking guidelines.
A seam is the public boundary you test at: the interface where you observe behavior without reaching inside. Tests live at seams, never against internals.
Test only at pre-agreed seams. Before writing any test, write down the seams under test and confirm them with the user. No test is written at an unconfirmed seam. You can't test everything — agreeing the seams up front is how testing effort lands on the critical paths and complex logic instead of every edge case.

## 风险与注意事项

暂无来源说明

## 参考链接

- 原文：https://www.skills.sh/mattpocock/skills/tdd
- 仓库：https://github.com/mattpocock/skills
- 指标：安装数 492.4K，GitHub Stars 179.4K
