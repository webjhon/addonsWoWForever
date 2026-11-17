import {disposeEmbedder} from './src/embeddings.ts';
import path from 'node:path';
import fs from 'node:fs';
import {ROOT,readJSON,writeJSON,ensureDir,appendTrace,now,sha} from './src/core.ts';
import {referencePatternContext} from './src/reference-patterns.ts';
import {learnedSkillContext} from './src/learned-skills.ts';
import {searchKnowledge} from './src/search.ts';
import {openDb,getMemories,recordMemory,capability} from './src/db.ts';
import {validateBlueprint} from './src/guards.ts';
import {buildAddon} from './tools/build-addon.ts';
import {createBlueprintWithLLM} from './src/llm.ts';
export async function executeJourney({blueprintPath,prompt}={}){
 const state={startedAt:now(),stages:[],status:'RUNNING'};
 function step(name,result){state.stages.push({name,at:now(),...result});appendTrace('journey-step',{name,ok:result.ok,addon:state.addon||null});if(!result.ok)throw Error(name+': '+(result.reason||'failed'));}
 try{
  const cfg=readJSON(path.join(ROOT,'config/wow-version.json'));
  const db=openDb();
  const memories=getMemories(db,{limit:12});
  step('CONTEXT_AND_MEMORY',{ok:true,build:cfg.build,memories:memories.length});
  const subject=prompt || blueprintPath || '';
  const docs=await searchKnowledge(subject,{db,limit:10});
  step('RAG_AND_RESEARCH',{ok:true,citations:docs.map(x=>x.source_id)});
  let blueprint,provider=null;
  if(blueprintPath)blueprint=readJSON(path.resolve(blueprintPath));
  else if(prompt){const created=await createBlueprintWithLLM(prompt);blueprint=created.blueprint;provider=created.model;}
  else throw Error('Pass --blueprint PATH or --prompt "description"');
  state.addon=blueprint.addonName;
  const learned=learnedSkillContext(subject,blueprint);
  step('LEARNED_CLIENT_SKILLS',{ok:true,selected:learned.selected,status:learned.status,clientVerified:false});
  const patterns=referencePatternContext(subject,blueprint);
  step('REFERENCE_PATTERN_REVIEW',{ok:true,status:patterns.status,clientVerified:false,skill:patterns.skill,considered:patterns.considered.map(({id,relevant,decision})=>({id,relevant,decision}))});
  const checked=validateBlueprint(blueprint);
  step('SCOPE_AND_GUARDRAILS',{ok:checked.ok,reason:checked.errors.join('; ')});
  const unknown=blueprint.apiEvidence.filter(x=>x.status==='UNVERIFIED'||x.status==='COMMUNITY_UNVERIFIED');
  const assessments=blueprint.apiEvidence.map(x=>({symbol:x.symbol,registry:capability(db,x.symbol,cfg.build)}));
  const prohibited=assessments.filter(x=>x.registry.status==='PROHIBITED');
  step('CAPABILITY_REVIEW',{ok:prohibited.length===0,reason:prohibited.length?'Prohibited capabilities: '+prohibited.map(x=>x.symbol).join(', '):undefined,unknownApis:unknown.map(x=>x.symbol),clientVerificationRequired:true});
  if(prompt){const bp=path.join(ROOT,'.data','generated',blueprint.addonName+'.blueprint.json');writeJSON(bp,blueprint);state.blueprintPath=bp;}
  const result=buildAddon(blueprintPath?path.resolve(blueprintPath):state.blueprintPath);
  step('PRODUCT_QUALITY_GATE',{ok:true,proof:result.productQuality});
  step('PACKAGING',{ok:true,zip:result.out});
  // The release is a candidate. Only an actual game session can provide CLIENT_VERIFIED.
  step('REVIEW_AND_HANDOFF',{ok:true,status:'STATIC_PASSED',clientVerified:false});
  recordMemory(db,'project','Built '+blueprint.addonName,'Candidate at '+result.out,{addon:blueprint.addonName,evidence:docs.map(x=>x.source_id),build:cfg.build||null});
  db.close();state.status='STATIC_PASSED';state.result=result;state.provider=provider;
 }catch(e){state.status='FAILED';state.error=e.message;}
 state.finishedAt=now();
 const history=readJSON(path.join(ROOT,'context/session-history.json'),{schemaVersion:1,sessions:[]});
 history.sessions=[...(history.sessions||[]),{at:state.finishedAt,addon:state.addon||null,status:state.status,steps:state.stages.map(s=>s.name)}].slice(-100);
 writeJSON(path.join(ROOT,'context/session-history.json'),history);
 const out=path.join(ROOT,'traces','last-journey.json');writeJSON(out,state);
 return state;
}
if(process.argv[1] && process.argv[1].endsWith('orchestrator.ts')){
 const isPrompt=process.argv.includes('--prompt');const idx=process.argv.findIndex(x=>x==='--blueprint');
 const opts=isPrompt?{prompt:process.argv.slice(process.argv.indexOf('--prompt')+1).join(' ')}:{blueprintPath:idx>=0?process.argv[idx+1]:undefined};
 executeJourney(opts).then(r=>{console.log(JSON.stringify(r,null,2));if(r.status==='FAILED')process.exitCode=1;}).catch(e=>{console.error(e);process.exitCode=1;}).finally(disposeEmbedder);
}
