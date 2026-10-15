// 企业类型定义。
//
// Company 的字段清单只有一份出处：shared/schema/types/company.ts，
// 由 shared/pipeline/build.mjs 在构建时与 record.mjs、company.schema.json 三方比对。
// 这里只重导出，不再抄一遍——抄了就等着漂移。
//
// 语料没给的字段是 null（不是空串），所以消费端要么判空、要么用 `|| '-'`。

export type { Company, CompanyScope } from '../../../shared/schema/types/company.ts';

/** 搜索/筛选条件，字段名与 Company 对齐。 */
export interface CompanyQuery {
  keyword?: string;
  cities?: string[];
  /** 行业中文名，与 Company.industry 同口径。 */
  industries?: string[];
  /** 规模分档（scaleBandValue），如「1000-9999人」。 */
  scales?: string[];
  /** 上市类型（listingType），如「港交所」「未上市」。 */
  listingStatus?: string[];
  sortBy?: 'name' | 'founded' | 'scale';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

/** filter-options.json 里的行业选项；color 取自 shared/vocab/industries.mjs。 */
export interface IndustryOption {
  slug: string;
  name: string;
  color: string;
}

export interface CompanyFilterOptions {
  cities: string[];
  industries: IndustryOption[];
  scales: string[];
  listingStatus: string[];
  decades: string[];
}
