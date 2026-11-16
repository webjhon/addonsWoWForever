import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'addon-src/AURANPC');
const events=['PLAYER_LOGIN','PLAYER_ENTERING_WORLD','PLAYER_LEVEL_UP','QUEST_ACCEPTED','QUEST_LOG_UPDATE','QUEST_WATCH_UPDATE','QUEST_REMOVED','QUEST_TURNED_IN','NAME_PLATE_UNIT_ADDED','NAME_PLATE_UNIT_REMOVED','PLAYER_REGEN_ENABLED','CVAR_UPDATE','PLAYER_LOGOUT'];
const api=['C_QuestLog.UnitIsRelatedToActiveQuest','CreateFrame','UnitGUID','UnitName','UnitLevel','UnitFactionGroup','UnitIsDeadOrGhost','InCombatLockdown','GetTime','issecretvalue','issecrettable','C_NamePlate.GetNamePlates','C_NamePlate.GetNamePlateForUnit','C_TooltipInfo.GetUnit','Enum.TooltipDataLineType.QuestTitle','C_QuestLog.GetNumQuestLogEntries','C_QuestLog.GetInfo','C_QuestLog.GetQuestObjectives','C_QuestLog.IsComplete','C_QuestLog.IsFailed','C_CVar.GetCVar','C_CVar.SetCVar','C_Timer.After','C_Timer.NewTicker','PlaySound','SOUNDKIT.RAID_WARNING','Frame.IsForbidden','Frame.CreateAnimationGroup'];
fs.writeFileSync(path.join(out,'AURANPC.toc'),`## Interface: 16001
## Title: AURANPC
## Notes: Own local animated per-NPC quest highlights, live objective detection and diagnostics. Alliance leveling 1-60.
## Author: Tonho Contrabando
## Version: 2.0.1
## X-Flavor: Forever
## IconTexture: Interface\\AddOns\\AURANPC\\assets\\Icon.tga
## SavedVariables: AURANPCDB
Data.lua
Engine.lua
Visuals.lua
Core.lua
`);
const interactivity={
 playerBenefit:'Reconhecer NPCs de objetivos pendentes do próprio personagem e desenhar sobre cada placa um alerta próprio grande, amarelo e pulsante que acompanha movimento, sem controles de progresso.',
 liveSignals:['character','level','quests','combat'],
 automaticTransitions:[
  {trigger:'Aceitar quest ou surgir placa de criatura associada a objetivo pendente',response:'Desenhar destaque individual e atualizar faixa local automaticamente, sem raid marks ou mensagens.'},
  {trigger:'Concluir objetivo, concluir quest, abandonar ou entregar missão',response:'Reconciliar objetivos por tipo e ordinal; remover os marcadores obsoletos sem depender de confirmação manual.'},
  {trigger:'Mover NPC, trocar unidade da placa, entrar em dungeon ou perder placa',response:'Acompanhar pela âncora do frame permitido, revalidar identidade e liberar destaque quando perder a correspondência.'}
 ],
 nextBestAction:'Destacar agora os NPCs visíveis que satisfazem objetivos pendentes das quests aceitas; distinguir saque de abate e explicar ausência de dados/placas em diagnóstico.',
 recovery:'No login/reload reconstruir associações pelo diário autoritativo; guardar apenas preferências por GUID, descobrir placas existentes, reconciliar eventos e limitar pool/ticker. Remoções têm tombstone até novo aceite.',
 manualAsFallbackOnly:true,
 acceptanceScenarios:[
  {given:'Personagem Alliance com placa visível sem quest correspondente',when:'Aceita a quest associada e conclui seu objetivo',then:'Exibe automaticamente o marcador original e depois o remove, sem checklist ou confirmação manual.'},
  {given:'NPC relevante em dungeon com placa acessível e personagem em combate',when:'NPC move, token é reciclado e a placa some',then:'Âncora acompanha movimento, identidade nova é reavaliada e destaque antigo é liberado.'},
  {given:'Quest e preferências de um personagem já foram observadas',when:'Ocorre reload, mudança de personagem, valor secreto ou placa proibida',then:'Restaura apenas preferências do GUID correto e usa dados públicos atuais, sem falsificar visual confirmado.'}
 ],testFile:'tests/auranpc.test.ts'
};
const source='https://github.com/Gethe/wow-ui-source/tree/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated (Forever 2026-11-13). See research/AURANPC/API-CAPABILITIES.json; installed 1.60.1.70938 runtime NOT_RUN. All current runtime claims UNVERIFIED.';
const b={addonName:'AURANPC',game:'WoW Forever',faction:'Alliance',purpose:'leveling',minLevel:1,maxLevel:60,interfaceVersion:16001,version:'2.0.1',eventsRegistered:events,apiNamespacesUsed:api,apiEvidence:[...api,...events].map(symbol=>({symbol,status:symbol==='C_QuestLog.UnitIsRelatedToActiveQuest'?'CONFIRMED_IN_CLIENT':'UNVERIFIED',source:symbol==='C_QuestLog.UnitIsRelatedToActiveQuest'?'Forever1.60.1.70938, 2026-11-16, Stockade, public relation true despite secret GUID/text; own marker observed following NPC. See LIVE-SESSION-2026-11-16.md':source})),interactivity,files:fs.readdirSync(out).filter(f=>/\.(lua|toc|md)$/.test(f)).sort().map(filename=>({filename,content:fs.readFileSync(path.join(out,filename),'utf8').replaceAll('\r\n','\n')}))};
fs.writeFileSync(path.join(root,'research/AURANPC/AURANPC.blueprint.json'),JSON.stringify(b,null,2)+'\n');
console.log('Prepared AURANPC 2.0.1 original renderer and behavioral contract.');
