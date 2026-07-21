#!/usr/bin/env python3
"""
全仓库 industry 主表字段统一 + 数据债清理

目标：
1. 将所有"企业清单主表"（17/18/15 列变体）统一为 13 列标准表头
2. 移除高数据债/主观字段：盈利模式、技术架构、员工口碑、法律风险
3. 保留并清理字段：[待补充] → -（表示待核实）
4. 不动分类子表（3-8 列的简表）

13 列目标表头：
企业名称 | 简称 | 成立时间 | 业务领域 | 代表产品/服务 | 公司规模 | 企业主页 |
上市情况 | 融资情况 | 核心产品 | 办公地址 | 开源仓库 | 财报

处理逻辑：
- 按列名匹配（而非位置），从原表头中提取保留列的值
- "办公地址"列可能叫"广州办公地址/上海办公地址/总部所在地"，统一映射
- "企业主页"列可能叫"官网"，统一映射
- 移除的字段直接丢弃
- [待补充] 统一替换为 -

用法：
    python3 scripts/cleanup_industry_tables.py --dry-run   # 预览
    python3 scripts/cleanup_industry_tables.py             # 执行
"""

import os
import re
import argparse
from pathlib import Path

# 13 列目标表头（顺序即输出顺序）
TARGET_HEADERS = [
    '企业名称', '简称', '成立时间', '业务领域', '代表产品/服务',
    '公司规模', '企业主页', '上市情况', '融资情况',
    '核心产品', '办公地址', '开源仓库', '财报',
]

# 原表头到目标表头的映射（处理命名变体）
HEADER_ALIASES = {
    '企业名称': '企业名称',
    '简称': '简称',
    '成立时间': '成立时间',
    '业务领域': '业务领域',
    '服务领域': '业务领域',  # 变体
    '代表产品/服务': '代表产品/服务',
    '代表产品': '代表产品/服务',  # 变体
    '核心服务': '代表产品/服务',  # 变体
    '公司规模': '公司规模',
    '企业主页': '企业主页',
    '官网': '企业主页',  # 变体
    '上市情况': '上市情况',
    '上市地': '上市情况',  # 变体（部分子表用，但子表不动）
    '融资情况': '融资情况',
    '融资轮次': '融资情况',  # 变体
    '盈利模式': None,  # 移除
    '核心产品': '核心产品',
    '主营业务': '核心产品',  # 变体
    '办公地址': '办公地址',
    '广州办公地址': '办公地址',  # 变体
    '上海办公地址': '办公地址',  # 变体
    '杭州办公地址': '办公地址',  # 变体
    '总部所在地': '办公地址',  # 变体（近似映射）
    '社交媒体': None,  # 移除（高数据债，信息量低）
    '开源仓库': '开源仓库',
    '技术架构': None,  # 移除
    '员工口碑': None,  # 移除
    '法律风险': None,  # 移除
    '风险提示': None,  # 移除（法律风险变体）
    '财报': '财报',
}

# 只处理列数 >= 11 的表（主表/国际表），小表是分类子表不动
MIN_COLS_TO_PROCESS = 11


def normalize_cell(value: str) -> str:
    """清理单元格值：[待补充] → -"""
    v = value.strip()
    if v in ('[待补充]', '待补充', '[待完善]', '待完善'):
        return '-'
    return v


def process_table(table_lines: list) -> list:
    """
    处理一个表格块（连续的 | 开头行）。
    返回新的行列表；若不该处理（子表），原样返回。
    """
    if not table_lines:
        return table_lines

    # 解析表头
    header_line = table_lines[0]
    headers = [h.strip() for h in header_line.split('|')[1:-1]]

    if len(headers) < MIN_COLS_TO_PROCESS:
        # 分类子表，不动
        return table_lines

    # 检查是否是"企业清单"表（表头含"企业名称"）
    if '企业名称' not in headers:
        return table_lines

    # 映射原列索引到目标列
    # target_col -> source_index
    col_mapping = {}
    for src_idx, h in enumerate(headers):
        target = HEADER_ALIASES.get(h)
        if target and target not in col_mapping:
            col_mapping[target] = src_idx

    # 构建新表
    new_lines = []
    # 新表头
    new_header = '| ' + ' | '.join(TARGET_HEADERS) + ' |'
    new_separator = '| ' + ' | '.join(['------'] * len(TARGET_HEADERS)) + ' |'
    new_lines.append(new_header)

    # 跳过原表头和分隔行
    data_start = 1
    if len(table_lines) > 1 and re.match(r'^\|[\s-]+\|', table_lines[1]):
        data_start = 2

    for line in table_lines[data_start:]:
        if not line.strip().startswith('|'):
            new_lines.append(line)
            continue
        cells = [c.strip() for c in line.split('|')[1:-1]]
        # 构建新行
        new_cells = []
        for target in TARGET_HEADERS:
            if target in col_mapping and col_mapping[target] < len(cells):
                new_cells.append(normalize_cell(cells[col_mapping[target]]))
            else:
                new_cells.append('-')
        new_lines.append('| ' + ' | '.join(new_cells) + ' |')

    return new_lines


def process_file(file_path: str, dry_run: bool) -> dict:
    """处理单个文件，返回统计"""
    stats = {'tables_processed': 0, 'tables_skipped': 0, 'changed': False}

    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.strip().startswith('|'):
            # 收集连续的表格行
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                table_lines.append(lines[i].rstrip('\n'))
                i += 1
            # 处理表格
            headers = [h.strip() for h in table_lines[0].split('|')[1:-1]]
            if len(headers) >= MIN_COLS_TO_PROCESS and '企业名称' in headers:
                processed = process_table(table_lines)
                if processed != table_lines:
                    stats['changed'] = True
                stats['tables_processed'] += 1
                for pl in processed:
                    new_lines.append(pl + '\n')
            else:
                stats['tables_skipped'] += 1
                for tl in table_lines:
                    new_lines.append(tl + '\n')
        else:
            new_lines.append(line)
            i += 1

    if stats['changed'] and not dry_run:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)

    return stats


def main():
    parser = argparse.ArgumentParser(description='industry 主表字段统一 + 数据债清理')
    parser.add_argument('--dry-run', '-n', action='store_true', help='仅预览不写入')
    parser.add_argument('--dir', '-d', default='industry', help='目标目录')
    args = parser.parse_args()

    base = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    target = os.path.join(base, args.dir)

    if not os.path.isdir(target):
        print(f"目录不存在: {target}")
        return

    total_files = 0
    changed_files = 0
    total_tables = 0

    for fn in sorted(os.listdir(target)):
        if not fn.endswith('.md') or fn == 'README.md':
            continue
        fpath = os.path.join(target, fn)
        stats = process_file(fpath, args.dry_run)
        total_files += 1
        total_tables += stats['tables_processed']
        if stats['changed']:
            changed_files += 1
            rel = os.path.relpath(fpath, base)
            print(f"  {'[DRY]' if args.dry_run else '[FIXED]'} {rel} "
                  f"(处理{stats['tables_processed']}表)")

    mode = '预览' if args.dry_run else '执行'
    print(f"\n模式: {mode}")
    print(f"  扫描文件: {total_files}")
    print(f"  变更文件: {changed_files}")
    print(f"  处理表格: {total_tables}")


if __name__ == '__main__':
    main()
