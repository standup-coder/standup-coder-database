---
id: mcp-server-development
type: atomic-skill
title: MCP Server Development
nameZh: MCP 服务器开发
domain: ai-ml
tags: mcp, agent, llm, tool-use, protocol
catalogSource: internal
catalogFile: atomic-skills/mcp-server-development.json
catalogAddedAt: 2026-07-26
operation: ai-llm
level: mid
---

# MCP 服务器开发

> 用 Model Context Protocol(MCP)把工具、资源与提示标准化暴露给 LLM Agent:写一次,任何支持 MCP 的客户端(Claude Desktop、Cursor、自研 Agent)都能即插即用。

## 这个技能解决什么问题

每个 LLM 应用都要自己实现"工具接入":Claude 一套 JSON、OpenAI 一套 JSON、Cursor 又要注册一遍——工具写一次要适配 N 个客户端,每个客户端还要处理 transport、鉴权、错误格式。MCP 解决的是这个**重复造轮子**的问题:

| 问题 | 没有 MCP 时 | 有 MCP 时 |
|---|---|---|
| **工具接入重复** | 每个客户端一套工具声明格式 | 服务器声明一次,所有 MCP 客户端通用 |
| **能力类型单一** | 只有"函数调用"一种交互 | 三原语:工具(可调用)、资源(可读)、提示(可复用模板) |
| **传输各自为政** | 本地进程/远程服务各写各的 | stdio(本地)/ streamable HTTP(远程)标准可选 |
| **调试靠打印** | 用 log 猜协议问题 | 官方 MCP Inspector 可视化调试握手与调用 |

学完之后你应该能:

- 说清 MCP 的三原语(工具/资源/提示)与客户端-服务器交互模型
- 用 Python 或 TypeScript SDK 实现一个**完整可运行**的最小服务器(注册工具 → 启服务 → 客户端调用)
- 用 MCP Inspector 完成"发现工具 → 调用工具 → 查看结果"的调试闭环
- 为服务器设计鉴权、输入校验与错误返回,并对副作用工具标注确认机制
- 判断"什么时候用 MCP、什么时候直接 function calling",并完成部署(本地配置 / 远程 HTTP + Docker)
- 知道如何测 schema 漂移(conformance tests)并发布自己的服务器

## 前置知识

动手前,建议先掌握(按依赖顺序):

1. **工具调用设计**([tool-use-design](../ai-ml/tool-use-design.md))——工具命名、描述、参数 schema 的写法,这是 MCP 服务器里"工具"部分的内容来源
2. **API 调用**([api-call](../security/api-call.md))——能写代码与外部服务交互,理解 HTTP 基本概念
3. **基础提示工程**([prompt-engineering](../ai-ml/prompt-engineering.md))——理解 prompt 模板结构,对应 MCP 的 prompts 原语
4. **LLM 应用开发**([llm-app-development](../ai-ml/llm-app-development.md))——知道一个 LLM 应用长什么样,理解 MCP 在这个架构里的位置

如果你是从零开始:先读完 1-2 再回来。本技能需要你**会写 Python 3.10+ 或 TypeScript**,并装了 Node.js 18+。

## 核心概念

本技能由六个概念组成:先建立协议心智模型(1-3),再掌握实现(4-5),最后是工程化取舍(6)。

### 1. MCP 是什么:客户端-服务器与三原语

