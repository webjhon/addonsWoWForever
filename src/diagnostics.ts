import fs from 'node:fs';
import {openDb,recordMemory} from './db.ts';
import {now,sha} from './core.ts';
export function parseProbe(text){
 const match=text.match(/ForeverDevProbeDB\s*=\s*\{([\s\S]*)\}\s*$/);
 if(!match)throw Error('No ForeverDevProbeDB assignment found');
 // Strict limited parser for our own flat format. Never eval a Lua file.
 const raw=match[1],data={};
 for(const key of ['version','build','interface','addon']){
  const m=raw.match(new RegExp('(?:\\[\\s*\"'+key+'\"\\s*\\]|\\b'+key+')\\s*=\\s*(?:\"((?:\\\\.|[^\"\\\\])*)\"|(\\d+))'));
  if(m)data[key]=m[2]?Number(m[2]):m[1].replace(/\\"/g,'"');
 }
 const eventMatches=[...raw.matchAll(/\{\s*(?:\[\s*"event"\s*\]|event)\s*=\s*"([A-Z_]+)"\s*,\s*(?:\[\s*"count"\s*\]|count)\s*=\s*(\d+)\s*\}/g)];
 data.events=eventMatches.map(m=>({event:m[1],count:Number(m[2])}));
 if(typeof data.interface!=='number' || !data.build)throw Error('Missing required probe interface/build');
 return data;
}
export function importProbe(file,{db=openDb()}={}){
 const parsed=parseProbe(fs.readFileSync(file,'utf8'));
 const id=recordMemory(db,'probe','Probe '+parsed.build+' '+parsed.addon,JSON.stringify(parsed),{addon:parsed.addon||null,evidence:[sha(JSON.stringify(parsed))],build:String(parsed.build)});
 return {id,status:'IMPORTED_UNVERIFIED',parsed,at:now()};
}
