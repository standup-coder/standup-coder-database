#!/usr/bin/env python3
"""深圳行业企业清单 Markdown → app/ 二次元地图数据构建脚本。

解析 industry/ 下 24 个 *-shenzhen.md 的企业主表（含 5 种标题变体、两种列错位容错、
quantum/web3 的 profile 段），按法人全名去重合并，按"区+商圈锚点"确定性散开定位，
输出 app/data/companies.json（人读）与 app/data/companies.js（file:// 可加载）。

用法:
    python3 scripts/build_app_data.py           # 构建并写文件
    python3 scripts/build_app_data.py --check   # 仅校验，不写文件
"""

import argparse
import json
import math
import re
import sys
import zlib
from collections import Counter
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDUSTRY_DIR = ROOT / "industry"
APP_DATA_DIR = ROOT / "app" / "data"

# ── 行业 slug → 中文名 / 主题色 ──────────────────────────────────────────────
INDUSTRY_SLUGS = {
    "3c": ("3C电子", "#FF8FAB"),
    "ai": ("人工智能", "#B79CED"),
    "automation": ("工业自动化", "#7FB5E8"),
    "battery": ("电池储能", "#FFC66B"),
    "bigdata": ("大数据", "#7FD8BE"),
    "biotech": ("生物医药", "#F9A1BC"),
    "blockchain": ("区块链", "#9AC8FF"),
    "cloud": ("云计算", "#89CFF0"),
    "cybersecurity": ("网络安全服务", "#C0A6F5"),
    "drone": ("无人机", "#8AD8C8"),
    "ev": ("新能源汽车", "#7EDE9F"),
    "fintech": ("金融科技", "#FFB36B"),
    "internet": ("互联网", "#FF9E9E"),
    "iot": ("物联网", "#9EE6C9"),
    "new-energy": ("新能源", "#B5E48C"),
    "new-materials": ("新材料", "#F4B8D0"),
    "quantum": ("量子科技", "#C9A7EB"),
    "robotics": ("机器人", "#FFB5A7"),
    "security": ("IT安全", "#F49E8C"),
    "semiconductor": ("半导体", "#A3C4F3"),
    "smart-manufacturing": ("智能制造", "#93D3E8"),
    "software": ("软件", "#B8B5FF"),
    "tech-innovation": ("科技创新", "#FFD6A5"),
    "web3": ("Web3/元宇宙", "#D5A6F0"),
}

# ── 主表标题白名单（剥序号后完全匹配，且不含"国际"） ─────────────────────────
HEADING_RE = re.compile(
    r"^##\s*\d*\.?\s*(企业列表|中国企业列表|企业级安全服务企业列表|企业汇总表)\s*$"
)
LISTING_RE = re.compile(r"深交所|上交所|港交所|科创板|纳斯达克|纽交所|北交所|已上市|\(\d{6}\)")
SIZE_RE = re.compile(r"^\d[\d,\-]*\+?人$")
URL_MD_RE = re.compile(r"\[([^\]]*)\]\((https?://[^)]+)\)")

# ── 法人名归一别名（normalize 之后生效） ─────────────────────────────────────
NAME_ALIASES = {
    "华为云计算技术有限公司": "华为技术有限公司",
}

# ── 无区名街道 → 区 ──────────────────────────────────────────────────────────
STREET_ALIASES = {"松岗": "宝安区", "沙井": "宝安区", "西乡": "宝安区"}

DISTRICT_RE = re.compile(r"(南山区|福田区|罗湖区|宝安区|龙岗区|龙华区|坪山区|光明区|盐田区|大鹏|前海)")

