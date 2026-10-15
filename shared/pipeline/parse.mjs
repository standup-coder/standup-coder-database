/**
 * Markdown 企业清单解析。
 *
 * 语料有两种形态，公用层只认两种读法：
 * 1. 表格式 —— `| 企业名称 | … |` 开头的数据表，按表头名字取列（vocab/fields.mjs），
 *    不按列序号。实测 918 张企业表、1130 个数据行零列错位、零空名列，旧解析器里
 *    针对"两种错位形态"的 repair_row 在这里没有对应物。
 * 2. 档案式 —— `#### 公司名` 后跟 `**基本信息**` + `- 键：值` 条目
 *    （34 个文件、约 270 家企业只用这种写法，表格式读法一条都取不到）。
 */

import fs from 'node:fs';
import path from 'node:path';

import { tokenToCity } from '../vocab/cities.mjs';
import { resolveIndustry } from '../vocab/industries.mjs';
import { IGNORED_PROFILE_LABELS, PROFILE_SECTION_BY_LABEL, headerToField, resolveHeaders } from '../vocab/fields.mjs';
import { cell, extractUrl, isMultiName, splitLink } from './normalize.mjs';

/** 每座城市一份清单，这张表就是该城市的主表。 */
const MAIN_HEADING_RE =
  /^(企业列表|中国企业列表|企业汇总表|企业级安全服务企业列表|总部在[\u4e00-\u9fa5]{1,4}的企业)$/;

/** 跨国清单里的行不是文件名城市的本土企业，不能按文件名归市。 */
const INTERNATIONAL_HEADING_RE =
  /国际企业|美国企业|欧洲企业|亚洲其他国家企业|以色列企业|日本企业|境外上市|（国际）|全球云服务商/;

/** 分支/办公地清单：在该城市有办公点，主表归属存疑。 */
const BRANCH_HEADING_RE = /有重要办公地|有办公地|区域节点|子公司|办事处|分公司/;

/**
 * 同一批企业的重切片（按成立时间/规模/上市情况/业务领域…分类）。
 * 这些清单里的条目只是简称或"简称：规模"，企业本体已在同一文件的主表里，
 * 因此既不当作档案（否则会派生出只有名字没有属性的重复法人），
 * 也不计入"未映射字段"（少掉的简称不是数据丢失）。实测 945 个四级标题挂在这类小节下。
 */
const DIMENSION_SECTION_RE = /^按.{2,8}分类/;

const SIZE_BAND_RE = /^(超大型|大型|中型|小型|微型)企业/;
const HEADING_RE = /^(#{1,6})\s*(.+?)\s*$/;
const SEPARATOR_RE = /^[\s|:-]+$/;
const NUMBERING_RE = /^\d+(?:\.\d+)*[.\s、]*/;
/** `**基本信息**` 这类小节名，整行只有加粗文字。 */
const SECTION_RE = /^\*\*(.+?)\*\*$/;
const BULLET_RE = /^[-*+]\s+(.+)$/;
/** `- 企业名称：深圳量旋科技` / `- **地方政府基金**：20亿` / `- 桌面式量子计算机` */
const PAIR_RE = /^(?:\*\*(.+?)\*\*|([^：:*]{2,14}))[：:]\s*(.+)$/;

function splitRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}

function classify(text) {
  if (INTERNATIONAL_HEADING_RE.test(text)) return 'international';
  if (BRANCH_HEADING_RE.test(text)) return 'branch';
  if (MAIN_HEADING_RE.test(text)) return 'listed';
  return null;
}

/**
 * 从内向外取第一个显式命中，取不到就是补充表。
 * `按维度分类的企业列表 > 按公司规模分类 > 大型企业` 一路都不是主表名，所以是
 * supplement；而档案式清单的 `### 深圳量子计算企业` 之上才是 `## 企业列表`，
 * 必须向上走一层才拿得到主表口径。
 */
function scopeOfPath(texts) {
  for (let i = texts.length - 1; i >= 0; i -= 1) {
    const scope = classify(texts[i]);
    if (scope) return scope;
  }
  return 'supplement';
}

/** 主表行按文件名归市；其余行优先看地址里的城市名，跨国行找不到就不归市。 */
function cityOf(scope, values, fileCity) {
  if (scope === 'international') {
    return tokenToCity(`${values.address || ''} ${values.name || ''}`);
  }
  const inAddress = values.address ? tokenToCity(values.address) : null;
  if (scope === 'listed') return fileCity || inAddress;
  return inAddress || fileCity;
}

