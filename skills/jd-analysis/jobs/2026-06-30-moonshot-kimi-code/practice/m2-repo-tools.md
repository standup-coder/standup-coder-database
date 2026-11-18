# M2 · 仓库工具集（W3-4）

> [practice 索引](./README.md) ｜ 对应技能：[study/03 阶段I](../study/03-system-engineering.md)
> 目标：给 Agent 配齐「在真实 repo 工作」的工具——编辑/搜索/测试/命令/沙箱/Git，并跑通一个闭环。

**里程碑产出**：Agent 能对一个小 repo 执行「定位 → 改 → 跑测试」。

---

## Task 2.1 · editFile（search-and-replace）

**目标**：精确编辑，处理「搜索串不唯一」歧义（Aider 同款思路）。

- [ ] 写 `src/tools/edit-file.ts`
  ```ts
  import { z } from 'zod';
  import { readFile, writeFile } from 'node:fs/promises';

  export const editFileTool = {
    name: 'edit_file',
    description: '用 search 串定位唯一位置，替换为 replace。search 必须能在文件中唯一匹配。',
    schema: z.object({
      path: z.string(),
      search: z.string().describe('要被替换的原文，须足够独特以唯一匹配'),
      replace: z.string(),
    }),
    execute: async ({ path, search, replace }) => {
      const content = await readFile(path, 'utf8');
      const count = content.split(search).length - 1;
      if (count === 0) return `ERROR: search 未匹配。请先 read_file 确认内容。`;
      if (count > 1) return `ERROR: search 匹配 ${count} 处，不唯一。补充更多上下文使 search 唯一。`;
      await writeFile(path, content.replace(search, replace));
      const verify = await readFile(path, 'utf8'); // 编辑后立即重读验证
      return `OK\n--- 编辑后片段 ---\n${verify.split(replace)[0]?.slice(-200)}${replace}`;
    },
  };
  ```
- [ ] 注册到 `registry.ts` 的 `tools`

**✓ 检验**：① 搜索串唯一时改成功；② 不唯一时返回 ERROR 且不改文件；③ 改后回显片段。
**⚠️ 卡点**：别用整文件重写工具——贵且易丢内容。

---

## Task 2.2 · searchCode（ripgrep 封装）

- [ ] 1. 确认有 rg：`rg --version`（macOS 自带；无则 `brew install ripgrep`）
- [ ] 2. 写 `src/tools/search-code.ts`
  ```ts
  import { z } from 'zod';
  import { execa } from 'execa'; // npm i execa

  export const searchCodeTool = {
    name: 'search_code',
    description: '在仓库里搜代码（正则）。返回 文件:行号:内容，top-N。',
    schema: z.object({
      pattern: z.string(),
      glob: z.string().optional().describe('文件过滤，如 "*.ts"'),
      max: z.number().default(20),
    }),
    execute: async ({ pattern, glob, max }) => {
      try {
        const { stdout } = await execa('rg', [
          '-n', '--', pattern, ...(glob ? ['-g', glob] : []), '.',
        ]);
        return stdout.split('\n').slice(0, max).join('\n') || '(无匹配)';
      } catch (e: any) { return e.stdout ? e.stdout : `(无匹配)`; }
    },
  };
  ```
- [ ] 注册

**✓ 检验**：搜一个函数名，返回带行号的所有命中。

---

## Task 2.3 · runCommand（带超时与退出码）

- [ ] 写 `src/tools/run-command.ts`
  ```ts
  import { z } from 'zod';
  import { execa } from 'execa';

  export const runCommandTool = {
    name: 'run_command',
    description: '执行 shell 命令。返回 stdout/stderr/exitCode。默认超时 60s。',
    schema: z.object({
      command: z.string().describe('完整命令'),
      timeoutMs: z.number().default(60000),
    }),
    execute: async ({ command, timeoutMs }) => {
      try {
        const r = await execa(command, { shell: true, timeout: timeoutMs,
          reject: false }); // 非零退出不抛，自己报 exitCode
        return `exit=${r.exitCode}\n--- stdout ---\n${r.stdout.slice(0, 4000)}\n--- stderr ---\n${r.stderr.slice(0, 2000)}`;
      } catch (e: any) {
        return `ERROR (timeout/kill): ${e.message}`;
      }
    },
  };
  ```
- [ ] 注册

**✓ 检验**：跑 `npm -v` 返回版本；跑 `sleep 5` + `timeoutMs:1000` 返回 timeout。
**⚠️ 卡点**：`reject:false` 让非零退出变成可读信息而非崩溃——错误恢复的基础。

---

## Task 2.4 · runTests（结构化失败）

**目标**：封装「跑测试 + 解析」，喂回模型的是结构化摘要而非原始日志。

