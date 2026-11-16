import fs from 'node:fs';
import path from 'node:path';
import {ROOT,writeJSON,sha} from '../src/core.ts';
import {dispatch} from '../mcp/server.ts';
import {openDb,upsertDoc,upsertEntity,setCapability,recordMemory} from '../src/db.ts';
const dir=path.join(ROOT,'research/AllianceDungeonTrail');
const requests=[
 ['search_wow_api',{query:'C_QuestLog UnitXP UnitLevel PLAYER_LEVEL_UP'}],
 ['search_leveling_knowledge',{query:'dungeon quest leveling'}],
 ['query_alliance_records',{kind:'dungeon',level:20}],
 ['get_project_memory',{kind:'decision'}],
 ['get_project_memory',{kind:'failure'}],
 ...['indoor-navigation','quest-journal','xp-display','protected-combat-action'].map(id=>['check_client_capability',{id}]),
];
const results=[];
for(const [name,args] of requests){
 const response=await dispatch({jsonrpc:'2.0',id:results.length+1,method:'tools/call',params:{name,arguments:args}});
 if(response.error||response.result?.isError)throw Error(JSON.stringify(response));
 results.push({name,args,result:JSON.parse(response.result.content[0].text)});
}
writeJSON(path.join(dir,'mcp-retrieval.json'),{at:new Date().toISOString(),results});
const reference=process.argv[2];
if(reference){
 const bytes=fs.readFileSync(reference),snapshot=JSON.parse(bytes.toString('utf8'));
 const bp=JSON.parse(fs.readFileSync(path.join(dir,'AllianceDungeonTrail.blueprint.json'),'utf8'));
 const symbols=bp.apiNamespacesUsed.map(symbol=>{
  const [ns,method]=symbol.split('.');
  return {symbol,present:method?!!snapshot.namespaces[ns]?.includes(method):snapshot.functions.includes(ns),currentClientStatus:'UNVERIFIED'};
 });
 writeJSON(path.join(dir,'api-snapshot-evidence.json'),{client:snapshot.client,commit:'8dc297689059dd204bf8663a05aaa36d6a628b76',source:bp.apiEvidence[0].source,license:'MIT',sha256:sha(bytes),symbols});
}
const db=openDb();
const addon='AllianceDungeonTrail';
const research=fs.readFileSync(path.join(dir,'RESEARCH.md'),'utf8');
for(const domain of ['api','leveling'])upsertDoc(db,{id:'dungeon-trail-'+domain,source_id:'original-dungeon-trail-research',domain,title:'Alliance Dungeon Trail '+domain+' research 1.60.1',content:research,evidence:'ORIGINAL_RESEARCH_WITH_UNVERIFIED_GAPS',license:'original',uri:'research/AllianceDungeonTrail/RESEARCH.md'});
const catalog=JSON.parse(fs.readFileSync(path.join(dir,'catalog.json'),'utf8'));
for(const d of catalog)upsertEntity(db,{id:'dungeon-trail:'+d.key,kind:'dungeon',name:d.name,faction:'Neutral',alliance_access:true,min_level:d.level,max_level:d.high,source_id:d.source,evidence:d.evidence,payload:{suggestedRange:true,questCount:d.quests.length,availability:'UNVERIFIED'}});
for(const id of ['indoor-navigation','quest-journal','xp-display'])setCapability(db,{id,status:'UNVERIFIED',restrictions:['Live 70938 client execution pending; snapshot 69893 presence is not current support'],alternatives:id==='indoor-navigation'?['Textual landmarks and journal checklist']:['Manual confirmation'],evidence:['research/AllianceDungeonTrail/api-snapshot-evidence.json']});
recordMemory(db,'decision','Dungeon Trail: empirical runs and textual guidance','Use measured repeat runs; no indoor coordinates, no protected actions. Candidate only.',{addon,evidence:['research/AllianceDungeonTrail/RESEARCH.md']});
recordMemory(db,'gap','Dungeon Trail: current client and quest gaps','Installed executable is 1.60.1.70938; no game session tested. Four dungeons lack curated quests; late availability and 24-29/26-31 discrepancy remain unresolved.',{addon,evidence:['research/AllianceDungeonTrail/RESEARCH.md']});
db.close();console.log('MCP retrieval, snapshot presence, Alliance entities, decisions and gaps recorded.');
