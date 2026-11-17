import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {ROOT} from '../src/core.ts';
import {openDb,upsertEntity,linkEntities,queryAlliance} from '../src/db.ts';
import {searchKnowledge} from '../src/search.ts';
import {loadKnowledgePack,validateKnowledgePack,knowledgeCoverage,importKnowledgePack,entityContext} from '../knowledge/ingest/wowhead-forever.ts';
import {dispatch} from '../mcp/server.ts';
const pack=()=>structuredClone(loadKnowledgePack());
function temp(){return fs.mkdtempSync(path.join(os.tmpdir(),'wowhead-knowledge-'));}
function clean(dir){assert.ok(path.resolve(dir).startsWith(path.resolve(os.tmpdir())+path.sep));assert.ok(path.basename(dir).startsWith('wowhead-knowledge-'));fs.rmSync(dir,{recursive:true,force:true});}
async function database(fn){const dir=temp(),db=openDb(path.join(dir,'test.sqlite'));try{await fn(db);}finally{db.close();clean(dir);}}

test('reviewed factual pack has typed data, individual IDs and explicit incomplete coverage',()=>{
 const b=pack(),r=validateKnowledgePack(b),c=knowledgeCoverage(b);
 assert.equal(r.records,176);assert.equal(c.counts.quest,72);assert.equal(c.sources,89);assert.equal(c.relations,124);
 assert.deepEqual(JSON.parse(fs.readFileSync(path.join(ROOT,'knowledge/gaps/wowhead-forever.json'),'utf8')),c);
 assert.equal(c.complete,false);assert.equal(c.clientVerified,false);assert.equal(c.unknownRequirements.quest,5);
 assert.equal(c.counts.flight_master,0);assert.equal(c.counts.object,0);assert.equal(c.counts.ability,0);
 assert.ok(b.records.every(r=>r.faction!=='Horde'&&r.build===null&&r.evidence==='COMMUNITY_UNVERIFIED'));
 assert.equal(b.records.find(r=>r.id==='whf:quest:95250').facts.required_level,null);
 assert.ok(b.records.filter(r=>r.facts.recommended_range).every(r=>r.facts.range_type==='EDITORIAL_RECOMMENDATION'));
});
test('schema blocks copied page prose, arbitrary fields and unsupported coordinates',()=>{
 for(const change of [r=>r.description='copied page',r=>r.facts.guide_steps=['copied guide'],r=>r.facts.coordinates=[12,34],r=>r.facts.required_level=61]){
  const b=pack();change(b.records[0]);assert.throws(()=>validateKnowledgePack(b),/schema/i);
 }
});
test('source URLs must stay on Forever and never become unreviewed sources',()=>{
 for(const url of ['https://www.wowhead.com/classic/quest=168','https://www.wowhead.com.evil.test/forever/quest=168','https://user:pass@www.wowhead.com/forever/quest=168','https://www.wowhead.com/forever/quest=168?token=private']){
  const b=pack();b.manifest.sources[0].uri=url;assert.throws(()=>validateKnowledgePack(b));
 }
 const b=pack();b.manifest.sources[0].reviewed=false;assert.throws(()=>validateKnowledgePack(b),/schema/i);
 const invalidDate=pack();invalidDate.manifest.sources[0].accessed_at='2026-02-31';assert.throws(()=>validateKnowledgePack(invalidDate),/Invalid source date/);
});
test('IDs require matching individual source and every known field needs provenance',()=>{
 let b=pack();const q=b.records.find(r=>r.game_id===168);q.game_id=999999;assert.throws(()=>validateKnowledgePack(b),/matching individual source/);
 b=pack();delete b.records.find(r=>r.game_id===168).field_sources.game_id;assert.throws(()=>validateKnowledgePack(b),/field provenance/);
 b=pack();b.records[0].source_ids=['whf:source:missing'];assert.throws(()=>validateKnowledgePack(b),/Unknown source/);
 b=pack();b.records[0].field_sources.name=['whf:source:missing'];assert.throws(()=>validateKnowledgePack(b),/Unknown source/);
});
test('unproven faction access and unearned client verification cannot be imported',()=>{
 for(const mutate of [r=>r.faction='Horde',r=>{r.faction='Unknown';r.alliance_access=true;},r=>r.evidence='CONFIRMED_IN_CLIENT',r=>r.build='70938']){
  const b=pack();mutate(b.records[0]);assert.throws(()=>validateKnowledgePack(b));
 }
});
test('duplicate entities, conflicting identifiers and dangling graph endpoints are rejected',()=>{
 let b=pack();b.records.push(structuredClone(b.records[0]));assert.throws(()=>validateKnowledgePack(b),/Duplicate entity/);
 b=pack();const original=b.records.find(r=>r.game_id===168),copy=structuredClone(original);copy.id='whf:quest:copy';b.records.push(copy);assert.throws(()=>validateKnowledgePack(b),/Duplicate in-game/);
 b=pack();b.relations[0].to_id='whf:quest:nonexistent';assert.throws(()=>validateKnowledgePack(b),/Dangling/);
});
test('prerequisite cycles and duplicate edges cannot be mistaken for usable chains',()=>{
 let b=pack();const edge=b.relations.find(r=>r.type==='requires_quest');b.relations.push({...edge,from_id:edge.to_id,to_id:edge.from_id});assert.throws(()=>validateKnowledgePack(b),/Cyclic/);
 b=pack();b.relations.push(structuredClone(b.relations[0]));assert.throws(()=>validateKnowledgePack(b),/Duplicate relation/);
});
test('first import indexes entities, source records, relations and level-aware factual RAG',()=>database(async db=>{
 const r=importKnowledgePack(db);assert.equal(r.changed,true);
 assert.equal(db.prepare('SELECT count(*) n FROM entities').get().n,176);
 assert.equal(db.prepare('SELECT count(*) n FROM source_records').get().n,89);
 assert.ok(queryAlliance(db,{kind:'quest',q:'Power Overwhelming',level:24}).some(r=>r.payload.game_id===92489));
 const docs=await searchKnowledge('Overwhelming',{db,domain:'leveling',level:24});assert.equal(docs.length,1);assert.match(docs[0].uri,/quest=92489/);assert.equal(docs[0].evidence,'COMMUNITY_UNVERIFIED');
 assert.equal((await searchKnowledge('Overwhelming',{db,domain:'leveling',level:23})).length,0);
 assert.equal((await searchKnowledge('Overwhelming',{db,domain:'api',level:60})).length,0);
}));
test('reimport is idempotent and does not rewrite unchanged import evidence',()=>database(db=>{
 const a=importKnowledgePack(db),stamp=db.prepare('SELECT imported_at FROM knowledge_imports').get().imported_at;
 const b=importKnowledgePack(db);assert.equal(b.changed,false);assert.equal(a.hash,b.hash);assert.equal(db.prepare('SELECT imported_at FROM knowledge_imports').get().imported_at,stamp);
 assert.equal(db.prepare('SELECT count(*) n FROM docs').get().n,176);
}));
test('updated pack removes retired entities, relations and their old FTS documents only',()=>database(async db=>{
 upsertEntity(db,{id:'external:quest',kind:'quest',name:'External record',faction:'Alliance',source_id:'external',evidence:'SYNTHETIC_TEST'});
 importKnowledgePack(db);const b=pack();b.manifest.revision='2026-11-15.2';b.records=b.records.filter(r=>r.id!=='whf:quest:92489');b.relations=b.relations.filter(r=>r.from_id!=='whf:quest:92489'&&r.to_id!=='whf:quest:92489');
 importKnowledgePack(db,b);assert.equal(entityContext(db,'whf:quest:92489'),null);assert.ok(entityContext(db,'external:quest'));
 assert.equal((await searchKnowledge('Overwhelming',{db,level:60})).length,0);
}));
test('unknown faction records and their edges never enter operational SQL or RAG',()=>database(async db=>{
 const b=pack(),r=b.records.find(r=>r.game_id===92489);r.faction='Unknown';r.alliance_access=false;
 const imported=importKnowledgePack(db,b);assert.ok(imported.quarantined.includes(r.id));assert.equal(entityContext(db,r.id),null);
 assert.equal((await searchKnowledge('Overwhelming',{db,level:60})).length,0);
 assert.equal(db.prepare('SELECT count(*) n FROM relations WHERE from_id=? OR to_id=?').get(r.id,r.id).n,0);
}));
test('invalid update fails before writes and database constraint failures roll back the entire replacement',()=>database(db=>{
 importKnowledgePack(db);const before=db.prepare('SELECT hash FROM knowledge_imports').get().hash;
 let b=pack();b.records[0].source_ids=['whf:source:missing'];assert.throws(()=>importKnowledgePack(db,b));assert.equal(db.prepare('SELECT hash FROM knowledge_imports').get().hash,before);
 upsertEntity(db,{id:'external:quest',kind:'quest',name:'External dependency',faction:'Alliance',source_id:'external',evidence:'SYNTHETIC_TEST'});
 linkEntities(db,{id:'external:relation',from_id:'external:quest',to_id:'whf:quest:92489',relation:'depends_on',source_id:'external'});
 b=pack();b.manifest.revision='2026-11-15.2';assert.throws(()=>importKnowledgePack(db,b),/FOREIGN KEY/);
 assert.equal(db.prepare('SELECT hash FROM knowledge_imports').get().hash,before);assert.ok(entityContext(db,'whf:quest:92489'));
}));
test('entity planning context preserves unknown eligibility and both graph directions',()=>database(db=>{
 importKnowledgePack(db);const q=entityContext(db,'whf:quest:92489',{level:1});assert.equal(q.meetsReferenceMinimum,false);assert.equal(q.availability,'UNVERIFIED');assert.equal(q.graphComplete,false);
 assert.ok(q.relations.some(r=>r.relation==='given_by'&&r.to_id==='whf:npc:5694'));
 assert.ok(entityContext(db,'whf:npc:5694').relations.some(r=>r.direction==='incoming'));
 assert.equal(entityContext(db,'whf:quest:95250').meetsReferenceMinimum,null);
 assert.throws(()=>entityContext(db,q.id,{level:61}));
}));
test('MCP exposes coverage and entity lookup as distinct discovery capabilities',async()=>{
 const listed=await dispatch({jsonrpc:'2.0',id:21,method:'tools/list'});
 assert.ok(listed.result.tools.some(t=>t.name==='get_knowledge_coverage'));assert.ok(listed.result.tools.some(t=>t.name==='get_gameplay_entity'));
 const r=await dispatch({jsonrpc:'2.0',id:22,method:'tools/call',params:{name:'get_knowledge_coverage',arguments:{}}});
 const coverage=JSON.parse(r.result.content[0].text);assert.equal(coverage.counts.quest,72);assert.equal(coverage.complete,false);
});
test('index CLI actually runs on Windows and can be invoked again without duplicated documents',()=>{
 const dir=temp();try{
  const env={...process.env,FACTORY_DATA_DIR:dir};
  for(let i=0;i<2;i++){
   const r=spawnSync(process.execPath,['--experimental-strip-types','rag/indexer.ts'],{cwd:ROOT,env,encoding:'utf8',timeout:30000});
   assert.equal(r.status,0,r.stderr);assert.match(r.stdout,/changed:/);if(i===1)assert.match(r.stdout,/changed: 0/);
  }
 }finally{clean(dir);}
});
