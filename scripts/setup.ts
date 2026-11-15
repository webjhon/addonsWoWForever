import fs from 'node:fs';
import path from 'node:path';
import {ROOT} from '../src/core.ts';
import {openDb,upsertEntity,setCapability} from '../src/db.ts';
import {indexDocuments} from '../rag/indexer.ts';
export async function setup(){
 const db=openDb();
 const fixtures=JSON.parse(fs.readFileSync(path.join(ROOT,'evals/fixtures/synthetic-gameplay.json'),'utf8'));
 for(const e of fixtures.entities)upsertEntity(db,e);
 for(const c of fixtures.capabilities)setCapability(db,c);
 db.close(); const result=await indexDocuments();
 return {status:'READY_FOR_OFFLINE_TESTS',index:result,note:'Synthetic fixtures are NOT live WoW Forever facts; see fixtures documentation'};
}
if(process.argv[1]?.endsWith('setup.ts'))setup().then(console.log).catch(e=>{console.error(e);process.exitCode=1;});
