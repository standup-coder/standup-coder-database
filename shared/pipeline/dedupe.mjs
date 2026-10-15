/**
 * 按 (城市, 法人名) 去重合并；名称带办公城市后缀的跨国记录例外，只按母公司名。
 *
 * 同一法人会在一个文件里出现多次：主表一次，"按维度分类的企业列表"、
 * "按公司规模分类"、"已上市企业" 这些二级表再按不同切法列一遍。
 * 已上线的 console 把每次出现当成一家新公司，于是深圳 24 个文件产出
 * 1109 条记录、只有 374 个不同名称，无法回答"深圳有多少家企业"。
 *
 * 跨国清单里"母公司 + 办公城市"的写法（"ASML Shanghai""ASML Guangzhou"）按城市分组会
 * 把同一家母公司算成三家，所以这类记录改用剥掉城市后的名称做键，办公城市收进 cities[]。
 * 只限名称带城市后缀的行：语料里的"外资/外地企业"清单也列中国公司（奇安信在广州和北京
 * 各出现一次指的是两座办公室），把它们并成一家会把城市分布抹掉。
 */

import { guessAbbr, hasCitySuffix, hashKey, normalizeName, stripCitySuffix } from './normalize.mjs';
import { canonicalize } from '../schema/record.mjs';

const SCOPE_RANK = { listed: 4, branch: 3, supplement: 2, international: 1 };

const TEXT_FIELDS = [
  'alias', 'foundedYear', 'businessArea', 'products', 'coreProduct', 'scale',
  'website', 'listingStatus', 'listingVenue', 'stockCode', 'funding', 'valuation',
  'openSource', 'financialReport', 'techStack', 'revenueModel', 'socialMedia',
  'employeeRating', 'legalRisk',
];

function fillScore(row) {
  return TEXT_FIELDS.reduce((n, f) => n + (row[f] ? 1 : 0), 0);
}

/** 排序键：主表优先，其次信息量大的行，最后名称兜底，保证输出稳定。 */
function rank(row) {
  return [-SCOPE_RANK[row.scope], -fillScore(row), row.name];
}

function comesBefore(a, b) {
  const ka = rank(a);
  const kb = rank(b);
  for (let i = 0; i < ka.length; i++) {
    if (ka[i] < kb[i]) return true;
    if (ka[i] > kb[i]) return false;
  }
  return false;
}

/** 地址择优：出现次数最多，平票取更长（更完整的地址信息量更高）。 */
function pickAddress(rows) {
  const counts = new Map();
  for (const row of rows) {
    if (!row.address) continue;
    counts.set(row.address, (counts.get(row.address) || 0) + 1);
  }
  if (!counts.size) return null;
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)[0][0];
}

/** 出现次数最多的城市；平票取信息更完整（更长）的那个。 */
function primaryCity(rows) {
  const counts = new Map();
  for (const row of rows) {
    if (!row.city) continue;
    counts.set(row.city, (counts.get(row.city) || 0) + 1);
  }
  if (!counts.size) return null;
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)[0][0];
}

/**
 * 键分两种：
 *   `∷名称`   跨国清单里带办公城市后缀的写法（"ASML Shanghai"/"ASML Guangzhou"），
 *            跨城市并成一家母公司的一个条目，办公城市收进 cities[]。
 *   `城市::名称` 其余一律按城市分组。本土口径下"同一法人在两座城"就是两家主体。
 */
function groupKey(row, normalize, officeNames) {
  const name = normalize(row.name) || row.name;
  if (officeNames.has(name)) return `∷${name}`;
  return `${row.city || '∅'}::${name}`;
}

export function dedupe(rows, { normalize = normalizeName } = {}) {
  // 同一名字一旦以"母公司+办公城市"的写法出现过，其他章节重复列它的行也并进这一组：
  // 城市文件的"国际企业列表"和"按维度分类"会各列一次，拆两组会让带上市信息的那条丢字段。
  const officeNames = new Set(
    rows
      .filter((r) => r.scope === 'international' && hasCitySuffix(r.name))
      .map((r) => normalize(r.name) || r.name),
  );
  const groups = new Map();

  for (const row of rows) {
    const key = groupKey(row, normalize, officeNames);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }

  const companies = [];
  for (const [key, group] of [...groups.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    const ordered = [...group].sort((a, b) => (comesBefore(a, b) ? -1 : comesBefore(b, a) ? 1 : 0));
    const base = ordered[0];
    const record = { id: null, ...base };

    for (const field of TEXT_FIELDS) {
      for (const row of ordered) {
        if (row[field]) {
          record[field] = row[field];
          break;
        }
      }
    }

    record.address = pickAddress(ordered);
    record.industries = [...new Set(ordered.map((r) => r.industrySlug).filter(Boolean))];
    record.scope = base.scope;
    record.cities = [...new Set(ordered.map((r) => r.city).filter(Boolean))];
    record.city = primaryCity(ordered);
    // 合并后的展示名不该带某座办公城市："ASML Shanghai"和"ASML Holding N.V."取后者，
    // 只剩城市后缀写法时剥掉后缀。
    if (key.startsWith('∷') && hasCitySuffix(record.name)) {
      const plain = ordered.map((r) => r.name).find((n) => !hasCitySuffix(n)) || stripCitySuffix(record.name);
      record.name = plain;
    }
    record.sizeBand = base.sizeBand || ordered.find((r) => r.sizeBand)?.sizeBand || null;
    record.listedIn = ordered.filter((r) => r.scope === 'listed').map((r) => r.sourceFile);
    record.sourceFiles = [...new Set(ordered.map((r) => r.sourceFile))];
    record.sections = [...new Set(ordered.map((r) => r.section).filter(Boolean))];
    record.occurrences = ordered.length;
    record.normalizedName = normalize(base.name);
    record.alias = record.alias || guessAbbr(base.name);
    record.key = key;
    record.id = `c${hashKey(key)}`;
    companies.push(canonicalize(record));
  }

  return companies;
}
