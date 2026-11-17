import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import lua from 'luaparse';
import {ROOT} from './core.ts';

export const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
export function parseBuildInfo(text){
 const lines=text.trim().split(/\r?\n/), keys=lines.shift().split('|').map(s=>s.split('!')[0]);
 const rows=lines.filter(Boolean).map(line=>Object.fromEntries(line.split('|').map((v,i)=>[keys[i],v])));
 const active=rows.filter(r=>r.Product==='wowf'&&r.Active==='1');
 if(active.length!==1)throw Error('Expected exactly one active wowf build');
 const r=active[0];if(!/^1\.60\.\d+\.\d+$/.test(r.Version)||![r['Build Key'],r['CDN Key']].every(v=>/^[a-f0-9]{32}$/.test(v)))throw Error('Invalid Forever build identity');
 return {product:'wowf',version:r.Version,build:Number(r.Version.split('.').at(-1)),buildKey:r['Build Key'],cdnKey:r['CDN Key']};
}
export function parseLocales(text){
 const result={};for(const line of text.split(/\r?\n/)){const m=/^SET (textLocale|audioLocale) "([a-z]{2}[A-Z]{2})"$/.exec(line.trim());if(m)result[m[1]]=m[2];}return result;
}
const CACHE_TYPES={creaturecache:'BOMW',gameobjectcache:'BOGW',questcache:'TSQW'};
export function inspectWDB(buffer,type,expectedBuild){
 if(!CACHE_TYPES[type]||buffer.length<32||buffer.toString('ascii',0,4)!==CACHE_TYPES[type])throw Error('Unsupported WDB header');
 const build=buffer.readUInt32LE(4);if(build!==expectedBuild)throw Error('WDB build mismatch');
 const locale=buffer.subarray(8,12).toString('ascii').split('').reverse().join('');if(!/^[a-z]{2}[A-Z]{2}$/.test(locale))throw Error('Invalid WDB locale');
 let offset=24,records=0;const ids=new Set();
 while(offset+8<=buffer.length){const id=buffer.readUInt32LE(offset),size=buffer.readUInt32LE(offset+4);offset+=8;
  if(id===0&&size===0){if(offset!==buffer.length)throw Error('WDB trailing bytes');return {build,locale,records,uniqueIds:ids.size,bytes:buffer.length,sha256:digest(buffer),meaning:'SERVER_CACHE_NOT_PLAYER_PROGRESS'};}
  if(!id||!size||size>buffer.length-offset)throw Error('Truncated or invalid WDB record');
  ids.add(id);records++;offset+=size;
 }throw Error('Missing WDB terminator');
}
export function inspectWDC5(buffer){
 if(buffer.length<204||buffer.toString('ascii',0,4)!=='WDC5'||buffer.readUInt32LE(4)!==5)throw Error('Unsupported DB2 header');
 const schema=buffer.toString('ascii',8,136).split('\0')[0];if(!/^WOWSTATIC_[0-9_]+$/.test(schema))throw Error('Invalid WDC5 schema tag');
 const u=offset=>buffer.readUInt32LE(offset),sections=u(200),fieldCount=u(140),recordSize=u(144);
 if(sections<1||sections>10000||!fieldCount||!recordSize||204+40*sections+4*fieldCount>buffer.length)throw Error('Invalid WDC5 geometry');
 return {format:'WDC5',schemaTag:schema,records:u(136),fieldCount,recordSize,stringTableBytes:u(148),tableHash:u(152),layoutHash:u(156),minId:u(160),maxId:u(164),localeMask:u(168),sections,bytes:buffer.length,sha256:digest(buffer),rowsDecoded:false};
}
// Evaluate literal metadata only. Never execute extracted Lua or retain implementation bodies.
function literal(n){
 if(!n)return null;if(['StringLiteral','NumericLiteral','BooleanLiteral'].includes(n.type))return n.value;
 if(n.type==='Identifier')return {symbol:n.name};
 if(n.type==='MemberExpression'&&n.indexer==='.'){const base=literal(n.base);return base?.symbol?{symbol:base.symbol+'.'+n.identifier.name}:null;}
 if(n.type==='TableConstructorExpression'){if(n.fields.every(f=>f.type==='TableValue'))return n.fields.map(f=>literal(f.value));return Object.fromEntries(n.fields.filter(f=>f.type==='TableKeyString').map(f=>[f.key.name,literal(f.value)]));}return null;
}
export function inspectAPIDocument(raw){
 const ast=lua.parse(raw,{encodingMode:'x-user-defined'}),declaration=ast.body.find(n=>n.type==='LocalStatement'&&n.init[0]?.type==='TableConstructorExpression');
 if(!declaration)throw Error('No literal API metadata');const s=literal(declaration.init[0]);if(!s.Name||!Array.isArray(s.Functions))throw Error('Invalid API metadata');
 const fields=xs=>(Array.isArray(xs)?xs:[]).map(f=>({name:f.Name,type:f.Type,nilable:f.Nilable??null,default:f.Default??null,conditionalSecret:f.ConditionalSecret??null,secret:f.Secret??null,innerType:f.InnerType??null}));
 return {name:s.Name,namespace:s.Namespace||null,type:s.Type||null,functions:s.Functions.map(f=>({symbol:(s.Namespace?s.Namespace+'.':s.Type==='ScriptObject'?s.Name+'.':'')+f.Name,arguments:fields(f.Arguments),returns:fields(f.Returns),secretArguments:f.SecretArguments??null,secretReturns:f.SecretReturns??null,secretReturnsForAspect:f.SecretReturnsForAspect??null,hasRestrictions:f.HasRestrictions??null,mayReturnNothing:f.MayReturnNothing??null,status:'UNVERIFIED'}))};
}
export const API_FILES=['QuestLog','Map','NamePlate','SuperTrackManager','GossipInfo','Instance','Unit','SpellBook','Container','PetInfo','CVar','AddOns','SimpleFrameAPI','SimpleFrameScriptObjectAPI','SimpleRegionAPI','SimpleTextureAPI','SimpleTextureBaseAPI','AddOnProfiler'].map(n=>n+'Documentation.lua');
export const DB2_FILES=['map','chrclasses','chrraces','creaturefamily','spellname','skillline'].map(n=>n+'.db2');
function readBounded(file,max){const stat=fs.statSync(file);if(!stat.isFile()||stat.size>max)throw Error('Source exceeds intake bounds');return fs.readFileSync(file);}
export function inspectClient(clientRoot,extractedRoot){
 const identity=parseBuildInfo(readBounded(path.join(clientRoot,'.build.info'),100000).toString('utf8'));
 const executable=readBounded(path.join(clientRoot,'_forever_','Wow.exe'),200000000);
 if(executable.toString('ascii',0,2)!=='MZ')throw Error('Invalid client executable');
 const pe=executable.readUInt32LE(60);if(pe>executable.length-24||executable.toString('ascii',pe,pe+4)!=='PE\0\0')throw Error('Invalid PE signature');
 const locales=parseLocales(readBounded(path.join(clientRoot,'_forever_','WTF','Config.wtf'),1000000).toString('utf8'));
 const caches={};for(const type of Object.keys(CACHE_TYPES)){
  const file=path.join(clientRoot,'_forever_','Cache','WDB',locales.textLocale||'ptBR',type+'.wdb');
  if(fs.existsSync(file))caches[type]=inspectWDB(readBounded(file,64000000),type,identity.build);
 }
 const reviewed=JSON.parse(fs.readFileSync(path.join(ROOT,'knowledge/api/forever-contracts.json'),'utf8'));
 const documents=[],tables=[];if(extractedRoot){
  for(const name of API_FILES){const file=path.join(extractedRoot,'Interface/AddOns/Blizzard_APIDocumentationGenerated',name);if(!fs.existsSync(file))continue;
   const bytes=readBounded(file,2000000),hash=digest(bytes),metadata=inspectAPIDocument(bytes.toString('utf8')),prior=reviewed.sources.find(s=>name===s.name+'Documentation.lua');
   documents.push({file:name,bytes:bytes.length,sha256:hash,referenceHashMatches:prior?hash===prior.sha256:null,reference:prior?.uri||null,...metadata});
  }
  for(const name of DB2_FILES){const file=path.join(extractedRoot,'dbfilesclient',name);if(fs.existsSync(file))tables.push({file:name,...inspectWDC5(readBounded(file,20000000))});}
 }
 return {schemaVersion:1,observedOn:new Date().toISOString().slice(0,10),identity,locales,executable:{bytes:executable.length,sha256:digest(executable),machine:executable.readUInt16LE(pe+4)},clientVerified:false,evidence:'LOCAL_DISK_OBSERVATION',binding:'Extracted files require matching CASC build keys and an extraction log; headers alone cannot establish client origin.',caches,documents,tables};
}
export function localClientContext(expectedBuild=null){
 const file=path.join(ROOT,'knowledge/client/current.json');if(!fs.existsSync(file))return {status:'UNAVAILABLE',clientVerified:false};
 const summary=JSON.parse(fs.readFileSync(file,'utf8'));const matches=expectedBuild==null?null:String(summary.identity.build)===String(expectedBuild);
 return {status:matches===false?'BUILD_MISMATCH':'DISK_EVIDENCE_ONLY',clientVerified:false,buildMatches:matches,identity:summary.identity,locales:summary.locales,apiDocuments:summary.documents.map(d=>({file:d.file,sha256:d.sha256,referenceHashMatches:d.referenceHashMatches})),tableSchemas:summary.tables.map(t=>({file:t.file,schemaTag:t.schemaTag,layoutHash:t.layoutHash})),instruction:'Read .agents/skills/inspect-local-client/SKILL.md. Disk metadata does not certify runtime API access, coordinates, navigation or quest progression. On build mismatch refresh intake before relying on these facts.'};
}
