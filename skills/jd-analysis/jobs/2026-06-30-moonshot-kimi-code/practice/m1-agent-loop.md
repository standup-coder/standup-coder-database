# M1 · 最小 Agent Loop（W1-2）

> [practice 索引](./README.md) ｜ 对应技能：[study/02 机制1 Loop](../study/02-agent-mechanisms.md)
> 目标：从零跑通一个「调模型 → 想用工具 → 执行工具 → 喂回结果 → 直到回答」的最小 Agent。用 Anthropic SDK **手写**循环（最透明，符合 JD「理解 Agent Loop」）。

**里程碑产出**：`my-coding-agent` 能用 `readFile` 工具读文件后回答问题。

---

## Task 1.1 · 项目骨架

**目标**：建一个可跑的 TS 项目。

- [ ] 1. 建目录并初始化
  ```bash
  mkdir my-coding-agent && cd my-coding-agent
  npm init -y
  ```
- [ ] 2. 装 TypeScript 工具链
  ```bash
  npm i -D typescript tsx @types/node
  npx tsc --init
  ```
- [ ] 3. 改 `tsconfig.json` 关键项
  ```jsonc
  { "compilerOptions": { "target": "ES2022", "module": "ESNext",
    "moduleResolution": "Bundler", "strict": true,
    "esModuleInterop": true, "skipLibCheck": true,
    "outDir": "dist", "paths": { "@/*": ["./src/*"] } },
    "include": ["src"] }
  ```
- [ ] 4. 建目录结构
  ```bash
  mkdir -p src/tools
  ```
- [ ] 5. 加 npm 脚本（`package.json`）
  ```jsonc
  "type": "module",
  "scripts": { "dev": "tsx src/index.ts", "typecheck": "tsc --noEmit" }
  ```

**✓ 检验**：`echo 'console.log("hi")' > src/index.ts && npm run dev` 打印 `hi`。

---

## Task 1.2 · 依赖与 LLM 客户端

- [ ] 1. 装依赖
  ```bash
  npm i @anthropic-ai/sdk zod dotenv
  ```
- [ ] 2. 建 `.env`（**别提交**，加进 `.gitignore`）
  ```bash
  echo 'ANTHROPIC_API_KEY=sk-ant-...' > .env
  printf '\n.env\nnode_modules/\ndist/\n' >> .gitignore
  ```
- [ ] 3. 写 `src/llm.ts`
  ```ts
  import 'dotenv/config';
  import Anthropic from '@anthropic-ai/sdk';
  export const client = new Anthropic(); // 自动读 ANTHROPIC_API_KEY
  export const MODEL = 'claude-sonnet-4-5-20250929'; // 按当前可用模型替换
  ```

**✓ 检验**：`npm run typecheck` 无错。
**⚠️ 卡点**：`SDK_API_KEY` 没读到 → 确认 `dotenv/config` 在最顶部 import。

---

## Task 1.3 · 类型定义

- [ ] 写 `src/types.ts`
  ```ts
  import { z } from 'zod';

  // 对话消息（Anthropic 格式精简版）
  export type ContentBlock =
    | { type: 'text'; text: string }
    | { type: 'tool_use'; id: string; name: string; input: unknown }
    | { type: 'tool_result'; tool_use_id: string; content: string; is_error?: boolean };

  export type Message = { role: 'user' | 'assistant'; content: ContentBlock[] };

  // 工具定义：schema 用 zod，运行时自动校验
  export type Tool = {
    name: string;
    description: string;
    schema: z.ZodObject<any>;
    execute: (input: any) => Promise<string>; // 工具永远返回字符串喂回模型
  };
  ```

---

## Task 1.4 · 第一个工具 readFile

- [ ] 写 `src/tools/read-file.ts`
  ```ts
  import { z } from 'zod';
  import { readFile } from 'node:fs/promises';

  export const readFileTool = {
    name: 'read_file',
    description: '读取指定路径的文件内容。',
    schema: z.object({ path: z.string().describe('文件相对路径') }),
    execute: async ({ path }) => {
      try { return await readFile(path, 'utf8'); }
      catch (e: any) { return `ERROR: ${e.message}`; } // 失败也喂回，让模型自纠
    },
  };
  ```
