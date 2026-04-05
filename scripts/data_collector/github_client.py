#!/usr/bin/env python3
"""
GitHub API客户端
用于收集企业的开源项目信息
"""

import requests
from typing import Dict, List, Optional, Any
import logging

from .base_collector import BaseCollector, CompanyData

logger = logging.getLogger(__name__)


class GitHubClient(BaseCollector):
    """GitHub数据收集器"""
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.base_url = config.get('api_url', 'https://api.github.com')
        self.session = requests.Session()
        self.session.headers.update({
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'StandupCoder-DB-Collector/1.0'
        })
        
        # 如果有token，添加到headers
        token = config.get('token')
        if token:
            self.session.headers['Authorization'] = f'token {token}'
            self.rate_limit = 5000  # 认证后每小时5000次
    
    def collect(self, company_name: str) -> CompanyData:
        """
        从GitHub收集企业信息
        
        Args:
            company_name: 企业名称或GitHub组织名
            
        Returns:
            企业数据对象
        """
        company_data = CompanyData(company_name)
        
        try:
            # 搜索组织
            org_info = self._search_org(company_name)
            if org_info:
                company_data.update_basic_info({
                    'github_org': org_info.get('login'),
                    'github_url': org_info.get('html_url'),
                    'description': org_info.get('description'),
                    'blog': org_info.get('blog'),
                    'location': org_info.get('location'),
                    'public_repos': org_info.get('public_repos'),
                    'followers': org_info.get('followers')
                }, 'github')
                
                # 获取仓库信息
                repos = self._get_org_repos(org_info['login'])
                company_data.update_basic_info({
                    'top_repos': repos[:5],  # 前5个仓库
                    'total_repos': len(repos)
                }, 'github')
                
                # 获取语言统计
                languages = self._get_language_stats(repos)
                company_data.update_basic_info({
                    'tech_stack': languages
                }, 'github')
            
        except Exception as e:
            logger.error(f"Error collecting GitHub data for {company_name}: {e}")
        
        return company_data
    
    def search(self, keyword: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        搜索GitHub组织和用户
        
        Args:
            keyword: 搜索关键词
            limit: 返回结果数量
            
        Returns:
            搜索结果列表
        """
        try:
            self._rate_limit_check()
            
            response = self.session.get(
                f'{self.base_url}/search/users',
                params={
                    'q': f'{keyword} type:org',
                    'per_page': limit
                }
            )
            response.raise_for_status()
            
            data = response.json()
            results = []
            
            for item in data.get('items', []):
                org_detail = self._get_org_detail(item['login'])
                if org_detail:
                    results.append({
                        'name': org_detail.get('name') or item['login'],
                        'github_login': item['login'],
                        'github_url': item['html_url'],
                        'description': org_detail.get('description'),
                        'location': org_detail.get('location'),
                        'public_repos': org_detail.get('public_repos'),
                        'followers': org_detail.get('followers')
                    })
            
            return results
            
        except Exception as e:
            logger.error(f"Error searching GitHub for {keyword}: {e}")
            return []
    
    def _search_org(self, org_name: str) -> Optional[Dict[str, Any]]:
        """搜索并返回组织详情"""
        try:
            self._rate_limit_check()
            
            # 先尝试直接获取
            response = self.session.get(f'{self.base_url}/orgs/{org_name}')
            
            if response.status_code == 200:
                return response.json()
            
            # 如果直接获取失败，尝试搜索
            if response.status_code == 404:
                search_results = self.search(org_name, limit=1)
                if search_results:
                    login = search_results[0]['github_login']
                    return self._get_org_detail(login)
            
            return None
            
        except Exception as e:
            logger.error(f"Error searching org {org_name}: {e}")
            return None
    
    def _get_org_detail(self, org_login: str) -> Optional[Dict[str, Any]]:
        """获取组织详细信息"""
        try:
            self._rate_limit_check()
            
            response = self.session.get(f'{self.base_url}/orgs/{org_login}')
            if response.status_code == 200:
                return response.json()
            return None
            
        except Exception as e:
            logger.error(f"Error getting org detail {org_login}: {e}")
            return None
    
    def _get_org_repos(self, org_login: str, max_repos: int = 100) -> List[Dict[str, Any]]:
        """获取组织的仓库列表"""
        repos = []
        page = 1
        
        try:
            while len(repos) < max_repos:
                self._rate_limit_check()
                
                response = self.session.get(
                    f'{self.base_url}/orgs/{org_login}/repos',
                    params={
                        'sort': 'updated',
                        'direction': 'desc',
                        'per_page': 100,
                        'page': page
                    }
                )
                response.raise_for_status()
                
                page_repos = response.json()
                if not page_repos:
                    break
                
                for repo in page_repos:
                    repos.append({
                        'name': repo['name'],
                        'url': repo['html_url'],
                        'description': repo['description'],
                        'stars': repo['stargazers_count'],
                        'forks': repo['forks_count'],
                        'language': repo['language'],
                        'updated_at': repo['updated_at']
                    })
                
                page += 1
                
                # 按star数排序
                repos.sort(key=lambda x: x['stars'], reverse=True)
                
        except Exception as e:
            logger.error(f"Error getting repos for {org_login}: {e}")
        
        return repos[:max_repos]
    
    def _get_language_stats(self, repos: List[Dict[str, Any]]) -> Dict[str, int]:
        """统计编程语言使用情况"""
        language_stats = {}
        
        for repo in repos:
            lang = repo.get('language')
            if lang:
                language_stats[lang] = language_stats.get(lang, 0) + 1
        
        # 按使用频率排序
        return dict(sorted(language_stats.items(), key=lambda x: x[1], reverse=True))
    
    def get_rate_limit(self) -> Dict[str, Any]:
        """获取API速率限制信息"""
        try:
            response = self.session.get(f'{self.base_url}/rate_limit')
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error getting rate limit: {e}")
            return {}


# 使用示例
if __name__ == '__main__':
    # 配置
    config = {
        'name': 'GitHub',
        'enabled': True,
        'api_url': 'https://api.github.com',
        'rate_limit': 60,
        'token': None  # 如果有token，取消认证限制
    }
    
    # 创建客户端
    client = GitHubClient(config)
    
    # 收集企业信息
    company = client.collect('baidu')
    print(f"Company: {company.name}")
    print(f"Data: {company.to_dict()}")
    
    # 搜索
    results = client.search('alibaba', limit=3)
    print(f"Search results: {results}")
