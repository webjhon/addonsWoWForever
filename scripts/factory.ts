import {ROOT,readJSON} from '../src/core.ts';
import {openDb,queryAlliance,capability,getMemories} from '../src/db.ts';
import {searchKnowledge} from '../src/search.ts';
import {indexDocuments} from '../rag/indexer.ts';
const [cmd,...rest]=process.argv.slice(2);
async function main(){
 const db=openDb();
 if(cmd==='doctor'){
  const result={node:process.version,interface:readJSON(ROOT+'/config/wow-version.json').interface,docs:db.prepare('SELECT COUNT(*) n FROM docs').get().n,entities:db.prepare('SELECT COUNT(*) n FROM entities').get().n,memories:db.prepare('SELECT COUNT(*) n FROM memories').get().n,apiKeyPresent:!!process.env.OPENAI_API_KEY};console.log(JSON.stringify(result,null,2));
 }else if(cmd==='search')console.log(JSON.stringify(await searchKnowledge(rest.join(' '),{db}),null,2));
 else if(cmd==='knowledge'){const [kind,q,level]=rest;console.log(JSON.stringify(queryAlliance(db,{kind,q,level:Number(level||1)}),null,2));}
 else if(cmd==='capability'){console.log(JSON.stringify(capability(db,rest[0]||'unknown',readJSON(ROOT+'/config/wow-version.json').build),null,2));}
 else if(cmd==='memory'){console.log(JSON.stringify(getMemories(db,{addon:rest[0]}),null,2));}
 else console.log('Usage: npm run doctor | search -- "query" | knowledge -- kind term level | capability -- feature-id | npm run init | npm run agent -- "description"');
 db.close();
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
