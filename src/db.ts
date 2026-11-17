import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { DATA_DIR, ensureDir, now, sha } from './core.ts';
const SCHEMA = `
PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS schema_migrations(version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS source_records(id TEXT PRIMARY KEY, uri TEXT, title TEXT, license TEXT NOT NULL DEFAULT 'unknown', reviewed INTEGER NOT NULL DEFAULT 0, at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS docs(id TEXT PRIMARY KEY, source_id TEXT NOT NULL, domain TEXT NOT NULL, title TEXT NOT NULL, content TEXT NOT NULL, hash TEXT NOT NULL, faction TEXT NOT NULL DEFAULT 'Alliance', alliance_access INTEGER NOT NULL DEFAULT 1, min_level INTEGER NOT NULL DEFAULT 1, max_level INTEGER NOT NULL DEFAULT 60, build TEXT, evidence TEXT NOT NULL DEFAULT 'UNKNOWN', license TEXT NOT NULL DEFAULT 'original', uri TEXT, updated_at TEXT NOT NULL);
CREATE VIRTUAL TABLE IF NOT EXISTS docs_fts USING fts5(title, content, content='docs', content_rowid='rowid', tokenize='unicode61');
CREATE TRIGGER IF NOT EXISTS docs_ai AFTER INSERT ON docs BEGIN INSERT INTO docs_fts(rowid,title,content) VALUES(new.rowid,new.title,new.content); END;
CREATE TRIGGER IF NOT EXISTS docs_ad AFTER DELETE ON docs BEGIN INSERT INTO docs_fts(docs_fts,rowid,title,content) VALUES('delete',old.rowid,old.title,old.content); END;
CREATE TRIGGER IF NOT EXISTS docs_au AFTER UPDATE ON docs BEGIN INSERT INTO docs_fts(docs_fts,rowid,title,content) VALUES('delete',old.rowid,old.title,old.content); INSERT INTO docs_fts(rowid,title,content) VALUES(new.rowid,new.title,new.content); END;
CREATE TABLE IF NOT EXISTS doc_vectors(doc_id TEXT PRIMARY KEY REFERENCES docs(id) ON DELETE CASCADE, model TEXT NOT NULL, vector TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS indexed_files(path TEXT PRIMARY KEY, doc_ids TEXT NOT NULL, fingerprint TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS entities(id TEXT PRIMARY KEY, kind TEXT NOT NULL, name TEXT NOT NULL, faction TEXT NOT NULL, alliance_access INTEGER NOT NULL DEFAULT 0, min_level INTEGER NOT NULL DEFAULT 1, max_level INTEGER NOT NULL DEFAULT 60, build TEXT, source_id TEXT NOT NULL, evidence TEXT NOT NULL, payload TEXT NOT NULL DEFAULT '{}', updated_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_entity_scope ON entities(kind,faction,alliance_access,min_level,max_level);
CREATE TABLE IF NOT EXISTS relations(id TEXT PRIMARY KEY, from_id TEXT NOT NULL REFERENCES entities(id), to_id TEXT NOT NULL REFERENCES entities(id), relation TEXT NOT NULL, source_id TEXT NOT NULL, UNIQUE(from_id,to_id,relation));
CREATE TABLE IF NOT EXISTS capabilities(id TEXT PRIMARY KEY, status TEXT NOT NULL, build TEXT, apis TEXT NOT NULL DEFAULT '[]', events TEXT NOT NULL DEFAULT '[]', restrictions TEXT NOT NULL DEFAULT '[]', alternatives TEXT NOT NULL DEFAULT '[]', evidence TEXT NOT NULL DEFAULT '[]', updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS memories(id TEXT PRIMARY KEY, kind TEXT NOT NULL, addon TEXT, title TEXT NOT NULL, body TEXT NOT NULL, evidence TEXT NOT NULL DEFAULT '[]', build TEXT, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_memory_scope ON memories(kind,addon);
CREATE TABLE IF NOT EXISTS test_results(id TEXT PRIMARY KEY, addon TEXT NOT NULL, status TEXT NOT NULL, details TEXT NOT NULL, at TEXT NOT NULL);
`;
export function openDb(filename=path.join(DATA_DIR,'factory.sqlite')) {
  ensureDir(path.dirname(filename)); const db=new DatabaseSync(filename);
  db.exec(SCHEMA);
  if(!db.prepare('PRAGMA table_info(doc_vectors)').all().some(c=>c.name==='content_hash'))db.exec('ALTER TABLE doc_vectors ADD COLUMN content_hash TEXT');
  db.prepare('INSERT OR IGNORE INTO schema_migrations(version,applied_at) VALUES(1,?)').run(now());
  return db;
}
export function upsertDoc(db, doc) {
  if(!doc.id||!doc.source_id||!doc.domain||!doc.title||!doc.content) throw new Error('Document fields missing');
  if(doc.faction==='Horde') throw new Error('Horde data forbidden in operational RAG');
  const h=sha(doc.content);
  const old=db.prepare('SELECT hash FROM docs WHERE id=?').get(doc.id);
  if(old&&old.hash!==h)db.prepare('DELETE FROM doc_vectors WHERE doc_id=?').run(doc.id);
  db.prepare(`INSERT INTO docs(id,source_id,domain,title,content,hash,faction,alliance_access,min_level,max_level,build,evidence,license,uri,updated_at)
  VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET source_id=excluded.source_id, domain=excluded.domain,title=excluded.title,content=excluded.content,hash=excluded.hash,faction=excluded.faction,alliance_access=excluded.alliance_access,min_level=excluded.min_level,max_level=excluded.max_level,build=excluded.build,evidence=excluded.evidence,license=excluded.license,uri=excluded.uri,updated_at=excluded.updated_at`).run(
  doc.id,doc.source_id,doc.domain,doc.title,doc.content,h,doc.faction||'Alliance',doc.alliance_access===false?0:1,doc.min_level??1,doc.max_level??60,doc.build||null,doc.evidence||'UNKNOWN',doc.license||'original',doc.uri||null,now());
  return doc.id;
}
export function upsertEntity(db,e) {
  if(!e.id || !e.kind || !e.name || !e.source_id || !e.evidence) throw new Error('Entity requires id, kind, name, source_id, evidence');
  if(!['Alliance','Neutral','Horde'].includes(e.faction)) throw new Error('Invalid faction');
  const allowed=e.faction==='Alliance'||(e.faction==='Neutral'&&e.alliance_access===true);
  db.prepare(`INSERT INTO entities(id,kind,name,faction,alliance_access,min_level,max_level,build,source_id,evidence,payload,updated_at)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name, faction=excluded.faction,alliance_access=excluded.alliance_access,min_level=excluded.min_level,max_level=excluded.max_level,build=excluded.build,source_id=excluded.source_id,evidence=excluded.evidence,payload=excluded.payload,updated_at=excluded.updated_at`).run(e.id,e.kind,e.name,e.faction,allowed?1:0,e.min_level??1,e.max_level??60,e.build||null,e.source_id,e.evidence,JSON.stringify(e.payload||{}),now());
}
export function queryAlliance(db,{kind,level=1,q='',build}={}) {
  if(!Number.isInteger(level)||level<1||level>60) throw new Error('Level out of scope');
  let sql=`SELECT * FROM entities WHERE faction IN ('Alliance','Neutral') AND alliance_access=1 AND min_level<=? AND max_level>=?`;
  const args=[level,level];
  if(kind) {sql+=' AND kind=?';args.push(kind);}
  if(q) {sql+=' AND name LIKE ?';args.push('%'+q.replace(/[%_]/g,'')+'%');}
  if(build) {sql+=' AND (build IS NULL OR build=?)';args.push(build);}
  sql+=' ORDER BY kind,name LIMIT 100';
  return db.prepare(sql).all(...args).map(r=>({...r,payload:JSON.parse(r.payload)}));
}
export function linkEntities(db,e) {
  for(const k of ['id','from_id','to_id','relation','source_id']) if(!e[k]) throw new Error('Missing relation '+k);
  const src=db.prepare('SELECT alliance_access FROM entities WHERE id=?').get(e.from_id);
  const dst=db.prepare('SELECT alliance_access FROM entities WHERE id=?').get(e.to_id);
  if(!src?.alliance_access||!dst?.alliance_access) throw new Error('Relation includes an inaccessible entity');
  db.prepare('INSERT OR REPLACE INTO relations(id,from_id,to_id,relation,source_id) VALUES(?,?,?,?,?)').run(e.id,e.from_id,e.to_id,e.relation,e.source_id);
}
export function getRelations(db,id) {return db.prepare(`SELECT r.relation, e.id,e.name,e.kind,e.faction FROM relations r JOIN entities e ON e.id=r.to_id WHERE r.from_id=? AND e.alliance_access=1`).all(id);}
export function recordMemory(db,kind,title,body,{addon=null,evidence=[],build=null}={}) {
  const id=sha(kind+title+addon+body).slice(0,20);
  db.prepare('INSERT OR REPLACE INTO memories(id,kind,addon,title,body,evidence,build,created_at) VALUES(?,?,?,?,?,?,?,?)').run(id,kind,addon,title,body,JSON.stringify(evidence),build,now());return id;
}
export function getMemories(db,{kind,addon,limit=20}={}) {
  let q='SELECT * FROM memories WHERE 1=1';const args=[];
  if(kind){q+=' AND kind=?';args.push(kind);}
  if(addon){q+=' AND (addon=? OR addon IS NULL)';args.push(addon);}
  q+=' ORDER BY created_at DESC LIMIT ?';args.push(Math.max(1,Math.min(100,limit)));
  return db.prepare(q).all(...args).map(r=>({...r,evidence:JSON.parse(r.evidence)}));
}
export function capability(db,id,build) {
  const row=db.prepare('SELECT * FROM capabilities WHERE id=?').get(id);
  if(!row || (row.build && (!build || row.build!==build))) return {id,status:'UNVERIFIED',reason:'No verified capability for this build',evidence:[]};
  return {...row,apis:JSON.parse(row.apis),events:JSON.parse(row.events),restrictions:JSON.parse(row.restrictions),alternatives:JSON.parse(row.alternatives),evidence:JSON.parse(row.evidence)};
}
export function setCapability(db,c) {
  if(!['SUPPORTED','SUPPORTED_WITH_LIMITATIONS','UNVERIFIED','UNSUPPORTED','PROHIBITED'].includes(c.status)) throw new Error('Bad capability status');
  if(c.status.startsWith('SUPPORTED') && (!Array.isArray(c.evidence)||c.evidence.length===0)) throw new Error('Supported capabilities require evidence');
  db.prepare(`INSERT OR REPLACE INTO capabilities(id,status,build,apis,events,restrictions,alternatives,evidence,updated_at) VALUES(?,?,?,?,?,?,?,?,?)`).run(c.id,c.status,c.build||null,JSON.stringify(c.apis||[]),JSON.stringify(c.events||[]),JSON.stringify(c.restrictions||[]),JSON.stringify(c.alternatives||[]),JSON.stringify(c.evidence||[]),now());
}
