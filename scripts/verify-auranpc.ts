import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {ROOT,sha,writeJSON} from '../src/core.ts';
import {executeJourney} from '../orchestrator.ts';
const dir=path.join(ROOT,'research/AURANPC'),logs=[];
function run(args:string[],label:string){
 const r=spawnSync(process.execPath,args,{cwd:ROOT,encoding:'utf8',timeout:90000});
 const output=(r.stdout||'')+(r.stderr||'');fs.writeFileSync(path.join(dir,label+'.log'),output);logs.push({label,exit:r.status});
 if(r.error||r.status!==0)throw Error(label+': '+output.slice(-4500));return output;
}
async function build(){
 run(['scripts/prepare-auranpc.mjs'],'prepare');
 const j=await executeJourney({blueprintPath:path.join(dir,'AURANPC.blueprint.json')});assert.equal(j.status,'STATIC_PASSED',j.error);
 fs.writeFileSync(path.join(ROOT,'releases/AURANPC-2.0.0-candidate.sha256'),sha(fs.readFileSync(j.result.out))+'  AURANPC-2.0.0-candidate.zip\n');return j;
}
await build();
const tests=run(['--experimental-strip-types','--test','--test-reporter=tap',...fs.readdirSync(path.join(ROOT,'tests')).filter(f=>f.endsWith('.test.ts')).map(f=>'tests/'+f)],'node-tests');
run(['--experimental-strip-types','evals/run-evals.ts'],'factory-evals');
run(['--experimental-strip-types','scripts/factory.ts','doctor'],'doctor');
run(['--experimental-strip-types','orchestrator.ts','--blueprint','evals/fixtures/alliance-level-pulse.blueprint.json'],'example');
const count=Number(tests.match(/# tests (\d+)/)?.[1]),passed=Number(tests.match(/# pass (\d+)/)?.[1]);assert.ok(count>=85&&passed===count);
const report=`# AURANPC 2.0.0 — testes executados

Execução ${new Date().toISOString()}, Node ${process.version}. **${passed}/${count} testes aprovados** no conjunto completo, incluindo 16 testes específicos de comportamento/sintaxe e integridade do pacote. Evals da fábrica, doctor, exemplo e jornada executados. Validadores mantidos integralmente.

Status: STATIC_PASSED / MOCK_PASSED. **WoW Forever: NOT_RUN. Usuário só poderá testar depois. Nenhuma validação em jogo, visual real, compatibilidade/taint ou sucesso em dungeon foi declarada.** Executável instalado 1.60.1.70938, interface de referência16001; runtime UNVERIFIED.

Fengari executa Lua em mock: aceite/objetivos/conclusão/abandono/entrega; ordinais separados por tipo; fallback por título único da própria quest; mortes e saque; placas em movimento via âncora; troca de token e remoções perdidas; combate com placa permitida; placas proibidas/ocultas; GUID/tabelas/campos secretos; reload/GUID; limite80 unidades/40 marcadores; coalescência e ausência de rescan do diário no ticker; som local com cooldown; configuração e restauração de placas. Luaparse valida Lua5.1. Mock não reproduz o renderizador ou modelo de segurança real.

Pacote: SHA256, layout de instalação, conteúdo exato do blueprint e fonte, CRC32, autoria, branding central e TGA512x512 verificados por teste executável. As prévias UI-settings/highlight/complete são produzidas dos frames do mock, com fontes/âncoras aproximadas; não são capturas do jogo.

Revisão crítica: observação automática faz a parte principal; nenhuma marcação manual de progresso. Destaque é desenhado pelo AURANPC, com borda opaca mesmo sem pulso, exclamação e quest. Som é opt-in. Referência ForeverAuras usada apenas para avaliar arquitetura de âncoras/eventos, sem incorporar código/arte GPL. Associações MIT têm proveniência versionada, mas podem divergir de objetivos da fase atual.

Limitações materiais: efeito 2D sobre placas públicas, não aura3D; depende de alcance/visibilidade e restrições do cliente, sem promessa100%. Até40 marcadores simultâneos; sobreposição em grupos densos precisa de avaliação real. Dados cobrem1454 quests/5208 associações comunitárias de criaturas, não todas as quests; sem associação ou tooltip público correspondente, não inventa destaque. Placas amigáveis restritas em dungeon não são contornadas. Demonstração não conta como detecção. Aprovação final exige CLIENT-TEST.md no jogo.
`;
fs.writeFileSync(path.join(ROOT,'addon-src/AURANPC/TEST-REPORT.md'),report);fs.writeFileSync(path.join(dir,'TEST-REPORT.md'),report);
const journey=await build();writeJSON(path.join(dir,'journey.json'),journey);
run(['--experimental-strip-types','--test','tests/auranpc-package.test.ts'],'final-package-tests');
for(const state of ['settings','highlight','complete'])run(['scripts/preview-auranpc.mjs',state],'preview-'+state);
const zip=fs.readFileSync(journey.result.out);
const verification={status:'STATIC_PASSED',mockStatus:'MOCK_PASSED',clientVerified:false,clientTests:'NOT_RUN',version:'2.0.0',tests:{passed,count},logs,zip:path.basename(journey.result.out),zipBytes:zip.length,sha256:sha(zip),interface:16001,installedExecutable:'1.60.1.70938',visuals:'OWN_2D_NAMEPLATE_OVERLAY',sharedSideEffects:'NONE',crc32:'PASSED'};
writeJSON(path.join(dir,'package-verification.json'),verification);console.log(JSON.stringify(verification,null,2));