- [ ] 写 `src/tools/run-tests.ts`（基于 run_command）
  ```ts
  import { z } from 'zod';
  import { execa } from 'execa';

  export const runTestsTool = {
    name: 'run_tests',
    description: '跑测试，返回结构化 pass/fail 摘要。',
    schema: z.object({ pattern: z.string().optional().describe('只跑匹配的测试文件') }),
    execute: async ({ pattern }) => {
      const r = await execa('npx', ['vitest', 'run', ...(pattern ? [pattern] : [])],
        { shell: true, reject: false, timeout: 120000 });
      const out = r.stdout;
      const failed = (out.match(/✗.*$/gm) || []).slice(0, 10).join('\n');
      const summary = (out.match(/Test Files\s+.*$/m) || ['(no summary)'])[0];
      return `exit=${r.exitCode}\n${summary}\n--- 失败用例(最多10) ---\n${failed}`;
    },
  };
  ```
- [ ] 注册

**✓ 检验**：故意写一个失败测试，模型从「失败用例」行能定位到要改的代码。

---

## Task 2.5 · gitOps（分支/提交/回滚）

- [ ] 1. 装：`npm i simple-git`
- [ ] 2. 写 `src/tools/git.ts`（合并成一个多动作工具，或拆几个）
  ```ts
  import { z } from 'zod';
  import simpleGit from 'simple-git';
  const git = simpleGit();

  export const gitTool = {
    name: 'git',
    description: 'Git 操作：status/diff/branch/commit/checkout/reset',
    schema: z.object({
      action: z.enum(['status', 'diff', 'create_branch', 'commit', 'reset_hard']),
      branch: z.string().optional(),
      message: z.string().optional(),
    }),
    execute: async ({ action, branch, message }) => {
      switch (action) {
        case 'status': return (await git.status()).files.map(f => `${f.index}${f.working_dir} ${f.path}`).join('\n');
        case 'diff': return await git.diff();
        case 'create_branch': await git.checkout(['-b', branch!]); return `branch ${branch}`;
        case 'commit': await git.add('.'); await git.commit(message!); return 'committed';
        case 'reset_hard': await git.raw(['reset', '--hard', 'HEAD']); return 'reset to HEAD';
      }
    },
  };
  ```
- [ ] 注册

**✓ 检验**：开分支→改文件→commit→reset_hard 能回到改前。

---

## Task 2.6 · Docker 沙箱（命令执行隔离）

**目标**：让 `run_command` 在容器里跑，挡住危险命令。

- [ ] 1. 写 `sandbox/Dockerfile`
  ```dockerfile
  FROM node:20-slim
  WORKDIR /repo
  RUN apt-get update && apt-get install -y ripgrep git && rm -rf /var/lib/apt/lists/*
  ```
- [ ] 2. 构建镜像
  ```bash
  docker build -t agent-sandbox ./sandbox
  ```
- [ ] 3. 改 `run-command.ts`：在容器里执行（挂载当前 repo，限网络，超时）
  ```ts
  const r = await execa('docker', [
    'run', '--rm', '--network', 'none',
    '-v', `${process.cwd()}:/repo`, '-w', '/repo',
    '--memory', '512m', 'agent-sandbox',
    'bash', '-lc', command,
  ], { reject: false, timeout: timeoutMs });
  ```
- [ ] 4. （可选）加命令白名单/黑名单前置过滤

**✓ 检验**：`run_command({ command: 'rm -rf /' })` 不影响宿主（容器内受限）。
**⚠️ 卡点**：挂载是双向的——容器能改你 repo，正是要的；但要 `--network none` 防外联。

---

## Task 2.7 · 闭环跑一个 issue

- [ ] 1. 升级 `src/loop.ts` 的 system prompt
  ```
  你是 Coding Agent。工作流：search_code 定位 → read_file 理解 → edit_file 修改 → run_tests 验证。
  改完用 git create_branch+commit。失败就根据测试错误继续修。
  ```
- [ ] 2. 准备一个靶标 repo（可用一个有已知小 bug 的开源项目副本）
- [ ] 3. 跑：`runLoop('修复 issue #X：……预期行为……')`

**✓ 检验**：Agent 自主完成 搜索→读→改→测→提交，测试变绿。

---

## M2 出口检验

- [ ] edit_file 处理「不唯一」歧义，不改坏文件
- [ ] search_code 返回带行号结果
- [ ] run_command 有超时、报 exitCode、不崩
- [ ] run_tests 喂回结构化失败摘要
- [ ] git 能分支/提交/reset
- [ ] Docker 沙箱挡住危险命令
- [ ] 闭环跑通一个真实小 issue（测试变绿）

完成 → [M3 上下文管理](./m3-context.md)
