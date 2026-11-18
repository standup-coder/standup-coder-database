# 个人技能发展维度设计报告（Growth Path Design）

> 生成时间：2026-07-29
> 评估对象：三层技能模型（Role → Composite → Atomic）作为**个人成长路径**的可用性
> 姊妹篇：[岗位需求维度评估](./JOB_COVERAGE_ASSESSMENT_2026-07.md) · 实测数据同源（`npm run import:validate`）

---

## 一、三层模型的作用与关联关系（现状解读）

```
Role（23，岗位画像）            ＝ 目标态：一个岗位 = mainSkills + atomicSkills 的集合
  │  frontmatter: mainSkills / atomicSkills（实测 23/23 引用全部可解析 ✅）
  ▼
Composite Skill（42，-skill 后缀）＝ 工作流：多步骤、有输入输出契约与错误策略
  │  frontmatter: workflow steps → 每步指向 atomic skill
  ▼
Atomic Skill（146，-atomic 后缀） ＝ 最小能力单元：单一操作 + 分级掌握（Junior/Mid/Senior）
```

三类文件对个人学习者的实际语义（现状质量列为 2026-07-29 修复前的评估，修复后状态见 [REPAIR_LOG_2026-07.md](./REPAIR_LOG_2026-07.md)）：

| 类型 | 学习语义 | 范例 | 现状质量 |
|---|---|---|---|
| role | **"我要成为谁"** — 岗位定位与差距清单 | [ai-agent-engineer](../catalog/roles/ai-agent-engineer.md) | 结构好，但正文链接死链、"一句话能力"全是占位符 |
| composite-skill | **"我能完成什么工作流"** — 面试中的项目经验单元 | [api-design-skill](../catalog/backend/api-design.md) | 两极分化：第四轮新增的有肉，JSON 转换的是骨架 |
| atomic-skill | **"我掌握什么操作"** — 可勾选、可自测的最小单元 | [prompt-engineering-atomic](../catalog/ai-ml/prompt-engineering.md) | 最佳资产，含反模式+分级掌握+资源 |
| external | **"参考资料"** — vendor 卡片，不是能力单元 | [django-tdd-pro](../catalog/testing/django-tdd-pro.md) | 是索引卡不是教材，应明确降级为"资源引用" |

**关键判断**：这个模型天然就是"技能蒸馏"结构——atomic 是蒸馏出的最小知识单元，composite 是组合应用，role 是岗位适配面。骨架已经对，问题在三处断点（**2026-07-29 已全部修复**，以下保留作为历史诊断记录）：

1. **向下断**：role 正文的 328 个死链让"从岗位跳到技能"走不通（如 fullstack-developer 链到不存在的 `../frontend/api-design.md`，实际在 `backend/api-design-skill.md`）。→ 已由 `npm run import:fix-links` 全量修复，死链归零。
2. **层级失真**：level 分布为 mid 157 / senior 12 / junior 0——学习者无法按自身水平切入，"Junior 该学哪 20 条"无法回答。→ 已按 §3.3 判据重标定：junior 24 / mid 90 / senior 31（atomic）。
3. **external 未分层**：217 条外部技能（占 51%）游离在三层模型之外，学习者分不清"能力"与"资料"。→ 已全部补 `type: external` 字段，可按层筛选；"降级为参考资源引用"的规范化仍为 P1。

---

## 二、从分类体系到成长路径的转换设计

### 2.1 岗位定位三步法（利用现有资产即可运转）

```
Step 1 选岗   → catalog/roles/<role>.md         （读职责 + 经验门槛，确认目标）
Step 2 盘差距 → role.atomicSkills ∪ mainSkills   （逐条对照"分级掌握"节自评 0-3 分）
Step 3 排计划 → personal/picked.md               （差距按 P0/P1 排序，引用 catalog 相对路径）
```

这套流程与 `personal/` 目录的 picked/in-progress/learned 设计**完全兼容**，建议在 [personal/README.md](../personal/README.md) 增加一个 `gap-analysis.md` 推荐文件：一张"目标 role × 技能自评"表（模板见 §四）。

