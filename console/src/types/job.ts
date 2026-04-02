// 岗位类型定义

export interface Job {
  id: string;
  title: string;             // 岗位名称
  category: string;          // 岗位类别
  workType: string;          // 工作性质
  locations: string[];       // 工作地点
  salaryMin: number;         // 最低薪资(K)
  salaryMax: number;         // 最高薪资(K)
  
  // 职责
  responsibilities: string[];
  
  // 要求
  requiredSkills: string[];
  experienceMin: number;
  experienceMax: number;
  education: string;
  
  // 加分项
  bonusSkills: string[];
  
  // 福利
  benefits: string[];
  
  // 发展
  careerPath: string[];
  
  // 技术栈
  techStack: {
    frameworks: string[];
    tools: string[];
    platforms: string[];
  };
  
  // 真实案例
  realCases?: JobCase[];
  
  sourceFile: string;
}

export interface JobCase {
  company: string;
  companySize: string;
  salaryRange: string;
  requirements: string[];
  highlights: string[];
}

export interface JobQuery {
  keyword?: string;
  categories?: string[];
  locations?: string[];
  salaryMin?: number;
  salaryMax?: number;
  experience?: string[];
  skills?: string[];
  page?: number;
  pageSize?: number;
}

// 岗位类别
export const JOB_CATEGORIES = [
  '前端开发',
  '后端开发',
  '移动开发',
  '全栈开发',
  '游戏开发',
  '嵌入式开发',
  '数据工程师',
  '数据科学家',
  '数据分析师',
  '机器学习工程师',
  'BI工程师',
  '数据库管理员',
  'AI算法工程师',
  '深度学习工程师',
  '计算机视觉工程师',
  '自然语言处理工程师',
  'DevOps工程师',
  '云计算工程师',
  '系统架构师',
  'SRE工程师',
  '网络工程师',
  '安全运维工程师',
  '技术经理',
];

// 经验要求
export const EXPERIENCE_LEVELS = [
  { value: 'junior', label: '初级 (1-3年)', min: 1, max: 3 },
  { value: 'mid', label: '中级 (3-5年)', min: 3, max: 5 },
  { value: 'senior', label: '高级 (5-8年)', min: 5, max: 8 },
  { value: 'expert', label: '专家 (8年+)', min: 8, max: 20 },
];
