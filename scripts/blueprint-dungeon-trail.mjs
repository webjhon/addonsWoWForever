import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'addon-src/AllianceDungeonTrail');
const events=['ENCOUNTER_END','PLAYER_LOGIN','PLAYER_ENTERING_WORLD','ZONE_CHANGED_NEW_AREA','ZONE_CHANGED','PLAYER_MAP_CHANGED','PLAYER_LEVEL_UP','PLAYER_XP_UPDATE','QUEST_ACCEPTED','QUEST_REMOVED','QUEST_TURNED_IN','QUEST_LOG_UPDATE','QUEST_WATCH_UPDATE','QUEST_POI_UPDATE','QUEST_DATA_LOAD_RESULT','WAYPOINT_UPDATE','PLAYER_REGEN_DISABLED','PLAYER_REGEN_ENABLED','PLAYER_DEAD','PLAYER_ALIVE','PLAYER_UNGHOST','SUPER_TRACKED_QUEST_CHANGED','GOSSIP_SHOW','GOSSIP_OPTIONS_REFRESHED','GOSSIP_CLOSED'];
const api=['Frame.SetFrameLevel','Frame.GetPoint','Frame.SetMovable','Frame.RegisterForDrag','Frame.StartMoving','Frame.StopMovingOrSizing','Frame.SetFrameStrata','C_GossipInfo.GetAvailableQuests','CreateFrame','UnitFactionGroup','UnitLevel','UnitXP','UnitXPMax','UnitGUID','UnitClass','UnitIsDeadOrGhost','GetBuildInfo','GetServerTime','InCombatLockdown','issecretvalue','issecrettable','GetInstanceInfo','IsInInstance','GetRealZoneText','GetZoneText','C_Timer.After','C_Timer.NewTicker','CreateVector2D','GetPlayerFacing','C_Map.GetPlayerMapPosition','C_Map.GetWorldPosFromMapPos','C_QuestLog.GetNumQuestLogEntries','C_QuestLog.GetInfo','C_QuestLog.GetQuestObjectives','C_QuestLog.IsComplete','C_QuestLog.IsFailed','C_QuestLog.IsQuestFlaggedCompleted','C_QuestLog.GetNextWaypoint','C_QuestLog.GetNextWaypointForMap','C_QuestLog.GetNextWaypointText','C_Map.GetBestMapForUnit','C_Map.GetMapInfo','C_SuperTrack.GetSuperTrackedQuestID','C_SuperTrack.IsSuperTrackingAnything','C_SuperTrack.SetSuperTrackedQuestID'];
const source='https://github.com/Gethe/wow-ui-source/tree/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated (Forever branch, 2026-11-13). Signatures documented; current installed 70938 runtime UNVERIFIED. See API-CAPABILITIES.json.';
fs.writeFileSync(path.join(out,'AllianceDungeonTrail.toc'),`## Interface: 16001
## Title: Alliance Dungeon Trail
## Notes: Reactive dungeon companion: live objectives, next action and own directional arrow, planning hub and live quest progression.
## Author: Tonho Contrabando
## Version: 3.1.0
## X-Flavor: Forever
## IconTexture: Interface\\AddOns\\AllianceDungeonTrail\\assets\\Icon.tga
## SavedVariables: AllianceDungeonTrailDB
Data.lua
Adapters.lua
Navigation.lua
Core.lua
Product.lua
UI.lua
`);
const contract={
 playerBenefit:'Detecta o progresso enquanto o jogador joga; escolhe o objetivo seguinte, orienta execução e entrega e acompanha expedições sem registro manual.',
 liveSignals:['character','level','xp','quests','map','combat'],
 automaticTransitions:[
  {trigger:'Quest aceita reconhecida pelo ID no diário real',response:'Preparação muda para viagem ou execução na instância correspondente, sem confirmar aceite manualmente.'},
  {trigger:'Objetivo atualizado ou quest concluída pelo cliente',response:'Troca o objetivo vigente e o rastreamento nativo; prioriza outros objetivos locais antes de recomendar a entrega.'},
  {trigger:'Entrar ou sair da instância detectado pelo cliente',response:'Reconcilia ambiente e sessão de XP; mantém referência de objetivos externos e amostras conservadoras.'},
  {trigger:'Reload, abandono, morte ou retorno do combate',response:'Reconstrói a ação pelo diário autoritativo, GUID e contexto; não converte ausência em conclusão.'}
 ],
 nextBestAction:'Selecionar um objetivo incompleto da dungeon atual; fora dela, entregar concluídas, resolver objetivos externos ou viajar com quests aceitas; preparar apenas quests potenciais elegíveis conhecidas.',
 recovery:'Persistência por GUID, schema migrado sem importar confirmações manuais antigas; reconciliação integral no login e eventos, sessões interrompidas excluídas da calibração, leituras inválidas bloqueiam decisões.',
 manualAsFallbackOnly:true,
 acceptanceScenarios:[
  {given:'Personagem Alliance com quest 2040 ainda ausente',when:'Aceita quest traduzida e atravessa o portal da dungeon',then:'A orientação passa automaticamente de preparação para viagem e objetivo interno.'},
  {given:'Dois objetivos da quest estão no diário da instância',when:'Primeiro objetivo conclui e depois o cliente confirma conclusão',then:'A ação avança ao segundo objetivo e depois entrega, sem check ou botão de progresso.'},
  {given:'Quest aceita e ação vigente com waypoint do cliente',when:'Reload, abandono, entrega ou waypoint indisponível acontecem',then:'Restaura progresso real por personagem, distingue abandono de entrega e remove navegação obsoleta.'}
 ],testFile:'tests/dungeon-trail.test.ts'
};
contract.playerBenefit='Planejar qualquer dungeon pelo hub, visualizar acesso/encontros/quests e seguir uma seta própria para pontos factuais, com progresso automático e configuração persistente.';
contract.nextBestAction='O plano escolhido orienta preparação/viagem fora da instância; dentro, contexto real prevalece. A seta do addon escolhe coordenadas de coleta/entrega/área e calcula distância e rumo; chegada não completa quests.';
contract.automaticTransitions.push({trigger:'Plano muda no seletor ou jogador entra/sai de outra dungeon',response:'Atualizar overview e destino sem abandonar quests; preservar intenção e retomar plano após a saída.'});
contract.acceptanceScenarios.push({given:'Quest em andamento em uma dungeon e APIs de rastreio do jogo ausentes',when:'Jogador escolhe outra dungeon e solicita guiar coleta pelo hub',then:'Selecionar ponto factual próprio e desenhar seta com distância/rumo, sem bloquear navegação na quest antiga.'});
const files=fs.readdirSync(out).filter(f=>/\.(lua|toc|md)$/.test(f)).sort().map(filename=>({filename,content:fs.readFileSync(path.join(out,filename),'utf8').replaceAll('\r\n','\n')}));
const blueprint={addonName:'AllianceDungeonTrail',game:'WoW Forever',faction:'Alliance',purpose:'leveling',minLevel:1,maxLevel:60,interfaceVersion:16001,version:'3.1.0',eventsRegistered:events,apiNamespacesUsed:api,apiEvidence:[...api,...events].map(symbol=>({symbol,status:'UNVERIFIED',source})),interactivity:contract,files};
fs.writeFileSync(path.join(root,'research/AllianceDungeonTrail/AllianceDungeonTrail.blueprint.json'),JSON.stringify(blueprint,null,2)+'\n');
console.log('Prepared product 3.1.0 blueprint, shared factual quest IDs, original code and acceptance contract.');
