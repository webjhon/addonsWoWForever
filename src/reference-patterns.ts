import fs from 'node:fs';
import path from 'node:path';
import {ROOT,readJSON,safeWithin} from './core.ts';
export function referencePatternContext(subject='',blueprint=null,{root=ROOT,catalog=null}={}) {
 const data=catalog??readJSON(path.join(root,'knowledge/lessons/reference-patterns.json'));
 if(data.schemaVersion!==1||data.status!=='STATIC_REFERENCE_ANALYSIS'||data.clientVerified!==false||data.reusePolicy!=='ORIGINAL_IMPLEMENTATION_ONLY'||!Array.isArray(data.patterns)||!data.patterns.length)throw Error('Invalid reference analysis status/policy');
 const sources=new Set((data.sources??[]).map(s=>s.id));
 if(!sources.has('zygor')||!sources.has('restedxp'))throw Error('Both reference sources required');
 const snapshots=new Map((data.snapshots??[]).map(s=>[s.path,s]));
 for(const s of snapshots.values())if(!/^market-references\/(zygor|restedxp)\/[^/]+$/.test(s.path)||!/^[a-f0-9]{64}$/.test(s.sha256)||!Number.isInteger(s.bytes)||s.bytes<=0)throw Error('Invalid source snapshot');
 const text=[subject,blueprint?.addonName,...(blueprint?.apiNamespacesUsed??[]),...(blueprint?.files??[]).filter(f=>/\.lua$/i.test(f.filename)).map(f=>f.content)].join(' ');
 const guide=/quest|guia|guide|dungeon|masmorra|objetiv|leveling/i.test(text);
 const navigation=/navega|navigation|waypoint|seta|flecha|arrow|C_Map|GetPlayerFacing/i.test(text);
 const ui=guide||navigation||/CreateFrame|interface|painel|janela|tracker|configura|\bUI\b/i.test(text);
 const applicable={core:true,guide,navigation,ui};const ids=new Set();
 const considered=data.patterns.map(p=>{
  const keys=['id','domain','title','observation','adaptation','acceptance','status','evidence'];
  if(Object.keys(p).some(k=>!keys.includes(k))||keys.some(k=>!(k in p))||ids.has(p.id)||!/^[a-z][a-z0-9-]+$/.test(p.id)||!Object.hasOwn(applicable,p.domain)||p.status!=='STATIC_REFERENCE_ANALYSIS'||!Array.isArray(p.evidence)||!p.evidence.length)throw Error('Invalid reference pattern');
  ids.add(p.id);
  for(const k of ['title','observation','adaptation','acceptance'])if(typeof p[k]!=='string'||!p[k].trim())throw Error('Missing original pattern summary');
  for(const e of p.evidence){
   if(!sources.has(e.source)||!snapshots.has(e.path)||!e.path.startsWith('market-references/'+(e.source==='zygor'?'zygor':'restedxp')+'/')||!Number.isInteger(e.start)||!Number.isInteger(e.end)||e.start<1||e.end<e.start)throw Error('Missing or invalid static provenance');
  }
  return {...p,relevant:applicable[p.domain],decision:'REQUIRES_PRODUCT_REVIEW'};
 });
 const skillPath='.agents/skills/apply-reference-patterns/SKILL.md';const skill=fs.readFileSync(safeWithin(root,skillPath),'utf8').replace(/\r\n/g,'\n');
 if(!skill.startsWith('---\nname: apply-reference-patterns\n')||!/^description: .+/m.test(skill))throw Error('Invalid reference skill');
 return {status:data.status,clientVerified:false,skill:skillPath,reusePolicy:data.reusePolicy,considered,instructions:skill+'\nORIGINAL STATIC DESIGN CONSIDERATIONS (not runtime/API verification):\n'+JSON.stringify(considered)};
}
