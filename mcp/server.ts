import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import {ROOT,readJSON,safeWithin} from '../src/core.ts';
import {openDb,queryAlliance,getMemories,recordMemory,capability} from '../src/db.ts';
import {searchKnowledge} from '../src/search.ts';
import {buildAddon} from '../tools/build-addon.ts';
import {validateBlueprint} from '../src/guards.ts';
import {importProbe} from '../src/diagnostics.ts';
import {runEvals} from '../evals/run-evals.ts';
import {knowledgeCoverage,entityContext} from '../knowledge/ingest/wowhead-forever.ts';
const info={name:'wow-forever-alliance-factory',version:'0.1.0'};
const toolSpecs=[
 {name:'get_knowledge_coverage',description:'Report factual pack counts, unknown IDs/requirements and unresolved gaps; never asserts completeness or client verification',inputSchema:{type:'object',properties:{}}},
 {name:'get_gameplay_entity',description:'Read an Alliance-accessible entity and both directions of its partial evidence graph; level is planning context, not proof of eligibility',inputSchema:{type:'object',properties:{id:{type:'string'},level:{type:'integer',minimum:1,maximum:60}},required:['id']}},
 {name:'search_wow_api',description:'Search evidence-tracked Forever API documentation (RAG)',inputSchema:{type:'object',properties:{query:{type:'string'},level:{type:'integer'}},required:['query']}},
 {name:'search_leveling_knowledge',description:'Search Alliance 1-60 RAG documents',inputSchema:{type:'object',properties:{query:{type:'string'},level:{type:'integer'}},required:['query']}},
 {name:'query_alliance_records',description:'Query structured, faction-filtered Alliance game entities',inputSchema:{type:'object',properties:{kind:{type:'string'},level:{type:'integer'},query:{type:'string'}},required:['kind']}},
 {name:'check_client_capability',description:'Return SUPPORTED/UNVERIFIED/PROHIBITED with provenance',inputSchema:{type:'object',properties:{id:{type:'string'}},required:['id']}},
 {name:'get_project_memory',description:'Read persistent technical decisions and findings',inputSchema:{type:'object',properties:{addon:{type:'string'},kind:{type:'string'}}}},
 {name:'record_technical_decision',description:'Save an evidence-referenced decision (not verified fact)',inputSchema:{type:'object',properties:{addon:{type:'string'},title:{type:'string'},body:{type:'string'},evidence:{type:'array',items:{type:'string'}}},required:['title','body']}},
 {name:'report_knowledge_gap',description:'Record an unresolved gap; never convert to confirmed fact',inputSchema:{type:'object',properties:{title:{type:'string'},body:{type:'string'},addon:{type:'string'}},required:['title','body']}},
 {name:'run_factory_evals',description:'Execute local automated checks and return evidence of test status',inputSchema:{type:'object',properties:{}}},
 {name:'validate_blueprint',description:'Validate blueprint scope, TOC and Lua guardrails',inputSchema:{type:'object',properties:{blueprint:{type:'object'}},required:['blueprint']}},
 {name:'build_addon',description:'Build candidate ZIP from a validated blueprint JSON under authorized project locations',inputSchema:{type:'object',properties:{relativePath:{type:'string'}},required:['relativePath']}},
 {name:'import_client_diagnostics',description:'Import a safe ForeverDevProbe SavedVariables file from authorized project locations',inputSchema:{type:'object',properties:{relativePath:{type:'string'}},required:['relativePath']}}
];
async function callTool(name,args={}){
 const db=openDb();try{
  switch(name){
    case 'get_knowledge_coverage':return knowledgeCoverage();
    case 'get_gameplay_entity':return entityContext(db,args.id,{level:args.level??1});
    case 'search_wow_api':return await searchKnowledge(args.query,{db,domain:'api',level:args.level||1});
    case 'search_leveling_knowledge':return await searchKnowledge(args.query,{db,domain:'leveling',level:args.level||1});
    case 'query_alliance_records':return queryAlliance(db,{kind:args.kind,level:args.level||1,q:args.query||''});
    case 'check_client_capability':return capability(db,args.id,readJSON(path.join(ROOT,'config/wow-version.json')).build);
    case 'get_project_memory':return getMemories(db,{addon:args.addon,kind:args.kind});
    case 'record_technical_decision':return {id:recordMemory(db,'decision',args.title,args.body,{addon:args.addon||null,evidence:args.evidence||[]})};
    case 'report_knowledge_gap':return {id:recordMemory(db,'gap',args.title,args.body,{addon:args.addon||null})};
    case 'run_factory_evals':return runEvals();
    case 'validate_blueprint':return validateBlueprint(args.blueprint);
    case 'build_addon':{
      if(!args.relativePath?.startsWith('evals/fixtures/')&&!args.relativePath?.startsWith('.data/generated/'))throw Error('Build path must be in evals/fixtures or .data/generated');
      return buildAddon(safeWithin(ROOT,args.relativePath));
    }
    case 'import_client_diagnostics':{
      if(!args.relativePath?.startsWith('evals/fixtures/')&&!args.relativePath?.startsWith('.data/diagnostics/'))throw Error('Diagnostic path must be in evals/fixtures or .data/diagnostics');
      return importProbe(safeWithin(ROOT,args.relativePath),{db});
    }
    default:throw Error('Unknown tool: '+name);
  }
 }finally{db.close();}
}
export async function dispatch(msg){
 const {id,method,params={}}=msg;
 if(!method)return null;
 const success=(result)=>id===undefined?null:{jsonrpc:'2.0',id,result};
 try{
  if(method==='initialize')return success({protocolVersion:params.protocolVersion||'2025-06-18',capabilities:{tools:{listChanged:false},resources:{listChanged:false},prompts:{listChanged:false}},serverInfo:info});
  if(method==='ping')return success({});
  if(method==='notifications/initialized')return null;
  if(method==='tools/list')return success({tools:toolSpecs});
  if(method==='tools/call'){
   if(!toolSpecs.some(t=>t.name===params.name))throw Error('Unknown tool');
   const result=await callTool(params.name,params.arguments||{});
   return success({content:[{type:'text',text:JSON.stringify(result)}],isError:false});
  }
  if(method==='resources/list')return success({resources:[{uri:'factory://scope',name:'Scope',mimeType:'text/markdown'},{uri:'factory://readiness',name:'Readiness',mimeType:'application/json'}]});
  if(method==='resources/read'){
   const uri=params.uri;
   const text=uri==='factory://scope'?fs.readFileSync(path.join(ROOT,'AGENTS.md'),'utf8'):uri==='factory://readiness'?JSON.stringify(readJSON(path.join(ROOT,'config/wow-version.json'))):null;
   if(text===null)throw Error('Unknown resource');return success({contents:[{uri,text,mimeType:uri.endsWith('scope')?'text/markdown':'application/json'}]});
  }
  if(method==='prompts/list')return success({prompts:[{name:'build-alliance-addon',description:'Follow the tested production journey for Alliance 1-60'}]});
  if(method==='prompts/get'){
   if(params.name!=='build-alliance-addon')throw Error('Unknown prompt');
   return success({description:'Alliance leveling addon engineering journey',messages:[{role:'user',content:{type:'text',text:fs.readFileSync(path.join(ROOT,'FACTORY-WORKFLOW.md'),'utf8')}}]});
  }
  if(method==='notifications/cancelled')return null;
  return id===undefined?null:{jsonrpc:'2.0',id,error:{code:-32601,message:'Method not found'}};
 }catch(e){return id===undefined?null:{jsonrpc:'2.0',id,error:{code:-32000,message:String(e.message||e)}};}
}
if(process.argv[1]?.endsWith('server.ts')){
 const rl=readline.createInterface({input:process.stdin,crlfDelay:Infinity});
 rl.on('line',async line=>{
  try{const msg=JSON.parse(line),response=await dispatch(msg);if(response)process.stdout.write(JSON.stringify(response)+'\n');}
  catch(e){process.stderr.write('MCP malformed input: '+e.message+'\n');}
 });
}
