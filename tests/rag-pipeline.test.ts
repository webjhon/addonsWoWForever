import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {spawnSync} from 'node:child_process';
import {ROOT,readJSON,sha} from '../src/core.ts';import {openDb,upsertDoc} from '../src/db.ts';
import {chunkDocument} from '../rag/indexer.ts';import {importVectorStore,exportVectorStore,populateVectors} from '../rag/vector-store.ts';
import {searchKnowledge,cosine} from '../src/search.ts';
const vector=(axis=0)=>Array.from({length:384},(_,i)=>i===axis?1:0);
const document=(id,extra={})=>({id,source_id:'fixture-'+id,domain:'api',title:'Synthetic fixture',content:'Dados de identidade indisponíveis na placa',faction:'Alliance',evidence:'SYNTHETIC_TEST',license:'original',...extra});
function addVector(db,id,v=vector(),model='fixture-local'){const d=db.prepare('SELECT hash FROM docs WHERE id=?').get(id);db.prepare('INSERT OR REPLACE INTO doc_vectors(doc_id,model,vector,content_hash) VALUES(?,?,?,?)').run(id,model,JSON.stringify(v),d.hash);}
test('Chunks retain document/section context and never lose a long paragraph',()=>{
 const text=Array.from({length:300},(_,i)=>'token'+i).join(' ');const chunks=chunkDocument('# Topic\n\n## Contract\n\n'+text,{title:'Quest contract',context:'Unknown does not mean complete',maxCharacters:500});assert.ok(chunks.length>1);assert.ok(chunks.every(c=>c.startsWith('Quest contract — Contract\nContexto: Unknown')));const joined=chunks.join(' ');for(let i=0;i<300;i++)assert.ok(joined.includes('token'+i));
});
test('Unchanged documents receive missing vectors; shrink/removal cleans only the managed file',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'forever-rag-index-'));
 try{
 const code="import fs from 'node:fs';import path from 'node:path';import {indexDocuments} from './rag/indexer.ts';import {openDb,upsertDoc} from './src/db.ts';const docs=path.join(process.env.FACTORY_DATA_DIR,'docs');fs.mkdirSync(docs);const f=path.join(docs,'guide.md');fs.writeFileSync(f,'# Context'+String.fromCharCode(10,10)+Array.from({length:800},(_,i)=>'item'+i).join(' '));const fake=async rows=>rows.map(()=>Array.from({length:384},(_,i)=>i===0?1:0));const a=await indexDocuments({dirs:[docs]});const b=await indexDocuments({dirs:[docs],withEmbeddings:true,embedder:fake,model:'fixture'});const c=await indexDocuments({dirs:[docs],withEmbeddings:true,embedder:fake,model:'fixture'});const db=openDb();upsertDoc(db,{id:'external',source_id:'other-importer',domain:'api',title:'External',content:'Keep this external record',faction:'Alliance'});db.close();fs.writeFileSync(f,'# Context'+String.fromCharCode(10,10)+'Changed short content');const d=await indexDocuments({dirs:[docs]});const after=openDb();const vectors=after.prepare('SELECT COUNT(*) n FROM doc_vectors').get().n;after.close();fs.unlinkSync(f);const e=await indexDocuments({dirs:[docs]});const last=openDb();console.log(JSON.stringify({a,b,c,d,e,vectors,ids:last.prepare('SELECT id FROM docs').all().map(x=>x.id)}));last.close();";
 const r=spawnSync(process.execPath,['--experimental-strip-types','--input-type=module','-e',code],{cwd:ROOT,env:{...process.env,FACTORY_DATA_DIR:dir},encoding:'utf8'});assert.equal(r.status,0,r.stderr);const x=JSON.parse(r.stdout);assert.ok(x.a.changed>1);assert.equal(x.b.vectors,x.a.changed);assert.equal(x.c.vectors,0);assert.equal(x.c.changed,0);assert.ok(x.d.removed>0);assert.equal(x.vectors,0);assert.deepEqual(x.ids,['external']);assert.ok(x.e.removed>0);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('Content changes invalidate vectors before the next semantic search',()=>{
 const db=openDb(':memory:');try{upsertDoc(db,document('a'));addVector(db,'a');upsertDoc(db,document('a',{content:'Novo estado da quest'}));assert.equal(db.prepare('SELECT COUNT(*) n FROM doc_vectors').get().n,0);}finally{db.close();}
});
test('Semantic retrieval preserves faction/access, domain, level, build and license filters',async()=>{
 const db=openDb(':memory:');try{
 const blocked=[['neutral',{faction:'Neutral',alliance_access:false}],['level',{min_level:40}],['build',{build:'different'}],['domain',{domain:'leveling'}],['rights',{license:'proprietary-restricted'}],['horde',{}]];
 upsertDoc(db,document('allowed',{max_level:60,build:'70938'}));addVector(db,'allowed');
 for(const [id,extra]of blocked){upsertDoc(db,document(id,extra));if(id==='horde')db.prepare("UPDATE docs SET faction='Horde' WHERE id=?").run(id);addVector(db,id);}
 const rows=await searchKnowledge('Find unreadable identity',{db,domain:'api',level:26,build:'70938',semantic:true,model:'fixture-local',embedder:async()=>[vector()]});assert.deepEqual(rows.map(r=>r.id),['allowed']);assert.equal(rows[0].method,'semantic');assert.equal(rows[0].evidence,'SYNTHETIC_TEST');
 }finally{db.close();}
});
test('Model/content hash mismatch and malformed vectors cannot create semantic results',async()=>{
 const db=openDb(':memory:');try{upsertDoc(db,document('a'));addVector(db,'a');let calls=0;await assert.rejects(searchKnowledge('Unrelated',{db,semantic:true,model:'other-model',embedder:async()=>{calls++;return[vector()];}}),/No current vectors/);assert.equal(calls,0);db.prepare('UPDATE doc_vectors SET content_hash=?').run('old');await assert.rejects(searchKnowledge('Unrelated',{db,semantic:true,model:'fixture-local'}),/No current vectors/);assert.equal(cosine([0,0],[1,0]),null);assert.equal(cosine([NaN],[1]),null);}finally{db.close();}
});
test('Portable vectors import only matching documents and reject tampering before writes',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'forever-vectors-'));const from=openDb(':memory:'),to=openDb(':memory:');try{
 for(const id of ['a','b']){upsertDoc(from,document(id));addVector(from,id);upsertDoc(to,document(id,id==='b'?{content:'Changed document'}:{}));}
 const m=exportVectorStore({db:from,dir,model:'fixture-local'});assert.equal(m.records,2);const imported=importVectorStore({db:to,dir,model:'fixture-local'});assert.equal(imported.imported,1);assert.equal(imported.skipped,1);
 to.prepare('DELETE FROM doc_vectors').run();fs.appendFileSync(path.join(dir,m.file),'corruption');assert.throws(()=>importVectorStore({db:to,dir,model:'fixture-local'}),/checksum/);assert.equal(to.prepare('SELECT COUNT(*) n FROM doc_vectors').get().n,0);
 }finally{from.close();to.close();fs.rmSync(dir,{recursive:true,force:true});}
});
test('Bad embedding batches never persist invalid vectors',async()=>{
 const db=openDb(':memory:');try{upsertDoc(db,document('a'));await assert.rejects(populateVectors({db,model:'fixture',embedder:async()=>[[0,0]]}),/Invalid embedding/);assert.equal(db.prepare('SELECT COUNT(*) n FROM doc_vectors').get().n,0);}finally{db.close();}
});
test('A cold local model fails before any network request',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'forever-no-network-'));try{const code="globalThis.fetch=async()=>{throw Error('NETWORK_MUST_NOT_BE_USED');};const {embedLocal}=await import('./src/embeddings.ts');try{await embedLocal(['test'],{kind:'query'});process.exitCode=1;}catch(e){console.log(e.message);}";const r=spawnSync(process.execPath,['--experimental-strip-types','--input-type=module','-e',code],{cwd:ROOT,env:{...process.env,FACTORY_DATA_DIR:dir},encoding:'utf8'});assert.equal(r.status,0,r.stderr);assert.match(r.stdout,/not prepared/);assert.ok(!r.stdout.includes('NETWORK_MUST_NOT_BE_USED'));}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('Committed corpus and actual neural snapshot have traceable, finite payloads',()=>{
 const c=readJSON(path.join(ROOT,'rag/corpus-manifest.json'));assert.equal(c.documents.length,44);for(const d of c.documents){const raw=fs.readFileSync(path.join(ROOT,d.path),'utf8').replace(/\r\n/g,'\n');assert.equal(sha(raw),d.sha256);const meta=readJSON(path.join(ROOT,d.path+'.meta.json'));assert.equal(meta.source_id,d.source_id);assert.ok(meta.abstract?.length>100);}
 const api=readJSON(path.join(ROOT,'knowledge/api/forever-contracts.json'));assert.equal(api.records.length,33);assert.ok(api.records.every(r=>r.status==='UNVERIFIED'&&r.source.includes(api.snapshot)));
 const db=openDb(':memory:');try{const r=importVectorStore({db});assert.equal(r.imported,0);assert.ok(r.skipped>0);}finally{db.close();}
});

