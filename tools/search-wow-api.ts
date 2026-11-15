import {searchKnowledge} from '../src/search.ts';
export async function searchWowApi(query,options={}){return searchKnowledge(query,{...options,domain:'api'});}
if(process.argv[1] && process.argv[1].endsWith('search-wow-api.ts'))searchWowApi(process.argv.slice(2).join(' ')).then(x=>console.log(JSON.stringify(x,null,2))).catch(e=>{console.error(e);process.exitCode=1;});
