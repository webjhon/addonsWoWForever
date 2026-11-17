import {ragStatus} from '../src/rag-status.ts';
import {disposeEmbedder} from '../src/embeddings.ts';
import {referencePatternContext} from '../src/reference-patterns.ts';
import {learnedSkillContext} from '../src/learned-skills.ts';
import {ROOT,readJSON} from '../src/core.ts';
import {openDb,queryAlliance,capability,getMemories} from '../src/db.ts';
import {searchKnowledge} from '../src/search.ts';
import {indexDocuments} from '../rag/indexer.ts';
import {knowledgeCoverage,entityContext} from '../knowledge/ingest/wowhead-forever.ts';
const [cmd,...rest]=process.argv.slice(2);
async function main(){
 const db=openDb();
 if(cmd==='patterns'){console.log(JSON.stringify(referencePatternContext(rest.join(' ')),null,2));
 }else if(cmd==='skills'){console.log(JSON.stringify(learnedSkillContext(rest.join(' ')),null,2));
 }else if(cmd==='doctor'){
  const result={node:process.version,interface:readJSON(ROOT+'/config/wow-version.json').interface,docs:db.prepare('SELECT COUNT(*) n FROM docs').get().n,entities:db.prepare('SELECT COUNT(*) n FROM entities').get().n,memories:db.prepare('SELECT COUNT(*) n FROM memories').get().n,rag:ragStatus({db}),apiKeyPresent:!!process.env.OPENAI_API_KEY};console.log(JSON.stringify(result,null,2));
 }else if(cmd==='search'){
  let level=1,domain=null,semantic='auto';const words=[];
  for(let i=0;i<rest.length;i++){
   if(rest[i]==='--lexical')semantic=false;
   else if(rest[i]==='--semantic')semantic=true;
   else if(rest[i]==='--level')level=Number(rest[++i]);
   else if(rest[i]==='--domain'){domain=rest[++i];if(!['api','leveling'].includes(domain))throw Error('Domain must be api or leveling');}
   else if(rest[i].startsWith('--'))throw Error('Unknown search option '+rest[i]);
   else words.push(rest[i]);
  }
  console.log(JSON.stringify(await searchKnowledge(words.join(' '),{db,level,domain,semantic}),null,2));
 }
 else if(cmd==='coverage')console.log(JSON.stringify(knowledgeCoverage(),null,2));
 else if(cmd==='entity')console.log(JSON.stringify(entityContext(db,rest[0],{level:Number(rest[1]??1)}),null,2));
 else if(cmd==='knowledge'){const [kind,q,level]=rest;console.log(JSON.stringify(queryAlliance(db,{kind,q,level:Number(level||1)}),null,2));}
 else if(cmd==='capability'){console.log(JSON.stringify(capability(db,rest[0]||'unknown',readJSON(ROOT+'/config/wow-version.json').build),null,2));}
 else if(cmd==='memory'){console.log(JSON.stringify(getMemories(db,{addon:rest[0]}),null,2));}
 else console.log('Usage: npm run doctor | search -- "query" | knowledge -- kind term level | capability -- feature-id | npm run init | npm run agent -- "description"');
 db.close();
}
main().catch(e=>{console.error(e.message);process.exitCode=1;}).finally(disposeEmbedder);
