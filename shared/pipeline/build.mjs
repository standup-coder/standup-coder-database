#!/usr/bin/env node
/**
 * 公用数据层构建：industry/*.md → shared/data/dist/*.json
 *
 *   node shared/pipeline/build.mjs            构建并写文件
 *   node shared/pipeline/build.mjs --check    只校验，不写文件
 *   node shared/pipeline/build.mjs --diff     与 console 现有产物比家数
 *
 * 断言失败即退出码 1：语料结构与解析器的对应关系靠这些断言守住，
 * 而不是靠人记得去比对两边的家数。
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { cityFromFilename, industryFromFilename } from '../vocab/cities.mjs';
import { resolveIndustry } from '../vocab/industries.mjs';
import { ALL_FIELDS } from '../schema/record.mjs';
import {
  COMPANIES_DIR,
  companySchemaPath,
  companyTypesPath,
  DIST_DIR,
  manifestPath,
  REPO_ROOT,
} from './paths.mjs';
import { dedupe } from './dedupe.mjs';
import { derive, filterOptions, searchIndex } from './derive.mjs';
import { hasCitySuffix } from './normalize.mjs';
import { parseFile } from './parse.mjs';

const DISCLAIMER = '内容经 AI 辅助整理，未经逐一核实；数据截止 2026 年初，仅供参考。';

const argv = process.argv.slice(2);
const CHECK = argv.includes('--check');
const DIFF = argv.includes('--diff');

function load() {
  const files = fs.readdirSync(COMPANIES_DIR).filter((f) => f.endsWith('.md')).sort();
  const rows = [];
  const unmappedFields = new Set();
  const unregisteredIndustries = new Set();
  const unlocatedCities = new Set();
  const filesWithoutRows = [];
  let orphanTables = 0;
  let aggregateTables = 0;

  for (const file of files) {
    const slug = industryFromFilename(file);
    const city = cityFromFilename(file);
    if (!city) unlocatedCities.add(file);
    if (!resolveIndustry(slug)) unregisteredIndustries.add(`${file} → ${slug}`);

    const parsed = parseFile(path.join(COMPANIES_DIR, file), { industrySlug: slug, city });
    parsed.droppedFields.forEach((h) => unmappedFields.add(h));
    rows.push(...parsed.rows);
    orphanTables += parsed.orphanTables;
    aggregateTables += parsed.aggregateTables;
    if (!parsed.rows.length) filesWithoutRows.push(file);
  }

  return {
    files,
    rows,
    filesWithoutRows,
    orphanTables,
    aggregateTables,
    unmappedFields,
    unregisteredIndustries,
    unlocatedCities,
  };
}

/**
 * 同一份字段清单有三处视图：record.mjs（pipeline 用它补 null）、company.schema.json
 * （外部消费者用它校验）、types/company.ts（console 用它写类型）。
 * 这里比对三处，改字段忘了同步会在这里炸，而不是让 console 拿到 undefined。
 */
function fieldContract() {
  const schema = JSON.parse(fs.readFileSync(companySchemaPath, 'utf8'));
  const ts = fs.readFileSync(companyTypesPath, 'utf8');
  const body = ts.slice(ts.indexOf('export interface Company {'), ts.indexOf('\n}'));
  const fromTs = [...body.matchAll(/^ {2}(?:\/\*[\s\S]*?\*\/\s*)?([A-Za-z]\w*)\??:/gm)].map((m) => m[1]);
  return { schema: schema.required, ts: fromTs, properties: Object.keys(schema.properties) };
}

function datasetVersion(records) {
  const hash = crypto.createHash('sha256');
  for (const r of records) {
    hash.update(`${r.id}|${r.name}|${r.city || ''}|${r.industries.join(',')}|${r.scope}\n`);
  }
  return hash.digest('hex').slice(0, 12);
}

