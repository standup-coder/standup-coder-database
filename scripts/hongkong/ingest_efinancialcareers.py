#!/usr/bin/env python3
"""
把浏览器辅助抓取的 eFinancialCareers 岗位转成统一 schema。

背景：eFinancialCareers 对普通 HTTP 请求返回 403，但在开启 VPN 的真实浏览器里
可以公开访问。本脚本消费浏览器提取的 cards_90.json / details_11.json，生成
raw/efinancialcareers_details.jsonl，并更新 source_manifest 的补充来源块。

浏览器提取方法见 data/hongkong/2026-11/raw/efinancialcareers/README.md。

用法：
    python3 scripts/hongkong/ingest_efinancialcareers.py \
      --period-dir data/hongkong/2026-11
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent))
from scrape_hk_jobs import (  # noqa: E402
    classify_seniority,
    classify_title,
    extract_employment_type,
    iso_now,
    normalize_company,
    normalize_title,
    parse_date,
    parse_salary,
)

ANCHOR = date(2026, 11, 12)

OVERRIDES: list[tuple[str, str, str, str]] = [
    (r"AI Engineer - Global AI Fintech", "AI", "AI / ML Engineering", "Mid/Unspecified"),
    (r"Trading Platform Engineer", "DevOps", "Platform Engineering", "Mid/Unspecified"),
    (r"Systems Engineer \(Mainframe\)", "Cloud/Infra", "Cloud / Infrastructure", "Junior"),
    (r"Helpdesk Support Analyst", "IT Support/Ops", "IT Support / Operations", "Mid/Unspecified"),
    (r"IT Infrastructure & Business Technology Engineer", "Cloud/Infra", "Cloud / Infrastructure", "Mid/Unspecified"),
    (r"Technical.*Solution Architect", "Cloud/Infra", "Cloud / Architecture", "Mid/Unspecified"),
    (r"Senior Systems Manager", "IT Management", "IT Management / Workplace Technology", "Manager"),
    (r"Deputy CTO", "IT Management", "IT Leadership / CTO", "Leadership"),
    (r"Network Specialist", "Cloud/Infra", "Network / Data Centre", "Mid/Unspecified"),
    (r"Manager, IT Services", "IT Management", "IT Management", "Manager"),
    (r"Vice President - IT Service Operation", "IT Management", "IT Service Management", "Leadership"),
]


def clean_location(value: str) -> str:
    value = re.sub(r"(Permanent|Contract|Full[- ]?time|Part[- ]?time)", " ", value or "", flags=re.I)
    value = re.sub(r"\s+", " ", value).strip(" ,-")
    return value or "Hong Kong"


def override_for(title: str) -> tuple[str, str, str] | None:
    for pattern, family, subfamily, seniority in OVERRIDES:
        if re.search(pattern, title, re.I):
            return family, subfamily, seniority
    return None


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--period-dir", default="data/hongkong/2026-11")
    args = parser.parse_args()
    period_dir = Path(args.period_dir).resolve()
    raw_dir = period_dir / "raw" / "efinancialcareers"
    cards = json.loads((raw_dir / "wanted_11.json").read_text(encoding="utf-8"))["cards"]
    details = {
        item["url"]: item
        for item in json.loads((raw_dir / "details_11.json").read_text(encoding="utf-8"))["out"]
    }

    records = []
    for index, card in enumerate(cards, start=1):
        detail = details.get(card["url"], {})
        text = detail.get("text") or ""
        title = (detail.get("title") or card["title"]).strip()
        override = override_for(title)
        if override:
            family, subfamily, seniority = override
        else:
            family, subfamily, _ = classify_title(title)
            seniority = classify_seniority(title)
        if not family:
            continue
        salary = parse_salary(card.get("salary") or text, title, allow_plain_dollar=True)
        employment = extract_employment_type(text) or "Unspecified"
        posted_date = parse_date(card.get("posted"), datetime.combine(ANCHOR, datetime.min.time()).replace(tzinfo=timezone.utc))
        record = {
            "source": "efinancialcareers.hk",
            "source_type": "finance job board (browser-assisted)",
            "source_url": card["url"],
            "search_query": "efc-technology",
            "search_queries": ["efc-technology"],
            "search_pages": [1],
            "title": title,
            "detail_title": title,
            "company": card.get("company", ""),
            "company_norm": normalize_company(card.get("company", "")),
            "title_norm": normalize_title(title),
            "location": clean_location(card.get("location", "")),
            "snippet": text[:500],
            "description": text[:25000],
            "salary": salary,
            "employment_type": employment,
            "posted_text": card.get("posted", ""),
            "posted_date": posted_date,
            "fetched_at": iso_now(),
            "detail_fetched": True,
            "role_family": family,
            "role_subfamily": subfamily,
            "role_family_override": family,
            "role_subfamily_override": subfamily,
            "seniority": seniority,
            "same_title_company_count": 1,
            "id": f"efc-{index:03d}",
        }
        records.append(record)

    out_path = period_dir / "raw" / "efinancialcareers_details.jsonl"
    with out_path.open("w", encoding="utf-8") as handle:
        for record in records:
            handle.write(json.dumps(record, ensure_ascii=False) + "\n")

    manifest_path = period_dir / "source_manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else {}
    manifest.setdefault("sources", {})["efinancialcareers.hk"] = {
        "type": "finance job board",
        "accessible": True,
        "access_method": "browser-assisted public pages (VPN required from mainland; no login bypass)",
        "cards": 90,
        "relevant": len(records),
        "details": len(records),
        "note": "Technology category first 90 cards loaded via Show more; 11 relevant titles selected and detail pages fetched in-browser.",
    }
    manifest.setdefault("supplementary_counts", {})["efinancialcareers.hk"] = {
        "cards": 90,
        "relevant": len(records),
        "details": len(records),
    }
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {out_path} records={len(records)}")


if __name__ == "__main__":
    main()