MCP(Model Context Protocol)是一个**开放协议**,定义 LLM 应用(客户端)如何连接外部能力(服务器)。它把 Anthropic 的 [Claude Desktop 插件机制](https://www.anthropic.com/news/model-context-protocol)公开为行业标准,现已由多个厂商共建。

架构上只有两个角色:

```text
┌────────────────┐   JSON-RPC 2.0    ┌──────────────────┐
│  MCP 客户端     │ ◄───────────────► │  MCP 服务器       │
│  (Claude Desktop│   stdio / HTTP   │  (你的工具/数据)   │
│   / Cursor / 自研│                  │                  │
└────────────────┘                  └──────────────────┘
```

服务器向外暴露三种**原语**(protocol primitives):

| 原语 | 是什么 | 类比 | 用途举例 |
|---|---|---|---|
| **Tools(工具)** | 可调用、有副作用、需参数 | 函数调用(有输入有输出) | 查天气、发消息、执行 SQL |
| **Resources(资源)** | 可读取的数据、有 URI | 文件/文档(只读) | 项目 README、配置文件、数据库 schema |
| **Prompts(提示)** | 可复用的提示模板 | 代码片段/模板 | 代码审查模板、周报生成模板 |

关键区别:**工具是"动作"** 且**客户端需用户确认后才执行**(多数客户端对工具调用有审批 UI);**资源是"数据"** 由模型按需读取,**提示是"模板"** 由用户或套件主动选用。三者的共同点是——**对模型友好**:描述与 schema 是给模型阅读的,不是给人阅读的。

### 2. 协议握手与能力协商

客户端与服务器首次连接时,进行 JSON-RPC 握手(initialize):

```text
客户端 → 服务器: initialize {protocolVersion, clientInfo, capabilities}
服务器 → 客户端: initialize 响应 {serverInfo, capabilities, protocolVersion}
客户端 → 服务器: initialized 通知(握手完成,进入业务消息)
```

- **protocolVersion**:双方协商协议版本,不兼容时服务器应拒绝并说明支持版本
- **capabilities 能力协商**:声明自己支持什么——服务器宣称 `tools` / `resources` / `prompts` / `logging` 各能力块;客户端宣称 `sampling`(让服务器反向请求模型生成文本,高级用法)
- 握手后才是业务消息:客户端用 `tools/list` 发现工具,用 `tools/call` 调用工具

> **要点**:capabilities 是"我能做什么"的声明,不是"你一定得用"。老客户端连新服务器时,服务器要兼容低版本协议。别在握手成功前假设对方支持任何扩展能力。

### 3. 传输方式:stdio 与 HTTP

| 传输 | 连接形态 | 适合场景 | 要点 |
|---|---|---|---|
| **stdio** | 客户端启动服务器子进程,通过标准输入/输出传 JSON-RPC | 本地工具(文件系统、本地数据库、CLI 封装) | 启动快、零网络配置;服务器日志必须写 stderr(写 stdout 会污染协议) |
| **streamable HTTP**(推荐) | 客户端用 HTTP POST 与服务器通信,支持流式响应与 SSE 推送 | 远程服务、多租户、Web 部署 | 单端点,请求/响应模型;新版协议已取代纯 SSE 传输 |
| **SSE(旧)** | 客户端建 SSE 连接收消息,HTTP POST 发消息 | 兼容旧客户端 | 新项目直接用 streamable HTTP |

选择判断:工具要访问**用户本机**的东西(本地文件、已登录的 IDE)→ stdio;工具是**团队共享服务**(公司内部 API、SaaS 集成)→ HTTP + 鉴权。MCP 官方建议远程用 HTTP 而非 SSE。

### 4. 用 SDK 实现最小服务器

官方 SDK(TypeScript / Python)封装了握手、协议编解码与传输,你只需要写"业务":

- 注册工具:`@mcp.tool()`(Python)或 `server.tool()`(TS),工具描述与参数 schema 的写法**完全复用** [tool-use-design](../ai-ml/tool-use-design.md) 的规范
- 注册资源:`@mcp.resource("uri://template")`,静态资源或带参数的 URI 模板
- 注册提示:`@mcp.prompt(name)`,返回提示模板内容
- 启服务:`mcp.run()` — 默认 stdio;`mcp.run(transport="streamable-http", host=..., port=...)` 起 HTTP 服务

三个实现纪律:

1. **工具参数必须用 schema 严格校验**(FastMCP 的 Python 类型注解 / TS 的 zod 自动生成),不信任模型编造的参数
2. **工具执行必须返回结构化错误消息**(带 retryable 与 hint),模型才能据错重试(规范同 [tool-use-design](../ai-ml/tool-use-design.md) 概念 5)
3. **工具要有超时**:推荐 ≤30s(协议层虽有超时机制,但服务器自身超时兜底更可靠),长任务用进度通知或拆成异步任务

### 5. 调试与测试:MCP Inspector

官方 [MCP Inspector](https://github.com/modelcontextprotocol/inspector) 是本地 Web 调试台,两步上手:

```bash
npx @modelcontextprotocol/inspector node dist/server.js   # stdio 服务器
# 或对 HTTP 服务器: npx @modelcontextprotocol/inspector --url http://localhost:8000/mcp
```

Inspector 能干的事:

- 可视化看到握手与 capabilities 协商结果
- 列出服务器暴露的全部工具/资源/提示(相当于 `tools/list` 视图)
- 手动调用任何工具,查看请求/响应 JSON 原文——**排查"模型为什么调不对"的第一现场**
- 检查原生消息,验证工具结果格式是否符合协议

> **要点**:先在 Inspector 里确认"工具可被发现、可被调用",再接入 LLM。跳过这一步,出了问题你分不清是模型选错、还是服务器协议错了。

### 6. MCP vs 直接 Function Calling:取舍与部署注意

MCP 不是函数调用的替代,而是**工具的标准化分发层**。要不要上 MCP,按生态判断:

| 维度 | 直接 Function Calling | MCP 服务器 |
|---|---|---|
| 接入成本 | 低,几行 JSON | 高,要写服务器 |
| 复用性 | 每客户端重写 | 一次编写,所有 MCP 客户端通用 |
| 适用 | 工具只给自己的应用用、数量少 | 工具要跨应用/跨团队/对外分发,或追求生态兼容 |
| 风险 | 无协议层风险 | 要维护协议版本兼容与传输层 |

**部署注意事项**(常踩的坑):

- **stdio 服务器日志写 stderr**,写 stdout 会破坏协议帧,客户端直接连不上
- **HTTP 服务器必须鉴权与限流**:工具是"可被任意网络请求触发"的能力,配 API key 或 OAuth(协议 2025 版支持 OAuth 2.1 资源服务器流程)
- **无状态或会话隔离**:同进程多会话时,按会话 ID 隔离状态,防止跨用户数据泄漏
- **版本化 schema**:工具的破坏性变更(删参数/改语义)要升服务器版本,并在 `serverInfo.version` 与变更说明里公布
- **配置即插即用**:给出 Claude Desktop / Cursor 的配置片段,让别人 10 秒接上你的服务器(见"示例 3")

## 学习路径

按 6-10 周规划,覆盖到**能独立交付一个生产级 MCP 服务器**。

### 阶段一:协议与最小实现(第 1-3 周)——Junior 水平

**目标**:理解三原语,跑通一个最小服务器并被客户端调用。

- 理解客户端-服务器模型、三原语、stdio 与 HTTP 的适用场景
- 会用 Python(SDK 的 FastMCP)或 TS SDK 实现单工具服务器
- 会用 MCP Inspector 完成调试闭环

**验收标准**:

- [ ] 跑通官方"快速开始"教程(写一个计算器或时间服务器),在 Inspector 里成功调用
- [ ] 说出 Tools / Resources / Prompts 三原语的区别,并为同一个场景写出三者的声明
- [ ] 说出 stdio 与 HTTP 各适合什么场景,以及 stdio 服务器日志为什么必须写 stderr

### 阶段二:工程化(第 4-7 周)——Mid 水平

**目标**:多工具 + 校验 + 错误处理 + 鉴权的生产级服务器。

- 实现 3+ 工具、资源 URI 模板与提示模板,参数用 zod/类型注解严格校验
- 结构化错误返回 + 副作用工具标注确认
- 给 HTTP 运输加 API key 鉴权与限流

**验收标准**:

- [ ] 交付一个 ≥3 工具的服务器,Inspector 中每个工具调用成功,非法参数返回结构化错误
- [ ] 含 1 个写操作类工具,在描述与实现中体现确认/防滥用机制
- [ ] 为服务器写一份 README:安装、配置片段(Claude Desktop/Cursor)、工具清单,别人照着能跑起来

### 阶段三:独立交付(第 8-10 周)——Mid 到 Senior 交界

**目标**:发布、测试、版本管理,并与直接 function calling 做清醒取舍。

- conformance/schema 漂移测试进 CI,protobuf 式 schema 变更管理
- 发布为 npm/PyPI 包 + 可选 Docker 镜像
- 能为团队写出"MCP vs 直接 function calling"的决策记录

**验收标准**:

- [ ] 服务器发布为包(Docker 或 npm/PyPI),CI 里跑自动测试通过
- [ ] 一次破坏性 schema 变更,记录版本号变更与迁移说明
- [ ] 为团队输出一页决策文档:什么场景上 MCP、什么场景直接 function calling

## 分步实操:从零交付一个 MCP 服务器

**先建调试闭环,再写业务代码**——这样每加一个工具都能立刻验证。

```
第 1 步:初始化项目与 SDK
   ↓
第 2 步:跑通最小服务器(hello 工具)
   ↓
第 3 步:用 Inspector 建立调试闭环
   ↓
第 4 步:加真实工具(校验/错误/副作用标注)
   ↓
第 5 步:按场景接传输(stdio 或 HTTP + 鉴权)
   ↓
第 6 步:客户端配置 + 自动测试 + 发布
```

### 第 1 步:初始化项目

```bash
mkdir weather-server && cd weather-server
python -m venv .venv && source .venv/bin/activate
pip install "mcp[cli]"            # Python SDK(含 CLI)
# 或 TypeScript:
# npm init -y && npm install @modelcontextprotocol/sdk zod
```

### 第 2-3 步:最小服务器 + Inspector

写一个只含一个 hello 工具的服务器(见"示例 1"),然后:

```bash
npx @modelcontextprotocol/inspector python server.py
# 浏览器打开 http://localhost:6274,在 "Tools" 页找到并调用 hello
```

**输入**:server.py;**输出**:Inspector 中可调用。这一步打通,后续只加业务。

### 第 4 步:加真实工具

- 每加一个工具:命名 verb_noun、描述写触发条件与负例、参数全部带 description 与 enum(规范详见 [tool-use-design](../ai-ml/tool-use-design.md) 概念 2/3)
- 执行体:校验 → 调用 → 结构化错误返回;写操作加确认机制
- 每加完一个,回 Inspector 调一次,确认协议层无误

### 第 5 步:接传输

- 本地:保持 stdio,一切日志走 stderr
- 远程:`mcp.run(transport="streamable-http", host="0.0.0.0", port=8000)`,前置 API key 校验中间件与限流

### 第 6 步:配置与发布

- 写客户端配置片段(见"示例 3"),README 里给出
- 自动测试进 CI(见"示例 2"尾部),发布 npm/PyPI 或 Docker

## 示例

三个示例,建议全部动手跑通:示例 1 是骨架,示例 2 是生产形态,示例 3 是调试与部署。

### 示例 1:最小服务器(Python FastMCP,完整可运行)

```python
"""最小 MCP 服务器:计算器 + 一个资源 + 一个提示。

环境:Python 3.10+,pip install "mcp[cli]"
运行:python server.py            # 默认 stdio
调试:npx @modelcontextprotocol/inspector python server.py
"""
from mcp.server.fastmcp import FastMCP

# 创建服务器:name 会显示在客户端的服务器列表里
mcp = FastMCP("calc-server", version="1.0.0")

@mcp.tool()
def calculate(expression: str) -> str:
    """计算算术表达式的结果。

    何时用:用户要计算 2+2、乘除、括号表达式等数学问题时。
    何时不用:用户问单位换算(用 convert_units);表达式中含字母时不要调用。
    安全:仅允许数字与 + - * / ( ) 和小数点,其他字符一律拒绝。
    """
    # 白名单校验:这是"模型传参不可信"的第一道防线
    allowed = set("0123456789+-*/(). ")
    if any(ch not in allowed for ch in expression):
        return '{"error": {"code": "INVALID_EXPR", "message": "表达式含非法字符", "retryable": false, "hint": "仅支持数字与 + - * / ( )"}}'
    try:
        result = eval(expression, {"__builtins__": {}}, {})  # 白名单已过滤,仍禁用内建
        return f"{expression} = {result}"
    except Exception as e:
        return f'{{"error": {{"code": "EVAL_FAIL", "message": "{e}", "retryable": false, "hint": "请检查括号是否配对"}}}}'

@mcp.resource("calc://history")
def history() -> str:
    """读取最近的计算历史(示例用静态数据演示资源原语)。"""
    return "1+1=2\n2*8=16"

@mcp.prompt("math-tutor")
def math_tutor(topic: str = "分数") -> str:
    """生成一个数学辅导提示模板:用户调用 prompts/list 后按需选用。"""
    return f"你是数学老师,请用小学生能懂的语言讲解{topic},并出 3 道练习题。"

if __name__ == "__main__":
    mcp.run()  # 默认 stdio 传输;远程可 mcp.run(transport="streamable-http", port=8000)
```

**要点**:① 一个装饰器一个原语,SDK 自动完成握手与协议编解码;② `calculate` 的白名单校验说明"模型参数不可信"原则在 MCP 同样适用;③ 结构化错误(retryable + hint)让 LLM 客户端能自行修正重试;④ 默认 stdio,一行切换 HTTP——这是 SDK 帮你消化的传输复杂度。

### 示例 2:生产形态(TypeScript SDK + 鉴权 + 资源模板)

```typescript
// 生产形态:文件系统管理服务器(只读增强版),含 API key 校验与 URI 模板资源
// 环境:Node 18+,npm install @modelcontextprotocol/sdk zod
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const server = new McpServer({ name: "docs-server", version: "1.1.0" });

// 只允许读取此目录,路径穿越防护:工具内二次校验
const ROOT = process.env.DOCS_ROOT ?? "./docs";

function safeResolve(rel: string): string {
  const abs = path.resolve(ROOT, rel);
  if (!abs.startsWith(path.resolve(ROOT))) throw new Error("路径越界,已拒绝");
  return abs;
}

// 工具:列出目录内容(verb_noun 命名)
server.tool(
  "list_docs",
  { dir: z.string().describe("相对 ROOT 的目录路径,如 'guide';不传则列出根目录") },
  async ({ dir = "." }) => {
    try {
      const entries = await readdir(safeResolve(dir), { withFileTypes: true });
      return { content: [{ type: "text" as const, text: JSON.stringify(entries.map(e => e.name)) }] };
    } catch (e) {
      return { content: [{ type: "text" as const, text: `{"error": {"code": "LIST_FAIL", "message": "${(e as Error).message}", "retryable": true}}` }] };
    }
  },
);

// 资源:URI 模板,客户端可用 docs://files/{path} 按需读取文档内容
server.resource(
  "doc-content",
  "docs://files/{relPath}",
  async (uri) => {
    const rel = uri.pathname.replace(/^\//, "");          // 从 URI 取参数
    const content = await readFile(safeResolve(rel), "utf-8");
    return { contents: [{ uri: uri.href, text: content }] };
  },
);

// 传输:stdio 给本地客户端;HTTP 时前面挂 API key 校验中间件
const transport = process.env.SERVE_HTTP === "1"
  ? new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })
  : new StdioServerTransport();
await server.connect(transport);
console.error("docs-server 已启动");  // 注意:日志必须走 stderr,stdio 模式写 stdout 会破坏协议
```

```bash
# 运行与测试
node dist/server.js
# HTTP 模式 + 鉴权(生产示例:用任意网关或自写中间件校验 Authorization 头)
SERVE_HTTP=1 node dist/server.js
```

**要点**:① `safeResolve` 防路径穿越——工具参数来自模型,模型可能被注入操纵,路径必须二次校验;② 资源 URI 模板让"读取文档"成为只读数据访问,而非工具调用,减少不必要的执行确认;③ 结构化错误同样用于 SDK 的 TS 工具返回;④ stdio 模式的日志纪律:`console.error` 而非 `console.log`。

### 示例 3:调试与客户端接入(Inspector + 配置 + conformance 测试)

```bash
# ── 1. 用 Inspector 建立调试闭环(/mcp 端点适用于 HTTP 服务器) ──
npx @modelcontextprotocol/inspector node dist/server.js
#       或  npx @modelcontextprotocol/inspector --url http://localhost:8000/mcp
# 在浏览器里:Connect → 查看 Tools/Resources/Prompts 三页 → 手动调用工具
# 排查顺序:连不上 → 看 stdout/stderr 与握手日志;能连但没工具 → 看 list_tools 响应;
# 能调但结果怪 → 看 JSON 原文,检查 content 数组格式
```

```jsonc
// ── 2. 客户端即插即用配置:Claude Desktop(claude_desktop_config.json) ──
{
  "mcpServers": {
    "docs-server": {
      "command": "node",
      "args": ["/绝对路径/server.js"],
      // "env": { "DOCS_ROOT": "/srv/docs" }   // 需要的环境变量放这里
    }
  }
}
```

```jsonc
// ── 3. Cursor 配置(.cursor/mcp.json,HTTP 远程服务器) ──
{
  "mcpServers": {
    "docs-server": {
      "url": "https://mcp.example.com/mcp",
      "headers": { "Authorization": "Bearer 你的-API-Key" }  // 远程必须鉴权
    }
  }
}
```

```python
# ── 4. conformance 测试:验证工具清单与 schema 不漂移(进 CI) ──
# 原理:启动服务器,用 MCP 客户端 SDK 发 tools/list,断言快照一致
import asyncio, json, subprocess, sys
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def check_snapshot():
    params = StdioServerParameters(command=sys.executable, args=["server.py"])
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()                    # 完整握手
            tools = (await session.list_tools()).tools     # 发现工具
            names = sorted(t.name for t in tools)
            with open("tools.snapshot.json") as f:
                assert names == json.load(f), f"schema 漂移:{names}"
            print("✅ 工具清单与快照一致:", names)

asyncio.run(check_snapshot())
```

**要点**:① Inspector 是"协议层对错"的唯一仲裁者——它不经过任何 LLM,直接暴露服务器真实行为;② 配置片段是交付物的一部分,"10 秒接上"是 MCP 的价值主张;③ 远程服务器必须鉴权(API key/OAuth);④ 快照测试把 schema 漂移变成 CI 失败,防止"改了工具没通知客户端"。

## 练习

按顺序完成,产出放进 `personal/` 留档。

### 基础练习

- [ ] **P1-1 最小服务器**:用 FastMCP(或 TS SDK)写一个计算器/时间服务器,在 Inspector 中成功调用;判定:Inspector 里能看到工具并能返回正确结果
- [ ] **P1-2 三原语各写一个**:为同一个场景(如"个人笔记库")实现 1 个工具 + 1 个资源 + 1 个提示;判定:在 Inspector 的 Tools/Resources/Prompts 三页都能看到并触发
- [ ] **P1-3 握手观察**:在 Inspector 的日志页找到 initialize 请求/响应,指出 protocolVersion 与 capabilities;判定:能说清服务器声明了哪些能力

### 进阶练习

- [ ] **P2-1 三工具生产服务器**:实现 ≥3 个工具,含 1 个写操作,全部带白名单校验与结构化错误;判定:故意传非法参数时返回 retryable/hint 错误而非崩溃
- [ ] **P2-2 HTTP + 鉴权**:把服务器切到 streamable-http,加 API key 校验;判定:无 key 请求被拒,带 key 成功,并用 curl 验证两次
- [ ] **P2-3 README 交付**:写 README(安装/配置片段/工具清单/安全说明),请另一个人照着接入;判定:对方 10 分钟内接入成功

### 挑战练习

- [ ] **P3-1 快照测试进 CI**:为服务器实现 tools/list 快照测试;判定:CI 中故意改一个工具名,测试变红,改回变绿
- [ ] **P3-2 发布与版本管理**:发布为 npm/PyPI 包或 Docker 镜像,做一次破坏性 schema 变更并写迁移说明;判定:发布物可被他人安装运行,变更记录含版本号
- [ ] **P3-3 取舍决策记录**:为团队输出一页《MCP 采用决策》,含:哪些现有工具适合 MCP 化、哪些保持直接 function calling、风险清单;判定:决策可执行,并至少 MCP 化其中一个工具

## 自测题

先独立作答,再对照题后答案。答不出的题对应回看相关章节。

1. MCP 的三原语是什么?Tools 与 Resources 的本质区别?
2. stdio 传输的服务器为什么日志必须写 stderr?如果写 stdout 会发生什么?
3. initialize 握手里 capabilities 的作用?服务器与客户端各声明什么?
4. 一个 MCP 服务器要暴露"读取项目文档"与"发送消息到 Slack",分别应该用哪个原语?为什么?
5. 你写的工具参数来自 LLM,可能被提示注入操纵,服务器侧必须做什么?(至少两条)
6. 如何在 5 分钟内确认一个服务器"协议层没问题"?Inspector 里先看哪一步?
7. 新旧协议版本不兼容时,服务器应该怎么做?
8. 什么时候应该用 MCP 而不是直接 function calling?什么时候反过来?
9. 远程 HTTP 服务器不带鉴权会有什么后果?协议推荐的鉴权方式?
10. 改了一个工具的 inputSchema(新增必填参数),没有同步客户端,会发生什么?如何提前拦截?

<details>
<summary>答案</summary>

1. Tools(可调用、有副作用、需参数)、Resources(可读取、有 URI、只读)、Prompts(可复用提示模板)。区别:工具是"动作"且调用需确认,资源是"数据"按需读,提示是"模板"主动选
2. stdio 的 stdout 是协议通道,写日志会破坏 JSON-RPC 帧,客户端直接连不上;日志必须走 stderr
3. capabilities 是能力协商声明:服务器声明支持 tools/resources/prompts/logging 等能力块,客户端声明 sampling 等;双方按声明决定后续可用消息
4. 读文档 → Resources(只读数据,模型按需读);发消息 → Tools(动作,有副作用,需用户确认)
5. 参数白名单/类型校验、路径穿越防护、不信任任何输入;副作用工具加确认机制可追溯
6. 用 MCP Inspector 连服务器:先看握手日志,再在 Tools 页手动调用一次成功——协议层就通了,剩下的问题是 LLM 侧
7. 在 initialize 响应中声明支持的 protocolVersion;不兼容时拒绝并告知支持版本,客户端据此升级或降级
8. 工具要跨客户端/跨团队复用、要对外分发 → MCP;只给自己的单一应用用、数量少、不想维护协议层 → 直接 function calling
9. 工具变成任何人都可触发的接口,可被滥用发起恶意调用;协议推荐 OAuth 2.1 资源服务器流程,轻量级可用 API key
10. 老客户端仍按旧 schema 传参,工具调用失败;提前用 tools/list 快照测试(conformance)进 CI,变更时同步版本号并发布迁移说明
</details>

## 常见错误与反模式

- ❌ **stdio 服务器用 console.log 写日志**——污染 stdout 协议通道,客户端连不上;日志走 stderr
- ❌ **工具描述写给人看**("调用内部接口 getStockV2")——模型不知道何时触发;按 [tool-use-design](../ai-ml/tool-use-design.md) 的规范写给模型
- ❌ **一个工具做太多事**(update_and_create_and_delete)——无法单独校验与授权;单一职责
- ❌ **不校验输入,任意字符串流入底层命令**——提示注入提权的重灾区;白名单 + 类型 + 路径防护
- ❌ **远程服务器无鉴权**——任何人都能触发你的工具;API key / OAuth + 限流
- ❌ **长任务阻塞 30s 以上无反馈**——客户端超时误判失败;用进度通知或异步任务
- ❌ **错误只返回 "Error"**——模型无法重试;结构化错误(retryable + hint)
- ❌ **跳过 Inspector 直接接 LLM**——出问题分不清是模型还是协议;先 Inspector 验证协议层
- ❌ **schema 改了不通知不升版本**——下游客户端全挂;版本化 + 快照测试 + 迁移说明
- ❌ **服务器带跨会话共享状态**——用户 A 的数据被用户 B 读到;无状态或按会话隔离

## 参考资源

- [Model Context Protocol 官方文档](https://modelcontextprotocol.io/) — 协议文档,规范、快速开始与最佳实践
- [MCP Specification](https://modelcontextprotocol.io/specification) — 协议规范,消息、传输与生命周期定义
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk) — 工具,本技能示例使用的官方 SDK
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) — 工具,TS 官方 SDK
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector) — 工具,官方调试台,本技能的核心调试手段
- [官方示例服务器集合](https://github.com/modelcontextprotocol/servers) — 工具,参考各种服务器实现(文件系统、Git、数据库等)
- [Anthropic 发布 MCP 的公告](https://www.anthropic.com/news/model-context-protocol) — 文章,协议背景与设计动机

## 相关 Skills

- [tool-use-design](../ai-ml/tool-use-design.md) — 前置,工具命名/描述/schema 的设计规范是 MCP 工具部分的内容来源
- [agent-orchestration](../ai-ml/agent-orchestration.md) — 进阶,MCP 服务器作为工具接入多 Agent 系统
- [api-call](../security/api-call.md) — 前置,HTTP 与鉴权基础
- [guardrails-safety](../ai-ml/guardrails-safety.md) — MCP 服务器的输入校验与注入防护方法论
- [continuous-agent-loop](../security/continuous-agent-loop.md) — 进阶,服务器暴露的长循环 Agent 的安全审计
- [llm-app-development](../ai-ml/llm-app-development.md) — 落地场景,MCP 是 LLM 应用的工具接入层