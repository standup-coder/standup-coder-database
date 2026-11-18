# Skills Database · 整体评估报告（2026-09）

> 本文沉淀 2026-08-31 → 2026-09-04 三轮整体评估的结论、数据与修复闭环,是当前项目状态的权威快照。
> 历史评估档案:[ASSESSMENT_SUMMARY_2026-07.md](./ASSESSMENT_SUMMARY_2026-07.md) · [JOB_COVERAGE_ASSESSMENT_2026-07.md](./JOB_COVERAGE_ASSESSMENT_2026-07.md) · [REPAIR_LOG_2026-07.md](./REPAIR_LOG_2026-07.md)
> 复测工具:[`tools/import/validate-refs.js`](../tools/import/validate-refs.js)(`npm run import:validate`)· `npm run web:build` · `npm run lint`

---

## 0. 元信息

| 项 | 值 |
|---|---|
| 评估日期 | 2026-09-04 |
| 评估范围 | 全仓:结构 / 内容 / 工具链 / 基建 / 文档 |
| 仓库版本 | 3.1.0(package.json 与 package-lock 同步) |
| 写作时工作区状态 | 本轮修复共 ~180 文件变更**尚未提交**(见 §六-2) |
| 数据口径 | 所有数字均为本地实测,复现命令见 §二 |

---

## 一、执行摘要

**总评 9 / 10**(三轮演进:7 → 8.5 → 9)。

项目已与愿景完全对齐:**本地职业技能 SkillHub**——尽可能全的 skills 目录(454 条 / 16 领域 / 27 角色)、可挑选、可持续沉淀;**Markdown 是唯一真值**,Web 只是 `tools/web/` 下的静态呈现层,GitHub Pages 部署的也是它。

剩余 1 分扣在两处,均非结构问题:

1. **内容深度**:71% 条目仍是"较薄"摘要体(20–59 行),学习路径章节覆盖仅 6%;
2. **工程卫生**:评估产出的修复尚未 commit;历史提交信息几乎全为 "update",不可回溯。

---

## 二、评估方法与可复现性

本报告全部结论可由以下命令在本地复现(纯 Node,无网络依赖):

```bash
# 1. 目录健康:role→skill 引用 / 正文链接 / 重复 id / 必填字段
npm run import:validate

# 2. 浏览站构建(应输出 "454 skills, 15 domains"),连跑两次 diff 应为空(可复现)
npm run web:build

# 3. 代码规范
npm ci && npm run lint

# 4. 技能总数(不含索引文件)
find catalog -name "*.md" ! -name "_index*" | wc -l        # → 454

# 5. 来源分布
grep -rh "^catalogSource:" catalog --include="*.md" | sort | uniq -c

# 6. 正文体量与章节覆盖(评估脚本,内联 node,见 §附录)
```

---

## 三、愿景对齐验证

| 愿景(用户原话) | 现状 | 结论 |
|---|---|---|
| "尽可能全的有哪些 skills,我可以利用起来" | 454 条 / 16 领域(含 27 职业角色页),覆盖前端、后端、安全、DevOps、数据、AI-ML、测试、设计、产品、营销、写作、工具集成 | ✅ 每条带 `catalogSource` 溯源 |
| "本地的 skillhub" | 离线优先:MD 编辑器/grep 可读;`tools/web/index.html` 单文件双击即开;零运行时依赖(npm install 仅为 ESLint) | ✅ |
| "持续沉淀的 skillhub" | 沉淀管线闭环:`sources/<vendor>/` 投入 → `classify.js` 归类 → `regenerate-indices` 重建索引 → `validate-refs` 校验 → `web:build` 渲染;CI 强制此链 | ✅ |
| "以此作为评估" | `validate-refs` 全绿 + `role-fit.js` 按角色匹配技能 | ✅ |
| "web 只是 tools/web/ 下的呈现方式,主要看 md" | Web 无自有数据,从 `catalog/` 生成;Pages 部署同一单文件 | ✅ |

---

## 四、当前量化画像(实测 2026-09-04)

**规模与来源**

| 指标 | 值 |
|---|---|
| 技能总数 | **454**(较 2026-07-29 基线 423 净增 31) |
| 领域 | 15 + roles = 16(最大:tools 67 / security 65 / devops 48) |
| 职业角色页 | 27(含成长线索引 `_index.append.md`) |
| 来源分布 | internal 241 · voltagent 50 · qoder 50 · skills-sh 49 · mcpmarket 47 · anthropic 17 |

**质量门(全绿)**

