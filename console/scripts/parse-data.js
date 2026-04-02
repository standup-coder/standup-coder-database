#!/usr/bin/env node
/**
 * Standup Coder Database Parser
 * 解析 Markdown 文件，生成 JSON 数据和搜索索引
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 路径配置
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'data');

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 简化的城市映射
const CITY_MAP = {
  'beijing': '北京', 'shanghai': '上海', 'shenzhen': '深圳', 'guangzhou': '广州',
  'hangzhou': '杭州', 'nanjing': '南京', 'suzhou': '苏州', 'chengdu': '成都',
  'wuhan': '武汉', 'xian': '西安', 'qingdao': '青岛', 'tianjin': '天津',
  'chongqing': '重庆', 'changsha': '长沙', 'hefei': '合肥', 'jinan': '济南',
  'xiamen': '厦门', 'harbin': '哈尔滨', 'shenyang': '沈阳', 'kunming': '昆明',
  'wuxi': '无锡', 'changzhou': '常州', 'hongkong': '香港', 'macau': '澳门', 'lhasa': '拉萨',
};

// 行业映射
const INDUSTRY_MAP = {
  'ai': '人工智能', 'bigdata': '大数据', 'blockchain': '区块链', 'iot': '物联网',
  'smart-manufacturing': '智能制造', 'new-energy': '新能源', 'new-materials': '新材料',
  'biotech': '生物技术', '3c': '3C电子', 'cloud': '云计算', 'security': '网络安全',
  'internet': '互联网', 'software': '软件', 'ev': '新能源汽车', 'automation': '自动化',
  'battery': '电池', 'drone': '无人机', 'aerospace': '航空航天', 'fintech': '金融科技',
  'edutech': '教育科技', 'healthtech': '健康科技', 'arvr': 'AR/VR', 'quantum': '量子计算',
  'ecommerce': '电子商务', 'logistics': '物流科技', 'entertainment': '娱乐科技',
  'sports': '体育科技', 'digital-twin': '数字孪生', 'edge-computing': '边缘计算',
  'agritech': '农业科技', 'smartcity': '智慧城市', 'web3': 'Web3',
};

// 提取城市
function extractCity(filename) {
  const match = filename.match(/-([a-z]+)\.md$/i);
  return match ? (CITY_MAP[match[1].toLowerCase()] || match[1]) : '';
}

// 提取行业
function extractIndustry(filename) {
  const match = filename.match(/^([a-z-]+)-/i);
  return match ? (INDUSTRY_MAP[match[1].toLowerCase()] || match[1]) : '';
}

// 快速解析表格行
function parseTableLine(line, headers) {
  const cells = line.split('|').map(c => c.trim()).filter(c => c && c !== '---');
  if (cells.length < headers.length) return null;
  
  const row = {};
  headers.forEach((h, i) => {
    row[h] = cells[i] || '';
  });
  return row;
}

// 解析单个文件
function parseFile(filePath, filename) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const companies = [];
  
  let headers = [];
  let inTable = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // 检测表头行
    if (trimmed.includes('企业名称') && trimmed.startsWith('|')) {
      headers = trimmed.split('|').map(h => h.trim()).filter(h => h);
      inTable = true;
      continue;
    }
    
    // 跳过分隔线
    if (trimmed.match(/^\|[\s\-:|]+\|$/)) {
      continue;
    }
    
    // 解析数据行
    if (inTable && trimmed.startsWith('|')) {
      const row = parseTableLine(trimmed, headers);
      if (row && row['企业名称'] && !row['企业名称'].includes('---')) {
        const name = row['企业名称'];
        companies.push({
          id: `${filename}-${name}`.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-').slice(0, 100),
          name: name,
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
          city: extractCity(filename),
          industry: extractIndustry(filename),
          sourceFile: filename,
        });
      }
    } else if (inTable && trimmed === '') {
      // 表格结束
      inTable = false;
      headers = [];
    }
  }
  
  return companies;
}

// 主函数
async function main() {
  console.log('🚀 Starting data parsing...\n');
  const startTime = Date.now();
  
  const allCompanies = [];
  
  // 解析行业数据
  console.log('📁 Parsing industry data...');
  const industryFiles = await glob('industry/*.md', { cwd: DATA_DIR });
  console.log(`   Found ${industryFiles.length} files`);
  
  let processed = 0;
  for (const file of industryFiles) {
    const filePath = path.join(DATA_DIR, file);
    const filename = path.basename(file);
    const companies = parseFile(filePath, filename);
    allCompanies.push(...companies);
    processed++;
    if (processed % 20 === 0) {
      console.log(`   Processed ${processed}/${industryFiles.length} files...`);
    }
  }
  
  console.log(`✓ Parsed ${allCompanies.length} companies\n`);
  
  // 生成统计数据
  console.log('📊 Generating statistics...');
  const stats = { totalCompanies: allCompanies.length };
  const distributions = { city: {}, industry: {}, scale: {} };
  
  for (const c of allCompanies) {
    if (c.city) distributions.city[c.city] = (distributions.city[c.city] || 0) + 1;
    if (c.industry) distributions.industry[c.industry] = (distributions.industry[c.industry] || 0) + 1;
    if (c.scale) distributions.scale[c.scale] = (distributions.scale[c.scale] || 0) + 1;
  }
  
  stats.cityDistribution = Object.entries(distributions.city)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  stats.industryDistribution = Object.entries(distributions.industry)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  stats.scaleDistribution = Object.entries(distributions.scale)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  // 生成搜索索引
  console.log('🔍 Building search index...');
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
  
  // 筛选选项
  const filterOptions = {
    cities: Object.keys(distributions.city).sort(),
    industries: Object.keys(distributions.industry).sort(),
    scales: Object.keys(distributions.scale).sort(),
    listingStatus: ['已上市', '未上市', 'IPO暂停', '多轮', '科创板', '港交所', '纳斯达克'],
  };
  
  // 保存文件
  console.log('\n💾 Saving data files...');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'companies.json'), JSON.stringify(allCompanies));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'stats.json'), JSON.stringify(stats));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'search-index.json'), JSON.stringify(searchIndex));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'filter-options.json'), JSON.stringify(filterOptions));
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ Completed in ${duration}s!`);
  console.log(`   - companies.json: ${allCompanies.length} records`);
  console.log(`   - stats.json: ${stats.cityDistribution.length} cities, ${stats.industryDistribution.length} industries`);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
