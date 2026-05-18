#!/usr/bin/env python3
"""
内容验证脚本
检查Markdown内容的完整性和一致性
"""

import os
import re
from pathlib import Path
from typing import Dict, List, Any
from collections import defaultdict


class ContentValidator:
    """内容验证器"""

    def __init__(self, base_path: str):
        self.base_path = base_path
        self.issues = []
        self.stats = defaultdict(int)

    def validate_file(self, file_path: str) -> Dict[str, Any]:
        """验证单个文件"""
        result = {
            'path': file_path,
            'issues': [],
            'warnings': [],
            'passed': True
        }

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # 1. 检查frontmatter
            if not content.startswith('---'):
                result['warnings'].append('缺少frontmatter')

            # 2. 检查标题
            if not re.search(r'^#\s+', content, re.MULTILINE):
                result['issues'].append('缺少标题')
                result['passed'] = False

            # 3. 检查空行
            if '\n\n\n' in content:
                result['warnings'].append('存在连续空行')

            # 4. 检查表格结构
            tables = self._find_tables(content)
            for i, table in enumerate(tables):
                col_count = self._count_table_columns(table)
                if col_count == 0:
                    result['issues'].append(f'表格{i+1}无法解析')
                elif col_count < 9:
                    result['warnings'].append(f'表格{i+1}列数异常({col_count}列)')

            # 5. 检查链接有效性（简单检查）
            links = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', content)
            for text, url in links:
                if url.startswith('http') and not self._check_url_syntax(url):
                    result['warnings'].append(f'可疑链接: {url[:50]}')

            # 6. 检查AI生成声明
            if 'AI辅助生成' not in content and '仅供参考' not in content:
                if 'industry' in file_path or 'rankings' in file_path:
                    result['warnings'].append('缺少AI生成/免责声明')

        except Exception as e:
            result['issues'].append(f'读取错误: {str(e)}')
            result['passed'] = False

        return result

    def _find_tables(self, content: str) -> List[str]:
        """查找所有表格"""
        tables = []
        lines = content.split('\n')
        in_table = False
        current_table = []

        for line in lines:
            if line.startswith('|'):
                in_table = True
                current_table.append(line)
            else:
                if in_table and current_table:
                    tables.append('\n'.join(current_table))
                    current_table = []
                in_table = False

        if current_table:
            tables.append('\n'.join(current_table))

        return tables

    def _count_table_columns(self, table: str) -> int:
        """计算表格列数"""
        lines = table.split('\n')
        for line in lines:
            if line.startswith('|') and '---' not in line:
                cols = [c.strip() for c in line.split('|') if c.strip()]
                return len(cols)
        return 0

    def _check_url_syntax(self, url: str) -> bool:
        """简单检查URL语法"""
        pattern = r'^https?://[^\s]+$'
        return bool(re.match(pattern, url))

    def validate_directory(self, subdir: str = None) -> Dict[str, Any]:
        """验证目录"""
        if subdir:
            target_path = os.path.join(self.base_path, subdir)
        else:
            target_path = self.base_path

        results = {
            'total_files': 0,
            'passed': 0,
            'warnings': 0,
            'failed': 0,
            'issues_by_file': [],
            'summary': defaultdict(int)
        }

        for root, dirs, files in os.walk(target_path):
            # 跳过特定目录
            if any(skip in root for skip in ['console', 'scripts', '.git', 'node_modules']):
                continue

            for filename in files:
                if filename.endswith('.md'):
                    file_path = os.path.join(root, filename)
                    results['total_files'] += 1

                    result = self.validate_file(file_path)

                    if not result['passed']:
                        results['failed'] += 1
                        results['issues_by_file'].append(result)
                    elif result['warnings']:
                        results['warnings'] += 1
                        results['issues_by_file'].append(result)
                    else:
                        results['passed'] += 1

                    # 统计问题类型
                    for issue in result['issues'] + result['warnings']:
                        category = issue.split(':')[0] if ':' in issue else issue
                        results['summary'][category] += 1

        return results

    def print_report(self, results: Dict[str, Any]):
        """打印验证报告"""
        print("=" * 60)
        print("内容验证报告")
        print("=" * 60)

        print(f"\n总体统计:")
        print(f"  总文件数: {results['total_files']}")
        print(f"  通过: {results['passed']}")
        print(f"  警告: {results['warnings']}")
        print(f"  失败: {results['failed']}")

        if results['summary']:
            print(f"\n问题分类:")
            for category, count in sorted(results['summary'].items(), key=lambda x: -x[1]):
                print(f"  {category}: {count}")

        if results['failed'] > 0:
            print(f"\n失败文件列表:")
            for result in results['issues_by_file']:
                if result['issues']:
                    print(f"\n  {result['path']}")
                    for issue in result['issues']:
                        print(f"    - {issue}")

        if results['warnings'] > 0 and results['failed'] == 0:
            print(f"\n警告文件列表:")
            for result in results['issues_by_file']:
                if result['warnings'] and not result['issues']:
                    print(f"\n  {result['path']}")
                    for warning in result['warnings']:
                        print(f"    - {warning}")


def check_table_consistency(base_path: str, category: str = 'industry'):
    """检查表格结构一致性"""
    target_path = os.path.join(base_path, category)

    table_stats = defaultdict(list)

    for filename in os.listdir(target_path):
        if not filename.endswith('.md'):
            continue

        file_path = os.path.join(target_path, filename)

        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        tables = []
        lines = content.split('\n')
        in_table = False
        current_table = []

        for line in lines:
            if line.startswith('|'):
                in_table = True
                current_table.append(line)
            else:
                if in_table and current_table:
                    tables.append('\n'.join(current_table))
                    current_table = []
                in_table = False

        if current_table:
            tables.append('\n'.join(current_table))

        for i, table in enumerate(tables):
            for line in table.split('\n'):
                if line.startswith('|') and '---' not in line:
                    cols = [c.strip() for c in line.split('|') if c.strip()]
                    col_count = len(cols)
                    table_stats[col_count].append(f"{filename} (表格{i+1})")
                    break

    print(f"\n{category} 目录表格列数分布:")
    for cols in sorted(table_stats.keys()):
        print(f"  {cols}列: {len(table_stats[cols])}个表格")
        if cols != 17:
            for fn in table_stats[cols][:3]:
                print(f"    - {fn}")
            if len(table_stats[cols]) > 3:
                print(f"    ... 还有{len(table_stats[cols])-3}个")


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='验证Markdown内容质量')
    parser.add_argument('--path', '-p', default='.',
                        help='要验证的目录路径（默认当前目录）')
    parser.add_argument('--category', '-c', default=None,
                        help='只验证特定分类（如 industry, rankings）')
    parser.add_argument('--check-tables', '-t', action='store_true',
                        help='检查表格结构一致性')

    args = parser.parse_args()

    base_path = os.path.abspath(args.path)

    validator = ContentValidator(base_path)

    if args.check_tables:
        print("检查表格结构一致性...\n")
        check_table_consistency(base_path, 'industry')
        check_table_consistency(base_path, 'rankings')
    else:
        if args.category:
            results = validator.validate_directory(args.category)
        else:
            results = validator.validate_directory()

        validator.print_report(results)