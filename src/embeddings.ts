import fs from 'node:fs';
import path from 'node:path';
import {ROOT,DATA_DIR,readJSON,writeJSON} from './core.ts';
export const RAG_CONFIG=readJSON(path.join(ROOT,'config/rag.json'));
export const EMBEDDING=RAG_CONFIG.embedding;
if(!Number.isInteger(RAG_CONFIG.chunking.maxCharacters)||RAG_CONFIG.chunking.maxCharacters<200||!Number.isFinite(RAG_CONFIG.retrieval.rrfK)||RAG_CONFIG.retrieval.rrfK<=0)throw Error('Invalid RAG chunking/fusion configuration');
export const MODEL_KEY='local:'+EMBEDDING.model+'@'+EMBEDDING.revision+':'+EMBEDDING.dtype+':mean:l2:e5-v1';
let extractor;
export function validVector(v,dimensions=EMBEDDING.dimensions){return Array.isArray(v)&&v.length===dimensions&&v.every(x=>typeof x==='number'&&Number.isFinite(x))&&Math.abs(Math.hypot(...v)-1)<.03;}
export function localModelReady(){return readJSON(path.join(DATA_DIR,'embedding-ready.json'),{}).model===MODEL_KEY&&['config.json','tokenizer.json','onnx/model_quantized.onnx'].every(f=>fs.existsSync(path.join(DATA_DIR,'models',EMBEDDING.model,EMBEDDING.revision,f)));}
export async function embedLocal(texts,{kind='passage',allowDownload=false}={}){
 if(!Array.isArray(texts)||!texts.length||texts.some(t=>typeof t!=='string'||!t.trim()))throw Error('Embedding input must contain nonempty texts');
 if(!['query','passage'].includes(kind))throw Error('Invalid embedding kind');
 if(!allowDownload&&!fs.existsSync(path.join(DATA_DIR,'models',EMBEDDING.model,EMBEDDING.revision,'config.json')))throw Error('Local embedding model is not prepared; run npm run rag:model');
 if(!extractor){
  extractor=(async()=>{const {pipeline}=await import('@huggingface/transformers');const source=allowDownload?EMBEDDING.model:path.join(DATA_DIR,'models',EMBEDDING.model,EMBEDDING.revision);return pipeline('feature-extraction',source,{revision:EMBEDDING.revision,dtype:EMBEDDING.dtype,device:'cpu',cache_dir:path.join(DATA_DIR,'models'),local_files_only:!allowDownload});})();
 }
 let pipe;try{pipe=await extractor;}catch(e){extractor=null;throw e;}
 const out=await pipe(texts.map(t=>(kind==='query'?EMBEDDING.queryPrefix:EMBEDDING.passagePrefix)+t),{pooling:'mean',normalize:true});
 const rows=out.tolist();if(rows.length!==texts.length||rows.some(v=>!validVector(v)))throw Error('Invalid local embedding output');return rows;
}
export async function prepareLocalModel(){await embedLocal(['WoW Forever Alliance addon evidence'],{kind:'query',allowDownload:true});writeJSON(path.join(DATA_DIR,'embedding-ready.json'),{model:MODEL_KEY,dimensions:EMBEDDING.dimensions});return {model:MODEL_KEY,dimensions:EMBEDDING.dimensions,ready:true};}
export async function disposeEmbedder(){if(extractor){const p=await extractor;await p.dispose();extractor=null;}}
