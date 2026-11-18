# 仓库重组设计文档

> 日期：2026-07-21
> 状态：待用户审阅
> 范围：全仓重组（双轨制：md 主存储 + JSON 从存储）

---

## 1. 背景与目标

### 1.1 当前痛点

当前仓库是**程序资产与语料资产混合**的结构：

- `atomic-skills/*.json`（143）、`skills/*.json`（43）、`roles/*.json`（23）既是程序数据又是语料
- `app/`（webui + server + orchestration + src）、`docs/`（VitePress）、`scripts/`、`schema/` 分散在根目录
- 根目录夹杂 `test.txt`、`test 2.txt`、`test 3.txt`、`dist/` 等垃圾文件
- 缺少面向"日常智能体使用场景"（信息图、office、工单、养老等）的预留位置

### 1.2 重组目标

> "持续沉淀每一个 Skills 的内涵外延，使用和风险，最终支持养老和日常各种智能体的使用，发挥更大作用，更好的输出质量。"

将仓库重组为：

1. **根目录是中文领域文件夹 + md 语料**（主存储，面向人类与 AI 阅读）
2. **`tools/web/` 收敛所有程序资产**（app/docs/scripts/schema + JSON 从存储）
3. **保持二层目录结构**，文件夹与文件名均为中文简称
4. **双轨制**：md 是事实源，JSON 从 md 生成或手动同步，程序继续可用

### 1.3 非目标

- 不改动 md 语料的内容本身（只做格式转换）
- 不重构 app/src 的业务逻辑
- 不删除任何技能语料（哪怕过时）

---

## 2. 决策清单

经过 8 轮澄清，已确认的决策如下：

| 维度 | 决策 |
|------|------|
| **重组范围** | 双轨制：md 主存储 + JSON 从存储 |
| **目录结构** | 一层中文领域文件夹 + 平铺中文简称 md |
| **分类逻辑** | 场景导向（非技术域） |
| **执行策略** | 一次性完整迁移，**直接在 main 操作**，每阶段独立 commit |
| **JSON 存放** | 集中到 `tools/web/data/` |
| **MD 模板** | 全量转换，信息零丢失（YAML frontmatter + 结构化正文 + 语料沉淀） |
| **tools/web 范围** | app/ + docs/ + scripts/ + schema/ + documentation/ + examples/ + jd-analysis/ |
| **文件夹命名** | 纯中文 |
| **roles 安置** | 独立 `岗位/` 文件夹 |
| **leadership 类** | 独立 `管理/` 文件夹 |
| **领域总数** | **16 个中文文件夹**（14 场景 + 岗位 + 管理） |
| **MD 文件名** | 用 `nameZh`（去标点、空格转连字符） |
| **缺失 nameZh** | 已核查：206 个 JSON 全部有 nameZh，无需补齐 |
| **转换机制** | 可重复 Node.js 脚本（md 已存在不覆盖） |
| **验收关卡** | build/lint/test 全绿 + md 计数与 frontmatter 完整性校验 |
| **清理项** | 删除 `test*.txt`、`dist/`、`docs/.vitepress/cache`、`docs/.vitepress/dist` |
| **skill-lists** | 移入 `tools/web/data/skill-lists/`（程序索引，非语料） |

---

## 3. 目标目录拓扑

