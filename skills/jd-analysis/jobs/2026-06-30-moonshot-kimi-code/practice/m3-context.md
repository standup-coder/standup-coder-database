# M3 · 上下文管理（W5-6）

> [practice 索引](./README.md) ｜ 对应技能：[study/03 阶段II](../study/03-system-engineering.md)
> 目标：让 Agent 在「几百文件的 repo + 几十步的长任务」里不爆上下文、不丢关键信息。

**里程碑产出**：ContextBudget 预算管理器 + 文件选择 + 代码 RAG + 历史压缩，50 步任务 token 曲线稳定。

---

## Task 3.1 · token 估算与 ContextBudget

**目标**：给定预算，按优先级分配槽位，超了自动裁剪。

- [ ] 1. 写 `src/context/tokens.ts`（近似估算；精确可用 `client.messages.countTokens`）
  ```ts
  export const approxTokens = (s: string) => Math.ceil(s.length / 4);
  export const approxTokensMessages = (blocks: {content:any}[]) =>
    blocks.reduce((n, m) => n + approxTokens(JSON.stringify(m.content)), 0);
  ```
- [ ] 2. 写 `src/context/budget.ts`
  ```ts
  type Item = { key: string; priority: number; text: string };
  export class ContextBudget {
    private items: Item[] = [];
    constructor(public total: number) {}
    add(key: string, text: string, priority: number) { // 数字越大越优先
      this.items.push({ key, text, priority });
    }
    // 按优先级填充，超预算丢低优先级
    render(): string {
      const sorted = [...this.items].sort((a, b) => b.priority - a.priority);
      let used = 0; const out: string[] = [];
      for (const it of sorted) {
        const t = approxTokens(it.text);
        if (used + t > this.total) continue; // 放不下就跳过
        used += t; out.push(`### ${it.key}\n${it.text}`);
      }
      return out.join('\n\n');
    }
  }
  ```
- [ ] 优先级约定：系统提示 100 ｜ 当前任务 90 ｜ 相关文件 70 ｜ 最近 3 步 50 ｜ 更早历史 20

**✓ 检验**：塞 10 个文件但预算只够 3 个，`render()` 只输出高优先级的、不超预算。

---

## Task 3.2 · 文件相关性评分

**目标**：给任务，选出最该进上下文的 N 个文件。

- [ ] 写 `src/context/file-ranker.ts`
  ```ts
  import { execa } from 'execa';
  import { readFile } from 'node:fs/promises';

  // 用关键词命中 + 路径相关度打分（轻量版，无需 embedding）
  export async function rankFiles(task: string, topN = 8) {
    const keywords = task.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const { stdout } = await execa('rg', ['-l', '--', keywords.join('|'), '-g', '*.{ts,js,py,md}', '.']);
    const files = stdout.split('\n').filter(Boolean);
    const scored: [string, number][] = [];
    for (const f of files.slice(0, 100)) { // 限扫描量
      const c = (await readFile(f, 'utf8').catch(() => '')).toLowerCase();
      const hits = keywords.reduce((n, k) => n + (c.includes(k) ? 1 : 0), 0);
      scored.push([f, hits]);
    }
    return scored.sort((a, b) => b[1] - a[1]).slice(0, topN).map(([f]) => f);
  }
  ```

**✓ 检验**：给「修复登录 bug」类任务，返回的文件里包含 auth 相关文件。
**⚠️ 卡点**：这是启发式；语义版在 Task 3.4 用 RAG 补强。

---

## Task 3.3 · 代码索引（embedding）

- [ ] 1. 装：`npm i openai`
- [ ] 2. 建 `.env` 追加 `OPENAI_API_KEY=...`
- [ ] 3. 写 `src/context/embed.ts`
  ```ts
  import OpenAI from 'openai';
  const openai = new OpenAI();
  type Chunk = { path: string; symbol: string; text: string; vec: number[] };
  const store: Chunk[] = []; // 内存版；量大用 sqlite-vec / chroma

  export async function embed(text: string) {
    const r = await openai.embeddings.create(
      { model: 'text-embedding-3-small', input: text });
    return r.data[0].embedding;
  }

  // 按「函数/段落」切块（简化：按空行切块，每块 ≤ 60 行）
  export async function indexFile(path: string, src: string) {
    const blocks = src.split(/\n\n+/);
    for (let i = 0; i < blocks.length; i++) {
      if (!blocks[i].trim()) continue;
      store.push({ path, symbol: `${path}#block${i}`, text: blocks[i], vec: await embed(blocks[i]) });
    }
  }
  export const getStore = () => store;
  ```
- [ ] 4. 写索引脚本 `src/context/index-repo.ts`：遍历 `src/**/*.ts`，逐个 `indexFile`

**✓ 检验**：跑索引脚本，`store.length > 0`。

---

## Task 3.4 · retrieveCode（语义检索）

- [ ] 写 `src/context/retrieve.ts`
  ```ts
  import { embed, getStore } from './embed.js';
  const cosine = (a: number[], b: number[]) => {
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) { dot += a[i]*b[i]; na += a[i]*a[i]; nb += b[i]*b[i]; }
    return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
  };
  export async function retrieve(query: string, topK = 5) {
    const qv = await embed(query);
    return getStore()
      .map(c => ({ ...c, score: cosine(qv, c.vec) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
  ```
- [ ] 5. 封装成工具 `retrieve_code`，注册到 registry（description：语义搜代码，返回 top-K 片段）

**✓ 检验**：retrieve('用户登录校验逻辑') 的 top-5 含 auth 相关函数。

---

## Task 3.5 · 历史压缩

**目标**：历史超长时，把早期步骤压成摘要，只留近期原文。

- [ ] 写 `src/context/compress.ts`
  ```ts
  import { client, MODEL } from '../llm.js';
  import type { Message } from '../types.js';

  // 把「早期 N 步」摘要成一段；保留最近 keep 步原文
  export async function compressHistory(messages: Message[], keep = 4) {
    if (messages.length <= keep + 2) return messages;
    const old = messages.slice(0, messages.length - keep);
    const dump = JSON.stringify(old).slice(0, 8000);
    const res = await client.messages.create({
      model: MODEL, max_tokens: 800,
      messages: [{ role: 'user', content:
        `把以下 Agent 执行历史压成简洁摘要（已做、关键决策、当前进度、待解决）：\n${dump}` }],
    });
    const summary = res.content.find((b:any) => b.type === 'text') as any;
    return [
      { role: 'user' as const, content: [{ type: 'text' as const,
        text: `[历史摘要]\n${summary.text}` }] },
      ...messages.slice(-keep),
    ];
  }
  ```

**✓ 检验**：一个 12 步的 messages，压缩后变 5 步左右，token 下降 >50%，任务仍能继续。

---

## Task 3.6 · 接入 loop（每步重算上下文）

- [ ] 改 `src/loop.ts`：每轮循环开头
  1. `rankFiles(task)` 选文件 → 读内容
  2. 用 `ContextBudget` 装填（系统/任务/文件/历史）
  3. 若 `approxTokensMessages(messages) > 0.7 * 窗口` → `compressHistory`

**✓ 检验**：跑一个 30+ 步任务，观察 token 不持续增长、loop 不崩。

---

## M3 出口检验

- [ ] ContextBudget 超预算自动裁剪不崩
- [ ] rankFiles 覆盖真实修改点
- [ ] retrieve_code top-5 含目标函数
- [ ] compressHistory token 降 >50% 且任务可继续
- [ ] 50 步任务 token 曲线稳定

完成 → [M4 稳定性](./m4-stability.md)
