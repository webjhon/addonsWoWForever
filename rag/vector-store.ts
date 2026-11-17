import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import {ROOT,sha,writeJSON} from '../src/core.ts';
import {openDb} from '../src/db.ts';
import {embedLocal,MODEL_KEY,EMBEDDING,validVector,disposeEmbedder} from '../src/embeddings.ts';
const allowed="alliance_access=1 AND faction IN ('Alliance','Neutral') AND license NOT IN ('proprietary-restricted','unknown-license-copy')";
export async function populateVectors({db=null,embedder=embedLocal,model=MODEL_KEY,dimensions=EMBEDDING.dimensions,onProgress=null}={}){
 const own=!db;db??=openDb();let created=0;
 try{const rows=db.prepare('SELECT d.* FROM docs d LEFT JOIN doc_vectors v ON v.doc_id=d.id WHERE '+allowed.replaceAll('alliance_access','d.alliance_access').replaceAll('faction','d.faction').replaceAll('license','d.license')+' AND (v.doc_id IS NULL OR v.model<>? OR v.content_hash IS NULL OR v.content_hash<>d.hash) ORDER BY d.id').all(model);
 for(let i=0;i<rows.length;i+=8){const batch=rows.slice(i,i+8),vectors=await embedder(batch.map(d=>d.content),{kind:'passage'});if(vectors.length!==batch.length||vectors.some(v=>!validVector(v,dimensions)))throw Error('Invalid embedding batch');
 db.exec('BEGIN');try{for(let n=0;n<batch.length;n++)db.prepare('INSERT OR REPLACE INTO doc_vectors(doc_id,model,vector,content_hash) VALUES(?,?,?,?)').run(batch[n].id,model,JSON.stringify(vectors[n]),batch[n].hash);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}created+=batch.length;onProgress?.({created,total:rows.length});}
 return {created,model};
 }finally{if(own)db.close();}
}
export function exportVectorStore({db=null,dir=path.join(ROOT,'rag/vector-store'),model=MODEL_KEY,dimensions=EMBEDDING.dimensions}={}){
 const own=!db;db??=openDb();try{
 const records=db.prepare('SELECT d.id,d.hash,v.vector FROM docs d JOIN doc_vectors v ON v.doc_id=d.id WHERE v.model=? AND v.content_hash=d.hash AND '+allowed+' ORDER BY d.id').all(model).map(r=>({id:r.id,contentHash:r.hash,embedding:JSON.parse(r.vector).map(x=>Number(x.toFixed(7)))}));
 if(records.some(r=>!validVector(r.embedding,dimensions)))throw Error('Cannot export invalid vectors');
 fs.mkdirSync(dir,{recursive:true});const compressed=zlib.gzipSync(records.map(r=>JSON.stringify(r)).join('\n')+'\n');const filename='forever-e5.jsonl.gz';fs.writeFileSync(path.join(dir,filename+'.tmp'),compressed);fs.renameSync(path.join(dir,filename+'.tmp'),path.join(dir,filename));
 const manifest={schemaVersion:1,provider:'local-transformers',model,dimensions,records:records.length,file:filename,sha256:sha(compressed),contentSetHash:sha(JSON.stringify(records.map(({id,contentHash})=>({id,contentHash})))),format:'gzip-jsonl',sourceModel:EMBEDDING.model,revision:EMBEDDING.revision,clientVerified:false};writeJSON(path.join(dir,'manifest.json'),manifest);return manifest;
 }finally{if(own)db.close();}
}
export function importVectorStore({db=null,dir=path.join(ROOT,'rag/vector-store'),model=MODEL_KEY}={}){
 if(!fs.existsSync(path.join(dir,'manifest.json')))return {imported:0,skipped:0,status:'NO_SNAPSHOT'};
 const own=!db;db??=openDb();try{
 const m=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));if(m.schemaVersion!==1||m.clientVerified!==false||m.model!==model||m.dimensions!==384||m.file!=='forever-e5.jsonl.gz'||m.records<0||m.records>100000)throw Error('Invalid vector manifest');
 const compressed=fs.readFileSync(path.join(dir,m.file));if(sha(compressed)!==m.sha256)throw Error('Vector snapshot checksum mismatch');
 const lines=zlib.gunzipSync(compressed,{maxOutputLength:100000000}).toString('utf8').trim();const rows=lines?lines.split('\n').map(s=>JSON.parse(s)):[];
 if(rows.length!==m.records||new Set(rows.map(r=>r.id)).size!==rows.length||rows.some(r=>typeof r.id!=='string'||!validVector(r.embedding,m.dimensions)||!/^([a-f0-9]{64})$/.test(r.contentHash))||sha(JSON.stringify(rows.map(({id,contentHash})=>({id,contentHash}))))!==m.contentSetHash)throw Error('Invalid vector snapshot rows');
 let imported=0,skipped=0;db.exec('BEGIN');try{for(const row of rows){const d=db.prepare('SELECT hash FROM docs WHERE id=? AND '+allowed).get(row.id);if(d?.hash!==row.contentHash){skipped++;continue;}db.prepare('INSERT OR REPLACE INTO doc_vectors(doc_id,model,vector,content_hash) VALUES(?,?,?,?)').run(row.id,model,JSON.stringify(row.embedding),row.contentHash);imported++;}db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}
 return {imported,skipped,status:'IMPORTED_HASH_MATCHED'};
 }finally{if(own)db.close();}
}
export async function buildVectorStore(){const populated=await populateVectors({onProgress:p=>process.stderr.write(JSON.stringify(p)+'\n')});const exported=exportVectorStore();await disposeEmbedder();return {populated,exported};}
