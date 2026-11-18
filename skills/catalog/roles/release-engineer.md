---
id: release-engineer
type: role
title: Release Engineer
nameZh: 发布工程师
domain: devops
level: mid
tags: devops, ci-cd, release, build, automation
catalogSource: internal
catalogFile: roles/release-engineer.json
catalogAddedAt: 2026-07-29
experience: 3+ years
education: CS or related
responsibilities: 设计与维护 CI/CD 流水线 | 制定分支模型与版本策略 | 执行灰度发布金丝雀与回滚 | 治理构建速度与制品可追溯性 | 保障发布合规与变更审计
mainSkills: ci-pipeline-setup, release-strategy
atomicSkills: github-actions, gitops-workflow, docker-essentials, kubernetes-basics, terraform-basics, incident-response, config-validator, monitoring-setup
relatedRoles: devops-engineer, platform-engineer, sre-engineer
---

# 发布工程师

> 让"从一次 commit 到用户手里"这条路又快又稳：CI/CD 流水线、版本与分支策略、灰度与回滚，都归这个角色管。发布频率与变更失败率（DORA 指标）是其核心 KPI。

## 职责

- 设计与维护 CI/CD 流水线：构建、测试、制品、部署各阶段的速度与可靠性
- 制定分支模型（trunk-based/GitFlow）与版本策略（SemVer、发布火车）
- 执行并自动化灰度发布、金丝雀、蓝绿部署与一键回滚
- 治理构建：缓存、并行化、可复现构建、制品签名与供应链安全（SLSA）
- 保障发布合规：变更审计、发布窗口、审批流与发布说明

## 核心能力(主 Skills)

- [ci-pipeline-setup](../devops/ci-pipeline-setup.md) — 流水线从 0 到 1 与持续治理
- [release-strategy](../devops/release-strategy.md) — 灰度/金丝雀/回滚策略设计

## 基础操作(原子 Skills)

- [github-actions](../devops/github-actions.md) — 主流 CI 平台实操
- [gitops-workflow](../devops/gitops-workflow.md) — 声明式部署与漂移检测
- [docker-essentials](../devops/docker-essentials.md) — 镜像构建与分层优化
- [kubernetes-basics](../devops/kubernetes-basics.md) — 部署对象与滚动更新
- [terraform-basics](../devops/terraform-basics.md) — 环境即代码
- [incident-response](../devops/incident-response.md) — 发布事故的止血与回滚
- [config-validator](../devops/config-validator.md) — 配置漂移与校验
- [monitoring-setup](../devops/monitoring-setup.md) — 发布健康度监控

## 经验门槛

| 维度 | 要求 |
|------|------|
| 经验 | 3+ 年工程经验，其中有维护过多人共用流水线的经历 |
| 学历 | CS 或相关 |
| 核心技术 | 一个 CI 平台深度使用（GitHub Actions/GitLab CI/Jenkins）、容器与 K8s 部署、脚本能力（Bash/Python）、Git 深度理解 |
| 加分项 | DORA 指标实践、构建系统（Bazel/Gradle）优化、制品供应链安全（Sigstore/SLSA） |

## 学习路径

### Junior → Mid（本 role）
- 独立搭一条含测试门禁、制品缓存、多环境部署的完整流水线
- 掌握至少两种发布模式（滚动 + 金丝雀）并演练回滚
- 用 DORA 四指标（部署频率/变更前置时间/变更失败率/恢复时间）度量自己的流水线

### Mid → Senior / 转型
- 平台化：把发布能力做成自助服务（golden path），进阶 [platform-engineer](./platform-engineer.md)
- 可靠性纵深：SLO 与错误预算驱动发布节奏，进阶 [sre-engineer](./sre-engineer.md)

## 相关角色

- [devops-engineer](./devops-engineer.md) — 职责最接近的泛化角色
- [platform-engineer](./platform-engineer.md) — 平台化进阶方向
- [sre-engineer](./sre-engineer.md) — 可靠性进阶方向

## 参考资源

- [Google SRE Book — Release Engineering 章节](https://sre.google/sre-book/release-engineering/) — doc
- [DORA — State of DevOps 研究与四指标](https://dora.dev/) — doc
- [trunkbaseddevelopment.com — 分支模型权威参考](https://trunkbaseddevelopment.com/) — doc
