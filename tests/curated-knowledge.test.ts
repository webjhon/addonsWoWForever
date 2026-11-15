import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {openDb,queryAlliance} from '../src/db.ts';
import {seedForever} from '../knowledge/alliance/seed-forever.ts';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';

test('curated official records are indexed and exclude Horde',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'wow-forever-curated-'));
 const db=openDb(path.join(temp,'test.sqlite'));
 try {
  const result=seedForever(db);
  assert.ok(result.entitiesProcessed >= 35);
  const ls=queryAlliance(db,{kind:'dungeon',level:15});
  assert.ok(ls.some(x=>x.name==='Hall of Thanes'));
  assert.ok(ls.every(x=>x.faction!=='Horde'));
  assert.ok(queryAlliance(db,{kind:'race_class',q:'Dwarf Shaman'}).length===1);
  const talents=queryAlliance(db,{kind:'legacy_perk',q:'Well Rested'});
  assert.ok(talents.length===1 && talents[0].payload.perk_id===null);
 } finally { db.close();fs.rmSync(temp,{recursive:true,force:true}); }
});