```
skills-database/
│
├── 开发/                          # dev: frontend/backend/fullstack/mobile/architecture/api
├── 运维/                          # ops: sre/devops/monitoring/container/infrastructure
├── 安全/                          # security: 36 个 security + cloud-security + compliance
├── 数据/                          # data: data-eng/analytics/etl/warehouse/search
├── AI/                            # ai-llm: 8 个 ai-llm + llm-app-development
├── 测试/                          # testing: 7 个 testing + testing composite
├── 设计/                          # design: ui/ux/design-system/brand
├── 营销/                          # marketing: content/growth/community/customer-success
├── 产品/                          # product: product-manager/user-research
├── 管理/                          # leadership: 风险/利益相关方/团队/战略/供应商
├── 文档/                          # documentation/technical-writing
├── office/                        # 新建：Word/Excel/PPT 语料（种子 README）
├── 信息图/                        # 新建：infographic/可视化（种子 README）
├── 工单/                          # 新建：ticketing/ITSM（种子 README）
├── 生活/                          # 新建：养老/日常场景（种子 README）
├── 岗位/                          # 23 个 roles → md
│
├── tools/
│   └── web/                       # 所有程序资产收敛于此
│       ├── app/                   # 原 app/（webui + server + orchestration + src）
│       ├── docs/                  # 原 docs/（VitePress 站）
│       ├── scripts/               # 原 scripts/ + 根目录 add-resources.cjs
│       ├── schema/                # 原 schema/（3 个 JSON Schema）
│       ├── data/                  # JSON 从存储
│       │   ├── atomic/            # 143 个 atomic-skills JSON
│       │   ├── composite/         # 43 个 skills JSON
│       │   ├── roles/             # 23 个 roles JSON
│       │   └── skill-lists/       # 14 个领域技能树索引
│       ├── documentation/         # 原 documentation/（评估报告）
│       ├── examples/              # 原 examples/
│       └── jd-analysis/           # 原 jd-analysis/
│
├── README.md                      # 重写（反映新结构）
├── AGENTS.md                      # 更新（移除过时相对路径）
├── CLAUDE.md                      # 更新（Key Directories 表格）
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
├── RESTRUCTURE_DESIGN.md          # 本文档
│
├── package.json                   # 更新（deploy.match / scripts 路径）
├── tsconfig.json                  # 更新（include 路径）
├── tsconfig.orchestration.json    # 更新（include 路径）
├── eslint.config.js
├── vitest.config.ts
├── .editorconfig
├── .env.example
└── .gitignore                     # 更新（忽略 tools/web/docs/.vitepress/cache 等）
```

**设计要点：**

1. **16 个领域文件夹**在根目录，命名纯中文
2. **新建 4 个场景**（office/信息图/工单/生活）初期只有 `_index.md`，作为后续语料沉淀的起点
3. **`tools/web/` 五大类**：程序代码（app/docs/scripts/schema）+ 数据（data）+ 项目产物（documentation/examples/jd-analysis）
4. **根目录非语料资产**：README/AGENTS/CLAUDE/CONTRIBUTING/CHANGELOG/LICENSE 保留根目录
5. **配置文件**（package.json/tsconfig/eslint/vitest）保留根目录，但内容需更新路径引用

---

## 4. JSON → MD 转换规范

### 4.1 设计原则

- **信息零丢失**：JSON 的每个字段都在 md 中有对应落位
- **人类可读优先**：表格代替嵌套 JSON，引言代替 description 字段
- **AI 友好**：YAML frontmatter 便于索引，结构化标题便于 RAG 切片
- **可逆**：能从 md 反向生成 JSON（至少覆盖 frontmatter 字段）

### 4.2 Atomic Skill 的 MD 模板

````markdown
---
id: read-file
type: atomic-skill
version: 1.0.0
name: Read File
nameZh: 读取文件
category: filesystem
domain: 开发
tags: [file, io, basic]
author: skills-database-team
---

# 读取文件

> 读取指定路径的文件内容

## 输入

| 参数 | 类型 | 必填 | 默认 | 说明 |
|------|------|------|------|------|
| path | string | ✅ | - | 文件路径（相对或绝对） |
| encoding | string | - | utf-8 | 编码（utf-8/utf-16/ascii/binary） |
| maxSize | number | - | 10485760 | 最大读取字节数 |

## 输出

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | ✅ | 文件内容 |
| size | number | ✅ | 文件大小（字节） |
| encoding | string | - | 实际编码 |
| lastModified | date-time | - | 最后修改时间 |

## 实现

- **类型**: MCP 工具
- **Server**: filesystem
- **Tool**: read_file
- **Fallback**: native `fs.readFileSync`

## 约束

- **权限**: read
- **阻塞路径**: `/etc/passwd`, `/etc/shadow`, `~/.ssh/*`, `**/*.key`, `**/*.pem`
- **大小上限**: 10 MB

## 错误码

| 代码 | 名称 | 信息 | 可重试 |
|------|------|------|--------|
| E001 | FILE_NOT_FOUND | 文件不存在 | ❌ |
| E002 | PERMISSION_DENIED | 权限不足 | ❌ |
| E003 | FILE_TOO_LARGE | 文件超过大小限制 | ❌ |

---

## 语料沉淀

