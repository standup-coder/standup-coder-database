#!/usr/bin/env python3
"""
表格标准化脚本
将所有行业文件表格统一为17列标准格式
"""

import os
import re
from pathlib import Path
from typing import Dict, List, Tuple, Optional

# 17列标准表头 - 中文企业
STANDARD_HEADER_17_CN = """企业名称 | 简称 | 成立时间 | 业务领域 | 代表产品/服务 | 公司规模 | 企业主页 | 上市情况 | 融资情况 | 盈利模式 | 核心产品 | 办公地址 | 社交媒体 | 开源仓库 | 技术架构 | 员工口碑 | 法律风险"""

# 17列标准表头 - 国际企业
STANDARD_HEADER_17_INT = """企业名称 | 简称 | 总部所在地 | 业务领域 | 代表产品/服务 | 公司规模 | 企业主页 | 上市情况 | 融资情况 | 盈利模式 | 核心产品 | 办公地址 | 社交媒体 | 开源仓库 | 技术架构 | 员工口碑 | 法律风险"""


def parse_all_tables(content: str) -> List[Dict]:
    """解析内容中的所有表格"""
    tables = []
    lines = content.split('\n')

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # 检查是否是表格行（以 | 开头，且不是分隔线）
        if line.startswith('|') and '---' not in line:
            # 这可能是表头，收集整个表格
            header = lines[i]
            col_count = len([c for c in header.split('|') if c.strip()])

            # 找到分隔线
            sep_line = None
            data_start = i + 1
            for j in range(i + 1, min(i + 3, len(lines))):
                if '---' in lines[j]:
                    sep_line = lines[j]
                    data_start = j + 1
                    break

            if sep_line:
                # 收集数据行
                data_rows = []
                for j in range(data_start, len(lines)):
                    if lines[j].strip().startswith('|'):
                        data_rows.append(lines[j].strip())
                    else:
                        break

                tables.append({
                    'header': header,
                    'separator': sep_line,
                    'data_rows': data_rows,
                    'start_line': i,
                    'end_line': data_start + len(data_rows) - 1,
                    'col_count': col_count
                })

                # 跳到表格之后
                i = data_start + len(data_rows)
                continue

        i += 1

    return tables


def count_columns(header: str) -> int:
    """计算表头列数"""
    cols = [c.strip() for c in header.split('|') if c.strip()]
    return len(cols)


def standardize_9col_table(header: str, data_rows: List[str]) -> Tuple[str, List[str]]:
    """
    将9列表格转换为17列
    原始9列: 企业名称, 简称, 成立时间, 业务领域, 代表产品/服务, 公司规模, 企业主页, 上市情况, 办公地址
    """
    new_header = '| ' + STANDARD_HEADER_17_CN + ' |'

    new_data_rows = []
    for row in data_rows:
        cells = [c.strip() for c in row.split('|') if c.strip()]

        if len(cells) >= 9:
            # 前8列保持不变: 企业名称, 简称, 成立时间, 业务领域, 代表产品/服务, 公司规模, 企业主页, 上市情况
            new_cells = cells[:8]
            # 中间8列用占位符: 融资情况, 盈利模式, 核心产品, 社交媒体, 开源仓库, 技术架构, 员工口碑, 法律风险
            new_cells.extend(['-'] * 8)
            # 最后一列: 办公地址（原第9列）
            new_cells.append(cells[8])
        elif len(cells) >= 8:
            new_cells = cells[:8]
            new_cells.extend(['-'] * 8)
            new_cells.append('-')
        else:
            continue

        new_row = '| ' + ' | '.join(new_cells) + ' |'
        new_data_rows.append(new_row)

    return new_header, new_data_rows


