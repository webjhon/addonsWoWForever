import fs from 'node:fs';
import path from 'node:path';
import {ROOT,readJSON,writeJSON,ensureDir,safeWithin,appendTrace,now,sha} from '../src/core.ts';
import {validateBlueprint} from '../src/guards.ts';
import {createZip} from '../src/zip.ts';
import {generateAddonArt} from '../src/art.ts';
export function buildAddon(blueprintFile,{allowCandidate=true}={}){
 const b=readJSON(blueprintFile),validation=validateBlueprint(b);
 if(!validation.ok)throw new Error('Blueprint rejected:\n'+validation.errors.join('\n'));
 const addon=path.join(ROOT,'addons',b.addonName), destination=path.join(ROOT,'dist',b.addonName);
 if(fs.existsSync(addon)) fs.rmSync(addon,{recursive:true,force:true});ensureDir(addon);
 for(const file of b.files){const target=safeWithin(addon,file.filename);ensureDir(path.dirname(target));fs.writeFileSync(target,file.content,'utf8');}
 const assetDir=ensureDir(path.join(addon,'assets'));
 const art=generateAddonArt(b.addonName,assetDir,path.join(ROOT,'releases'));
 fs.writeFileSync(path.join(addon,'README.txt'),`WoW Forever / Alliance / leveling 1-60\nAddon: ${b.addonName}\nVersion: ${b.version||'0.1.0'}\nInstall folder: _forever_/Interface/AddOns/${b.addonName}\nCandidate build: verification on a live Forever client is still required.\n`);
 fs.writeFileSync(path.join(addon,'CHANGELOG.txt'),`Version ${b.version||'0.1.0'} - Candidate package created by WoW Addon AI Factory.\nClient-side verification pending.\n`);
 if(fs.existsSync(destination))fs.rmSync(destination,{recursive:true,force:true});fs.cpSync(addon,destination,{recursive:true});
 // A reproducible packaging artifact is NOT evidence of success inside WoW.
 const status='STATIC_PASSED';
 const report={addon:b.addonName,status,clientVerified:false,interface:b.interfaceVersion,at:now(),scope:'WoW Forever / Alliance / 1-60',apiEvidence:b.apiEvidence,disclaimer:'Client in-game validation not performed. Verify icon and API use before CurseForge publication.'};
 writeJSON(path.join(destination,'FACTORY-VALIDATION.json'),report);
 const releases=ensureDir(path.join(ROOT,'releases'));
 const zip=createZip(destination,path.join(releases,b.addonName+'-'+(b.version||'0.1.0')+'-candidate.zip'),b.addonName);
 appendTrace('addon-built',{addon:b.addonName,status,files:zip.files,zip: path.relative(ROOT,zip.out)});
 return {...zip,status,addon,destination,marketingIcon:art.png};
}
if(process.argv[1] && path.resolve(process.argv[1])===path.resolve(new URL(import.meta.url).pathname)){
 try{console.log(buildAddon(path.resolve(process.argv[2]||path.join(ROOT,'evals/fixtures/alliance-level-pulse.blueprint.json'))));}catch(e){console.error(e.message);process.exitCode=1;}
}
