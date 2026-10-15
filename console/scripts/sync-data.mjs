#!/usr/bin/env node
/**
 * 把公用数据层的产物同步到 console/public/data。
 *
 *   node scripts/sync-data.mjs          同步（shared/data/dist 必须已构建）
 *
 * 企业数据的解析与去重在 shared/pipeline 完成，console 只是消费者之一（另一个是 app/）。
 * 这里用复制而不是软链：Vite 的 publicDir 会被整目录拷进 dist，链接在 CI 与
 * Windows 上都不稳。jobs.json / rankings.json 仍由同目录下的 generate-*.cjs 生成，
 * 那两类语料还没有进公用层。
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CONSOLE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST_DIR = path.resolve(CONSOLE_DIR, '..', 'shared', 'data', 'dist');
const OUT_DIR = path.join(CONSOLE_DIR, 'public', 'data');

/** console/src/api/client.ts 实际 fetch 的文件，多一个就得多解释一次。 */
const FILES = ['companies.json', 'filter-options.json', 'stats.json'];

if (!FILES.concat('manifest.json').every((f) => fs.existsSync(path.join(DIST_DIR, f)))) {
  console.error(`[fail] ${DIST_DIR} 缺少产物，先运行：node shared/pipeline/build.mjs`);
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const manifest = JSON.parse(fs.readFileSync(path.join(DIST_DIR, 'manifest.json'), 'utf8'));
console.log(`[sync] dataset ${manifest.datasetVersion}（${manifest.counts.companies} 家 / ${manifest.counts.sourceFiles} 个源文件）`);

for (const file of FILES) {
  const raw = fs.readFileSync(path.join(DIST_DIR, file), 'utf8');
  const data = JSON.parse(raw); // 解析失败就别把坏文件写进 public
  const size = (Buffer.byteLength(raw) / 1024).toFixed(0);
  fs.writeFileSync(path.join(OUT_DIR, file), raw);
  const count = Array.isArray(data) ? `${data.length} 条` : `${Object.keys(data).length} 个键`;
  console.log(`  ${file.padEnd(20)} ${count.padStart(10)}  ${size} KB`);
}
