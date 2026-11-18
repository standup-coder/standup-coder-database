# M5 · 可观测 + 评测（W9-10）

> [practice 索引](./README.md) ｜ 对应技能：[study/04](../study/04-quality.md)
> 目标：让 Agent 「看得见」（trace）、「比得出」（评测集 + SWE-bench）。这是岗位差异化。

**里程碑产出**：trace 系统 + viewer + 评测集 + SWE-bench-lite 基线分数。

---

## Task 5.1 · trace schema + 采集

**目标**：每一步可回看、可分析。

- [ ] 1. 写 `src/obs/trace.ts`
  ```ts
  import { appendFile, mkdir } from 'node:fs/promises';
  export type TraceEvent = {
    sessionId: string; step: number; ts: string;
    type: 'llm_call' | 'tool_call' | 'tool_result' | 'decision';
    thought?: string; tool?: string; input?: unknown;
    output?: string; tokensIn?: number; tokensOut?: number; latencyMs?: number;
    errType?: string;
  };
  export async function emit(e: TraceEvent) {
    await mkdir('traces', { recursive: true });
    await appendFile(`traces/${e.sessionId}.jsonl`, JSON.stringify(e) + '\n');
  }
  ```
- [ ] 2. 在 `loop.ts` 埋点（每轮：llm_call 前/后、tool_call/result、verify 结果）
  ```ts
  const t0 = Date.now();
  const res = await client.messages.create({...});
  await emit({ sessionId, step, ts:new Date().toISOString(), type:'llm_call',
    tokensIn: res.usage.input_tokens, tokensOut: res.usage.output_tokens, latencyMs: Date.now()-t0 });
  // 工具执行处：
  await emit({ sessionId, step, type:'tool_call', tool: block.name, input: block.input });
  const output = await runTool(...);
  await emit({ sessionId, step, type:'tool_result', tool: block.name, output: output.slice(0,2000) });
  ```

**✓ 检验**：跑一次，`traces/<id>.jsonl` 每行一个完整事件，无字段缺失。

---

## Task 5.2 · trace viewer（极简）

**目标**：能点开任意一步看现场。

