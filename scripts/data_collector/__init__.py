"""
数据收集模块
用于从多个数据源收集企业信息
"""

from .base_collector import BaseCollector
from .github_client import GitHubClient

__all__ = ['BaseCollector', 'GitHubClient']
