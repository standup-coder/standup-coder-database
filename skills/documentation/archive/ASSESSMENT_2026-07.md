# Skills Database 项目整体评估报告（2026-07）

> 评估日期: 2026-07-19
> 评估人: Qoder Agent
> 评估范围: 全项目（数据资产 + 框架代码 + 安全 + 基础设施 + 文档 + 发布）
> 评估深度: 代码级审计 + 数据逐文件抽检 + 依赖/CI/文档全链路
> 关联文档: [EVALUATION_REPORT.md](./EVALUATION_REPORT.md) · [REASSESSMENT_REPORT.md](./REASSESSMENT_REPORT.md) · [COVERAGE_GAP_REPORT.md](./COVERAGE_GAP_REPORT.md)

---

## 一、项目概况

Skills Database 是一个 AI Agent 技能编排框架，核心理念为 **Role = JD = Main Skills Set**——将真实岗位拆解为可组合、可机器消费的技能单元，由运行时编排多 Agent 协作。

| 指标 | 数据 |
|------|------|
| 版本 | v2.0.0 |
| 协议 | MIT |
| Tech Stack | TypeScript 5.3 (strict), ESM, Vitest 1, VitePress 1.0-rc, Express 5, better-sqlite3 12, @modelcontextprotocol/sdk 0.5, @anthropic-ai/sdk 0.24, openai 4, Zod 3.22 |
| 代码量 (app/) | ~4,800 LOC |
| 测试 | 85 tests / 3 files (全部通过) |
| 数据资产 | 22 Roles + 42 Composite Skills + 141 Atomic Skills |
| 文档 | 78 篇 Markdown (VitePress, 中英双语) |
| Git | 17 commits, main 分支 |
| CI/CD | GitHub Actions (build/test/lint + VitePress → GH Pages) |
| WebUI | 125KB 单文件 SPA (vanilla JS, Express 静态服务) |

---

## 二、综合评分

**总评：7.0 / 10（良）**

| 维度 | 评分 | 说明 |
|------|------|------|
| 知识资产质量 | 8.5/10 | 205 个 JSON 实体，交叉引用零断裂；但双语一致性、标签体系、骨架文件有缺陷 |
| 架构设计 | 7.5/10 | 三层分离清晰，MCP 集成真实；双轨运行时、模板语义不统一是结构债 |
| 代码质量 | 6/10 | strict 编译通过；但存在死代码、逻辑 bug、无类型错误体系、N+1 查询 |
| 安全性 | 4.5/10 | Express 有 6 层防护；但核心工具存在 RCE/路径穿越/任意 DB 操作风险 |
| AI 执行层 | 3.5/10 | 核心 LLM 调用全为 mock，`team.collaborate` 结构性不可用 |
| 测试覆盖 | 6/10 | 85 个单测覆盖逻辑路径，缺集成/E2E/安全测试 |
| 文档体系 | 7/10 | VitePress 站点完整；但 AGENTS.md 含大量未实现 API，空目录多 |
| 工程卫生 | 6.5/10 | CI 流水线齐全；依赖严重过时，无发布流水线，残留文件未清理 |
| 发布就绪度 | 4/10 | package.json 结构完整但无 publish 流程，bin 构建缺失，依赖膨胀 |

---

## 三、架构评估

### 3.1 分层结构

```
┌─────────────────────────────────────────────────┐
│  消费层: Server (Express) / CLI / WebUI / Docs  │
├─────────────────────────────────────────────────┤
│  编排层: AgentRuntime / MCPServer / SkillHub    │
├─────────────────────────────────────────────────┤
│  核心层: Agent / Team / Workflow / Role / Skill │
├─────────────────────────────────────────────────┤
│  数据层: 22 Roles + 42 Skills + 141 Atomics    │
│          JSON Schema (draft-07) 强约束          │
└─────────────────────────────────────────────────┘
```

### 3.2 优势

