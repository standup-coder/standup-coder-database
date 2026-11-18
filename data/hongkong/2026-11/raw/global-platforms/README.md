# 全球招聘平台香港岗位补充样本（2026-11-12）

## 定位

这是独立于核心 235 条样本的“平台机会抽样”，用于回答“全球主要平台上有哪些香港岗位”。**不并入核心统计**，原因：

- LinkedIn 公开卡片没有薪资和完整 JD；
- Wellfound 薪资是 USD 年包 + equity；
- Randstad 部分薪资 period 标注异常（per year 但金额更像月薪）；
- 跨平台重复岗位无法可靠去重。

## 文件

| 路径 | 内容 |
| --- | --- |
| `linkedin/*.json` | 8 个关键词的首屏 LinkedIn 卡片（DevOps、SRE、Platform、Cloud、AI、ML、IT Support 等） |
| `wellfound/*.json` | Wellfound 香港 3 页卡片 |
| `randstad/cards_46.json` | Randstad IT 分类 46 个岗位卡片 |
| `linkedin_relevant.jsonl` | 统一 schema 的 LinkedIn 相关岗位（171 条） |
| `wellfound_relevant.jsonl` | 统一 schema 的 Wellfound 相关岗位（6 条） |
| `randstad_relevant.jsonl` | 统一 schema 的 Randstad 相关岗位（11 条） |
| `platform_summary.json` | 平台可达性、卡片数、岗位族、公司/标题 Top、薪资字段统计 |

## 提取方式

- 全部在 VPN 后的真实浏览器里访问公开页面；
- LinkedIn：每个关键词首屏 60 张卡片，未登录、未绕过登录墙；
- Wellfound：香港 location 页 3 页；
- Randstad：IT 分类页点 “view more” 加载 46 个岗位；
- 未抓取登录后的内容，未绕过 Cloudflare/PerimeterX/Human Verification。

## 转换

```bash
python3 scripts/hongkong/ingest_global_platforms.py \
  --period-dir data/hongkong/2026-11
```

## 已知限制

- LinkedIn 首屏不是全量；同一岗位会跨关键词重复；
- Wellfound 薪资不能与 HKD 月薪直接比较；
- Randstad 薪资 period 有异常，只保留原文；
- Indeed、Glassdoor、Robert Walters、Adzuna、JobsDB、CTgoodjobs 本次不可访问。
