#!/usr/bin/env node
/**
 * 深圳卡通地图数据构建：shared/data/dist/companies.json → app/data/。
 *
 * 不再自己解析 Markdown —— 去重、归一、字段口径全部由 shared/pipeline 负责，
 * 这里只做地图独有的两步：把"深圳 + 主表法人"筛出来，以及把地址翻译成卡通坐标。
 *
 * 用法:
 *   node app/scripts/build-app-data.mjs           # 构建并写文件
 *   node app/scripts/build-app-data.mjs --check   # 仅校验，不写文件
 *
 * 先跑 `node shared/pipeline/build.mjs` 保证 dist 是最新的。
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

import { extractUrl, guessAbbr } from '../../shared/pipeline/normalize.mjs';
import { DIST_DIR, manifestPath } from '../../shared/pipeline/paths.mjs';
import { INDUSTRY_OPTIONS } from '../../shared/vocab/industries.mjs';

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(APP_DIR, 'data');
const MAP_DATA_FILE = path.join(APP_DIR, 'js', 'map-data.js');

/**
 * 商圈锚点：名称 → [x, y, 关键词按序匹配]。
 * 坐标即 app/js/map-data.js 里 anchors 的同名条目，validate() 会比对两处，
 * 改了锚点忘了同步地图（或反过来）会在这里失败，而不是让浮标漂到隔壁区。
 */
const ANCHORS = {
  留仙洞: [312, 368, ['留仙洞', '天空之城']],
  南山智园: [340, 345, ['南山智园', '学苑大道', '西丽']],
  深圳湾: [372, 480, ['深圳湾', '后海', '滨海大厦', '总部基地']],
  蛇口: [282, 498, ['蛇口', '太子湾', '南海大道']],
  科技园: [330, 430, ['高新', '科技园', '粤海']],
  前海: [218, 388, ['前海', '梦工场']],
  宝安中心: [172, 330, ['宝安中心', '海秀路', '新安']],
  石岩: [300, 232, ['石岩', '桃花源']],
  福永: [188, 262, ['福永', '福海', '新桥', '凤凰']],
  松岗: [205, 182, ['松岗', '沙井']],
  西乡: [168, 285, ['西乡', '固戍']],
  华强北: [492, 380, ['华强北', '华强']],
  福田中心: [445, 410, ['福田中心', '市民中心', '车公庙', '香蜜湖', '深南大道', '益田']],
  罗湖中心: [560, 392, ['罗湖', '蔡屋围', '东门', '莲塘']],
  坂田: [528, 272, ['坂田', '华为基地', '天安云谷', '雪岗']],
  布吉: [582, 330, ['布吉', '南湾']],
  龙岗中心: [642, 288, ['龙岗中心', '龙翔', '大运', '宝龙']],
  坪山中心: [722, 302, ['坪山', '坑梓']],
  盐田: [645, 425, ['盐田', '北山', '大鹏湾', '沙头角']],
  大鹏: [752, 430, ['葵涌', '大鹏', '坝光']],
  光明中心: [285, 145, ['光明', '科学城', '马田', '凤凰城']],
  龙华中心: [438, 195, ['龙华', '民治', '大浪', '观澜', '福城']],
};

/** 区 → 兜底中心坐标（地址能认出区、但认不出商圈时用）。 */
const DISTRICT_CENTER = {
  南山区: [310, 445],
  福田区: [455, 415],
  罗湖区: [565, 395],
  宝安区: [175, 280],
  龙岗区: [600, 300],
  龙华区: [440, 200],
  坪山区: [725, 300],
  光明区: [285, 150],
  盐田区: [645, 428],
  大鹏新区: [760, 445],
  前海: [218, 388],
};

/** 无区名街道 → 区。 */
const STREET_ALIASES = { 松岗: '宝安区', 沙井: '宝安区', 西乡: '宝安区' };

const DISTRICT_RE = /(南山区|福田区|罗湖区|宝安区|龙岗区|龙华区|坪山区|光明区|盐田区|大鹏|前海)/;

/* ── 构建 ─────────────────────────────────────────────────────────────────── */

