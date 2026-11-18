---
id: aws-cli-basics
type: atomic-skill
title: AWS CLI Basics
nameZh: AWS CLI 基础
domain: devops
tags: aws, cli, cloud, automation, devops
catalogSource: internal
catalogFile: atomic-skills/aws-cli-basics.json
catalogAddedAt: 2026-07-26
operation: devops
level: junior
---

# AWS CLI 基础
> 使用 AWS CLI v2 管理 S3 / EC2 / IAM / Lambda 等资源，支撑脚本化与自动化。
## 操作语义
- 类型: devops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `service` (string, **必填**) — 服务名（s3 / ec2 / iam ...）
- `action` (string, **必填**) — 动作（list-buckets / describe-instances ...）
- `profile` (string, 可选) 默认: `"default"`
- `region` (string, 可选)
## 输出
- `result` (object, 可选)
- `exitCode` (number, 可选)
## 核心要点

AWS CLI 的能量等于 IAM 权限给你开了多大的口子；脚本化前先把 profile 与 SSO 整明白。

## 关键要点

- AWS CLI v2 默认 SSO + named profile
- --query 用 JMESPath 抽取字段，配合 --output json
- 危险动作（delete / terminate）走 --dry-run 或 confirm
- 脚本中通过 STS AssumeRole 跨账号
- pagination 默认开启，长结果记得 --max-items

## 最佳实践

- 配置 aws sso configure 替代长期 access key
- 把命令固化进 Makefile / Justfile / scripts/
- 用 aws-vault 管理本地凭据
- 错误统一捕获 exit code 与 stderr

## 反模式

- ❌ 长期 access key 贴贴 .bashrc
- ❌ 生产帐号默认 profile，误操作风险大
- ❌ 脚本不带 --output json 解析失败
- ❌ sudo 跑 aws cli 污染 root 凭据

## 分级掌握

- **Junior**: 能跑常见 service 命令并解析输出
- **Mid**: 能用 SSO / AssumeRole / 脚本化批处理
- **Senior**: 能制定团队 CLI 安全规范，与 CI/CD / IaC 协同

## 参考资源

- [AWS CLI v2 docs](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) — doc
- [aws-vault](https://github.com/99designs/aws-vault) — doc
- [JMESPath](https://jmespath.org/) — doc

## 相关 Skills
_见所属 composite skill 或 role_