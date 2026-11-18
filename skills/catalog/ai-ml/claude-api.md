---
type: external
source: anthropic-skills
sourceUrl: https://github.com/anthropics/skills/tree/main/skills/claude-api
title: claude-api
name: claude-api
nameZh: Claude API / Anthropic SDK 参考（claude-api）
category: 开发与集成（claude-api 插件）
tags: [claude-api, anthropic, sdk, llm, agents, mcp, tool-use, streaming, prompt-caching, managed-agents]
rank: 17
plugin: claude-api
license: Apache 2.0
hasReferences: true
references: [python/claude-api, typescript/claude-api, java/claude-api, go/claude-api, ruby/claude-api, php/claude-api, csharp/claude-api, curl/, shared/agent-design.md, shared/anthropic-cli.md, shared/claude-platform-on-aws.md, shared/error-codes.md, shared/live-sources.md, shared/managed-agents-api-reference.md, shared/managed-agents-core.md, shared/model-migration.md, shared/models.md, shared/platform-availability.md, shared/prompt-caching.md, shared/token-counting.md, shared/tool-use-concepts.md]
id: claude-api
domain: ai-ml
domainLabel: AI/ML/LLM
catalogSource: anthropic
catalogFile: claude-api.md
catalogAddedAt: 2026-07-26
---

# claude-api

> Reference for the Claude API / Anthropic SDK — model ids, pricing, params, streaming, tool use, MCP, agents, caching, token counting, model migration.

## 概述

`claude-api` 是 Claude API / Anthropic SDK 的参考 skill，用于构建 LLM 驱动的应用。覆盖模型 id、定价、参数、流式、工具调用、MCP、agent、缓存、token 计数、模型迁移。按所需 surface 选合适入口，检测项目语言，再读对应语言的文档。

**触发条件**（在打开目标文件之前就读；别因为"看起来像一句话"就跳过）：

- prompt 以任何形式提到 Claude/Anthropic（Claude、Anthropic、Fable、Opus、Sonnet、Haiku、`anthropic`、`@anthropic-ai`、`claude-*`、`us.anthropic.*`、`[1m]`）。
- 用户问 LLM 相关（定价/模型选择/限额/缓存）——永远不要凭记忆答。
- 任务是 LLM 形状但未指明提供商（agent/MCP/tool-definition/multi-agent/RAG/LLM-judge/computer-use；generate/summarize/extract/classify/rewrite/converse over NL；调试 refusals/cutoffs/streaming/tool-calls/tokens）。

**仅 SKIP**：当正在处理另一个提供商（覆盖所有触发）——query 里提到 OpenAI/GPT/Gemini/Llama/Mistral/Cohere/Ollama；或对项目跑 `grep -rE 'openai|langchain_openai|google.generativeai|genai|mistralai|cohere|ollama'` 命中（无提供商指明时先跑这个 grep，不要先 Read 文件）。

## 使用场景

- 用 Claude 构建 LLM 应用：分类、摘要、抽取、Q&A、批处理、多步工作流、自定义 agent。
- 集成工具调用（user-defined tools）、服务器端工具（code execution、computer use）。
- 用 Managed Agents 跑服务端托管的、带 per-session 容器的有状态 agent。
- 流式、prompt caching、token 计数、模型迁移。

## 能力说明

### 开始之前

扫描目标文件（或无目标文件时 prompt 与项目）寻找非 Anthropic 提供商标记——`import openai`、`from openai`、`langchain_openai`、`OpenAI(`、`gpt-4`、`gpt-5`、文件名如 `agent-openai.py` 或 `*-generic.py`，或任何保持提供商中立的明确指令。发现就停下，告诉用户这个 skill 产出 Claude/Anthropic SDK 代码；问他们是想切到 Claude 还是要非 Claude 实现。**不要用 Anthropic SDK 调用编辑非 Anthropic 文件。**

### 输出要求

当用户让你添加、修改、实现 Claude 特性时，代码必须通过以下之一调用 Claude：

1. **官方 Anthropic SDK**（项目对应语言：`anthropic`、`@anthropic-ai/sdk`、`com.anthropic.*` 等）。当存在支持 SDK 时这是默认。
2. **Raw HTTP**（`curl`、`requests`、`fetch`、`httpx` 等）——仅当用户明确要 cURL/REST/raw HTTP、项目是 shell/cURL 项目、或该语言无官方 SDK 时。

