---
id: penetration-testing
type: atomic-skill
title: Penetration Testing
nameZh: 渗透测试
domain: security
tags: security, pentest, red-team, offensive, audit
catalogSource: internal
catalogFile: atomic-skills/penetration-testing.json
catalogAddedAt: 2026-07-26
operation: security
level: mid
---

# 渗透测试
> 规划与执行渗透测试项目，覆盖 Web / API / 云 / 内网。
## 操作语义
- 类型: security
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `scope` (string, **必填**)
- `style` (string, 可选) 取值: black-box/grey-box/white-box
- `frameworks` (array, 可选)
## 输出
- `findings` (array, 可选)
- `severity` (object, 可选)
- `exploitChain` (array, 可选)
- `report` (string, 可选)
## 核心要点

渗透不是炫技，是给防守端找具体可修复的漏洞链；没有 ROE（rules of engagement）就不要动手。

## 关键要点

- ROE / 授权书是底线
- 区分 vuln scan vs pentest vs red team
- PTES 七阶段 / OWASP Testing Guide
- 攻击链 > 单点漏洞
- 报告必须给可执行修复建议

## 最佳实践

- Burp / Caido + 自动化扫描组合
- 每发现都要 PoC + repro 步骤
- 与 blue team 做 purple teaming 复盘
- 报告分管理摘要 + 技术明细两层

## 反模式

- ❌ 没授权先扫
- ❌ 只交一份扫描器导出报告
- ❌ 只列单点漏洞不组装链
- ❌ 报告写完就走，不复测

## 分级掌握

- **Junior**: 能用 Burp / Nmap 做基础测试
- **Mid**: 能独立完成 web / API 渗透并产出报告
- **Senior**: 能驱动 red / purple team 演练并对齐 ATT&CK

## 参考资源

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) — doc
- [PTES](http://www.pentest-standard.org/) — doc
- [MITRE ATT&CK](https://attack.mitre.org/) — doc

## 相关 Skills
_见所属 composite skill 或 role_