function loadDist() {
  const file = path.join(DIST_DIR, 'companies.json');
  if (!fs.existsSync(file)) {
    console.error(`[error] ${path.relative(process.cwd(), file)} 不存在，先跑 node shared/pipeline/build.mjs`);
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  return { records: JSON.parse(fs.readFileSync(file, 'utf8')), manifest };
}

/** 地址 → 区 / 商圈。认不出区的留在"待定位"，数据不丢。 */
function geocode(record) {
  const address = (record.address || '').replace(/^(总部|地址)[:：]/, '').trim();
  if (!address) return { district: null, anchor: null };

  const matched = address.match(DISTRICT_RE);
  let district = null;
  if (matched) {
    const raw = matched[1];
    district = raw === '大鹏' ? '大鹏新区' : raw;
  } else {
    for (const [street, name] of Object.entries(STREET_ALIASES)) {
      if (address.includes(street)) {
        district = name;
        break;
      }
    }
  }
  if (!district) return { district: null, anchor: null };

  for (const [anchor, [x, y, keywords]] of Object.entries(ANCHORS)) {
    if (keywords.some((kw) => address.includes(kw))) return { district, anchor, ax: x, ay: y };
  }
  const fallback = DISTRICT_CENTER[district];
  return fallback
    ? { district, anchor: null, ax: fallback[0], ay: fallback[1] }
    : { district, anchor: null };
}

/**
 * 同锚点/同区兜底组内按黄金角螺旋散开，避免浮标叠成一坨。
 * 角度取记录 id 的 crc32（id 由法人名哈希而来），因此同一家公司每次构建落在同一位置。
 */
function scatter(companies) {
  const groups = new Map();
  for (const c of [...companies].sort((a, b) => (a.id < b.id ? -1 : 1))) {
    if (c.ax == null) continue;
    const k = `${c.ax},${c.ay}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(c);
  }
  for (const members of groups.values()) {
    members.forEach((c, i) => {
      const angle = (zlib.crc32(c.id) % 628) / 100;
      const r = 20 + 12 * Math.sqrt(i);
      c.x = Math.round((c.ax + r * Math.cos(angle)) * 10) / 10;
      c.y = Math.round((c.ay + r * Math.sin(angle)) * 10) / 10;
    });
  }
  for (const c of companies) {
    delete c.ax;
    delete c.ay;
  }
}

function toAppCompany(record) {
  const { district, anchor, ax, ay } = geocode(record);
  const alias = record.alias || '';
  return {
    id: record.id,
    name: record.name,
    // 徽章文字：语料简称够短就用它，长的（"大疆农业(DJI Agriculture)"）退回法人名推导
    abbr: alias && alias.length <= 10 ? alias : guessAbbr(record.name),
    industries: record.industries,
    founded: record.foundedYear,
    fields: record.businessArea,
    product: record.products || record.coreProduct,
    size: record.scale,
    listing: record.listingStatus,
    website: record.website,
    repo: record.openSource ? extractUrl(record.openSource) : null,
    address: record.address,
    district,
    anchor,
    ax,
    ay,
    x: null,
    y: null,
    sources: record.sourceFiles,
  };
}

/**
 * 地图只画"深圳主表口径"。跨国清单与补充名录里的深圳条目是同一批法人的另一种写法
 * （"BYD Company Limited" 对 "深圳市比亚迪股份有限公司"、"腾讯控股" 对
 * "深圳市腾讯计算机系统有限公司"），放进来就是同一位置两枚图钉；branch 口径更糟，
 * "腾讯科技（上海）有限公司" 这类记录的城市是从别的城市文件里一句裸"深圳"地址推来的，
 * 图钉会挂着别名"腾讯上海"落在南山。这两种口径交给 console 的表格去看。
 */
function isShenzhenMainTable(record) {
  return record.city === '深圳' && record.scope === 'listed';
}

function build() {
  const { records, manifest } = loadDist();
  const szMain = records.filter(isShenzhenMainTable);
  const companies = szMain.map(toAppCompany);
  scatter(companies);

  const present = new Set(companies.flatMap((c) => c.industries));
  const industries = INDUSTRY_OPTIONS.filter((i) => present.has(i.id));
  const located = companies.filter((c) => c.x != null).length;

  return {
    payload: {
      meta: {
        generatedAt: new Date().toISOString().slice(0, 10),
        source: 'shared/data/dist/companies.json',
        datasetVersion: manifest.datasetVersion,
        sourceFiles: new Set(companies.flatMap((c) => c.sources)).size,
        companies: companies.length,
        located,
      },
      industries,
      companies,
    },
    all: records,
  };
}

/* ── 校验 ─────────────────────────────────────────────────────────────────── */

/** 从 app/js/map-data.js 抠出 anchors 块，比对坐标。 */
function mapAnchors() {
  const src = fs.readFileSync(MAP_DATA_FILE, 'utf8');
  const block = src.slice(src.indexOf('anchors: {'), src.indexOf('// 主题装饰元素'));
  const out = {};
  for (const m of block.matchAll(/"([^"]+)":\s*\{\s*x:\s*([\d.]+),\s*y:\s*([\d.]+)\s*\}/g)) {
    out[m[1]] = [Number(m[2]), Number(m[3])];
  }
  return out;
}

function validate(payload) {
  const fails = [];
  const comps = payload.companies;
  const m = payload.meta;
  const count = (district) => comps.filter((c) => c.district === district).length;

  if (m.companies < 150 || m.companies > 220) {
    fails.push(`深圳主表 ${m.companies} 家，超出 [150,220] 容差（当前 182）`);
  }
  if (m.located < 120) fails.push(`定位覆盖 ${m.located} 家过少（当前 130+）`);
  if (count('南山区') < 60) fails.push(`南山区 ${count('南山区')} 家异常（当前 60+）`);
  if (comps.some((c) => !c.name || !c.abbr)) fails.push('存在缺名称/简称的记录');
  if (comps.some((c) => c.website && !/^https?:\/\//.test(c.website))) {
    fails.push('存在非 http(s) 的官网地址');
  }

  const declared = mapAnchors();
  for (const [anchor, [x, y]] of Object.entries(ANCHORS)) {
    const inMap = declared[anchor];
    if (!inMap) fails.push(`map-data.js 缺少商圈锚点「${anchor}」`);
    else if (inMap[0] !== x || inMap[1] !== y) {
      fails.push(`锚点「${anchor}」坐标不符：build ${x},${y} vs map-data ${inMap[0]},${inMap[1]}`);
    }
  }
  for (const anchor of Object.keys(declared)) {
    if (!ANCHORS[anchor]) fails.push(`build 脚本缺少商圈锚点「${anchor}」`);
  }

  return fails;
}

/* ── 入口 ─────────────────────────────────────────────────────────────────── */

const check = process.argv.includes('--check');
const { payload, all } = build();
const fails = validate(payload);

if (fails.length) {
  for (const f of fails) console.error(`[fail] ${f}`);
  process.exit(1);
}

const byDistrict = {};
for (const c of payload.companies) {
  const k = c.district || '待定位';
  byDistrict[k] = (byDistrict[k] || 0) + 1;
}
console.log(`[check] dist ${all.length} 家 → 深圳主表 ${payload.meta.companies} 家，`
  + `定位 ${payload.meta.located} 家，行业 ${payload.industries.length} 个，`
  + `南山区 ${byDistrict['南山区']} 家`);

if (check) {
  console.log('[check] 校验通过（未写文件）');
} else {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const json = JSON.stringify(payload, null, 2) + '\n';
  fs.writeFileSync(path.join(OUT_DIR, 'companies.json'), json, 'utf8');
  fs.writeFileSync(
    path.join(OUT_DIR, 'companies.js'),
    `window.APP_DATA = ${JSON.stringify(payload)};\n`,
    'utf8',
  );
  console.log(`[done] app/data/companies.json / companies.js`
    + `（${payload.meta.companies} 家，定位 ${payload.meta.located} 家，`
    + `数据集 ${payload.meta.datasetVersion}）`);
}
