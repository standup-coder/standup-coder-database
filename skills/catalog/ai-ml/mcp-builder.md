---
type: external
source: anthropic-skills
sourceUrl: https://github.com/anthropics/skills/tree/main/skills/mcp-builder
title: mcp-builder
name: mcp-builder
nameZh: MCP 服务器构建器（mcp-builder）
category: 开发与集成（example-skills 插件）
tags: [mcp, model-context-protocol, server, sdk, typescript, python, fastmcp, llm-tools]
rank: 6
plugin: example-skills
license: Apache 2.0
hasReferences: true
references: [reference/evaluation.md, reference/mcp_best_practices.md, reference/node_mcp_server.md, reference/python_mcp_server.md]
id: mcp-builder
domain: ai-ml
domainLabel: AI/ML/LLM
catalogSource: anthropic
catalogFile: mcp-builder.md
catalogAddedAt: 2026-07-26
---

# mcp-builder

> Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Use when building MCP servers to integrate external APIs or services, whether in Python (FastMCP) or Node/TypeScript (MCP SDK).

## 概述

`mcp-builder` 指导如何构建高质量的 MCP（Model Context Protocol）服务器，让 LLM 能通过精心设计的工具与外部服务交互。一个 MCP 服务器的好坏，取决于它能在多大程度上帮 LLM 完成真实世界的任务。

## 使用场景

- 构建集成外部 API 或服务的 MCP 服务器。
- Python（FastMCP）或 Node/TypeScript（MCP SDK）任一技术栈。

## 能力说明

### 高层工作流（四个阶段）

**Phase 1: Deep Research and Planning**

- **理解现代 MCP 设计**：
  - *API 覆盖 vs. 工作流工具*：在全面的 API 端点覆盖与专用工作流工具间取得平衡。不确定时优先全面 API 覆盖。
  - *工具命名与可发现性*：清晰、描述性的名字 + 一致前缀（如 `github_create_issue`、`github_list_repos`）+ 动作导向命名。
  - *上下文管理*：简洁的工具描述 + 结果过滤/分页，让 agent 拿到聚焦、相关的数据。
  - *可操作的错误信息*：用具体建议和下一步引导 agent。
- **学习 MCP 协议文档**：从 sitemap 入手 `https://modelcontextprotocol.io/sitemap.xml`，再用 `.md` 后缀取 markdown 版本（如 `https://modelcontextprotocol.io/specification/draft.md`）。关键页：规范概览与架构、传输机制（streamable HTTP、stdio）、Tool/Resource/Prompt 定义。
- **学习框架文档**：
  - 推荐栈：**语言** TypeScript（SDK 质量高、兼容性好、模型擅长生成）；**传输** 远程用 Streamable HTTP + 无状态 JSON（更易扩展维护），本地用 stdio。
  - *MCP Best Practices*：`./reference/mcp_best_practices.md`。
  - *TypeScript*：WebFetch 加载 TypeScript SDK README；配 `./reference/node_mcp_server.md`。
  - *Python*：WebFetch 加载 Python SDK README；配 `./reference/python_mcp_server.md`。

**后续阶段**：实现工具、写评估（见 `reference/evaluation.md`）、迭代改进。

### 参考文档

`reference/` 目录下：

- `mcp_best_practices.md` — 核心指南
- `node_mcp_server.md` — TypeScript 模式与示例
- `python_mcp_server.md` — Python 模式与示例
- `evaluation.md` — MCP 评估方法

## 参考资源

- `reference/mcp_best_practices.md` — MCP 核心最佳实践
- `reference/node_mcp_server.md` — TypeScript 指南
- `reference/python_mcp_server.md` — Python 指南
- `reference/evaluation.md` — 评估方法
- `scripts/` — 辅助脚本

## 原文链接

- 仓库路径：https://github.com/anthropics/skills/tree/main/skills/mcp-builder
- SKILL.md 原文：https://raw.githubusercontent.com/anthropics/skills/main/skills/mcp-builder/SKILL.md
