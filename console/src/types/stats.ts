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
  /** 以下三个比率都是百分数，不是 0-1 的小数。 */
  listingRate: number;
  tier1Rate: number;
  newTier1Rate: number;
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
