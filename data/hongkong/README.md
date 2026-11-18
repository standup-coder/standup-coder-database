# 香港岗位数据（2026-11）

公开渠道抓取的香港 IT / SRE / AI / DevOps 岗位样本，配套专题见 [`docs/hongkong/`](../../docs/hongkong/README.md)。

## 快速数字

| 指标 | 数值 |
| --- | ---: |
| 搜索卡片（原始） | 1,805（基础 1,715 + eFC 90） |
| 去重卡片 | 1,180（基础 1,090 + eFC 90） |
| 命中目标岗位族 | 266 |
| 抓取详情记录 | 254（253 条成功，1 条 410；含 eFC 11） |
| 清洗后进入分析 | 235 |
| 有明确薪资 | 109（46.4%） |
| 全职月薪样本 | 104 |

## 文件

| 路径 | 内容 |
| --- | --- |
| `2026-11/analysis.md` | 人类可读的统计报告 |
| `2026-11/analysis.json` | 完整统计（岗位族、薪酬、技能、来源、局限） |
| `2026-11/jobs_clean.csv` | 235 条清洗后岗位，适合 Excel/BI |
| `2026-11/jobs_clean.json` | 同上，含描述、技能、语言、签证标记 |
| `2026-11/raw/search_cards.jsonl` | 1,090 条基础去重搜索卡片（含未命中岗位） |
| `2026-11/raw/job_details.jsonl` | 243 条基础详情记录（242 条成功，含原始描述） |
| `2026-11/raw/efinancialcareers/` | eFC 浏览器辅助抓取：90 条卡片、11 条相关、11 条详情 |
| `2026-11/raw/efinancialcareers_details.jsonl` | eFC 转换后的 11 条统一 schema 记录 |
| `2026-11/raw/global-platforms/` | LinkedIn / Wellfound / Randstad 独立补充样本与平台可达性摘要 |
| `2026-11/raw/html/` | 搜索页/详情页 gzip 缓存（约 23MB，用于复核；可随时重抓，不必提交） |
| `2026-11/source_manifest.json` | 来源、时间、数量、失败记录 |
| `periods.json` | 周期索引（后续季度追加） |
| `trend.md` | 跨期对比；目前只有 2026-11 基线，明确标注“暂不能形成趋势” |

## 主要字段

`source`, `source_url`, `title`, `company`, `role_family`, `role_subfamily`, `seniority`, `employer_sector`, `is_agency`, `location`, `employment_type`, `salary_text`, `salary_period`, `salary_monthly_min`, `salary_monthly_max`, `salary_mid`, `posted_date`, `recency_days`, `skills`, `cantonese`, `mandarin`, `english`, `visa_flags`, `description`.

字段口径见 [`docs/hongkong/data-notes.md`](../../docs/hongkong/data-notes.md)。

## 刷新

```bash
python3 scripts/hongkong/scrape_hk_jobs.py --out data/hongkong/2026-11
python3 scripts/hongkong/analyze_hk_jobs.py --period-dir data/hongkong/2026-11
python3 scripts/hongkong/compare_periods.py --data-dir data/hongkong
```

后续季度把 `--out` / `--period-dir` 换成 `2027-02` 等新目录，`compare_periods.py` 会自动追加 `periods.json` 与 `trend.md`。至少积累 2 期后才会有环比表，脚本不会伪造历史数据。

## 注意

- 这是招聘广告样本，不是全量岗位普查，也不是薪酬调查。
- 235 条为清洗后样本；原始 254 条中剔除了 19 条纯大湾区岗位，原始 JSONL 仍保留，便于复核。
- eFinancialCareers 是 VPN + 浏览器辅助抓取，原始卡片与详情在 `2026-11/raw/efinancialcareers/`；不是全量 eFC 抓取。
- 全球平台（LinkedIn/Wellfound/Randstad）是独立机会抽样，不并入核心 235 条；原因见 `raw/global-platforms/README.md`。
- 薪资只覆盖 48% 的广告；总体中位数受来源结构影响，不能当市场基准。
- 猎头岗位雇主常匿名；`employer_sector` 是关键词启发式分类。
- 数据抓取日 2026-11-12；广告会过期，投递前以原链接为准。
