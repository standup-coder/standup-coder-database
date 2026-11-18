---
title: 香港岗位数据方法与口径（2026-11）
category: hongkong
tags: [香港, 数据, 抓取, 招聘, 方法]
lastUpdated: 2026年11月
aiGenerated: true
---

# 香港岗位数据方法与口径（2026-11）

## 1. 数据是什么

这是一次 **2026-11-12 的公开招聘广告截面**，不是全量岗位普查，也不是薪酬调查。

| 项目 | 数值 |
| --- | ---: |
| 搜索卡片（抓取） | 1,805（基础 1,715 + eFC 90） |
| 去重卡片（来源+URL/Job Order） | 1,180（基础 1,090 + eFC 90） |
| 命中目标岗位族的卡片 | 266 |
| 抓取到详情记录 | 254（253 条成功） |
| 清洗后进入分析 | 235 |
| 有明确薪资 | 109（46.4%） |
| 全职月薪样本（剔除兼职/实习/时薪/日薪） | 104 |

### 为什么 254 变成 235

- 19 条非香港地点（jobs.gov.hk 的深圳、东莞、惠州等大湾区岗位）；
- 其他边界岗位在分析时按统一分类器重新归类；
- jobs.gov.hk 的 IT 分类页与关键词搜索页会给出同一岗位的不同 jobCard token，已用 Job Order Number 去重；
- eFinancialCareers 的 11 条补充岗位按标题显式 override 到目标岗位族，避免被通用分类器误删。

原始详情仍保留在 `raw/job_details.jsonl`，方便复核和重新分类。

## 2. 来源与可达性

| 来源 | 类型 | 可达性 | 本次用途 |
| --- | --- | --- | --- |
| jobs.gov.hk | 政府就业服务 | 可访问 | 310 条卡片（IT 分类 + 15 个关键词补漏），92 条相关；去重后 62 条进入分析 |
| Talent.com HK | 聚合器 | 可访问 | 486 条卡片，114 条相关；AI/Cloud 多，薪资少 |
| CPjobs | 本地招聘板 | 可访问 | 14 条卡片，7 条相关；代理广告多 |
| Michael Page HK | 猎头 | 可访问 | 280 条 IT 卡片，42 条相关；薪资较常见，雇主匿名 |
| eFinancialCareers | 金融招聘板 | 可访问（VPN + 浏览器辅助） | Technology 分类 90 条卡片，11 条相关，2 条有薪资；详情页公开 |
| CTgoodjobs | 本地招聘板 | 不可访问（Human Verification / 405） | 未抓取，未绕过验证 |
| JobsDB | 本地招聘板 | 不可访问（Cloudflare） | 未抓取，避免绕过安全验证 |
| Indeed HK | 聚合器 | 不可访问（Cloudflare） | 未抓取 |
| LinkedIn Jobs | 社交招聘 | 可访问（VPN + 浏览器，公开搜索；未登录） | 独立平台样本 171 条，见 global-platforms |
| Wellfound | startup 招聘板 | 可访问 | 独立平台样本 6 条 |
| Randstad HK | 全球猎头 | 可访问 | 独立平台样本 11 条 |
| Hays HK | 猎头 | 搜索页受 robots 限制 | 未系统抓取 |

> LinkedIn、Wellfound、Randstad 的香港岗位抽样是独立补充样本，不并入本核心数据集；平台可达性与样本量见 [全球招聘平台香港机会](global-platforms.md) 和 `raw/global-platforms/platform_summary.json`。

**这意味着样本偏向“可公开抓取”的来源**：政府、聚合器、部分猎头，而不是全量市场。JobsDB 与 CTgoodjobs 是香港最大的本地招聘板之一，缺失会漏掉大量本地中小企业岗位；这也是本专题仍不能称为“完整市场认知”的主要原因。

## 3. 抓取与清洗流程

```text
搜索页 → 卡片字段（标题/公司/地点/薪资/日期/URL）
      → 标题分类（AI / SRE / DevOps / Cloud-Infra / IT Support / IT Management）
      → 详情页（职责/要求/福利/语言/合同）
      → 去重（来源+URL）
      → 地点过滤（剔除纯大湾区岗位）
      → 技能/语言/签证关键词提取
      → 统计（岗位族、薪酬、雇主、来源偏差）
```

### 关键规则

- **只抓公开页面**：不登录、不绕过 Cloudflare、不伪造身份。
- **单线程 + 延迟**：默认 0.3–0.6 秒/请求；原始 HTML 以 gzip 缓存，避免重复请求。
- **去重键**：Talent/CPjobs/Michael Page 用 `source + source_url`（Talent 的岗位 ID 在 query string 里，不能截断）；jobs.gov.hk 优先用 Job Order Number，详情抓取后再按 `order_no` 二次合并，避免 IT 分类页与关键词搜索页的 token 差异造成重复。
- **岗位分类**：按标题关键词做启发式分类，优先识别技术型 AI；AI 销售/法务/投资/产品等非工程岗位剔除。
- **地点过滤**：含深圳/东莞/广州/惠州/内地/澳门等且无香港办公地的岗位剔除；“Wanchai, Mainland China”这类保留香港办公地。
- **薪资归一化**：年薪 ÷ 12；兼职、实习、时薪/日薪不进入月薪中位数；区间取中点。
- **交叉来源重复**：保留广告级记录，用 `same_title_company_count` 标记同标题+同公司的重复；分析以广告为单位。

## 4. 字段说明

