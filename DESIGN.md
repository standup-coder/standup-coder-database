---
name: Standup Coder Database
description: 程序员的职业知识字库——GTM 表面「拣字成版」的中文活字排字房设计系统
colors:
  wood-1000: "#100a05"
  wood-950: "#191007"
  wood-900: "#231609"
  wood-800: "#2f1e0e"
  wood-700: "#3f2a15"
  wood-600: "#573c20"
  wood-500: "#71522f"
  paper: "#ece1cb"
  paper-strong: "#f7efdd"
  lead-200: "#cfc5b4"
  lead-300: "#a99d89"
  cinnabar: "#c8452c"
  cinnabar-bright: "#d9563a"
  cinnabar-hover: "#e2684d"
  cinnabar-deep: "#a33520"
typography:
  display:
    fontFamily: "\"Songti SC\",\"STSong\",\"NSimSun\",\"SimSun\",\"Noto Serif CJK SC\",serif"
    fontSize: "clamp(2.7rem, 6.6vw, 6rem)"
    fontWeight: 900
    lineHeight: 1.24
    letterSpacing: "0.045em"
  headline:
    fontFamily: "\"Songti SC\",\"STSong\",\"NSimSun\",\"SimSun\",\"Noto Serif CJK SC\",serif"
    fontSize: "clamp(1.9rem, 3.6vw, 3rem)"
    fontWeight: 900
    lineHeight: 1.3
    letterSpacing: "0.05em"
  title:
    fontFamily: "\"Songti SC\",\"STSong\",\"NSimSun\",\"SimSun\",\"Noto Serif CJK SC\",serif"
    fontSize: "clamp(1.35rem, 2vw, 1.7rem)"
    fontWeight: 900
    lineHeight: 1.35
    letterSpacing: "0.05em"
  body:
    fontFamily: "\"PingFang SC\",\"Hiragino Sans GB\",\"Microsoft YaHei\",\"Noto Sans CJK SC\",sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.95
    letterSpacing: "0.01em"
  label:
    fontFamily: "ui-monospace,\"SF Mono\",Menlo,Consolas,\"Cascadia Mono\",monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
rounded:
  plate: "2px"
  chip: "4px"
  cell: "5px"
  control: "6px"
  glyph: "8px"
  card: "10px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "22px"
  lg: "30px"
  section: "clamp(64px, 9vh, 110px) 0"
  wrap-padding: "0 clamp(20px, 4vw, 48px)"
components:
  button-relief:
    backgroundColor: "{colors.cinnabar-bright}"
    textColor: "{colors.wood-1000}"
    rounded: "{rounded.control}"
    padding: "15px 26px"
  button-intaglio:
    backgroundColor: "transparent"
    textColor: "{colors.paper-strong}"
    rounded: "{rounded.control}"
    padding: "15px 26px"
  chip:
    backgroundColor: "{colors.wood-900}"
    textColor: "{colors.paper}"
    rounded: "{rounded.chip}"
    padding: "6px 11px"
  tray-cell:
    backgroundColor: "{colors.wood-800}"
    textColor: "{colors.paper}"
    rounded: "{rounded.cell}"
  codeblock:
    backgroundColor: "{colors.wood-1000}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "13px 16px"
---

# Design System: Standup Coder Database

## Overview

**Creative North Star: 「拣字成版」——中文活字排字房**

整个系统把产品表达为一间排字房：仓库的文档是铸好的活字，访客来拣一副自己的版。视觉世界由四种材料构成——深木（字盘与地面）、铅灰（结构与辅助文字）、纸白（印迹与正文）、朱砂（印泥与唯一强调色）。密度上「盘密文疏」：字盘区格子紧密（8px 间距），阅读区行距宽松（1.95），两者并置形成「工坊 vs 印张」的节奏对比。

气质关键词：沉、旧、准。深木地上的巨型宋体论题句是每一屏的声部；朱砂红出现即意味着「可取用」或「已盖印」。装饰只有三种：文武双线、内凹浮雕、印章，全部源自印刷工艺本身，不引入工艺之外的任何装饰语汇。

**Key Characteristics:**
- 宋体是唯一的展示声部（活字的直系后代），黑体只做正文
- 朱砂是唯一强调色，出现第二个强调色即返工
- 深度全部来自内凹浮雕与双线规，从不使用投影与渐变
- 等宽字体只承载可核验之物：计数、路径、代码
- 每个数字都可回溯到仓库实测，诚实声明常驻

## Colors

一套暖木深色底 + 纸白文字 + 单一朱砂强调的印刷色板；木色系同时承担地面、容器与边线的全部层次。