绝不混用两者。**绝不凭记忆猜 SDK 用法**——函数名、类名、命名空间、方法签名、import 路径必须来自显式文档（本 skill 的 `{lang}/` 文件，或 `shared/live-sources.md` 列出的官方 SDK 仓库/文档链接）。需要的绑定若未在 skill 文件里显式文档化，写代码前先 WebFetch `shared/live-sources.md` 里相关 SDK 仓库。不要从 cURL 形状或另一语言的 SDK 推断 Ruby/Java/Go/PHP/C# API。

**若 WebFetch 或仓库访问失败**：不要一直重试——按 `{lang}/` 文件里的模式与命名空间/包表写代码，跑编译器或解释器，按错误输出迭代。对静态类型 SDK（C#、Java、Go），针对本地错误的编译-修循环比被阻断的网络研究更快得到可用代码。

### 默认值

除非用户另说：

- 模型用 **Claude Opus 4.8**，确切 model string `claude-opus-4-8`。
- 任何稍复杂的事都默认 adaptive thinking（`thinking: {type: "adaptive"}`）。
- 任何可能涉及长输入、长输出或高 `max_tokens` 的请求默认流式——它防止请求超时。不需处理个别 stream 事件时用 SDK 的 `.get_final_message()` / `.finalMessage()` 拿完整响应。

### ⚠️ API Drift — 训练先验可能过期

2025–2026 年间若干常见 Claude API 形状变了。若从训练里回忆起某模式，写之前对照本 skill 的 `{lang}/` 文件验证。最常漂移的点：Extended thinking（`thinking: {type: "adaptive"}` 在 4.6+ 模型；`budget_tokens` 已废弃，在 Fable 5/Sonnet 5/Opus 4.8/4.7 上会被 400 拒绝）、Web search/web fetch 工具类型（`web_search_20260209`、`web_fetch_20260209` 在 Opus 4.8/4.7/4.6、Sonnet 5/4.6 上）、PHP 参数名（顶层具名参数 camelCase 如 `maxTokens`）。

### Subcommands

支持 `/claude-api <subcommand>` 形式：如 `migrate` 迁移既有 Claude API 代码到更新模型——立即读 `shared/model-migration.md` 并按序执行（Step 0 确认范围，Step 1 分类每个文件，再走 per-target breaking-changes 段）。

### 语言检测

按项目文件推断语言：`*.py` → Python；`*.ts`/`*.tsx`/`*.js` → TypeScript；`*.java`/`*.kt`/`*.scala` → Java；`*.go` → Go；`*.rb` → Ruby；`*.cs` → C#；`*.php` → PHP。多语言时按当前文件/问题定；仍含糊就问。无法推断用 AskUserQuestion；不支持的（Rust、Swift 等）建议 cURL/raw HTTP。

### 各语言特性支持

Python / TypeScript / Java / Go / Ruby / C# / PHP 均支持 Tool Runner（beta）与 Managed Agents（beta）。cURL 仅支持 Managed Agents（raw HTTP，无 SDK 特性）。

### Which Surface Should I Use?

**从简单开始。** 默认用满足需求的最简 tier。单次 API 调用和工作流能覆盖大多数用例——只有任务确实需要开放式、模型驱动的探索时才上 agent。

| 用例 | Tier | 推荐 Surface |
|---|---|---|
| 分类、摘要、抽取、Q&A | 单次 LLM 调用 | **Claude API** |
| 批处理或嵌入 | 单次 LLM 调用 | **Claude API** |
| 代码控制逻辑的多步流水线 | 工作流 | **Claude API + tool use** |
| 带自定义工具的 agent | Agent | **Claude API + tool use** |
| 服务器托管的有状态 agent + 工作区 | Agent | **Managed Agents** |
| 持久化、版本化的 agent 配置 | Agent | **Managed Agents** |
| 长时多轮 agent + 文件挂载 | Agent | **Managed Agents** |

### 架构

一切走 `POST /v1/messages`。工具与输出约束是这一端点的特性，不是独立 API。

