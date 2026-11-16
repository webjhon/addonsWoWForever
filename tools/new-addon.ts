import path from 'node:path';
import {ROOT,requireName,writeJSON,ensureDir} from '../src/core.ts';
import {validateBlueprint} from '../src/guards.ts';
export function scaffold(name,brief='Alliance leveling utility (implementation pending)'){
 requireName(name);
 const title=name.replace(/([a-z])([A-Z])/g,'$1 $2');
 const toc=`## Interface: 16001\n## Title: ${title}\n## Notes: ${brief.replace(/[\r\n]/g,' ').slice(0,140)}\n## Author: Tonho Contrabando\n## Version: 0.1.0\n## X-Flavor: Forever\n## IconTexture: Interface\\AddOns\\${name}\\assets\\Icon.tga\n${name}.lua\n`;
 const lua=`-- DRAFT ONLY: implement the requested leveling utility after researching build-specific APIs.\nlocal addonName, ns = ...\nlocal handler = CreateFrame("Frame")\nhandler:RegisterEvent("PLAYER_ENTERING_WORLD")\nhandler:SetScript("OnEvent", function()\n  if UnitFactionGroup("player") ~= "Alliance" then return end\n  local level = UnitLevel("player")\n  if not level or level < 1 or level > 60 then return end\n  -- TODO: implement a real reactive feature AND register the primary UI with ns.TonhoBranding:RegisterWindow(frame).\nend)\n`;
 const b={addonName:name,game:'WoW Forever',faction:'Alliance',purpose:'leveling',minLevel:1,maxLevel:60,interfaceVersion:16001,version:'0.1.0',eventsRegistered:['PLAYER_ENTERING_WORLD'],apiNamespacesUsed:['UnitFactionGroup','UnitLevel'],apiEvidence:[{symbol:'UnitFactionGroup',status:'UNVERIFIED',source:'Needs build-specific verification'},{symbol:'UnitLevel',status:'UNVERIFIED',source:'Needs build-specific verification'}],files:[{filename:`${name}.toc`,content:toc},{filename:`${name}.lua`,content:lua}]};
 const errors=validateBlueprint(b,{draft:true});if(!errors.ok)throw Error(errors.errors.join('\n'));
 const target=path.join(ROOT,'.data/generated',name+'.blueprint.json');ensureDir(path.dirname(target));writeJSON(target,b);return target;
}
if(process.argv[1]?.endsWith('new-addon.ts')){
 try{const result=scaffold(process.argv[2],process.argv.slice(3).join(' '));console.log('UNAPPROVED DRAFT blueprint:',result,'\nNext: research & implement; then node --experimental-strip-types orchestrator.ts --blueprint '+result);}
 catch(e){console.error(e.message);process.exitCode=1;}
}
