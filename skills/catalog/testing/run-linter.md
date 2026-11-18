---
id: run-linter
type: atomic-skill
title: Run Linter
nameZh: 运行检查
domain: testing
tags: lint, check, quality
catalogSource: internal
catalogFile: atomic-skills/run-linter.json
catalogAddedAt: 2026-07-26
operation: linting
level: junior
---

# 运行检查
> 对源代码执行静态分析检查器，返回结构化诊断结果
## 操作语义
- 类型: linting
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `paths` (array, **必填**) — Files or directories to lint (supports glob patterns)
- `linter` (string, 可选) 取值: eslint/pylint/flake8/ruff/golangci-lint/clippy/shellcheck/auto — Linter to use ('auto' detects from file extension) 默认: `"auto"`
- `config` (string, 可选) — Path to linter configuration file
- `rules` (array, 可选) — Specific rules to enable (e.g., ['no-unused-vars', 'no-console'])
- `severity` (string, 可选) 取值: error/warning/info/all — Minimum severity level to report 默认: `"all"`
- `fix` (boolean, 可选) — Auto-fix fixable issues (equivalent to --fix flag) 默认: `false`
- `maxWarnings` (number, 可选) — Maximum allowed warnings before reporting failure (-1 for unlimited) 默认: `-1`
## 输出
- `diagnostics` (array, **必填**) — List of lint findings
- **summary** (object,必填):
  - `filesScanned` (number, 可选)
  - `totalErrors` (number, 可选)
  - `totalWarnings` (number, 可选)
  - `fixableCount` (number, 可选)
  - `passed` (boolean, 可选)
- `fixedFiles` (array, 可选) — Files that were auto-fixed (when fix=true)
## 核心要点

Linter 的难点不在跑命令，而在多语言检测、配置继承链、增量 lint 策略和将诊断结果转化为 agent 可执行的修复动作。

## 关键要点

- 不同语言需要不同 linter，auto 模式必须根据文件扩展名和项目配置（package.json/pyproject.toml）智能选择
- ESLint 配置有继承链（extends/plugins/overrides），agent 修改配置时必须理解层级关系
- 增量 lint（只检查 git diff 涉及的文件）比全量 lint 快 10-100 倍，agent 应默认增量
- fixable 的诊断可以自动修复，但 agent 必须验证修复后不引入新问题
- linter 输出格式各异（JSON/unix/checkstyle），需要统一解析为结构化诊断

## 最佳实践

- 优先使用项目已有的 lint 配置（.eslintrc / pyproject.toml），不覆盖团队规范
- 输出结构化 JSON 格式（eslint --format json / ruff --output-format json）便于程序解析
- 对 monorepo 按 package 分别 lint，避免跨包配置冲突
- 将诊断按 severity 排序，error 优先于 warning，帮助 agent 聚焦关键问题
- fix 模式执行后重新 lint 验证，确保修复没有引入新错误

## 反模式

- ❌ 忽略项目已有配置直接用默认规则 lint，产生大量与团队规范冲突的误报
- ❌ 对 node_modules / vendor 目录执行 lint 导致超时
- ❌ 把数百条 warning 全部塞给 LLM 而不做优先级排序和去重
- ❌ 自动 fix 后不验证，导致代码格式正确但逻辑被破坏
- ❌ 在 CI 环境中使用交互式 linter（如需要 stdin 确认的 prompt）

## 分级掌握

- **Junior**: 能对单文件运行 linter、解读输出、区分 error 和 warning
- **Mid**: 能处理多语言 auto-detect、增量 lint、配置继承、结构化输出解析
- **Senior**: 能为 agent 设计 lint 策略：增量+缓存、自动修复验证、与 code review 流程集成、自定义规则推荐

## 参考资源

- [ESLint Configuration Guide](https://eslint.org/docs/latest/use/configure/) — doc
- [Ruff - An Extremely Fast Python Linter](https://docs.astral.sh/ruff/) — doc

## 相关 Skills
_见所属 composite skill 或 role_