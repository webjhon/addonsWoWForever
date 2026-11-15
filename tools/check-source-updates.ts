import path from 'node:path';
import {ROOT,readJSON,writeJSON,now} from '../src/core.ts';
export async function checkSources(){
 const sources=readJSON(path.join(ROOT,'knowledge/sources/manifest.json'));
 const report={at:now(),sources:{}};
 for(const [key,source] of Object.entries(sources)){
  if(!source.uri?.startsWith('https://')){report.sources[key]={status:'SKIPPED_INVALID_URL'};continue;}
  try{
   const response=await fetch(source.uri,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(10000),headers:{'User-Agent':'WoWAddonAIFactory/0.1 (manual source link check)'}});
   report.sources[key]={status:response.ok?'REACHABLE':'HTTP_ERROR',code:response.status,etag:response.headers.get('etag'),lastModified:response.headers.get('last-modified'),sourceReviewed:source.reviewed};
  }catch(e){report.sources[key]={status:'UNREACHABLE',reason:e.message};}
 }
 writeJSON(path.join(ROOT,'.data/source-health.json'),report);return report;
}
if(process.argv[1]?.endsWith('check-source-updates.ts'))checkSources().then(r=>console.log(JSON.stringify(r,null,2))).catch(e=>{console.error(e.message);process.exitCode=1;});