- **MCP 协议真实集成** — 基于官方 `@modelcontextprotocol/sdk` 实现 `StdioServerTransport`，`ListTools` / `CallTool` handler 符合协议规范，错误以 `isError: true` content block 返回。
- **AgentRuntime 事件驱动** — 完整的 `skill:start/complete/error` + `step:start/complete/error/skip` 生命周期，支持 `mcp-tool`、`native`、`api` 三种实现类型。
- **SkillHubAdapter 交叉校验** — 自动检测 role→skill 引用的类型不匹配（`mainRefersAtomic` / `atomicRefersComposite`），单例模式 + `resetDefaultAdapter()` 便于测试。
- **拓扑排序工作流** — Workflow 支持 DAG 依赖解析、条件执行、`stop/continue/fallback` 错误策略。
- **Express 6 层安全** — CORS、API Key、Rate Limiting (120/min)、Input Validation (200 char)、Security Headers、Error Sanitization。
- **SQLite WAL 模式** — `better-sqlite3` 开启 WAL + `foreign_keys = ON`，`ON DELETE CASCADE` 外键约束完整。

### 3.3 结构性问题

| 问题 | 位置 | 影响 |
|------|------|------|
| 双轨运行时并存 | `Agent` (core) vs `AgentRuntime` (orchestration) | API 表面冗余，用户无法判断该用哪个 |
| 模板语义不统一 | `src/utils.ts:67` (undefined→null) vs `orchestration/utils.ts:56` (保留 undefined) vs `agent.ts:437` (保留 undefined) | 同名函数三种行为，"mysterious null" bug 温床 |
| 工作流引用约定冲突 | `Team.executeWorkflow` 用 `{{steps.0.output}}` (位置) vs `Agent.executeCompositeSkill` 用 `results[step.id]` (ID) | 两套模板约定，用户文档无法统一 |
| `dependsOn` 未强制执行 | `AgentRuntime.executeCompositeSkill` 按文件顺序遍历 steps | 声明了 DAG 依赖但实际是线性执行 |
| 无依赖注入 | LLM client、DB、MCP transport 硬编码实例化 | 不可测试替换，不可多 provider |
| `topologicalSort` 无环检测 | `utils.ts:17-41` | `dependsOn` 循环引用导致无限递归 |

---

## 四、知识资产深度审计

### 4.1 规模与覆盖

| 类型 | 数量 | 覆盖率 |
|------|------|--------|
| Roles（岗位） | 22 | 覆盖产品全生命周期：PM/前后端/移动/SRE/安全/数据/CTO/增长/营销/客户成功 |
| Composite Skills（复合技能） | 42 | 涵盖开发、测试、运维、设计、管理五大域 |
| Atomic Skills（原子技能） | 141 | 134 个已富化 (3-5KB)，7 个骨架 (<1KB) |

### 4.2 交叉引用完整性（优秀）

- `role.capabilities.mainSkills` → `skills/<id>.json`: **0 断裂**（全部 22 roles）
- `role.capabilities.atomicSkills` → `atomic-skills/<id>.json`: **0 断裂**（全部 22 roles）
- `composite-skill.workflow.steps[].atomicSkill` → `atomic-skills/<id>.json`: **0 断裂**（全部 42 composites）
- `composite-skill.id` 与文件名一致性: **100%**

### 4.3 Schema 合规性问题

#### 高严重度

| 问题 | 影响范围 | 详情 |
|------|----------|------|
| 14 个 composite skills 引用不存在的 `$schema` | `ci-pipeline-setup`、`code-review`、`docker-container-management` 等 14 个 | 引用 `../schema/skill-v1.json`，实际文件为 `composite-skill-v1.json`。JSON Schema 验证器会报错 |
| 18 个文件完全缺失 `$schema` | 14 composite + 4 atomic (`api-call`、`database-query`、`http-request`、`write-file`) | 无法被 schema 验证工具识别 |
| 9 个 roles 的 `mainSkills` 为空数组 | `product-manager`、`security-engineer`、`mobile-developer` 等 | 这些角色在 composite-skill 图中不可达，是内容缺口而非 schema 违规 |
| 7 个骨架 atomic skills 的 `input.schema.required` 为空 | `api-request`、`git-diff`、`log-parser`、`run-linter`、`search-code`、`write-comment`、`http-request` | 消费方无法推断必传参数 |

#### 中严重度

| 问题 | 影响范围 | 详情 |
|------|----------|------|
| 双语字段名实不符 | 16 roles + 14 composites | `description` 与 `descriptionZh` 内容完全相同（均为中文），`description` 字段承诺英文但未兑现 |
| 17/22 roles 缺少 `systemPrompt` | 仅 7 个新角色有 persona 定义 | 下游 Agent 无法获取角色人设 |
| 标签体系失控 | 444 个唯一标签，285 个 (64%) 仅出现 1 次 | 无受控词表，11 个 atomic skills 含元标签 `"atomic"`（类型信息泄漏到主题标签） |
| k8s 命名不一致 | 6 个 k8s 相关技能 | ID 前缀统一为 `k8s-`，但 display name 混用 "K8s" 和 "Kubernetes" |

