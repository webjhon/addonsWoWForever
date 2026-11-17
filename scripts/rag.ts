import {ragStatus} from '../src/rag-status.ts';
import {prepareLocalModel,disposeEmbedder} from '../src/embeddings.ts';
import {buildVectorStore} from '../rag/vector-store.ts';
const action=process.argv[2];
try{
 if(action==='model')console.log(JSON.stringify(await prepareLocalModel(),null,2));
 else if(action==='embed')console.log(JSON.stringify(await buildVectorStore(),null,2));
 else if(action==='status'){console.log(JSON.stringify(ragStatus(),null,2));
 }else throw Error('Usage: rag.ts model | embed | status');
}catch(e){console.error(e.message);process.exitCode=1;}finally{await disposeEmbedder();}
