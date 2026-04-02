#!/usr/bin/env node
/**
 * 生成企业数据 JSON
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../..');
const OUTPUT_DIR = path.join(__dirname, '../public/data');

// 城市映射
const CITY_MAP = {
  'beijing': '北京', 'shanghai': '上海', 'shenzhen': '深圳', 'guangzhou': '广州',
  'hangzhou': '杭州', 'nanjing': '南京', 'suzhou': '苏州', 'chengdu': '成都',
  'wuhan': '武汉', 'xian': '西安', 'qingdao': '青岛', 'tianjin': '天津',
  'chongqing': '重庆', 'changsha': '长沙', 'hefei': '合肥', 'jinan': '济南',
  'xiamen': '厦门', 'harbin': '哈尔滨', 'shenyang': '沈阳', 'kunming': '昆明',
  'wuxi': '无锡', 'changzhou': '常州', 'hongkong': '香港', 'macau': '澳门', 
  'lhasa': '拉萨', 'hainan': '海南', 'wuhu': '芜湖',
};

// 行业映射
const INDUSTRY_MAP = {
  'ai': '人工智能',
  'bigdata': '大数据',
  'blockchain': '区块链',
  'iot': '物联网',
  'smart-manufacturing': '智能制造',
  'new-energy': '新能源',
  'new-materials': '新材料',
  'biotech': '生物技术',
  'biomedical': '生物医药',
  '3c': '3C电子',
  'cloud': '云计算',
  'security': '网络安全',
  'cybersecurity': '网络安全',
  'internet': '互联网',
  'software': '软件',
  'ev': '新能源汽车',
  'automation': '工业自动化',
  'battery': '动力电池',
  'drone': '无人机',
  'aerospace': '航空航天',
  'fintech': '金融科技',
  'edutech': '教育科技',
  'healthtech': '健康科技',
  'arvr': 'AR/VR',
  'quantum': '量子计算',
  'ecommerce': '电子商务',
  'logistics': '物流科技',
  'entertainment': '娱乐科技',
  'sports': '体育科技',
  'digital-twin': '数字孪生',
  'edge-computing': '边缘计算',
  'agritech': '农业科技',
  'smartcity': '智慧城市',
  'web3': 'Web3',
  'semiconductor': '半导体',
  'chip': '芯片',
  'robotics': '机器人',
  'airenewable': '新能源',
};

// 特殊行业映射
const SPECIAL_INDUSTRY_MAP = {
  'tech-innovation': '科技创新',
  'internet-100': '互联网百强',
  'software-100': '软件百强',
  'ai-general': '人工智能',
};

function extractCity(filename) {
  const match = filename.match(/-([a-z0-9-]+)\.md$/i);
  return match ? (CITY_MAP[match[1].toLowerCase()] || match[1]) : '';
}

function extractIndustry(filename) {
  const basename = path.basename(filename, '.md');
  
  // 检查特殊映射
  if (SPECIAL_INDUSTRY_MAP[basename]) {
    return SPECIAL_INDUSTRY_MAP[basename];
  }
  
  // 提取前缀
  const prefix = basename.split('-')[0].toLowerCase();
  return INDUSTRY_MAP[prefix] || '';
}

function parseTableLine(line, headers) {
  const cells = line.split('|').map(c => c.trim()).filter(c => c && !c.includes('---'));
  if (cells.length < headers.length) return null;
  
  const row = {};
  headers.forEach((h, i) => {
    row[h] = cells[i] || '';
  });
  return row;
}

function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const companies = [];
  
  const filename = path.basename(filePath);
  const fileCity = extractCity(filename);
  const fileIndustry = extractIndustry(filename);
  
  let headers = [];
  let inTable = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.includes('企业名称') && trimmed.startsWith('|')) {
      headers = trimmed.split('|').map(h => h.trim()).filter(h => h);
      inTable = true;
      continue;
    }
    
    if (trimmed.match(/^\|[\s\-:|]+\|$/)) {
      continue;
    }
    
    if (inTable && trimmed.startsWith('|')) {
      const row = parseTableLine(trimmed, headers);
      if (row && row['企业名称'] && !row['企业名称'].includes('---')) {
        const name = row['企业名称'];
        const city = row['城市'] || row['总部城市'] || fileCity;
        const industry = row['行业'] || row['行业领域'] || fileIndustry;
        
        // 生成唯一ID
        const id = `${filename}-${name}`.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-').slice(0, 100);
        
        companies.push({
          id,
          name,
          alias: row['简称'] || '',
          foundedYear: row['成立时间'] || '',
          businessArea: row['业务领域'] || '',
          products: row['代表产品/服务'] || '',
          scale: row['公司规模'] || '',
          website: row['企业主页'] || '',
          listingStatus: row['上市情况'] || '',
          funding: row['融资情况'] || '',
          revenueModel: row['盈利模式'] || '',
          coreProduct: row['核心产品'] || '',
          address: row['办公地址'] || '',
          socialMedia: row['社交媒体'] || '',
          openSource: row['开源仓库'] || '',
          techStack: row['技术架构'] || row['主要技术架构'] || '',
          employeeRating: row['员工口碑'] || '',
          legalRisk: row['法律风险'] || '',
          financialReport: row['财报'] || '',
          city,
          industry,
          sourceFile: filename,
        });
      }
    } else if (inTable && trimmed === '') {
      inTable = false;
      headers = [];
    }
  }
  
  return companies;
}

function main() {
  console.log('🚀 Generating data...\n');
  
  const allCompanies = [];
  const files = fs.readdirSync(path.join(DATA_DIR, 'industry'))
    .filter(f => f.endsWith('.md'));
  
  console.log(`Found ${files.length} files in industry/`);
  
  for (const file of files) {
    const filePath = path.join(DATA_DIR, 'industry', file);
    const companies = parseMarkdownFile(filePath);
    allCompanies.push(...companies);
  }
  
  console.log(`Parsed ${allCompanies.length} companies`);
  
  // 生成统计
  const stats = {
    totalCompanies: allCompanies.length,
    cityDistribution: {},
    industryDistribution: {},
    scaleDistribution: {},
  };
  
  for (const c of allCompanies) {
    if (c.city) stats.cityDistribution[c.city] = (stats.cityDistribution[c.city] || 0) + 1;
    if (c.industry) stats.industryDistribution[c.industry] = (stats.industryDistribution[c.industry] || 0) + 1;
    if (c.scale) stats.scaleDistribution[c.scale] = (stats.scaleDistribution[c.scale] || 0) + 1;
  }
  
  // 转换为数组格式
  const formattedStats = {
    totalCompanies: stats.totalCompanies,
    cityDistribution: Object.entries(stats.cityDistribution)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value),
    industryDistribution: Object.entries(stats.industryDistribution)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value),
    scaleDistribution: Object.entries(stats.scaleDistribution)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value),
  };
  
  // 筛选选项
  const filterOptions = {
    cities: Object.keys(stats.cityDistribution).sort(),
    industries: Object.keys(stats.industryDistribution).sort(),
    scales: Object.keys(stats.scaleDistribution).sort(),
    listingStatus: ['已上市', '未上市', 'IPO暂停', '多轮', '科创板', '港交所', '深交所', '纳斯达克', '纽交所'],
  };
  
  // 搜索索引
  const searchIndex = {
    companies: allCompanies.map(c => ({
      id: c.id,
      name: c.name,
      alias: c.alias,
      city: c.city,
      industry: c.industry,
      businessArea: c.businessArea,
      products: c.products,
    })),
  };
  
  // 保存文件
  fs.writeFileSync(path.join(OUTPUT_DIR, 'companies.json'), JSON.stringify(allCompanies));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'stats.json'), JSON.stringify(formattedStats));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'filter-options.json'), JSON.stringify(filterOptions));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'search-index.json'), JSON.stringify(searchIndex));
  
  console.log('\n✅ Data generated!');
  console.log(`  - companies.json: ${allCompanies.length} records`);
  console.log(`  - cities: ${filterOptions.cities.length}`);
  console.log(`  - industries: ${filterOptions.industries.length}`);
  console.log(`  - Top city: ${formattedStats.cityDistribution[0]?.name} (${formattedStats.cityDistribution[0]?.value})`);
  console.log(`  - Top industry: ${formattedStats.industryDistribution[0]?.name} (${formattedStats.industryDistribution[0]?.value})`);
}

main();
