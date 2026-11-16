import fs from 'node:fs';
import path from 'node:path';
import {ROOT,writeJSON} from '../src/core.ts';
import {dispatch} from '../mcp/server.ts';
import {openDb,upsertDoc,recordMemory,setCapability} from '../src/db.ts';
const dir=path.join(ROOT,'research/AURANPC');
const requests=[['search_wow_api',{query:'ShowQuestUnitCircles'}],['search_leveling_knowledge',{query:'quest',level:17}],['query_alliance_records',{kind:'npc',level:17}],['get_project_memory',{kind:'decision'}],['get_project_memory',{kind:'failure'}],['check_client_capability',{id:'quest-unit-circles'}]];
const results=[];
for(const [name,args] of requests){const r=await dispatch({jsonrpc:'2.0',id:results.length+1,method:'tools/call',params:{name,arguments:args}});if(r.error||r.result?.isError)throw Error(JSON.stringify(r));results.push({name,args,result:JSON.parse(r.result.content[0].text)});}
writeJSON(path.join(dir,'mcp-retrieval.json'),{at:new Date().toISOString(),results});
const db=openDb(),content=fs.readFileSync(path.join(dir,'RESEARCH.md'),'utf8');
for(const domain of ['api','leveling'])upsertDoc(db,{id:'auranpc-research-'+domain,source_id:'auranpc-original-research',domain,title:'AURANPC native quest circles research',content,evidence:'ORIGINAL_RESEARCH_RUNTIME_UNVERIFIED',license:'original-summary-reference-only',uri:'research/AURANPC/RESEARCH.md'});
setCapability(db,{id:'quest-unit-circles',status:'UNVERIFIED',apis:['C_CVar.GetCVar','C_CVar.GetCVarInfo','C_CVar.SetCVar'],restrictions:['Forever reference uses native setting; current70938 runtime/visual behavior not tested','Client chooses relevance, color and visibility; no arbitrary 3D aura'],alternatives:['Report BLOCKED when missing/locked; do not simulate world aura with nameplate texture'],evidence:['research/AURANPC/RESEARCH.md']});
recordMemory(db,'decision','AURANPC: native world circle, not custom3D renderer','Manage ShowQuestUnitCircles conservatively; native engine follows units. Respect conflicts and preserve prior value. Mock validates policy, never native graphics.',{addon:'AURANPC',evidence:['research/AURANPC/ACCEPTANCE.md','research/AURANPC/RESEARCH.md']});
recordMemory(db,'gap','AURANPC: native visual validation pending','Circle motion/color/visibility and dungeon NPC coverage need real70938 gameplay. Do not label the options preview as world aura proof.',{addon:'AURANPC',evidence:['research/AURANPC/RESEARCH.md']});
db.close();console.log('AURANPC research retrieved and provenance/memory recorded.');
