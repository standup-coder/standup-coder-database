---
id: ansible-automation
type: atomic-skill
title: Ansible Automation
nameZh: Ansible 自动化
domain: devops
tags: devops, ansible, configuration, automation, iac
catalogSource: internal
catalogFile: atomic-skills/ansible-automation.json
catalogAddedAt: 2026-07-26
operation: devops
level: mid
---

# Ansible 自动化
> 用 Ansible playbook / role 实现无 agent 的服务器配置、编排与合规执行。
## 操作语义
- 类型: devops
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `inventory` (string, **必填**)
- `playbook` (string, 可选)
- `checkMode` (boolean, 可选) 默认: `false`
## 输出
- `changed` (number, 可选)
- `failed` (number, 可选)
- `report` (string, 可选)
## 核心要点

Ansible 的卖点是简单与无 agent，但 playbook 体量一大就成 bash 升级版，模块化是命门。

## 关键要点

- idempotent 是 Ansible 的灵魂
- role 化 + ansible-galaxy 复用
- --check / --diff 是夜间值班的护身符
- tags 控制执行子集
- Vault 加密 secrets 入库

## 最佳实践

- 用 molecule 做 role 测试
- CI 中 lint（ansible-lint）+ check 模式
- 把 inventory 与 secrets 分离仓库
- 用 dynamic inventory 接 cloud provider

## 反模式

- ❌ shell module 满天飞，破坏幂等
- ❌ playbook 巨型单文件无 role
- ❌ 在 prod 直接 run，无 staging
- ❌ secrets 明文写入 vars

## 分级掌握

- **Junior**: 能跑现成 playbook
- **Mid**: 能写 role、用 vault、CI 集成
- **Senior**: 能设计跨百台规模的自动化体系并接 IaC / GitOps

## 参考资源

- [Ansible Best Practices](https://docs.ansible.com/ansible/latest/tips_tricks/ansible_tips_tricks.html) — doc
- [Molecule](https://molecule.readthedocs.io/) — doc

## 相关 Skills
_见所属 composite skill 或 role_