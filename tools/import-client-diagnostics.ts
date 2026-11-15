import path from 'node:path';
import {importProbe} from '../src/diagnostics.ts';
if(process.argv[1]?.endsWith('import-client-diagnostics.ts')){
 try{console.log(JSON.stringify(importProbe(path.resolve(process.argv[2])),null,2));}catch(e){console.error(e.message);process.exitCode=1;}
}
