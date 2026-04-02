// 榜单类型定义

export interface RankingItem {
  rank: number;
  name: string;
  alias?: string;
  city?: string;
  country?: string;
  industry?: string;
  revenue?: string;
  profit?: string;
  employees?: string;
  valuation?: number;
  marketCap?: string;
  website?: string;
  listing?: string;
  ceo?: string;
  founded?: string;
  description?: string;
}

export interface Ranking {
  id: string;
  name: string;
  year: number;
  category: string;
  items: RankingItem[];
  count: number;
}

export interface RankingQuery {
  year?: string;
  category?: string;
}

// 榜单类别
export const RANKING_CATEGORIES = [
  { value: 'global', label: '全球榜单' },
  { value: 'unicorn', label: '独角兽' },
  { value: 'gazelle', label: '瞪羚企业' },
  { value: 'private', label: '民营企业' },
  { value: 'internet', label: '互联网' },
  { value: 'software', label: '软件' },
  { value: 'manufacturing', label: '制造业' },
  { value: 'innovation', label: '创新企业' },
];
