import fs from 'node:fs';import path from 'node:path';
import {ROOT} from '../src/core.ts';import {inspectClient,localClientContext} from '../src/client-evidence.ts';
const root=process.argv[2];
if(!root||root==='--context')console.log(JSON.stringify(localClientContext(),null,2));
else {
 const result=inspectClient(path.resolve(root),process.argv[3]?path.resolve(process.argv[3]):null);
 // Local inspection never silently replaces the reviewed committed evidence.
 const out=path.join(ROOT,'.data/client-intake.json');fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({out,build:result.identity.version,documents:result.documents.length,tables:result.tables.length,caches:result.caches,clientVerified:false},null,2));
}
