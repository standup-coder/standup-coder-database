---
title: 深圳科技公司二次元地图使用指南
category: other
tags: [可视化, shenzhen, 数据可视化]
lastUpdated: 2026年8月
aiGenerated: true
---

# 深圳科技公司二次元地图

一个零依赖的纯静态 Web 应用：把 `docs/industry/` 目录下 24 个深圳企业清单（约 240 条记录，去重后 184 家公司）画在一张二次元可爱风格的卡通深圳地图上，以"首字徽章 + 简称"浮标标记各公司办公地址所在商圈。

## 快速开始

```bash
# 方式一：本地服务器（推荐）
python3 -m http.server 8765
# 浏览器打开 http://localhost:8765/app/index.html

# 方式二：直接双击 app/index.html（file:// 协议同样可用）
```

## 功能

- **三套主题**（右上角按钮循环切换，自动记忆）：🌸 粉彩马卡龙贴纸风（默认）、🎮 像素复古游戏风、🐱 猫咪拟人风
- **卡通深圳地图**：11 个区手绘轮廓 + 22 个商圈锚点（科技园、留仙洞、深圳湾、前海、坂田、华强北等），滚轮缩放、拖拽平移
- **聚合浮标**：缩小视图按商圈聚合成"N家"气泡，点击放大展开为公司浮标（首字徽章 + 简称）
- **筛选与搜索**：29 个行业标签筛选、公司/行业/地址关键词搜索
- **详情卡**：公司全名、行业、规模、上市情况、办公地址、官网、开源仓库、来源文件
- **待定位分组**：办公地址缺失的公司收入侧栏"待定位"折叠区，数据不丢失

## 数据管道

地图不自己解析 Markdown。去重、字段口径、城市/行业词表都归 `shared/pipeline/` 管，构建分两步，Markdown 更新后依次重跑即可同步：

```bash
node shared/pipeline/build.mjs                 # docs/industry/*.md → shared/data/dist/*.json
node app/scripts/build-app-data.mjs            # dist → app/data/companies.json + companies.js
node app/scripts/build-app-data.mjs --check    # 仅校验，不写文件
```

`build-app-data.mjs` 只做地图独有的两步：从全量法人里筛"深圳 + 主表口径"（跨国清单与补充名录是同一批法人的另一种写法，放进来就是同一位置两枚图钉），再把办公地址翻译成卡通坐标——区 → 商圈锚点 → 按记录 id 确定性散开，同一条记录每次构建落同一个点。

两处构建都带断言：企业数、定位覆盖率、南山区家数、锚点坐标与 `js/map-data.js` 是否同值。断言失败即退出码 1，产物不会写出去。

当前产物：184 家、定位 142 家、29 个行业。

定位精度说明：公司坐标为"区 + 商圈锚点 + 确定性散开"的卡通示意位置，不代表真实门牌位置。

## 文件结构

```
app/
├── index.html      # 页面骨架
├── css/base.css    # 布局（零字面色值）
├── css/themes.css  # 三套主题变量
├── js/map-data.js  # 区轮廓 / 商圈锚点 / 装饰元素
├── js/map.js       # SVG 渲染、缩放平移、聚合
├── js/panel.js     # 侧栏：筛选/搜索/列表/详情卡
├── js/themes.js    # 主题切换
├── js/main.js      # 入口
└── data/           # 生成产物（companies.json / companies.js）
```
