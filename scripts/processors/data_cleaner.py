#!/usr/bin/env python3
"""
数据清洗模块
用于验证和清洗收集的数据
"""

import re
from typing import Dict, Any, Optional, List
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class DataCleaner:
    """数据清洗器"""
    
    def __init__(self, config: Dict[str, Any] = None):
        """
        初始化清洗器
        
        Args:
            config: 清洗规则配置
        """
        self.config = config or {}
        self.validation_rules = self.config.get('validation_rules', {})
    
    def clean_company_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        清洗企业数据
        
        Args:
            data: 原始企业数据
            
        Returns:
            清洗后的数据
        """
        cleaned = {
            'basic_info': self._clean_basic_info(data.get('basic_info', {})),
            'funding_info': self._clean_funding_info(data.get('funding_info', [])),
            'employee_info': self._clean_employee_info(data.get('employee_info', {})),
            'contact_info': self._clean_contact_info(data.get('contact_info', {})),
            'status_info': self._clean_status_info(data.get('status_info', {})),
        }
        
        return cleaned
    
    def _clean_basic_info(self, info: Dict[str, Any]) -> Dict[str, Any]:
        """清洗基本信息"""
        cleaned = {}
        
        # 公司名称
        if 'name' in info:
            cleaned['name'] = self._clean_string(info['name'])
        
        # 成立时间
        if 'founded_date' in info:
            cleaned['founded_date'] = self._clean_date(info['founded_date'])
        
        # 描述
        if 'description' in info:
            cleaned['description'] = self._clean_string(info['description'])
        
        # 位置
        if 'location' in info:
            cleaned['location'] = self._clean_string(info['location'])
        
        # 技术栈
        if 'tech_stack' in info:
            cleaned['tech_stack'] = info['tech_stack']
        
        return cleaned
    
    def _clean_funding_info(self, funding_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """清洗融资信息"""
        cleaned_list = []
        
        for funding in funding_list:
            cleaned = {}
            
            # 融资轮次
            if 'round' in funding:
                cleaned['round'] = self._clean_funding_round(funding['round'])
            
            # 融资金额
            if 'amount' in funding:
                cleaned['amount'] = self._clean_funding_amount(funding['amount'])
            
            # 投资方
            if 'investors' in funding:
                cleaned['investors'] = funding['investors']
            
            # 融资日期
            if 'date' in funding:
                cleaned['date'] = self._clean_date(funding['date'])
            
            if cleaned:
                cleaned_list.append(cleaned)
        
        return cleaned_list
    
    def _clean_employee_info(self, info: Dict[str, Any]) -> Dict[str, Any]:
        """清洗员工信息"""
        cleaned = {}
        
        # 员工数量
        if 'employee_count' in info:
            count = self._validate_number(
                info['employee_count'],
                self.validation_rules.get('employee_count', {})
            )
            if count:
                cleaned['employee_count'] = count
        
        # 员工规模范围
        if 'employee_range' in info:
            cleaned['employee_range'] = self._clean_employee_range(info['employee_range'])
        
        return cleaned
    
    def _clean_contact_info(self, info: Dict[str, Any]) -> Dict[str, Any]:
        """清洗联系信息"""
        cleaned = {}
        
        # 网站
        if 'website' in info:
            cleaned['website'] = self._clean_url(info['website'])
        
        # 邮箱
        if 'email' in info:
            cleaned['email'] = self._clean_email(info['email'])
        
        # GitHub
        if 'github' in info:
            cleaned['github'] = self._clean_url(info['github'])
        
        return cleaned
    
    def _clean_status_info(self, info: Dict[str, Any]) -> Dict[str, Any]:
        """清洗状态信息"""
        cleaned = {}
        
        # 上市状态
        if 'ipo_status' in info:
            cleaned['ipo_status'] = self._clean_ipo_status(info['ipo_status'])
        
        # 股票代码
        if 'stock_symbol' in info:
            cleaned['stock_symbol'] = self._clean_string(info['stock_symbol'])
        
        return cleaned
    
    def _clean_string(self, value: Any, max_length: int = 500) -> Optional[str]:
        """清洗字符串"""
        if not value:
            return None
        
        s = str(value).strip()
        if len(s) > max_length:
            s = s[:max_length] + '...'
        
        return s
    
    def _clean_date(self, value: Any) -> Optional[str]:
        """清洗日期"""
        if not value:
            return None
        
        try:
            # 尝试多种日期格式
            for fmt in ['%Y-%m-%d', '%Y/%m/%d', '%d/%m/%Y', '%m/%d/%Y', '%Y']:
                try:
                    dt = datetime.strptime(str(value), fmt)
                    return dt.strftime('%Y-%m-%d')
                except ValueError:
                    continue
        except Exception:
            pass
        
        return str(value) if value else None
    
    def _clean_funding_round(self, value: str) -> str:
        """标准化融资轮次"""
        if not value:
            return value
        
        value = str(value).upper().strip()
        
        # 标准化轮次名称
        round_mapping = {
            'SEED': '种子轮',
            'ANGEL': '天使轮',
            'PRE-A': 'Pre-A轮',
            'A': 'A轮',
            'A+': 'A+轮',
            'PRE-B': 'Pre-B轮',
            'B': 'B轮',
            'B+': 'B+轮',
            'C': 'C轮',
            'C+': 'C+轮',
            'D': 'D轮',
            'E': 'E轮',
            'F': 'F轮',
            'IPO': 'IPO',
            'PRE-IPO': 'Pre-IPO',
            'STRATEGIC': '战略投资',
            'MA': '并购'
        }
        
        return round_mapping.get(value, value)
    
    def _clean_funding_amount(self, value: Any) -> Optional[str]:
        """清洗融资金额"""
        if not value:
            return None
        
        # 尝试提取数字和单位
        s = str(value).strip().upper()
        
        # 匹配模式：数字 + 单位
        patterns = [
            r'(\d+\.?\d*)\s*(百万|千万|亿)',
            r'(\d+\.?\d*)\s*(M|B|K)',
            r'(\d+\.?\d*)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, s)
            if match:
                return s
        
        return s
    
    def _clean_employee_range(self, value: str) -> str:
        """标准化员工规模范围"""
        if not value:
            return value
        
        s = str(value).strip()
        
        # 标准化范围
        range_mapping = {
            '1-10': '少于15人',
            '11-50': '15-50人',
            '51-200': '50-200人',
            '201-500': '200-500人',
            '501-1000': '500-1000人',
            '1001-5000': '1000-5000人',
            '5001-10000': '5000-10000人',
            '10001+': '10000+人'
        }
        
        return range_mapping.get(s, s)
    
    def _clean_url(self, value: str) -> Optional[str]:
        """清洗URL"""
        if not value:
            return None
        
        url = str(value).strip()
        
        # 添加协议前缀
        if url and not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        return url
    
    def _clean_email(self, value: str) -> Optional[str]:
        """清洗邮箱"""
        if not value:
            return None
        
        email = str(value).strip().lower()
        
        # 简单验证
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if re.match(pattern, email):
            return email
        
        return None
    
    def _clean_ipo_status(self, value: str) -> str:
        """标准化上市状态"""
        if not value:
            return value
        
        s = str(value).upper().strip()
        
        status_mapping = {
            'LISTED': '已上市',
            'IPO': '已上市',
            'PUBLIC': '已上市',
            'PRIVATE': '未上市',
            'UNLISTED': '未上市',
            'STARTUP': '未上市',
            'ACQUIRED': '已被收购'
        }
        
        return status_mapping.get(s, s)
    
    def _validate_number(self, value: Any, rules: Dict[str, Any]) -> Optional[int]:
        """验证数字"""
        try:
            num = int(float(value))
            
            min_val = rules.get('min')
            max_val = rules.get('max')
            
            if min_val is not None and num < min_val:
                return None
            if max_val is not None and num > max_val:
                return None
            
            return num
        except (ValueError, TypeError):
            return None
    
    def validate_required_fields(self, data: Dict[str, Any], required_fields: List[str]) -> List[str]:
        """
        验证必填字段

        Args:
            data: 数据字典
            required_fields: 必填字段列表

        Returns:
            缺失字段列表
        """
        missing = []
        for field in required_fields:
            if not data.get(field):
                missing.append(field)
        return missing

    def validate_markdown_quality(self, content: str) -> Dict[str, Any]:
        """
        验证Markdown内容质量

        Args:
            content: Markdown文件内容

        Returns:
            验证结果字典
        """
        import re

        result = {
            'passed': True,
            'warnings': [],
            'errors': []
        }

        # 检查1: frontmatter
        if not content.startswith('---'):
            result['warnings'].append('缺少frontmatter')

        # 检查2: 标题
        if not re.search(r'^#\s+', content, re.MULTILINE):
            result['errors'].append('缺少标题')
            result['passed'] = False

        # 检查3: 连续空行
        if '\n\n\n' in content:
            result['warnings'].append('存在连续空行')

        # 检查4: 链接语法
        links = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', content)
        for text, url in links:
            if url.startswith('http') and not re.match(r'^https?://\S+$', url):
                result['warnings'].append(f'可疑链接格式: {url[:50]}')

        # 检查5: AI生成声明
        if 'AI辅助生成' not in content and '仅供参考' not in content:
            if any(kw in content for kw in ['企业清单', '榜单', '排名']):
                result['warnings'].append('缺少AI生成/免责声明')

        return result

    def validate_table_consistency(self, tables: List[str], expected_cols: int = 17) -> Dict[str, Any]:
        """
        验证表格结构一致性

        Args:
            tables: 表格列表
            expected_cols: 期望列数

        Returns:
            验证结果
        """
        result = {
            'total_tables': len(tables),
            'consistent_tables': 0,
            'inconsistent_tables': [],
            'column_distribution': {}
        }

        for i, table in enumerate(tables):
            lines = table.split('\n')
            col_count = 0
            for line in lines:
                if line.startswith('|') and '---' not in line:
                    cols = [c.strip() for c in line.split('|') if c.strip()]
                    col_count = len(cols)
                    break

            if col_count not in result['column_distribution']:
                result['column_distribution'][col_count] = 0
            result['column_distribution'][col_count] += 1

            if col_count == expected_cols:
                result['consistent_tables'] += 1
            else:
                result['inconsistent_tables'].append({
                    'table_index': i + 1,
                    'actual_columns': col_count,
                    'expected_columns': expected_cols
                })

        return result

    def check_data_freshness(self, content: str, max_age_months: int = 6) -> Dict[str, Any]:
        """
        检查数据新鲜度

        Args:
            content: 内容
            max_age_months: 最大允许月数

        Returns:
            新鲜度评估
        """
        import re
        from datetime import datetime

        result = {
            'has_timestamp': False,
            'age_months': None,
            'is_fresh': True,
            'warning': None
        }

        # 查找时间戳
        patterns = [
            r'最后更新[：:]\s*(\d{4})年(\d{1,2})月(\d{1,2})日',
            r'数据截至\s*(\d{4})年(\d{1,2})月',
            r'(\d{4})年(\d{1,2})月',
        ]

        for pattern in patterns:
            match = re.search(pattern, content)
            if match:
                result['has_timestamp'] = True
                year, month = int(match.group(1)), int(match.group(2))
                try:
                    current_year = datetime.now().year
                    current_month = datetime.now().month
                    age_months = (current_year - year) * 12 + (current_month - month)
                    result['age_months'] = age_months
                    result['is_fresh'] = age_months <= max_age_months
                    if not result['is_fresh']:
                        result['warning'] = f'数据可能已过时（{age_months}个月前）'
                except:
                    pass
                break

        return result
