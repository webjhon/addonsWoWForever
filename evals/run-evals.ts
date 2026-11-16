import {spawnSync} from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import {ROOT,writeJSON,now} from '../src/core.ts';
export function runEvals(){
 const testFiles=fs.readdirSync(path.join(ROOT,'tests')).filter(f=>f.endsWith('.test.ts')).sort().map(f=>'tests/'+f);
 const tests=spawnSync(process.execPath,['--experimental-strip-types','--test',...testFiles],{cwd:ROOT,encoding:'utf8',timeout:60000});
 const lua=spawnSync('lua',['-v'],{encoding:'utf8'});
 const report={at:now(),tests:tests.status===0?'PASSED':'FAILED',testFiles,testOutput:(tests.stdout||'').slice(-6000),luaMock:lua.error?'NOT_RUN_NO_LUA_INTERPRETER':'AVAILABLE',client:'NOT_RUN'};
 writeJSON(path.join(ROOT,'evals','last-evaluation.json'),report);return report;
}
if(process.argv[1]?.endsWith('run-evals.ts')){const report=runEvals();console.log(JSON.stringify(report,null,2));if(report.tests!=='PASSED')process.exitCode=1;}