# ── 商圈锚点：名称 → {x, y, kw 按序匹配，泛词靠后} ───────────────────────────
ANCHORS = {
    "留仙洞": (312, 368, ["留仙洞", "天空之城"]),
    "南山智园": (340, 345, ["南山智园", "学苑大道", "西丽"]),
    "深圳湾": (372, 480, ["深圳湾", "后海", "滨海大厦", "总部基地"]),
    "蛇口": (282, 498, ["蛇口", "太子湾", "南海大道"]),
    "科技园": (330, 430, ["高新", "科技园", "粤海"]),
    "前海": (218, 388, ["前海", "梦工场"]),
    "宝安中心": (172, 330, ["宝安中心", "海秀路", "新安"]),
    "石岩": (300, 232, ["石岩", "桃花源"]),
    "福永": (188, 262, ["福永", "福海", "新桥", "凤凰"]),
    "松岗": (205, 182, ["松岗", "沙井"]),
    "西乡": (168, 285, ["西乡", "固戍"]),
    "华强北": (492, 380, ["华强北", "华强"]),
    "福田中心": (445, 410, ["福田中心", "市民中心", "车公庙", "香蜜湖", "深南大道", "益田"]),
    "罗湖中心": (560, 392, ["罗湖", "蔡屋围", "东门", "莲塘"]),
    "坂田": (528, 272, ["坂田", "华为基地", "天安云谷", "雪岗"]),
    "布吉": (582, 330, ["布吉", "南湾"]),
    "龙岗中心": (642, 288, ["龙岗中心", "龙翔", "大运", "宝龙"]),
    "坪山中心": (722, 302, ["坪山", "坑梓"]),
    "盐田": (645, 425, ["盐田", "北山", "大鹏湾", "沙头角"]),
    "大鹏": (752, 430, ["葵涌", "大鹏", "坝光"]),
    "光明中心": (285, 145, ["光明", "科学城", "马田", "凤凰城"]),
    "龙华中心": (438, 195, ["龙华", "民治", "大浪", "观澜", "福城"]),
}

# ── 区 → 兜底中心坐标 ────────────────────────────────────────────────────────
DISTRICT_CENTER = {
    "南山区": (310, 445),
    "福田区": (455, 415),
    "罗湖区": (565, 395),
    "宝安区": (175, 280),
    "龙岗区": (600, 300),
    "龙华区": (440, 200),
    "坪山区": (725, 300),
    "光明区": (285, 150),
    "盐田区": (645, 428),
    "大鹏新区": (760, 445),
    "前海": (218, 388),
}

FIELDS = ["name", "abbr", "founded", "fields", "product", "size", "homepage",
          "listing", "funding", "core_product", "address", "repo", "report"]


# ── 解析 ─────────────────────────────────────────────────────────────────────
def find_main_heading(lines):
    """返回主表标题行下标；找不到返回 None。"""
    for i, ln in enumerate(lines):
        if HEADING_RE.match(ln.strip()) and "国际" not in ln:
            return i
    return None


def extract_url(cell):
    cell = cell.strip()
    m = URL_MD_RE.match(cell)
    if m:
        return m.group(2)
    if cell.startswith("http"):
        return cell.split()[0]
    return None


def clean(cell):
    return cell.strip().replace("\\|", "|")


def repair_row(cells):
    """处理两种已核实的列错位，返回 FIELDS 顺序的 dict。"""
    cells = cells + ["-"] * (13 - len(cells)) if len(cells) < 13 else cells
    r = dict(zip(FIELDS, cells[:13]))
    for f in ("homepage", "repo", "report"):
        if r[f] not in ("-", ""):
            r[f] = extract_url(r[f]) or r[f]
        else:
            r[f] = None if f == "homepage" else ""

    # cybersecurity 形态：上市列"-"，交易所代码落进融资列
    if r["listing"] == "-" and r["funding"] != "-" and LISTING_RE.search(r["funding"]):
        r["listing"], r["funding"] = r["funding"], "-"

    # security 形态：核心产品插在代表产品后一列，主页列值缺失左移
    # 实测：cells[5]=核心产品文案、cells[6]=规模、cells[7]=上市代码、cells[8..12]=空
    if len(cells) >= 8 and SIZE_RE.match(cells[6]) and not SIZE_RE.match(cells[5]):
        rest = cells[:5] + cells[6:]
        r["core_product"], r["size"] = cells[5], rest[5]
        r["listing"], r["funding"] = rest[6], ("" if rest[7] == "-" else rest[7])
        r["homepage"] = None

    if r["listing"] == "-":
        r["listing"] = ""
    return r


