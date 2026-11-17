import fs from 'node:fs';
import path from 'node:path';
import {ROOT} from '../src/core.ts';
import {openDb,upsertEntity,setCapability} from '../src/db.ts';
import {importVectorStore} from '../rag/vector-store.ts';
import {indexDocuments} from '../rag/indexer.ts';
import {seedForever} from '../knowledge/alliance/seed-forever.ts';
import {importKnowledgePack} from '../knowledge/ingest/wowhead-forever.ts';
export async function setup(){
 const db=openDb();
 let curated,wowhead;
 try{
 const fixtures=JSON.parse(fs.readFileSync(path.join(ROOT,'evals/fixtures/synthetic-gameplay.json'),'utf8'));
 for(const e of fixtures.entities)upsertEntity(db,e);
 for(const c of fixtures.capabilities)setCapability(db,c);
 curated=seedForever(db);
 wowhead=importKnowledgePack(db);
 }finally{db.close();}
 await import('./prepare-rag-corpus.mjs?setup');
 const result=await indexDocuments();
 const vectors=importVectorStore();
 return {status:'READY_FOR_OFFLINE_TESTS',index:result,vectors,curated,wowhead,note:'Fixtures are synthetic. Wowhead facts are a partial community reference, never client verification or a complete quest database.'};
}
if(process.argv[1]?.endsWith('setup.ts'))setup().then(console.log).catch(e=>{console.error(e);process.exitCode=1;});
