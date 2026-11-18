---
title: 香港 IT 求职专题
category: hongkong
tags: [香港, 求职, IT, SRE, AI, DevOps, 薪酬]
lastUpdated: 2026年11月
aiGenerated: true
---

# 香港 IT 求职专题

## 1. 这个专题解决什么问题

本专题不再用内地 JD 外推香港，而是用一轮**真实公开招聘数据**回答四个问题：

1. 香港到底有哪些 IT / SRE / AI / DevOps 岗位，标题长什么样；
2. 这些岗位在哪些类型的雇主里，薪酬区间大概如何；
3. 需要什么技能、语言、合同形态和签证条件；
4. 现有数据能支持到什么程度的判断，哪些仍然不能下结论。

数据抓取日为 **2026-11-12**，来源为 jobs.gov.hk（劳工处）、Talent.com HK、CPjobs、Michael Page，以及 VPN 后浏览器辅助抓取的 eFinancialCareers。共 1,180 条去重卡片（含 eFC 90 条）、254 条岗位详情记录（253 条成功），清洗后保留 **235 条香港岗位广告**，其中 **104 条有可用的全职月薪**。

## 2. 五个关键结论

1. **样本里 AI 岗位最多，但别把样本占比当市场占比。** AI 78 条（33.2%）、IT Support/Ops 55 条、Cloud/Infra 56 条、DevOps 15 条、SRE 14 条、IT Management 17 条。检索词天然偏向 AI，所以这组比例不能直接外推成全港岗位结构。
2. **薪酬是双峰的，不是一条平滑曲线。** 全职月薪样本中位数 HK$39,000，P25–P75 为 HK$20,000–HK$56,562；但 IT Support 中位数约 HK$18,000，AI 约 HK$62,500，IT Management 约 HK$77,083。把“香港 IT 薪资”说成一个数会严重误导。
3. **SRE 岗位少、偏金融、以中高级混合为主。** 14 条 SRE 广告中 Mid 10、Senior 3、Leadership 1；雇主集中在交易/资管/银行基础设施（Millennium、Jefferies、State Street、GFT 等），标题常写成 Production Support、Platform Engineer、SRE/DevOps 混合。
4. **招聘高度依赖猎头，雇主匿名很常见。** 235 条中 79 条（33.6%）来自可识别的招聘机构；Michael Page 的 41 条全部匿名。投递前必须问清 end client、合同类型、薪资区间。
5. **语言要求分化明显。** 英语 125 条、粤语 87 条、普通话 84 条。AI 与云岗位更偏英语；本地银行、政府、IT 支持类岗位对粤语的要求明显更高。样本里 **0 条**广告明确写 IANG / TTPS / QMAS / 签证担保，这不代表不担保，而是通常不写在广告里。

## 3. 这套数据能支持到什么程度

| 可以支持 | 仍不能支持 |
| --- | --- |
| 香港 IT 岗位的主要类型、标题变体和技能要求 | 全港在招岗位的全量普查（JobsDB/CTgoodjobs/LinkedIn 等未覆盖） |
| 金融/保险/科技厂商/外包/Web3/政府等雇主结构 | 每个雇主的真实招聘人数、团队规模和 headcount |
| 公开招聘广告的 HKD 月薪区间与来源偏差 | 精确的市场薪酬基准（披露率仅 48%，且来源不均） |
| SRE/DevOps/AI 的岗位地图与转入路径 | SRE/DevOps 的稳定薪酬中位数（样本仅 2/4 条） |
| 语言、合同、签证路径和求职渠道 | 签证获批概率、雇主的实际担保意愿 |
| 2026-11 的一次市场截面 | 长期趋势（需要按季度重跑形成时间序列） |

**一句话**：它足以支持“有依据的求职准备和初步市场判断”，但还不足以称为“香港职场的完整认知”。完整认知还需要补上未抓取的主流招聘板、真实面试/offer 数据，以及时间序列。

## 4. 文档导航

| 文档 | 内容 | 适合谁 |
| --- | --- | --- |
| [香港 IT 就业市场总览](tech-hongkong.md) | 产业结构、雇主类型、岗位族、区域分布、招聘文化 | 先建立全景 |
| [SRE / DevOps / AI 岗位地图](sre-devops-ai-job-map.md) | 各岗位族的标题、技能、薪酬、雇主、转入路径 | 正在选方向 |
| [薪酬与雇主清单](salary-and-employers.md) | 样本薪酬表、来源偏差、雇主/猎头清单、谈薪要点 | 比较 offer |
| [求职渠道与签证指南](job-search-visa-guide.md) | 招聘网站、猎头、IANG/TTPS/QMAS/GEP、语言与合同 | 准备投递 |
| [全球招聘平台香港机会](global-platforms.md) | LinkedIn、Wellfound、Randstad、eFinancialCareers 等平台可达性与抽样 | 扩大机会面 |
| [数据方法与口径](data-notes.md) | 抓取方法、字段、来源限制、复现命令 | 复核数据 |

