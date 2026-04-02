#!/usr/bin/env node
/**
 * 生成岗位数据 JSON
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../..');
const OUTPUT_DIR = path.join(__dirname, '../public/data');

// 岗位类别映射
const JOB_CATEGORIES = {
  'frontend-developer': { category: '前端开发', icon: '💻' },
  'backend-developer': { category: '后端开发', icon: '⚙️' },
  'fullstack-developer': { category: '全栈开发', icon: '🌐' },
  'development-fullstack': { category: '全栈开发', icon: '🌐' },
  'mobile-developer': { category: '移动开发', icon: '📱' },
  'game-developer': { category: '游戏开发', icon: '🎮' },
  'embedded-developer': { category: '嵌入式开发', icon: '🔧' },
  'data-engineer': { category: '数据工程', icon: '📊' },
  'data-scientist': { category: '数据科学', icon: '🔬' },
  'data-analyst': { category: '数据分析', icon: '📈' },
  'data-analytics': { category: '数据分析', icon: '📈' },
  'ml-engineer': { category: '机器学习', icon: '🤖' },
  'ai-machinelearning': { category: '机器学习', icon: '🤖' },
  'ai-algorithm-engineer': { category: 'AI算法', icon: '🧠' },
  'deep-learning-engineer': { category: '深度学习', icon: '🧠' },
  'computer-vision-engineer': { category: '计算机视觉', icon: '👁️' },
  'nlp-engineer': { category: '自然语言处理', icon: '💬' },
  'devops-engineer': { category: 'DevOps', icon: '🚀' },
  'sre-engineer': { category: 'SRE', icon: '🔒' },
  'cloud-engineer': { category: '云计算', icon: '☁️' },
  'system-architect': { category: '系统架构', icon: '🏗️' },
  'network-engineer': { category: '网络工程', icon: '🌐' },
  'security-ops-engineer': { category: '安全运维', icon: '🛡️' },
  'dba': { category: '数据库管理', icon: '🗄️' },
  'bi-engineer': { category: 'BI工程', icon: '📊' },
  'tech-manager': { category: '技术管理', icon: '👨‍💼' },
  // 新增岗位
  'product-manager': { category: '产品经理', icon: '📋' },
  'ui-ux-designer': { category: 'UI/UX设计', icon: '🎨' },
  'qa-engineer': { category: '测试工程', icon: '🧪' },
  'bigdata-developer': { category: '大数据开发', icon: '📊' },
  'blockchain-developer': { category: '区块链开发', icon: '⛓️' },
  'recommendation-engineer': { category: '推荐算法', icon: '⭐' },
  'technical-writer': { category: '技术写作', icon: '✍️' },
  'scrum-master': { category: '敏捷教练', icon: '🏃' },
};

function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const filename = path.basename(filePath, '.md');
  const config = JOB_CATEGORIES[filename] || { category: '其他', icon: '💼' };
  
  const job = {
    id: filename,
    title: '',
    category: config.category,
    icon: config.icon,
    locations: [],
    salaryMin: 0,
    salaryMax: 0,
    responsibilities: [],
    requirements: [],
    skills: [],
    experience: '',
    education: '',
  };
  
  let section = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // 解析标题
    if (trimmed.startsWith('# ') && !job.title) {
      job.title = trimmed.replace('# ', '').replace('职位描述(JD)', '').trim();
      continue;
    }
    
    // 解析基本信息
    if (trimmed.startsWith('- **岗位名称**')) {
      const match = trimmed.match(/：(.+?)(?:\(|$)/);
      if (match && !job.title) {
        job.title = match[1].trim();
      }
    }
    
    if (trimmed.startsWith('- **工作地点**')) {
      const match = trimmed.match(/：(.+)/);
      if (match) {
        job.locations = match[1].split(/[\/、,]/).map(l => l.trim()).filter(l => l);
      }
    }
    
    if (trimmed.startsWith('- **薪资范围**')) {
      const match = trimmed.match(/(\d+)K?\s*-\s*(\d+)K?/);
      if (match) {
        job.salaryMin = parseInt(match[1]);
        job.salaryMax = parseInt(match[2]);
      }
    }
    
    if (trimmed.startsWith('- **学历要求**')) {
      const match = trimmed.match(/：(.+)/);
      if (match) {
        job.education = match[1].trim();
      }
    }
    
    // 识别章节
    if (trimmed.startsWith('## ')) {
      const sectionName = trimmed.replace('## ', '').trim();
      if (sectionName.includes('职责')) section = 'responsibilities';
      else if (sectionName.includes('要求') || sectionName.includes('技能')) section = 'requirements';
      else section = '';
      continue;
    }
    
    // 解析列表项
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const item = trimmed.replace(/^[-*]\s*/, '').trim();
      if (item && section === 'responsibilities') {
        job.responsibilities.push(item);
      } else if (item && section === 'requirements') {
        job.requirements.push(item);
      }
    }
    
    // 提取技能关键词
    if (trimmed.includes('React') || trimmed.includes('Vue') || trimmed.includes('Angular')) {
      job.skills = [...new Set([...job.skills, 'React', 'Vue', 'Angular'])];
    }
    if (trimmed.includes('Java') && !trimmed.includes('JavaScript')) {
      job.skills = [...new Set([...job.skills, 'Java'])];
    }
    if (trimmed.includes('Python')) {
      job.skills = [...new Set([...job.skills, 'Python'])];
    }
    if (trimmed.includes('Go') || trimmed.includes('Golang')) {
      job.skills = [...new Set([...job.skills, 'Go'])];
    }
    if (trimmed.includes('Kubernetes') || trimmed.includes('K8s')) {
      job.skills = [...new Set([...job.skills, 'Kubernetes'])];
    }
    if (trimmed.includes('Docker')) {
      job.skills = [...new Set([...job.skills, 'Docker'])];
    }
    if (trimmed.includes('MySQL') || trimmed.includes('PostgreSQL')) {
      job.skills = [...new Set([...job.skills, 'SQL'])];
    }
    if (trimmed.includes('Redis')) {
      job.skills = [...new Set([...job.skills, 'Redis'])];
    }
    if (trimmed.includes('Kafka')) {
      job.skills = [...new Set([...job.skills, 'Kafka'])];
    }
  }
  
  // 根据岗位类别补充默认技能
  if (job.skills.length === 0) {
    switch (job.category) {
      case '前端开发':
        job.skills = ['React', 'Vue', 'TypeScript', 'HTML/CSS'];
        break;
      case '后端开发':
        job.skills = ['Java', 'Go', 'Python', 'MySQL', 'Redis'];
        break;
      case '移动开发':
        job.skills = ['iOS', 'Android', 'Flutter', 'React Native'];
        break;
      case 'AI算法':
        job.skills = ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning'];
        break;
      case 'DevOps':
        job.skills = ['Kubernetes', 'Docker', 'CI/CD', 'AWS'];
        break;
      case '数据工程':
        job.skills = ['Python', 'Spark', 'Flink', 'Hadoop'];
        break;
      case 'SRE':
        job.skills = ['Linux', 'Kubernetes', 'Prometheus', 'Terraform'];
        break;
      default:
        job.skills = ['Java', 'Python', 'SQL'];
    }
  }
  
  // 默认薪资范围
  if (job.salaryMin === 0) {
    switch (job.category) {
      case 'AI算法':
      case '深度学习':
        job.salaryMin = 30; job.salaryMax = 80;
        break;
      case '系统架构':
      case '技术管理':
        job.salaryMin = 40; job.salaryMax = 100;
        break;
      case '后端开发':
      case '全栈开发':
        job.salaryMin = 20; job.salaryMax = 55;
        break;
      case '前端开发':
      case '移动开发':
        job.salaryMin = 15; job.salaryMax = 45;
        break;
      default:
        job.salaryMin = 20; job.salaryMax = 50;
    }
  }
  
  // 默认工作地点
  if (job.locations.length === 0) {
    job.locations = ['北京', '上海', '深圳', '杭州'];
  }
  
  return job;
}

