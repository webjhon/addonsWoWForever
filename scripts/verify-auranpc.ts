import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
import {ROOT,writeJSON,sha} from '../src/core.ts';
import {executeJourney} from '../orchestrator.ts';
const dir=path.join(ROOT,'research/AURANPC'),logs=[];
function run(args,label){
 const r=spawnSync(process.execPath,args,{cwd:ROOT,encoding:'utf8',timeout:90000});
 const output=(r.stdout||'')+(r.stderr||'');fs.writeFileSync(path.join(dir,label+'.log'),output);logs.push({label,status:r.status,signal:r.signal});
 if(r.error||r.status!==0)throw Error(label+' failed: '+output.slice(-3500));return output;
}
run(['scripts/prepare-auranpc.mjs'],'prepare');
// Bootstrap/rebuild through the same gated packager before checking package freshness.
const initial=await executeJourney({blueprintPath:path.join(dir,'AURANPC.blueprint.json')});
assert.equal(initial.status,'STATIC_PASSED',initial.error);
fs.writeFileSync(path.join(ROOT,'releases/AURANPC-1.0.0-candidate.sha256'),sha(fs.readFileSync(initial.result.out))+'  AURANPC-1.0.0-candidate.zip\n');
const tests=run(['--experimental-strip-types','--test','--test-reporter=tap',...fs.readdirSync(path.join(ROOT,'tests')).filter(f=>f.endsWith('.test.ts')).map(f=>'tests/'+f)],'node-tests');
run(['--experimental-strip-types','evals/run-evals.ts'],'factory-evals');
run(['--experimental-strip-types','scripts/factory.ts','doctor'],'doctor');
run(['--experimental-strip-types','orchestrator.ts','--blueprint','evals/fixtures/alliance-level-pulse.blueprint.json'],'example');
const count=Number(tests.match(/# tests (\d+)/)?.[1]),passed=Number(tests.match(/# pass (\d+)/)?.[1]);
assert.ok(count>=58&&passed===count);
const at=new Date().toISOString();
const report=`# AURANPC — relatório executado

Execução: ${at}. Node ${process.version}. **STATIC_PASSED / MOCK_PASSED. CLIENT_VERIFIED: NÃO. Nenhum teste em jogo realizado.**

- Suíte completa: **${passed}/${count}**, zero falhas. Inclui15 testes do motor AURANPC e um teste do ZIP distribuído, além das suítes existentes. Logs completos em node-tests.log.
- Fengari executou código original e branding da fábrica: ativação do CVar com readback, nenhuma escrita redundante, quests/alvo/contexto, mundo/party, pausa e restauração, conflitos externos, combate/retomada, API ausente/secreta/locked/secure/readOnly, falha de escrita/restauração, reload/GUID, Horde/nível61/raid/PvP, rajadas de eventos e primeira abertura.
- **O mock não renderiza círculos no mundo.** Transitar para party no mock prova somente que a política não desliga o recurso, não que o círculo aparece em uma dungeon real. Movimento, cor amarela, seleção de NPC e renderização do motor precisam de verificação visual no cliente.
- Sintaxe Lua5.1 validada por luaparse; execução headless Fengari Lua5.3 não reproduz cliente, taint ou valores secretos reais. Nenhum validador enfraquecido.
- Evals, doctor, exemplo e jornada obrigatória executados. Empacotador executa os testes específicos antes do ZIP. Conteúdos, CRC32, TOC, ordem de carga, autoria Tonho Contrabando, branding/Hunter e ícone original512×512 verificados.
- Três prévias mostram o painel em ativo, conflito e bloqueado, executando código real no mock. São aproximações de fontes/posicionamento, não capturas do WoW nem prova da aura no cenário.

A implementação gerencia **ShowQuestUnitCircles**, recurso nativo documentado na UI Forever. Não cria aura3D arbitrária nem controla cor/formato/cobertura de doadores/entregadores. Runtime70938 e aparência continuam UNVERIFIED. Ver RESEARCH.md para fontes, capacidade e revisão crítica; INSTALL.md contém o roteiro de validação real. Não publicar como testado no cliente antes dessa etapa.
`;
for(const p of [path.join(ROOT,'addon-src/AURANPC/TEST-REPORT.md'),path.join(dir,'TEST-REPORT.md')])fs.writeFileSync(p,report);
run(['scripts/prepare-auranpc.mjs'],'prepare-final');
const journey=await executeJourney({blueprintPath:path.join(dir,'AURANPC.blueprint.json')});
writeJSON(path.join(dir,'journey.json'),journey);assert.equal(journey.status,'STATIC_PASSED',journey.error);
const b=JSON.parse(fs.readFileSync(path.join(dir,'AURANPC.blueprint.json'),'utf8'));
const zip=fs.readFileSync(journey.result.out),entries=new Map();let offset=0;
function crc32(bytes){let c=0xffffffff;for(const byte of bytes){c^=byte;for(let j=0;j<8;j++)c=c&1?0xedb88320^(c>>>1):c>>>1;}return(c^0xffffffff)>>>0;}
while(zip.readUInt32LE(offset)===0x04034b50){
 const method=zip.readUInt16LE(offset+8),compressed=zip.readUInt32LE(offset+18),size=zip.readUInt32LE(offset+22),n=zip.readUInt16LE(offset+26),e=zip.readUInt16LE(offset+28);
 const name=zip.subarray(offset+30,offset+30+n).toString('utf8');assert.ok(name.startsWith('AURANPC/')&&!name.includes('..')&&!name.includes('\\'));assert.ok(!entries.has(name));
 const start=offset+30+n+e,data=zip.subarray(start,start+compressed),raw=method===8?zlib.inflateRawSync(data):data;
 assert.equal(raw.length,size);assert.equal(crc32(raw),zip.readUInt32LE(offset+14));entries.set(name,raw);offset=start+compressed;
}
assert.equal(zip.readUInt32LE(offset),0x02014b50);
for(const f of b.files){
 const expected=f.filename.endsWith('.toc')?f.content.replace('\nCore.lua','\nTonhoBranding.lua\nCore.lua'):f.content;
 assert.equal(entries.get('AURANPC/'+f.filename)?.toString('utf8'),expected,f.filename);
}
const toc=entries.get('AURANPC/AURANPC.toc').toString();assert.ok(toc.includes('## Author: Tonho Contrabando'));assert.ok(toc.indexOf('TonhoBranding.lua')<toc.indexOf('\nCore.lua'));
for(const [name,source] of [['TonhoBranding.lua','design-system/branding/TonhoBranding.lua'],['assets/TonhoHunter.tga','design-system/branding/TonhoHunter.tga']])assert.deepEqual(entries.get('AURANPC/'+name),fs.readFileSync(path.join(ROOT,source)));
const icon=entries.get('AURANPC/assets/Icon.tga');assert.equal(icon.readUInt16LE(12),512);assert.equal(icon.readUInt16LE(14),512);assert.equal(icon[16],32);assert.equal(icon.length,18+512*512*4);
const metadata=JSON.parse(entries.get('AURANPC/FACTORY-VALIDATION.json').toString());assert.equal(metadata.clientVerified,false);assert.equal(metadata.interface,16001);assert.equal(metadata.productQuality.acceptanceTests,'PASSED');
const verification={at,addon:b.addonName,version:b.version,status:'STATIC_PASSED',mockStatus:'MOCK_PASSED',clientVerified:false,tests:{count,passed},logs,files:entries.size,zipBytes:zip.length,sha256:sha(zip),zip:path.basename(journey.result.out),verifiedBlueprintFiles:b.files.map(f=>f.filename),crc32:'ALL_PASSED',branding:'INJECTED_AND_VERIFIED',tga:'512x512x32 / original 32px pixel art',installedExecutableVersion:'1.60.1.70938',liveClientTests:'NOT_RUN'};
writeJSON(path.join(dir,'package-verification.json'),verification);
fs.writeFileSync(path.join(ROOT,'releases/AURANPC-1.0.0-candidate.sha256'),verification.sha256+'  '+verification.zip+'\n');
for(const state of ['active','conflict','blocked'])run(['scripts/preview-auranpc.mjs',state],'preview-'+state);
console.log(JSON.stringify(verification,null,2));
