# shared/ — 公用数据层

`industry/*.md` 是唯一的事实来源，`console/`（React + AntD）、`app/`（零依赖静态页）、
`GTM/` 都要读它。此前两套脚本各解各的，同一个问法给出两个数：深圳 24 个文件在
console 里算出 1109 条记录（374 个不同名称），在 app 里算出 171 家。这里收成一条管线，
**一个法人只有一条记录**。

只共用数据，不共用 UI：`app/` 必须能 `file://` 直接打开、零依赖（见根目录 PRODUCT.md），
把 AntD 组件抽进公用层会直接毁掉这个约束。

## 目录

| 路径 | 内容 |
| --- | --- |
| `schema/` | 记录字段清单：`record.mjs`（唯一来源）、`company.schema.json`、`types/company.ts` |
| `vocab/` | 受控词表：城市与城市等级、行业 slug、字段名映射、上市口径归类 |
| `pipeline/` | `parse` → `dedupe` → `derive` → `build` |
| `data/dist/` | 构建产物，消费端只读：`companies.json` `stats.json` `filter-options.json` `search-index.json` `manifest.json` |

## 构建

```bash
node shared/pipeline/build.mjs           # 构建并写 dist
node shared/pipeline/build.mjs --check    # 只跑断言
node shared/pipeline/build.mjs --diff     # 额外与 console 已上线产物比家数
```

`--check` 失败即退出码 1。断言是语料结构与解析器之间的契约：文件数、行数、去重后家数、
深圳主表口径区间、城市分布合计 == 本土法人数、记录键集 == 字段清单，都由这里守住，
不靠人记得去比对两边数字。

## 记录口径

- **一条记录 = 一个法人**。同一法人在主表出现一次、在「按维度分类的企业列表」再列几次，
  合并成一条，`occurrences` 记次数，`sections` 留出处。
- **scope 按最近的标题判定**，由内层向外层取：`listed` 主表 / `branch` 分支机构清单 /
  `international` 外资与外地企业清单 / `supplement` 其余小节。
- **去重键**：`城市::规范名`。名称末尾带办公城市的跨国写法（"ASML Shanghai"）例外，
  用 `∷规范名`，办公城市收进 `cities[]`，否则一家母公司被算成三座城市的三家。
  只限带城市后缀的行：`international` 清单里也列中国公司，在广州和北京各出现一次指的是
  两座办公室，整体并成一家会把城市分布抹掉。
- **本土/跨国分开统计**。`stats.json` 里的上市率、一线占比、城市分布都按本土口径；
  跨国清单里的巨头几乎全是上市公司，混进分母会让「本土企业上市率」名不副实。

## 消费端接法

- `console/`：`npm run data:sync` 把 `data/dist` 拷进 `console/public/data`（不用软链，
  Vite 的 public 目录不跟随），前端只认 `types/company.ts` 的形状。
- `app/`：读 `companies.json`，过滤 `city === '深圳' && scope === 'listed'`，
  本地补锚点与坐标后写成 `window.APP_DATA`。
