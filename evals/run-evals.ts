import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {ROOT,writeJSON,now} from '../src/core.ts';
export function runEvals(){
 const tests=spawnSync(process.execPath,['--experimental-strip-types','--test',...['tests/factory.test.ts','tests/knowledge.test.ts','tests/diagnostics.test.ts','tests/mcp.test.ts']],{cwd:ROOT,encoding:'utf8',timeout:60000});
 const lua=spawnSync('lua',['-v'],{encoding:'utf8'});
 const report={at:now(),tests:tests.status===0?'PASSED':'FAILED',testOutput:(tests.stdout||'').slice(-6000),luaMock:lua.error?'NOT_RUN_NO_LUA_INTERPRETER':'AVAILABLE',client:'NOT_RUN_NO_GAME_CLIENT'};
 writeJSON(path.join(ROOT,'evals','last-evaluation.json'),report);return report;
}
if(process.argv[1]?.endsWith('run-evals.ts')){const report=runEvals();console.log(JSON.stringify(report,null,2));if(report.tests!=='PASSED')process.exitCode=1;}
