/**
 * 行业词表。
 *
 * 名称取自语料自身：对 industry/*.md 的 H1 标题做统计后取多数写法。
 * 例如 biotech 的标题 6 次写"生物技术"、1 次写"生物医药"，因此 canonical 是生物技术；
 * 此前 app 与 console 各取一种，同一 slug 在两个界面上显示成不同行业。
 */

export const INDUSTRIES = {
  '3c': { name: '3C电子', color: '#FF8FAB' },
  ai: { name: '人工智能', color: '#B79CED' },
  aerospace: { name: '商业航天', color: '#8FB8F0' },
  agritech: { name: '农业科技', color: '#A8E0A0' },
  arvr: { name: 'AR/VR', color: '#D9A6F0' },
  automation: { name: '工业自动化', color: '#7FB5E8' },
  battery: { name: '电池储能', color: '#FFC66B' },
  bigdata: { name: '大数据', color: '#7FD8BE' },
  biotech: { name: '生物技术', color: '#F9A1BC' },
  blockchain: { name: '区块链', color: '#9AC8FF' },
  cloud: { name: '云计算', color: '#89CFF0' },
  cybersecurity: { name: '网络安全', color: '#C0A6F5' },
  'digital-twin': { name: '数字孪生', color: '#9AD9E8' },
  drone: { name: '无人机', color: '#8AD8C8' },
  ecommerce: { name: '电子商务', color: '#FFAFA0' },
  'edge-computing': { name: '边缘计算', color: '#A6C8FF' },
  edutech: { name: '教育科技', color: '#FFD6A5' },
  'entertainment-tech': { name: '娱乐科技', color: '#F5A6D9' },
  ev: { name: '新能源汽车', color: '#7EDE9F' },
  fintech: { name: '金融科技', color: '#FFB36B' },
  healthtech: { name: '健康科技', color: '#9EE0C0' },
  internet: { name: '互联网', color: '#FF9E9E' },
  iot: { name: '物联网', color: '#9EE6C9' },
  logistics: { name: '物流科技', color: '#B0C4DE' },
  'new-energy': { name: '新能源', color: '#B5E48C' },
  'new-materials': { name: '新材料', color: '#F4B8D0' },
  quantum: { name: '量子科技', color: '#C9A7EB' },
  robotics: { name: '机器人', color: '#FFB5A7' },
  security: { name: 'IT安全', color: '#F49E8C' },
  semiconductor: { name: '半导体', color: '#A3C4F3' },
  'smart-manufacturing': { name: '智能制造', color: '#93D3E8' },
  smartcity: { name: '智慧城市', color: '#9EC9E0' },
  software: { name: '软件', color: '#B8B5FF' },
  'sports-tech': { name: '体育科技', color: '#FFCE85' },
  'tech-innovation': { name: '科技创新', color: '#FFD6A5' },
  web3: { name: 'Web3/元宇宙', color: '#D5A6F0' },
};

/**
 * 文件名里出现过的写法 → 规范 slug。
 * 语料内部同义 slug 在此折叠，而不是让每个消费方各自决定显示名。
 */
export const INDUSTRY_ALIASES = {
  airenewable: 'new-energy',
  biomedical: 'biotech',
  biopharma: 'biotech',
  chip: 'semiconductor',
  energy: 'new-energy',
  innovation: 'tech-innovation',
  'internet-100': 'internet',
  materials: 'new-materials',
  medtech: 'healthtech',
  securityservices: 'cybersecurity',
  software: 'software',
  'software-100': 'software',
  'smart-city': 'smartcity',
};

export function resolveIndustry(slug) {
  if (!slug) return null;
  const key = slug.toLowerCase();
  const canonical = INDUSTRIES[key] ? key : INDUSTRY_ALIASES[key];
  return canonical ? { slug: canonical, ...INDUSTRIES[canonical] } : null;
}

/** 展示名。未登记的 slug 原样返回，同时由 build 的诊断项暴露出来。 */
export function industryName(slug) {
  const hit = resolveIndustry(slug);
  return hit ? hit.name : slug || null;
}

export function industryColor(slug) {
  const hit = resolveIndustry(slug);
  return hit ? hit.color : '#B0BEC5';
}

export const INDUSTRY_OPTIONS = Object.entries(INDUSTRIES)
  .map(([id, { name, color }]) => ({ id, name, color }))
  .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
