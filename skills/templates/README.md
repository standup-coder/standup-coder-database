# templates/

> 新增 skill 时的 frontmatter 与正文模板。

## 选模板

| 你要添加的内容 | 用模板 |
|----------------|--------|
| 一个**职业角色**(JD) | `role.md` |
| 一个**复合技能**(多步 workflow) | `workflow-skill.md` |
| 一个**原子技能**(单步操作) | `atomic-skill.md` |
| 外部采集的 skill | `skill.md` |

## frontmatter 必填字段

```yaml
id: kebab-case-id           # 唯一 ID
type: role | composite-skill | atomic-skill | external
title: 英文名
nameZh: 中文名
domain: <14 个领域之一>
domainLabel: 人类可读的领域名
tags: [tag1, tag2]
catalogSource: internal | anthropic | mcpmarket | skills-sh | qoder | voltagent
```

## 14 个领域(与 `catalog/` 子目录对齐)

`frontend | backend | mobile | ai-ml | data | devops | security | testing | design | product | marketing | docs | productivity | tools`

新加领域时需同步改:
1. `tools/import/classify.js` 的 `RULES`
2. `catalog/` 下新建子目录
3. 跑 `node tools/import/classify.js`

## 加入流程

1. **外部 skill**:放到 `sources/<vendor>/<id>.md`,跑 `classify.js` 自动归类
2. **内部 role/skill**:放到对应 `catalog/<domain>/<id>.md`,引用本目录对应模板
3. **个人选择**:在 `personal/picked.md` 加引用

## 校验

```bash
# TODO: tools/validate/frontmatter.js
# 检查必填字段、domain 合法性、id kebab-case 等
```