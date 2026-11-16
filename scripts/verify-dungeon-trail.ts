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
const initial=await executeJourney({blueprintPath:path.join(dir,'AllianceDungeonTrail.blueprint.json')});assert.equal(initial.status,'STATIC_PASSED',initial.error);
fs.writeFileSync(path.join(ROOT,'releases/AllianceDungeonTrail-3.0.0-candidate.sha256'),sha(fs.readFileSync(initial.result.out))+'  AllianceDungeonTrail-3.0.0-candidate.zip\n');
const tests=run(['--experimental-strip-types','--test','--test-reporter=tap',...fs.readdirSync(path.join(ROOT,'tests')).filter(f=>f.endsWith('.test.ts')).map(f=>'tests/'+f)],'node-tests');
run(['--experimental-strip-types','evals/run-evals.ts'],'factory-evals');
run(['--experimental-strip-types','scripts/factory.ts','doctor'],'doctor');
run(['--experimental-strip-types','orchestrator.ts','--blueprint','evals/fixtures/alliance-level-pulse.blueprint.json'],'example');
const count=Number(tests.match(/# tests (\d+)/)?.[1]),passed=Number(tests.match(/# pass (\d+)/)?.[1]);
assert.ok(count>=58&&passed===count);
const at=new Date().toISOString();
const report=`# AllianceDungeonTrail 3.0.0 — relatório executado

Execução: ${at}. Node ${process.version}. **${passed}/${count} testes aprovados**, incluindo36 cenários específicos. STATIC_PASSED/MOCK_PASSED. **Nenhum teste dentro do WoW realizado.**

Interface reconstruída: hub com seletor das27 dungeons, overview de acesso/encontros/quests, configurações persistentes e tracker separado. Plano escolhido é preservado; instância atual prevalece temporariamente. A seta é desenhada e rotacionada por código original e arte própria, com distância em linha reta e chegada que não conclui quest. Ticker limitado atualiza só geometria, sem consultar diário.

Cenários executados: seleção pela interface sem abandonar quests; entrada/saída e retomada de plano; configurações/GUID/reload; overview das27; setas sem C_SuperTrack/GetNextWaypoint; geometria cardinal e giro; movimento/chegada; perda de mapa; boss observado por evento; cancelamento do ticker; progressão autoritativa anterior, combate, morte, abandono e migração.

Dados próprios embarcados: coordenadas factuais MIT versionadas para48 coletas,55 entregas,16 entradas; áreas de objetivos selecionadas por tipo/máscara; catálogo de encontros da tabela DB2 da build70938. Referências comunitárias continuam UNVERIFIED em runtime. Ponto de entrada nunca vira coordenada de boss. **Não há pathfinding nem cobertura de posições internas garantida.**

Fengari executa Lua5.3 em mock; luaparse valida sintaxe5.1. Evals, doctor, exemplo e jornada determinística executados. Gates/autoria preservados. Verificação de conteúdo do ZIP, CRC32, TOC, branding, ícone e Arrow.tga. Prévias de hub/configurações/quests/seta são cenas de mock, não capturas do jogo.

Pendente para aprovação final: validar no Forever70938 as APIs de posição/rumo, direção visual da seta, fontes/escala/scroll, eventos reais de encontros, coordenadas comunitárias e utilidade em sessão de leveling. Quatro dungeons continuam sem quests curadas; overview não é mapa geométrico nem lista garantida de bosses ativos da fase. Nenhum resultado foi promovido a CLIENT_VERIFIED.
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
fs.writeFileSync(path.join(ROOT,'releases/AllianceDungeonTrail-3.0.0-candidate.sha256'),verification.sha256+'  '+verification.zip+'\n');
for(const state of ['overview','settings','navigation','quests'])run(['scripts/preview-dungeon-trail.mjs',state],'preview-'+state);
for(const ext of ['png','svg'])fs.copyFileSync(path.join(dir,'UI-overview.'+ext),path.join(dir,'UI-preview.'+ext));
console.log(JSON.stringify(verification,null,2));