def parse_main_table(lines, heading_idx):
    """从主表标题向下扫描 13 列表格；下一个 ## 停止。"""
    rows = []
    for ln in lines[heading_idx + 1:]:
        s = ln.strip()
        if s.startswith("## "):
            break
        if not s.startswith("|"):
            if rows:
                break
            continue
        cells = [clean(c) for c in s.strip("|").split("|")]
        if len(cells) < 6:
            continue
        if "企业名称" in cells[0] or set(cells[0]) <= set("-: "):
            continue
        if cells[0] == "-" and cells[1] == "-":
            continue
        rows.append(repair_row(cells))
    return rows


def parse_profile_sections(lines):
    """quantum/web3 形态：#### 标题 + **基本信息** bullets。"""
    out = []
    cur = None
    for ln in lines:
        s = ln.strip()
        if s.startswith("#### "):
            if cur and cur.get("name"):
                out.append(cur)
            cur = {"name": "", "product": "", "address": "", "listing": "",
                   "funding": "", "homepage": None, "founded": "", "fields": "",
                   "size": "", "parent": ""}
        elif cur is not None:
            if s.startswith("## "):
                if cur.get("name"):
                    out.append(cur)
                cur = None
                continue
            m = re.match(r"^[-*]\s*([^：:]+)[：:]\s*(.+)$", s)
            if not m:
                continue
            key, val = m.group(1).strip(), m.group(2).strip()
            mapping = {
                "企业名称": "name", "总部位置": "address", "员工规模": "size",
                "业务领域": "fields", "上市情况": "listing", "融资情况": "funding",
                "成立时间": "founded", "所属公司": "parent",
            }
            if key in mapping:
                cur[mapping[key]] = val
            elif key == "企业主页":
                cur["homepage"] = extract_url(val)
    if cur and cur.get("name"):
        out.append(cur)
    return out


# ── 归一与合并 ───────────────────────────────────────────────────────────────
def normalize_name(name):
    n = name.strip().replace("（", "(").replace("）", ")").replace(" ", "")
    n = re.sub(r"^深圳市?", "", n)
    for alias, target in NAME_ALIASES.items():
        if n == alias:
            n = target
    return n


def guess_abbr(name):
    """profile 段无简称，从名称生成；英文实体取首词避免超长徽章。"""
    n = re.sub(r"^深圳市?", "", name)
    n = re.sub(r"(区块链|元宇宙|数字藏品)?(事业[部室]|工作室|研发中心|办事处|创新中心|实验室)$", "", n)
    n = re.sub(r"(科技)?(股份)?有限公司$", "", n)
    n = re.sub(r"^(深圳)?(市)?", "", n)
    if n and re.match(r"[A-Za-z]", n[0]):
        n = re.sub(r"\s*(Co\.,? Ltd\.?|Inc\.?|Limited|Corp\.?|LLC|Office)$", "", n)
        words = n.split()
        n = words[0] if words else n
    return n[:10] or name


def parent_match(parent, companies):
    """所属公司核心词 → 在已有公司中找包含关系。"""
    core = re.sub(r"(集团|基金会|控股|股份有限公司|有限公司|科技)$", "", parent.strip())
    core = re.sub(r"^深圳市?", "", core)
    if len(core) < 2:
        return None
    for key, c in companies.items():
        if core[:2] in c["name"] or (c["abbr"] and core[:2] in c["abbr"]):
            return key
    return None


