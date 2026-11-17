import fs from 'node:fs';
import {accessFlags} from '../src/factions.ts';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ROOT,sha,readJSON} from '../src/core.ts';
import {openDb,upsertDoc} from '../src/db.ts';
import {embedLocal,MODEL_KEY,validVector,RAG_CONFIG} from '../src/embeddings.ts';
function files(dir){if(!fs.existsSync(dir))return[];return fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?files(path.join(dir,x.name)):x.isFile()&&/\.(md|txt)$/i.test(x.name)?[path.join(dir,x.name)]:[]);}
export function chunkDocument(raw,{title='Document',maxCharacters=RAG_CONFIG.chunking.maxCharacters,context='' }={}){
 if(!Number.isInteger(maxCharacters)||maxCharacters<200)throw Error('Invalid chunk size');
 const chunks=[];let section='',body='';
 const flush=()=>{if(body.trim())chunks.push(title+(section?' — '+section:'')+(context?'\nContexto: '+context:'')+'\n\n'+body.trim());body='';};
 for(const paragraph of raw.replace(/\r\n/g,'\n').split(/\n\s*\n/)){
  if(/^#{1,6} /.test(paragraph)&&!paragraph.includes('\n')){flush();section=paragraph.replace(/^#+ /,'');continue;}
  let remaining=paragraph.trim();
  while(remaining){const room=maxCharacters-body.length;if(room<80){flush();continue;}if(remaining.length<=room){body+=(body?'\n\n':'')+remaining;break;}
   let cut=remaining.lastIndexOf(' ',room);if(cut<room/2)cut=room;body+=(body?'\n\n':'')+remaining.slice(0,cut);remaining=remaining.slice(cut).trim();flush();
  }
 }
 flush();return chunks;
}
const forbidden=['proprietary-restricted','unknown-license-copy'];
export async function indexDocuments({withEmbeddings=false,dirs=[path.join(ROOT,'rag/raw-docs'),path.join(ROOT,'knowledge/seed-docs')],embedder=embedLocal,model=MODEL_KEY,dimensions=384}={}) {
 const db=openDb();let changed=0,skipped=0,vectors=0,removed=0;const managedIDs=[];
 try{
 const roots=dirs.map(d=>path.resolve(d));const manifest=readJSON(path.join(ROOT,'knowledge/sources/manifest.json'),{});
 // Read/validate the full plan before changing prior records.
 const plan=roots.flatMap(files).sort().map(f=>{const rel=path.relative(ROOT,f).replaceAll('\\','/'),raw=fs.readFileSync(f,'utf8'),meta=readJSON(f+'.meta.json',{});
 const allowed=!forbidden.includes(meta.license)&&(accessFlags({...meta,faction:meta.faction||'Alliance'}).alliance||accessFlags({...meta,faction:meta.faction||'Alliance'}).horde)&&meta.reviewed!==false&&manifest[meta.source_id]?.reviewed!==false;
 return {rel,meta,fingerprint:sha(raw+JSON.stringify(meta)),chunks:allowed?chunkDocument(raw,{title:meta.title||path.basename(f),context:meta.abstract||''}):[]};});
 const currentPaths=new Set(plan.map(f=>f.rel));db.exec('BEGIN');
 try{
 for(const old of db.prepare('SELECT * FROM indexed_files').all()){
  const absolute=path.resolve(ROOT,old.path);const inScope=roots.some(dir=>{const r=path.relative(dir,absolute);return r!==''&&!r.startsWith('..')&&!path.isAbsolute(r);});
  if(inScope&&!currentPaths.has(old.path)){for(const id of JSON.parse(old.doc_ids)){db.prepare('DELETE FROM docs WHERE id=?').run(id);removed++;}db.prepare('DELETE FROM indexed_files WHERE path=?').run(old.path);}
 }
 for(const {rel,meta,fingerprint,chunks} of plan){
  const ids=chunks.map((_,n)=>sha(rel+':'+n).slice(0,24));const old=db.prepare('SELECT * FROM indexed_files WHERE path=?').get(rel);
  if(!old){for(let n=chunks.length;n<10000;n++){const id=sha(rel+':'+n).slice(0,24);if(!db.prepare('SELECT id FROM docs WHERE id=?').get(id))break;db.prepare('DELETE FROM docs WHERE id=?').run(id);removed++;}}
  if(old)for(const id of JSON.parse(old.doc_ids))if(!ids.includes(id)){db.prepare('DELETE FROM docs WHERE id=?').run(id);removed++;}
  for(let n=0;n<chunks.length;n++){const id=ids[n],content=chunks[n],existing=db.prepare('SELECT hash FROM docs WHERE id=?').get(id);
   if(existing?.hash===sha(content)&&old?.fingerprint===fingerprint)skipped++;else {upsertDoc(db,{id,source_id:meta.source_id||rel,domain:meta.domain||'api',title:meta.title||path.basename(rel),content,faction:meta.faction||'Alliance',alliance_access:meta.alliance_access!==false,horde_access:meta.horde_access===true,min_level:meta.min_level??1,max_level:meta.max_level??60,build:meta.build||null,evidence:meta.evidence||'COMMUNITY_UNVERIFIED',license:meta.license||'original',uri:meta.uri||null});changed++;}
   managedIDs.push(id);
  }
  db.prepare('INSERT OR REPLACE INTO indexed_files(path,doc_ids,fingerprint) VALUES(?,?,?)').run(rel,JSON.stringify(ids),fingerprint);
 }
 db.exec('COMMIT');
 }catch(e){db.exec('ROLLBACK');throw e;}
 if(withEmbeddings){
  const pending=managedIDs.map(id=>db.prepare('SELECT d.id,d.content,d.hash FROM docs d LEFT JOIN doc_vectors v ON v.doc_id=d.id WHERE d.id=? AND (v.doc_id IS NULL OR v.model<>? OR v.content_hash IS NULL OR v.content_hash<>d.hash)').get(id,model)).filter(Boolean);
  for(let i=0;i<pending.length;i+=8){const batch=pending.slice(i,i+8),rows=await embedder(batch.map(d=>d.content),{kind:'passage'});if(rows.length!==batch.length||rows.some(v=>!validVector(v,dimensions)))throw Error('Invalid embeddings');for(let n=0;n<batch.length;n++){db.prepare('INSERT OR REPLACE INTO doc_vectors(doc_id,model,vector,content_hash) VALUES(?,?,?,?)').run(batch[n].id,model,JSON.stringify(rows[n]),batch[n].hash);vectors++;}}
 }
 return {changed,skipped,vectors,removed};
 }finally{db.close();}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))indexDocuments({withEmbeddings:process.argv.includes('--embeddings')}).then(console.log).catch(e=>{console.error(e);process.exitCode=1;});
