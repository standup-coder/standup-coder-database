/** 上市情况文本 → 交易所分类，以及成立年份 → 年代分桶。 */

/**
 * A股代码段自带板块信息，且实测比"交易所文字"更可靠：语料里有"深交所：603131"
 * "上交所：002555"这类文字写错、代码写对的行，所以代码先判。
 */
const BOARDS_BY_CODE = [
  ['科创板', /\b688\d{3}\b/],
  ['创业板', /\b30\d{4}\b/],
  ['上交所', /\b60\d{4}\b/],
  ['深交所', /\b[03]\d{5}\b/],
];

/**
 * 写法取自语料实测，不是常见交易所清单：例如"纽约证券交易所(MMM)""东京(9432)"
 * "法国Euronext""德国DAX指数"这类带代号或只写指数名的形式，上一版按简称匹配全部落空，
 * 167 条上市公司被算进"未披露"，本土上市率因此低估。
 */
const EXCHANGES = [
  ['科创板', /科创板/],
  ['创业板', /创业板/],
  ['北交所', /北交所|北证/],
  ['新三板', /新三板/],
  ['上交所', /上交所|沪市/],
  ['深交所', /深交所|深市/],
  ['港交所', /港交所|港股|HKEX|\b\d{4,5}\.HK\b/i],
  ['纳斯达克', /纳斯达克|NASDAQ/i],
  ['纽交所', /纽交所|纽约证券交易所|NYSE/i],
  ['伦交所', /伦交所|伦敦证券交易所|LSE/i],
  ['东京交易所', /东证|东交所|东京(?:证券)?交易所|东京\(/],
  ['首尔交易所', /韩交所|首尔|KOSPI/i],
  ['台交所', /台交所|台湾交易所/],
  ['欧交所', /Euronext|泛欧交易所|欧交所|巴黎交易所/i],
  ['德交所', /德交所|法兰克福|\b[MS]?DAX\b/i],
  ['瑞交所', /瑞士.{0,6}交易所|SIX/i],
  ['多伦多交易所', /多加|TSX/i],
  ['新加坡交易所', /新交所|SGX/i],
];

/** 交易所不明但确实上市：写"已上市(代号)"或只说上市，保留为已上市但不计入某个交易所。 */
const LISTED_GENERIC_RE = /已上市|上市\(|挂牌|整体上市|上市公司/;
/** "网易：NTES""唯品会：VIPS"：只给代码不给所，同样属于已上市。 */
const TICKER_SYMBOL_RE = /[：:]\s*[A-Z]{2,5}\s*$/;
/** 上表之外的交易所（斯德哥尔摩/赫尔辛基/哥本哈根/特拉维夫…）不必逐个建桶，计入其他上市。 */
const EXCHANGE_LIKE_RE = /交易所|Exchange|OMX|\bKOSPI\b|\bBIT\b/i;
const PRIVATE_RE = /私有|私人|私募|已退市|退市|借壳失败|终止上市|撤回|终止审查|辅导|问询/;
const PENDING_RE = /IPO|申报|受理|拟上市|预备|上市中/;
const UNLISTED_RE = /未上市|不上市|暂无上市|尚未上市/;
const ACQUIRED_RE = /收购|已并入|并购/;
/** 子公司、事业单位、合资平台：本身不会独立上市，不是"数据缺失"。 */
const SUBJECT_RE = /子公司|分公司|下属单位|下属企业|关联公司|直属机构|旗下|超级工厂|合资|事业单位|非营利|高校|院校|国有|政府|央行|园区/;

export function classifyListing(status) {
  if (!status) return '未披露';
  // 先判否定："未上市"含有"上市"二字，晚一步就会被交易所表吞成"其他上市"。
  if (UNLISTED_RE.test(status)) return '未上市';
  if (PRIVATE_RE.test(status)) return /退市/.test(status) ? '已退市' : '私有公司';
  if (PENDING_RE.test(status)) return 'IPO进行中';
  for (const [label, re] of BOARDS_BY_CODE) {
    if (re.test(status)) return label;
  }
  for (const [label, re] of EXCHANGES) {
    if (re.test(status)) return label;
  }
  if (EXCHANGE_LIKE_RE.test(status) || TICKER_SYMBOL_RE.test(status)) return '其他上市';
  if (LISTED_GENERIC_RE.test(status)) return '其他上市';
  if (ACQUIRED_RE.test(status)) return '已被收购';
  if (SUBJECT_RE.test(status)) return '非上市主体';
  return '未披露';
}

/** 分母口径。新增标签若属于"未上市"一侧，必须同时加进 NOT_LISTED，否则会被算成上市。 */
const NOT_LISTED = ['未披露', '未上市', '私有公司', 'IPO进行中', '已退市', '已被收购', '非上市主体'];

export function isListed(type) {
  return !NOT_LISTED.includes(type);
}

export const LISTED_EXCHANGES = [
  '上交所', '深交所', '科创板', '创业板', '北交所', '新三板', '港交所',
  '纳斯达克', '纽交所', '伦交所', '欧交所', '德交所', '瑞交所', '台交所',
  '东京交易所', '首尔交易所', '多伦多交易所', '新加坡交易所', '其他上市',
];

const DECADES = [
  [2020, '2020年代'],
  [2010, '2010年代'],
  [2000, '2000年代'],
  [1990, '1990年代'],
  [1980, '1980年代及更早'],
];

export function foundedDecade(yearStr) {
  const match = String(yearStr || '').match(/(1[89]\d{2}|20\d{2})/);
  if (!match) return null;
  const year = Number(match[1]);
  if (year > 2030 || year < 1900) return null;
  for (const [from, label] of DECADES) {
    if (year >= from) return label;
  }
  return '1980年代及更早';
}
