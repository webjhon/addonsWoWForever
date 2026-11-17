import fs from 'node:fs';
import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {ROOT,readJSON,writeJSON} from '../src/core.ts';
import {openDb} from '../src/db.ts';
import {searchKnowledge} from '../src/search.ts';
import {disposeEmbedder,localModelReady} from '../src/embeddings.ts';
const suite=readJSON(path.join(ROOT,'evals/rag-queries.json'));const db=openDb();
const baselineArg=process.argv.indexOf('--baseline-db');const baseline=baselineArg>=0?new DatabaseSync(path.resolve(process.argv[baselineArg+1]),{readOnly:true}):null;
const reports=[];
try{
 for(const [name,source,semantic]of [...(baseline?[['previous-corpus-lexical',baseline,false]]:[]),['current-lexical',db,false],...(localModelReady()?[['current-hybrid-local',db,true]]:[])]){
  const rows=[];const start=Date.now();
  for(const c of suite.cases){const results=await searchKnowledge(c.query,{db:source,domain:c.domain,level:60,limit:5,semantic});const rank=results.findIndex(r=>c.sources.includes(r.source_id)&&c.contains.some(t=>r.content.toLowerCase().includes(t.toLowerCase())));rows.push({id:c.id,hit:rank>=0,rank:rank<0?null:rank+1,sources:results.map(r=>r.source_id),methods:results.map(r=>r.method)});}
  const hits=rows.filter(r=>r.hit).length;reports.push({name,queries:rows.length,hits,recallAt5:hits/rows.length,mrrAt5:rows.reduce((sum,r)=>sum+(r.rank?1/r.rank:0),0)/rows.length,ms:Date.now()-start,rows});
 }
 const report={schemaVersion:1,at:new Date().toISOString(),modelExecuted:localModelReady(),note:suite.note,results:reports};writeJSON(path.join(ROOT,'research/rag/retrieval-evaluation.json'),report);console.log(JSON.stringify(report,null,2));
}finally{baseline?.close();db.close();await disposeEmbedder();}
