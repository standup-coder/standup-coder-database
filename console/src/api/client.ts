// API 客户端

import { Company, CompanyQuery, CompanyFilterOptions } from '../types/company';
import { StatsData } from '../types/stats';
import { PaginationResult } from '../types/common';

const BASE_URL = '/data';

// 内存缓存
const cache = new Map<string, unknown>();

async function fetchJson<T>(url: string): Promise<T> {
  if (cache.has(url)) {
    return cache.get(url) as T;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  cache.set(url, data);
  return data;
}

// 获取所有企业（shared/data/dist/companies.json，经 npm run data:sync 同步过来）
export async function fetchCompanies(): Promise<Company[]> {
  return fetchJson(`${BASE_URL}/companies.json`);
}

// 获取筛选选项
export async function fetchFilterOptions(): Promise<CompanyFilterOptions> {
  return fetchJson<CompanyFilterOptions>(`${BASE_URL}/filter-options.json`);
}

// 获取统计数据
export async function fetchStats(): Promise<StatsData> {
  return fetchJson<StatsData>(`${BASE_URL}/stats.json`);
}

const has = (value: string | null, keyword: string) =>
  !!value && value.toLowerCase().includes(keyword);

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
      has(c.name, keyword) ||
      has(c.alias, keyword) ||
      has(c.businessArea, keyword) ||
      has(c.products, keyword) ||
      has(c.coreProduct, keyword) ||
      has(c.city, keyword) ||
      has(c.industry, keyword)
    );
  }

  // 城市筛选
  if (query.cities?.length) {
    results = results.filter(c => c.city && query.cities?.includes(c.city));
  }

  // 行业筛选（按中文名，与 filter-options 的行业选项一致）
  if (query.industries?.length) {
    results = results.filter(c => c.industry && query.industries?.includes(c.industry));
  }

  // 规模筛选：记录里的 scale 是原文（「约 5000 人」「1,000-5000」写法各异），
  // 能跟筛选项对上的是 derive 出的分档值。
  if (query.scales?.length) {
    results = results.filter(c => query.scales?.includes(c.scaleBandValue));
  }

  // 上市状态筛选：同上，listingStatus 是原文，筛选用 derive 的 listingType
  if (query.listingStatus?.length) {
    results = results.filter(c => c.listingType && query.listingStatus?.includes(c.listingType));
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
          comparison = (a.scaleBandValue || '').localeCompare(b.scaleBandValue || '');
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