配套数据在 [`data/hongkong/2026-11/`](../../data/hongkong/2026-11/)：

- [`analysis.md`](../../data/hongkong/2026-11/analysis.md)：完整统计报告
- [`jobs_clean.csv`](../../data/hongkong/2026-11/jobs_clean.csv)：清洗后的 235 条岗位
- [`jobs_clean.json`](../../data/hongkong/2026-11/jobs_clean.json)：带描述与技能标签的 JSON
- [`raw/job_details.jsonl`](../../data/hongkong/2026-11/raw/job_details.jsonl)：243 条基础详情
- [`raw/efinancialcareers_details.jsonl`](../../data/hongkong/2026-11/raw/efinancialcareers_details.jsonl)：11 条 eFC 补充详情
- [`raw/search_cards.jsonl`](../../data/hongkong/2026-11/raw/search_cards.jsonl)：1,090 条基础去重搜索卡片
- [`source_manifest.json`](../../data/hongkong/2026-11/source_manifest.json)：来源、时间、数量、失败记录
- [`trend.md`](../../data/hongkong/trend.md)：跨期对比（目前只有 2026-11 基线，暂不能形成趋势）
- [`periods.json`](../../data/hongkong/periods.json)：周期索引，后续季度自动追加
- [`global-platforms/platform_summary.json`](../../data/hongkong/2026-11/raw/global-platforms/platform_summary.json)：全球平台可达性、抽样数量、岗位族/公司/标题统计

## 5. 怎么读这些数字

- **广告数 ≠ 空缺数。** 同一岗位可能被多个猎头重复发布；本专题按“广告”统计，并标注了标题+公司重复数。
- **薪资有选择性披露。** 只有 48% 的广告有明确薪资；jobs.gov.hk 绝大多数有薪资（57/62），Talent.com 几乎没有，因此薪酬中位数会被来源结构影响。
- **雇主结构是粗分类。** 银行/保险/科技/外包等是按公司名关键词做的启发式分类，用于看趋势，不用于法律或商业尽调。
- **地点已做过滤。** jobs.gov.hk 的“电脑及资讯科技”类别包含深圳、东莞等大湾区岗位，分析时已剔除；原始数据仍保留，便于复核。
- **时间窗口是 2026-11-12 的一次截面。** 招聘广告会过期、改薪、下架；投递前请以原链接为准。

## 6. 复现与刷新

```bash
# 抓取（默认写入 data/hongkong/2026-11）
python3 scripts/hongkong/scrape_hk_jobs.py --out data/hongkong/2026-11

# 清洗 + 统计
python3 scripts/hongkong/analyze_hk_jobs.py --period-dir data/hongkong/2026-11
```

脚本：[scrape_hk_jobs.py](../../scripts/hongkong/scrape_hk_jobs.py) · [analyze_hk_jobs.py](../../scripts/hongkong/analyze_hk_jobs.py) · [compare_periods.py](../../scripts/hongkong/compare_periods.py)。

脚本只抓公开页面，不绕过登录、Cloudflare 或地区限制；请求间隔默认 0.3–0.6 秒。被 Cloudflare 拦截的 JobsDB / Indeed / eFinancialCareers 已在来源清单中标注为不可访问。

## 7. 本轮补齐记录

- **jobs.gov.hk 关键词补漏**：新增 15 个关键词检索，抓到 87 条额外卡片；经 Job Order 去重后，绝大多数与 IT 分类页重复，基础样本仅比上一轮多 1 条（224 vs 223）。
- **eFinancialCareers（VPN + 浏览器辅助）**：Technology 分类加载 90 条卡片，筛出 11 条相关岗位（Cloud/IT 管理/AI/DevOps/IT 支持），其中 2 条有明确薪资；样本从 224 增至 235。原始卡片与详情保存在 `raw/efinancialcareers/`。
- **CTgoodjobs / JobsDB**：VPN 后仍分别触发 Human Verification / Cloudflare，未绕过。
- **去重**：jobs.gov.hk 改用 Job Order Number 二次合并，避免 IT 分类页与关键词搜索页的 token 差异造成重复。
- **全球平台**：LinkedIn 抽 480 张卡片（243 个唯一岗位、171 条相关）、Wellfound 56 张（6 条相关）、Randstad IT 46 条（11 条相关）；作为独立样本，不混入核心 235 条。详见 [全球招聘平台香港机会](global-platforms.md)。
- **时间序列**：新增 `periods.json` / `trend.md` 和 [compare_periods.py](../../scripts/hongkong/compare_periods.py)，但只有 2026-11 基线，明确不伪造趋势。

## 8. 免责声明

本专题是求职与市场研究的参考材料，不构成薪酬承诺、法律意见或签证建议。签证政策、税务、MPF、雇佣条例以香港特区政府及入境事务处最新公布为准。数据由公开广告整理，可能存在过期、重复、翻译误差和分类误差。
