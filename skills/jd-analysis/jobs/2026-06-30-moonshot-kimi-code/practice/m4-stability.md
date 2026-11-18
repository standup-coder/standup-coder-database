# M4 · 稳定性：错误恢复 / 长任务续跑 / 最终验证（W7-8）

> [practice 索引](./README.md) ｜ 对应技能：[study/03 阶段III](../study/03-system-engineering.md)
> 目标：解决 JD 点名的三件事——**Agent 出错能自纠、长任务能续跑、交付前能验证**。

**里程碑产出**：错误分类器 + 重试 + 死循环检测 + `--resume` + `verify()`。

---

## Task 4.1 · 错误分类器

**目标**：把工具返回的 ERROR 分类，决定走哪条恢复路径。

- [ ] 写 `src/stability/error-classifier.ts`
  ```ts
  export type ErrType = 'tool_usage' | 'test_failure' | 'env' | 'timeout' | 'unknown';
  export function classify(errMsg: string): ErrType {
    const m = errMsg.toLowerCase();
    if (m.includes('timeout') || m.includes('killed')) return 'timeout';
    if (m.includes('exit=1') || m.includes('✗') || m.includes('failed')) return 'test_failure';
    if (m.includes('enoent') || m.includes('permission') || m.includes('docker')) return 'env';
    if (m.includes('bad args') || m.includes('unknown tool') || m.includes('未匹配')) return 'tool_usage';
    return 'unknown';
  }
  export const hint: Record<ErrType, string> = {
    tool_usage: '检查工具参数；先 read_file 确认内容再 edit。',
    test_failure: '看失败用例，定位到对应代码再改；别只改测试。',
    env: '检查依赖/权限/容器是否就绪。',
    timeout: '命令耗时过长，缩小范围或增加 timeoutMs。',
    unknown: '重新 read_file 观察现状，再决定下一步。',
  };
  ```

**✓ 检验**：给 5 类典型错误串，分类正确。

---

## Task 4.2 · 结构化回喂 + 重试上限

**目标**：工具失败时不静默，把「分类 + hint」喂回模型；同类错误连续 N 次就强制换路。

- [ ] 改 `src/tools/registry.ts` 的 `runTool`，失败时返回带分类的结果
  ```ts
  // runTool 失败分支改为：
  if (...) {
    const raw = `ERROR: ...`;
    const t = classify(raw);
    return `${raw}\n[恢复提示:${t}] ${hint[t]}`;
  }
  ```
- [ ] 在 `loop.ts` 维护 `retryMap: Map<ErrType, number>`；每收到带 `[恢复提示:X]` 的 tool_result，`retryMap[X]++`；超过 3 次注入一句 user 消息：「同类错误已失败 3 次，换一种思路（如重新 search_code / 换文件）。」

**✓ 检验**：构造一个改错文件名的 case，Agent 在 hint 引导下自纠成功。
**⚠️ 卡点**：别无限重试——重试上限是稳定性的底线。

---

## Task 4.3 · 死循环检测

- [ ] 在 `loop.ts` 加：记录每步的 `actionKey = toolName + JSON.stringify(input)`
  ```ts
  const lastActions: string[] = [];
  // 每轮执行工具后 push actionKey，保留最近 4 个
  const dup = lastActions.filter(a => a === current).length;
  if (dup >= 2) {
    messages.push({ role:'user', content:[{type:'text',
      text:'检测到重复动作，你可能在原地打转。停下来回顾已做的，换个方法。'}]});
  }
  ```
- [ ] 配合 `MAX_STEPS` 兜底

**✓ 检验**：构造一个会反复读同一文件的 prompt，系统能打断而非空转。

---

## Task 4.4 · TaskState 持久化（续跑基础）

**目标**：把任务状态每步落盘，进程挂了能恢复。

- [ ] 写 `src/stability/state.ts`
  ```ts
  import { writeFile, readFile, mkdir } from 'node:fs/promises';
  import type { Message } from '../types.js';

  export type TaskState = {
    sessionId: string; goal: string;
    messages: Message[]; step: number;
    gitCommit?: string; updatedAt: string;
  };

  const dir = '.agent-state';
  export async function saveState(s: TaskState) {
    await mkdir(dir, { recursive: true });
    await writeFile(`${dir}/${s.sessionId}.json`, JSON.stringify(s, null, 2));
  }
  export async function loadState(sessionId: string): Promise<TaskState | null> {
    try { return JSON.parse(await readFile(`${dir}/${sessionId}.json`, 'utf8')); }
    catch { return null; }
  }
  ```