> 读文件看似简单，但路径穿越、编码错乱、超大文件三类问题足以让一个 agent 失控。

### 🎯 核心要点

- 路径必须 resolve + 校验是否落在 workspace 内
- 默认 UTF-8，遇二进制（图片/PDF）走专用 reader
- 超过阈值的大文件应只读前 N 行或返回 stream 句柄
- 隐私敏感文件（.env / id_rsa / *.pem）默认禁读
- 读到的内容不应直接喂给 LLM，要先做 size / 类型判断

### ✅ 最佳实践

- `fs.promises.readFile` + 显式 encoding，避免 Buffer 误用
- 提供 lineRange 参数（startLine / endLine）以支持节选
- 对超大文件用 readline 流式读取，每读一行可终止
- 检测 BOM 并正确处理 UTF-16 / GBK 等遗留编码
- 审计日志记录被读取的 path 与 byteCount

### ❌ 反模式

- 把 10GB 日志一次 readFile 进内存导致 OOM
- 不校验路径直接读取 `../../etc/passwd`
- 盲目把整个文件塞进 LLM prompt 触发上下文超限
- 忽略 EISDIR / ENOENT / EACCES 错误统一抛 generic error
- 读取二进制文件不做 base64 转码导致下游解析错乱

### 📚 参考资料

