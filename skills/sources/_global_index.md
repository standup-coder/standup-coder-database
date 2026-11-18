---
generatedAt: 2026-07-22
totalCollected: 217
uniqueSkills: 204
duplicatesMerged: 13
sources: [qoder, skills-sh, anthropic, voltagent, mcpmarket]
---

# 跨站点热门 Skills 采集总索引

> 本目录是 5 个外部站点 TOP50 采集结果的**暂存区**，未并入根目录领域分类。
> 待仓库重组（见根目录 `RESTRUCTURE_DESIGN.md`）执行阶段 4-5 时，按 frontmatter `category` 字段归入对应中文领域文件夹。

---

## 采集概览

| 来源站点 | URL | 采集数 | 排序依据 | 独占技能 |
|----------|-----|--------|----------|----------|
| **qoder-community** | https://qoder-community.pages.dev/zh/skills/ | 50 | 徽章权重（高质量/热门/精选） | 49 |
| **skills.sh** | https://www.skills.sh/ | 50 + 16（2026-09 热榜补充,见 `skills-sh/51_2026-09热榜补充.md`） | All-Time installs 降序 | 49 |
| **anthropics/skills** | https://github.com/anthropics/skills | 17 | 官方仓库全量（不足 50） | 9 |
| **VoltAgent/awesome-agent-skills** | https://github.com/VoltAgent/awesome-agent-skills | 50 | README 收录（声称 1497+）跨类均衡 | 42 |
| **mcpmarket** | https://mcpmarket.com/zh/tools/skills | 50 | 页面默认排序（rank 1-50） | 46 |
| **合计** | — | **233** | — | **195** |
| **去重后唯一** | — | **220** | — | — |

> 2026-09-05 防腐化刷新:按 skills.sh 榜单(600 条记录)比对库内 454 条,新增 16 条主流热榜技能(mattpocock/skills 方法论套件 ×10、microsoft/azure-skills ×3、vercel-labs、heygen 等),排除刷量与捆绑计数条目,明细与排除名单见 `skills-sh/51_2026-09热榜补充.md`。

---

## 各站点特色

- **qoder-community**：中文社区站，开发 21 + 营销 7 + 生产力 6 为主，徽章权重排序
- **skills.sh**：英文市场，飞书系 23 + Azure 16 为主，All-Time installs 降序
- **anthropics/skills**：官方仓库全量 17 个，document-skills 4 + example 12 + claude-api 1
- **VoltAgent/awesome**：聚合器，1497+ 收录中跨类均衡选 50，AI/DB/集成覆盖广
- **mcpmarket**：Claude Code/MCP 生态，发布者高度集中（affaan-m 42 + openclaw 7 + facebook 1），强垂直领域（Django/Rust/Cisco/能源/医疗/Homelab）

---

## 跨站点重叠（13 个，已识别）

> 9 个来自 voltagent 转载 anthropic 官方仓库；1 个 qoder/skills-sh 共译；3 个 mcpmarket 与其他源发生碰撞（已合并计入）。

| 技能 | 收录来源 | 处理建议 |
|------|----------|----------|
| algorithmic-art | anthropic + voltagent | 以 anthropic 官方为主，voltagent 版作参考链接 |
| docx | anthropic + voltagent | 同上 |
| frontend-design | anthropic + voltagent | 同上 |
| mcp-builder | anthropic + voltagent | 同上 |
| pdf | anthropic + voltagent | 同上 |
| pptx | anthropic + voltagent | 同上 |
| skill-creator | anthropic + voltagent | 同上 |
| xlsx | anthropic + voltagent | 同上 |
| 前端设计 | qoder + skills-sh | 保留 qoder 中文版，skills-sh 版的 installs 数据补入参考 |

---

## 5 站点互补性分析

**重叠率仅 6%**（13/217），5 个站点高度互补：

- mcpmarket 与其他 4 站点几乎零重叠（独占 46/50 = 92%）——其 TOP50 集中在 Claude Code/MCP 生态的强垂直领域
- anthropic 是 voltagent 的子集来源（被转载 8 个）——voltagent 本身聚合价值有限
- qoder 与 skills-sh 仅有 1 个重叠——前者偏中文社区原创，后者偏英文市场数据

**这 204 个唯一技能覆盖的领域分布**（粗估，准确归类需重组阶段 4 的 category-map 判定）：

| 类别 | 数量 | 主要贡献源 |
|------|------|-----------|
| 开发（frontend/backend/devops/mobile） | ~80 | qoder 21 + mcpmarket 后端 10 + voltagent + skills-sh |
| 测试 | ~15 | mcpmarket 9 + voltagent 3 + qoder |
| 办公协同（office/文档） | ~35 | skills-sh 飞书 23 + anthropic docs 4 + qoder 文档 5 |
| AI/LLM | ~25 | voltagent AI APIs + skills-sh |
| 数据/数据库 | ~12 | voltagent DB 6 + qoder 数据 |
| 设计/创意 | ~10 | anthropic 创意 3 + qoder 设计 4 |
| 营销/内容 | ~12 | qoder 营销 7 + voltagent |
| 安全/认证 | ~6 | qoder 安全 2 + voltagent auth + mcpmarket 安全 |
| 网络运维/基础设施 | ~10 | mcpmarket 网络运维 6 + DevOps 4 |
| Agent 编排 | ~6 | mcpmarket 4 + 其他 |
| 行业垂直（医疗/能源/生物/教育） | ~6 | mcpmarket 独占 |
| 其他 | ~15 | 各源散点 |

---

## 各来源 _index.md 入口

- [qoder-community/_index.md](./qoder/_index.md) — 50 个，开发为主
- [skills-sh/_index.md](./skills-sh/_index.md) — 50 个，飞书 + Azure 为主
- [anthropic/_index.md](./anthropic/_index.md) — 17 个，文档 + 创意 + 工具
- [voltagent/_index.md](./voltagent/_index.md) — 50 个，AI/DB/集成均衡
- [mcpmarket/_index.md](./mcpmarket/_index.md) — 50 个，Claude Code/MCP 生态 + 强垂直

---

## 后续并入计划

这批语料在重组 `RESTRUCTURE_DESIGN.md` 阶段 4-5 并入正式目录：

1. 每条 md 按 frontmatter `category` 字段查 `category-map.cjs`，得目标中文领域文件夹
2. 合并去重后的 204 个唯一技能 → 移入 `开发/`、`运维/`、`office/` 等对应文件夹
3. 各来源 `_index.md` 保留作为溯源记录，移入 `tools/web/data/sources/`
4. 跨源重叠的 13 个技能，按上表"处理建议"择优保留，其余作"参考链接"合并入正文

---

## 字段规范（供并入参考）

每个 md 必须含以下 frontmatter：

```yaml
---
source: qoder | skills-sh | anthropic | voltagent | mcpmarket   # 原始来源
sourceUrl: <详情页完整 URL>                                       # 溯源链接
title: <原始标题>                                                 # 保留原文
nameZh: <中文名>                                                  # 归类与索引用
category: <原始分类>                                              # 供 category-map 判定
tags: [<标签数组>]
rank: <1-50>                                                     # 该来源内的热度名次
publisher: <发布者>                                              # 仅 mcpmarket/voltagent 等有
---
```
