import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {openDb,upsertEntity,queryAlliance,linkEntities,getRelations,recordMemory,getMemories,setCapability,capability,upsertDoc} from '../src/db.ts';
import {searchKnowledge} from '../src/search.ts';
function memoryDb(){const file=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'forever-fixture-')),'test.sqlite');return openDb(file);}
test('Alliance only and accessible neutrals; Horde hidden',()=>{
 const db=memoryDb();const base={kind:'quest',min_level:1,max_level:60,source_id:'synthetic-test',evidence:'SYNTHETIC_TEST'};
 upsertEntity(db,{...base,id:'qa',name:'Alliance Quest',faction:'Alliance'});
 upsertEntity(db,{...base,id:'qh',name:'Horde Quest',faction:'Horde'});
 upsertEntity(db,{...base,id:'qn',name:'Neutral Allowed Quest',faction:'Neutral',alliance_access:true});
 upsertEntity(db,{...base,id:'qno',name:'Neutral Blocked Quest',faction:'Neutral',alliance_access:false});
 const rows=queryAlliance(db,{kind:'quest',level:4});assert.deepEqual(rows.map(x=>x.id),['qa','qn']);
 assert.throws(()=>linkEntities(db,{id:'bad',from_id:'qa',to_id:'qh',relation:'depends_on',source_id:'test'}));
 linkEntities(db,{id:'good',from_id:'qa',to_id:'qn',relation:'depends_on',source_id:'test'});
 assert.equal(getRelations(db,'qa')[0].id,'qn');db.close();
});
test('FTS knowledge returns provenance and respects domain',async()=>{
 const db=memoryDb();upsertDoc(db,{id:'d1',source_id:'source-url',domain:'leveling',title:'Training test',content:'An Alliance leveling trainer availability checklist',evidence:'COMMUNITY_UNVERIFIED',faction:'Alliance'});
 const results=await searchKnowledge('leveling trainer',{db,domain:'leveling'});assert.equal(results.length,1);assert.equal(results[0].source_id,'source-url');
 assert.equal((await searchKnowledge('leveling trainer',{db,domain:'api'})).length,0);db.close();
});
test('memories persist provenance and capabilities default to UNVERIFIED',()=>{
 const db=memoryDb();recordMemory(db,'decision','Use events','Prefer event-driven updates',{addon:'Test',evidence:['case-123']});
 const found=getMemories(db,{addon:'Test'});assert.equal(found.length,1);assert.equal(found[0].evidence[0],'case-123');
 assert.equal(capability(db,'no-such-feature').status,'UNVERIFIED');
 assert.throws(()=>setCapability(db,{id:'x',status:'SUPPORTED',evidence:[]}));
 setCapability(db,{id:'x',status:'SUPPORTED',evidence:['tested-in-client-report-1']});assert.equal(capability(db,'x').status,'SUPPORTED');db.close();
});