#### 低严重度

| 问题 | 影响范围 |
|------|----------|
| 4 个文件 author 为 `"skills-database"` 而非 `"skills-database-team"` | `api-call`、`database-query`、`http-request`、`write-file` |
| 8 个 atomic skills 版本为 `1.1.0`，其余为 `1.0.0`，无 Changelog 说明 | `api-development`、`performance-optimization` 等 |
| `fullstack-developer.json` 的英文 `responsibilities` 字段实际为中文 | 1 个 role |

### 4.4 骨架文件详情（7 个，均 <1KB）

| 文件 | 大小 | 缺失内容 |
|------|------|----------|
| `api-request.json` | 703B | 无 learning、无 errors 定义、无 constraints、input/output schema 为空 |
| `log-parser.json` | 714B | 同上 |
| `run-linter.json` | 715B | 同上 |
| `search-code.json` | 715B | 同上 |
| `git-diff.json` | 726B | 同上 |
| `write-comment.json` | 728B | 同上 |
| `http-request.json` | 957B | 同上 + 无 `$schema`、name 为小写、author 不规范 |

共同特征：无 `learning` 段落、无 `constraints`（permissions/blockedPaths）、`output.schema.properties` 为空、`errors` 为 `{}`。

### 4.5 知识缺口积压（来自 KNOWLEDGE_BACKLOG.json）

- **P1 积压 28 项**：含 4 个角色（`solution-architect`、`ux-researcher`、`qa-engineer`、`release-engineer`）+ 10 个 composite + 14 个 atomic
- **P2 积压 13 项**：全部为 atomic skills
- 典型 P1 缺失：`microservices-design`、`event-driven-architecture`、`saga-pattern`、`cqrs`、`event-sourcing`、`ddd-modeling`、`cache-strategy`、`db-migration`

---

## 五、安全审计

### 5.1 严重（Critical）

| # | 漏洞 | 位置 | 说明 |
|---|------|------|------|
| 1 | **任意命令执行 (RCE)** | `agent.ts:85-100` | `run-shell-command` 工具直接 `execSync(args.command)`，无白名单、无沙箱。若 agent 可被外部输入触达（MCP/API），即为 RCE |
| 2 | **任意文件读写（路径穿越）** | `agent.ts:66-82` | `read-file` / `write-file` 的 `args.path` 无 `path.resolve` 归一化、无沙箱根目录约束。可读取 `/etc/passwd`、写入 `~/.ssh/authorized_keys`。`constraints.blockedPaths` 机制存在但内置工具未调用 |
| 3 | **任意数据库操作** | `agent.ts:203-219` | `database-query` 接受任意 `args.query` 执行 `db.prepare(args.query)`，无语句白名单、无行限制、无事务包裹。与 webapp 共用同一 DB 连接 |
| 4 | **虚假安全验证** | `agent.ts:174-200` | `validate-k8s-manifest` 循环体为空，永远返回 `{ valid: true }`。比无验证更危险——给出错误的安全感 |

### 5.2 高危（High）

| # | 漏洞 | 位置 | 说明 |
|---|------|------|------|
| 5 | API Key 时序攻击 | `server/index.js:80` | `provided === API_KEY` 字符串比较，应使用 `crypto.timingSafeEqual` |
| 6 | `checkConstraints` 可绕过 | `agent-runtime:336-346`、`atomic-skill.ts:56-81` | 朴素 `.includes()` 匹配，`blocked: '**/.ssh'` → `'.ssh'`，`..ssh/foo` 可绕过；无路径归一化，`..` 穿越可规避前缀检查 |
| 7 | 认证默认关闭 | `server/index.js:78` | `if (!API_KEY) return next()` — 未设环境变量时所有 API 公开。生产部署遗忘配置即全裸 |
| 8 | Rate Limiter 内存泄漏 | `server/index.js:14-33` | 内存 Map 按 IP 存储，无淘汰策略。且未设 `trust proxy`，反向代理后所有请求共享代理 IP |
| 9 | N+1 查询 DoS | `db.js:140-163` | `getProjectData` 对每个 role 执行 2 次子查询、每个 skill 执行 2 次子查询。25 roles + 145 skills ≈ 300+ 次查询/请求，无分页 |
| 10 | `JSON.parse` 无保护 | `db.js:130-133` | `mapKpRow` 对 `key_points`/`best_practices`/`common_mistakes` 直接 `JSON.parse`，一行脏数据导致整个 API 500 |

