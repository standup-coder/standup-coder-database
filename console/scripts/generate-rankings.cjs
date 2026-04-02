#!/usr/bin/env node
/**
 * 生成榜单数据 JSON
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../..');
const OUTPUT_DIR = path.join(__dirname, '../public/data');

// 榜单配置
const RANKING_CONFIGS = [
  {
    id: 'fortune_500_2025',
    name: '财富世界500强',
    file: 'rankings-international/fortune_500_2025.md',
    year: 2025,
    category: 'global',
  },
  {
    id: 'unicorn_2025',
    name: '中国独角兽企业',
    file: 'rankings/unicorn-enterprise.md',
    year: 2025,
    category: 'unicorn',
  },
  {
    id: 'gazelle_2025',
    name: '中国瞪羚企业',
    file: 'rankings/gazelle-enterprise.md',
    year: 2025,
    category: 'gazelle',
  },
  {
    id: 'private_enterprise_500',
    name: '中国民营企业500强',
    file: 'rankings/private-enterprise-500.md',
    year: 2025,
    category: 'private',
  },
  {
    id: 'internet_100',
    name: '中国互联网企业100强',
    file: 'rankings/internet-100.md',
    year: 2025,
    category: 'internet',
  },
  {
    id: 'software_100',
    name: '中国软件百强',
    file: 'rankings/software-100.md',
    year: 2025,
    category: 'software',
  },
  {
    id: 'manufacturing_champion',
    name: '制造业单项冠军',
    file: 'rankings/manufacturing-champion.md',
    year: 2025,
    category: 'manufacturing',
  },
  {
    id: 'specialized_sme',
    name: '专精特新小巨人',
    file: 'rankings/specialized-sme-xiaojuren.md',
    year: 2025,
    category: 'innovation',
  },
];

function parseTableLine(line, headers) {
  const cells = line.split('|').map(c => c.trim()).filter(c => c && !c.includes('---'));
  if (cells.length < headers.length) return null;
  
  const row = {};
  headers.forEach((h, i) => {
    row[h] = cells[i] || '';
  });
  return row;
}

function parseRankingFile(config) {
  const filePath = path.join(DATA_DIR, config.file);
  if (!fs.existsSync(filePath)) {
    console.log(`  Warning: ${config.file} not found`);
    return null;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const items = [];
  
  let headers = [];
  let inTable = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // 检测表头行 - 支持多种表头格式
    if ((trimmed.includes('排名') || trimmed.includes('企业名称')) && trimmed.startsWith('|')) {
      headers = trimmed.split('|').map(h => h.trim()).filter(h => h);
      inTable = true;
      continue;
    }
    
    if (trimmed.match(/^\|[\s\-:|]+\|$/)) {
      continue;
    }
    
    if (inTable && trimmed.startsWith('|')) {
      const row = parseTableLine(trimmed, headers);
      if (row) {
        // 提取排名（如果没有排名列，则自动递增）
        let rank = parseInt(row['排名'] || row['Rank'] || '0');
        if (isNaN(rank)) rank = 0;
        
        // 提取企业名称
        const name = row['企业名称'] || row['公司名称'] || row['Name'] || '';
        if (!name || name.includes('---') || name === '企业名称') continue;
        
        // 提取城市 - 尝试多种列名
        const city = row['城市'] || row['总部城市'] || row['City'] || 
                     row['总部所在地'] || row['总部地点'] || row['Location'] ||
                     row['所在城市'] || row['城市地点'] ||
                     row['所属区域'] || row['区域'] || '';
        
        // 提取国家
        const country = row['所属国家/地区'] || row['Country'] || 
                        row['所属省份'] || row['省份'] || '中国';
        
        items.push({
          rank,
          name,
          alias: row['简称'] || row['Alias'] || '',
          city,
          country,
          industry: row['行业'] || row['行业领域'] || row['Industry'] || '',
          revenue: row['营业收入（亿美元）'] || row['营收'] || row['Revenue'] || 
                   row['营业收入（亿元）'] || '',
          profit: row['利润（亿美元）'] || row['利润'] || row['Profit'] || '',
          employees: row['员工人数'] || row['Employees'] || '',
          valuation: parseFloat(row['估值（亿美元）'] || row['估值'] || '0') || undefined,
          marketCap: row['市值（亿美元）'] || row['市值'] || '',
          website: row['企业主页'] || row['Website'] || '',
          listing: row['上市情况'] || row['Listing'] || '',
          ceo: row['CEO/负责人'] || row['CEO'] || '',
          founded: row['成立时间'] || row['Founded'] || '',
          description: row['核心业务'] || row['Description'] || '',
        });
      }
    } else if (inTable && trimmed === '') {
      inTable = false;
      headers = [];
    }
  }
  
  console.log(`  ${config.name}: ${items.length} items`);
  
  return {
    ...config,
    items,
    count: items.length,
  };
}

function main() {
  console.log('🚀 Generating rankings data...\n');
  
  const allRankings = [];
  
  for (const config of RANKING_CONFIGS) {
    const ranking = parseRankingFile(config);
    if (ranking) {
      allRankings.push(ranking);
    }
  }
  
  // 按年份分组
  const rankingsByYear = {};
  for (const r of allRankings) {
    if (!rankingsByYear[r.year]) {
      rankingsByYear[r.year] = [];
    }
    rankingsByYear[r.year].push(r);
  }
  
  // 生成年份列表
  const years = Object.keys(rankingsByYear).sort().reverse();
  
  // 生成榜单类型列表
  const categories = [...new Set(allRankings.map(r => ({
    key: r.category,
    name: r.name,
  })))];
  
  const result = {
    years,
    categories,
    rankings: allRankings,
    byYear: rankingsByYear,
  };
  
  // 保存文件
  fs.writeFileSync(path.join(OUTPUT_DIR, 'rankings.json'), JSON.stringify(result, null, 2));
  
  console.log('\n✅ Rankings data generated!');
  console.log(`  - Total rankings: ${allRankings.length}`);
  console.log(`  - Years: ${years.join(', ')}`);
  console.log(`  - Categories: ${categories.length}`);
  for (const r of allRankings) {
    console.log(`    - ${r.name}: ${r.count} 家企业`);
  }
}

main();