- [ ] 在 `loop.ts` 每轮结束 `saveState({ sessionId, goal, messages, step, updatedAt })`

**✓ 检验**：跑几步后 `.agent-state/<id>.json` 存在且内容完整。

---

## Task 4.5 · --resume 续跑

**目标**：`npm run dev -- --resume <id>` 从断点继续；**上下文重建不靠暴力重放**。

- [ ] 1. `src/index.ts` 解析参数
  ```ts
  const resumeId = process.argv.find(a => a.startsWith('--resume'))?.split('=')[1];
  ```
- [ ] 2. `loop.ts` 开头：若有 state，加载 → 用 `compressHistory` 重建精简上下文 → 从 `state.step` 继续
  ```ts
  if (resumeId) {
    const s = await loadState(resumeId);
    if (s) { messages = await compressHistory(s.messages, 4); step = s.step; goal = s.goal; }
  }
  ```
- [ ] 3. 关键节点存 gitCommit：每个里程碑 `gitTool create_branch+commit` 后记下 hash，resume 时可选 `reset --hard` 到该 hash 再继续

**✓ 检验**：跑到一半 `Ctrl+C` → `npm run dev -- --resume=<id>` → 任务最终完成。
**⚠️ 卡点**：能讲清「为什么不用全部历史重放」——省 token、避免重复副作用、状态已持久。

---

## Task 4.6 · verify() · 编译与测试层

**目标**：交付前自动校验，不能只信模型说「我改完了」。

- [ ] 写 `src/stability/verify.ts`
  ```ts
  import { execa } from 'execa';
  export async function verify(goal: string) {
    const checks: string[] = [];
    // 1) 类型/编译
    const t = await execa('npx', ['tsc','--noEmit'], { reject:false });
    checks.push(`[typecheck] exit=${t.exitCode} ${t.exitCode===0?'OK':t.stderr.slice(0,300)}`);
    if (t.exitCode !== 0) return { pass:false, checks };
    // 2) 测试
    const te = await execa('npx', ['vitest','run'], { reject:false, timeout:120000 });
    checks.push(`[tests] exit=${te.exitCode}`);
    if (te.exitCode !== 0) return { pass:false, checks };
    return { pass:true, checks };
  }
  ```

**✓ 检验**：故意留个类型错误，verify 返回 `pass:false` 并指出 typecheck 失败。

---

## Task 4.7 · verify() · diff 审查 + 目标对齐

**目标**：挡住「测试通过但没真解决问题」/「有调试残留」。

- [ ] 1. diff 审查（静态规则）
  ```ts
  const diff = await execa('git',['diff'], { reject:false });
  const smells = ['console.log', 'TODO', 'FIXME', 'XXX']
    .filter(s => diff.stdout.includes(s));
  checks.push(`[diff-lint] ${smells.length? '残留:'+smells.join(',') : 'OK'}`);
  ```
- [ ] 2. 目标对齐（LLM 裁判：产出 diff 是否真的满足原始 goal）
  ```ts
  import { client, MODEL } from '../llm.js';
  const judge = await client.messages.create({ model: MODEL, max_tokens: 200,
    messages: [{ role:'user', content:`任务：${goal}\n改动 diff：\n${diff.stdout.slice(0,6000)}\n
      判断改动是否真正完成任务？只回 JSON：{"ok":true/false,"reason":"..."}`}] });
  ```
- [ ] 3. 把 verify 接到 loop 的「模型说完成」分支：`end_turn` 前先跑 verify，不通过则把 `checks` 喂回让 Agent 继续

**✓ 检验**：能挡住一个「测试绿但改错地方」的 case（goal 对齐返回 `ok:false`）。

---

## M4 出口检验

- [ ] 错误分类器对 5 类错误判定正确
- [ ] 同类错误重试上限生效，Agent 能换路
- [ ] 死循环检测能打断空转
- [ ] kill → resume 能续跑，且能说清上下文重建方式
- [ ] verify() 挡住类型错误 / 测试失败 / diff 残留 / goal 不符
- [ ] 能举出 3 个「测试通过≠完成」的反例

完成 → [M5 可观测+评测](./m5-observability-eval.md)
