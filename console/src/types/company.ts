// 企业类型定义

export interface Company {
  id: string;
  name: string;              // 企业名称
  alias: string;             // 简称
  foundedYear: string;       // 成立时间
  businessArea: string;      // 业务领域
  products: string;          // 代表产品/服务
  scale: string;             // 公司规模
  website: string;           // 企业主页
  listingStatus: string;     // 上市情况
  funding: string;           // 融资情况
  revenueModel: string;      // 盈利模式
  coreProduct: string;       // 核心产品
  address: string;           // 办公地址
  socialMedia: string;       // 社交媒体
  openSource: string;        // 开源仓库
  techStack: string;         // 技术架构
  employeeRating: string;    // 员工口碑
  legalRisk: string;         // 法律风险
  financialReport: string;   // 财报
  
  // 派生字段
  city: string;              // 所属城市（从文件路径解析）
  industry: string;          // 所属行业（从文件路径解析）
  sourceFile: string;        // 源文件路径
}

export interface CompanyQuery {
  keyword?: string;
  cities?: string[];
  industries?: string[];
  scales?: string[];
  listingStatus?: string[];
  businessAreas?: string[];
  sortBy?: 'name' | 'founded' | 'scale';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface CompanyFilterOptions {
  cities: string[];
  industries: string[];
  scales: string[];
  listingStatus: string[];
  businessAreas: string[];
}

// 企业规模等级
export const SCALE_LEVELS = [
  { value: '10000+', label: '大型企业 (10000+人)', order: 4 },
  { value: '5000-10000', label: '大中型企业 (5000-10000人)', order: 3 },
  { value: '1000-5000', label: '中型企业 (1000-5000人)', order: 2 },
  { value: '500-1000', label: '中小型企业 (500-1000人)', order: 1 },
  { value: '100-500', label: '小型企业 (100-500人)', order: 0 },
  { value: '<100', label: '微型企业 (<100人)', order: -1 },
];

// 行业列表
export const INDUSTRIES = [
  '人工智能',
  '大数据',
  '区块链',
  '物联网',
  '智能制造',
  '新能源',
  '新材料',
  '生物技术',
  '3C电子',
  '云计算',
  '网络安全',
  '互联网',
  '软件',
  '半导体',
  '新能源汽车',
  '自动化',
  '电池',
  '无人机',
];

// 城市列表
export const CITIES = [
  '北京',
  '上海',
  '深圳',
  '广州',
  '杭州',
  '南京',
  '苏州',
  '成都',
  '武汉',
  '西安',
  '青岛',
  '天津',
  '重庆',
  '长沙',
  '合肥',
  '济南',
  '厦门',
  '哈尔滨',
  '沈阳',
  '昆明',
  '无锡',
  '常州',
  '香港',
  '澳门',
  '拉萨',
];
