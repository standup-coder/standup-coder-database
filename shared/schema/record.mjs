/**
 * 记录结构的唯一清单。
 *
 * 表格式企业表和档案式 profile 产出的键不一样（profile 段没有简称列、没有股票代码列），
 * 去重后的记录因此有的带 `stockCode: null`、有的干脆没这个键。已上线的两套消费端各自写
 * `r.stockCode ?? '-'` 和 `if ('valuation' in r)`，同一份数据在 console 和 app 里显示不同。
 * 这里把字段清单收成一处：pipeline 按清单补 null 并固定键序，
 * company.schema.json 与 types/company.ts 是同一份清单的其他语言视图。
 */

/** dedupe 产出的字段，即 companies.json 里一条企业记录的键序。 */
export const COMPANY_FIELDS = [
  'id', 'name', 'alias', 'foundedYear', 'businessArea', 'products', 'coreProduct',
  'scale', 'website', 'listingStatus', 'listingVenue', 'stockCode', 'funding',
  'valuation', 'address', 'openSource', 'financialReport', 'techStack',
  'revenueModel', 'socialMedia', 'employeeRating', 'legalRisk', 'parent',
  'city', 'industrySlug', 'scope', 'section', 'sizeBand', 'sourceFile',
  'industries', 'cities', 'listedIn', 'sourceFiles', 'sections',
  'occurrences', 'normalizedName', 'key',
];

/** derive 追加的字段。刻意排在末尾：前 37 个字段有语料出处，这 4 个是本地口径推导。 */
export const DERIVED_FIELDS = ['listingType', 'scaleBandValue', 'primaryIndustry', 'industry'];

export const ALL_FIELDS = [...COMPANY_FIELDS, ...DERIVED_FIELDS];

const LIST_FIELDS = new Set(['industries', 'cities', 'listedIn', 'sourceFiles', 'sections']);

/** 按清单补 null、固定键序。派生字段留给 derive 填，不预先占位。 */
export function canonicalize(record) {
  const out = {};
  for (const field of COMPANY_FIELDS) {
    const value = record[field];
    if (LIST_FIELDS.has(field)) out[field] = Array.isArray(value) ? value : [];
    else if (field === 'occurrences') out[field] = Number(value) || 0;
    else out[field] = value === undefined ? null : value;
  }
  return out;
}
