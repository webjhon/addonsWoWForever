import fs from 'node:fs';
import {validateToc} from '../src/guards.ts';
if(process.argv[1] && process.argv[1].endsWith('validate-toc.ts')){
 const file=process.argv[2];if(!file){console.error('Usage: validate-toc.ts <file.toc>');process.exit(2);}
 const result=validateToc(fs.readFileSync(file,'utf8'));console.log(result);if(!result.ok)process.exitCode=1;
}
export {validateToc} from '../src/guards.ts';