### 5.3 中危（Medium）

| # | 问题 | 位置 |
|---|------|------|
| 11 | LIKE 通配符未转义 | `server/index.js` search 端点 — `%` 和 `_` 可匹配全表 |
| 12 | CORS 无 `Vary: Origin` | `server/index.js:69` — CDN 缓存可能返回错误 origin |
| 13 | MCP `registerTool` 无去重 | `mcp-server/index.ts:110` — 重复注册同名工具导致 `ListTools` 返回重复项 |
| 14 | `getTools()` 暴露可变数组 | `mcp-server/index.ts:169-171` — 调用方可直接修改内部状态 |
| 15 | `MCPServerManager.connectAll` 无容错 | 一个 server 连接失败则全部中止 |
| 16 | `MCPServerManager.disconnectAll` 无 try/catch | 一个 disconnect 失败阻塞其余 |

### 5.4 安全建议

```
优先级 1: 为 read-file/write-file/run-shell-command/database-query 添加沙箱
         - path.resolve + 限制在 projectRoot 内
         - 命令白名单或容器化执行
         - DB 只读连接 + 语句白名单 (SELECT only)

优先级 2: 修复 checkConstraints 为 glob 匹配 (使用 picomatch/minimatch)
优先级 3: API Key 改用 timingSafeEqual，默认认证开启
优先级 4: Rate Limiter 改用 LRU (如 lru-cache)，设置 trust proxy
优先级 5: getProjectData 改为 JOIN 查询 + 分页
```

---

## 六、代码级 Bug 与逻辑缺陷

### 6.1 功能性 Bug

| # | Bug | 位置 | 影响 |
|---|-----|------|------|
| 1 | `team.collaborate()` 结构性不可用 | `team.ts:59-93` | `params.task`（自由文本）被当作 `skillId` 传给 `agent.use()`，必然抛出 "Role X does not have skill: \<task\>"。此方法从未被真正执行过 |
| 2 | `stream()` 双重执行 | `agent.ts:489-501` | 先 yield 4 个硬编码假 chunk，最后再 `await this.use(skillId, inputs)` 真实执行一次。技能被调用两次，且 chunk 与实际结果无关 |
| 3 | `batch()` 无容错 | `agent.ts:517-519` | `Promise.all` — 一个失败全部 reject，无 partial-success 返回 |
| 4 | `AgentConfig.tools` 声明但未使用 | `types.ts:140`、`agent.ts:48-59` | 构造函数忽略 `tools` 字段，文档承诺的预注册不生效 |
| 5 | `validate-k8s-manifest` 永远返回 valid | `agent.ts:174-200` | 循环体为空，`errors` 永远为空数组 |
| 6 | `AgentRuntime` native 工具缺失时静默成功 | `agent-runtime:239-247` | 未注册的工具返回 `{ success: true, output: 'Executed native: ...' }`，调用方无法区分真实执行与空操作 |
| 7 | `AgentRuntime` mcp-tool/api 类型为硬编码 mock | `agent-runtime:249-258` | 返回 `'MCP tool: ...'` 字符串，注释写着 "would go through MCPServerManager"——是 TODO 伪装成代码 |
| 8 | `executeCompositeSkill` 不尊重 `dependsOn` | `agent-runtime:151-215` | 按文件顺序遍历 steps，`dependsOn` 字段被忽略 |
| 9 | `maxConcurrent` 声明但未执行 | `agent-runtime:56` | 无并发控制门控 |
| 10 | `tokenUsage` / `codeLines` 硬编码为 0 | `team.ts:153-155` | 注释承认实现缺失 |

### 6.2 错误处理缺陷

- **无类型化错误类** — 全部 throw 为 `new Error('string')`，无 `SkillNotFoundError`、`ValidationError`、`SecurityError` 等。消费方只能字符串匹配。
- **无全局 unhandledRejection 处理** — 异步 throw 泄漏到事件循环。
- **工具错误形状不一致** — 部分 throw（`read-file`），部分返回 `{ success: false, error }`。调用方无法写统一 handler。
- **错误栈丢失** — 所有 `registerBuiltinTools` 中的 catch 仅捕获 `e.message`，stack 被丢弃。
- **`Team.executeWorkflow` 失败步骤无记录** — 仅成功步骤被 push 到 `outputs`，失败只能通过 `step:error` 事件感知。