### Primary
- **印泥朱砂 cinnabar** (#c8452c): 印章底色与文字选区；品牌印「字」的底色。
- **阳文朱 cinnabar-bright** (#d9563a): 主按钮、拣字格、强调计数、链接悬停前的文字红——屏幕上最亮的一笔，占比恒低于 10%。
- **亮朱 cinnabar-hover** (#e2684d): 仅作主按钮与拣字格的悬停态。
- **深印泥 cinnabar-deep** (#a33520): 印章描边、拣字格边线，朱砂自己的暗部。

### Neutral
- **炭木底 wood-1000** (#100a05): 最深地面——页脚、交替章节底、代码块底。
- **夜排字房 wood-950** (#191007): 页面主地面（body）。
- **字盘木 wood-900** (#231609): 字盘底、卡片底、chip 底。
- **活字木 wood-800** (#2f1e0e): 字盘格底、复制按钮底、悬停加深面。
- **木纹线 wood-700** (#3f2a15): 次级边线与文武线细规。
- **盘缘木 wood-600** (#3f2a15 之上一级) (#573c20): 主边线、表格头规、滚动条。
- **浅木描 wood-500** (#71522f): 阴文按钮边线、链接下划线。
- **印纸白 paper-strong** (#f7efdd): 标题、强调文字、按钮反白文字。
- **纸白 paper** (#ece1cb): 正文文字。
- **铅灰浅 lead-200** (#cfc5b4): 次级正文、导览文字。
- **铅灰 lead-300** (#a99d89): 注释、图注、口径说明（对比度 7:1 于主地面）。

### Named Rules
**朱砂一色 Rule.** 朱砂是页面唯一强调色，任何新元素不得引入第二强调色；「是否够醒目」永远靠明度与字重解决，不靠新增色相。

**墨不压纸 Rule.** 深地面上永远用纸白系文字；次级信息用铅灰系，禁止用中性灰（灰在暖木底上会发脏）。

## Typography

**Display Font:** 宋体系（Songti SC → STSong → NSimSun → SimSun → Noto Serif CJK SC）
**Body Font:** 黑体系（PingFang SC → Hiragino Sans GB → Microsoft YaHei → Noto Sans CJK SC）
**Label/Mono Font:** 等宽系（ui-monospace → SF Mono → Menlo → Consolas）

**Character:** 宋体 900 重是活字的直系后代，负责所有「印出来的声音」；黑体 1.95 行距做安静的正文底噪；等宽字体是台账声部——它出现的地方都承诺「这个数可以去仓库核对」。

### Hierarchy
- **Display** (900, clamp(2.7rem, 6.6vw, 6rem), 1.24): 首屏论题句，一页只有一句。
- **Headline** (900, clamp(1.9rem, 3.6vw, 3rem), 1.3): 章节标题（如「三步成版」）。
- **Title** (900, clamp(1.35rem, 2vw, 1.7rem), 1.35): 卡片标题；竖排场景放大至 clamp(1.6rem, 2.4vw, 2.1rem)。
- **Body** (400, 16px, 1.95): 正文；卡片内 14.5px；行宽由 max-width 约束在 40em 内。
- **Label** (400, 10.5–14px, tabular-nums): 计数、路径、代码、表注——等宽专属。

### Named Rules
**等宽即证据 Rule.** 等宽字体只用于可核验计数、路径与代码；用等宽做风格化装饰是违例。

**字重代色 Rule.** 强调永远优先用字重（400→600→900）与字号阶梯表达，其次用朱砂；不使用斜体与渐变字。

## Layout

单列长卷。容器 max-width 1180px，左右留白 clamp(20px, 4vw, 48px)；章节纵距 clamp(64px, 9vh, 110px)，以文武双线（2px 粗规 + 3px 下错 1px 细规）分界而非以色块分界。首屏为 7:13 双栏（论题句 : 字盘墙），960px 以下塌为单列。sticky 顶栏高 64px，全页 scroll-margin-top 76px。

断点：1020px（三拣法卡从 5:7 双列叠为单列，竖排题转横排）、960px（首屏单列、字盘 6→4 列、导航收起）、560px（字盘 3 列、顶栏收窄、品牌副题隐藏）。所有可收缩网格轨道一律 minmax(0, xfr)，弹性文字子项一律 min-width:0——min-content 传染是本系统的已知风险面。

### Named Rules
**文武分界 Rule.** 章节之间只用文武线分界；用背景色差分界仅限既定的交替章（#audiences / #process / #colophon 用 wood-1000）。

## Elevation & Depth

无投影系统。深度由三种印刷工艺手法承载：内凹浮雕（inset 双影：上缘纸白微光 + 下缘深色落影）、文武双线（粗细双规的平面进深）、印章的叠色（朱砂底 + 纸白描边）。所有 inset 阴影零模糊、零偏移，只做「雕版浮雕」暗示；drop-shadow、模糊光晕、渐变均为违例。

### Shadow Vocabulary
- **盘底浮雕** (`inset 0 2px 0 rgba(236,225,203,.05), inset 0 -3px 0 rgba(0,0,0,.4)`): 字盘外框。
- **活字浮雕** (`inset 0 1px 0 rgba(236,225,203,.07), inset 0 -2px 0 rgba(0,0,0,.35)`): 字盘格、字胚砖。
- **拣格浮雕** (`inset 0 1px 0 rgba(247,239,221,.25), inset 0 -2px 0 rgba(0,0,0,.3)`): 朱砂拣字格。

### Named Rules
**雕版不投影 Rule.** 深度只来自内凹浮雕与双线规；任何 drop-shadow / blur 光晕 / 渐变都破坏平色印刷的世界。

## Shapes

半径是一套细颗粒的木作阶梯：plate 2px（印张、牌记框）→ chip 4px（标签、小钮）→ cell 5px（活字格）→ control 6px（按钮、代码块）→ glyph 8px（字胚砖、印章）→ card 10px（字盘、大卡）。边线语言：1–1.5px 实线木色边 + 双框（border + outline-offset 外圈）用于「印张」类元素（竖排印张、牌记）。图标统一 1.5px 描边内联 SVG。品牌印与牌记印都是圆角方形朱砂底 + 反白宋体字，微旋（-4deg ~ -6deg）盖章。

## Components

### Buttons（阳文 / 阴文）
- **Shape:** 圆角 control（6px），padding 15px 26px，字重 600。
- **Primary（阳文）:** 朱砂亮底 (#d9563a) + 炭木反白字；悬停 #e2684d，按下 translateY(1px)。可带第二行注释（btn-note，12px，75% 透明度）。
- **Secondary（阴文）:** 透明底 + 浅木描边 (#71522f) + 印纸白字；悬停边线提亮至纸白、底转 wood-900。
- **Focus:** 2px 朱砂亮 outline，offset 2px。

### Chips（模块标签）
wood-900 底、1px 盘缘木边、4px 圆角、padding 6px 11px；可附等宽计数后缀（×N，朱砂亮 11px）。悬停边线转朱砂、底转 wood-800。是「可拣的活字」的最小单位。

### 字盘格（Tray Cell）
1:1 方格，wood-800 底、1px 木边、5px 圆角、活字浮雕；内为宋体字胚（clamp(22px, 2.6vw, 34px) 900）+ 模块名（11px）+ 等宽计数（10.5px）。悬停抬升 2px。变体：拣字格（朱砂底）可悬「成版」印章（58px，右上角悬挂 -6deg 旋出）。

### 拣法卡（Mode Card）
1.5px 木纹线边、10px 圆角、wood-950 底、padding 30px；内部可嵌台账（mini-ledger：2px 顶规 + 1px 分隔行的等宽账目）或拼版格（2×2 内嵌小卡）。悬停仅边线提亮——卡片不发光不抬升。

### 代码块（Codeblock）
wood-1000 底、1px 边、6px 圆角；`$` 提示符朱砂亮、命令等宽 13.5px 不换行横向滚动、右侧复制按钮（wood-800 底 4px 圆角，复制成功转朱砂字）。是「三步成版」的动作单元。

### 台账表（Ledger Table）
等宽 14px；表头 12px 铅灰加字距 + 2px 盘缘木顶规；行分隔 1px wood-800，悬停底转 wood-900；合计行 2px 顶规 + 朱砂亮数字。所有计数列右对齐、tabular-nums。

### 牌记（Colophon Frame）
双框印张：2px 边 + 5px 外扩 1px outline，plate 圆角（2px），居中排版；字距 0.5em 的「牌 记」题头；底部中央悬挂朱砂印（52px，-4deg）。是全页的收尾仪式元素，新页面不得复用为普通容器。

## Do's and Don'ts

### Do:
- **Do** 用宋体 900 + 巨型字号作为每屏唯一的视觉声部；论题句一屏一句。
- **Do** 让每个数字带等宽计数与可回溯口径（何处实测、何时截止）。
- **Do** 用内凹浮雕 + 文武线表达全部深度；新组件先问「这个雕版工艺里有没有」。
- **Do** 动效只保留一段主动时刻（拣字落位 + 盖章），入位用 0.5s 内的 cubic-bezier(.2,.7,.3,1) 交错；必须尊重 prefers-reduced-motion。
- **Do** 图标用 1.5px 描边内联 SVG；汉字只能以「字胚内容」身份出现，不作图标。

### Don't:
- **Don't** 引入第二个强调色；朱砂之外的一切颜色必须是木/纸/铅系。
- **Don't** 使用投影、模糊光晕、渐变（文字或面）——平色印刷世界无此工艺。
- **Don't** 使用 kicker/眉题、无信息的大数字卡、emoji 图标（既定世界明文拒绝）。
- **Don't** 把等宽字体用于纯风格化文案；等宽即承诺可核验。
- **Don't** 牌记、印章作为普通装饰复用；它们是收尾与「已拣定」的专属语义。