- [ ] 1. 写 `src/obs/viewer.ts`（起一个静态 server 渲染 jsonl）
  ```ts
  import { createServer } from 'node:http';
  import { readFile } from 'node:fs/promises';
  createServer(async (req, res) => {
    const id = new URL(req.url!, `http://x`).searchParams.get('id') ?? '';
    const lines = (await readFile(`traces/${id}.jsonl`, 'utf8').catch(()=> '')).split('\n').filter(Boolean);
    const rows = lines.map(l => { const e = JSON.parse(l);
      return `<tr><td>${e.step}</td><td>${e.type}</td><td>${e.tool??''}</td>
        <td><pre>${(JSON.stringify(e.input??e.output??e.thought??'')).slice(0,500)}</pre></td>
        <td>${e.latencyMs??''}</td></tr>`; }).join('');
    res.setHeader('content-type','text/html');
    res.end(`<table border=1 cellpadding=4>${rows}</table>`);
  }).listen(7788, () => console.log('trace viewer: http://localhost:7788?id=<sessionId>'));
  ```
- [ ] 2. 跑：`tsx src/obs/viewer.ts`，浏览器打开链接

**✓ 检验**：能在表格里看到每步 type/tool/输出摘要/延迟。
**⚠️ 卡点**：够用就行；要更专业可接 Langfuse/Phoenix（留作进阶）。

---

## Task 5.3 · 评测集 case 定义

- [ ] 1. 写 `eval/cases.json`（每条：输入 + repo 快照 + 判定）
  ```json
  [
    { "id": "bug-001", "bucket": "bugfix",
      "task": "修复 utils.ts 里 add() 对负数返回错误的 bug",
      "repo": "repos/mini-utils",
      "judge": { "type": "test", "cmd": "npx vitest run add.test.ts" } },
    { "id": "feat-001", "bucket": "feature",
      "task": "给 Calculator 加一个 multiply 方法及测试",
      "repo": "repos/mini-calc",
      "judge": { "type": "llm_judge", "criteria": "存在 multiply 且有测试且通过" } }
  ]
  ```
- [ ] 2. 分桶：bugfix / feature / refactor，每桶 ≥5 条，合计 20-50

**✓ 检验**：每条 case 的判定方式明确、可重复执行。

---

## Task 5.4 · 防污染隔离 + 评测 runner

- [ ] 1. 评测 repo 与开发 repo 物理隔离；评测集**不进** Agent 上下文
- [ ] 2. 写 `eval/run.ts`
  ```ts
  import { execa } from 'execa';
  import cases from './cases.json' assert { type: 'json' };
  import { runLoop } from '../src/loop.js';

  for (const c of cases) {
    process.chdir(c.repo);                      // 在快照里跑
    await execa('git', ['clean','-fdx']);        // 每次干净起点
    const t0 = Date.now();
    await runLoop(c.task);                       // 跑 agent
    let pass = false;
    if (c.judge.type === 'test') {
      const r = await execa(c.judge.cmd, { shell:true, reject:false });
      pass = r.exitCode === 0;
    } else { /* llm_judge：调模型按 criteria 判 */ }
    console.log(c.id, pass ? 'PASS' : 'FAIL', `${Date.now()-t0}ms`);
    process.chdir('../..');
  }
  ```

**✓ 检验**：跑出基线 pass rate，能看到各桶分布。

---

## Task 5.5 · 多维指标报告

- [ ] 改 `eval/run.ts`，每条记录 `{pass, steps(from trace), tokens(sum), cost, ms}`，最后聚合
  ```ts
  // 聚合：passRate / avgSteps / avgTokens / avgCost / 各桶passRate
  ```

**✓ 检验**：能回答「A 改动 pass rate 同但 token 翻倍——算改进吗？」（看综合指标）。

---

## Task 5.6 · SWE-bench-lite 接入

> SWE-bench 是 Python 生态。这一步在 Python 侧。

- [ ] 1. clone & 装
  ```bash
  git clone https://github.com/swe-bench/SWE-bench ../SWE-bench
  pip install -e ../SWE-bench
  ```
- [ ] 2. 读 `run_evaluation.py`，理解流程：`instance(repo快照+issue) → agent 出 patch → Docker 跑 fail-to-pass 测试`
- [ ] 3. 写「预测适配器」`predict.py`：把你的 TS agent 包成 SWE-bench 要的预测接口（给 instance → 调用 agent → 写 `model_patch`）
  ```python
  # 伪结构：遍历 instances，调 subprocess 跑 `npm run dev -- --task=<problem_statement>`
  # 收集 agent 产出的 git diff 作为 model_patch，写到 predictions.jsonl
  ```
- [ ] 4. 取一个小子集先验证管线通：`python -m swebench.harness.run_evaluation ...`

**⚠️ 卡点**：全跑 300 case 很贵；先抽样 10-20 条验证管线，再扩。Docker 镜像拉取慢，预留时间。

---

## Task 5.7 · 基线跑分

- [ ] 1. 在 SWE-bench-lite 抽样 20-50 条跑，记录 pass rate / 成本
- [ ] 2. 与公开榜单对照（理解自己的位置，不必追平）
- [ ] 3. 把分数写进 README（面试展示用）

**✓ 检验**：有一个可复现的基线分数 + 成本。

---

## M5 出口检验

- [ ] trace jsonl 完整，viewer 能回放每步
- [ ] 20-50 case 评测集 + 防污染说明 + 基线 pass rate
- [ ] 多维指标能区分「成功率高但贵」
- [ ] SWE-bench-lite 有可复现基线
- [ ] 能用数据回答「30%→35% 算不算真提升」

完成 → [M6 打磨+复盘](./m6-polish.md)
