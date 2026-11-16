import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
import {ROOT,writeJSON,sha} from '../src/core.ts';
import {executeJourney} from '../orchestrator.ts';
const dir=path.join(ROOT,'research/AllianceDungeonTrail'),logs=[];
function run(args,label){
 const r=spawnSync(process.execPath,args,{cwd:ROOT,encoding:'utf8',timeout:90000});
 const output=(r.stdout||'')+(r.stderr||'');fs.writeFileSync(path.join(dir,label+'.log'),output);logs.push({label,status:r.status,signal:r.signal});
 if(r.error||r.status!==0)throw Error(label+' failed: '+output.slice(-3500));return output;
}
run(['scripts/prepare-dungeon-trail.mjs'],'prepare');
const tests=run(['--experimental-strip-types','--test','--test-reporter=tap',...fs.readdirSync(path.join(ROOT,'tests')).filter(f=>f.endsWith('.test.ts')).map(f=>'tests/'+f)],'node-tests');
run(['--experimental-strip-types','evals/run-evals.ts'],'factory-evals');
run(['--experimental-strip-types','scripts/factory.ts','doctor'],'doctor');
run(['--experimental-strip-types','orchestrator.ts','--blueprint','evals/fixtures/alliance-level-pulse.blueprint.json'],'example');
const count=Number(tests.match(/# tests (\d+)/)?.[1]),passed=Number(tests.match(/# pass (\d+)/)?.[1]);
assert.ok(count>=58&&passed===count);
const at=new Date().toISOString();
const report=`# Relatório executado — AllianceDungeonTrail2.0.0

Execução: ${at}. Node ${process.version}. **STATIC_PASSED / MOCK_PASSED. CLIENT_VERIFIED: NÃO. Nenhum teste dentro do WoW foi realizado.**

- Suíte completa: **${passed}/${count}**, zero falhas. Inclui comportamento do addon em Fengari e testes da fábrica/base factual. Logs integrais em node-tests.log; cenários detalhados em tests/dungeon-trail.test.ts.
- Motor Lua executado em cenários de aceite localizado, viagem/entrada, objetivos fora de ordem, confirmação autoritativa, entrega/abandono, oferta do NPC, mapa/waypoint ausente, rastreamento externo, combate/retomada, morte/ressurreição, reload/GUID, migração de checks antigos, API ausente/valores secretos simulados, rajadas de eventos e calibração de XP conservadora. Não são só testes de regex ou presença de campos.
- Luaparse valida sintaxe Lua5.1; Fengari executa semântica Lua5.3. Mock não reproduz cliente, taint, valores secretos reais, renderização ou gameplay.
- Os validadores novos de qualidade/autoria permanecem intactos. O teste legado foi substituído por contrato2.0 e verificações de rejeição para autoria antiga/contrato ausente. Empacotador também executa a suíte específica antes de criar ZIP.
- Identificação das27 instâncias testada com IDs factuais da tabela Map70938 e nomes localizados; quests selecionadas têm IDs da base factual compartilhada. Dados DB2 são referência da build, não execução no jogo.
- Evals, doctor, exemplo e jornada determinística executados. Ver pacote e hashes em package-verification.json. Conteúdos do ZIP são comparados com o blueprint e branding injetado; CRC32, TOC, autoria, ordem de carga, Hunter, íconeTGA512×512×32 e metadados conferidos.
- Três prévias vêm da cena do mock executando o código real: preparação, objetivo e entrega. Fontes/posicionamento aproximados, explicitamente marcadas **não são capturas do WoW**. Não comprovam aparência no cliente.

## Limites e revisão

Ver PRODUCT-REVIEW.md, RESEARCH.md e API-CAPABILITIES.json. O executável instalado é1.60.1.70938; interface16001 ainda requer confirmação por GetBuildInfo em sessão real. APIs estão documentadas na branch Forever da UI Blizzard, com runtime desta build UNVERIFIED. Quatro guias continuam bloqueados por falta de dados de quests; catálogo selecionado, pré-requisitos parciais e disponibilidade de fase não garantida. Navegação usa exclusivamente waypoint/texto do cliente; sem ele não há seta precisa. Não há pathfinding indoor. Estimativa mede expedições comparáveis, não clears confirmados nem XP futura garantida.

Antes de aprovação final: executar roteiro de INSTALL.md no WoW, conferir eventos reais, objetivos/entregas, textura/fontes/escala, taint, reload, classe/idioma e utilidade durante sessão prolongada. **Não aprovado como produto final; PR candidato para revisão do usuário, sem merge automático.**
`;
for(const p of [path.join(ROOT,'addon-src/AllianceDungeonTrail/TEST-REPORT.md'),path.join(dir,'TEST-REPORT.md')])fs.writeFileSync(p,report);
run(['scripts/prepare-dungeon-trail.mjs'],'prepare-final');
const journey=await executeJourney({blueprintPath:path.join(dir,'AllianceDungeonTrail.blueprint.json')});
writeJSON(path.join(dir,'journey.json'),journey);assert.equal(journey.status,'STATIC_PASSED',journey.error);
const b=JSON.parse(fs.readFileSync(path.join(dir,'AllianceDungeonTrail.blueprint.json'),'utf8'));
const zip=fs.readFileSync(journey.result.out),entries=new Map();let offset=0;
function crc32(bytes){let c=0xffffffff;for(const byte of bytes){c^=byte;for(let j=0;j<8;j++)c=c&1?0xedb88320^(c>>>1):c>>>1;}return(c^0xffffffff)>>>0;}
while(zip.readUInt32LE(offset)===0x04034b50){
 const method=zip.readUInt16LE(offset+8),compressed=zip.readUInt32LE(offset+18),size=zip.readUInt32LE(offset+22),n=zip.readUInt16LE(offset+26),e=zip.readUInt16LE(offset+28);
 const name=zip.subarray(offset+30,offset+30+n).toString('utf8');assert.ok(name.startsWith('AllianceDungeonTrail/')&&!name.includes('..')&&!name.includes('\\'));assert.ok(!entries.has(name));
 const start=offset+30+n+e,data=zip.subarray(start,start+compressed),raw=method===8?zlib.inflateRawSync(data):data;
 assert.equal(raw.length,size);assert.equal(crc32(raw),zip.readUInt32LE(offset+14));entries.set(name,raw);offset=start+compressed;
}
assert.equal(zip.readUInt32LE(offset),0x02014b50);
for(const f of b.files){
 const expected=f.filename.endsWith('.toc')?f.content.replace('\nData.lua','\nTonhoBranding.lua\nData.lua'):f.content;
 assert.equal(entries.get('AllianceDungeonTrail/'+f.filename)?.toString('utf8'),expected,f.filename);
}
const toc=entries.get('AllianceDungeonTrail/AllianceDungeonTrail.toc').toString();assert.ok(toc.includes('## Author: Tonho Contrabando'));assert.ok(toc.indexOf('TonhoBranding.lua')<toc.indexOf('\nData.lua'));
for(const [name,source] of [['TonhoBranding.lua','design-system/branding/TonhoBranding.lua'],['assets/TonhoHunter.tga','design-system/branding/TonhoHunter.tga']])assert.deepEqual(entries.get('AllianceDungeonTrail/'+name),fs.readFileSync(path.join(ROOT,source)));
const icon=entries.get('AllianceDungeonTrail/assets/Icon.tga');assert.equal(icon.readUInt16LE(12),512);assert.equal(icon.readUInt16LE(14),512);assert.equal(icon[16],32);assert.equal(icon.length,18+512*512*4);
const metadata=JSON.parse(entries.get('AllianceDungeonTrail/FACTORY-VALIDATION.json').toString());assert.equal(metadata.clientVerified,false);assert.equal(metadata.interface,16001);assert.equal(metadata.productQuality.acceptanceTests,'PASSED');
const verification={at,addon:b.addonName,version:b.version,status:'STATIC_PASSED',mockStatus:'MOCK_PASSED',clientVerified:false,tests:{count,passed},logs,files:entries.size,zipBytes:zip.length,sha256:sha(zip),zip:path.basename(journey.result.out),verifiedBlueprintFiles:b.files.map(f=>f.filename),crc32:'ALL_PASSED',branding:'INJECTED_AND_VERIFIED',tga:'512x512x32 / original 32px pixel art',installedExecutableVersion:'1.60.1.70938',liveClientTests:'NOT_RUN'};
writeJSON(path.join(dir,'package-verification.json'),verification);
fs.writeFileSync(path.join(ROOT,'releases/AllianceDungeonTrail-2.0.0-candidate.sha256'),verification.sha256+'  '+verification.zip+'\n');
for(const state of ['preparation','objective','turn-in'])run(['scripts/preview-dungeon-trail.mjs',state],'preview-'+state);
for(const ext of ['png','svg'])fs.copyFileSync(path.join(dir,'UI-objective.'+ext),path.join(dir,'UI-preview.'+ext));
console.log(JSON.stringify(verification,null,2));
