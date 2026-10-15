/** 单元格清洗与法人名归一。 */

import { CITY_TOKENS_BY_LENGTH } from '../vocab/cities.mjs';

const DASHES = new Set(['-', '—', '–', '', '无', 'N/A', 'n/a', 'NA', '暂无', '待补充', '未公开', '未披露']);

/** 语料用 "-" 表示空。公用层的空值是 null，不让 "-" 泄漏到下游。 */
export function cell(value) {
  if (value === undefined || value === null) return null;
  const s = String(value).replace(/\\\|/g, '|').replace(/\*\*/g, '').replace(/<br\s*\/?>/g, ' ').trim();
  if (DASHES.has(s)) return null;
  if (/^[-—–\s:]+$/.test(s)) return null;
  return s;
}

const LINK_RE = /\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;

/** Markdown 链接折叠成裸 URL；多个链接（如"官网/微博"）取第一个 http。 */
export function extractUrl(value) {
  if (!value) return null;
  const links = [...value.matchAll(LINK_RE)];
  if (links.length) return links[0][2];
  const bare = value.match(/https?:\/\/[^\s|)）\]]+/);
  return bare ? bare[0] : null;
}

/** 含链接的单元格拆成 {url, 去掉链接后的文字}，避免 website 里混进"官网"字样。 */
export function splitLink(value) {
  if (!value) return { url: null, text: value ?? null };
  const url = extractUrl(value);
  if (!url) return { url: null, text: value };
  const text = value.replace(LINK_RE, '').replace(url, '').replace(/[()\s,;、|]+$/g, '').trim();
  return { url, text: text || null };
}

export function splitList(value) {
  if (!value) return [];
  return value
    .split(/[、，,;；/|]+/)
    .map((s) => s.trim())
    .filter((s) => s && s !== '-');
}

/** 英文法人后缀自带逗号（"Co., Ltd."），先摘掉再判并列，否则整条记录会被当成两家公司丢掉。 */
const LEGAL_SUFFIX_COMMA = /\s*,\s*(?:Ltd|Limited|Inc|Corp|Corporation|Company|Co)(?:\.|,\b)/gi;

/** 并列多家公司的单元格不是单个法人，必须整体丢弃而不是生成"XX、YY"这种假企业。 */
export function isMultiName(value) {
  return /[、，,;；]|\s等\s*(企业|公司)/.test((value || '').replace(LEGAL_SUFFIX_COMMA, ' '));
}

/** 中文名 token 才做前缀剥离；英文写法只会出现在名称末尾。从词表生成，避免再漏城市。 */
const CITIES_PREFIX = new RegExp(
  `^(?:${CITY_TOKENS_BY_LENGTH.filter((t) => /[一-龥]/.test(t.token)).map((t) => t.token).join('|')})(?:市)?`,
);

/**
 * 尾缀城市：跨国清单把办公城市写在名称末尾（"ASML Shanghai"、"Amazon Web Services (Guangzhou)"），
 * 中英文都要剥，否则同一母公司在每座城市各算一家。token 按长度倒序拼，保证"哈尔滨"不被截断。
 */
const CITIES_TRAILING = new RegExp(
  `[\\s(（]?(?:${CITY_TOKENS_BY_LENGTH.map((t) => t.token).join('|')})[)）]?$`,
  'i',
);

/**
 * 法人名归一：全角括号统一、去空白、去城市前缀与尾缀、折叠已核实的同实体写法。
 * 去城市是为了让"上海特斯拉超级工厂"和"特斯拉（上海）有限公司"、
 * "ASML Shanghai"和"ASML Holding N.V."这类写法可比，
 * 但归一结果只用于比对与去重，展示仍用原始 name。
 */
const NAME_ALIASES = {
  华为云计算技术有限公司: '华为技术有限公司',
};

function tidy(name) {
  return String(name)
    .replace(/（/g, '(').replace(/）/g, ')').replace(/【/g, '[').replace(/】/g, ']')
    .replace(/\s+/g, '')
    .replace(/[\u00a0]/g, '');
}