| 检查 | 结果 |
|---|---|
| role→skill 引用(27 role) | 全部可解析(447 链接,0 失效) |
| 正文相对链接 | 全部有效 |
| 重复 id / "-1" 后缀重复 | 0 组 |
| 必填字段缺失(type / level / nameZh) | 0 |
| 浏览站构建 | 454 skills,两次构建字节级一致 |
| ESLint | 0 error 0 warning |

---

## 五、三轮评估演进与修复闭环

### 第一轮(agent 时代,7/10)

针对"Agent 编排框架"形态的诊断:文档与代码路径不一致、测试覆盖失衡、第三方采集稀释核心、命名混乱等。**处置:项目整体转型**(见 [CHANGELOG 3.0.0](../CHANGELOG.md)),旧问题连同 SDK/server/VitePress 一起删除。

### 第二轮(转型后,8.5/10)→ 本轮全部修复

| # | 问题 | 修复 |
|---|---|---|
| 1 | CI 引用已删除的 `build`/`test`,每次 push 必挂 | `ci.yml` 重写:validate → web:build + 新鲜度检查 → lint |
| 2 | Pages 部署描述已删除 SDK 的 VitePress(6.4MB) | 删除 `docs/`;`deploy.yml` 改部署 `tools/web` 单文件站 |
| 3 | 浏览站过期(内嵌 428 < 实际 454) | 重建;CI 加新鲜度检查防再犯 |
| 4 | README 统计停在 217、缺 roles、章节重复 | 重写,数字与目录树对齐 |
| 5 | `README_zh.md` 前朝遗物 | 删除(主 README 即中文,消灭双份漂移) |
| 6 | server 时代残留(`.env.example` 等) | 删除/归档(`RESTRUCTURE_DESIGN.md` → `archive/`,`PRODUCT.md` → `PRODUCT-GTM-PLAN.md`) |
| 7 | 5 个中文文件名 | 改英文 id 并重建索引(见 §附录-三) |
| 8 | 9 组跨源重复无标注 | 10 个转载文件加 `duplicateOf`,约定写入 `templates/skill.md` |
| 9 | eslint.config 引用已删除的 TS 解析器 | 简化为纯 JS 规则;顺手修 2 处 lint |

### 本轮自纠(评估自己的产物时发现)

| 问题 | 修复 |
|---|---|
| 文档写 455,实际 454(早先统计把 `roles/_index.append.md` 索引碎片计入技能) | README/CLAUDE 数字修正为 454 |
| package-lock 版本停在 3.0.0 | `npm install --package-lock-only` 同步 3.1.0 |
| `.mimosa/` 等工具残留未忽略 | 删除残留;`.gitignore` 增补 `.mimosa/ .video_agent/ .impeccable/ tools/web/site/` |

---

## 六、剩余短板(按影响排序)

### 1. 内容深度不均 —— 最主要的内容债

- 正文体量:**71% 较薄(20–59 行)**、29% 中等、充实(≥150 行)仅 1 条;
- 章节覆盖:最佳实践 44% / 反模式 37% / 参考资源 42% / **学习路径仅 6%**(基本只有 roles);
- `templates/skill.md` 定义的完整结构(适用场景/不适用场景/分级别学习路径)绝大多数条目未填。

**影响判定**:不影响"目录 + 挑选"用途(每条足够判断"是什么、要不要学");影响"挑中之后的深度学习"。**对策**:不追求 454 条全部写厚——挑 `personal/` 里真实要学的 10–20 条按模板补全,其余保持"够挑选"即可。

### 2. 修复成果尚未提交

本轮 ~180 文件变更仍在工作区;提交前远程 CI 仍挂、Pages 仍发旧内容。建议拆 3 个主题 commit:`fix(ci)` / `chore(残留清理)` / `chore(catalog 规范化)`。

### 3. 提交历史不可回溯

近期提交信息几乎全为 "update"。此后建议 commit message 写明动机,回溯时有据可查。

### 4. 小项

- `role-fit.js` 仅在 `documentation/` 设计稿中提及,README/CLAUDE 未露出;
- 9 组跨源重复已标 `duplicateOf` 但仍作为独立条目出现在索引与浏览站(浏览时 mcp-builder 出现两次);可让 `build.js` 折叠 `duplicateOf` 条目;
- 本轮 CI/Pages 修改尚未经真实 push 验证(本地模拟全绿)。

---

## 七、评分对比

| 维度 | 第一轮(07) | 第二轮(08-31) | 本轮(09-04) |
|---|:---:|:---:|:---:|
| 定位聚焦 | 3 | 4.5 | **5** |
| 架构清晰 | 4 | 5 | **5** |
| 内容规模 | 4 | 4.5 | **4.5** |
| 内容深度 | — | — | **3** |
| 工具链 | 3 | 4 | **4.5** |
| 基建(CI/部署) | — | 3.5 | **4.5** |
| 文档 | 4 | 3.5 | **4.5** |
| 工程卫生 | — | — | **3** |
| **综合** | **7** | **8.5** | **9** |

