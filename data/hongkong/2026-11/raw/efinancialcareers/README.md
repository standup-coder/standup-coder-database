# eFinancialCareers 补充抓取（2026-11-12）

## 为什么单独放这里

eFinancialCareers 对普通 HTTP 请求返回 403，但在开启 VPN 的真实浏览器里可以公开访问。为避免把浏览器辅助抓取混进主 scraper 的 HTTP 逻辑，这里保存原始浏览器提取结果，再由 `scripts/hongkong/ingest_efinancialcareers.py` 转成统一 schema。

## 文件

| 文件 | 内容 |
| --- | --- |
| `cards_90.json` | `https://www.efinancialcareers.hk/jobs/technology` 前 90 条 Technology 卡片 |
| `wanted_11.json` | 按 SRE/DevOps/AI/Cloud/IT 管理筛出的 11 条卡片 |
| `details_11.json` | 11 条岗位详情页正文（浏览器渲染后提取） |

## 提取范围

- 页面：eFinancialCareers HK 的 Technology 分类，按发布时间排序；
- 先加载 90 条卡片，再按标题筛出 11 条与目标岗位族相关的岗位；
- 详情页逐条在浏览器内 `fetch`，取 `main` 文本，未登录、未绕过验证；
- 不在主 scraper 中伪装 HTTP 请求，避免与站点访问策略冲突。

## 转换

```bash
python3 scripts/hongkong/ingest_efinancialcareers.py \
  --period-dir data/hongkong/2026-11
```

输出：`data/hongkong/2026-11/raw/efinancialcareers_details.jsonl`，由 `analyze_hk_jobs.py` 自动并入分析。

## 备注

- 这批数据是**补充样本**，不是 eFinancialCareers 的全量抓取；
- 只保留了 11 条与目标岗位族相关的岗位，筛选规则见 `ingest_efinancialcareers.py` 的 `OVERRIDES`；
- 薪资为广告原文，部分为 “Competitive/Negotiable”，不进入薪酬统计。
