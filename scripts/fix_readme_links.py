#!/usr/bin/env python3
"""
Fix broken internal markdown links in README.md by searching for the
referenced filename in known content directories.
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
README = ROOT / "README.md"
SEARCH_DIRS = [
    "industry",
    "rankings",
    "outsourcing",
    "outsourcing-international",
    "rankings-international",
    "interview-skills",
    "interview-skills-international",
    "resume-skills",
    "resume-skills-international",
    "tech-foundations",
    "tech-foundations-international",
    "open-source-communities",
    "open-source-communities-international",
    "topics",
    "topics-international",
    "investment",
    "investment-international",
    "events",
    "events-international",
    "careers",
    "careers-international",
    "legal",
    "legal-international",
    "jobs",
    "management",
    "super-individual",
]


def build_file_index():
    index = {}
    for d in SEARCH_DIRS:
        dir_path = ROOT / d
        if not dir_path.exists():
            continue
        for f in dir_path.rglob("*.md"):
            name = f.name
            index.setdefault(name, []).append(f.relative_to(ROOT).as_posix())
    return index


def is_external(link: str) -> bool:
    return link.startswith("http") or link.startswith("#") or link.startswith("mailto") or not link


def main():
    text = README.read_text(encoding="utf-8")
    index = build_file_index()

    fixed = []
    unresolved = []

    def replacer(match):
        label = match.group(1)
        link = match.group(2)
        if is_external(link):
            return match.group(0)

        raw_link = link.split("#")[0]
        anchor = link[len(raw_link):] if "#" in link else ""

        if (ROOT / raw_link).exists():
            return match.group(0)

        filename = Path(raw_link).name
        candidates = index.get(filename, [])
        if len(candidates) == 1:
            new_link = candidates[0] + anchor
            fixed.append((raw_link, new_link))
            return f"[{label}]({new_link})"
        elif len(candidates) > 1:
            unresolved.append((raw_link, f"multiple candidates: {candidates}"))
            return match.group(0)
        else:
            unresolved.append((raw_link, "not found"))
            return match.group(0)

    new_text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", replacer, text)

    if fixed:
        README.write_text(new_text, encoding="utf-8")

    print(f"Fixed links: {len(fixed)}")
    for old, new in fixed:
        print(f"  {old} -> {new}")

    print(f"\nUnresolved links: {len(unresolved)}")
    for old, reason in unresolved:
        print(f"  {old}: {reason}")


if __name__ == "__main__":
    main()
