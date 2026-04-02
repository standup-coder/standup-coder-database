// 统计数据类型定义

export interface DistributionItem {
  name: string;
  value: number;
}

export interface IndustryInsight {
  name: string;
  value: number;
}

export interface CityInsight {
  name: string;
  value: number;
}

export interface StatsInsights {
  topIndustry: IndustryInsight | null;
  topCity: CityInsight | null;
  topScale: DistributionItem | null;
  listingRate: number;
  tier1Rate: string;
  newTier1Rate: string;
}

export interface StatsData {
  totalCompanies: number;
  cityDistribution: DistributionItem[];
  industryDistribution: DistributionItem[];
  scaleDistribution: DistributionItem[];
  listingDistribution: DistributionItem[];
  foundedYearDistribution: DistributionItem[];
  cityTierDistribution: DistributionItem[];
  insights: StatsInsights;
}
