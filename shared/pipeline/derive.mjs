/**
 * 派生统计。所有分布都按去重后的法人计数，因此"深圳有多少家"这类问题
 * 有唯一答案；console 与 app 此前各自统计，同一问法给出不同的数。
 */

import { cityTier } from '../vocab/cities.mjs';
import { INDUSTRIES } from '../vocab/industries.mjs';
import { classifyListing, foundedDecade, isListed, LISTED_EXCHANGES } from '../vocab/listing.mjs';

const SCALE_BANDS = [
  ['10000人以上', 10000],
  ['1000-9999人', 1000],
  ['500-999人', 500],
  ['100-499人', 100],
  ['100人以下', 0],
];

function parseHeadcount(scale) {
  if (!scale) return null;
  const nums = String(scale).replace(/,/g, '').match(/\d+/g);
  if (!nums) return null;
  return Math.max(...nums.map(Number));
}

export function scaleBand(record) {
  const count = parseHeadcount(record.scale);
  if (count === null) return record.sizeBand ? `${record.sizeBand}企业` : '未披露';
  for (const [label, floor] of SCALE_BANDS) {
    if (count >= floor) return label;
  }
  return '100人以下';
}

/** 主行业：主表所在文件的行业优先，其次按行业名排序取第一个，保证跨次构建稳定。 */
export function primaryIndustry(record) {
  const list = record.industries || [];
  if (!list.length) return null;
  const listed = record.listedIn || [];
  const fromMain = list.find((slug) => listed.some((f) => f.startsWith(`${slug}-`)));
  const chosen = fromMain || list[0];
  return INDUSTRIES[chosen] ? chosen : list.sort()[0];
}

function countBy(records, project) {
  const counts = new Map();
  for (const record of records) {
    const value = project(record);
    if (value === null || value === undefined) continue;
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, value]) => ({ name, value, label: name }))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name, 'zh-CN'));
}

const DECADE_ORDER = ['2020年代', '2010年代', '2000年代', '1990年代', '1980年代及更早'];

export function derive(records) {
  const domestic = records.filter((r) => r.scope !== 'international');
  const mainTable = records.filter((r) => r.scope === 'listed');

  const listingType = new Map(records.map((r) => [r.id, classifyListing(r.listingStatus || r.listingVenue)]));
  for (const r of records) r.listingType = listingType.get(r.id);
  for (const r of records) r.scaleBandValue = scaleBand(r);
  for (const r of records) r.primaryIndustry = primaryIndustry(r);
  for (const r of records) r.industry = INDUSTRIES[r.primaryIndustry]?.name || r.primaryIndustry || null;

  const cityDistribution = countBy(domestic, (r) => r.city);
  const tierDistribution = countBy(domestic, (r) => (r.city ? cityTier(r.city) : null));
  const scaleDistribution = countBy(records, (r) => r.scaleBandValue);
  const listingDistribution = countBy(records, (r) => r.listingType);
  const industryDistribution = countBy(domestic, (r) => r.primaryIndustry).map((x) => ({
    ...x,
    slug: x.name,
    name: INDUSTRIES[x.name] ? INDUSTRIES[x.name].name : x.name,
    label: INDUSTRIES[x.name] ? INDUSTRIES[x.name].name : x.name,
    color: INDUSTRIES[x.name] ? INDUSTRIES[x.name].color : '#B0BEC5',
  }));
  const decadeCounts = countBy(domestic, (r) => foundedDecade(r.foundedYear));
  const foundedYearDistribution = DECADE_ORDER.filter((d) => decadeCounts.some((x) => x.name === d))
    .map((d) => decadeCounts.find((x) => x.name === d))
    .concat(decadeCounts.filter((x) => !DECADE_ORDER.includes(x.name)));

  // 上市率与一线占比都按本土口径：跨国清单里的巨头几乎全是上市公司，
  // 把它们算进分母会让"本土企业上市率"这个说法名不副实。
  const listedTotal = domestic.filter((r) => isListed(r.listingType)).length;
  const tier1 = tierDistribution.find((x) => x.name === '一线城市')?.value || 0;
  const newTier1 = tierDistribution.find((x) => x.name === '新一线城市')?.value || 0;
  const pct = (n, d) => (d ? Number(((n / d) * 100).toFixed(1)) : 0);

  return {
    totalCompanies: records.length,
    totalDomestic: domestic.length,
    totalInternational: records.length - domestic.length,
    totalMainTable: mainTable.length,
    totalListedCompanies: listedTotal,
    cityDistribution,
    industryDistribution,
    cityTierDistribution: tierDistribution,
    scaleDistribution,
    listingDistribution,
    foundedYearDistribution,
    scopes: countBy(records, (r) => r.scope),
    insights: {
      topCity: cityDistribution[0] || null,
      topIndustry: industryDistribution[0] || null,
      topScale: scaleDistribution[0] || null,
      listingRate: pct(listedTotal, domestic.length),
      tier1Rate: pct(tier1, domestic.length),
      newTier1Rate: pct(newTier1, domestic.length),
      cities: cityDistribution.length,
      industries: industryDistribution.length,
      exchanges: LISTED_EXCHANGES.filter((e) => listingDistribution.some((x) => x.name === e)).length,
    },
  };
}

export function filterOptions(records) {
  const cities = new Set();
  const slugs = new Set();
  const scales = new Set();
  const listings = new Set();
  const decades = new Set();

  for (const r of records) {
    if (r.scope !== 'international' && r.city) cities.add(r.city);
    if (r.primaryIndustry) slugs.add(r.primaryIndustry);
    scales.add(r.scaleBandValue);
    listings.add(r.listingType);
    const decade = foundedDecade(r.foundedYear);
    if (decade) decades.add(decade);
  }

  const zh = (a, b) => a.localeCompare(b, 'zh-CN');
  return {
    cities: [...cities].sort(zh),
    industries: [...slugs]
      .filter((s) => INDUSTRIES[s])
      .map((s) => ({ slug: s, name: INDUSTRIES[s].name, color: INDUSTRIES[s].color }))
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')),
    scales: [...scales].sort(zh),
    listingStatus: [...listings].sort(zh),
    decades: DECADE_ORDER.filter((d) => decades.has(d)).concat([...decades].filter((d) => !DECADE_ORDER.includes(d))),
  };
}

export function searchIndex(records) {
  return {
    companies: records.map((r) => ({
      id: r.id,
      name: r.name,
      alias: r.alias,
      city: r.scope === 'international' ? null : r.city,
      industry: r.industry,
      industries: r.industries,
      scope: r.scope,
      businessArea: r.businessArea,
      products: r.products || r.coreProduct,
      scale: r.scaleBandValue,
      listingType: r.listingType,
    })),
  };
}
