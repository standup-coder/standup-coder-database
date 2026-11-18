---
id: health-monitoring
type: atomic-skill
title: Health Monitoring
nameZh: 健康监控
domain: devops
tags: observability, health, sre, monitoring, slo
catalogSource: internal
catalogFile: atomic-skills/health-monitoring.json
catalogAddedAt: 2026-07-26
operation: ops
level: mid
---

# 健康监控
> 构建覆盖进程存活 / 流量就绪 / 依赖健康 / 合成探测的健康监控体系，支撑 SLO 服务。
## 操作语义
- 类型: ops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `service` (string, **必填**)
- `probes` (array, 可选)
- `sloTarget` (number, 可选) — 可用性目标（如 0.999）
## 输出
- `dashboards` (array, 可选)
- `alerts` (array, 可选)
- `runbookUrl` (string, 可选)
## 核心要点

健康监控的目标不是"能告警"，而是"告对警"：噪声多就等于没监控。

## 关键要点

- multi-window multi-burn-rate 替代单阈值告警
- symptom-based 告警（用户感知）优先于 cause-based
- 黑盒（synthetic）+ 白盒（metrics）双视角
- runbook 必须随告警发出
- 依赖健康聚合到 readiness

## 最佳实践

- 告警分级：page / ticket / silent
- 把 SLO 与告警公式直接绑定
- 使用 Prometheus AlertManager 路由按团队分发
- 每月做告警审计，删冗余

## 反模式

- ❌ CPU > 80% 就 page，半夜叫醒人
- ❌ 告警没 runbook，值班人靠猜
- ❌ 告警全发同一群组，疲劳化
- ❌ 只监控基础设施不监控业务路径

## 分级掌握

- **Junior**: 能配基础 liveness / readiness probe
- **Mid**: 能基于 SLO 配 burn-rate 告警、写 runbook
- **Senior**: 能设计组织级监控体系、告警治理与值班规范

## 参考资源

- [Google SRE: Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/) — doc
- [Prometheus AlertManager](https://prometheus.io/docs/alerting/latest/alertmanager/) — doc

## 相关 Skills
_见所属 composite skill 或 role_