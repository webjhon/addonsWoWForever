import fs from 'node:fs';import path from 'node:path';
import {ROOT,readJSON,sha} from './core.ts';
export function checkFactionPolicy(b,{draft=false}={}){
 if(!b||typeof b!=='object')return {ok:false,errors:['Blueprint object is required'],status:'INVALID',clientVerified:false};
 const policy=readJSON(path.join(ROOT,'config/faction-policy.json'));
 const historical=policy.legacyCandidates.some(c=>c.sha256===sha(JSON.stringify(b)));
 if(historical)return {ok:true,errors:[],status:'HISTORICAL_SINGLE_FACTION',faction:b.faction,clientVerified:false};
 const errors=[];
 if(b?.faction!=='Both')errors.push('New or revised addons must support BOTH Alliance and Horde');
 if(!draft){
  const c=b?.factionSupport;
  if(!c||!['shared-live-state','partitioned-data'].includes(c.dataStrategy))errors.push('factionSupport must describe shared-live-state or partitioned-data');
  if(typeof c?.unknownFaction!=='string'||c.unknownFaction.trim().length<16)errors.push('factionSupport must handle unknown faction safely and retry detection');
  if(!Array.isArray(c?.acceptanceFactions)||!['Alliance','Horde'].every(f=>c.acceptanceFactions.includes(f)))errors.push('Faction acceptance must include Alliance AND Horde');
  if(typeof c?.testFile!=='string'||!/^tests\/[A-Za-z0-9_.-]+\.test\.ts$/.test(c.testFile)||!fs.existsSync(path.join(ROOT,c.testFile)))errors.push('Faction-specific acceptance test file is required');
  const source=(b?.files||[]).filter(f=>f.filename?.endsWith('.lua')).map(f=>f.content).join('\n');
  if(!/\bUnitFactionGroup\s*\(/.test(source))errors.push('Both-faction addons must observe player faction from the game');
 }
 return {ok:!errors.length,errors,status:'DUAL_FACTION_CANDIDATE',faction:b?.faction,clientVerified:false};
}
