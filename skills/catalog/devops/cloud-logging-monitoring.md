---
id: cloud-logging-monitoring
type: atomic-skill
title: Cloud Logging & Monitoring
nameZh: 云端日志与监控
domain: devops
tags: observability, cloud, monitoring, logging, sre
catalogSource: internal
catalogFile: atomic-skills/cloud-logging-monitoring.json
catalogAddedAt: 2026-07-26
operation: ops
level: mid
---

# 云端日志与监控
> 集中化云端日志与指标（CloudWatch / Stackdriver / Azure Monitor），含保留 / 告警 / 成本控制。
## 操作语义
- 类型: ops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `provider` (any, **必填**) 取值: aws/gcp/azure
- `retentionDays` (number, 可选) 默认: `30`
- `alertChannels` (array, 可选)
## 输出
- `logGroups` (array, 可选)
- `alertPolicies` (array, 可选)
- `monthlyCost` (number, 可选)
## 核心要点

云原生日志便宜入门，贵在长期：成本治理 = 保留 + 采样 + 冷热分层。

## 关键要点

- log group / metric namespace 明确边界
- 冷热分层：CloudWatch → S3 → Glacier
- metric filter 把日志转 metric
- alarm 与 SLO 对齐而非阈值堆砌
- 审计日志独立保留 ≥ 1 年

## 最佳实践

- 用 OpenTelemetry collector 接入多云
- 关键路径开 detailed monitoring
- 配置 budgets + cost anomaly detection
- 导出长期数据到 S3 / GCS 用 Athena / BigQuery 查询

## 反模式

- ❌ 默认保留 永久 + verbose 全开
- ❌ 告警阈值硬编码无版本
- ❌ 日志只在 Console 看，不接 SIEM
- ❌ 不分 log group，权限失控

## 分级掌握

- **Junior**: 能配 log / alarm 基础
- **Mid**: 能做 retention / 冷热 / metric filter / 成本控制
- **Senior**: 能建多云统一可观测性平台

## 参考资源

- [AWS CloudWatch Logs Best Practices](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html) — doc
- [Google Cloud Operations](https://cloud.google.com/products/operations) — doc
- [Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/) — doc

## 相关 Skills
_见所属 composite skill 或 role_