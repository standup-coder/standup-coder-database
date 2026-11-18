# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Skills Database** 是一个**本地化的职业技能学习与挑选平台**(Personal SkillHub)。

- **核心定位**:把外部权威 skill 资源(5 个采集站点)整理为可学习、可挑选、可沉淀的 Markdown 资料库
- **领域聚焦**:这里的 skills 是**岗位胜任能力**(job competencies),**不是** Agent runtime 能力
- **数据真值**:**Markdown** 是唯一源真值;JSON 仅作为辅助 schema 存在
- **呈现层**:`tools/web/` 只是一个轻量渲染层,不持有自己的数据库

```
┌─────────────────────────────────────────┐
│          catalog/                       │
│   按领域分类的 skills MD(主数据)         │
│   217 条,14 个领域                      │
└──────────────┬──────────────────────────┘
               │ 反查
               ▼
┌─────────────────────────────────────────┐
│          sources/                       │
│   原始采集档案(5 个外部站点)             │
│   溯源,可重跑归类                       │
└─────────────────────────────────────────┘
```

## Build & Dev Commands

```bash
# 归类:把 sources/<vendor>/*.md 映射到 catalog/<domain>/
node tools/import/classify.js            # 实际归类(写文件)
node tools/import/classify.js --dry      # 预览分布,不写文件

# 校验
npm run lint          # ESLint

# 本地浏览站
cd tools/web && <启动命令>     # 待 tools/web/ 实现
```

> 历史命令 `npm run validate-roles` / `validate-skills` / `build` 不再适用——对应 JSON 资产已被 catalog 体系替代。

## Directory Map

| 路径 | 用途 | 是否提交 |
|------|------|----------|
| `catalog/` | 按领域分类的 skills MD,**主数据** | ✅ |
| `catalog/<domain>/_index.md` | 每个领域的索引(由 classify.js 生成) | ✅ |
| `sources/<vendor>/` | 原始采集档案(anthropic/mcpmarket/skills-sh/qoder/voltagent) | ✅ |
| `sources/_global_index.md` | 跨站点采集总览 + 重叠分析 | ✅ |
| `personal/` | 个人挑选状态(picked/in-progress/learned) | ❌ gitignore |
| `tools/import/classify.js` | sources → catalog 归类脚本 | ✅ |
| `tools/web/` | 静态浏览站(呈现层) | ✅ |
| `tools/gtm/` | GTM 说服页(呈现层,独立于浏览站) | ✅ |
| `templates/` | skill MD frontmatter 模板 | ✅ |
| `documentation/` | 项目过程文档(gap 报告、采集日志) | ✅ |

## Catalog Domains(共 16 个,454 条;数量会增长,以 `catalog/_index.md` 为准)

| Domain | 数量 | 说明 |
|--------|------|------|
| roles | 27 | 职业角色(含成长线索引) |
| tools | 67 | 第三方 vendor 工具集成(Lark/Azure/Vercel/…) |
| security | 65 | 安全 |
| devops | 48 | DevOps/基础设施 |
| data | 39 | 数据工程 |
| testing | 35 | 测试工程 |
| ai-ml | 34 | AI/ML/LLM |
| backend | 29 | 后端工程 |
| frontend | 25 | 前端开发 |
| design | 18 | 设计与创意 |
| product | 17 | 产品 |
| docs | 16 | 技术写作 |
| marketing | 14 | 营销 |
| mobile | 11 | 移动开发 |
| productivity | 9 | 生产力/工具 |

> 新增 skill 若无匹配领域,`classify.js` 会落到 `catalog/uncategorized/`(按需重建),需手工裁决后归位。

## Important Patterns

- **MD frontmatter 必填字段**:`id` / `title` / `nameZh` / `domain` / `tags` / `catalogSource`
- **`classify.js` 幂等**——改 RULES 后可整体重跑,无副作用
- **来源溯源**——每个 catalog MD 都带 `catalogSource` 字段,可反查到 `sources/<source>/<file>`
- **个人与公共分离**——`personal/` 默认 `.gitignore`,允许多人协作同一份 catalog 而不污染
- **Web 仅渲染**——`tools/web/` 直接读 `catalog/**/*.md`,**不**缓存数据到自己的存储

## Anti-patterns(避免)

- ❌ 不要在 catalog/ 里建 JSON——它是 MD 唯一真值的目录
- ❌ 不要把 `personal/` 内容提交——它是个人的,不是公共的
- ❌ 不要把 skills 当作 Agent runtime 能力来"编排"——这是职业技能库,不是 orchestration framework
- ❌ 不要绕过 classify.js 手动放文件——除非已改 RULES 并重跑