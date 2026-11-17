import fs from 'node:fs';
import path from 'node:path';
import {ROOT,DATA_DIR,ensureDir,writeJSON} from '../src/core.ts';
import {openDb} from '../src/db.ts';
import {loadKnowledgePack,knowledgeCoverage,importKnowledgePack} from '../knowledge/ingest/wowhead-forever.ts';

const command=process.argv[2]||'coverage';
try{
 const bundle=loadKnowledgePack();
 if(command==='validate'||command==='coverage')console.log(JSON.stringify(knowledgeCoverage(bundle),null,2));
 else if(command==='refresh'){
  const db=openDb();try{console.log(JSON.stringify(importKnowledgePack(db,bundle),null,2));}finally{db.close();}
 }else if(command==='export'){
  const dir=ensureDir(path.join(DATA_DIR,'knowledge-exports'));
  const sources=new Map(bundle.manifest.sources.map(s=>[s.id,s]));
  const text=['WoW Forever / Alliance and Horde leveling 1-60; records retain individual faction eligibility','PARTIAL FACTUAL CATALOG. NOT CLIENT_VERIFIED. No copied site prose.',...bundle.records.map(r=>[
   '\n'+r.id+' | '+r.kind+' | '+r.name,
   'faction='+r.faction+'; alliance_access='+r.alliance_access+'; horde_access='+(r.horde_access??'UNKNOWN')+'; game_id='+r.game_id+'; patch='+r.patch+'; client_build=UNVERIFIED; evidence='+r.evidence,
   JSON.stringify(r.facts),
   'Sources: '+r.source_ids.map(id=>sources.get(id).uri).join(' '),
   'Gaps: '+r.issues.join(' ')
  ].join('\n'))].join('\n');
  fs.writeFileSync(path.join(dir,'wowhead-forever.txt'),text+'\n');
  writeJSON(path.join(dir,'wowhead-forever.json'),bundle);
  writeJSON(path.join(dir,'coverage.json'),knowledgeCoverage(bundle));
  console.log(JSON.stringify({directory:path.relative(ROOT,dir),records:bundle.records.length,clientVerified:false}));
 }else throw Error('Usage: knowledge-pack.ts validate|coverage|refresh|export');
}catch(e){console.error(e.message);process.exitCode=1;}