def standardize_10col_table(header: str, data_rows: List[str]) -> Tuple[str, List[str]]:
    """
    将10列表格转换为17列（security目录）
    """
    new_header = '| ' + STANDARD_HEADER_17_CN + ' |'

    new_data_rows = []
    for row in data_rows:
        cells = [c.strip() for c in row.split('|') if c.strip()]

        if len(cells) >= 10:
            new_cells = cells[:4]  # 企业名称, 简称, 成立时间, 业务领域
            new_cells.append(cells[4] if len(cells) > 4 else '-')  # 代表产品/服务
            new_cells.append(cells[5] if len(cells) > 5 else '-')  # 公司规模
            new_cells.append(cells[6] if len(cells) > 6 else '-')  # 企业主页
            new_cells.append(cells[7] if len(cells) > 7 else '-')  # 上市情况
            new_cells.extend(['-'] * 8)  # 8个占位符
            new_cells.append(cells[8] if len(cells) > 8 else '-')  # 办公地址

            new_row = '| ' + ' | '.join(new_cells) + ' |'
            new_data_rows.append(new_row)

    return new_header, new_data_rows


def process_file(file_path: str, dry_run: bool = False) -> Dict:
    """处理单个文件"""
    result = {
        'path': file_path,
        'tables_found': 0,
        'tables_updated': 0,
        'errors': []
    }

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        tables = parse_all_tables(content)
        result['tables_found'] = len(tables)

        if not tables:
            return result

        new_content = content
        offset = 0

        for table in tables:
            col_count = table['col_count']

            # 只处理9列和10列表格
            if col_count not in [9, 10]:
                continue

            # 生成新的表格内容
            if col_count == 9:
                new_header, new_data_rows = standardize_9col_table(
                    table['header'], table['data_rows']
                )
            else:
                new_header, new_data_rows = standardize_10col_table(
                    table['header'], table['data_rows']
                )

            separator = '|' + '|'.join([' ' + '-' * 8 + ' ' for _ in range(17)]) + '|'

            new_table = new_header + '\n' + separator + '\n'
            for row in new_data_rows:
                new_table += row + '\n'

            # 替换原表格
            start = table['start_line']
            end = table['end_line'] + 1

            old_table = '\n'.join([
                table['header'],
                table['separator']
            ] + table['data_rows'])

            if dry_run:
                print(f"\n=== {file_path} ===")
                print(f"Table at line {start + 1}: {col_count} -> 17 cols")
            else:
                new_content = new_content.replace(old_table, new_table.rstrip('\n'))
                result['tables_updated'] += 1

        if not dry_run:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

    except Exception as e:
        result['errors'].append(str(e))

    return result


def process_directory(base_path: str, target_dir: str, dry_run: bool = False) -> Dict:
    """处理目录"""
    target_path = os.path.join(base_path, target_dir)

    stats = {
        'total_files': 0,
        'total_tables': 0,
        'updated_tables': 0,
        'errors': 0,
        'files_processed': []
    }

    for filename in os.listdir(target_path):
        if not filename.endswith('.md'):
            continue

        file_path = os.path.join(target_path, filename)
        stats['total_files'] += 1

        result = process_file(file_path, dry_run)

        stats['total_tables'] += result['tables_found']
        stats['updated_tables'] += result['tables_updated']

        if result['errors']:
            stats['errors'] += len(result['errors'])

    return stats


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='标准化行业目录表格格式')
    parser.add_argument('--path', '-p', default='.',
                        help='项目根目录（默认当前目录）')
    parser.add_argument('--dry-run', '-n', action='store_true',
                        help='仅预览不实际写入')
    parser.add_argument('--dir', '-d', default='industry',
                        help='要处理的子目录（默认industry）')

    args = parser.parse_args()

    base_path = os.path.abspath(args.path)

    print(f"处理目录: {os.path.join(base_path, args.dir)}")
    print(f"模式: {'预览' if args.dry_run else '实际执行'}")

    stats = process_directory(base_path, args.dir, args.dry_run)

    print(f"\n统计:")
    print(f"  处理文件数: {stats['total_files']}")
    print(f"  发现表格数: {stats['total_tables']}")
    print(f"  更新表格数: {stats['updated_tables']}")
    print(f"  错误数: {stats['errors']}")