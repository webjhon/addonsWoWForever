import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ROOT,sha,readJSON} from '../src/core.ts';
import {openDb,upsertDoc} from '../src/db.ts';
import {embed} from '../src/search.ts';
function files(dir){if(!fs.existsSync(dir))return[];return fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?files(path.join(dir,x.name)):x.isFile()&&/\.(md|txt)$/i.test(x.name)?[path.join(dir,x.name)]:[]);}
export async function indexDocuments({withEmbeddings=false,dirs=[path.join(ROOT,'rag/raw-docs'),path.join(ROOT,'knowledge/seed-docs')]}={}) {
 const db=openDb();let changed=0, skipped=0, vectors=0;
 const manifest=readJSON(path.join(ROOT,'knowledge/sources/manifest.json'),{});
 for(const f of dirs.flatMap(files)){
   const rel=path.relative(ROOT,f).replaceAll('\\','/');const raw=fs.readFileSync(f,'utf8');
   const meta=readJSON(f+'.meta.json',{});
   if(meta.license==='proprietary-restricted'||meta.faction==='Horde'){skipped++;continue;}
   if(meta.source_id && manifest[meta.source_id]?.reviewed===false){skipped++;continue;}
   for(let offset=0,n=0;offset<raw.length;offset+=1000,n++){
     const content=raw.slice(offset,offset+1200);if(!content.trim())continue;
     const id=sha(rel+':'+n).slice(0,24);const current=db.prepare('SELECT hash FROM docs WHERE id=?').get(id);
     if(current?.hash===sha(content)){skipped++;if(offset+1200>=raw.length)break;continue;}
     upsertDoc(db,{id,source_id:meta.source_id||rel,domain:meta.domain||'api',title:meta.title||path.basename(f),content,faction:meta.faction||'Alliance',alliance_access:meta.alliance_access!==false,build:meta.build||null,evidence:meta.evidence||'COMMUNITY_UNVERIFIED',license:meta.license||'original',uri:meta.uri||null});changed++;
     if(withEmbeddings){const vec=await embed(content);db.prepare('INSERT OR REPLACE INTO doc_vectors(doc_id,model,vector) VALUES(?,?,?)').run(id,process.env.EMBEDDING_MODEL||'text-embedding-3-small',JSON.stringify(vec));vectors++;}
     if(offset+1200>=raw.length)break;
   }
 }
 db.close();return {changed,skipped,vectors};
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url))indexDocuments({withEmbeddings:process.argv.includes('--embeddings')}).then(console.log).catch(e=>{console.error(e);process.exitCode=1;});
