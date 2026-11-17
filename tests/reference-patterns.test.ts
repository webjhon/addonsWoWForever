import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {ROOT,readJSON} from '../src/core.ts';
import {referencePatternContext} from '../src/reference-patterns.ts';
import {messagesFor} from '../src/llm.ts';
const catalog=()=>readJSON(path.join(ROOT,'knowledge/lessons/reference-patterns.json'));
const relevant=r=>r.considered.filter(p=>p.relevant).map(p=>p.id);
test('Every request considers all patterns and only baseline architecture applies to an unrelated feature',()=>{
 const r=referencePatternContext('Alerta simples de experiência');assert.equal(r.considered.length,12);
 assert.deepEqual(relevant(r),['state-authority','event-lifecycle','versioned-data']);assert.equal(r.clientVerified,false);assert.equal(r.status,'STATIC_REFERENCE_ANALYSIS');
 assert.ok(r.considered.every(p=>p.decision==='REQUIRES_PRODUCT_REVIEW'));
});
test('Guide and navigation requests receive their applicable acceptance scenarios',()=>{
 const guide=referencePatternContext('Guia de quests em dungeon');assert.ok(relevant(guide).includes('parallel-objectives'));assert.ok(!relevant(guide).includes('navigation-priority'));
 const arrow=referencePatternContext('Orientação',{apiNamespacesUsed:['GetPlayerFacing','C_Map.GetPlayerMapPosition']});assert.ok(relevant(arrow).includes('navigation-priority'));assert.ok(relevant(arrow).includes('navigation-confidence'));assert.ok(relevant(arrow).includes('recoverable-ui'));
});
test('Generation gets original design summaries while untrusted references remain outside system context',()=>{
 const m=messagesFor('Seta de navegação','UNTRUSTED_RAW_REFERENCE');assert.ok(m[0].content.includes(referencePatternContext('Seta de navegação').instructions));assert.ok(!m[0].content.includes('UNTRUSTED_RAW_REFERENCE'));assert.ok(m[1].content.includes('UNTRUSTED_RAW_REFERENCE'));
});
test('Provenance and reuse policy fail closed instead of granting runtime verification',()=>{
 let c=catalog();c.clientVerified=true;assert.throws(()=>referencePatternContext('',null,{catalog:c}));
 c=catalog();c.reusePolicy='COPY_SOURCE';assert.throws(()=>referencePatternContext('',null,{catalog:c}));
 c=catalog();c.patterns[0].evidence[0].path='market-references/missing.lua';assert.throws(()=>referencePatternContext('',null,{catalog:c}),/provenance/);
 c=catalog();c.snapshots[0].sha256='invalid';assert.throws(()=>referencePatternContext('',null,{catalog:c}),/snapshot/);
 c=catalog();c.patterns[0].code='third-party implementation';assert.throws(()=>referencePatternContext('',null,{catalog:c}),/pattern/);
});
test('Runtime context works without raw reference folders and supports Windows line endings',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'forever-reference-summary-'));
 try{const dir=path.join(root,'.agents/skills/apply-reference-patterns');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'SKILL.md'),fs.readFileSync(path.join(ROOT,'.agents/skills/apply-reference-patterns/SKILL.md'),'utf8').replace(/\r?\n/g,'\r\n'));
 const r=referencePatternContext('Guide',null,{root,catalog:catalog()});assert.equal(r.considered.length,12);assert.ok(!fs.existsSync(path.join(root,'market-references')));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('RAG indexes original summaries as static analysis and never manufactures capability support',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'forever-reference-rag-'));
 try{
 const code="const {indexDocuments}=await import('./rag/indexer.ts');const {openDb,capability}=await import('./src/db.ts');const {searchKnowledge}=await import('./src/search.ts');await indexDocuments({dirs:['knowledge/seed-docs']});const db=openDb();const rows=await searchKnowledge('Zygor RestedXP',{db,limit:30});console.log(JSON.stringify({rows,cap:capability(db,'GetPlayerFacing','70938')}));db.close();";
 const r=spawnSync(process.execPath,['--experimental-strip-types','--input-type=module','-e',code],{cwd:ROOT,env:{...process.env,FACTORY_DATA_DIR:dir},encoding:'utf8'});assert.equal(r.status,0,r.stderr);const data=JSON.parse(r.stdout);assert.ok(data.rows.some(r=>r.source_id==='reference-patterns-zygor-restedxp-2026-11-16'&&r.evidence==='STATIC_REFERENCE_ANALYSIS'));assert.equal(data.cap.status,'UNVERIFIED');assert.ok(data.rows.every(r=>!r.uri?.startsWith('market-references/')));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
