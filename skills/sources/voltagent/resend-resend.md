---
source: voltagent-awesome-agent-skills
sourceUrl: https://github.com/VoltAgent/awesome-agent-skills
repoUrl: https://github.com/resend/resend-skills/tree/main/skills/resend
title: "Resend/resend"
nameZh: "Resend 邮件 API"
category: "Communication"
tags:
  - resend
  - email
  - api
  - transactional
rank: 35
---

# Resend/resend

> 来源：[VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) · [技能详情页](https://github.com/resend/resend-skills/tree/main/skills/resend)

## 概述

# Resend

## Quick Send — Node.js

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const { data, error } = await resend.emails.send(
{
from: 'Acme ',
to: ['delivered@resend.dev'],
subject: 'Hello World',
html: 'Email body here',
},
{ idempotencyKey: `welcome-email/${userId}` }
);

if (error) {
console.error('Failed:', error.message);
return;
}
console.log('Sent:', data.id);
```

**Key gotcha:** The Resend Node.js SDK does NOT throw exceptions — it returns `{ data, error }`. Always check `error` explicitly instead of using try/catch for API errors.

## Quick Send — Python

```python

**中文名称**：Resend 邮件 API
**供应商**：resend
**分类**：Communication

## 使用场景

- 在支持 Agent Skills 的编码助手（如 Claude Code、Codex、Cursor、Gemini CLI）中调用此技能
- 配合 Resend 相关的开发任务使用
- 需要访问对应平台 API 或 SDK 时自动激活

## 能力说明

- **安装方式**：`npx skills add https://github.com/resend/resend-skills/tree/main/skills/resend` 或将链接粘贴给编码助手自动安装
- **适用助手**：Claude Code、Codex、Cursor、Gemini CLI、ZCode 等支持 Agent Skills 的环境
- **技能路径**（因助手而异）：`.claude/skills/`、`.agents/skills/`、`.cursor/skills/` 等
- **来源仓库**：[https://github.com/resend/resend-skills/tree/main/skills/resend](https://github.com/resend/resend-skills/tree/main/skills/resend)

## 风险与注意事项

- 第三方技能在执行任务时可能调用外部 API，请确认对应的 API Key、凭证与配额已正确配置
- 请从官方仓库（上方"来源仓库"链接）获取最新版本，避免使用来源不明的副本
- 部分技能会访问网络、文件系统或执行代码，使用前请阅读其 SKILL.md 中的安全说明
- VoltAgent/awesome-agent-skills 为社区策展清单，收录不代表官方背书；请结合自身需求评估

## 参考链接

- [VoltAgent/awesome-agent-skills 仓库](https://github.com/VoltAgent/awesome-agent-skills)
- [Resend/resend 详情页](https://github.com/resend/resend-skills/tree/main/skills/resend)
- [源代码仓库](https://github.com/resend/resend-skills/tree/main/skills/resend)
- [officialskills.sh 平台](https://officialskills.sh/)
