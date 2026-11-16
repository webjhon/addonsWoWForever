import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'addon-src/AURANPC');
const ref='bebcb6bf309cf41b41bd74f8ca651e6a105b2676';
const url=`https://github.com/Gethe/wow-ui-source/blob/${ref}/Interface/AddOns/`;
fs.writeFileSync(path.join(out,'AURANPC.toc'),`## Interface: 16001
## Title: AURANPC
## Notes: Native quest unit circles with automatic scope, recovery and conflict detection.
## Author: Tonho Contrabando
## Version: 1.0.0
## X-Flavor: Forever
## IconTexture: Interface\\AddOns\\AURANPC\\assets\\Icon.tga
## SavedVariables: AURANPCDB
Core.lua
UI.lua
`);
const events=['PLAYER_LOGIN','PLAYER_ENTERING_WORLD','PLAYER_LEVEL_UP','QUEST_ACCEPTED','QUEST_REMOVED','QUEST_TURNED_IN','QUEST_LOG_UPDATE','QUEST_WATCH_UPDATE','PLAYER_TARGET_CHANGED','ZONE_CHANGED_NEW_AREA','CVAR_UPDATE','PLAYER_REGEN_ENABLED','PLAYER_REGEN_DISABLED','PLAYER_LOGOUT'];
const api=['CreateFrame','UnitGUID','UnitLevel','UnitFactionGroup','UnitIsQuestBoss','InCombatLockdown','GetInstanceInfo','GetBuildInfo','GetRealZoneText','issecretvalue','issecrettable','C_Timer.After','C_QuestLog.GetNumQuestLogEntries','C_CVar.GetCVar','C_CVar.GetCVarInfo','C_CVar.SetCVar','ShowQuestUnitCircles'];
const apiEvidence=[...api,...events].map(symbol=>({symbol,status:'UNVERIFIED',source:symbol==='ShowQuestUnitCircles'?url+'Blizzard_SettingsDefinitions_Frame/Nameplates.lua':url+'Blizzard_APIDocumentationGenerated/'+(symbol.startsWith('C_CVar')?'CVarDocumentation.lua':symbol==='UnitIsQuestBoss'?'UnitDocumentation.lua':symbol.startsWith('C_QuestLog')?'QuestLogDocumentation.lua':'')+' • Forever reference documented; installed70938 runtime and native rendering NOT_RUN. research/AURANPC/RESEARCH.md'}));
const interactivity={playerBenefit:'Deixar visível o círculo nativo em NPCs relevantes para quests, acompanhados pelo próprio motor do jogo, sem selecionar ou marcar cada NPC.',liveSignals:['character','level','quests','map','combat'],automaticTransitions:[{trigger:'Login elegível ou retomada após combate com configuração nativa desligada',response:'Habilita o recurso nativo quando público e permitido, confirma leitura e guarda valor anterior para restauração.'},{trigger:'Quest aceita, objetivo alterado, entrega ou mudança de alvo/zona',response:'Reconciliar contexto e próxima ação sem escritas repetidas; o motor nativo atualiza relevância e segue movimento.'},{trigger:'Alteração externa da configuração, saída do escopo ou pausa',response:'Ceder a conflito sem loop de disputa ou restaurar somente alteração própria; preservar ajuste original.'}],nextBestAction:'Procurar unidades com o círculo nativo para executar objetivos; no painel indicar alvo marcado pelo cliente, ausência de quests, bloqueio ou reativação necessária.',recovery:'Preferência por GUID, lease conservador da configuração original no SavedVariables, reconciliação no login e retomada fora de combate; API ausente não se torna sucesso.',manualAsFallbackOnly:true,acceptanceScenarios:[{given:'Personagem Alliance1–60 com círculos desativados e CVar público',when:'Login ocorre e depois há eventos de quests e zona',then:'Ativar uma vez, confirmar leitura e manter sem exigir cliques de progresso ou repetir escritas.'},{given:'Círculos habilitados pelo addon e personagem em combate',when:'Pausa é solicitada e depois o combate termina',then:'Adiar a escrita e restaurar somente o valor anterior quando permitido.'},{given:'Addon controla o ajuste nativo e outro ajuste altera para zero',when:'Recebe CVAR_UPDATE e outros eventos repetidos',then:'Ceder controle e mostrar conflito sem combater o outro ajuste; reativar apenas por preferência explícita.'}],testFile:'tests/auranpc.test.ts'};
const files=fs.readdirSync(out).filter(f=>/\.(lua|toc|md)$/.test(f)).sort().map(filename=>({filename,content:fs.readFileSync(path.join(out,filename),'utf8').replaceAll('\r\n','\n')}));
fs.writeFileSync(path.join(root,'research/AURANPC/AURANPC.blueprint.json'),JSON.stringify({addonName:'AURANPC',game:'WoW Forever',faction:'Alliance',purpose:'leveling',minLevel:1,maxLevel:60,interfaceVersion:16001,version:'1.0.0',eventsRegistered:events,apiNamespacesUsed:api,apiEvidence,files,interactivity},null,2)+'\n');
console.log('AURANPC blueprint generated from original source. Native rendering remains unverified.');
