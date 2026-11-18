---
id: cloud-anomaly-detection
type: atomic-skill
title: Cloud Anomaly Detection
nameZh: 云异常检测
domain: security
tags: security, anomaly, cloud, detection, siem
catalogSource: internal
catalogFile: atomic-skills/cloud-anomaly-detection.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 云异常检测
> 基于 flow log / IAM 事件 / ML baseline 检测云账号异常行为。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `source` (string, **必填**) 取值: cloudtrail/vpc-flow-logs/guardduty/cloud-audit/wiz
- `windowDays` (number, 可选) 默认: `30`
## 输出
- `anomalies` (array, 可选)
- `severity` (object, 可选)
- `suspectedActor` (string, 可选)
## 核心要点

异常 ≠ 攻击；80% 异常是合法新行为，关键是"baseline + 上下文"分诊而不是堆告警。

## 关键要点

- 身份维度 baseline > 全局 baseline
- GuardDuty / Defender / SCC 是起点不是终点
- 关联 IAM event + network event 共同决策
- time-of-day / geo / volume 三维特征
- 人工 feedback 闭环训练

## 最佳实践

- 新员工首月观察期降低 false positive
- 把关键 finding 推 SOC + 自动化响应
- detection-as-code（Sigma / Panther rules）
- 定期做 detection coverage gap 分析

## 反模式

- ❌ 告警阈值常年默认值
- ❌ 只看 severity 不看 actor 上下文
- ❌ 不区分 dev / prod 环境基线
- ❌ 检出后无 playbook 响应

## 分级掌握

- **Junior**: 能解读 GuardDuty finding
- **Mid**: 能写 detection rule + 调阈值
- **Senior**: 能驱动组织级 detection engineering 与 SOC 协同

## 参考资源

- [AWS GuardDuty](https://docs.aws.amazon.com/guardduty/) — doc
- [Sigma rules](https://github.com/SigmaHQ/sigma) — doc
- [MITRE D3FEND](https://d3fend.mitre.org/) — doc

## 相关 Skills
_见所属 composite skill 或 role_