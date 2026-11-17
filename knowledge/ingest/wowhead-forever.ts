import fs from 'node:fs';
import {accessFlags,factionScope,sharedAccess} from '../../src/factions.ts';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import {ROOT,readJSON,safeWithin,sha,now} from '../../src/core.ts';
import {upsertEntity,upsertDoc,linkEntities} from '../../src/db.ts';

export const PACK_FILE='knowledge/packs/wowhead-forever/manifest.json';
const schema=readJSON(path.join(ROOT,'schemas/knowledge-pack.schema.json'));
const ajv=new Ajv2020({allErrors:true,strict:true});
ajv.addSchema(schema);
const manifestValidator=ajv.getSchema(schema.$id);
const shardValidator=ajv.compile({$ref:schema.$id+'#/$defs/shard'});
const errorText=v=>ajv.errorsText(v.errors,{separator:'; '});
const eligible=r=>{const f=accessFlags(r);return f.alliance||f.horde;};

/** Local, reviewed factual JSON only. This module makes no network requests. */
export function loadKnowledgePack(relativePath=PACK_FILE){
 if(relativePath!==PACK_FILE)throw Error('Unreviewed manifest path; register a reviewed pack before importing');
 const manifest=readJSON(safeWithin(ROOT,relativePath));
 if(!manifestValidator(manifest))throw Error('Manifest schema: '+errorText(manifestValidator));
 const shards=manifest.files.map(file=>{
  const shard=readJSON(safeWithin(ROOT,file));
  if(!shardValidator(shard))throw Error(file+': '+errorText(shardValidator));
  return shard;
 });
 const bundle={manifest,records:shards.flatMap(s=>s.records),relations:shards.flatMap(s=>s.relations)};
 validateKnowledgePack(bundle);
 return bundle;
}

/** All validation precedes writes, including cross-file references and field provenance. */
export function validateKnowledgePack(bundle){
 const {manifest,records,relations}=bundle;
 if(!manifestValidator(manifest))throw Error('Manifest schema: '+errorText(manifestValidator));
 if(!shardValidator({records,relations}))throw Error('Record schema: '+errorText(shardValidator));
 const sources=new Map();
 for(const s of manifest.sources){
  if(sources.has(s.id))throw Error('Duplicate source '+s.id);
  const url=new URL(s.uri);
  if(url.origin!=='https://www.wowhead.com'||!url.pathname.startsWith('/forever/')||url.username||url.password||url.hash||url.search)throw Error('Only canonical Forever source URLs are allowed');
  const parsedDate=new Date(s.accessed_at);
  if(Number.isNaN(parsedDate.valueOf())||parsedDate.toISOString().slice(0,10)!==s.accessed_at)throw Error('Invalid source date');
  sources.set(s.id,s);
 }
 const checkRefs=refs=>{for(const id of refs)if(!sources.has(id))throw Error('Unknown source '+id);};
 const byId=new Map(),gameIds=new Set();
 for(const r of records){
  if(byId.has(r.id))throw Error('Duplicate entity '+r.id);
  if(r.id.split(':')[1]!==r.kind)throw Error('Entity kind/id mismatch '+r.id);
  if(r.faction==='Unknown'&&(r.alliance_access||r.horde_access))throw Error('Unknown Alliance eligibility cannot be promoted');
  if(r.faction==='Alliance'&&!r.alliance_access)throw Error('Alliance record must declare access');
  if(r.faction==='Horde'&&(r.alliance_access||r.horde_access!==true))throw Error('Horde record requires exclusive proven Horde access');
  if(r.faction==='Alliance'&&r.horde_access)throw Error('Alliance record cannot assert Horde access');
  if(r.build!==null)throw Error('Wowhead community records cannot establish a client build');
  checkRefs(r.source_ids);
  const mandatory=['name','faction','alliance_access',...(r.horde_access!==undefined?['horde_access']:[]),...(r.game_id!==null?['game_id']:[]),...Object.entries(r.facts).filter(([,v])=>v!==null).map(([k])=>'facts.'+k)];
  for(const field of mandatory){if(!r.field_sources[field]?.length)throw Error('Missing field provenance '+r.id+' '+field);}
  for(const refs of Object.values(r.field_sources)){checkRefs(refs);if(refs.some(id=>!r.source_ids.includes(id)))throw Error('Field source not declared on record '+r.id);}
  if(r.facts.recommended_range&&r.facts.recommended_range[0]>r.facts.recommended_range[1])throw Error('Reversed range '+r.id);
  if(r.game_id!==null){
   const idKey=r.kind+':'+r.game_id;if(gameIds.has(idKey))throw Error('Duplicate in-game identifier '+idKey);gameIds.add(idKey);
   const urlType={quest:'quest',npc:'npc',item:'item',object:'object',ability:'spell',zone:'zone',dungeon:'zone',flight_master:'npc'}[r.kind];
   if(!urlType||!r.field_sources.game_id.some(id=>new RegExp('/'+urlType+'='+r.game_id+'(?:/|$)').test(sources.get(id).uri)))throw Error('Game ID must have a matching individual source URL '+r.id);
  }
  byId.set(r.id,r);
 }
 const relationKeys=new Set();
 for(const r of relations){
  const a=byId.get(r.from_id),b=byId.get(r.to_id);
  if(!a||!b)throw Error('Dangling relation '+r.from_id+' -> '+r.to_id);
  checkRefs(r.source_ids);
  if(r.from_id===r.to_id)throw Error('Self relation');
  const key=[r.from_id,r.type,r.to_id].join('|');if(relationKeys.has(key))throw Error('Duplicate relation '+key);relationKeys.add(key);
 }
 // A partial prerequisite graph is useful; a cycle is not a valid quest chain.
 const edges=new Map();for(const r of relations.filter(r=>r.type==='requires_quest')){if(byId.get(r.from_id).kind!=='quest'||byId.get(r.to_id).kind!=='quest')throw Error('Prerequisites must be quests');edges.set(r.from_id,[...(edges.get(r.from_id)||[]),r.to_id]);}
 const active=new Set(),done=new Set();function visit(id){if(active.has(id))throw Error('Cyclic quest prerequisites');if(done.has(id))return;active.add(id);for(const next of edges.get(id)||[])visit(next);active.delete(id);done.add(id);}for(const id of edges.keys())visit(id);
 return {ok:true,records:records.length,relations:relations.length,sources:sources.size};
}

