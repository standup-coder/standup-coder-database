# documentation/ · 过程文档索引

> 本目录存放**项目自身的开发过程文档**(评估报告、修复日志、设计稿),与 `catalog/`(技能数据)分离。
> 数据真值在 `catalog/`,这里只回答"项目是怎么演进到今天、为什么这么做"。

## 当前有效(2026-07 转型后)

| 文档 | 内容 | 状态 |
|---|---|---|
| [EVALUATION_REPORT_2026-09.md](./EVALUATION_REPORT_2026-09.md) | **第三轮整体评估(9/10)**:愿景对齐验证、三轮演进、剩余短板、实测数据快照 | 权威现状快照 |
| [REPAIR_LOG_2026-07.md](./REPAIR_LOG_2026-07.md) | 2026-07 结构性修复执行日志(死链 328→0、去重、字段补齐) | 已完成 |
| [ASSESSMENT_SUMMARY_2026-07.md](./ASSESSMENT_SUMMARY_2026-07.md) | 2026-07 双维度评估的执行摘要与交付索引 | 已完成 |
| [JOB_COVERAGE_ASSESSMENT_2026-07.md](./JOB_COVERAGE_ASSESSMENT_2026-07.md) | 岗位需求维度:各角色匹配度、归类噪声、缺口清单(含落地标注) | 缺口部分已落地 |
| [GROWTH_PATH_DESIGN_2026-07.md](./GROWTH_PATH_DESIGN_2026-07.md) | 成长路径设计:role 晋升线与技能依赖 | 设计稿,已实现为 roles 成长线索引 |
| [PRODUCT-GTM-PLAN.md](./PRODUCT-GTM-PLAN.md) | GTM 说服页的产品定位与约束 | 已实现,见 [`tools/gtm/`](../tools/gtm/) |

## 岗位技能映射图(静态导出,assets/)

`catalog/roles/_index.append.md` 中各成长线的 Mermaid 图谱静态导出版(SVG,2026-11-25 生成),供不支持 Mermaid 渲染的文档/网页直接引用。数据真值仍在 `catalog/` 各 role 的 `mainSkills` / `atomicSkills`;catalog 更新后需重新导出。

| 图 | 覆盖岗位 |
|---|---|
| [frontend-role-skill-graph.svg](./assets/frontend-role-skill-graph.svg) | frontend-developer → senior-frontend-dev |
| [backend-role-skill-graph.svg](./assets/backend-role-skill-graph.svg) | backend-developer → backend-architect |
| [data-role-skill-graph.svg](./assets/data-role-skill-graph.svg) | data-analyst → data-scientist → ai-ml-engineer |
| [ai-role-skill-graph.svg](./assets/ai-role-skill-graph.svg) | ai-ml-engineer → ai-agent-engineer |
| [devops-role-skill-graph.svg](./assets/devops-role-skill-graph.svg) | devops-engineer → sre / platform / release(三叉) |
| [security-role-skill-graph.svg](./assets/security-role-skill-graph.svg) | security-engineer → cloud-security-engineer |
| [qa-role-skill-graph.svg](./assets/qa-role-skill-graph.svg) | qa-automation → 测试架构 / DevOps 转型 |

> 导出命令:`awk` 提取 `_index.md` 中的 mermaid 块后用 `mmdc -i <块> -o <svg> -b white` 渲染。

## 历史档案(archive/)

SDK / 三层 JSON 时代(2026-05 ~ 2026-07 上旬)的过程记录,仅作历史追溯,内容描述的目录结构已不存在:

- `ASSESSMENT_2026-07.md` — 转型前最后一轮全项目评估(7.0/10)
- `COVERAGE_GAP_REPORT.md` / `KNOWLEDGE_BACKLOG.json` / `KNOWLEDGE_GAPS.json` — 三层 JSON 时代的覆盖度诊断与知识点 backlog(缺口已转入 catalog 持续补齐)
- `EVALUATION_REPORT.md` / `FIX_SUMMARY.md` / `PROGRESS.md` — 2026-05 评估与修复循环(已被后续轮次取代)
- `REASSESSMENT_REPORT.md` / `REASSESSMENT_FIX_LOG.md` — 2026-05 知识库定位重评估
- `RESTRUCTURE_DESIGN.md` — 3.0 双轨制重组设计稿(已实施完成,见 CHANGELOG 3.0.0)

> 约定:新的评估/修复完成后,把上一版快照移入 `archive/` 并更新本索引。