function main() {
  console.log('🚀 Generating jobs data...\n');
  
  const jobsDir = path.join(DATA_DIR, 'jobs');
  if (!fs.existsSync(jobsDir)) {
    console.error('Error: jobs directory not found');
    return;
  }
  
  const files = fs.readdirSync(jobsDir).filter(f => f.endsWith('.md'));
  console.log(`Found ${files.length} job files`);
  
  const allJobs = [];
  const categories = {};
  
  for (const file of files) {
    const filePath = path.join(jobsDir, file);
    const job = parseMarkdownFile(filePath);
    
    if (job.title) {
      allJobs.push(job);
      
      // 统计类别
      if (!categories[job.category]) {
        categories[job.category] = { count: 0, jobs: [] };
      }
      categories[job.category].count++;
      categories[job.category].jobs.push(job.title);
    }
  }
  
  console.log(`\nParsed ${allJobs.length} jobs`);
  console.log('\nCategories:');
  for (const [cat, data] of Object.entries(categories)) {
    console.log(`  ${cat}: ${data.count} 个岗位`);
  }
  
  // 生成筛选选项
  const filterOptions = {
    categories: Object.keys(categories).sort(),
    locations: ['北京', '上海', '深圳', '杭州', '广州', '成都', '武汉', '西安', ' remote', '远程'],
    experience: ['应届生', '1-3年', '3-5年', '5-8年', '8年以上'],
  };
  
  const result = {
    total: allJobs.length,
    categories: Object.entries(categories).map(([name, data]) => ({
      name,
      count: data.count,
    })),
    jobs: allJobs,
    filterOptions,
  };
  
  // 保存文件
  fs.writeFileSync(path.join(OUTPUT_DIR, 'jobs.json'), JSON.stringify(result, null, 2));
  
  console.log('\n✅ Jobs data generated!');
  console.log(`  - jobs.json: ${allJobs.length} jobs`);
}

main();