export function knowledgeCoverage(bundle=loadKnowledgePack()){
 const counts=Object.fromEntries(schema.$defs.record.properties.kind.enum.map(kind=>[kind,0])),missingIds={},unknownRequirements={};
 for(const r of bundle.records){counts[r.kind]=(counts[r.kind]||0)+1;if(r.game_id===null)missingIds[r.kind]=(missingIds[r.kind]||0)+1;if(r.kind==='quest'&&r.facts.required_level===null)unknownRequirements.quest=(unknownRequirements.quest||0)+1;}
 const accessible=new Set(bundle.records.filter(eligible).map(r=>r.id));
 return {dataset:bundle.manifest.id,revision:bundle.manifest.revision,complete:false,clientVerified:false,counts,records:bundle.records.length,operationalRecords:accessible.size,quarantined:bundle.records.filter(r=>!eligible(r)).map(r=>r.id),relations:bundle.relations.length,operationalRelations:bundle.relations.filter(r=>accessible.has(r.from_id)&&accessible.has(r.to_id)&&sharedAccess(bundle.records.find(e=>e.id===r.from_id),bundle.records.find(e=>e.id===r.to_id))).length,byFaction:Object.fromEntries(['Alliance','Horde'].map(faction=>[faction,{records:bundle.records.filter(r=>accessFlags(r)[faction==='Alliance'?'alliance':'horde']).length,quests:bundle.records.filter(r=>r.kind==='quest'&&accessFlags(r)[faction==='Alliance'?'alliance':'horde']).length,complete:false,clientVerified:false}])),sources:bundle.manifest.sources.length,missingGameIds:missingIds,unknownRequirements,recordsWithIssues:bundle.records.filter(r=>r.issues.length>0).length,gaps:bundle.manifest.gaps};
}

function document(r,sources){
 return JSON.stringify({entity:r.name,kind:r.kind,id:r.id,game_id:r.game_id,faction:r.faction,facts:r.facts,evidence:r.evidence,patch:r.patch,build:r.build,field_sources:r.field_sources,sources:r.source_ids.map(id=>({id,uri:sources.get(id).uri})),issues:r.issues,warning:'Discovery only; verify eligibility and current client before generating guide steps.'});
}