### 6.3 API 设计问题

| 问题 | 详情 |
|------|------|
| `ExecutionResult` 未导出 | `agent.ts:27` 定义了返回类型但 `index.ts` 未 export，消费方只能 `any` |
| `TeamExecutionResult` 未导出 | `team.ts:11` 同上 |
| `resolveTemplate` 三种语义 | `src/utils.ts` (undefined→null)、`orchestration/utils.ts` (保留 undefined)、`agent.ts:437` (保留 undefined) — 同名不同行为 |
| `atomic()` 对未知工具返回 `{ success: false }` | 与"工具返回 false"不可区分 |
| `memory` Map 无上限 | 无淘汰策略，长时间运行内存无限增长 |
| CLI bin 构建缺失 | `package.json` 声明 `bin: skills → ./dist/skills-cli.js`，但 `tsconfig.json` include 不覆盖 `app/skills-cli.ts`，`npm run build` 不产出该文件 |

---

## 七、AI 执行层评估（关键短板）

### 7.1 现状

| 组件 | 状态 | 说明 |
|------|------|------|
| `Agent.executeSkill()` | Mock | 硬编码 `knownOutputs`：code-review→85, api-design→固定 spec, architecture-design→固定输出 |
| `Agent.executeLlmStep()` | Mock | 调用 `chat` 工具仅返回 `{ role, prompt, context }` echo，无模型推理 |
| `AgentRuntime` native | 半实现 | 从注册表取工具函数，但缺失时静默成功 |
| `AgentRuntime` mcp-tool | Mock | 返回硬编码字符串，注释为 TODO |
| `AgentRuntime` api | Mock | 同上 |
| `Team.collaborate()` | 不可用 | 结构性 bug（见 §6.1 #1） |
| LLM SDK 集成 | 仅依赖引入 | `@anthropic-ai/sdk` 和 `openai` 在 package.json 中，源码零调用 |

### 7.2 影响

- 框架无法开箱即用地完成任何真实 AI 任务。
- 用户安装后拉取 ~50MB 未使用的 SDK 依赖。
- 与 README/AGENTS.md 中"运行第一个 Agent"的叙事产生严重预期落差。
- `team.collaborate()` 是 AGENTS.md 的核心示例，但实际调用必然报错。

---

## 八、依赖健康度

### 8.1 版本过时分析

| 依赖 | 当前版本 | 最新稳定版 | 差距 | 风险 |
|------|----------|------------|------|------|
| `@anthropic-ai/sdk` | ^0.24.0 | 0.40+ | 16+ 个 minor | pre-1.0 有 breaking changes |
| `@modelcontextprotocol/sdk` | ^0.5.0 | 1.x | 主版本 | API 完全重写 |
| `openai` | ^4.0.0 | 5.x | 主版本 | caret 可能引入 breaking |
| `zod` | ^3.22.0 | 4.x | 主版本 | zod 4 有迁移成本 |
| `typescript` | ^5.3.0 | 5.7+ | 4 个 minor | 缺少新特性但无 breaking |
| `vitest` | ^1.0.0 | 3.x | 2 个主版本 | API 变化显著 |
| `vitepress` | ^1.0.0-rc.45 | 1.6.x | RC → stable | 可能有 breaking |

### 8.2 依赖膨胀

`@anthropic-ai/sdk`、`@modelcontextprotocol/sdk`、`openai` 作为 runtime dependencies 安装，但源码中 **零实际调用**。用户 `npm install skills-database` 会拉取 ~50MB 未使用的 SDK 包。

**建议**：移至 `optionalDependencies` 或 `peerDependencies`，待 LLM 层实现后再提升为 runtime dep。

---

## 九、文档与开发者体验

### 9.1 文档覆盖度

| 必需项 | 状态 | 说明 |
|--------|------|------|
| Getting Started | ✅ 存在但有冗余 | 3 个 quick-start 文件（`quick-start.md`、`quick-start_zh.md`、`quickstart.md`），内容可能分歧 |
| Core Concepts | ✅ | `docs/concepts/` 完整 |
| API Reference | ❌ 空目录 | `docs/reference/` 为空，导航死链 |
| Examples | ❌ 空目录 | `docs/examples/{multi-agent,single-agent,real-world}/` 全空；真实 examples 在 repo 根目录 |
| Role/Skill Catalog | ❌ 空目录 | `docs/roles/`、`docs/skills/` 为空 |
| Ecosystem | ✅ | 6 篇生态集成文档 |
| English Locale | ❌ | VitePress 仅配置 `zh-CN`，英文文档无法通过站点访问 |