export function parseFile(filePath, { industrySlug = null, city = null } = {}) {
  const filename = path.basename(filePath);
  const industry = resolveIndustry(industrySlug);
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

  const rows = [];
  const droppedFields = new Set();
  const tableScopes = new Map();
  const stack = [];
  let sizeBand = null;
  let table = null;
  let profile = null;
  let inPipeBlock = false;
  let orphanTables = 0;
  let aggregateTables = 0;

  const makeRow = (values, scope, section) => {
    if (!values.name || isMultiName(values.name)) return;
    const homepage = values.website ? splitLink(values.website) : { url: null };
    rows.push({
      name: values.name,
      alias: values.alias,
      foundedYear: values.foundedYear,
      businessArea: values.businessArea,
      products: values.products,
      coreProduct: values.coreProduct,
      scale: values.scale,
      website: homepage.url || extractUrl(values.products),
      listingStatus: values.listingStatus,
      listingVenue: values.listingVenue,
      stockCode: values.stockCode,
      funding: values.funding,
      valuation: values.valuation,
      address: values.address,
      openSource: values.openSource,
      financialReport: values.financialReport,
      techStack: values.techStack,
      revenueModel: values.revenueModel,
      socialMedia: values.socialMedia,
      employeeRating: values.employeeRating,
      legalRisk: values.legalRisk,
      parent: values.parent,
      city: cityOf(scope, values, city),
      industrySlug: industry ? industry.slug : industrySlug,
      scope,
      section,
      sizeBand: values.scale ? null : sizeBand,
      sourceFile: filename,
    });
  };

  /** 档案式：`**小节名**` 决定后续无键条目落到哪个字段。 */
  const openProfile = (texts) => {
    if (texts.some((t) => DIMENSION_SECTION_RE.test(t))) return;
    profile = {
      fields: {},
      lists: {},
      listField: null,
      headingName: cell(texts[texts.length - 1]) || '',
      scope: scopeOfPath(texts),
      section: texts.join(' > '),
    };
  };

  const closeProfile = () => {
    if (!profile) return;
    const values = { ...profile.fields };
    for (const [field, items] of Object.entries(profile.lists)) {
      if (!values[field]) values[field] = items.join('、');
    }
    // 「- 企业名称：」是全称，标题是简称；两个都留下，简称不覆盖全称。
    if (!values.name) values.name = profile.headingName;
    else if (!values.alias && profile.headingName && !values.name.includes(profile.headingName)) {
      values.alias = profile.headingName;
    }
    // 至少两个可识别字段才算一份企业档案，否则只是碰巧用了同样的项目符号写法。
    const known = Object.values(values).filter(Boolean).length;
    if (known >= 2) makeRow(values, profile.scope, profile.section);
    profile = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('|')) {
      if (SEPARATOR_RE.test(trimmed)) continue;

      const raw = splitRow(trimmed);
      const resolved = resolveHeaders(raw);
      // 首列必须是「企业名称」才算企业表：实测 918 张企业表全部如此，
      // 而汇总表（企业数量 | 占比 | 排名）的名字列常塞多家并列。
      const startsTable = resolved.named && !resolved.aggregate && raw[0] === '企业名称';

      if (!inPipeBlock) {
        inPipeBlock = true;
        table = null;
        if (startsTable) {
          const scope = scopeOfPath(stack.map((h) => h.text));
          table = { map: resolved.map, scope, path: stack.map((h) => h.text).join(' > ') };
          tableScopes.set(scope, (tableScopes.get(scope) || 0) + 1);
        } else {
          if (resolved.aggregate) aggregateTables += 1;
          else if (resolved.named) orphanTables += 1;
        }
        // 每个管道块只有首行是表头，数据行的格子是企业数据，不能混进字段诊断。
        if (!resolved.aggregate) resolved.dropped.forEach((h) => droppedFields.add(h));
      } else if (table) {
        const values = {};
        for (const [field, index] of Object.entries(table.map)) {
          values[field] = cell(raw[index]);
        }
        makeRow(values, table.scope, table.path);
      }
      continue;
    }

    inPipeBlock = false;
    table = null;

    if (trimmed === '') continue;

    const heading = HEADING_RE.exec(trimmed);
    if (heading) {
      closeProfile();
      const level = heading[1].length;
      const text = heading[2].replace(NUMBERING_RE, '').trim();
      while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
      stack.push({ level, text });
      const band = SIZE_BAND_RE.exec(text);
      sizeBand = band ? band[1] : null;
      if (level === 4) openProfile(stack.map((h) => h.text));
      continue;
    }

    if (!profile) continue;

    const section = SECTION_RE.exec(trimmed);
    if (section) {
      profile.listField = PROFILE_SECTION_BY_LABEL[section[1]] || null;
      if (!profile.listField && !IGNORED_PROFILE_LABELS.includes(section[1])) {
        droppedFields.add(section[1]);
      }
      continue;
    }

    const bullet = BULLET_RE.exec(trimmed);
    if (!bullet) continue;
    const pair = PAIR_RE.exec(bullet[1]);
    if (pair) {
      pushProfile(profile, pair[1] || pair[2], pair[3], droppedFields);
    } else if (profile.listField) {
      setField(profile, profile.listField, bullet[1]);
    }
  }

  closeProfile();

  return {
    rows,
    droppedFields: [...droppedFields],
    tableScopes: [...tableScopes],
    orphanTables,
    aggregateTables,
  };
}

/** 值落字段：已知字段首次出现为准，同一字段多次出现（如多条产品）累积成列表。 */
function setField(profile, field, value) {
  const clean = cell(value);
  if (clean === null) return;
  if (!profile.fields[field]) profile.fields[field] = clean;
  else (profile.lists[field] ||= []).push(clean);
}

/** 档案式条目按「键：值」的键名落字段，键不认识就记进未映射诊断。 */
function pushProfile(profile, key, value, droppedFields) {
  if (IGNORED_PROFILE_LABELS.includes(key)) return;
  if (cell(value) === null) return;
  const field = headerToField(key) || PROFILE_SECTION_BY_LABEL[key];
  if (!field) {
    droppedFields.add(key);
    return;
  }
  setField(profile, field, value);
}