def merge_companies(rows):
    """rows: [(slug, dict)] → 去重合并。"""
    companies = {}
    for slug, row in rows:
        name = row["name"]
        key = None
        if row.get("parent"):
            key = parent_match(row["parent"], companies)
        if key is None:
            key = normalize_name(name)
        if key not in companies:
            companies[key] = {
                "name": name, "abbr": row.get("abbr") or guess_abbr(name),
                "industries": [slug], "founded": row.get("founded", ""),
                "fields": row.get("fields", ""), "product": row.get("product", ""),
                "core_product": row.get("core_product", ""), "size": row.get("size", ""),
                "listing": row.get("listing", ""), "funding": row.get("funding", ""),
                "address": row.get("address", ""), "website": row.get("homepage"),
                "repo": row.get("repo", ""), "sources": [],
            }
            if not companies[key]["website"]:
                companies[key]["website"] = row.get("homepage")
        else:
            c = companies[key]
            if slug not in c["industries"]:
                c["industries"].append(slug)
            cand_abbr = row.get("abbr") or guess_abbr(name)
            if cand_abbr and (not c["abbr"] or len(cand_abbr) < len(c["abbr"])):
                c["abbr"] = cand_abbr
            for f in ("founded", "fields", "size", "listing", "funding"):
                if not c[f] and row.get(f):
                    c[f] = row[f]
            if not c["product"] and row.get("product"):
                c["product"] = row["product"]
            if not c["core_product"] and row.get("core_product"):
                c["core_product"] = row["core_product"]
            if row.get("address") and row["address"] != "-":
                c.setdefault("_addr_count", Counter())[row["address"]] += 1
            if row.get("homepage") and not c["website"]:
                c["website"] = row["homepage"]
            if row.get("repo") and not c["repo"]:
                c["repo"] = row["repo"]
        if row.get("address") and row["address"] != "-":
            companies[key].setdefault("_addr_count", Counter())[row["address"]] += 1
        src = row.get("_source")
        if src and src not in companies[key]["sources"]:
            companies[key]["sources"].append(src)
    # 地址择优：频次最高，平票取最长
    for c in companies.values():
        cnt = c.pop("_addr_count", None)
        if cnt:
            best = sorted(cnt.items(), key=lambda kv: (-kv[1], -len(kv[0])))[0][0]
            c["address"] = best
    return companies


# ── 定位 ─────────────────────────────────────────────────────────────────────
def geocode(companies):
    for key, c in companies.items():
        addr = re.sub(r"^总部[:：]|^地址[:：]", "", c["address"] or "").strip()
        if not addr:
            c["district"] = c["anchor"] = None
            c["x"] = c["y"] = None
            continue
        m = DISTRICT_RE.search(addr)
        if not m:
            for street, dist in STREET_ALIASES.items():
                if street in addr:
                    c["district"] = dist
                    break
            else:
                c["district"] = c["anchor"] = None
                c["x"] = c["y"] = None
                continue
        else:
            d = m.group(1)
            c["district"] = d if d.endswith("区") or d == "前海" else (
                "大鹏新区" if "大鹏" in d else d)
        anchor, ax, ay = None, None, None
        for a_name, (x, y, kws) in ANCHORS.items():
            if any(kw in addr for kw in kws):
                anchor, ax, ay = a_name, x, y
                break
        if anchor is None:
            dc = DISTRICT_CENTER.get(c["district"])
            if dc:
                ax, ay = dc
        c["anchor"] = anchor
        if ax is None:
            c["x"] = c["y"] = None
        else:
            c["_ax"], c["_ay"] = ax, ay
            c["x"] = c["y"] = None  # 占位，scatter 阶段填充


def scatter(companies):
    """同锚点/区兜底组内黄金角螺旋散开，crc32 确定性角度。"""
    groups = {}
    for key in sorted(companies):
        c = companies[key]
        if c.get("_ax") is not None:
            groups.setdefault((c["_ax"], c["_ay"]), []).append(key)
    for members in groups.values():
        for i, key in enumerate(members):
            c = companies[key]
            angle = (zlib.crc32(key.encode()) % 628) / 100.0
            r = 20 + 12 * math.sqrt(i)
            c["x"] = round(c["_ax"] + r * math.cos(angle), 1)
            c["y"] = round(c["_ay"] + r * math.sin(angle), 1)
    for c in companies.values():
        c.pop("_ax", None)
        c.pop("_ay", None)


