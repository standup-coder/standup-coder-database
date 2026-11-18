---
id: grafana-dashboard
type: atomic-skill
title: Grafana Dashboard
nameZh: Grafana 仪表盘
domain: devops
tags: observability, grafana, dashboard, monitoring, iac
catalogSource: internal
catalogFile: atomic-skills/grafana-dashboard.json
catalogAddedAt: 2026-07-26
operation: ops
level: mid
---

# Grafana 仪表盘
> 编写 Grafana 仪表盘 JSON 模型，含变量 / 面板 / 告警，纳入版本管理与 IaC。
## 操作语义
- 类型: ops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `title` (string, **必填**)
- `datasource` (any, **必填**) 取值: prometheus/loki/elasticsearch/mysql
- `panels` (array, 可选)
- `alerts` (array, 可选)
## 输出
- `dashboardJson` (object, 可选)
- `uid` (string, 可选)
- `url` (string, 可选)
## 核心要点

好的 Dashboard 让人 5 秒看出问题；糟糕的 Dashboard 是面板坟场。

## 关键要点

- 每个 Dashboard 围绕一个问题
- RED / USE / Golden Signals 三套通用法则
- 变量化（datasource / namespace / pod）便于复用
- 告警与 Dashboard 解耦，告警走 Alerting / SLO
- JSON 模型纳入 IaC 管理

## 最佳实践

- 用 Provisioning + dashboards-as-code
- Panel description 写明告警阈值含义
- 链接 Runbook / 文档
- 区分长期趋势与短期实时

## 反模式

- ❌ 一个 Dashboard 30+ panel 杂乱无章
- ❌ 直接 import 无人维护的 community dashboard
- ❌ 告警阈值硬编码到 panel
- ❌ 从 UI 改完不同步回 git

## 分级掌握

- **Junior**: 能拼出基础 RED Dashboard
- **Mid**: 能写 IaC、变量化、与告警解耦
- **Senior**: 能制定团队可观测性规范与 dashboards-as-code 流程

## 参考资源

- [Grafana: dashboards-as-code](https://grafana.com/docs/grafana/latest/dashboards/manage-dashboards/) — doc
- [Google SRE: Monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/) — doc

## 相关 Skills
_见所属 composite skill 或 role_