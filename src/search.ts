import { openDb } from './db.ts';
export async function embed(text, model='text-embedding-3-small') {
 const key=process.env.OPENAI_API_KEY;
 if(!key) throw new Error('OPENAI_API_KEY is required for optional semantic embeddings; lexical FTS works offline');
 const endpoint=process.env.OPENAI_EMBEDDINGS_URL||'https://api.openai.com/v1/embeddings';
 const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`},body:JSON.stringify({model,input:text}),signal:AbortSignal.timeout(30000)});
 if(!response.ok) throw new Error('Embedding provider returned HTTP '+response.status);
 const payload=await response.json();
 if(!Array.isArray(payload?.data?.[0]?.embedding)) throw new Error('Invalid embedding response');
 return payload.data[0].embedding;
}
function sim(a,b){if(a.length!==b.length)return 0;let dot=0,x=0,y=0;for(let i=0;i<a.length;i++){dot+=a[i]*b[i];x+=a[i]*a[i];y+=b[i]*b[i];}return dot/(Math.sqrt(x*y)||1);}
const disallowed=['unknown-license-copy','proprietary-restricted'];
export async function searchKnowledge(query,{db=openDb(),domain=null,level=1,build=null,limit=8,semantic=false}={}) {
  if(!query?.trim()) return [];
  if(!Number.isInteger(level)||level<1||level>60) throw new Error('Level must be 1..60');
  const tokens=(query.toLowerCase().match(/[\p{L}\p{N}_]+/gu)||[]).slice(0,14).filter(x=>x.length>1);
  const fts=tokens.map(t=>'"'+t.replace(/"/g,'')+'"').join(' OR ');
  let rows=[];
  if(fts){try{
    rows=db.prepare(`SELECT d.*, bm25(docs_fts) AS rank FROM docs_fts JOIN docs d ON d.rowid=docs_fts.rowid
      WHERE docs_fts MATCH ? AND d.alliance_access=1 AND d.faction IN ('Alliance','Neutral') AND d.min_level<=? AND d.max_level>=? ${domain?'AND d.domain=?':''} ${build?'AND (d.build IS NULL OR d.build=?)':''} ORDER BY rank LIMIT 80`).all(fts,level,level,...(domain?[domain]:[]),...(build?[build]:[]));
  }catch(e){throw new Error('FTS query failed: '+e.message);}}
  if(rows.length===0) rows=db.prepare(`SELECT *, 100 AS rank FROM docs WHERE alliance_access=1 AND faction IN ('Alliance','Neutral') AND content LIKE ? AND min_level<=? AND max_level>=? ${domain?'AND domain=?':''} ${build?'AND (build IS NULL OR build=?)':''} LIMIT 50`).all('%'+query.replace(/[%_]/g,'')+'%',level,level,...(domain?[domain]:[]),...(build?[build]:[]));
  const found=new Map(rows.filter(r=>!disallowed.includes(r.license)).map(r=>[r.id,{...r,score:1/(1+Math.max(0,r.rank)),method:'lexical'}]));
  if(semantic){
    const v=await embed(query);
    for(const r of db.prepare(`SELECT d.*,v.vector,v.model FROM doc_vectors v JOIN docs d ON d.id=v.doc_id WHERE d.alliance_access=1 AND d.faction IN ('Alliance','Neutral') AND d.min_level<=? AND d.max_level>=? ${domain?'AND d.domain=?':''} ${build?'AND (d.build IS NULL OR d.build=?)':''}`).all(level,level,...(domain?[domain]:[]),...(build?[build]:[]))){
      if(disallowed.includes(r.license))continue;
      const score=sim(v,JSON.parse(r.vector));
      const old=found.get(r.id); if(old) {old.score+=score;old.method='hybrid';}else found.set(r.id,{...r,score,method:'semantic'});
    }
  }
  return [...found.values()].sort((a,b)=>b.score-a.score).slice(0,limit).map(r=>({id:r.id,title:r.title,content:r.content,domain:r.domain,score:r.score,method:r.method,source_id:r.source_id,uri:r.uri,build:r.build,evidence:r.evidence,license:r.license}));
}
