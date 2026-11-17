import {openDb} from './db.ts';
import {embedLocal,MODEL_KEY,localModelReady,validVector} from './embeddings.ts';
// Paid/remote embeddings remain explicit; default retrieval uses local inference only.
export async function embed(text,model='text-embedding-3-small'){
 const key=process.env.OPENAI_API_KEY;if(!key)throw Error('OPENAI_API_KEY required for explicitly requested remote embeddings');
 const r=await fetch(process.env.OPENAI_EMBEDDINGS_URL||'https://api.openai.com/v1/embeddings',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},body:JSON.stringify({model,input:text}),signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('Embedding provider HTTP '+r.status);
 const v=(await r.json()).data?.[0]?.embedding;if(!Array.isArray(v)||!v.length||v.some(x=>typeof x!=='number'||!Number.isFinite(x)))throw Error('Invalid remote embedding');return v;
}
export function cosine(a,b){if(a.length!==b.length)return null;let dot=0,x=0,y=0;for(let i=0;i<a.length;i++){if(!Number.isFinite(a[i])||!Number.isFinite(b[i]))return null;dot+=a[i]*b[i];x+=a[i]*a[i];y+=b[i]*b[i];}return x>0&&y>0?dot/Math.sqrt(x*y):null;}
const disallowed=['unknown-license-copy','proprietary-restricted'];
export async function searchKnowledge(query,{db=null,domain=null,level=1,build=null,limit=8,semantic='auto',embedder=embedLocal,model=MODEL_KEY}={}){
 if(typeof query!=='string'||!query.trim())return[];if(query.length>4000)throw Error('Query too long');
 if(!Number.isInteger(level)||level<1||level>60)throw Error('Level must be 1..60');if(domain!==null&&!['api','leveling'].includes(domain))throw Error('Invalid domain');
 if(!Number.isInteger(limit)||limit<1||limit>100)throw Error('Invalid result limit');if(![true,false,'auto'].includes(semantic))throw Error('Invalid semantic mode');
 const own=!db;db??=openDb();
 try{
 const scope="d.alliance_access=1 AND d.faction IN ('Alliance','Neutral') AND d.min_level<=? AND d.max_level>=?"+(domain?' AND d.domain=?':'')+(build?' AND (d.build IS NULL OR d.build=?)':'')+" AND d.license NOT IN ('unknown-license-copy','proprietary-restricted')";
 const params=[level,level,...(domain?[domain]:[]),...(build?[build]:[])];
 const tokens=(query.toLowerCase().match(/[\p{L}\p{N}_]+/gu)||[]).slice(0,24).filter(x=>x.length>1);if(!tokens.length)return[];
 const fts=tokens.map(t=>'"'+t.replace(/"/g,'')+'"').join(' OR ');
 let lexical=db.prepare('SELECT d.*,bm25(docs_fts) AS rank FROM docs_fts JOIN docs d ON d.rowid=docs_fts.rowid WHERE docs_fts MATCH ? AND '+scope+' ORDER BY rank,d.id LIMIT 80').all(fts,...params);
 if(!lexical.length)lexical=db.prepare('SELECT d.*,100 AS rank FROM docs d WHERE '+scope+' AND d.content LIKE ? ORDER BY d.id LIMIT 50').all(...params,'%'+query.replace(/[%_]/g,'')+'%');
 const found=new Map(lexical.map((r,i)=>[r.id,{...r,score:1/(60+i+1),lexicalRank:i+1,method:'lexical'}]));
 let note=null;
 const vectors=semantic===false?[]:db.prepare('SELECT d.*,v.vector FROM doc_vectors v JOIN docs d ON d.id=v.doc_id WHERE v.model=? AND v.content_hash=d.hash AND '+scope).all(model,...params);
 if(semantic!==false&&vectors.length){
  if(semantic===true||localModelReady()){
   try{const q=(await embedder([query],{kind:'query'}))[0];if(!Array.isArray(q)||q.some(v=>!Number.isFinite(v))||!q.length)throw Error('Invalid query embedding');
    const ranked=vectors.map(r=>{let v;try{v=JSON.parse(r.vector);}catch{return null;}if(!validVector(v,q.length))return null;const similarity=cosine(q,v);return similarity===null?null:{...r,similarity};}).filter(Boolean).sort((a,b)=>b.similarity-a.similarity||a.id.localeCompare(b.id)).slice(0,80);
    ranked.forEach((r,i)=>{const previous=found.get(r.id);if(previous){previous.score+=1/(60+i+1);previous.method='hybrid';previous.semanticScore=r.similarity;}else found.set(r.id,{...r,score:1/(60+i+1),semanticScore:r.similarity,method:'semantic'});});
   }catch(e){if(semantic===true)throw e;note='Local semantic retrieval unavailable; lexical results only';}
  }else note='Local model not prepared; lexical results only (npm run rag:model)';
 }else if(semantic===true)throw Error('No current vectors for requested model/scope; run rag:embed');
 return [...found.values()].filter(r=>!disallowed.includes(r.license)).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id)).slice(0,limit).map(r=>({id:r.id,title:r.title,content:r.content,domain:r.domain,score:r.score,method:r.method,semanticScore:r.semanticScore,source_id:r.source_id,uri:r.uri,build:r.build,evidence:r.evidence,license:r.license,...(note?{retrievalNote:note}:{})}));
 }finally{if(own)db.close();}
}
