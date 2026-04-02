// API 客户端

import { Company, CompanyQuery, CompanyFilterOptions } from '../types/company';
import { PaginationResult } from '../types/common';

const BASE_URL = '/data';

// 内存缓存
const cache = new Map<string, any>();

async function fetchJson<T>(url: string): Promise<T> {
  if (cache.has(url)) {
    return cache.get(url);
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  cache.set(url, data);
  return data;
}

// 获取所有企业
export async function fetchCompanies(): Promise<Company[]> {
  return fetchJson(`${BASE_URL}/companies.json`);
}

// 获取筛选选项
export async function fetchFilterOptions(): Promise<CompanyFilterOptions> {
  const data = await fetchJson<{ cities: string[]; industries: string[]; scales: string[]; listingStatus: string[] }>(
    `${BASE_URL}/filter-options.json`
  );
  
  return {
    cities: data.cities || [],
    industries: data.industries || [],
    scales: data.scales || [],
    listingStatus: data.listingStatus || [],
    businessAreas: [], // 从数据中动态提取
  };
}

// 获取统计数据
export async function fetchStats() {
  return fetchJson(`${BASE_URL}/stats.json`);
}

// 搜索企业
export async function searchCompanies(
  companies: Company[],
  query: CompanyQuery
): Promise<PaginationResult<Company>> {
  let results = [...companies];
  
  // 关键词搜索
  if (query.keyword) {
    const keyword = query.keyword.toLowerCase();
    results = results.filter(c => 
      c.name.toLowerCase().includes(keyword) ||
      c.alias.toLowerCase().includes(keyword) ||
      c.businessArea.toLowerCase().includes(keyword) ||
      c.products.toLowerCase().includes(keyword) ||
      (query.keyword && c.city?.includes(query.keyword)) ||
      (query.keyword && c.industry?.includes(query.keyword))
    );
  }
  
  // 城市筛选
  if (query.cities?.length) {
    results = results.filter(c => c.city && query.cities?.includes(c.city));
  }
  
  // 行业筛选
  if (query.industries?.length) {
    results = results.filter(c => c.industry && query.industries?.includes(c.industry));
  }
  
  // 规模筛选
  if (query.scales?.length) {
    results = results.filter(c => query.scales?.includes(c.scale));
  }
  
  // 上市状态筛选
  if (query.listingStatus?.length) {
    results = results.filter(c => 
      query.listingStatus?.some(status => c.listingStatus.includes(status))
    );
  }
  
  // 排序
  if (query.sortBy) {
    results.sort((a, b) => {
      let comparison = 0;
      switch (query.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'founded':
          comparison = (a.foundedYear || '').localeCompare(b.foundedYear || '');
          break;
        case 'scale':
          comparison = (a.scale || '').localeCompare(b.scale || '');
          break;
      }
      return query.sortOrder === 'desc' ? -comparison : comparison;
    });
  }
  
  // 分页
  const page = query.page || 1;
  const pageSize = query.pageSize || 20;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedResults = results.slice(start, end);
  
  return {
    data: paginatedResults,
    total: results.length,
    page,
    pageSize,
    totalPages: Math.ceil(results.length / pageSize),
  };
}