# ── 输出 ─────────────────────────────────────────────────────────────────────
def build_payload(companies, raw_rows, file_count):
    ordered_keys = sorted(companies, key=lambda k: companies[k]["abbr"])
    id_map = {k: f"c{i:03d}" for i, k in enumerate(ordered_keys)}
    comps = []
    for key in ordered_keys:
        c = companies[key]
        comps.append({
            "id": id_map[key], "name": c["name"], "abbr": c["abbr"],
            "industries": c["industries"], "founded": c["founded"],
            "fields": c["fields"],
            "product": c["product"] if c["product"] not in ("", "-") else c["core_product"],
            "size": c["size"], "listing": c["listing"],
            "website": c["website"], "repo": c["repo"] if c["repo"] not in ("", "-") else None,
            "address": c["address"] if c["address"] != "-" else "",
            "district": c["district"], "anchor": c["anchor"],
            "x": c["x"], "y": c["y"], "sources": c["sources"],
        })
    located = sum(1 for x in comps if x["x"] is not None)
    return {
        "meta": {
            "generatedAt": date.today().isoformat(),
            "sourceFiles": file_count, "rawRows": raw_rows,
            "companies": len(comps), "located": located,
        },
        "industries": [
            {"id": slug, "name": name, "color": color}
            for slug, (name, color) in INDUSTRY_SLUGS.items()
        ],
        "companies": comps,
    }


def validate(payload, parsed_files):
    m = payload["meta"]
    comps = payload["companies"]
    assert m["rawRows"] >= 225, f"原始行数过少: {m['rawRows']}"
    assert len(parsed_files) == 24, f"解析文件数 {len(parsed_files)} != 24"
    assert 155 <= m["companies"] <= 195, f"去重后数量异常: {m['companies']}"
    assert m["located"] >= 110, f"定位数过少: {m['located']}"
    nanshan = sum(1 for c in comps if c["district"] == "南山区")
    assert nanshan >= 60, f"南山区数量异常: {nanshan}"
    for c in comps:
        assert c["name"] and c["abbr"], f"名称缺失: {c}"
        assert c["website"] is None or c["website"].startswith("http"), f"主页异常: {c['website']}"
    print(f"[check] rawRows={m['rawRows']} files={m['sourceFiles']} "
          f"companies={m['companies']} located={m['located']} 南山={nanshan}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="仅校验，不写文件")
    args = ap.parse_args()

    rows, parsed_files = [], []
    for path in sorted(INDUSTRY_DIR.glob("*-shenzhen.md")):
        slug = path.name.replace("-shenzhen.md", "")
        lines = path.read_text(encoding="utf-8").splitlines()
        h = find_main_heading(lines)
        file_rows = []
        if h is not None:
            file_rows = parse_main_table(lines, h)
        if not file_rows:
            file_rows = parse_profile_sections(lines)
        if not file_rows:
            print(f"[warn] {path.name}: 未解析到企业数据", file=sys.stderr)
            continue
        for r in file_rows:
            r["_source"] = path.name
            rows.append((slug, r))
        parsed_files.append(path.name)
        print(f"[parse] {path.name}: {len(file_rows)} 家")

    companies = merge_companies(rows)
    geocode(companies)
    scatter(companies)
    payload = build_payload(companies, len(rows), len(parsed_files))
    validate(payload, parsed_files)

    if args.check:
        print("[check] 校验通过（未写文件）")
        return

    APP_DATA_DIR.mkdir(parents=True, exist_ok=True)
    out_json = APP_DATA_DIR / "companies.json"
    out_js = APP_DATA_DIR / "companies.js"
    out_json.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    out_js.write_text(
        "window.APP_DATA = " + json.dumps(payload, ensure_ascii=False) + ";\n",
        encoding="utf-8")
    print(f"[done] {out_json} / {out_js} （{payload['meta']['companies']} 家，"
          f"定位 {payload['meta']['located']} 家）")


if __name__ == "__main__":
    main()