- **用户定义工具**：用装饰器/Zod schema/raw JSON 定义，SDK 的 tool runner 处理调用 API、执行你的函数、循环到 Claude 完成。要全控可手写循环。
- **服务器端工具**：Anthropic 托管、在 Anthropic 基础设施上运行。Code execution 全服务器端（在 `tools` 里声明，Claude 自动跑代码）。Computer use 可服务器托管或自托管。
- **结构化输出**：约束 Messages API 响应格式（`output_config.format`）和/或工具参数校验（`strict: true`）。推荐 `client.messages.parse()` 自动按 schema 校验。旧的 `output_format` 已废弃，用 `output_config: {format: {...}}`。
- **支撑端点**：Batches、Files、Token Counting（`POST /v1/messages/count_tokens`，见 `shared/token-counting.md`）、Models（`GET /v1/models`，`GET /v1/models/{id}`，活的能力/上下文窗口发现）。

### 当前模型（缓存于 2026-06-24）

| 模型 | Model ID | 上下文 | 输入 $/1M | 输出 $/1M |
|---|---|---|---|---|
| Claude Fable 5 | `claude-fable-5` | 1M | $10.00 | $50.00 |
| Claude Opus 4.8 | `claude-opus-4-8` | 1M | $5.00 | $25.00 |
| Claude Opus 4.7 | `claude-opus-4-7` | 1M | $5.00 | $25.00 |
| Claude Opus 4.6 | `claude-opus-4-6` | 1M | $5.00 | $25.00 |
| Claude Sonnet 5 | `claude-sonnet-5` | 1M | $3.00（intro $2.00 至 2026-08-31） | $15.00（intro $10.00） |
| Claude Sonnet 4.6 | `claude-sonnet-4-6` | 1M | $3.00 | $15.00 |
| Claude Haiku 4.5 | `claude-haiku-4-5` | 200K | $1.00 | $5.00 |

**ALWAYS 用 `claude-opus-4-8`，除非用户显式点名别的模型。** 不要为成本降级——那是用户的决定。用 `claude-fable-5` 仅当用户明确要 Fable 5/"fable"/Anthropic 最强模型——它的 API 行为与 Opus 家族不同（thinking 永远开、原始思维链不返回、`refusal` stop reason 需处理并默认 opt-in fallbacks、30 天数据保留要求等，详见 `shared/model-migration.md` → Migrating to Claude Fable 5）。

**关键：只用上表里的确切 model ID 字符串——它们本身即完整。不要追加日期后缀。** 例如用 `claude-sonnet-4-6`，绝不用 `claude-sonnet-4-6-20251114`。用户要表里没有的旧模型时，读 `shared/models.md` 取确切 ID——不要自己构造。

## 参考资源

**语言专属文档**（`{lang}/claude-api/`、`{lang}/managed-agents/`）：

- `python/claude-api`、`python/managed-agents`
- `typescript/claude-api`、`typescript/managed-agents`
- `java/claude-api`、`java/managed-agents`
- `go/claude-api`、`go/managed-agents`
- `ruby/claude-api`、`ruby/managed-agents`
- `php/claude-api`、`php/managed-agents`
- `csharp/claude-api`
- `curl/`（raw HTTP 示例，含 `managed-agents.md`）

**共享概念文档**（`shared/`）：

- `agent-design.md`、`anthropic-cli.md`、`claude-platform-on-aws.md`、`error-codes.md`、`live-sources.md`
- Managed Agents 系列：`managed-agents-api-reference.md`、`managed-agents-client-patterns.md`、`managed-agents-core.md`、`managed-agents-environments.md`、`managed-agents-events.md`、`managed-agents-memory.md`、`managed-agents-multiagent.md`、`managed-agents-onboarding.md`、`managed-agents-outcomes.md`、`managed-agents-overview.md`、`managed-agents-scheduled-deployments.md`、`managed-agents-self-hosted-sandboxes.md`、`managed-agents-tools.md`、`managed-agents-webhooks.md`
- `model-migration.md`、`models.md`、`platform-availability.md`、`prompt-caching.md`、`token-counting.md`、`tool-use-concepts.md`

## 原文链接

- 仓库路径：https://github.com/anthropics/skills/tree/main/skills/claude-api
- SKILL.md 原文：https://raw.githubusercontent.com/anthropics/skills/main/skills/claude-api/SKILL.md
