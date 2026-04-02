// 通用类型定义

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

export interface SearchResult<T> {
  item: T;
  score: number;
  matches: SearchMatch[];
}

export interface SearchMatch {
  key: string;
  value: string;
  indices: [number, number][];
}

export type Theme = 'light' | 'dark';

export interface NavItem {
  key: string;
  label: string;
  path: string;
  icon?: string;
}

export interface DashboardStats {
  totalCompanies: number;
  totalJobs: number;
  totalRankings: number;
  industryDistribution: { name: string; value: number }[];
  cityDistribution: { name: string; value: number }[];
  scaleDistribution: { name: string; value: number }[];
}
