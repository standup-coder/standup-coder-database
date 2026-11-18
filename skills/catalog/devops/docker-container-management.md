---
contentStatus: outline
id: docker-container-management
type: composite-skill
title: Docker Container Management
nameZh: Docker 容器管理
domain: devops
tags: docker, container, ops
catalogSource: internal
catalogFile: skills/docker-container-management.json
catalogAddedAt: 2026-07-26
errorHandling: continue
stepCount: 4
---

# Docker 容器管理

> 管理 Docker 容器生命周期：查看状态、执行命令、收集日志

## 何时使用

- 需要完成「管理 Docker 容器生命周期：查看状态、执行命令、收集日志」，且产出会被他人依赖或复用，值得走完整流程
- 相关工作（docker、container、ops）缺乏统一做法，需要一条可复用的标准路径

## 何时不使用

- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流

## 工作流

```
[输入]
  ↓
步骤 1: check-status — 
  ↓
步骤 2: exec-command — 
  ↓
步骤 3: fetch-logs — 
  ↓
步骤 4: format-output — 
  ↓
[输出]
```

### 步骤 1: check-status

**目标**：对上一步产物做客观验证（check-status），在进入交付前暴露缺陷。
**输入**：工作流入口输入（见「输入参数」）。
**输出**：验证结论：通过项、失败项及其复现方式、需要回退修订的清单。供步骤 2（exec-command）消费。
**失败处理**：验证不通过时打回产出步骤修订，禁止"先交付再修"；反复不通过则升级评审。

### 步骤 2: exec-command

**目标**：执行 exec-command，产出该环节的结构化结果供下一步消费。
**输入**：步骤 1（check-status）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 3（fetch-logs）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 3: fetch-logs

**目标**：执行 fetch-logs，产出该环节的结构化结果供下一步消费。
**输入**：步骤 2（exec-command）的输出。
**输出**：本步骤的结构化结果与关键中间数据。供步骤 4（format-output）消费。
**失败处理**：执行失败时记录失败上下文并回退上一步检查输入契约。

### 步骤 4: format-output

**目标**：把前序步骤成果整理为约定格式的最终交付物（format-output）。
**输入**：步骤 3（fetch-logs）的输出。
**输出**：按目标受众组织的最终交付物，附关键数据与决策依据的引用。作为工作流最终交付的一部分。
**失败处理**：交付物缺关键信息时回溯对应步骤补齐，而不是在交付物里含糊带过。

## 输入参数

- `action` (string, **必填**) 取值: status/exec/logs — 操作类型
- `container` (string, **必填**) — 容器名称或 ID
- `command` (string, 可选) — exec 时执行的命令

## 输出

- `result` (string, 可选)
- `exitCode` (number, 可选)

## 错误处理
策略: `continue`
- fallback: `format-output` → return-raw

## 学习要点

- 理解工作流的步骤顺序与依赖
- 掌握每步输入输出的契约
- 能识别失败时的回退路径

## 相关 Skills

_见各步骤引用的 atomic skill_