| 字段 | 含义 |
| --- | --- |
| `source` | 来源平台 |
| `source_url` | 原始岗位详情 URL |
| `title` / `company` | 广告标题/公司（猎头岗位可能是 “Confidential employer (via Michael Page)”） |
| `role_family` | AI / SRE / DevOps / Cloud/Infra / IT Support/Ops / IT Management |
| `role_subfamily` | 更细的角色分类 |
| `seniority` | Leadership / Manager / Lead / Senior / Mid / Junior |
| `employer_sector` | 银行/保险/科技厂商/IT 服务/Web3/政府/其他（启发式） |
| `is_agency` | 是否为猎头/代理广告 |
| `location` | 广告地点（未标准化，保留原文） |
| `employment_type` | Permanent / Contract / Full-time / Part-time / Unspecified |
| `salary_text` | 广告薪资原文 |
| `salary_period` | monthly / annual / daily / hourly |
| `salary_monthly_min/max` | 归一化后的月薪区间 |
| `salary_mid` | 区间中点（用于统计） |
| `posted_date` / `recency_days` | 发布日/距抓取日天数（相对日期为估算） |
| `skills` | 从标题+描述提取的技能标签 |
| `cantonese/mandarin/english` | JD 是否提及该语言 |
| `visa_flags` | IANG/TTPS/QMAS/visa sponsorship/right to work 提及 |
| `description` | 详情页正文（清洗后） |

完整字段见 [`jobs_clean.csv`](../../data/hongkong/2026-11/jobs_clean.csv) 与 [`jobs_clean.json`](../../data/hongkong/2026-11/jobs_clean.json)。

## 5. 数据质量与已知问题

1. **来源偏差**：jobs.gov.hk 偏中初级、薪资透明；Michael Page 偏资深、匿名；eFinancialCareers 偏金融科技/银行高阶岗位；Talent.com 偏 AI/云、无薪资。总体中位数不能当市场基准。
2. **广告 ≠ 空缺**：同一岗位可能被多个猎头重复发布；样本按广告计数。
3. **薪资缺失**：52% 的广告没有薪资；有薪资的样本存在选择偏差。
4. **雇主匿名**：猎头岗位无法准确归因到 end client；雇主类型是启发式分类。
5. **标题歧义**：Production Support 可能是 SRE，也可能是应用支持；Platform Engineer 可能是 DevOps，也可能是产品平台。分类器有边界误差。
6. **地点歧义**：部分广告只写 “Hong Kong”；jobs.gov.hk 含大湾区岗位，已剔除纯内地岗位。
7. **日期误差**：相对日期（“30 days ago”）按抓取日换算，可能有一日误差；Michael Page 部分岗位没有发布日期。
8. **语言提取**：只统计 JD 明确出现 “Cantonese/Mandarin/English” 的广告；“中文”未单独统计。
9. **签证提取**：只统计明确关键词；0 条提及不代表雇主不担保。
10. **内容时效**：2026-11-12 截面；广告会过期、改薪、下架。

## 6. 复现

```bash
# 抓取（写入 data/hongkong/2026-11）
python3 scripts/hongkong/scrape_hk_jobs.py \
  --out data/hongkong/2026-11 \
  --delay 0.4

# 使用缓存重新解析（不重新请求）
python3 scripts/hongkong/analyze_hk_jobs.py \
  --period-dir data/hongkong/2026-11
```

脚本会：

- 将搜索页/详情页 HTML 缓存到 `data/hongkong/2026-11/raw/html/`（gzip）；
- 写 `raw/search_cards.jsonl`、`raw/job_details.jsonl`；
- 写 `source_manifest.json`（来源、时间、数量、错误）；
- 生成 `jobs_clean.csv`、`jobs_clean.json`、`analysis.json`、`analysis.md`。

## 7. 合规与伦理

- 只抓公开、无需登录的招聘信息；
- 遵守 robots.txt；对明确禁止抓取的搜索路径不抓；
- 单线程、限速，避免对招聘网站造成压力；
- 不抓取、不传播求职者个人信息；岗位广告中的联系方式仅用于核验，不进入统计；
- 数据仅用于研究与求职参考，不用于批量营销或转售。

## 8. 时间序列

目前只有 **2026-11 一个周期**，所以只能做基线，不能声称“上升/下降”。脚手架已经搭好：

```bash
# 下一季度
python3 scripts/hongkong/scrape_hk_jobs.py --out data/hongkong/2027-02
python3 scripts/hongkong/analyze_hk_jobs.py --period-dir data/hongkong/2027-02
python3 scripts/hongkong/compare_periods.py --data-dir data/hongkong
```

- `data/hongkong/periods.json`：自动索引所有周期；
- `data/hongkong/trend.md`：只有 1 期时标注“暂不能形成趋势”，≥2 期自动生成环比表；当前见 [trend.md](../../data/hongkong/trend.md)；
- 环比只反映“公开可达来源 + 当期搜索词”的变化，不等于真实市场供需变化。

## 9. 后续可以怎么补

- 接入 JobsDB / CTgoodjobs 的公开搜索（如果访问条件允许），补充本地中小企业岗位；
- 用 eFinancialCareers / LinkedIn 补金融与高级岗位；
- 对 SRE/DevOps 做更深的关键词扩展（Production Support、Trading Support、Platform）；
- 每季度重跑一次，形成时间序列，观察 AI/SRE/Cloud 需求与薪资变化；
- 对同一岗位跨来源去重（标题+公司+描述相似度），把“广告数”进一步收敛为“岗位数”。