### 9.2 AGENTS.md 与实际 API 偏差

AGENTS.md 作为核心开发者协议，包含大量 **未实现的 API**：

| 文档中的 API | 实际状态 |
|-------------|----------|
| `import { Tracer, Metrics } from 'skills-database'` | 未导出，不存在 |
| `new SharedContext()` | 未导出，不存在 |
| `agent.addSkill(customSkill)` | 未导出 |
| `agent.stream(skill, input)` | 存在但有 bug（双重执行） |
| `agent.batch(skill, inputs[])` | 存在但无容错 |
| `Team.diagnose({...})` | 不存在 |
| `agent.execute(task, { fallback, retry, timeout })` | 方法名为 `use()`，无 fallback/retry/timeout 选项 |
| `metrics.export('prometheus', { port })` | 不存在 |
| `tracer.generateReport()` | 不存在 |

**影响**：按 AGENTS.md 编写的代码无法运行，严重损害框架可信度。

### 9.3 CLAUDE.md 偏差

- 声明 "16 roles"，实际为 22 roles（过时）。
- 其余内容与代码基本一致。

### 9.4 Examples 可运行性

| 文件 | 可运行？ | 问题 |
|------|----------|------|
| `single-agent-task/code-review-example.js` | ❌ | import from `'skills-database'`（未发布）；引用 MCPServer 子路径 |
| `multi-agent-project/feature-development.js` | ❌ | 同上 + 使用 `team.collaborate()`（结构性 bug） |
| `ops-demo.js` | ❌ | 引用不存在的 `./examples/deployment.yaml` 和 `./examples/app.log` |

三个示例均不可直接运行，是演示代码而非验证测试。

### 9.5 残留/过时文件

| 文件 | 问题 |
|------|------|
| `.github/PULL_REQUEST_TEMPLATE.md` | 仍为 pre-2.0 "Vibe Coding" 内容，与框架定位不符 |
| `.github/ISSUE_TEMPLATE/` | 空目录 |
| `docs/public/logo-v1~v6.svg` | 6 个 logo 迭代版本未清理 |
| `data/skills-database.db` | 1.2MB 二进制入库，应由 `npm run seed` 重建 |
| 根目录 `test 2.txt`、`test 3.txt` | 5 字节测试残留 |

---

## 十、发布就绪度

### 10.1 当前状态

| 项目 | 状态 |
|------|------|
| `package.json` 结构 | ✅ 完整的 `exports`、`files`、`bin`、`license` |
| `npm publish` 脚本 | ❌ 无 |
| `prepublishOnly` hook | ❌ 无 |
| GitHub Actions release workflow | ❌ 无 |
| 版本标签自动化 | ❌ 无 |
| CHANGELOG 自动生成 | ❌ 手动维护 |
| Dependabot/Renovate | ❌ 无 |
| SECURITY.md | ❌ 无 |
| CODEOWNERS | ❌ 无 |

### 10.2 构建缺陷

- `bin: skills → ./dist/skills-cli.js`，但 `tsconfig.json` 的 `include` 不覆盖 `app/skills-cli.ts`。`npm run build` 不产出该文件。
- `dist/orchestration/utils.js` 不在 `./orchestration/*` exports 模式内，消费方不可导入。
- `files` 数组未包含 `CLAUDE.md`（仅 `AGENTS.md`）。

### 10.3 发布前必须修复

1. 将 `app/skills-cli.ts` 纳入构建（扩展 tsconfig include 或独立 tsc 调用）
2. 添加 `prepublishOnly: "npm run build && npm test"` 脚本
3. 创建 `release.yml` workflow（tag → build → test → publish）
4. 将未使用的 LLM SDK 移至 `optionalDependencies`
5. 修复 14 个 composite skills 的 `$schema` 引用

---

## 十一、测试评估

### 11.1 现状

- **85 个单测**，全部通过
- 分布：Role/Agent/Workflow/Team/CompositeSkill/AtomicSkill (30) + AgentRuntime (19) + SkillHubAdapter (33) + getDefaultAdapter (3)
- 测试策略：绕开 mock 路径，验证纯逻辑（拓扑排序、模板解析、schema 校验、类型检测）

