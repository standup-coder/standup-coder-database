#!/usr/bin/env python3
"""
Markdown文件更新器
用于更新行业清单Markdown文件中的企业数据
"""

import re
from typing import Dict, Any, List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class MarkdownUpdater:
    """Markdown文件更新器"""
    
    def __init__(self, config: Dict[str, Any] = None):
        """
        初始化更新器
        
        Args:
            config: 配置选项
        """
        self.config = config or {}
        self.backup_enabled = self.config.get('backup', True)
    
    def update_company_data(self, file_path: str, company_name: str, 
                           new_data: Dict[str, Any]) -> bool:
        """
        更新文件中单个企业的数据
        
        Args:
            file_path: Markdown文件路径
            company_name: 企业名称
            new_data: 新数据
            
        Returns:
            是否成功更新
        """
        try:
            # 读取文件
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 备份
            if self.backup_enabled:
                self._backup_file(file_path, content)
            
            # 查找并更新企业数据
            updated_content = self._update_company_in_content(
                content, company_name, new_data
            )
            
            # 更新数据源声明时间
            updated_content = self._update_timestamp(updated_content)
            
            # 写入文件
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            
            logger.info(f"Updated {company_name} in {file_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating {file_path}: {e}")
            return False
    
    def batch_update(self, file_path: str, 
                    updates: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        批量更新文件中的多个企业数据
        
        Args:
            file_path: Markdown文件路径
            updates: 更新列表，每项包含 company_name 和 new_data
            
        Returns:
            更新结果统计
        """
        results = {
            'total': len(updates),
            'success': 0,
            'failed': 0,
            'errors': []
        }
        
        try:
            # 读取文件
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 备份
            if self.backup_enabled:
                self._backup_file(file_path, content)
            
            # 批量更新
            updated_content = content
            for update in updates:
                company_name = update.get('company_name')
                new_data = update.get('new_data')
                
                try:
                    updated_content = self._update_company_in_content(
                        updated_content, company_name, new_data
                    )
                    results['success'] += 1
                except Exception as e:
                    results['failed'] += 1
                    results['errors'].append({
                        'company': company_name,
                        'error': str(e)
                    })
            
            # 更新数据源声明时间
            updated_content = self._update_timestamp(updated_content)
            
            # 写入文件
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            
        except Exception as e:
            logger.error(f"Error in batch update {file_path}: {e}")
            results['errors'].append({'error': str(e)})
        
        return results
    
    def _update_company_in_content(self, content: str, company_name: str,
                                   new_data: Dict[str, Any]) -> str:
        """在内容中更新企业数据"""
        # 查找企业名称所在的表格行
        # 支持多种匹配模式
        patterns = [
            rf'\|[^\|]*{re.escape(company_name)}[^\|]*\|',  # 标准表格
            rf'\*\*{re.escape(company_name)}\*\*',  # 粗体
            rf'####\s+{re.escape(company_name)}',  # 标题
        ]
        
        for pattern in patterns:
            if re.search(pattern, content):
                # 根据匹配模式选择更新策略
                if '####' in pattern:
                    return self._update_section_format(content, company_name, new_data)
                else:
                    return self._update_table_format(content, company_name, new_data)
        
        logger.warning(f"Company {company_name} not found in content")
        return content
    
    def _update_table_format(self, content: str, company_name: str,
                            new_data: Dict[str, Any]) -> str:
        """更新表格格式的数据"""
        # 提取员工规模
        if 'employee_count' in new_data or 'employee_range' in new_data:
            employee_info = new_data.get('employee_info', {})
            employee_range = employee_info.get('employee_range', '')
            
            if employee_range:
                # 更新员工规模列
                # 匹配包含企业名称的行，并更新员工规模列
                lines = content.split('\n')
                for i, line in enumerate(lines):
                    if company_name in line and '|' in line:
                        cols = line.split('|')
                        if len(cols) >= 7:  # 确保有足够的列
                            cols[6] = f' {employee_range} '  # 员工规模通常在第7列
                            lines[i] = '|'.join(cols)
                            break
                content = '\n'.join(lines)
        
        # 更新融资情况
        if 'funding_info' in new_data:
            funding_info = new_data.get('funding_info', [])
            if funding_info:
                latest_funding = funding_info[-1]
                funding_str = f"{latest_funding.get('round', '')}"
                
                lines = content.split('\n')
                for i, line in enumerate(lines):
                    if company_name in line and '|' in line:
                        cols = line.split('|')
                        if len(cols) >= 9:  # 融资情况列
                            cols[8] = f' {funding_str} '
                            lines[i] = '|'.join(cols)
                            break
                content = '\n'.join(lines)
        
        return content
    
    def _update_section_format(self, content: str, company_name: str,
                              new_data: Dict[str, Any]) -> str:
        """更新章节格式的数据（如量子计算企业清单格式）"""
        # 找到企业章节
        pattern = rf'(####\s+{re.escape(company_name)}.*?)(?=####|##|$)'
        match = re.search(pattern, content, re.DOTALL)
        
        if not match:
            return content
        
        section = match.group(1)
        updated_section = section
        
        # 更新基本信息
        basic_info = new_data.get('basic_info', {})
        
        if 'employee_count' in basic_info or 'employee_range' in basic_info:
            employee_range = basic_info.get('employee_range', '')
            if employee_range:
                # 更新员工规模
                updated_section = self._update_section_field(
                    updated_section, '员工规模', employee_range
                )
        
        if 'founded_date' in basic_info:
            founded_date = basic_info.get('founded_date', '')
            if founded_date:
                updated_section = self._update_section_field(
                    updated_section, '成立时间', founded_date
                )
        
        # 更新融资情况
        funding_info = new_data.get('funding_info', [])
        if funding_info:
            latest_funding = funding_info[-1]
            funding_str = f"{latest_funding.get('round', '')}"
            updated_section = self._update_section_field(
                updated_section, '融资情况', funding_str
            )
        
        # 替换原章节
        content = content.replace(section, updated_section)
        
        return content
    
    def _update_section_field(self, section: str, field_name: str, 
                             new_value: str) -> str:
        """更新章节中的字段"""
        # 匹配 "- 字段名：值" 格式
        pattern = rf'(-\s+{re.escape(field_name)}[：:]\s*)([^\n]+)'
        replacement = rf'\g<1>{new_value}'
        
        updated = re.sub(pattern, replacement, section)
        return updated
    
    def _update_timestamp(self, content: str) -> str:
        """更新文件中的时间戳"""
        current_time = datetime.now().strftime('%Y年%m月%d日')
        
        # 更新最后更新时间
        patterns = [
            (r'最后更新：\d{4}年\d{1,2}月\d{1,2}日', f'最后更新：{current_time}'),
            (r'\*最后更新：[^\*]+\*', f'*最后更新：{current_time}*'),
        ]
        
        for pattern, replacement in patterns:
            content = re.sub(pattern, replacement, content)
        
        return content
    
    def _backup_file(self, file_path: str, content: str):
        """备份文件"""
        backup_path = f"{file_path}.backup.{datetime.now().strftime('%Y%m%d%H%M%S')}"
        try:
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.info(f"Backup created: {backup_path}")
        except Exception as e:
            logger.warning(f"Failed to create backup: {e}")
    
    def generate_update_summary(self, results: Dict[str, Any]) -> str:
        """生成更新摘要Markdown"""
        summary = f"""# 数据更新摘要

## 更新时间
{datetime.now().strftime('%Y年%m月%d日 %H:%M:%S')}

## 更新统计
- 总更新数：{results.get('total', 0)}
- 成功：{results.get('success', 0)}
- 失败：{results.get('failed', 0)}

## 详细变更
"""
        
        errors = results.get('errors', [])
        if errors:
            summary += "\n### 错误记录\n"
            for error in errors:
                summary += f"- {error.get('company', 'Unknown')}: {error.get('error', 'Unknown error')}\n"
        
        summary += """
---

**注意**：本次更新由自动化脚本生成，请人工审核后确认。
"""
        
        return summary


# 使用示例
if __name__ == '__main__':
    updater = MarkdownUpdater()
    
    # 测试数据
    test_data = {
        'employee_info': {
            'employee_range': '2000-5000人'
        },
        'funding_info': [
            {'round': 'C轮', 'amount': '1亿美元'}
        ]
    }
    
    # 更新文件（示例路径）
    # updater.update_company_data(
    #     '../../industry/ai-beijing.md',
    #     '北京字节跳动科技有限公司',
    #     test_data
    # )