- [Node.js readline streaming](https://nodejs.org/api/readline.html) (doc)
- [How big is too big? File size in LLM context](https://www.anthropic.com/news/contextual-retrieval) (article)

### 🎓 成熟度分级

| 级别 | 能力描述 |
|------|----------|
| 初级 | 能正确读取小文件、处理常见错误码、识别编码 |
| 中级 | 能流式读大文件、实现 lineRange / 节选、设计路径沙箱 |
| 高级 | 能为 agent 设计读文件策略：分级阈值、敏感路径拦截、与 LLM context 协同 |
````

### 4.3 Composite Skill 的 MD 模板（差异部分）

Composite skill 比 atomic 多一个 **「工作流」** 章节：

````markdown
## 工作流

\`\`\`mermaid
graph LR
  A[读取文件] --> B[语法分析]
  B --> C{聚焦: 安全?}
  C -->|是| D[安全检查]
  B --> E{聚焦: 性能?}
  E -->|是| F[性能分析]
  D --> G[AI 深度审查]
  F --> G
  G --> H[格式化输出]
\`\`\`

### 步骤

1. **读取文件** (`read-file`) → `fileContent`
2. **语法分析** (`analyze-code`, type=syntax) → `syntaxIssues`
3. **安全检查** (`analyze-code`, type=security) — *条件: focus 含 security* → `securityIssues`
4. **性能分析** (`analyze-code`, type=performance) — *条件: focus 含 performance* → `performanceIssues`
5. **AI 深度审查** (LLM) → `reviewResult`
6. **格式化输出** (transform: `formatReviewOutput`) → `finalResult`

**错误处理策略**: continue（失败继续），`llm-review` 失败时 skip-partial-analysis
````

### 4.4 Role 的 MD 模板（差异部分）

Role 比 skill 多 **「职责」「要求」「能力清单」**：

````markdown
## 岗位概要

设计和实现高可用、可扩展的后端服务

## 职责

- 设计 RESTful/GraphQL API
- 数据库设计和优化
- 代码审查和质量把控
- 性能监控和调优

## 任职要求

- **经验**: 5+ years
- **教育**: CS related
- **技能**: Node.js, PostgreSQL, Redis, Docker

## 能力清单

### 主技能（复合）

- [api-design](../开发/API设计.md)
- [database-design](../开发/数据库设计.md)
- [performance-optimization](../开发/性能优化.md)
- [code-review](../开发/代码审查.md)

### 原子技能

- read-file, write-code, run-tests, git-operations, database-query

## 上下文

- **技术栈**: Node.js, Express, PostgreSQL
- **编码规范**: airbnb-base
- **审查标准**: security, performance, maintainability
````

### 4.5 字段映射表

| JSON 路径 | MD 落位 |
|-----------|---------|
| `id` | frontmatter `id` |
| `type` | frontmatter `type` |
| `version` | frontmatter `version` |
| `metadata.name` | frontmatter `name` |
| `metadata.nameZh` | frontmatter `nameZh` + H1 标题 |
| `metadata.description` | frontmatter `description`（英文） |
| `metadata.descriptionZh` | H1 下引言（`> ...`） |
| `metadata.category` | frontmatter `category` |
| `metadata.tags` | frontmatter `tags` |
| `metadata.author` | frontmatter `author` |
| `metadata.domain`（新增） | frontmatter `domain`（由 category-map 生成） |
| `input.schema.properties` | 「输入」表格 |
| `output.schema.properties` | 「输出」表格 |
| `implementation` | 「实现」段落 |
| `constraints` | 「约束」段落 |
| `errors` | 「错误码」表格 |
| `workflow.steps` | 「工作流」章节（含 Mermaid） |
| `errorHandling` | 工作流末尾（错误处理策略） |
| `jd.summary` | 「岗位概要」 |
| `jd.responsibilities` | 「职责」列表 |
| `jd.requirements` | 「任职要求」 |
| `capabilities.mainSkills` | 「主技能」列表（带 md 相对链接） |
| `capabilities.atomicSkills` | 「原子技能」列表 |
| `context` | 「上下文」 |
| `learning.summaryZh` | 「语料沉淀」引言 |
| `learning.keyPoints` | 「🎯 核心要点」 |
| `learning.bestPractices` | 「✅ 最佳实践」 |
| `learning.antiPatterns` | 「❌ 反模式」 |
| `learning.resources` | 「📚 参考资料」 |
| `learning.maturityLevels` | 「🎓 成熟度分级」 |

### 4.6 文件命名规范

```javascript
// nameZh → 文件名
function toFileName(nameZh, id) {
  const cleaned = nameZh
    .replace(/[\/\\:*?"<>|]/g, '')   // 去非法字符
    .replace(/\s+/g, '')              // 去空格
    .replace(/[（）()]/g, '');         // 去括号
  return `${cleaned}.md`;
}

// 重名检测：两个技能 nameZh 相同时
// fallback: `${cleaned}-${id}.md`
// 例如: 代码分析.md vs 代码分析-analyze-code.md
```

---

## 5. 领域归类映射

### 5.1 默认 category → 领域 映射

| 领域 | 涵盖 category | 数量预估 |
|------|---------------|----------|
| **开发** | dev, frontend, backend, fullstack, mobile, microservices, architecture, vcs, linting, api, database, engineering, analysis, network | ~45 |
| **运维** | ops, devops, sre, monitoring, observability, container, infrastructure, logging, system | ~30 |
| **安全** | security, cloud-security, compliance, identity, governance, devsecops | ~40 |
| **数据** | data, analytics, data-engineering, etl, warehouse, search | ~10 |
| **AI** | ai, ai-llm, llm, embeddings | ~10 |
| **测试** | testing, qa, quality, validation, contract-testing | ~8 |
| **设计** | design, ui, ux, brand, design-system | ~5 |
| **营销** | marketing, growth, content, community, customer-success | ~8 |
| **产品** | product, product-management, user-research | ~5 |
| **管理** | leadership | 5 |
| **文档** | documentation, technical-writing | 1-2 |
| **office/信息图/工单/生活** | （新建，无现有语料） | 0（种子） |
| **岗位** | （roles，23 个） | 23 |

> 注：composite skill 的 category 用 `operations/development/quality` 等需在映射表中显式处理。

### 5.2 已确认的边界裁决

| 技能 | 原 category | 归属 | 理由 |
|------|-------------|------|------|
| 风险管理 | leadership | 管理 | 管理类通用 |
| 利益相关方管理 | leadership | 管理 | 管理类通用 |
| 团队领导力 | leadership | 管理 | 管理类通用 |
| 技术战略（基础） | leadership | 管理 | 管理类通用 |
| 供应商管理 | leadership | 管理 | 管理类通用 |
| 性能优化 | engineering | 开发 | 工程实践归开发 |
| SDK 集成 | engineering | 开发 | 工程实践归开发 |
| analyze-code 代码分析 | analysis | 开发 | 代码相关 |
| api-call, api-request | network | 开发 | API 调用是开发基本功 |
| http-health-check, http-request | network | 开发 | HTTP 是开发基础 |
| run-shell-command | system | 运维 | Shell 是运维核心 |

---

## 6. 执行阶段（每阶段独立 commit）

> **分支策略**：直接在 main 操作。每阶段一个 commit。某阶段验收不过时 `git revert` 该 commit。

### 阶段 0：准备

- [ ] 确认 main 分支干净（`git status`）
- [ ] 确认无未推送 commit（`git log origin/main..HEAD`）
- [ ] 创建阶段进度跟踪（本 spec 的第 8 节）

### 阶段 1：收敛 tools/web

**操作：**
```bash
mkdir -p tools/web/data
git mv app tools/web/app
git mv docs tools/web/docs
git mv scripts tools/web/scripts
git mv schema tools/web/schema
git mv documentation tools/web/documentation
git mv examples tools/web/examples
git mv jd-analysis tools/web/jd-analysis
git mv add-resources.cjs tools/web/scripts/add-resources.cjs
git mv skill-lists tools/web/data/skill-lists    # skill-lists 在此阶段一并迁移

# 数据目录的 atomic/composite/roles 子目录在阶段 4-5 由转换脚本创建
# （此时 JSON 还在根目录的 atomic-skills/skills/roles/，阶段 4-5 才迁移）

# 清理
rm -f test.txt "test 2.txt" "test 3.txt"
rm -rf dist
rm -rf tools/web/docs/.vitepress/cache
rm -rf tools/web/docs/.vitepress/dist
```

**路径修复清单**（实施时逐一处理）：

| 文件 | 原引用 | 新引用 |
|------|--------|--------|
| `app/src/__tests__/agent-runtime.test.ts:11` | `join(PROJECT_ROOT, 'atomic-skills')` | `join(PROJECT_ROOT, 'tools/web/data/atomic')` |
| `app/src/__tests__/skillhub-adapter.test.ts:12` | 同上 | 同上 |
| `app/server/index.js` 及相关路由 | `'atomic-skills'` 路径 | `'tools/web/data/atomic'` |
| `scripts/*.cjs`（12 个 enrich/validate） | `'../atomic-skills'` 等 | `'../data/atomic'` |
| `package.json` deploy.match（行 80-83） | `roles/`, `skills/`, `atomic-skills/`, `schema/` | `tools/web/data/roles/` 等 |
| `package.json` scripts.* 中所有路径引用 | 旧路径 | 新路径 |
| `tsconfig.json` include | `src/**/*` 等 | `tools/web/app/src/**/*` |
| `tsconfig.orchestration.json` include | 旧 | 新 |
| `.gitignore` | `dist/`、`node_modules/` 等 | 补充 `tools/web/docs/.vitepress/cache/` |

**验收关卡：**
```bash
npm run build && npm run lint && npm run test
# 三项必须全绿
```

### 阶段 2：补齐 nameZh（**跳过**）

已核查：206 个 JSON 全部有 nameZh，此阶段无需执行。

### 阶段 3：建立 16 个领域骨架

**操作：**
```bash
mkdir -p 开发 运维 安全 数据 AI 测试 设计 营销 产品 管理 文档 office 信息图 工单 生活 岗位
```

**为每个文件夹生成 `_index.md`：**

````markdown
---
domain: 开发
title: 开发领域
技能数: 0   # 初始值，转换后由脚本更新
---

# 开发领域

本领域收录与软件开发相关的原子技能与复合技能，涵盖前端、后端、全栈、移动端、架构设计、API 开发、数据库等。

## 收录范围

- 前端开发：组件设计、状态管理、性能优化
- 后端开发：API 设计、数据库、微服务
- 全栈与移动：跨平台、SDK 集成
- 工程实践：代码审查、版本控制、代码分析

## 技能清单

<!-- 由 tools/web/scripts/json-to-md.cjs --index 自动生成 -->
````

**验收：** 16 个文件夹各含 1 个 `_index.md`。

### 阶段 4：转换 atomic-skills（143 个）

**操作：**
```bash
# 1. 先把 JSON 迁移到 data/atomic/（此时根目录 atomic-skills/ 仍存在便于回退）
mkdir -p tools/web/data/atomic
git mv atomic-skills/*.json tools/web/data/atomic/

# 2. 运行转换
node tools/web/scripts/json-to-md.cjs --type=atomic
```

脚本行为：
1. 读取 `tools/web/data/atomic/*.json`
2. 按 `category` 查 `category-map.cjs` 得出领域
3. 生成 md 到 `{领域}/{nameZh}.md`
4. md 已存在则 SKIP（输出 `SKIP: 开发/读取文件.md`）
5. 重名时用 `{nameZh}-{id}.md` 并打印 WARNING

**验收：**
```bash
# 1. md 计数
find 开发 运维 安全 数据 AI 测试 设计 营销 产品 管理 文档 -name "*.md" ! -name "_index.md" | wc -l
# 必须等于 143（atomic-skills 总数）

# 2. frontmatter 校验
node tools/web/scripts/json-to-md.cjs --validate
# 每个 md 必须含 id/type/nameZh/domain 四个 frontmatter 字段

# 3. JSON 计数
ls tools/web/data/atomic/*.json | wc -l   # 必须等于 143
```

### 阶段 5：转换 skills + roles

**操作：**
```bash
# 迁移 JSON
mkdir -p tools/web/data/composite tools/web/data/roles
git mv skills/*.json tools/web/data/composite/
git mv roles/*.json tools/web/data/roles/

# 运行转换
node tools/web/scripts/json-to-md.cjs --type=composite
node tools/web/scripts/json-to-md.cjs --type=role
```

**验收：**
```bash
# composite
find 开发 运维 安全 数据 AI 测试 设计 营销 产品 管理 文档 -name "*.md" ! -name "_index.md" | wc -l
# 必须等于 186（143 atomic + 43 composite）

# roles
ls 岗位/*.md | wc -l
# 必须等于 23

# JSON 计数
ls tools/web/data/composite/*.json | wc -l   # 43
ls tools/web/data/roles/*.json | wc -l       # 23
```

### 阶段 6：更新入口文档

**操作：**
- 重写 `README.md`：新目录拓扑、新使用方式（"找语料看领域文件夹，跑程序进 tools/web"）
- 更新 `AGENTS.md`：移除 `./schema/role-v1.json` 等过时相对路径，改为 `./tools/web/schema/`
- 更新 `CLAUDE.md`：Key Directories 表格更新
- 更新 `tools/web/docs/.vitepress/config.*`：侧边栏配置指向新位置（但文档源文件保留在 tools/web/docs/ 下）
- 更新 `.gitignore`：添加 `tools/web/docs/.vitepress/cache/`、`tools/web/docs/.vitepress/dist/`

**验收：**
- README 内的目录树与本 spec 第 3 节一致
- 无断链（grep 检查旧路径 `atomic-skills/`、`skills/` 等在 md 中的引用）

### 阶段 7：删除旧空目录

**操作：**
```bash
# skill-lists 已在阶段 1 迁走；atomic-skills/skills/roles 的 JSON 在阶段 4-5 已移走
# 此时这三个目录应为空
rmdir atomic-skills skills roles 2>/dev/null || echo "目录非空，需检查残留文件"
```

**验收：**
```bash
git status   # 干净，所有变更已 commit
ls -d */     # 只有 16 个领域 + tools
```

### 阶段 8：最终验收

```bash
# 程序链路
npm run build && npm run lint && npm run test

# 语料完整性
echo "atomic: $(find 开发 运维 安全 数据 AI 测试 设计 营销 产品 管理 文档 -name '*.md' ! -name '_index.md' | wc -l)"
echo "roles: $(ls 岗位/*.md | wc -l)"
echo "json atomic: $(ls tools/web/data/atomic/*.json | wc -l)"
echo "json composite: $(ls tools/web/data/composite/*.json | wc -l)"
echo "json roles: $(ls tools/web/data/roles/*.json | wc -l)"
# 期望：143 / 23 / 143 / 43 / 23
```

---

## 7. 转换脚本设计

### 7.1 位置

```
tools/web/scripts/json-to-md.cjs          # 主入口
tools/web/scripts/lib/
├── category-map.cjs                       # category → 领域 映射表
├── md-templates.cjs                       # 三套模板（atomic/composite/role）
├── frontmatter.cjs                        # YAML frontmatter 生成
└── naming.cjs                             # nameZh → 文件名 规范化 + 重名检测
```

### 7.2 接口

```bash
node tools/web/scripts/json-to-md.cjs --type=atomic     # 转换 atomic
node tools/web/scripts/json-to-md.cjs --type=composite  # 转换 composite
node tools/web/scripts/json-to-md.cjs --type=role       # 转换 role
node tools/web/scripts/json-to-md.cjs --all             # 全部
node tools/web/scripts/json-to-md.cjs --validate        # 只校验
node tools/web/scripts/json-to-md.cjs --force           # 强制覆盖（模板升级时）
node tools/web/scripts/json-to-md.cjs --index           # 重新生成各领域 _index.md
```

### 7.3 幂等性

| 场景 | 行为 |
|------|------|
| md 不存在 | 生成新文件 |
| md 已存在，未传 `--force` | SKIP，打印 `SKIP: 开发/读取文件.md` |
| md 已存在，传 `--force` | 覆盖（仅用于模板升级，会丢失人工编辑） |
| JSON 缺必填字段 | ERROR，打印缺失字段，跳过该文件 |
| nameZh 重名 | WARNING，使用 `{nameZh}-{id}.md` |

### 7.4 category-map.cjs 核心结构

```javascript
module.exports = {
  // 开发
  'dev': '开发', 'frontend': '开发', 'backend': '开发',
  'fullstack': '开发', 'mobile': '开发', 'microservices': '开发',
  'architecture': '开发', 'vcs': '开发', 'linting': '开发',
  'api': '开发', 'database': '开发', 'engineering': '开发',
  'analysis': '开发', 'network': '开发',
  'development': '开发', 'operations': '运维',  // composite 用

  // 运维
  'ops': '运维', 'devops': '运维', 'sre': '运维',
  'monitoring': '运维', 'observability': '运维',
  'container': '运维', 'system': '运维',

  // 安全
  'security': '安全', 'cloud-security': '安全',

  // 数据
  'data': '数据', 'analytics': '数据',

  // AI
  'ai': 'AI', 'ai-llm': 'AI',

  // 测试
  'testing': '测试', 'quality': '测试', 'validation': '测试',
  'qa': '测试',

  // 设计
  'design': '设计',

  // 营销
  'marketing': '营销', 'growth': '营销',
  'customer-success': '营销',

  // 产品
  'product': '产品',

  // 管理
  'leadership': '管理',

  // 文档
  'documentation': '文档',

  // 兜底
  '_default': '开发',
};
```

> 实施时需逐个 category 核查，可能还有 `cto`、`file`、`filesystem` 等小众值需补充。

---

## 8. 风险与对策

| 风险 | 概率 | 影响 | 对策 |
|------|------|------|------|
| `app/src/*.ts` 的相对路径断裂 | 高 | 高 | 阶段 1 后立即跑 build，逐个修复 import；路径映射见第 6 节阶段 1 |
| `scripts/*.cjs` 的 `require('../atomic-skills/...')` 断裂 | 高 | 中 | 同上，改 `../data/atomic/` |
| `schema/*.json` 的 `$schema` 相对引用断裂 | 中 | 中 | 改为相对于 `tools/web/schema/` 的路径 |
| nameZh 与现有命名冲突 | 中 | 低 | 脚本检测重名，用 `{nameZh}-{id}.md` |
| VitePress 侧边栏引用旧路径 | 中 | 低 | 阶段 6 同步更新 `tools/web/docs/.vitepress/config.*` |
| git rename 检测失败（跨目录大迁移） | 低 | 低 | 用 `git mv -k` 容错，必要时加 `--no-edit` |
| composite 的 category 不在映射表 | 中 | 中 | 脚本对未知 category 打印 WARNING 并归入 `_default`，事后人工复核 |
| main 上中途出错无法整体回滚 | 中 | 高 | 每阶段独立 commit；出错时 `git revert <commit>` 单阶段回退 |
| `package-lock.json` 引用旧路径 | 低 | 低 | `npm install` 重生成 |

---

## 9. 开放问题（实施前需确认）

无。所有决策点已在第 2 节锁定。

---

## 10. 后续工作（超出本次重组范围）

- 为 office/信息图/工单/生活 四个新场景撰写实际语料（本次只放种子 `_index.md`）
- 引入 md ↔ JSON 双向同步的 CI 校验（当前只做单向转换）
- 为 `岗位/` 的每个 role 增加"能力雷达图"（可视化其涉及领域）
- 考虑根目录 md 的全文搜索引擎（如 VitePress 的 local search）
