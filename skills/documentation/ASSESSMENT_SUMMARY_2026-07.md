# 技能库全面评估 · 总结（2026-07）

> 生成时间：2026-07-29
> 本文是两份维度报告的执行摘要与交付索引：
> - 岗位需求维度：[JOB_COVERAGE_ASSESSMENT_2026-07.md](./JOB_COVERAGE_ASSESSMENT_2026-07.md)
> - 个人技能发展维度：[GROWTH_PATH_DESIGN_2026-07.md](./GROWTH_PATH_DESIGN_2026-07.md)
> - 取证工具：[tools/import/validate-refs.js](../tools/import/validate-refs.js)（`npm run import:validate`）

---

## 一、交付物清单

| 交付物 | 位置 | 说明 |
|---|---|---|
| 岗位需求维度评估报告 | `documentation/JOB_COVERAGE_ASSESSMENT_2026-07.md` | 岗位覆盖、匹配度、技能缺口 |
| 个人技能发展路径设计报告 | `documentation/GROWTH_PATH_DESIGN_2026-07.md` | 成长路径、能力评分模型、进阶设计 |
| 结构校验工具 | `tools/import/validate-refs.js` | 工具维度沉淀在 `tools/` 下，`npm run import:validate` |
| 配套接线 | `package.json` / `CONTRIBUTING.md` §4.5 | 校验命令与贡献流程集成 |

## 二、总体结论：7/10 — 良好的技能沉淀仓库，有明确改进空间

### 优势（骨架是对的）

- 三层模型（Role → Composite → Atomic）天然就是"技能蒸馏"结构：atomic 是蒸馏出的最小知识单元，composite 是组合应用，role 是岗位适配面
- 23 个 role 横向覆盖 2024-2026 主流技术岗位，ai-agent-engineer 等新兴岗位收录及时
- role frontmatter 的 mainSkills/atomicSkills 引用 23/23 全部可解析
- `prompt-engineering-atomic.md` 这类高质量原子技能（要点/反模式/分级掌握/资源俱全）可作全库范本

### 关键问题（2026-07-29 工具实测取证）

| 问题 | 实测数据 | 影响 |
|---|---|---|
| 正文死链 | 328 个（324 个集中在 roles/ 正文） | "从岗位跳到技能"的学习链路走不通 |
| 领域深度失衡 | security 68 条 vs frontend 16 条 | 前端为招聘量 Top3 岗位，匹配度仅 40% |
| level 分布失真 | junior 0 / mid 157 / senior 12 | 学习者无法按水平切入 |
| 归类噪声 | 约 8% 技能落错领域 | classify.js 正则先命中先赢导致系统性错分 |
| external 游离 | 217 条（51%）缺 type 字段 | 学习者分不清"能力"与"资料" |
| 重复 id | 6 组（含 5 个 `-1` 后缀文件） | 索引与引用歧义 |
| 骨架 composite | 步骤全是占位符（如 api-design-skill） | 无法承载"完成工作流"的能力验证 |

### 个人发展侧核心方案（详见 GROWTH_PATH 报告）

- **岗位定位三步法**：选岗（roles/）→ 盘差距（技能清单自评）→ 排计划（personal/）
- **0-3 分能力评分模型**：0 未接触 / 1 了解 / 2 会用（Mid 行为）/ 3 精通（Senior + 可举证）
- **适配度公式**：`(Σ mainSkill×2 + Σ atomicSkill×1) / 满分 × 100%`，≥60% 可投递、≥75% 有竞争力
- **学习顺序原则**：原子按概念依赖排序 → 复合作为阶段项目产出 → role 作为验收面
- **五条跨 role 成长线**：执行线 / 数据线 / AI 线 / 平台线 / 管理线

## 三、修复行动（P0 优先级）

1. 修复 roles/ 正文死链（id 索引自动重写）
2. classify.js 支持 category 字段优先，错分文件归位
3. 重复 id 去重（`-1` 后缀文件删除）
4. atomic level 三档重标定（junior/mid/senior）
5. external 补 type 字段，明确其"参考资源"定位
6. 骨架 composite 按 workflow-skill 模板补齐契约
7. 前端 8 条 P0 原子技能补齐（全库 ROI 最高）—— ✅ 2026-07-29 已完成，frontend internal 5 → 13 条

> 修复执行记录与修复后数据见：[REPAIR_LOG_2026-07.md](./REPAIR_LOG_2026-07.md)

## 四、已知存量问题（与本轮评估无关）

- `npm run lint` 失败：`eslint.config.js` 引用了未安装的 `@typescript-eslint/parser`，属存量配置问题；新脚本以 `node --check` 验证语法通过
