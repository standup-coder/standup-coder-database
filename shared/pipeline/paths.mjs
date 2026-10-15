import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SHARED_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const REPO_ROOT = path.resolve(SHARED_DIR, '..');
export const DIST_DIR = path.join(SHARED_DIR, 'data', 'dist');
export const manifestPath = path.join(DIST_DIR, 'manifest.json');
export const SCHEMA_DIR = path.join(SHARED_DIR, 'schema');
export const companySchemaPath = path.join(SCHEMA_DIR, 'company.schema.json');
export const companyTypesPath = path.join(SCHEMA_DIR, 'types', 'company.ts');

/**
 * 内容根。docs/ 搬迁后指向 docs/，搬迁前回落仓库根，
 * 因此这一步和搬迁那一步的 diff 互不依赖，顺序可以调整。
 */
function resolveContentRoot() {
  const underDocs = path.join(REPO_ROOT, 'docs');
  if (fs.existsSync(path.join(underDocs, 'industry'))) return underDocs;
  return REPO_ROOT;
}

export const CONTENT_ROOT = resolveContentRoot();
export const COMPANIES_DIR = path.join(CONTENT_ROOT, 'industry');