### 2.2 学习顺序原则（技能蒸馏的正确食用方式）

以 **AI Agent 工程师** 路径为例（技能全部已在库）：

```
第一阶段 · 原子打底（4-6 周）
  prompt-engineering → embeddings-design → vector-search → rag-pipeline
  （顺序依据：后者的输入依赖前者的输出概念）
第二阶段 · 原子进阶（4 周）
  tool-use-design → agent-orchestration → llm-evaluation → agent-evaluation
第三阶段 · 复合串联（4-6 周，产出项目）
  llm-app-development（把 8 个原子串成端到端 RAG 应用）
  agent-orchestration-design（多 Agent 协作系统）
第四阶段 · 岗位对齐（持续）
  对照 ai-agent-engineer role 的 responsibilities 逐条找真实场景演练
  接入 jd-analysis/ 专项：对照真实 JD 做 study/practice 双轨
```

通用规则：**原子技能按"概念依赖"排序 → 复合技能作为阶段项目产出 → role 作为验收面**。每个领域的 `_index.md` 目前按中文名排序，无法表达该顺序——建议在各 role 正文的「学习路径」节落地岗位专属顺序（见 §六 P1）。

### 2.3 与 jd-analysis/ 专项的闭环

库内已有一个被低估的资产：`jd-analysis/`（JD 解析 → study 按维度 / practice 按里程碑）。它就是"岗位适配度评估"的实战版。建议明确双向连接：

- jd-analysis 解析出的技能 → 先查 catalog 是否已有，有则直接引用（现在只查 `shared/skills-library.md`，应扩大到 catalog）
- catalog role 的学习路径末尾 → 链到 jd-analysis 对应岗位目录（如 ai-agent-engineer ↔ `jobs/2026-06-30-moonshot-kimi-code/`）

---

## 三、可衡量能力指标的转化方案

### 3.1 现有量化基础

atomic-skill 模板已含 `maturityLevels`（junior/mid/senior 三档行为描述），这是最好的量化锚点，但只有描述、没有**可验证的判据**。

### 3.2 建议的能力评分模型（0-3 分制）

| 分值 | 定义 | 验证方式 |
|---|---|---|
| 0 未接触 | 未读过该 skill | — |
| 1 了解 | 能复述"核心要点"，识别"反模式" | 自测：不看文档列出 ≥3 条要点 |
| 2 会用 | 达到"分级掌握 · Mid"描述的行为 | 完成该 skill 参与的 1 个 composite 工作流 |
| 3 精通 | 达到 Senior 描述 + 能教别人/能改进流程 | 有产出物（项目/文章/内部分享）可举证 |

**岗位适配度** = 对目标 role 的技能清单加权求和：

```
适配度 = ( Σ mainSkill 得分 × 2 + Σ atomicSkill 得分 × 1 ) / 满分 × 100%
门槛参考：≥60% 可投递 · ≥75% 有竞争力 · <40% 先补原子层
```

该公式的所有输入都能从现有 frontmatter（role 的 mainSkills/atomicSkills + atomic 的 maturityLevels）机械提取，未来可做成 `tools/` 下的自评 CLI；当前先以 Markdown 表格人工维护即可（模板见 §四）。

### 3.3 让指标可信的前置修复

1. **level 三档补全**：为 atomic 重新标定 level（此前 junior 0 条不真实——read-file、write-file 显然是 junior）。判据：junior=单点操作无前置依赖；mid=需组合 2+ 概念或处理边界；senior=需权衡取舍/设计决策。→ ✅ 已由 `tools/import/fix-metadata.js` 落地。
2. **骨架 composite 补契约**：没有输入输出契约的工作流无法作为"2 分=完成工作流"的验证载体。→ ✅ 已完成：`api-design-skill` 手工深化为全库范本，其余 41 个骨架由 `tools/import/fill-composite-steps.js` 升级为四要素契约大纲（frontmatter 标 `contentStatus: outline`，人工深化后改为 reviewed）。
3. **external 定位改造**：把 external 卡片在各 skill 的"参考资源"节引用（如 django-tdd-pro 应成为 testing/write-unit-tests 的资源，而非平级技能），学习进度只统计 internal 三层。

