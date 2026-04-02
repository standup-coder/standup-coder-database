#!/usr/bin/env node
/**
 * 修复企业数据中的行业信息
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../public/data');

// 从文件名提取行业的映射
const INDUSTRY_MAP = {
  'ai-': '人工智能',
  'bigdata-': '大数据',
  'blockchain-': '区块链',
  'iot-': '物联网',
  'smart-manufacturing-': '智能制造',
  'new-energy-': '新能源',
  'new-materials-': '新材料',
  'biotech-': '生物技术',
  'biomedical-': '生物医药',
  'biopharma-': '生物医药',
  '3c-': '3C电子',
  'cloud-': '云计算',
  'security-': '网络安全',
  'cybersecurity-': '网络安全',
  'internet-': '互联网',
  'software-': '软件',
  'ev-': '新能源汽车',
  'automation-': '工业自动化',
  'battery-': '动力电池',
  'drone-': '无人机',
  'aerospace-': '航空航天',
  'fintech-': '金融科技',
  'edutech-': '教育科技',
  'healthtech-': '健康科技',
  'medtech-': '医疗科技',
  'arvr-': 'AR/VR',
  'quantum-': '量子计算',
  'ecommerce-': '电子商务',
  'logistics-': '物流科技',
  'entertainment-': '娱乐科技',
  'sports-': '体育科技',
  'digital-twin-': '数字孪生',
  'edge-computing-': '边缘计算',
  'agritech-': '农业科技',
  'smartcity-': '智慧城市',
  'web3-': 'Web3',
  'semiconductor-': '半导体',
  'chip-': '芯片',
  'robotics-': '机器人',
  'airenewable-': '新能源',
};

const SPECIAL_FILES = {
  'tech-innovation-beijing.md': '科技创新',
  'tech-innovation-shanghai.md': '科技创新',
  'tech-innovation-shenzhen.md': '科技创新',
  'internet-100.md': '互联网百强',
  'software-100.md': '软件百强',
  'agritech.md': '农业科技',
  'digital-twin.md': '数字孪生',
  'smartcity.md': '智慧城市',
  'edutech.md': '教育科技',
  'entertainment-tech.md': '娱乐科技',
  'sports-tech.md': '体育科技',
  'healthtech-beijing.md': '健康科技',
  'fintech-beijing.md': '金融科技',
};

function extractIndustryFromFilename(sourceFile) {
  // 提取文件名
  const filename = sourceFile.replace(/^industry\//, '');
  
  // 检查特殊文件
  if (SPECIAL_FILES[filename]) {
    return SPECIAL_FILES[filename];
  }
  
  // 检查前缀映射
  for (const [prefix, industry] of Object.entries(INDUSTRY_MAP)) {
    if (filename.startsWith(prefix)) {
      return industry;
    }
  }
  
  return '';
}

function main() {
  console.log('🔧 Fixing data...\n');
  
  // 读取现有数据
  const companies = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, 'companies.json'), 'utf-8'));
  
  let fixedCount = 0;
  
  for (const company of companies) {
    if (!company.industry && company.sourceFile) {
      const industry = extractIndustryFromFilename(company.sourceFile);
      if (industry) {
        company.industry = industry;
        fixedCount++;
      }
    }
  }
  
  console.log(`Fixed ${fixedCount} companies with industry info`);
  
  // 重新生成统计
  const stats = {
    totalCompanies: companies.length,
    cityDistribution: {},
    industryDistribution: {},
    scaleDistribution: {},
  };
  
  for (const c of companies) {
    if (c.city) stats.cityDistribution[c.city] = (stats.cityDistribution[c.city] || 0) + 1;
    if (c.industry) stats.industryDistribution[c.industry] = (stats.industryDistribution[c.industry] || 0) + 1;
    if (c.scale) stats.scaleDistribution[c.scale] = (stats.scaleDistribution[c.scale] || 0) + 1;
  }
  
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
  
  const filterOptions = {
    cities: Object.keys(stats.cityDistribution).sort(),
    industries: Object.keys(stats.industryDistribution).sort(),
    scales: Object.keys(stats.scaleDistribution).sort(),
    listingStatus: ['已上市', '未上市', 'IPO暂停', '多轮', '科创板', '港交所', '深交所', '纳斯达克', '纽交所'],
  };
  
  const searchIndex = {
    companies: companies.map(c => ({
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
  fs.writeFileSync(path.join(OUTPUT_DIR, 'companies.json'), JSON.stringify(companies));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'stats.json'), JSON.stringify(formattedStats));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'filter-options.json'), JSON.stringify(filterOptions));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'search-index.json'), JSON.stringify(searchIndex));
  
  console.log('\n✅ Data fixed!');
  console.log(`  - Total: ${companies.length}`);
  console.log(`  - With industry: ${companies.filter(c => c.industry).length}`);
  console.log(`  - Cities: ${filterOptions.cities.length}`);
  console.log(`  - Industries: ${filterOptions.industries.length}`);
}

main();
