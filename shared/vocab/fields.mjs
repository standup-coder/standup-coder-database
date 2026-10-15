/**
 * 表头中文名 → 规范字段名。
 *
 * 语料里带"企业名称"的表格实测有 45 种表头写法。两套旧解析器的做法不同：
 * app 按列序号取数（因此要写 repair_row 修两种错位），console 按表头名取数。
 * 公用层统一按名字取数：列序怎么变都不影响结果，只需维护这张交叉表。
 */

export const FIELD_BY_HEADER = {
  企业名称: 'name',
  简称: 'alias',
  成立时间: 'foundedYear',
  业务领域: 'businessArea',
  业务方向: 'businessArea',
  应用场景: 'businessArea',
  代表产品: 'products',
  '代表产品/服务': 'products',
  核心服务: 'products',
  核心产品: 'coreProduct',
  公司规模: 'scale',
  员工规模: 'scale',
  员工人数: 'scale',
  企业主页: 'website',
  官网: 'website',
  上市情况: 'listingStatus',
  上市地: 'listingVenue',
  股票代号: 'stockCode',
  股票代码: 'stockCode',
  融资情况: 'funding',
  融资轮次: 'funding',
  估值: 'valuation',
  '估值/市值': 'valuation',
  办公地址: 'address',
  总部所在地: 'address',
  总部位置: 'address',
  地址: 'address',
  位置: 'address',
  开源仓库: 'openSource',
  财报: 'financialReport',
  技术架构: 'techStack',
  技术特点: 'techStack',
  核心技术: 'techStack',
  盈利模式: 'revenueModel',
  社交媒体: 'socialMedia',
  员工口碑: 'employeeRating',
  法律风险: 'legalRisk',
  所属集团: 'parent',
  // 档案式清单（#### 公司名 + 「- 键：值」）用的叫法与表头略有出入。
  所属公司: 'parent',
  主管单位: 'parent',
  官方网站: 'website',
  机构名称: 'name',
  核心研究方向: 'businessArea',
  研究领域: 'businessArea',
};

/** 档案式清单里 **「小节名」** → 字段：这些小节是条目列表而非"键：值"。 */
export const PROFILE_SECTION_BY_LABEL = {
  核心业务: 'products',
  核心产品: 'products',
  主要成果: 'products',
  研究成果: 'products',
  核心研究方向: 'businessArea',
  核心研究方向: 'businessArea',
  核心职能: 'businessArea',
  技术优势: 'techStack',
};

/**
 * 结构性小节名和语料元数据。它们出现在档案里，但不是企业属性，
 * 不算"数据被丢弃"，因此不进未映射字段诊断（实测档案式清单 275 份，
 * 每份第一小节都叫「基本信息」）。
 */
export const IGNORED_PROFILE_LABELS = [
  '基本信息',
  '概述',
  '简介',
  '信息更新时间',
  '更新时间',
  '数据截止日期',
];

/** 城市后缀写进表头的情形，例如"广州办公地址""上海办公地址"。 */
const CITY_ADDRESS_RE = /^([\u4e00-\u9fa5]{2,4})办公地址$/;

/**
 * 含这些列的表格是按维度计数的汇总表（例如"公司规模 | 企业数量 | 企业名称"），
 * 不是企业清单。它们的"企业名称"列往往塞了多家公司的并列，必须整体跳过。
 */
export const AGGREGATE_MARKERS = ['企业数量', '占比', '排名'];

export function headerToField(header) {
  const key = header.replace(/\s|　/g, '');
  if (FIELD_BY_HEADER[key]) return FIELD_BY_HEADER[key];
  const city = key.match(CITY_ADDRESS_RE);
  return city ? 'address' : null;
}

/**
 * 表头 → 字段下标。返回 { map, fields, dropped, aggregate }。
 * fields 为空表示这张表没有企业名称列，调用方直接跳过。
 */
export function resolveHeaders(cells) {
  const map = {};
  const fields = [];
  const dropped = [];
  let aggregate = false;

  cells.forEach((raw, i) => {
    const header = raw.replace(/\s|　/g, '');
    if (AGGREGATE_MARKERS.includes(header)) aggregate = true;
    const field = headerToField(header);
    if (field) {
      if (map[field] === undefined) map[field] = i;
      if (!fields.includes(field)) fields.push(field);
    } else if (header && header !== '-') {
      dropped.push(header);
    }
  });

  return { map, fields, dropped, aggregate, named: fields.includes('name') };
}
