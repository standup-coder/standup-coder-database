/**
 * companies.json 一条记录的 TypeScript 视图，字段清单与 ../company.schema.json、
 * ../record.mjs 一一对应；构建时断言三者一致，改字段没同步会在 build 里报错，
 * 而不是等 console 运行时出现 undefined。
 */

export type CompanyScope = 'listed' | 'branch' | 'supplement' | 'international';

export interface Company {
  /** 去重键的 FNV-1a base36，语料改动前稳定，可作前端路由参数。 */
  id: string;
  /** 法人全称；合并办公城市变体时取不带城市的写法。 */
  name: string;
  /** 简称/品牌名，语料缺失时由全称推断，可能等于全称。 */
  alias: string;
  /** 原文，如「2005年」。 */
  foundedYear: string | null;
  businessArea: string | null;
  products: string | null;
  coreProduct: string | null;
  /** 员工数原文，如「5000-10000人」。分档见 scaleBandValue。 */
  scale: string | null;
  website: string | null;
  /** 上市情况原文，如「创业板：300059」。 */
  listingStatus: string | null;
  listingVenue: string | null;
  /** 多地上市保留斜杠写法，如「000063/0763」。 */
  stockCode: string | null;
  funding: string | null;
  valuation: string | null;
  address: string | null;
  /** markdown 链接原文。 */
  openSource: string | null;
  financialReport: string | null;
  techStack: string | null;
  /** 以下四项语料列已映射、当前全为 null，UI 可整块隐藏。 */
  revenueModel: string | null;
  socialMedia: string | null;
  employeeRating: string | null;
  legalRisk: string | null;
  /** 母公司法人名。 */
  parent: string | null;
  /** 主城市；跨国记录在无地址时为 null，不参与城市分布。 */
  city: string | null;
  /** 本条来源文件的行业 slug。 */
  industrySlug: string;
  scope: CompanyScope;
  /** 来源标题路径，「 > 」连接。 */
  section: string;
  /** 语料按规模分组的表头档位（如「中型」），仅在 scale 缺失时填。 */
  sizeBand: string | null;
  /** 主表优先行的文件名；全部出处见 sourceFiles。 */
  sourceFile: string;
  industries: string[];
  /** 合并掉的办公城市，含 city。 */
  cities: string[];
  /** 出现在主表口径的文件，用于 primaryIndustry 判定。 */
  listedIn: string[];
  sourceFiles: string[];
  sections: string[];
  /** 合并了几行；>1 说明同一家被列进多张表。 */
  occurrences: number;
  /** 去空格、去城市前后缀、套别名表后的名称，是 key 的名称部分。 */
  normalizedName: string;
  /** 「城市::规范名」；∷ 开头是跨国办公城市合并组。 */
  key: string;
  /** 以下为 derive 追加的口径字段。 */
  listingType: string | null;
  scaleBandValue: string;
  primaryIndustry: string | null;
  industry: string | null;
}
