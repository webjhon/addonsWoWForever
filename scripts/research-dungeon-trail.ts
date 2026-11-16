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
 ['get_knowledge_coverage',{}],
 ['get_gameplay_entity',{id:'whf:quest:2040',level:17}],
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
 writeJSON(path.join(dir,'api-snapshot-evidence.json'),{client:snapshot.client,commit:'8dc297689059dd204bf8663a05aaa36d6a628b76',source:'https://github.com/Thunderz96/forever-addon-kit/blob/8dc297689059dd204bf8663a05aaa36d6a628b76/data/forever_api.json',signaturesReference:bp.apiEvidence[0].source,license:'MIT',sha256:sha(bytes),symbols});
}
const db=openDb();
const addon='AllianceDungeonTrail';
const research=fs.readFileSync(path.join(dir,'RESEARCH.md'),'utf8');
for(const domain of ['api','leveling'])upsertDoc(db,{id:'dungeon-trail-'+domain,source_id:'original-dungeon-trail-research',domain,title:'Alliance Dungeon Trail '+domain+' research 1.60.1',content:research,evidence:'ORIGINAL_RESEARCH_WITH_UNVERIFIED_GAPS',license:'original',uri:'research/AllianceDungeonTrail/RESEARCH.md'});
const catalog=JSON.parse(fs.readFileSync(path.join(dir,'catalog.json'),'utf8'));
for(const d of catalog)upsertEntity(db,{id:'dungeon-trail:'+d.key,kind:'dungeon',name:d.name,faction:'Neutral',alliance_access:true,min_level:d.level,max_level:d.high,source_id:d.source,evidence:d.evidence,payload:{suggestedRange:true,questCount:d.quests.length,availability:'UNVERIFIED',instanceMapID:d.instanceID,mapBuild:d.mapBuild,mapSource:d.mapSource,aliases:d.aliases,runtimeVerified:false}});
for(const id of ['indoor-navigation','quest-journal','xp-display'])setCapability(db,{id,status:'UNVERIFIED',restrictions:['No live 70938 client execution; Forever UI signatures documented; nullable/secret data must be rejected'],alternatives:id==='indoor-navigation'?['Live objective with original boss/area reference when native waypoint is unavailable']:['Block essential missing reads; never substitute manual progress'],evidence:['research/AllianceDungeonTrail/API-CAPABILITIES.json']});
recordMemory(db,'decision','Dungeon Trail 2: live reconciliation and native navigation','Quest IDs and live objectives drive progression; instance identity uses Map DB2 70938; preserve external tracking. No manual progress controls.',{addon,evidence:['research/AllianceDungeonTrail/REBUILD-ACCEPTANCE.md','research/AllianceDungeonTrail/API-CAPABILITIES.json']});
recordMemory(db,'failure','Legacy v1 test contradicts current product contract','Main d187e520 failed 1/46: legacy blueprint lacks authorship and interactivity. Replace product and behavior tests, never relax validators.',{addon,evidence:['research/AllianceDungeonTrail/RESEARCH.md']});
recordMemory(db,'gap','Dungeon Trail 2: gameplay approval pending','No live gameplay test. Four uncurated dungeons blocked; no exhaustive prerequisites or guaranteed indoor waypoint. DB2 presence does not prove phase access.',{addon,evidence:['research/AllianceDungeonTrail/RESEARCH.md']});
db.close();console.log('MCP retrieval, snapshot evidence, original research, decisions and limitations recorded.');