### 11.2 覆盖盲区

| 缺失类型 | 具体目标 |
|----------|----------|
| 集成测试 | MCP server 启停 + tool 调用、Express API CRUD + 安全层、Workflow 3-step DAG |
| E2E 测试 | CLI `skills add/list/done` 命令链路、WebUI 渲染 |
| 安全测试 | 路径穿越、命令注入、SQL 注入、rate limit 绕过 |
| 错误路径 | `team.collaborate` 失败、`batch` partial failure、MCP disconnect 中途 |
| 性能测试 | `getProjectData` N+1 查询、大文件 read、并发 rate limit |
| 数据验证 | JSON Schema 合规性自动化（当前仅手动脚本） |

### 11.3 测试基础设施

- Vitest 1.x（过时，当前 3.x）
- 无 coverage 报告配置
- 无 mutation testing
- CI 中无 coverage gate

---

## 十二、与上次评估对比（2026-05-23 → 2026-07-19）

| 指标 | 05-23 | 07-19 | 变化 |
|------|-------|-------|------|
| Roles | 16 | 22 | +6 |
| Composite Skills | 28 | 42 | +14 |
| Atomic Skills | 126 | 141 | +15 |
| 测试数 | 82 | 85 | +3 |
| 骨架文件 | ~10 | 7 | -3 |
| CI/CD | 无 | 2 workflows | 新增 |
| ESLint errors | 2 | 0 | 修复 |
| 文档页数 | 77 | 78 | +1 |
| 交叉引用断裂 | 未测 | 0 | 验证通过 |
| 安全层 | 6 层 Express | 同 | 未变 |
| LLM 集成 | Mock | Mock | 未变 |
| 依赖版本 | 过时 | 更过时 | 恶化 |

**趋势判断**：数据资产稳步扩充且引用完整性优秀，工程卫生持续改善。但 AI 执行层零进展，依赖债务加深，安全深层问题（RCE/路径穿越）未被触及。

---

## 十三、改进建议（按优先级排序）

### P0 — 安全加固（阻断性风险）

```typescript
// 1. 文件操作沙箱
import { resolve, normalize } from 'path';

function safePath(userPath: string, sandboxRoot: string): string {
  const resolved = resolve(sandboxRoot, normalize(userPath));
  if (!resolved.startsWith(sandboxRoot)) {
    throw new SecurityError(`Path traversal blocked: ${userPath}`);
  }
  return resolved;
}

// 2. 命令执行白名单
const ALLOWED_COMMANDS = ['git', 'npm', 'node', 'tsc', 'eslint'];
function safeExec(command: string): string {
  const bin = command.split(' ')[0];
  if (!ALLOWED_COMMANDS.includes(bin)) {
    throw new SecurityError(`Command not allowed: ${bin}`);
  }
  return command;
}

// 3. DB 只读 + 语句白名单
const READONLY_PATTERN = /^\s*SELECT\s/i;
function safeQuery(sql: string): void {
  if (!READONLY_PATTERN.test(sql)) {
    throw new SecurityError('Only SELECT statements allowed');
  }
}
```

- 修复 `checkConstraints` 为 glob 匹配（使用 `picomatch`）
- API Key 改用 `crypto.timingSafeEqual`
- 默认认证开启（未设 API_KEY 时拒绝启动或返回 503）

### P1 — 接通真实 LLM（核心突破点）

```typescript
class LlmExecutor {
  constructor(private client: OpenAI | Anthropic) {}

  async execute(step: WorkflowStep, context: ExecutionContext): Promise<StepOutput> {
    const messages = this.buildMessages(step, context);
    const response = await this.client.chat.completions.create({
      model: step.config.model ?? 'gpt-4',
      messages,
      tools: this.resolveTools(step),
    });
    return this.parseResponse(response);
  }
}
```

- 在 `AgentRuntime` 中注册为 `llm` 类型 step handler
- 保留 mock 模式作为 `--dry-run` 选项，不再作为默认
- 将 LLM SDK 从 `dependencies` 提升为实际调用

### P2 — 统一运行时 + 修复结构性 Bug

- 废弃 `Agent.knownOutputs`，将 `Agent` 重定位为 `AgentRuntime` 的 facade
- 修复 `team.collaborate()`：将 `params.task` 作为自然语言任务分发，而非 skillId
- 统一 `resolveTemplate` 为单一实现（选定 null-coercion 语义）
- 统一工作流引用约定为 ID-based（`{{steps.<stepId>.output}}`）
- `AgentRuntime.executeCompositeSkill` 加入拓扑排序
- 添加 `topologicalSort` 环检测

