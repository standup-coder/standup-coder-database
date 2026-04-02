// 常量定义

export const APP_NAME = 'Standup Coder Database';
export const APP_VERSION = '1.0.0';

// 导航菜单
export const NAV_ITEMS = [
  { key: 'home', label: '首页', path: '/' },
  { key: 'companies', label: '企业查询', path: '/companies' },
  { key: 'jobs', label: '岗位查询', path: '/jobs' },
  { key: 'rankings', label: '榜单浏览', path: '/rankings' },
  { key: 'analytics', label: '数据分析', path: '/analytics' },
];

// 企业规模映射
export const SCALE_MAP: Record<string, { label: string; order: number }> = {
  '10000+人': { label: '大型企业', order: 5 },
  '5000-10000人': { label: '大中型企业', order: 4 },
  '1000-5000人': { label: '中型企业', order: 3 },
  '500-1000人': { label: '中小型企业', order: 2 },
  '100-500人': { label: '小型企业', order: 1 },
  '<100人': { label: '微型企业', order: 0 },
};

// 行业图标映射
export const INDUSTRY_ICONS: Record<string, string> = {
  '人工智能': '🤖',
  '大数据': '📊',
  '区块链': '⛓️',
  '物联网': '🌐',
  '智能制造': '🏭',
  '新能源': '⚡',
  '新材料': '🔬',
  '生物技术': '🧬',
  '3C电子': '📱',
  '云计算': '☁️',
  '网络安全': '🔒',
  '互联网': '🌍',
  '软件': '💻',
  '半导体': '🔌',
};

// 城市分组
export const CITY_GROUPS = {
  '一线城市': ['北京', '上海', '深圳', '广州'],
  '新一线': ['杭州', '南京', '苏州', '成都', '武汉', '西安'],
  '其他': ['青岛', '天津', '重庆', '长沙', '合肥', '济南', '厦门'],
};

// 分页配置
export const PAGINATION_CONFIG = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
};

// 颜色配置
export const CHART_COLORS = [
  '#1677ff',
  '#52c41a',
  '#faad14',
  '#f5222d',
  '#722ed1',
  '#13c2c2',
  '#eb2f96',
  '#fadb14',
];
