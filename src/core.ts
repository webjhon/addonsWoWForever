import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
export const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
export const DATA_DIR = process.env.FACTORY_DATA_DIR ? path.resolve(process.env.FACTORY_DATA_DIR) : path.join(ROOT, '.data');
export const LEVEL_MIN = 1, LEVEL_MAX = 60, FACTION = 'Alliance';
export function ensureDir(dir) { fs.mkdirSync(dir, {recursive:true}); return dir; }
export function readJSON(p, fallback = undefined) { try { return JSON.parse(fs.readFileSync(p,'utf8')); } catch(e) { if(fallback !== undefined && e.code === 'ENOENT') return fallback; throw e; } }
export function writeJSON(p, data) { ensureDir(path.dirname(p)); const temp=p+'.tmp-'+process.pid; fs.writeFileSync(temp,JSON.stringify(data,null,2)+'\n'); fs.renameSync(temp,p); }
export function now() { return new Date().toISOString(); }
export function sha(data) { return crypto.createHash('sha256').update(data).digest('hex'); }
export function safeWithin(base, rel) {
  if(typeof rel !== 'string' || !rel || path.isAbsolute(rel) || rel.includes('\\') || rel.includes('\0')) throw new Error('Invalid relative path');
  const normalized = path.posix.normalize(rel);
  if(normalized === '..' || normalized.startsWith('../') || normalized.startsWith('/') || normalized.includes('/../')) throw new Error('Path traversal');
  const target=path.resolve(base, normalized);
  if(!target.startsWith(path.resolve(base)+path.sep)) throw new Error('Escaping base directory');
  let current=base;
  for(const segment of normalized.split('/')) { current=path.join(current,segment); if(fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) throw new Error('Symbolic link not allowed'); }
  return target;
}
export function appendTrace(event, details={}) {
  const target=path.join(ROOT,'traces','build-logs.jsonl'); ensureDir(path.dirname(target));
  fs.appendFileSync(target, JSON.stringify({at:now(),event,...details})+'\n');
}
export function requireName(name) { if(typeof name!=='string'||!/^[A-Za-z][A-Za-z0-9_]{2,55}$/.test(name)) throw new Error('Addon name must match ^[A-Za-z][A-Za-z0-9_]{2,55}$'); return name; }
export function quitError(err) { console.error('ERROR:',err?.message || err); process.exitCode=1; }