export function importKnowledgePack(db,bundle=loadKnowledgePack()){
 validateKnowledgePack(bundle);
 const digest=sha('dual-faction-v1:'+JSON.stringify(bundle)),report=knowledgeCoverage(bundle);
 db.exec('CREATE TABLE IF NOT EXISTS knowledge_imports(dataset_id TEXT PRIMARY KEY, revision TEXT NOT NULL, hash TEXT NOT NULL, report TEXT NOT NULL, imported_at TEXT NOT NULL)');
 const old=db.prepare('SELECT hash FROM knowledge_imports WHERE dataset_id=?').get(bundle.manifest.id);
 if(old?.hash===digest)return {...report,changed:false,hash:digest};
 const sources=new Map(bundle.manifest.sources.map(s=>[s.id,s]));
 db.exec('BEGIN IMMEDIATE');
 try{
  // whf: is reserved for this pack. Foreign references abort the whole transaction.
  db.exec("DELETE FROM relations WHERE id LIKE 'whf:relation:%'; DELETE FROM docs WHERE id LIKE 'whf:doc:%'; DELETE FROM entities WHERE id LIKE 'whf:%'");
  for(const s of sources.values()){
   const existing=db.prepare('SELECT uri FROM source_records WHERE id=?').get(s.id);
   if(existing&&existing.uri!==s.uri)throw Error('Source identity collision '+s.id);
   db.prepare('INSERT OR REPLACE INTO source_records(id,uri,title,license,reviewed,at) VALUES(?,?,?,?,?,?)').run(s.id,s.uri,s.title,'factual-reference',1,s.accessed_at);
  }
  for(const r of bundle.records.filter(eligible)){
   const min=r.facts.required_level??1;
   upsertEntity(db,{id:r.id,kind:r.kind,name:r.name,faction:r.faction,alliance_access:accessFlags(r).alliance,horde_access:accessFlags(r).horde,min_level:min,max_level:60,source_id:r.source_ids[0],evidence:r.evidence,build:null,payload:{...r,dataset:bundle.manifest.id,eligibility:r.facts.required_level===null?'UNVERIFIED':'COMMUNITY_REFERENCE_ONLY',requires_client_verification:true}});
   upsertDoc(db,{id:'whf:doc:'+r.id,source_id:r.source_ids[0],domain:'leveling',title:r.name+' '+r.kind,content:document(r,sources),faction:r.faction,alliance_access:accessFlags(r).alliance,horde_access:accessFlags(r).horde,min_level:min,max_level:60,build:null,evidence:r.evidence,license:'original-factual-curation',uri:sources.get(r.source_ids[0]).uri});
  }
  const byId=new Map(bundle.records.map(r=>[r.id,r]));
  for(const r of bundle.relations){
   if(!eligible(byId.get(r.from_id))||!eligible(byId.get(r.to_id))||!sharedAccess(byId.get(r.from_id),byId.get(r.to_id)))continue;
   linkEntities(db,{id:'whf:relation:'+sha(JSON.stringify([r.from_id,r.type,r.to_id])).slice(0,24),from_id:r.from_id,to_id:r.to_id,relation:r.type,source_id:r.source_ids[0]});
  }
  db.prepare('INSERT OR REPLACE INTO knowledge_imports(dataset_id,revision,hash,report,imported_at) VALUES(?,?,?,?,?)').run(bundle.manifest.id,bundle.manifest.revision,digest,JSON.stringify(report),now());
  db.exec('COMMIT');
 }catch(e){db.exec('ROLLBACK');throw e;}
 return {...report,changed:true,hash:digest};
}

/** Related identifiers are discoverable with provenance; missing edges are not assertions. */
export function entityContext(db,id,{level=1,faction='Alliance'}={}){
 if(!Number.isInteger(level)||level<1||level>60)throw Error('Level must be 1..60');
 if(typeof id!=='string'||id.length>180)throw Error('Invalid entity ID');
 const row=db.prepare('SELECT * FROM entities WHERE id=? AND '+factionScope(faction)).get(id);
 if(!row)return null;
 const relations=db.prepare(`SELECT r.*,e.name,e.kind,e.evidence,e.build FROM relations r JOIN entities e ON e.id=CASE WHEN r.from_id=? THEN r.to_id ELSE r.from_id END
 WHERE (r.from_id=? OR r.to_id=?) AND ${factionScope(faction,'e')}`).all(id,id,id);
 const payload=JSON.parse(row.payload),required=payload.facts?.required_level;
 return {...row,payload,levelContext:level,meetsReferenceMinimum:Number.isInteger(required)?level>=required:null,availability:'UNVERIFIED',relations:relations.map(r=>({...r,direction:r.from_id===id?'outgoing':'incoming'})),graphComplete:false};
}
