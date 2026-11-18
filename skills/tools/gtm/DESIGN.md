# GTM 页面设计说明（DESIGN.md）

SkillHub 技能库的 Go-To-Market 落地页。由 impeccable 工作流产出：方向抽签 → 三方案 comp → 批准 → 像素复现 → 检查轮 → 检测器 + 完工审查。

## 方向契约

seed `32f9dcff`（降级抽签）。契约注释内嵌于 `index.html` 源码头部（`impeccable:direction-contract`）：

- **THESIS**：把技能库呈现为一本经审计的年度普查——每个数字可核对，每条记录可溯源。
- **OWN-WORLD**：瑞士统计年鉴对开页（暖纸底）+ 卡片目录馆的登记卡语法（划线行、登记卡）作展品声音。
- **FORM**：hairline 网格、平版印刷质感、无渐变无照片；tabular 数字；mono 只用于数据。
- **FINISH**：像素采样取色；Archivo Black 自托管作拉丁 display 声音。

批准记录：`.impeccable/mocks/comp-c-ledger-spread.json`（`approved: true`）。批准为委托选择：决策页两次被关闭后按 visualize 协议代决——依据是 comp-c 的四个审计数字与真实域值均在图内（图内 16 域为当时索引误计，实现按真值修正为 15），comp-a 条带等宽失真、comp-b 编造日期。

## 设计令牌

| 令牌 | 值 | 用途 |
|---|---|---|
| `--paper` | `#f8f5f0` | 纸底（comp 像素采样众数） |
| `--paper-dim` | `#f1ece4` | 登记卡 hover |
| `--ink` | `#151515` | 主墨（采样最大色簇） |
| `--blue` / `--blue-deep` | `#0c40be` / `#0a36a0` | 普查蓝：CTA、文本链接、`::selection` |
| `--red` | `#b84237` | OFFLINE FIRST 印章 |
| `--muted` / `--body` | `#55534e` / `#3a3833` | 辅助 / 正文文字 |
| `--hairline` | `rgba(21,21,21,.18)` | 划线网格 |

字体：display = Archivo Black（自托管 `fonts/ArchivoBlack-Regular.ttf`，`fonts/OFL.txt` 随附，离线合规）；正文 = 系统 CJK 栈；mono 仅限数据/度量语境（刊头、caption、普查图、卡片 meta、colophon）。

## 布局与响应式

masthead（1.5px 下边）→ 对开普查页 `.spread`（左：454/15/27/5 纵排巨数；中缝 gutter；右：标题、导语、三行动、15 行空心条普查图、落章）→ 样张 6 张登记卡 hairline 网格 → 来源行 → colophon。

- ≤980px：单列、巨数 2×2、卡 2 列。
- ≤600px：CTA 全宽、卡 1 列、章转流内右对齐。
- 首屏 `min-height:calc(100svh - 62px)`（`100vh` 回退）。

## 动效（渐进增强）

HTML 写终值/终态，JS 只做动画。无 JS / 打印 / `prefers-reduced-motion` / 无 IntersectionObserver 四条路径都落终态，不存在永久隐藏。

计数 rAF ease-out cubic（stagger 90ms / 720ms）；条形 scaleX stagger 45ms；印章 1250ms 后落章，指数减速 `cubic-bezier(.16,1,.3,1)`，无回弹；卡片与来源行 IO reveal。

## 数据真值（已核验）

454 = Σ 15 领域（tools 67 … productivity 9），条形宽 = count/67（±1px 舍入）；来源行 voltagent 50 / qoder-community 50 / skills-sh 49 / mcpmarket 47 / anthropic-skills 17 / internal 自建 241；6 张样张卡的领域/类型/来源与各域 `_index.md` 逐条一致；全部相对链接与 GitHub remote（`github.com/standup-coder/skills-database`）已验证存在。

## 审查与检测记录

- `detect.mjs`：降级模式运行（HTML parser 模块缺失，regex 匹配）——0 反模式命中，属欠计数而非干净账单。
- 完工审查：本环境无 impeccable-finish-reviewer 子代理类型，由 general-purpose 只读代理承担。数据 / 链接 / 对比度 / craft-floor 全部通过；发现 1 个 MUST-FIX 并已修复——JS 内联 `opacity:0` 压过 `.in` 类，默认路径下卡片永久隐藏；修复为纯类门控 + 补 transition + IO 特性检测兜底。顺带采纳两条建议：巨数 `tabular-nums`、首屏高度 58→62px 并加 `100svh`。
- 证据图（`.impeccable/review/`）：`hero-repro.png`（comp 像素复现检查点）、`desktop.png`（1536 全页终态）、`mobile.png`（390 全页终态）。

## 截图方法学注记

共享 Chrome 被并行会话抢占（视口调整落到他人页面）→ 用隔离 profile 的 headless CLI。`--virtual-time-budget` 两次把 rAF 计数与交错 transition 冻在半途（即使加大 budget + compositor 旗标）→ 动画页一律 `--force-prefers-reduced-motion` 截终态（页面自身实现了终态分支）。含 `100vh/svh` 首屏的页面，超高窗全页截图会拉伸首屏 → 用测量副本把视口相关值钉住（注入 `.spread{min-height:838px}`，等价 900px 视口渲染）再截，PIL 裁去底部余纸。

## 部署缺口

`deploy.yml`（GitHub Pages）只发布 `tools/web/site/`，`GTM/` 不在部署内。上线需在 workflow 的 staging 步骤把 `GTM/`（含 `fonts/`）复制进站点根，未擅自改动 CI。相对链接（`../catalog/...`、`../tools/web/index.html`）在仓库本地浏览有效；若上 Pages 需按同样的相对结构一并复制其依赖目录。
