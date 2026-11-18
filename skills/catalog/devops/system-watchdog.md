---
id: system-watchdog
type: atomic-skill
title: System Watchdog
nameZh: 系统看门狗
domain: devops
tags: ops, watchdog, liveness, monitoring, recovery
catalogSource: internal
catalogFile: atomic-skills/system-watchdog.json
catalogAddedAt: 2026-07-26
operation: ops
level: mid
---

# 系统看门狗
> 实现看门狗机制，检测进程卡死 / 队列阻塞 / 静默失败。
## 操作语义
- 类型: ops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `target` (string, **必填**)
- `check` (string, 可选) 取值: heartbeat/queue-depth/progress-counter/log-tail
- `intervalSec` (number, 可选) 默认: `30`
## 输出
- `status` (string, 可选)
- `lastBeat` (string, 可选)
- `recoveryAction` (string, 可选)
## 核心要点

最危险的故障不是 crash，是"还活着但啥都不干"；watchdog 是抓静默失败的最后一道网。

## 关键要点

- heartbeat 必须由"工作完成"事件驱动而非定时器
- queue 深度 + 消费速率两维监控
- progress counter 比 timestamp 更可信
- recovery 默认 restart，复杂场景走 playbook
- self-watchdog 没用，必须外部 watcher

## 最佳实践

- systemd watchdog / Kubernetes liveness probe 配齐
- Dead Man's Snitch 反向告警
- queue lag SLO 化
- recovery 后必发 alert 不能静默

## 反模式

- ❌ liveness 内查 DB 自伤
- ❌ heartbeat 是定时器不是任务驱动
- ❌ recovery 不发 alert
- ❌ watchdog 与被监控同进程

## 分级掌握

- **Junior**: 能配置 liveness probe
- **Mid**: 能搭 heartbeat + queue lag + dead man switch
- **Senior**: 能驱动组织级静默失败治理体系

## 参考资源

- [Dead Man's Snitch](https://deadmanssnitch.com/) — doc
- [Google SRE Book: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) — book
- [systemd watchdog](https://www.freedesktop.org/software/systemd/man/sd_notify.html) — doc

## 相关 Skills
_见所属 composite skill 或 role_