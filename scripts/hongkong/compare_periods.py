#!/usr/bin/env python3
"""
汇总 data/hongkong/ 下所有周期的 analysis.json，生成：
- data/hongkong/periods.json：周期索引
- data/hongkong/trend.md：跨期对比；只有 1 期时明确写“暂不能形成趋势”

不会伪造历史数据。后续季度重跑 scrape/analyze 后，本脚本自动追加。

用法：
    python3 scripts/hongkong/compare_periods.py --data-dir data/hongkong
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


def load_periods(data_dir: Path) -> list[dict[str, Any]]:
    periods = []
    for analysis_path in sorted(data_dir.glob("20??-??/analysis.json")):
        data = json.loads(analysis_path.read_text(encoding="utf-8"))
        sample = data.get("sample", {})
        salary = data.get("salary_overall", {})
        periods.append(
            {
                "period": data.get("period") or analysis_path.parent.name,
                "path": analysis_path.parent.name,
                "scraped_at": data.get("anchor_date"),
                "ads": sample.get("ads"),
                "salary_coverage": sample.get("salary_coverage"),
                "salary_coverage_pct": sample.get("salary_coverage_pct"),
                "full_time_salary_n": salary.get("n"),
                "salary_median": salary.get("median"),
                "salary_p25": salary.get("p25"),
                "salary_p75": salary.get("p75"),
                "family_counts": data.get("family_counts", {}),
                "family_salary": {row["name"]: row for row in data.get("family_salary", [])},
                "source_profile": data.get("source_profile", []),
                "language_counts": data.get("language_counts", {}),
                "sector_counts": data.get("sector_counts", {}),
            }
        )
    return periods


def money(value: Any) -> str:
    if value is None:
        return "-"
    return f"HK${value:,.0f}"


def delta(current: Any, previous: Any, unit: str = "") -> str:
    if current is None or previous is None:
        return "-"
    diff = current - previous
    sign = "+" if diff > 0 else ""
    if unit == "%":
        return f"{sign}{diff:.1f}%"
    return f"{sign}{diff:,.0f}{unit}"


def render(periods: list[dict[str, Any]]) -> str:
    lines = [
        "# 香港 IT 岗位数据时间序列",
        "",
        "> 由 `scripts/hongkong/compare_periods.py` 自动生成。只有 1 期时，本文件只记录基线，不构成趋势。",
        "",
        "## 周期索引",
        "",
        "| 周期 | 抓取日 | 岗位广告 | 有薪资 | 全职月薪样本 | 月薪中位数 | P25 | P75 |",
        "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |",
    ]
    for item in periods:
        lines.append(
            f"| {item['period']} | {item['scraped_at'] or '-'} | {item['ads'] or '-'} | "
            f"{item['salary_coverage'] or '-'}（{item['salary_coverage_pct'] or '-'}%） | "
            f"{item['full_time_salary_n'] or '-'} | {money(item['salary_median'])} | "
            f"{money(item['salary_p25'])} | {money(item['salary_p75'])} |"
        )

    latest = periods[-1] if periods else None
    if not latest:
        return "\n".join(lines + ["", "暂无可用周期。", ""])

    lines += [
        "",
        f"## 最新周期：{latest['period']}",
        "",
        "### 岗位族",
        "",
        "| 岗位族 | 广告数 | 有薪样本 | 月薪中位数 |",
        "| --- | ---: | ---: | ---: |",
    ]
    for family, count in sorted(latest["family_counts"].items(), key=lambda item: -item[1]):
        salary = latest["family_salary"].get(family, {})
        lines.append(
            f"| {family} | {count} | {salary.get('n', 0)} | {money(salary.get('median'))} |"
        )

    lines += ["", "### 来源", "", "| 来源 | 广告数 | 有薪样本 | 月薪中位数 |", "| --- | ---: | ---: | ---: |"]
    for source in sorted(latest["source_profile"], key=lambda item: -item.get("ads", 0)):
        lines.append(
            f"| {source['source']} | {source['ads']} | {source['salary_n']} | {money(source.get('median'))} |"
        )

    if len(periods) >= 2:
        previous = periods[-2]
        lines += [
            "",
            "## 环比（最新 vs 上一期）",
            "",
            "| 指标 | 上一期 | 最新 | 变化 |",
            "| --- | ---: | ---: | ---: |",
            f"| 岗位广告 | {previous['ads']} | {latest['ads']} | {delta(latest['ads'], previous['ads'])} |",
            f"| 有薪广告 | {previous['salary_coverage']} | {latest['salary_coverage']} | {delta(latest['salary_coverage'], previous['salary_coverage'])} |",
            f"| 全职月薪中位数 | {money(previous['salary_median'])} | {money(latest['salary_median'])} | {delta(latest['salary_median'], previous['salary_median'])} |",
            f"| 全职月薪样本 | {previous['full_time_salary_n']} | {latest['full_time_salary_n']} | {delta(latest['full_time_salary_n'], previous['full_time_salary_n'])} |",
            "",
            "### 岗位族变化",
            "",
            "| 岗位族 | 上一期 | 最新 | 变化 |",
            "| --- | ---: | ---: | ---: |",
        ]
        families = sorted(set(previous["family_counts"]) | set(latest["family_counts"]))
        for family in families:
            prev = previous["family_counts"].get(family, 0)
            curr = latest["family_counts"].get(family, 0)
            lines.append(f"| {family} | {prev} | {curr} | {delta(curr, prev)} |")
        lines += [
            "",
            "> 环比只反映“公开可达来源 + 当期搜索词”的变化，不等于真实市场供需变化；来源结构变化需要结合来源表一起看。",
        ]
    else:
        lines += [
            "",
            "## 为什么还没有趋势",
            "",
            "目前只有 1 个周期，任何“上升/下降”结论都会是编造的。后续按季度重跑：",
            "",
            "```bash",
            "python3 scripts/hongkong/scrape_hk_jobs.py --out data/hongkong/2027-02",
            "python3 scripts/hongkong/analyze_hk_jobs.py --period-dir data/hongkong/2027-02",
            "python3 scripts/hongkong/compare_periods.py --data-dir data/hongkong",
            "```",
            "",
            "至少积累 2 期后，本文件会自动出现环比表。",
        ]

    lines += [
        "",
        "## 口径提醒",
        "",
        "- 招聘广告数不等于空缺数；同一岗位可能被多个猎头重复发布。",
        "- 薪酬披露率与来源结构每期可能变化，跨期中位数比较要同时看来源画像。",
        "- 2026-11 基线来源：jobs.gov.hk、Talent.com、CPjobs、Michael Page；JobsDB/CTgoodjobs/LinkedIn/eFinancialCareers 未覆盖。",
        "",
    ]
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", default="data/hongkong")
    args = parser.parse_args()
    data_dir = Path(args.data_dir).resolve()
    periods = load_periods(data_dir)
    index = {
        "dataset": "hongkong-it-jobs",
        "updated_at": periods[-1]["scraped_at"] if periods else None,
        "periods": periods,
        "note": "Only 1 period = baseline, not a trend. Re-run quarterly to append.",
    }
    (data_dir / "periods.json").write_text(
        json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (data_dir / "trend.md").write_text(render(periods), encoding="utf-8")
    print(f"periods={len(periods)} wrote {data_dir / 'periods.json'} and {data_dir / 'trend.md'}")


if __name__ == "__main__":
    main()
