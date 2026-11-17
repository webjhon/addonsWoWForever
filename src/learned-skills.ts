import fs from 'node:fs';
import path from 'node:path';
import {ROOT,readJSON,safeWithin} from './core.ts';
// Engineering lessons are local instructions; they never change runtime API capability status.
export function learnedSkillContext(subject='',blueprint=null,{root=ROOT,registry=null}={}) {
 const data=registry??readJSON(path.join(root,'knowledge/lessons/live-client.json'));
 if(data.schemaVersion!==1||data.status!=='PARTIAL_CLIENT_TESTED'||!Array.isArray(data.skills)||!data.skills.length)throw Error('Invalid learned skills registry');
 const text=[subject,blueprint?.addonName,blueprint?.description,blueprint?.notes,blueprint?.apiNamespacesUsed?.join(' '),...(blueprint?.files??[]).filter(f=>/\.lua$/i.test(f.filename)).map(f=>f.content)].filter(Boolean).join(' ');
 const npc=/\b(?:auranpc|npc|npcs|nameplate|nameplates|C_NamePlate)\b/i.test(text);
 const ui=npc||/CreateFrame|GetPlayerFacing|C_Map|\b(?:ui|interface|painel|janela|seta|flecha|tracker|navega[çc][aã]o|arrow|navigation|dungeon|dungeons|guia|guide)\b/i.test(text);
 const ids=new Set();
 const all=data.skills.map(s=>{
  if(!s.id||ids.has(s.id)||!['always','ui','npc'].includes(s.applies)||!Array.isArray(s.evidence)||!s.evidence.length)throw Error('Invalid skill entry');
  ids.add(s.id);
  const p=safeWithin(root,s.path);if(!s.path.startsWith('.agents/skills/')||!s.path.endsWith('/SKILL.md'))throw Error('Invalid skill path');
  const instructions=fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n');
  if(!instructions.startsWith('---\n')||!instructions.includes('name: '+s.id+'\n')||!/^description: .+/m.test(instructions))throw Error('Invalid skill frontmatter: '+s.id);
  for(const evidence of s.evidence)if(!fs.statSync(safeWithin(root,evidence)).isFile())throw Error('Missing evidence: '+evidence);
  return {...s,instructions};
 });
 const selected=all.filter(s=>s.applies==='always'||s.applies==='ui'&&ui||s.applies==='npc'&&npc);
 return {status:data.status,clientVerified:false,selected:selected.map(({id,path,evidence})=>({id,path,evidence})),instructions:selected.map(s=>'SKILL '+s.id+' ('+s.path+')\n'+s.instructions).join('\n\n')};
}
