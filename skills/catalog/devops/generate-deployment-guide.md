---
id: generate-deployment-guide
type: atomic-skill
title: Generate Deployment Guide
nameZh: 生成部署指南
domain: devops
tags: ops, docs, deployment, runbook, sop
catalogSource: internal
catalogFile: atomic-skills/generate-deployment-guide.json
catalogAddedAt: 2026-07-26
operation: ops
level: mid
---

# 生成部署指南
> 基于项目元数据生成可执行的部署指南：环境 / 构建 / 部署 / 回滚。
## 操作语义
- 类型: ops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `repo` (string, **必填**)
- `env` (string, 可选) 取值: dev/staging/prod
## 输出
- `guide` (string, 可选)
- `prerequisites` (array, 可选)
- `rollback` (string, 可选)
## 核心要点

部署指南不是给人读的小说，是给 oncall 在凌晨 3 点能照着复制粘贴的脚本；越精炼越好。

## 关键要点

- prereq / build / deploy / verify / rollback 五段式
- 每步带具体命令而非"运行 CI"
- 失败回滚必须显式可执行
- 环境差异表格化
- 与 runbook 链接互相引用

## 最佳实践

- 指南放 repo 内随代码 PR 更新
- screenshot 用极简风格不放过期 UI
- 把指南做成 markdown lint 化
- 与告警 runbook 链接

## 反模式

- ❌ "按 CI 部署即可"一句话糊过去
- ❌ 指南散在 wiki 跟代码不同步
- ❌ 没有 rollback 段
- ❌ 步骤含义不清需上下文猜

## 分级掌握

- **Junior**: 能写单服务部署文档
- **Mid**: 能模板化跨服务指南并随代码维护
- **Senior**: 能驱动组织级 deployment runbook 与 SOP

## 参考资源

- [Google SRE Book: Postmortem](https://sre.google/sre-book/postmortem-culture/) — book
- [GitOps deployment patterns](https://www.weave.works/technologies/gitops/) — article
- [Diátaxis docs framework](https://diataxis.fr/) — doc

## 相关 Skills
_见所属 composite skill 或 role_