# 香港 IT 岗位数据时间序列

> 由 `scripts/hongkong/compare_periods.py` 自动生成。只有 1 期时，本文件只记录基线，不构成趋势。

## 周期索引

| 周期 | 抓取日 | 岗位广告 | 有薪资 | 全职月薪样本 | 月薪中位数 | P25 | P75 |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 2026-11 | 2026-11-12 | 235 | 109（46.4%） | 104 | HK$39,000 | HK$20,000 | HK$56,562 |

## 最新周期：2026-11

### 岗位族

| 岗位族 | 广告数 | 有薪样本 | 月薪中位数 |
| --- | ---: | ---: | ---: |
| AI | 78 | 25 | HK$62,500 |
| Cloud/Infra | 56 | 26 | HK$33,833 |
| IT Support/Ops | 55 | 36 | HK$18,000 |
| IT Management | 17 | 11 | HK$77,083 |
| DevOps | 15 | 4 | HK$38,750 |
| SRE | 14 | 2 | HK$51,458 |

### 来源

| 来源 | 广告数 | 有薪样本 | 月薪中位数 |
| --- | ---: | ---: | ---: |
| talent.com | 114 | 0 | - |
| jobs.gov.hk | 62 | 57 | HK$20,000 |
| michaelpage.com.hk | 41 | 39 | HK$56,250 |
| efinancialcareers.hk | 11 | 2 | HK$145,833 |
| cpjobs.com | 7 | 6 | HK$42,500 |

## 为什么还没有趋势

目前只有 1 个周期，任何“上升/下降”结论都会是编造的。后续按季度重跑：

```bash
python3 scripts/hongkong/scrape_hk_jobs.py --out data/hongkong/2027-02
python3 scripts/hongkong/analyze_hk_jobs.py --period-dir data/hongkong/2027-02
python3 scripts/hongkong/compare_periods.py --data-dir data/hongkong
```

至少积累 2 期后，本文件会自动出现环比表。

## 口径提醒

- 招聘广告数不等于空缺数；同一岗位可能被多个猎头重复发布。
- 薪酬披露率与来源结构每期可能变化，跨期中位数比较要同时看来源画像。
- 2026-11 基线来源：jobs.gov.hk、Talent.com、CPjobs、Michael Page；JobsDB/CTgoodjobs/LinkedIn/eFinancialCareers 未覆盖。
