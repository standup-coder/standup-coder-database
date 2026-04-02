import { useQuery } from '@tanstack/react-query';
import { fetchCompanies, fetchFilterOptions, fetchStats, searchCompanies } from '../api/client';
import { CompanyQuery } from '../types/company';

// 获取所有企业
export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });
}

// 获取筛选选项
export function useFilterOptions() {
  return useQuery({
    queryKey: ['filterOptions'],
    queryFn: fetchFilterOptions,
    staleTime: 5 * 60 * 1000,
  });
}

// 获取统计数据
export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    staleTime: 5 * 60 * 1000,
  });
}

// 搜索企业（客户端搜索）
export function useCompanySearch(companies: any[] | undefined, query: CompanyQuery) {
  return useQuery({
    queryKey: ['companySearch', query, companies?.length],
    queryFn: () => {
      if (!companies) return { data: [], total: 0, page: 1, pageSize: 20, totalPages: 0 };
      return searchCompanies(companies, query);
    },
    enabled: !!companies,
    staleTime: 0, // 搜索实时更新
  });
}