test('Metadata-only changes update provenance/access and unreviewing removes searchable material',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'forever-rag-meta-'));try{
 const code="import fs from 'node:fs';import path from 'node:path';import {indexDocuments} from './rag/indexer.ts';import {openDb} from './src/db.ts';const docs=path.join(process.env.FACTORY_DATA_DIR,'docs');fs.mkdirSync(docs);const f=path.join(docs,'topic.md');fs.writeFileSync(f,'Public quest observation');fs.writeFileSync(f+'.meta.json',JSON.stringify({source_id:'first',title:'Topic',domain:'api',reviewed:true}));await indexDocuments({dirs:[docs]});fs.writeFileSync(f+'.meta.json',JSON.stringify({source_id:'updated',title:'Topic',domain:'leveling',min_level:20,reviewed:true}));await indexDocuments({dirs:[docs]});const db=openDb();const row=db.prepare('SELECT source_id,domain,min_level FROM docs').get();db.close();fs.writeFileSync(f+'.meta.json',JSON.stringify({source_id:'updated',reviewed:false}));await indexDocuments({dirs:[docs]});const last=openDb();console.log(JSON.stringify({row,count:last.prepare('SELECT COUNT(*) n FROM docs').get().n}));last.close();";
 const r=spawnSync(process.execPath,['--experimental-strip-types','--input-type=module','-e',code],{cwd:ROOT,env:{...process.env,FACTORY_DATA_DIR:dir},encoding:'utf8'});assert.equal(r.status,0,r.stderr);const x=JSON.parse(r.stdout);assert.deepEqual(x.row,{source_id:'updated',domain:'leveling',min_level:20});assert.equal(x.count,0);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
