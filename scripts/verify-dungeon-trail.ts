import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
import {ROOT,writeJSON,sha} from '../src/core.ts';
import {executeJourney} from '../orchestrator.ts';
const dir=path.join(ROOT,'research/AllianceDungeonTrail');
const logs=[];
function run(args,label){
 const r=spawnSync(process.execPath,args,{cwd:ROOT,encoding:'utf8',timeout:60000});
 const text=(r.stdout||'')+(r.stderr||'');fs.writeFileSync(path.join(dir,label+'.log'),text);logs.push({label,status:r.status,signal:r.signal});
 if(r.error||r.status!==0)throw Error(label+' failed: '+text.slice(-3000));return text;
}
run(['scripts/prepare-dungeon-trail.mjs'],'prepare');
const tests=run(['--experimental-strip-types','--test','--test-reporter=tap',...fs.readdirSync(path.join(ROOT,'tests')).filter(f=>f.endsWith('.test.ts')).map(f=>'tests/'+f)],'node-tests');
run(['--experimental-strip-types','evals/run-evals.ts'],'factory-evals');
run(['--experimental-strip-types','scripts/factory.ts','doctor'],'doctor');
const count=Number(tests.match(/# tests (\d+)/)?.[1]);const passed=Number(tests.match(/# pass (\d+)/)?.[1]);
assert.ok(count>=26&&passed===count);
const at=new Date().toISOString();
const healthFile=path.join(ROOT,'.data/source-health.json');
if(fs.existsSync(healthFile))fs.copyFileSync(healthFile,path.join(dir,'source-health.json'));
const report=`# Relatório de testes — Alliance Dungeon Trail 1.0.0

Execução registrada: ${at}. Status: STATIC_PASSED e MOCK_PASSED. **CLIENT_VERIFIED: não. Nenhum teste dentro do WoW foi realizado.**

## Evidência executada

- Node ${process.version}: ${passed}/${count} testes aprovados, incluindo 14 testes existentes da fábrica e 12 específicos do addon.
- Sintaxe de todos os arquivos Lua validada como Lua 5.1 por luaparse. Execução headless por Fengari (semântica Lua 5.3); não é um cliente WoW nem reproduz taint/restrições reais.
- Blueprint, escopo Alliance 1–60, interface 16001, TOC, arquivos referenciados, ícone e scans de APIs protegidas aprovados.
- Cenários headless: avisos sem duplicação; preparação nível 1; duas runs de calibração; descarte; XP zero; passagem de nível sem contagem duplicada; entregas excluídas da previsão; build/dia; combate e retomada; títulos traduzidos por ID; progresso e entrega; checks manuais distintos; notas; reload e separação por personagem; Horde/nível 61 ocultos; API ausente; valores secretos simulados e dados inválidos.
- Todas as 27 dungeons e quatro abas renderizadas pelo mock. Pool de frames estável após eventos repetidos; não há OnUpdate.
- Avaliação interna da fábrica: os 14 testes originais passaram. O campo luaMock do avaliador informa ausência de executável nativo lua; os testes Fengari acima foram executados separadamente e fazem parte de npm test.
- Doctor e jornada determinística executados. O empacotamento é feito exclusivamente por executeJourney/orchestrator e tools/build-addon.ts.
- Checagem HEAD de fontes públicas executada: cinco URLs acessíveis (HTTP 200); CurseForge respondeu HTTP 403. Isso não bloqueia o ZIP local e não é validação de conteúdo dessas páginas.
- ZIP final é descomprimido em memória pelo verificador; todos os conteúdos do blueprint, CRC32, tamanho, nomes de caminhos e metadados são conferidos. Ícone TGA 512×512, 32 bits, e PNG de divulgação gerados pela fábrica.
- Inspeção visual do ícone e de uma prévia PNG da cena real do mock realizada durante o desenvolvimento. Essa prévia usa aproximações de fontes/scroll e está marcada como simulação; não é captura de tela do jogo.

## Correções e revisão

- Leitura e aritmética adiadas durante combate; recuperação de XP em PLAYER_REGEN_ENABLED.
- Vínculo automático por título preservado por ID para não perder o estado após a entrega.
- Entrega de quest também invalida uso da run como repetição quando o evento ocorre em combate.
- Troca de aba/dungeon volta o scroll ao início. Janela ajusta escala ao tamanho do UIParent.
- Histórico limitado a 12 amostras por dungeon e personagem; reload descarta run incompleta.
- Ícone específico de portal substitui o motivo genérico de bússola apenas para este addon.
- Prévia SVG: corrigida a exclusão de textos inteiramente fora da área de recorte para evitar falha do renderizador resvg. Não era uma falha observada no WoW.

## Evidência de cliente e limites

O executável instalado foi lido como **1.60.1.70938**, flavor wowf. Não havia processo WoW em execução na verificação. O snapshot público consultado é **1.60.1.69893 / interface 16001**; os 17 símbolos usados foram encontrados nele, mas presença não prova assinaturas ou suporte na build atual. Nenhuma API foi promovida a CONFIRMED_IN_CLIENT.

O campo client=NOT_RUN_NO_GAME_CLIENT do avaliador original é uma mensagem fixa da ferramenta, não uma detecção de instalação. Nesta máquina há cliente instalado; o estado correto desta entrega é NÃO EXECUTADO NO JOGO.

Faixas são sugestões, não níveis mínimos garantidos. Há 63 quests selecionadas, sem cobertura exaustiva; quatro dungeons não têm quests curadas. Novas dungeons tardias têm disponibilidade não confirmada. Não há coordenadas nem navegação indoor. A previsão usa XP observada e heurística de níveis fracionários, com incerteza sobre XP futura, bônus e composição do grupo.

## Pendente no jogo

Confirmar GetBuildInfo/interface; carregamento do addon; ícone e fontes; drag/escala/scroll em resolução real; quests e NPCs nas instâncias; idioma do diário; XP e eventos reais; passagem para 60; persistência SavedVariables; restrições em combate; erros Lua e taint; disponibilidade e requisitos de todas as dungeons. O roteiro completo está em INSTALL.md.

Logs reproduzíveis: research/AllianceDungeonTrail/node-tests.log, factory-evals.log, doctor.log, journey.json, api-snapshot-evidence.json e package-verification.json no repositório. Sem publicação em CurseForge nem alegação de testes em jogo.
`;
fs.writeFileSync(path.join(ROOT,'addon-src/AllianceDungeonTrail/TEST-REPORT.md'),report);
fs.writeFileSync(path.join(dir,'TEST-REPORT.md'),report);
run(['scripts/prepare-dungeon-trail.mjs'],'prepare-final');
const journey=await executeJourney({blueprintPath:path.join(dir,'AllianceDungeonTrail.blueprint.json')});
writeJSON(path.join(dir,'journey.json'),journey);assert.equal(journey.status,'STATIC_PASSED');
const b=JSON.parse(fs.readFileSync(path.join(dir,'AllianceDungeonTrail.blueprint.json'),'utf8'));
const zip=fs.readFileSync(journey.result.out),entries=new Map();let offset=0;
function crc32(bytes){let c=0xffffffff;for(const b of bytes){c^=b;for(let j=0;j<8;j++)c=c&1?0xedb88320^(c>>>1):c>>>1;}return(c^0xffffffff)>>>0;}
while(zip.readUInt32LE(offset)===0x04034b50){
 const method=zip.readUInt16LE(offset+8),compressed=zip.readUInt32LE(offset+18),size=zip.readUInt32LE(offset+22),n=zip.readUInt16LE(offset+26),e=zip.readUInt16LE(offset+28);
 const name=zip.subarray(offset+30,offset+30+n).toString('utf8');assert.ok(name.startsWith('AllianceDungeonTrail/')&&!name.includes('..')&&!name.includes('\\'));assert.ok(!entries.has(name));
 const start=offset+30+n+e,data=zip.subarray(start,start+compressed),raw=method===8?zlib.inflateRawSync(data):data;
 assert.equal(raw.length,size);assert.equal(crc32(raw),zip.readUInt32LE(offset+14));entries.set(name,raw);offset=start+compressed;
}
assert.equal(zip.readUInt32LE(offset),0x02014b50);
for(const f of b.files)assert.equal(entries.get('AllianceDungeonTrail/'+f.filename)?.toString('utf8'),f.content);
const icon=entries.get('AllianceDungeonTrail/assets/Icon.tga');assert.equal(icon.readUInt16LE(12),512);assert.equal(icon.readUInt16LE(14),512);assert.equal(icon[16],32);assert.equal(icon.length,18+512*512*4);
const metadata=JSON.parse(entries.get('AllianceDungeonTrail/FACTORY-VALIDATION.json').toString());assert.equal(metadata.clientVerified,false);assert.equal(metadata.interface,16001);
const verification={at,addon:b.addonName,version:b.version,status:'STATIC_PASSED',mockStatus:'MOCK_PASSED',clientVerified:false,tests:{count,passed},logs,files:entries.size,zipBytes:zip.length,sha256:sha(zip),zip:path.basename(journey.result.out),verifiedBlueprintFiles:b.files.map(f=>f.filename),crc32:'ALL_PASSED',tga:'512x512x32',installedExecutableVersion:'1.60.1.70938',liveClientTests:'NOT_RUN'};
writeJSON(path.join(dir,'package-verification.json'),verification);
fs.writeFileSync(path.join(ROOT,'releases/AllianceDungeonTrail-1.0.0-candidate.sha256'),verification.sha256+'  '+verification.zip+'\n');
run(['scripts/preview-dungeon-trail.mjs'],'preview');
console.log(JSON.stringify(verification,null,2));
