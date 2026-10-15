/**
 * 城市词表。
 *
 * 城市来自文件名后缀（ai-shenzhen.md → 深圳）。漏一个后缀会让那批记录的
 * city 变成 null —— 已上线的 console 数据里 106 条空城市就是这么来的，
 * 因为它的 CITY_MAP 缺 dalian / fuzhou / ningbo。本表按语料实际后缀补全。
 */

export const CITY_BY_SLUG = {
  beijing: '北京', shanghai: '上海', shenzhen: '深圳', guangzhou: '广州',
  hangzhou: '杭州', nanjing: '南京', suzhou: '苏州', chengdu: '成都',
  wuhan: '武汉', xian: '西安', qingdao: '青岛', tianjin: '天津',
  chongqing: '重庆', changsha: '长沙', hefei: '合肥', jinan: '济南',
  xiamen: '厦门', harbin: '哈尔滨', shenyang: '沈阳', kunming: '昆明',
  wuxi: '无锡', changzhou: '常州', hongkong: '香港', macau: '澳门',
  lhasa: '拉萨', hainan: '海南', wuhu: '芜湖', guiyang: '贵阳',
  dalian: '大连', fuzhou: '福州', ningbo: '宁波',
};

export const CITY_TIERS = {
  tier1: ['北京', '上海', '深圳', '广州'],
  newTier1: ['杭州', '南京', '苏州', '成都', '武汉', '西安', '重庆', '天津'],
  tier2: ['青岛', '长沙', '合肥', '济南', '厦门', '无锡', '常州', '哈尔滨', '沈阳', '昆明', '大连', '宁波', '福州', '贵阳'],
  special: ['香港', '澳门'],
};

/** 文件名后缀 → 中文城市名。识别不到返回 null，由调用方记录诊断而不是静默吞掉。 */
export function cityFromFilename(filename) {
  const basename = filename.replace(/\.md$/i, '');
  const parts = basename.split('-');
  for (let i = parts.length - 1; i >= 0; i--) {
    const name = CITY_BY_SLUG[parts[i].toLowerCase()];
    if (name) return name;
  }
  return null;
}

/** 去掉城市后缀得到行业 slug：ai-shenzhen → ai，agritech → agritech。 */
export function industryFromFilename(filename) {
  const basename = filename.replace(/\.md$/i, '');
  const parts = basename.split('-');
  const last = parts[parts.length - 1].toLowerCase();
  return CITY_BY_SLUG[last] && parts.length > 1 ? parts.slice(0, -1).join('-') : basename;
}

export function cityTier(city) {
  if (CITY_TIERS.tier1.includes(city)) return '一线城市';
  if (CITY_TIERS.newTier1.includes(city)) return '新一线城市';
  if (CITY_TIERS.special.includes(city)) return '特别行政区';
  if (CITY_TIERS.tier2.includes(city)) return '二线城市';
  return '其他城市';
}

/**
 * 城市的第二种写法：跨国清单用英文后缀（"ASML Shanghai""Ericsson AB Guangzhou"），
 * 只认中文名会让同一母公司在上海、广州各算一家（实测 311 条里有 146 条是 60 个母体）。
 * 英文写法直接由 slug 首字母大写得到，不再维护第二张表。
 */
export const CITY_TOKENS = Object.entries(CITY_BY_SLUG).flatMap(([slug, name]) => {
  const en = slug[0].toUpperCase() + slug.slice(1);
  return en === name ? [{ token: name, city: name }] : [{ token: name, city: name }, { token: en, city: name }];
});

/** 长 token 优先，避免"哈尔滨"被"哈尔"截断式匹配。按长度倒序。 */
export const CITY_TOKENS_BY_LENGTH = [...CITY_TOKENS].sort((a, b) => b.token.length - a.token.length);

export function tokenToCity(text) {
  const hit = CITY_TOKENS_BY_LENGTH.find((t) => text.includes(t.token));
  return hit ? hit.city : null;
}

/** 文本是否提到这座城市（中英文任一写法即可）。 */
export function mentionsCity(text, city) {
  if (!text || !city) return false;
  return CITY_TOKENS.some((t) => t.city === city && text.includes(t.token));
}
