# 技能库结构性修复 · 执行日志（2026-07-29）

> 本文记录 2026-07 全面评估后的系统性修复过程：动作、工具、修复前后数据对比。
> 评估依据：
> - 执行摘要：[ASSESSMENT_SUMMARY_2026-07.md](./ASSESSMENT_SUMMARY_2026-07.md)
> - 岗位需求维度：[JOB_COVERAGE_ASSESSMENT_2026-07.md](./JOB_COVERAGE_ASSESSMENT_2026-07.md)
> - 个人技能发展维度：[GROWTH_PATH_DESIGN_2026-07.md](./GROWTH_PATH_DESIGN_2026-07.md)
> 取证/复测工具：[`tools/import/validate-refs.js`](../tools/import/validate-refs.js)（`npm run import:validate`）

---

## 一、修复前后数据对比（validate-refs.js 实测）

| 指标 | 修复前（2026-07-29 基线） | 修复后 | 结论 |
|---|---|---|---|
| 技能总数 | 428 | 423（去重 -6、新建 +1） | ✅ |
| 正文死链 | 328 | **0** | ✅ |
| 重复 id | 6 组 | **0** | ✅ |
| type 缺失 | 217 条 external | **0**（脚本补 213 + 归位/去重消化 4） | ✅ |
| level 分布（atomic） | junior 0 / mid 157 / senior 12 | junior 24 / mid 102 / senior 43 | ✅ 三档可用 |
| role 引用可解析 | 23/23 | 23/23 | ✅ 保持 |
| 骨架 composite（占位符步骤） | 42 个中 42 个 | **0**（1 手工范本 + 41 结构化大纲） | ✅ |
| type 分布 | — | atomic 145 / composite 42 / external 213 / role 23 | 基线存档 |

> 修复前基线明细存档于评估当日的 `validate-refs.js --json` 输出（328 条死链清单、6 组重复 id 明细）。

## 二、六项修复的执行明细

### 1. 重复 id 去重（6 组）

- 删除 5 个 `-1` 后缀重复文件；其中 **`backend/search-code-atomic-1.md` 反而是内容更全的富版本**（含完整 schema），处理方式为先用 `-1` 版本覆盖正名文件再删除，避免丢内容
- `sre-engineer` id 冲突（devops atomic 与 roles role 同名）：atomic 改名为 `sre-practices-atomic.md`、id 改为 `sre-practices`，frontmatter 加 `catalogNote` 说明改名缘由

### 2. 归类错误修正（19 个文件归位）

- 19 个错分文件移动到正确领域并同步 `domain` 字段，典型案例：
  - `ai-ml/django-tdd-pro.md` → `testing/`
  - `testing/定价策略.md` → `product/`
  - `security/rust-idiomatic-patterns.md` → `backend/`
- **根因修复**：[`tools/import/classify.js`](../tools/import/classify.js) 新增 `CATEGORY_MAP`（源数据自带 category 字段优先于正则推断），并将测试/前端规则上移到 AI 规则之前，消除"正则先命中先赢"的系统性错分
- **有意不重跑存量归类**：classify 只对新导入生效，避免覆盖本轮手工归位结果

### 3. 正文死链修复（328 → 0）

- 新工具 [`tools/import/fix-links.js`](../tools/import/fix-links.js)（`npm run import:fix-links`，支持 `--dry`）：按"文件基名/id 索引"解析目标，顺序为 基名精确 → 基名+`-atomic` → 基名+`-skill` → id；同域用 `./`、跨域用 `../<domain>/`；无法解析的仅报告不改写
- 自动修复 324 条（集中在 roles/ 正文，成因 = 错 domain + 缺后缀）
- 4 条外部源残留链接手工处置（目标本库未收录，降级为行内代码并中文注明）：
  - `ai-ml/venice-ai-venice-chat.md`（venice-responses 等）
  - `testing/cypress-cypress-author.md`（cypress 子技能）

### 4. level 三档重标定 + external 补 type

- 新工具 [`tools/import/fix-metadata.js`](../tools/import/fix-metadata.js)（`npm run import:fix-metadata`，支持 `--dry`）
- level 判据（显式清单实现，可审计）：
  - **junior**（24 条 Set）：单点操作、无前置依赖（api-call、read-file、run-tests、`*-basics` 等）
  - **senior**（31 条 Set）：权衡取舍/设计决策（system-design、`*-strategy`、team-leadership 等）
  - 其余维持 mid
- 缺 type 的 external 卡片统一补 `type: external`（213 条），明确其"参考资源"而非"能力单元"定位

### 5. 骨架 composite 内容填充（42 → 0 占位符）

- 手工深度范本：[`catalog/backend/api-design-skill.md`](../catalog/backend/api-design.md)（真实的何时使用/不使用 + 每步完整契约）
- 新工具 [`tools/import/fill-composite-steps.js`](../tools/import/fill-composite-steps.js)：为其余 41 个骨架按步骤名语义（analyze/produce/verify/deliver/observe/remediate 七类）生成"目标/输入/输出/失败处理"四要素大纲，场景/反例从自身 description 与 tags 派生
- 升级后的 41 个文件 frontmatter 打 `contentStatus: outline` 标记——**已脱离占位符但仍待人工深化**，人工深化后应改为 `reviewed`（范本即 api-design-skill）

### 6. 工程接线

- `package.json` scripts 新增：`import:fix-links(:dry)`、`import:fix-metadata(:dry)`
- 全部修复后执行 `npm run import:regenerate` 重建 15 个领域 `_index.md`
- 两份评估报告已同步"修复前/修复后"统计与状态标记

## 三、遗留与后续

| 事项 | 状态 | 说明 |
|---|---|---|
| 41 个 `contentStatus: outline` composite 人工深化 | 待办 | 按 api-design-skill 范本逐个 review 后改 `reviewed` |
| 前端 8 条 P0 原子技能补齐 | ✅ 已完成（2026-07-29） | web-performance-audit、accessibility-audit、browser-rendering、bundler-optimization、typescript-advanced、css-architecture、ssr-hydration、micro-frontend 已全部产出（对齐 prompt-engineering-atomic 范本）；库总数 423 → 431，frontend internal 5 → 13 条 |
| 岗位覆盖与成长线全量交付 | ✅ 已完成（2026-07-29） | ① 4 个新 role（frontend-developer/data-analyst/solution-architect/release-engineer，23 → 27）；② 15 条新原子技能（后端 6 + DS 5 + AI 4，参考源含 Anthropic/OWASP/MemGPT-CoALA/Kohavi 等权威资料）；③ 4 条新复合技能（frontend-performance-optimization/ml-experiment-workflow/microservices-design/e2e-test-strategy，按 api-design-skill 深度范本手写）；④ templates/gap-analysis.md 自评模板；⑤ roles/_index 成长线索引（新机制 `_index.append.md`，regenerate 自动拼入不被覆盖）；⑥ 自评适配度 CLI `tools/role-fit.js`（`npm run role:fit`）。库总数 431 → 454，validate 全绿（死链 0/重复 0/必填字段缺失 0） |
| `npm run lint` 失败 | 存量问题 | `eslint.config.js` 引用未安装的 `@typescript-eslint/parser`；本轮新脚本已用 `node --check` 验证语法 |
| 4 条降级为行内代码的外部链接 | 已处置 | 若日后收录对应技能可恢复为链接 |