/**
 * 末尾的英文法人后缀。语料里同一主体常一半带后缀、一半不带
 * （"Cisco Systems" 与 "Cisco Systems, Inc."），不剥掉就会同城各算一家。
 * 只认整词，所以 "Amazon.com" 里的 "com" 不会被误剥；循环剥是因为
 * "Co., Ltd." 是两层后缀。
 */
const LEGAL_TAIL = /(?<![A-Za-z0-9])(CO|CORP|CORPORATION|INC|INCORPORATED|LTD|LIMITED|LLC|PLC|LP|LLP|NV|N\.V|SA|S\.A|AG|BV|B\.V|KK|K\.K|GMBH|COMPANY)[\s.,)）]*$/i;

function stripLegalSuffix(name) {
  let n = String(name);
  let prev;
  do {
    prev = n;
    n = n.replace(LEGAL_TAIL, '');
  } while (n !== prev && n.trim());
  // 剥完后留下的悬空分隔符（"Cisco Systems, "）不是名字的一部分
  n = n.replace(/[.,;:\s]+$/, '').trim();
  return n || String(name).trim();
}

export function normalizeName(name) {
  if (!name) return null;
  let n = tidy(stripLegalSuffix(name)).replace(CITIES_PREFIX, '').replace(CITIES_TRAILING, '');
  for (const [from, to] of Object.entries(NAME_ALIASES)) {
    if (n === from) n = to;
  }
  return n || null;
}

/**
 * 名称末尾是否带办公城市。只有这类写法才是"母公司在某城设办公室"的变体
 * （"ASML Shanghai"），可以跨城市并成一家；"奇安信科技集团股份有限公司"
 * 这类没有城市后缀的名字不算，它在广州/北京的清单里指的是两座办公室，
 * 并成一家会把城市分布抹掉。
 */
export function hasCitySuffix(name) {
  if (!name) return false;
  const n = tidy(stripLegalSuffix(name)).replace(CITIES_PREFIX, '');
  return n.replace(CITIES_TRAILING, '') !== n;
}

const RAW_CITY_TRAILING = new RegExp(
  `[\\s(（]*(?:${CITY_TOKENS_BY_LENGTH.map((t) => t.token).join('|')})[)）]*\\s*$`,
  'i',
);

/** 剥掉名称末尾的办公城市，用于跨国主体合并后的展示名（保留原始空格与括号写法）。 */
export function stripCitySuffix(name) {
  if (!name) return null;
  // 先剥法人后缀，"Intel Semiconductor (Shanghai) Co. Ltd." 的城市才落在末尾
  const stripped = stripLegalSuffix(name).replace(RAW_CITY_TRAILING, '').trim();
  return stripped || String(name).trim();
}

/** profile 段与部分二级表没有简称列，从法人名推一个够短的徽章文字。 */
export function guessAbbr(name) {
  if (!name) return null;
  let n = name.replace(CITIES_PREFIX, '');
  n = n.replace(/(区块链|元宇宙|数字藏品)?(事业部|工作室|研发中心|办事处|创新中心|实验室|超级工厂|区域总部)$/,'');
  n = n.replace(/(科技|信息|网络|电子|智能|数据|数字)?(集团|股份|控股|有限)?(公司|责任公司)$/,'');
  if (/^[A-Za-z]/.test(n)) {
    n = n.replace(/\s*(Co\.,? Ltd\.?|Inc\.?|Limited|Corp\.?|LLC|Technologies|Technology)$/i, '');
    const words = n.trim().split(/\s+/);
    n = words[0] || n;
  }
  n = n.trim();
  return n ? n.slice(0, 10) : name.slice(0, 6);
}

/** FNV-1a。跨语言可比对 crc32，但零依赖且对中文稳定。 */
export function hashKey(input) {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36).padStart(7, '0');
}
