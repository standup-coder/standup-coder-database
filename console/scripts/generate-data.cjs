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

// 城市等级
const CITY_TIERS = {
  'tier1': ['北京', '上海', '深圳', '广州'],
  'newTier1': ['杭州', '南京', '苏州', '成都', '武汉', '西安', '重庆', '天津'],
  'tier2': ['青岛', '长沙', '合肥', '济南', '厦门', '无锡', '常州', '哈尔滨', '沈阳', '昆明'],
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
        
        // 跳过无效企业名称（如汇总表格中的 '-' 或多企业名称）
        if (name === '-' || name === '' || name.includes('、') || name.includes('，')) {
          continue;
        }
        
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
    listingDistribution: {},
    foundedYearDistribution: {},
    cityTierDistribution: { '一线城市': 0, '新一线城市': 0, '其他城市': 0 },
  };
  
  // 上市情况分类
  function classifyListing(status) {
    if (!status || status === '-') return '未披露';
    if (status.includes('上市') || status.includes('交所') || status.includes('交所')) {
      if (status.includes('上交所') || status.includes('600') || status.includes('601') || status.includes('603') || status.includes('605') || status.includes('688')) return '上交所';
      if (status.includes('深交所') || status.includes('000') || status.includes('002') || status.includes('300')) return '深交所';
      if (status.includes('港交所') || status.includes('HKEX')) return '港交所';
      if (status.includes('纳斯达克') || status.includes('NASDAQ')) return '纳斯达克';
      if (status.includes('纽交所') || status.includes('NYSE')) return '纽交所';
      if (status.includes('科创板')) return '科创板';
      if (status.includes('新三板')) return '新三板';
      if (status.includes('北交所')) return '北交所';
      if (status.includes('创业板')) return '创业板';
      return '其他上市';
    }
    if (status.includes('私有') || status.includes('私人') || status.includes('私募')) return '私有公司';
    return '未上市';
  }
  
  // 城市等级分类
  function getCityTier(city) {
    if (CITY_TIERS.tier1.includes(city)) return '一线城市';
    if (CITY_TIERS.newTier1.includes(city)) return '新一线城市';
    return '其他城市';
  }
  
  // 解析成立年份
  function parseFoundedYear(yearStr) {
    if (!yearStr || yearStr === '-') return null;
    const match = yearStr.match(/(\d{4})/);
    return match ? parseInt(match[1]) : null;
  }
  
  for (const c of allCompanies) {
    // 基础分布
    if (c.city) stats.cityDistribution[c.city] = (stats.cityDistribution[c.city] || 0) + 1;
    if (c.industry) stats.industryDistribution[c.industry] = (stats.industryDistribution[c.industry] || 0) + 1;
    if (c.scale) stats.scaleDistribution[c.scale] = (stats.scaleDistribution[c.scale] || 0) + 1;
    
    // 上市情况
    const listingType = classifyListing(c.listingStatus);
    stats.listingDistribution[listingType] = (stats.listingDistribution[listingType] || 0) + 1;
    
    // 城市等级
    if (c.city) {
      const tier = getCityTier(c.city);
      stats.cityTierDistribution[tier] = (stats.cityTierDistribution[tier] || 0) + 1;
    }
    
    // 成立年份（按年代分组）
    const year = parseFoundedYear(c.foundedYear);
    if (year) {
      let decade;
      if (year >= 2020) decade = '2020s';
      else if (year >= 2010) decade = '2010s';
      else if (year >= 2000) decade = '2000s';
      else if (year >= 1990) decade = '1990s';
      else if (year >= 1980) decade = '1980s及更早';
      else decade = '传统企业';
      stats.foundedYearDistribution[decade] = (stats.foundedYearDistribution[decade] || 0) + 1;
    }
  }
  
  // 转换为数组格式
  const toArray = (obj) => Object.entries(obj).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  
  // 基础统计数组
  const cityDistributionArr = toArray(stats.cityDistribution);
  const industryDistributionArr = toArray(stats.industryDistribution);
  const scaleDistributionArr = toArray(stats.scaleDistribution);
  const listingDistributionArr = toArray(stats.listingDistribution);
  const foundedYearDistributionArr = ['2020s', '2010s', '2000s', '1990s', '1980s及更早', '传统企业'].map(d => ({
    name: d,
    value: stats.foundedYearDistribution[d] || 0
  })).filter(x => x.value > 0);
  const cityTierDistributionArr = [
    { name: '一线城市', value: stats.cityTierDistribution['一线城市'] },
    { name: '新一线城市', value: stats.cityTierDistribution['新一线城市'] },
    { name: '其他城市', value: stats.cityTierDistribution['其他城市'] },
  ].filter(x => x.value > 0);
  
  const formattedStats = {
    totalCompanies: stats.totalCompanies,
    cityDistribution: cityDistributionArr,
    industryDistribution: industryDistributionArr,
    scaleDistribution: scaleDistributionArr,
    listingDistribution: listingDistributionArr,
    foundedYearDistribution: foundedYearDistributionArr,
    cityTierDistribution: cityTierDistributionArr,
    // 新增洞察数据
    insights: {
      topIndustry: industryDistributionArr[0] || null,
      topCity: cityDistributionArr[0] || null,
      topScale: scaleDistributionArr[0] || null,
      listingRate: ((stats.listingDistribution['上交所'] || 0) + 
                    (stats.listingDistribution['深交所'] || 0) + 
                    (stats.listingDistribution['港交所'] || 0) + 
                    (stats.listingDistribution['纳斯达克'] || 0) + 
                    (stats.listingDistribution['纽交所'] || 0) + 
                    (stats.listingDistribution['科创板'] || 0) + 
                    (stats.listingDistribution['新三板'] || 0) + 
                    (stats.listingDistribution['其他上市'] || 0)) / stats.totalCompanies * 100,
      tier1Rate: (stats.cityTierDistribution['一线城市'] / stats.totalCompanies * 100).toFixed(1),
      newTier1Rate: (stats.cityTierDistribution['新一线城市'] / stats.totalCompanies * 100).toFixed(1),
    }
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
