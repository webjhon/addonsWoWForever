import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
import {ROOT,readJSON} from '../src/core.ts';
import {openDb,upsertDoc,upsertEntity,queryFaction,queryAlliance,linkEntities,getRelations} from '../src/db.ts';
import {searchKnowledge} from '../src/search.ts';
import {accessFlags,requireFaction} from '../src/factions.ts';
import {loadKnowledgePack,validateKnowledgePack,importKnowledgePack,entityContext,knowledgeCoverage} from '../knowledge/ingest/wowhead-forever.ts';
import {checkFactionPolicy} from '../src/faction-policy.ts';import {validateBlueprint} from '../src/guards.ts';
import {exportVectorStore,importVectorStore} from '../rag/vector-store.ts';
import {messagesFor} from '../src/llm.ts';import {dispatch} from '../mcp/server.ts';
import Ajv2020 from 'ajv/dist/2020.js';
import {scaffold} from '../tools/new-addon.ts';
const record=(id,faction,extra={})=>({id,name:'Synthetic '+id,kind:'quest',faction,source_id:'synthetic',evidence:'SYNTHETIC_TEST',...extra});
test('neutral eligibility is independent for each faction and unknown never implies access',()=>{
 assert.deepEqual(accessFlags({faction:'Neutral',alliance_access:true}),{alliance:true,horde:false});
 assert.deepEqual(accessFlags({faction:'Neutral',horde_access:true}),{alliance:false,horde:true});
 assert.deepEqual(accessFlags({faction:'Unknown',alliance_access:true,horde_access:true}),{alliance:false,horde:false});
 assert.throws(()=>requireFaction('Both'));assert.throws(()=>requireFaction("Horde' OR 1=1"));
});
test('entity and graph queries isolate Alliance, Horde and explicitly shared records',()=>{
 const db=openDb(':memory:');try{
 for(const e of [record('a','Alliance'),record('h','Horde'),record('n','Neutral',{alliance_access:true}),record('s','Neutral',{alliance_access:true,horde_access:true})])upsertEntity(db,e);
 assert.deepEqual(queryAlliance(db).map(r=>r.id),['a','n','s']);assert.deepEqual(queryFaction(db,{faction:'Horde'}).map(r=>r.id),['h','s']);
 assert.throws(()=>linkEntities(db,{id:'bad',from_id:'a',to_id:'h',relation:'requires',source_id:'synthetic'}));
 linkEntities(db,{id:'hs',from_id:'h',to_id:'s',relation:'requires',source_id:'synthetic'});
 assert.equal(getRelations(db,'h',{faction:'Horde'})[0].id,'s');assert.deepEqual(getRelations(db,'h'),[]);
 assert.equal(entityContext(db,'h'),null);assert.equal(entityContext(db,'h',{faction:'Horde'}).relations.length,1);
 }finally{db.close();}
});
test('lexical and semantic retrieval enforce the same faction/access boundaries',async()=>{
 const db=openDb(':memory:'),v=Array.from({length:384},(_,i)=>i?0:1);try{
 for(const e of [record('a','Alliance'),record('h','Horde'),record('s','Neutral',{alliance_access:true,horde_access:true}),record('legacy','Neutral',{alliance_access:true})]){
  upsertDoc(db,{...e,domain:'api',title:e.name,content:'Synthetic quest signal '+e.id});const hash=db.prepare('SELECT hash FROM docs WHERE id=?').get(e.id).hash;
  db.prepare('INSERT INTO doc_vectors(doc_id,model,vector,content_hash) VALUES(?,?,?,?)').run(e.id,'synthetic',JSON.stringify(v),hash);
 }
 for(const semantic of [false,true]){
  const options={db,semantic,model:'synthetic',embedder:async()=>[v],limit:10};
  assert.deepEqual((await searchKnowledge('signal',{...options,faction:'Horde'})).map(r=>r.id).sort(),['h','s']);
  assert.deepEqual((await searchKnowledge('signal',{...options,faction:'Alliance'})).map(r=>r.id).sort(),['a','legacy','s']);
 }
 await assert.rejects(searchKnowledge('signal',{db,faction:'Unknown'}));
 }finally{db.close();}
});
test('portable vectors include Horde but target access controls remain authoritative',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'faction-vectors-')),a=openDb(':memory:'),b=openDb(':memory:');try{
 const e={...record('h','Horde'),domain:'api',title:'Synthetic vector',content:'Synthetic Horde document'};upsertDoc(a,e);upsertDoc(b,e);
 const hash=a.prepare('SELECT hash FROM docs').get().hash,v=Array.from({length:384},(_,i)=>i?0:1);
 a.prepare('INSERT INTO doc_vectors VALUES(?,?,?,?)').run('h','synthetic',JSON.stringify(v),hash);
 assert.equal(exportVectorStore({db:a,dir,model:'synthetic'}).records,1);
 assert.equal(importVectorStore({db:b,dir,model:'synthetic'}).imported,1);
 }finally{a.close();b.close();fs.rmSync(dir,{recursive:true,force:true});}
});
test('legacy database migration does not reinterpret Alliance-accessible neutral facts as shared',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'faction-migration-')),file=path.join(dir,'db.sqlite');let db=openDb(file);
 try{upsertEntity(db,record('n','Neutral',{alliance_access:true}));db.exec('ALTER TABLE entities DROP COLUMN horde_access; ALTER TABLE docs DROP COLUMN horde_access');db.close();db=openDb(file);
 assert.equal(queryFaction(db,{faction:'Horde'}).length,0);assert.equal(queryAlliance(db).length,1);
 upsertEntity(db,record('blocked','Horde',{horde_access:false}));db.close();db=openDb(file);assert.equal(queryFaction(db,{faction:'Horde'}).length,0);
 }finally{db.close();fs.rmSync(dir,{recursive:true,force:true});}
});
test('reviewed pack can import proven Horde eligibility without leaking into Alliance',async()=>{
 const pack=structuredClone(loadKnowledgePack()),r=pack.records.find(r=>r.game_id===92489);
 // Synthetic mutation of a test bundle, never committed as a gameplay fact.
 r.faction='Horde';r.alliance_access=false;r.horde_access=true;r.field_sources.horde_access=[...r.field_sources.faction];
 assert.equal(validateKnowledgePack(pack).ok,true);assert.equal(knowledgeCoverage(pack).byFaction.Horde.quests,1);
 const db=openDb(':memory:');try{importKnowledgePack(db,pack);assert.equal(entityContext(db,r.id),null);assert.equal(entityContext(db,r.id,{faction:'Horde'}).id,r.id);assert.equal((await searchKnowledge('Overwhelming',{db,faction:'Horde',level:60})).length,1);}finally{db.close();}
 delete r.field_sources.horde_access;assert.throws(()=>validateKnowledgePack(pack),/provenance/);
});
test('new/revised products require both factions; historical exception is bound to exact content',()=>{
 const b=readJSON(path.join(ROOT,'evals/fixtures/alliance-level-pulse.blueprint.json'));assert.equal(validateBlueprint(b).ok,true);
 for(const faction of ['Alliance','Horde'])assert.equal(checkFactionPolicy({...b,faction}).ok,false);
 const missing=structuredClone(b);delete missing.factionSupport;assert.equal(validateBlueprint(missing).ok,false);
 const old=readJSON(path.join(ROOT,'config/faction-policy.json')).legacyCandidates[0],legacy=readJSON(path.join(ROOT,old.file));
 assert.equal(checkFactionPolicy(legacy).status,'HISTORICAL_SINGLE_FACTION');assert.equal(checkFactionPolicy(legacy).ok,true);
 legacy.version='999.0.0';assert.equal(checkFactionPolicy(legacy).ok,false);
 assert.equal(checkFactionPolicy(null).ok,false);
});
test('strict blueprint schema requires a valid dual-faction contract',()=>{
 const validate=new Ajv2020({strict:true}).compile(readJSON(path.join(ROOT,'schemas/addon-blueprint.schema.json')));
 const b=readJSON(path.join(ROOT,'evals/fixtures/alliance-level-pulse.blueprint.json'));assert.equal(validate(b),true,JSON.stringify(validate.errors));
 delete b.factionSupport;assert.equal(validate(b),false);
});
test('default CLI scaffold accepts empty brief and remains an unapproved dual-faction draft',()=>{
 const b=readJSON(scaffold('FactoryFactionDraft',''));assert.equal(b.faction,'Both');assert.deepEqual(b.factionSupport.acceptanceFactions,['Alliance','Horde']);assert.equal(validateBlueprint(b,{draft:true}).ok,true);assert.equal(validateBlueprint(b).ok,false);
});
test('LLM and MCP expose two-faction workflow without mixing player faction selectors',async()=>{
 const m=messagesFor('Addon NPC','synthetic');assert.ok(m[0].content.includes('ALLIANCE AND HORDE'));assert.ok(m[1].content.includes('faction:"Both"'));
 const listed=await dispatch({id:1,method:'tools/list'});const tool=listed.result.tools.find(t=>t.name==='query_faction_records');assert.ok(tool.inputSchema.required.includes('faction'));assert.deepEqual(tool.inputSchema.properties.faction.enum,['Alliance','Horde']);
 const missing=await dispatch({id:2,method:'tools/call',params:{name:'query_faction_records',arguments:{}}});assert.match(missing.error.message,/Explicit player faction/);
});
