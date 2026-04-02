import { create } from 'zustand';
import { CompanyQuery } from '../types/company';

interface SearchState {
  // 搜索关键词
  keyword: string;
  setKeyword: (keyword: string) => void;
  
  // 查询参数
  query: CompanyQuery;
  setQuery: (query: Partial<CompanyQuery>) => void;
  resetQuery: () => void;
  
  // 搜索历史
  history: string[];
  addToHistory: (keyword: string) => void;
  clearHistory: () => void;
}

const defaultQuery: CompanyQuery = {
  keyword: '',
  cities: [],
  industries: [],
  scales: [],
  listingStatus: [],
  sortBy: 'name',
  sortOrder: 'asc',
  page: 1,
  pageSize: 20,
};

export const useSearchStore = create<SearchState>((set) => ({
  keyword: '',
  setKeyword: (keyword) => set({ keyword }),
  
  query: { ...defaultQuery },
  setQuery: (query) => set((state) => ({
    query: { ...state.query, ...query },
  })),
  resetQuery: () => set({ query: { ...defaultQuery } }),
  
  history: [],
  addToHistory: (keyword) => set((state) => ({
    history: [keyword, ...state.history.filter(h => h !== keyword)].slice(0, 10),
  })),
  clearHistory: () => set({ history: [] }),
}));
