#!/usr/bin/env python3
"""
Fix broken internal markdown links in README.md by searching for the
referenced filename in known content directories.
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
README = ROOT / "README.md"

# 语料根目录：搬到 docs/ 后指向 docs/，否则回落仓库根。
CONTENT_ROOT = ROOT / "docs" if (ROOT / "docs" / "industry").is_dir() else ROOT
# 索引时跳过的目录：docs 下的元文档不是 README 链接的目标语料。
SKIP_DIRS = {"reports", "project-assessments", "node_modules", ".git",
             "console", "app", "scripts"}


def build_file_index():
    """文件名 -> 仓库根相对路径。整棵语料树扫一遍，省掉会过期的目录白名单。"""
    index = {}
    if not CONTENT_ROOT.exists():
        return index
    for f in CONTENT_ROOT.rglob("*.md"):
        if SKIP_DIRS & set(f.parts):
            continue
        index.setdefault(f.name, []).append(f.relative_to(ROOT).as_posix())
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
