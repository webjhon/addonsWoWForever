import fs from 'node:fs';
import {checkFactionPolicy} from './faction-policy.ts';
import path from 'node:path';
import {ROOT,requireName,readJSON} from './core.ts';
import {verifyProductContract} from './product-quality.ts';
export function validateToc(toc, name, interfaceVersion=16001) {
 const errors=[];const tags=Object.fromEntries([...toc.matchAll(/^##\s*([\w-]+):\s*(.+)$/gm)].map(m=>[m[1].toLowerCase(),m[2].trim()]));
 if(!tags.interface?.split(',').map(s=>s.trim()).includes(String(interfaceVersion)))errors.push(`TOC must declare Interface ${interfaceVersion}`);
 for(const tag of ['title','notes','version','icontexture','author'])if(!tags[tag])errors.push(`TOC missing ## ${tag}`);
 if(tags.author !== 'Tonho Contrabando')errors.push('TOC Author must be exactly Tonho Contrabando');
 if(!/^##\s*X-Flavor:\s*Forever\s*$/mi.test(toc))errors.push('TOC requires ## X-Flavor: Forever');
 const entries=toc.split(/\r?\n/).map(s=>s.trim()).filter(s=>s&&!s.startsWith('#'));
 if(!entries.some(s=>s.toLowerCase().endsWith('.lua')))errors.push('TOC must list Lua source');
 if(entries.some(s=>s.includes('..')||s.startsWith('/')||s.includes(':')))errors.push('TOC contains unsafe source path');
 return {ok:errors.length===0,errors,tags,files:entries};
}
export function scanLua(content){
 const rules=readJSON(path.join(ROOT,'guardrails/taint-and-api-rules.json'));
 const errors=[];
 // Strip Lua comments and quoted strings, preventing text references from triggering guards.
 const stripped=content.replace(/--\[\[[\s\S]*?\]\]/g,'').replace(/--[^\n]*/g,'').replace(/\[\[[\s\S]*?\]\]/g,'').replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,'');
 for(const blocked of rules.blocked_protected_apis){
   const regex=new RegExp('(?:^|[^\\w.])'+blocked.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\s*\\(','m');
   if(regex.test(stripped))errors.push(`Protected/unsafe call: ${blocked}`);
 }
 for(const old of Object.keys(rules.deprecated_replacements)){
   if(new RegExp('(?:^|[^\\w.])'+old+'\\s*\\(','m').test(stripped))errors.push(`Unverified legacy API: ${old}; investigate ${rules.deprecated_replacements[old]}`);
 }
 if(/\b(loadstring|setfenv|os\.execute|io\.popen)\s*\(/.test(stripped))errors.push('Unsafe dynamic/external execution');
 if(/\bOnUpdate\b/.test(stripped))errors.push('OnUpdate requires a documented performance exception; use events where possible');
 return {ok:errors.length===0,errors};
}
export function validateBlueprint(b,{draft=false}={}){
 const errors=[];
 try{requireName(b?.addonName);}catch(e){errors.push(e.message);}
 if(b?.distribution!==undefined&&!['candidate','public'].includes(b.distribution))errors.push('Unknown distribution profile');
 const cfg=readJSON(path.join(ROOT,'config/wow-version.json'));
 if(b?.interfaceVersion!==cfg.interface)errors.push(`Target must be interface ${cfg.interface}`);
 if(b?.game!=='WoW Forever'||!['Both','Alliance','Horde'].includes(b?.faction)||b?.purpose!=='leveling')errors.push('Mandatory scope: WoW Forever / Alliance and Horde / leveling');
 errors.push(...checkFactionPolicy(b,{draft}).errors);
 if(b?.minLevel!==1||b?.maxLevel!==60)errors.push('Mandatory leveling scope 1..60');
 if(!Array.isArray(b?.files)||b.files.length<2)errors.push('At least TOC + Lua file required');
 const seen=new Set();
 for(const f of b?.files||[]){
   if(typeof f.filename!=='string'||!/^[A-Za-z0-9_][A-Za-z0-9_./-]*\.(toc|lua|xml|md)$/i.test(f.filename)||f.filename.includes('..')||f.filename.includes('//')||f.filename.startsWith('/'))errors.push('Unsafe file path: '+f.filename);
   if(seen.has(f.filename))errors.push('Duplicate file: '+f.filename);seen.add(f.filename);
   if(typeof f.content!=='string'||f.content.length>512000)errors.push('Invalid content '+f.filename);
   if(f.filename.toLowerCase().endsWith('.lua')) errors.push(...scanLua(f.content).errors.map(x=>f.filename+': '+x));
 }
 const toc=b?.files?.find(f=>f.filename===b.addonName+'.toc');
 if(!toc)errors.push('Missing '+b?.addonName+'.toc');
 else {
   const t=validateToc(toc.content,b.addonName,cfg.interface);errors.push(...t.errors);
   const expectedIcon='Interface\\AddOns\\'+b.addonName+'\\assets\\Icon.tga';
   if(t.tags?.icontexture && t.tags.icontexture!==expectedIcon)errors.push('IconTexture must reference '+expectedIcon);
   for(const dep of t.files||[])if(!b.files.some(f=>f.filename===dep))errors.push(`TOC references missing ${dep}`);
 }
 if(!Array.isArray(b?.apiEvidence)) errors.push('apiEvidence array is mandatory');
 else if(Array.isArray(b?.apiNamespacesUsed)) for(const sym of b.apiNamespacesUsed){if(!b.apiEvidence.some(e=>e.symbol===sym&&e.status&&e.source))errors.push('Missing API evidence for '+sym);}
 if(!Array.isArray(b?.eventsRegistered)||!Array.isArray(b?.apiNamespacesUsed))errors.push('API/event arrays mandatory');
 if(!draft){const product=verifyProductContract(b);errors.push(...product.errors);}
 return {ok:errors.length===0,errors,interface:cfg.interface};
}