---

## 八、下一步(按优先级)

1. **提交并推送**:让 CI 与 Pages 首次以新架构真实跑通(唯一能清掉"本地全绿"假设的动作);
2. **内容深度策略**:聚焦 `personal/` 真实在学的 10–20 条按模板补全,沉淀新 skill 时直接按完整模板写;
3. **浏览站折叠重复**(可选):`build.js` 过滤带 `duplicateOf` 的条目或折叠为"别名"展示,让目录每类技能只出现一次;
4. **露出 role-fit**(可选):在 README「怎么用」加一段 `npm run role:fit` 示例。

---

## 附录:实测数据

### 一、正文体量分布(454 条,不含 frontmatter)

| 档位 | 条数 | 占比 |
|---|---:|---:|
| 极简(<20 行) | 0 | 0% |
| 较薄(20–59 行) | 322 | 71% |
| 中等(60–149 行) | 131 | 29% |
| 充实(≥150 行) | 1 | 0% |

### 二、学习章节覆盖

| 章节 | 覆盖 | 占比 |
|---|---:|---:|
| 最佳实践 | 198 | 44% |
| 参考资源 | 189 | 42% |
| 反模式 | 168 | 37% |
| 学习路径 | 27 | 6% |

### 三、中文文件名 → 英文 id 对照(2026-09-04)

| 原文件名 | 新 id |
|---|---|
| `catalog/design/canvas-设计.md` | `qoder-canvas-design`(与既有 `canvas-design` 冲突,按 `<source>-` 惯例加前缀) |
| `catalog/frontend/前端设计.md` | `qoder-frontend-design`(同上,另有 anthropic 原版) |
| `catalog/security/aws-技能.md` | `aws-skills` |
| `catalog/testing/开发-agent-技能.md` | `agent-development-skills` |
| `catalog/data/notion-技能.md` | `notion-skills` |

### 四、跨源重复 9 组(10 文件已标 `duplicateOf`)

规律:文件名带 `anthropic-` 前缀者实为 **voltagent 转载版**,不带前缀的才是 anthropic 一方原版;`qoder-frontend-design` / `qoder-canvas-design` 为 qoder 转载版。

| canonical(anthropic 原版) | 转载版 |
|---|---|
| `ai-ml/mcp-builder` | `ai-ml/anthropic-mcp-builder`(voltagent) |
| `ai-ml/skill-creator` | `ai-ml/anthropic-skill-creator`(voltagent) |
| `docs/pptx` | `design/anthropic-pptx`(voltagent) |
| `docs/docx` | `docs/anthropic-docx`(voltagent) |
| `docs/pdf` | `docs/anthropic-pdf`(voltagent) |
| `docs/xlsx` | `docs/anthropic-xlsx`(voltagent) |
| `frontend/algorithmic-art` | `frontend/anthropic-algorithmic-art`(voltagent) |
| `frontend/frontend-design` | `frontend/anthropic-frontend-design`(voltagent) · `frontend/qoder-frontend-design`(qoder) |
| `design/canvas-design` | `design/qoder-canvas-design`(qoder) |

---

## 后记(2026-09-04 · 评估建议落地)

§六 剩余短板的处置进展:

1. **内容深度** — 未变(策略待定:聚焦 personal/ 真实在学的条目补全)。章节覆盖已纳入 `import:validate` 常态输出,后续可量化追踪。
2. **未提交** — 仍未提交(含本后记对应的全部落地改动)。
3. **提交历史** — 未变。
4. **小项全部落地**:
   - `role:fit` 已写入 README「怎么用」;
   - 浏览站已折叠 `duplicateOf` 条目(435 可见 + 19 折叠,canonical 卡片标注转载数);
   - CI/Pages 修改仍未真实 push 验证。

**数据修正**:

- 正文"其引用的 GTM/ 目录从未创建"已过时:GTM 说服页后续已提交,现位于 [`tools/gtm/`](../tools/gtm/)(按"web 呈现层归口 tools/"原则从顶层迁入,冗余 `dist/` 已删,`.env` 已脱离版本控制)。
- 附录-三 中文文件名改名实际为两批:首批 5 个(2026-08-31),第二批 42 个(2026-09-04,校验器新增 id 格式检查后暴露存量),累计 47 个;转载标注 10 → 19 条。
- `documentation/` 已建立导航(见 [`_index.md`](./_index.md)),SDK 时代过程文档移入 `archive/`。