### P3 — 数据资产修复

- 修复 14 个 composite skills 的 `$schema` → `../schema/composite-skill-v1.json`
- 为 18 个缺失 `$schema` 的文件补充
- 完成 7 个骨架文件 enrichment
- 建立受控标签词表（目标：将 444 个标签收敛至 ~80 个）
- 为 9 个空 `mainSkills` 的角色补充 composite skill 引用
- 修复双语字段（16 roles + 14 composites 的 `description` 应为英文）

### P4 — 文档对齐

- AGENTS.md：移除或标注所有未实现 API（Tracer、Metrics、SharedContext、diagnose 等）为 "Planned"
- CLAUDE.md：更新 role 数量为 22
- 清理空目录（`docs/reference/`、`docs/roles/`、`docs/skills/`、`docs/examples/*/`）或填充内容
- 合并 3 个 quick-start 文件为 1 个
- 更新 PR 模板（移除 Vibe Coding 内容）
- 添加 VitePress 英文 locale 配置

### P5 — 发布流水线

- 修复 `skills-cli.ts` 构建（纳入 tsconfig 或独立 tsc）
- 添加 `release.yml`（tag → build → test → npm publish）
- 添加 `prepublishOnly` 脚本
- 将 LLM SDK 移至 `optionalDependencies`
- 添加 Dependabot 配置
- 添加 SECURITY.md

### P6 — 测试补全

| 测试类型 | 覆盖目标 |
|----------|----------|
| 安全测试 | 路径穿越、命令注入、SQL 注入、rate limit |
| 集成测试 | MCP server 启停、Express API CRUD、Workflow DAG |
| E2E 测试 | CLI 命令链路、WebUI 渲染 |
| Schema 合规 | JSON Schema 自动化验证纳入 CI |
| Coverage gate | 配置 vitest coverage，CI 设阈值 |

### P7 — 依赖升级

| 优先级 | 依赖 | 目标 |
|--------|------|------|
| 高 | `@modelcontextprotocol/sdk` | 0.5 → 1.x（API 重写，需适配） |
| 高 | `@anthropic-ai/sdk` | 0.24 → 0.40+（pre-1.0 breaking） |
| 中 | `vitest` | 1.x → 3.x |
| 中 | `vitepress` | rc → 1.6 stable |
| 低 | `zod` | 3 → 4（待生态稳定） |
| 低 | `typescript` | 5.3 → 5.7 |

---

## 十四、定位建议

基于当前状态，建议明确 **三阶段演进**：

| 阶段 | 时间 | 定位 | 关键动作 |
|------|------|------|----------|
| 当前 | — | 高质量岗位技能知识库 + 编排规范 | 数据资产 9/10，可被任意 Agent 框架消费 |
| 短期 | 1-2 周 | 安全可信的参考实现 | P0 安全加固 + P2 bug 修复 + P3 数据修复 |
| 中期 | 1-2 月 | 可独立运行的 Agent SDK | P1 接通 LLM + P5 发布流水线 + P6 测试补全 |

**核心判断**：项目的数据资产层已达到生产可用水平（交叉引用零断裂、schema 严格、learning 段落丰富），但框架层存在安全漏洞和结构性 bug，不宜在当前状态下面向不可信输入部署。优先修复安全问题，再接通 LLM，最后完善发布流程。

---

## 十五、总结

Skills Database 的知识资产层是其核心竞争力——205 个结构化 JSON 实体、零断裂的交叉引用、严格的 Schema 约束、丰富的 learning 段落，在同类项目中属上乘。

但框架层存在三个层面的问题需要正视：
1. **安全层**：核心工具（文件/命令/DB）无沙箱，存在 RCE 和路径穿越风险
2. **逻辑层**：`team.collaborate` 结构性不可用、`stream` 双重执行、`dependsOn` 未执行
3. **集成层**：LLM 全为 mock、依赖严重过时、无发布流水线

**下一步优先级**：安全加固 → 修复结构性 bug → 接通 LLM → 数据修复 → 发布流水线。

---

*报告生成: 2026-07-19 | Qoder Agent | 基于项目 commit 196bd41*
*审计方法: 全量代码阅读 + 数据逐文件抽检 + 依赖版本比对 + 安全威胁建模*