function validate(records, stats, corpus) {
  const failures = [];
  const fail = (msg) => failures.push(msg);

  // 148 = 语料现状。下限断言的意义是探针：CONTENT_ROOT 指错目录、docs/ 搬迁漏目录，
  // 都会先在这里炸，而不是产出一份少了一半行业的 JSON。
  if (corpus.files.length < 148) fail(`语料文件数 ${corpus.files.length} < 148，怀疑读取目录或搬迁出错`);
  if (corpus.rows.length < 3500) fail(`原始行数 ${corpus.rows.length} 过少，怀疑表格/档案识别失效`);
  if (records.length < 1650) fail(`去重后仅 ${records.length} 条，怀疑归一化过度合并（实测 1745）`);
  if (records.length > corpus.rows.length) fail('去重后多于原始行数');

  if (corpus.filesWithoutRows.length) {
    fail(`${corpus.filesWithoutRows.length} 个文件一条企业都没解出: ${corpus.filesWithoutRows.join(', ')}`);
  }
  // 语料里 918 张企业表首列全是「企业名称」；出现例外说明读表策略需要扩展，而不是默默丢数据。
  if (corpus.orphanTables) fail(`${corpus.orphanTables} 张含企业名称列的表未被读取（首列不是「企业名称」）`);

  const shenzhenMain = records.filter((r) => r.city === '深圳' && r.scope === 'listed');
  if (shenzhenMain.length < 150 || shenzhenMain.length > 195) {
    fail(`深圳主表口径 ${shenzhenMain.length} 家，偏离 app 基线 171 的容差区间 [150,195]`);
  }

  const ids = new Set();
  const shapes = new Set();
  for (const r of records) {
    if (!r.name) fail(`缺少名称: ${JSON.stringify(r).slice(0, 120)}`);
    if (!r.alias) fail(`缺少简称: ${r.name}`);
    if (ids.has(r.id)) fail(`重复 id ${r.id}: ${r.city} / ${r.name}`);
    ids.add(r.id);
    shapes.add(Object.keys(r).join(','));
    if (r.website && !/^https?:\/\//.test(r.website)) fail(`${r.name} 主页不是 URL: ${r.website}`);
    for (const [field, value] of Object.entries(r)) {
      if (value === '-') fail(`${r.name} 的 ${field} 泄漏了占位符 "-"`);
    }
    // 跨国记录的 city 只可能来自地址或名称末尾的办公城市（parse.cityOf 对跨国口径不继承文件名城市，
    // 后者正是已上线数据把"ASML Shanghai"算成上海公司的原因）。∷ 键说明城市来自写法本身。
    if (r.scope === 'international' && r.city && !r.address && !r.key.startsWith('∷')) {
      fail(`跨国记录 ${r.name} 的 ${r.city} 既无地址、名称也不带城市后缀`);
    }
  }

  const international = records.filter((r) => r.scope === 'international');
  const officeMerged = international.filter((r) => r.key.startsWith('∷'));
  // 跨国口径实测：702 行 → 264 家，其中 87 家是把办公城市写在名称末尾的母公司
  // （"ASML Shanghai" 与 "ASML Guangzhou" 并成一家，平均 1.7 座城市）。
  // 两个方向都可能坏：∷ 键失效就退化成每座城市各算一家（officeMerged 归零、总数逼近 330）；
  // 过度合并则会把「外资/外地企业」清单里的中国公司并掉，城市分布被抹平（总数跌破 200）。
  if (officeMerged.length < 40) {
    fail(`跨国口径只有 ${officeMerged.length} 条按办公城市合并（实测 87），怀疑 ∷ 键失效`);
  }
  if (international.length < 200 || international.length > 330) {
    fail(`跨国口径 ${international.length} 家（实测 264），超出 [200,330] 容差`);
  }
  for (const r of international) {
    if (r.key.startsWith('∷') && hasCitySuffix(r.name)) {
      fail(`跨国记录 ${r.name} 仍带办公城市后缀，展示名没归一`);
    }
  }

  // 每条记录带全字段（语料没给的补 null）：表格式行和档案式行的键不同，
  // 少一个键等于 console 读到 undefined、而别家同类字段有值，同一字段两种表现。
  const expectedShape = ALL_FIELDS.join(',');
  const contract = fieldContract();
  const describe = (list) => {
    const set = new Set(list.split(','));
    const missing = ALL_FIELDS.filter((f) => !set.has(f));
    const extra = [...set].filter((f) => !ALL_FIELDS.includes(f));
    if (missing.length) return `缺 ${missing.join('、')}${extra.length ? `，多 ${extra.join('、')}` : ''}`;
    if (extra.length) return `多 ${extra.join('、')}`;
    return '字段齐全但键序不符';
  };
  for (const shape of shapes) {
    if (shape !== expectedShape) fail(`记录键集与字段清单不符（${describe(shape)}）`);
  }
  if (contract.schema.join(',') !== expectedShape) {
    fail(`company.schema.json 的 required 与 record.mjs 不符（${describe(contract.schema.join(','))}）`);
  }
  if (contract.properties.join(',') !== expectedShape) {
    fail(`company.schema.json 的 properties 与 required 不同序（${describe(contract.properties.join(','))}）`);
  }
  if (contract.ts.join(',') !== expectedShape) {
    fail(`types/company.ts 的字段与 record.mjs 不符（${describe(contract.ts.join(','))}）`);
  }

  const citySum = stats.cityDistribution.reduce((n, x) => n + x.value, 0);
  if (citySum !== stats.totalDomestic) {
    fail(`城市分布合计 ${citySum} != 本土法人数 ${stats.totalDomestic}（有 ${stats.totalDomestic - citySum} 条本土记录归不出城市）`);
  }
  const tierSum = stats.cityTierDistribution.reduce((n, x) => n + x.value, 0);
  if (tierSum !== stats.totalDomestic) {
    fail(`城市等级分布合计 ${tierSum} != 本土法人数 ${stats.totalDomestic}`);
  }

  return { failures, shenzhenMain: shenzhenMain.length };
}

function compareWithConsole(records) {
  const legacyFile = path.join(REPO_ROOT, 'console/public/data/companies.json');
  if (!fs.existsSync(legacyFile)) {
    console.log('\n[diff] console 现有产物不存在，跳过比对');
    return;
  }
  const legacy = JSON.parse(fs.readFileSync(legacyFile, 'utf8'));
  const group = (rows, key) => {
    const set = new Map();
    for (const row of rows) {
      const k = key(row);
      if (!k) continue;
      set.set(k, (set.get(k) || 0) + 1);
    }
    return set;
  };
  const legacyShenzhen = legacy.filter((r) => r.city === '深圳');
  const nextShenzhen = records.filter((r) => r.city === '深圳' && r.scope === 'listed');

  console.log('\n[diff] 与 console 已上线数据对比');
  console.log(`  记录总数   ${legacy.length} → ${records.length}`);
  console.log(`  深圳口径   ${legacyShenzhen.length} 行 → ${nextShenzhen.length} 家（同名去重前 ${new Set(legacyShenzhen.map((r) => r.name)).size} 个名称）`);
  console.log(`  空城市     ${legacy.filter((r) => !r.city).length} → ${records.filter((r) => !r.city && r.scope !== 'international').length}`);
  console.log(`  无规模     ${legacy.filter((r) => !r.scale).length} → ${records.filter((r) => r.scaleBandValue === '未披露').length}`);

  const legacyIndustries = group(legacy, (r) => r.industry);
  const nextIndustries = group(records.filter((r) => r.scope !== 'international'), (r) => r.industry);
  const drift = [...new Set([...legacyIndustries.keys(), ...nextIndustries.keys()])]
    .map((name) => ({ name, before: legacyIndustries.get(name) || 0, after: nextIndustries.get(name) || 0 }))
    .filter((x) => x.before !== x.after)
    .sort((a, b) => Math.abs(b.after - b.before) - Math.abs(a.after - a.before))
    .slice(0, 8);
  if (drift.length) {
    console.log('  行业家数变化最大的 8 项:');
    drift.forEach((d) => console.log(`    ${d.name}: ${d.before} → ${d.after}`));
  }
}

function main() {
  const corpus = load();
  const records = dedupe(corpus.rows);
  const stats = derive(records);
  const options = filterOptions(records);
  const index = searchIndex(records);
  const version = datasetVersion(records);
  const { failures, shenzhenMain } = validate(records, stats, corpus);

  const domestic = records.filter((r) => r.scope !== 'international');
  console.log(`语料 ${corpus.files.length} 文件 / ${corpus.rows.length} 行 → 法人 ${records.length} 家（本土 ${domestic.length}、跨国 ${records.length - domestic.length}）`);
  console.log(`覆盖 ${corpus.files.length - corpus.filesWithoutRows.length}/${corpus.files.length} 文件出数 · 汇总表 ${corpus.aggregateTables} 张按设计跳过 · 未读取的企业表 ${corpus.orphanTables}`);
  console.log(`深圳主表口径 ${shenzhenMain} 家（app 基线 171）`);
  console.log(`城市 ${stats.insights.cities} 个 / 行业 ${stats.insights.industries} 个 / 上市率 ${stats.insights.listingRate}%`);
  const topCities = stats.cityDistribution.slice(0, 6).map((x) => `${x.name} ${x.value}`).join('、');
  console.log(`城市 Top: ${topCities}`);
  const topIndustries = stats.industryDistribution.slice(0, 6).map((x) => `${x.name} ${x.value}`).join('、');
  console.log(`行业 Top: ${topIndustries}`);
  const topListing = stats.listingDistribution.slice(0, 6).map((x) => `${x.name} ${x.value}`).join('、');
  console.log(`上市口径 Top: ${topListing}`);

  if (corpus.unlocatedCities.size) console.log(`[warn] 文件名无法识别城市: ${[...corpus.unlocatedCities].join(', ')}`);
  if (corpus.unregisteredIndustries.size) console.log(`[warn] 未登记行业 slug: ${[...corpus.unregisteredIndustries].join(', ')}`);
  const unmapped = [...corpus.unmappedFields];
  if (unmapped.length) console.log(`[info] 未映射字段（这些数据被丢弃，共 ${unmapped.length} 个）: ${unmapped.slice(0, 40).join(' / ')}`);

  if (failures.length) {
    console.error(`\n校验失败 ${failures.length} 项:`);
    failures.slice(0, 20).forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  }

  if (DIFF) compareWithConsole(records);

  if (CHECK) {
    console.log('\n校验通过（--check 未写文件）');
    return;
  }

  const manifest = {
    datasetVersion: version,
    generatedAt: new Date().toISOString(),
    disclaimer: DISCLAIMER,
    source: path.relative(REPO_ROOT, COMPANIES_DIR),
    counts: {
      sourceFiles: corpus.files.length,
      rawRows: corpus.rows.length,
      companies: records.length,
      domestic: domestic.length,
      international: records.length - domestic.length,
    },
    scopes: Object.fromEntries(
      [...records.reduce((m, r) => m.set(r.scope, (m.get(r.scope) || 0) + 1), new Map()).entries()],
    ),
    fields: ALL_FIELDS,
    schema: path.relative(REPO_ROOT, companySchemaPath),
    diagnostics: {
      unregisteredIndustries: [...corpus.unregisteredIndustries],
      unlocatedCityFiles: [...corpus.unlocatedCities],
      unmappedFields: [...corpus.unmappedFields],
      filesWithoutRows: corpus.filesWithoutRows,
      skippedAggregateTables: corpus.aggregateTables,
      unreadCompanyTables: corpus.orphanTables,
    },
  };

  fs.mkdirSync(DIST_DIR, { recursive: true });
  const write = (name, data) =>
    fs.writeFileSync(path.join(DIST_DIR, name), JSON.stringify(data, null, 2) + '\n', 'utf8');

  write('companies.json', records);
  write('stats.json', stats);
  write('filter-options.json', options);
  write('search-index.json', index);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  console.log(`\n已写入 ${DIST_DIR}`);
  console.log(`  companies.json ${records.length} 条 · stats.json · filter-options.json · search-index.json · manifest.json`);
  console.log(`  datasetVersion ${version}`);
}

main();