**✓ 检验**：`readFileTool.execute({ path: 'package.json' })` 返回 JSON 字符串。

---

## Task 1.5 · 工具注册表

**目标**：把工具集中管理，并转成 Anthropic 要的 schema。

- [ ] 写 `src/tools/registry.ts`
  ```ts
  import { zodToJsonSchema } from 'zod-to-json-schema'; // npm i zod-to-json-schema
  import type { Tool } from '../types.js';
  import { readFileTool } from './read-file.js';

  // ① 注册
  export const tools: Record<string, Tool> = {
    read_file: readFileTool,
  };

  // ② 转 Anthropic tools 参数
  export const anthropicTools = Object.values(tools).map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: zodToJsonSchema(t.schema, { target: 'openApi3' }) as any,
  }));

  // ③ 执行 + zod 校验
  export async function runTool(name: string, input: unknown): Promise<string> {
    const tool = tools[name];
    if (!tool) return `ERROR: unknown tool ${name}`;
    const parsed = tool.schema.safeParse(input);
    if (!parsed.success) return `ERROR: bad args ${parsed.error.message}`;
    return tool.execute(parsed.data);
  }
  ```
- [ ] 补装：`npm i zod-to-json-schema`

---

## Task 1.6 · 主循环 runLoop（核心）

**目标**：手写 loop——这是整个项目的灵魂。

- [ ] 写 `src/loop.ts`
  ```ts
  import { client, MODEL } from './llm.js';
  import { anthropicTools, runTool } from './tools/registry.js';
  import type { Message } from './types.js';

  const MAX_STEPS = 10;

  export async function runLoop(task: string) {
    const messages: Message[] = [
      { role: 'user', content: [{ type: 'text', text: task }] },
    ];
    const system = '你是一个 Coding Agent。需要文件信息时调用 read_file。';

    for (let step = 0; step < MAX_STEPS; step++) {
      // ① 调模型
      const res = await client.messages.create({
        model: MODEL, max_tokens: 2048, system,
        tools: anthropicTools as any, messages,
      });

      // ② 记录助手这轮输出
      messages.push({ role: 'assistant', content: res.content as any });

      // ③ 没有工具调用 → 结束
      if (res.stop_reason === 'end_turn') {
        const text = res.content.find((b: any) => b.type === 'text');
        return text ? (text as any).text : '(done)';
      }

      // ④ 有 tool_use → 逐个执行，把 tool_result 喂回
      const results: Message['content'] = [];
      for (const block of res.content as any[]) {
        if (block.type !== 'tool_use') continue;
        const output = await runTool(block.name, block.input);
        results.push({ type: 'tool_result', tool_use_id: block.id, content: output });
      }
      messages.push({ role: 'user', content: results });
    }
    return '(reached max steps)';
  }
  ```

**✓ 检验**：能讲清每一步——①调模型 ②存历史 ③判停 ④执行工具回喂。
**⚠️ 卡点**：`import` 路径带 `.js` 是 ESM 规范（即使源是 `.ts`），别漏。

---

## Task 1.7 · 冒烟测试

- [ ] 写 `src/index.ts`
  ```ts
  import { runLoop } from './loop.js';
  const answer = await runLoop('读 package.json，告诉我项目叫什么名字、版本号是多少。');
  console.log(answer);
  ```
- [ ] 跑：`npm run dev`

**✓ 检验**：Agent 自主调用 `read_file` 读 `package.json`，正确说出版本号。

---

## Task 1.8 · 加可观测埋点（为 M5 铺路）

- [ ] 在 `loop.ts` 的 ①前、②后、④前后各 `console.log` 一步：`step / stop_reason / 调了什么工具 / 输出摘要`
- [ ] （可选）把每步写进 `traces/<timestamp>.jsonl`，结构：`{step, tool, input, output, latencyMs}`

**✓ 检验**：跑一次能看到清晰的逐步日志。

---

## M1 出口检验

- [ ] `npm run dev` 自主调工具回答问题
- [ ] 能画出 loop 状态机（调模型→判停→执行→回喂）
- [ ] `MAX_STEPS` 能挡住无限循环
- [ ] 工具失败时返回 `ERROR: ...` 而非抛崩

完成 → [M2 仓库工具集](./m2-repo-tools.md)