---

## 四、personal/ 侧模板（建议新增 gap-analysis.md）

```markdown
# 岗位差距分析 · <目标 role>

> 目标：[ai-agent-engineer](../catalog/roles/ai-agent-engineer.md) · 评估日期：YYYY-MM-DD

| 技能 | 层 | 权重 | 自评(0-3) | 证据 | 计划 |
|---|---|---|---|---|---|
| [prompt-engineering](../catalog/ai-ml/prompt-engineering.md) | atomic | 1 | 2 | 完成 XX 项目 prompt 治理 | 补评估集实践 → 3 |
| [llm-app-development](../catalog/ai-ml/llm-app-development.md) | main | 2 | 1 | 仅读过 | Q3 完成端到端 RAG demo |
| … | | | | | |

**适配度：58%**（门槛 60%，差 X 分 → 优先补 llm-evaluation、agent-orchestration）
```

---

## 五、进阶路径的领域串联（跨 role 成长线）

三层模型还支持"角色跃迁"视角，建议在 roles/_index.md 增加成长线索引：

```
执行线：backend-developer → backend-architect → cto
        senior-frontend-dev → fullstack-developer → backend-architect
数据线：data-engineer ⇄ data-scientist →（未来）mlops-engineer
AI 线： backend-developer → ai-ml-engineer → ai-agent-engineer
平台线：devops-engineer → sre-engineer → platform-engineer
管理线：任意 senior → engineering-manager → cto
```

每条跃迁边的语义 = 两个 role 的技能集差集，即"跃迁需要补的技能清单"——这也是 role 模板中 `relatedRoles` 字段的正确用法（当前 23 个 role 全部留空，正文写着"_此节由后续 skill-relationship 工具生成_"，建议先人工填 1-2 条再谈工具化）。

---

## 六、改进行动清单（个人发展维度）

> 2026-07-29 更新：P0 全部完成，P1 成长线索引与 P2 自评 CLI 已交付（见 [REPAIR_LOG_2026-07.md](./REPAIR_LOG_2026-07.md)）。

| 优先级 | 动作 | 产出位置 | 状态 |
|---|---|---|---|
| P0 | 修复 role 正文死链（重新生成"核心能力/基础操作"节的相对路径） | `tools/import/fix-links.js`（已落地，`npm run import:fix-links`） | ✅ 已完成（324 条自动 + 4 条手工） |
| P0 | atomic level 重标定（junior/mid/senior 三档补全） | `tools/import/fix-metadata.js`（已落地，判据见脚本头注释） | ✅ 已完成（junior 24 / mid 90 / senior 31） |
| P0 | personal/ 增加 gap-analysis.md 模板（§四） | `templates/gap-analysis.md`（personal/* 被 gitignore，模板入库受版本控制）+ `personal/README.md` 指引 | ✅ 已完成（2026-07-29） |
| P1 | 每个 role 的学习路径节替换掉"通用三段套话"，写岗位专属顺序（参照 §二.2） | catalog/roles/*.md | 部分完成（新建 4 个 role 已按岗位专属顺序编写，存量 23 个待回填） |
| P1 | roles/_index.md 增加成长线索引（§五）+ relatedRoles 人工回填 | `catalog/roles/_index.append.md`（regenerate 时自动拼入 _index.md，不会被脚本覆盖） | ✅ 已完成（2026-07-29，8 条成长线） |
| P1 | external 降级为"参考资源"引用，学习统计只算 internal | 规范写入 CONTRIBUTING.md | 部分完成（已全量补 `type: external` 可按层筛选） |
| P2 | 自评 CLI（读 role 技能清单 + personal 评分 → 输出适配度） | `tools/role-fit.js`（`npm run role:fit`，支持交互式/--scores/--json） | ✅ 已完成（2026-07-29） |
| P2 | jd-analysis ↔ catalog 双向链接约定 | jd-analysis/templates/README.md | 待办 |
