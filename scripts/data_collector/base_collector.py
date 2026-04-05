#!/usr/bin/env python3
"""
基础数据收集器类
定义数据收集的标准接口
"""

from abc import ABC, abstractmethod
from typing import Dict, List, Optional, Any
import logging
import time
from datetime import datetime

# 设置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class BaseCollector(ABC):
    """数据收集器基类"""
    
    def __init__(self, config: Dict[str, Any]):
        """
        初始化收集器
        
        Args:
            config: 配置字典，包含API密钥、速率限制等
        """
        self.config = config
        self.name = config.get('name', 'Unknown')
        self.enabled = config.get('enabled', False)
        self.rate_limit = config.get('rate_limit', 60)
        self.request_count = 0
        self.last_request_time = None
        
    @abstractmethod
    def collect(self, company_name: str) -> Dict[str, Any]:
        """
        收集单个企业的信息
        
        Args:
            company_name: 企业名称
            
        Returns:
            企业信息字典
        """
        pass
    
    @abstractmethod
    def search(self, keyword: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        搜索企业
        
        Args:
            keyword: 搜索关键词
            limit: 返回结果数量限制
            
        Returns:
            企业信息列表
        """
        pass
    
    def _rate_limit_check(self):
        """检查并执行速率限制"""
        if self.last_request_time:
            # 计算时间间隔
            elapsed = time.time() - self.last_request_time
            min_interval = 3600 / self.rate_limit  # 每小时请求数转换为间隔秒数
            
            if elapsed < min_interval:
                sleep_time = min_interval - elapsed
                logger.debug(f"Rate limit: sleeping for {sleep_time:.2f} seconds")
                time.sleep(sleep_time)
        
        self.last_request_time = time.time()
        self.request_count += 1
    
    def is_enabled(self) -> bool:
        """检查收集器是否启用"""
        return self.enabled
    
    def get_stats(self) -> Dict[str, Any]:
        """获取收集器统计信息"""
        return {
            'name': self.name,
            'enabled': self.enabled,
            'request_count': self.request_count,
            'rate_limit': self.rate_limit,
            'last_request': self.last_request_time
        }


class CompanyData:
    """企业数据模型"""
    
    def __init__(self, name: str):
        self.name = name
        self.data = {
            'basic_info': {},
            'funding_info': [],
            'employee_info': {},
            'contact_info': {},
            'status_info': {},
            'metadata': {
                'collect_time': datetime.now().isoformat(),
                'sources': []
            }
        }
    
    def update_basic_info(self, info: Dict[str, Any], source: str):
        """更新基本信息"""
        self.data['basic_info'].update(info)
        self._add_source(source)
    
    def update_funding_info(self, funding: Dict[str, Any], source: str):
        """更新融资信息"""
        self.data['funding_info'].append(funding)
        self._add_source(source)
    
    def update_employee_info(self, info: Dict[str, Any], source: str):
        """更新员工信息"""
        self.data['employee_info'].update(info)
        self._add_source(source)
    
    def update_contact_info(self, info: Dict[str, Any], source: str):
        """更新联系信息"""
        self.data['contact_info'].update(info)
        self._add_source(source)
    
    def update_status_info(self, info: Dict[str, Any], source: str):
        """更新状态信息"""
        self.data['status_info'].update(info)
        self._add_source(source)
    
    def _add_source(self, source: str):
        """添加数据来源"""
        if source not in self.data['metadata']['sources']:
            self.data['metadata']['sources'].append(source)
    
    def to_dict(self) -> Dict[str, Any]:
        """转换为字典"""
        return {
            'name': self.name,
            'data': self.data
        }
    
    def get_field(self, field_path: str) -> Any:
        """
        获取指定字段值
        
        Args:
            field_path: 字段路径，如 'basic_info.founded_date'
            
        Returns:
            字段值
        """
        keys = field_path.split('.')
        value = self.data
        for key in keys:
            if isinstance(value, dict):
                value = value.get(key)
            else:
                return None
        return value
