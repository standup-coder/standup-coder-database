# M6 · 打磨 + 复盘（W11-12）

> [practice 索引](./README.md) ｜ 对应技能：[study/02-机制7/8](../study/02-agent-mechanisms.md) + [04 阶段IV](../study/04-quality.md)
> 目标：接入生态（MCP/Subagent）、把失败变资产（根因报告 + 飞轮）、整理成可展示作品（博客 + 开源）。

**里程碑产出**：MCP server + Subagent + 失败根因报告 + 数据飞轮 + 2 篇博客 + 开源 repo。

---

## Task 6.1 · 把「代码搜索」做成 MCP server

**目标**：让你的工具能被任何 MCP client 复用（Claude Code/Desktop 等）。

- [ ] 1. 装：`npm i @modelcontextprotocol/sdk zod`
- [ ] 2. 写 `mcp-servers/search-server.ts`
  ```ts
  import { Server } from '@modelcontextprotocol/sdk/server/index.js';
  import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
  import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
  import { execa } from 'execa';

  const server = new Server({ name: 'code-search', version: '0.1.0' }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [{ name: 'search_code', description: '在仓库搜代码(正则)',
      inputSchema: { type:'object', properties:{
        pattern:{type:'string'}, glob:{type:'string'} }, required:['pattern'] } }],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    if (req.params.name === 'search_code') {
      const { pattern, glob } = req.params.arguments as any;
      const { stdout } = await execa('rg', ['-n', pattern, ...(glob?['-g',glob]:[]), '.']);
      return { content: [{ type:'text', text: stdout.slice(0,8000) || '(无匹配)' }] };
    }
    throw new Error('unknown tool');
  });

  await server.connect(new StdioServerTransport());
  ```
- [ ] 3. 跑：`tsx mcp-servers/search-server.ts`（用 Claude Desktop 配置接入测试）

**✓ 检验**：外部 MCP client 能调到你的 search_code。

---

## Task 6.2 · my-coding-agent 接入 MCP

- [ ] 1. 用 MCP client SDK 启动并连接上面的 server（stdio）
- [ ] 2. 把 server 暴露的 tools 合并进 `anthropicTools`；工具调用时若属于 MCP 则走 client 调用
- [ ] 3. 让内置工具与 MCP 工具共存（用一个 `source: 'builtin'|'mcp'` 标记路由）

**✓ 检验**：Agent 既能用内置 edit_file，也能用 MCP 的 search_code。
**⚠️ 卡点**：能说清「何时用 MCP（复用生态）、何时自建（性能/定制）」。

---

## Task 6.3 · Subagent 委派

**目标**：主 Agent 遇到「需要大量搜索/探索」时，委派给 Subagent，只回收结论（不污染主上下文）。

- [ ] 1. 写 `src/subagent.ts`——一个**独立的小 loop**，只带搜索类工具
  ```ts
  export async function delegate(subtask: string): Promise<string> {
    // 起一个临时 loop，工具集限 {read_file, search_code, retrieve_code}
    // 返回「结论摘要」而非全部 trace
    const raw = await runLoopScoped(subtask, ['read_file','search_code','retrieve_code']);
    return await summarize(raw); // 用模型把长输出压成结论
  }
  ```
- [ ] 2. 给主 loop 加一个 `delegate` 工具，主 Agent 可调用它委派探索类子任务

**✓ 检验**：主 Agent 上下文里只有 Subagent 的结论摘要，没有搜索细节；任务成功率不降反升。

---

## Task 6.4 · 失败根因分析报告（岗位灵魂）

**目标**：把 M5 的失败 trace 变成「为什么失败 + 怎么修」的认知。

- [ ] 1. 取 20 个失败 trace，逐一归类到桶：
  `上下文不足 / 工具用错 / 规划错 / 验证漏 / 死循环 / 幻觉`
- [ ] 2. 挑 3-5 对「同类任务 成功 vs 失败」做 diff，定位转折步
- [ ] 3. 写 `reports/failure-analysis.md`：
  - 失败根因分布图（哪类最多）
  - 每个典型 case：trace 截图 + 「第 N 步走偏」+ 修复建议（改 prompt / 加工具 / 改 loop）

**✓ 检验**：给一个新失败 trace，5 分钟内说出根因 + 修复方向。

---

## Task 6.5 · 数据飞轮（失败转 regression）

**目标**：每个失败 case 固化成 regression，防止「改好 A 回头坏 B」。

- [ ] 1. 把 6.4 的失败 case 沉淀进 `eval/regression/`（格式同 cases.json）
- [ ] 2. CI 里加一个 job 跑 regression（可抽样以控成本）
- [ ] 3. 改动流程闭环：改一处 → 跑评测 + regression → 看指标 → 决定是否采纳

**✓ 检验**：故意改坏一个已知修复，CI/regression 能挡住。

---

## Task 6.6 · 技术博客 ×2

**目标**：把工程过程变成可展示的认知资产。

- [ ] 博客 1（设计决策）：选一个你纠结过的取舍（如 search-replace vs 整文件 / 压缩 vs 重放续跑 / 自建 vs MCP），讲「为什么这么选、代价、数据支撑」
- [ ] 博客 2（失败故事）：一个「Agent 失败 → 看 trace 定位 → 修复 → 评测验证」的完整故事（带 trace 截图 + 指标）

**✓ 检验**：两篇都有具体技术细节，非水文；陌生人能复现核心结论。

---

## Task 6.7 · README + 开源打磨

- [ ] README 必含：
  - 一句话定位 + 能力边界
  - 架构图（loop / tools / context / stability / obs-eval 分层）
  - 快速开始（clone → 配 key → 跑一个 issue）
  - 评测分数（SWE-bench-lite 基线 + 自建集）
  - trace 截图
  - 关键设计决策链接到博客
- [ ] 加 license、贡献指引、示例 issue

**✓ 检验**：陌生人点开 repo，5 分钟看懂你做了什么、做得多深。

---

## M6 出口检验

- [ ] MCP server 可被外部 client 调用，agent 内置+MCP 工具共存
- [ ] Subagent 委派后主上下文不污染
- [ ] 《失败根因分析报告》能 5 分钟定位一个 trace
- [ ] regression 能挡住「改坏回头」
- [ ] 2 篇博客可展示
- [ ] 开源 repo 5 分钟可读懂

---

## 全程收官（六里程碑全过 = 岗位维度就绪）

回到 [JD 级出口检验](../README.md) 逐条核对。达成 → 具备竞争力，可投递并自信聊设计。
