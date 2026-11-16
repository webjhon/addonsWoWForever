import fs from 'node:fs';
import path from 'node:path';
import {ROOT} from './core.ts';

// Heuristic static gate. A passing gate is NOT live-client verification.
// Product excellence also requires evidence-based human review and actual gameplay tests.
const SIGNALS={
 level: /\bUnitLevel\s*\(/,
 xp: /\b(?:UnitXP|UnitXPMax)\s*\(/,
 quests: /\b(?:C_QuestLog\.|IsQuestFlaggedCompleted\s*\()/,
 map: /\b(?:C_Map\.|GetZoneText\s*\(|GetRealZoneText\s*\()/,
 time: /\b(?:GetGameTime|GetServerTime|date|time)\s*\(/,
 pet: /\b(?:UnitExists\s*\(\s*["']pet["']|UnitHealth\s*\(\s*["']pet["']|C_PetJournal\.)/,
 inventory: /\b(?:C_Container\.|C_Item\.|GetInventoryItem)/,
 combat: /\b(?:UnitAffectingCombat\s*\(|InCombatLockdown\s*\()/,
 group: /\b(?:IsInGroup\s*\(|GetNumGroupMembers\s*\()/,
 character: /\b(?:UnitGUID|UnitClass|UnitRace|UnitFactionGroup)\s*\(/,
 stats: /\b(?:GetCombatRating|UnitStat|GetCritChance|GetHaste)\s*\(/,
 profession: /\b(?:C_TradeSkillUI\.|GetProfessions\s*\()/,
 equipment: /\b(?:GetInventoryItem|C_Item\.)/
};
const isMeaningful=s=>typeof s==='string'&&s.trim().length>=16&&!/^(todo|placeholder|pendente|n\/a|a definir)/i.test(s.trim());
export function verifyProductContract(blueprint){
  const errors=[];
  const c=blueprint?.interactivity;
  const sources=(blueprint?.files||[]).filter(f=>f.filename?.toLowerCase().endsWith('.lua')).map(f=>f.content||'').join('\n');
  if(!c||typeof c!=='object')return {ok:false,errors:['Missing interactivity contract: a static/list-only addon is not a product'],signals:[]};
  if(!isMeaningful(c.playerBenefit))errors.push('interactivity.playerBenefit must describe an actual player benefit, not a feature list');
  if(!Array.isArray(c.liveSignals)||new Set(c.liveSignals).size<2)errors.push('At least TWO independent live player-context signals are mandatory');
  const supported=[];
  for(const sig of c.liveSignals||[]){
    if(!Object.hasOwn(SIGNALS,sig)){errors.push('Unknown live signal: '+sig);continue;}
    if(!SIGNALS[sig].test(sources))errors.push('Declared live signal not read by source code: '+sig);
    else supported.push(sig);
  }
  if(supported.length<2)errors.push('Source code does not read two independent player-context categories');
  const eventNames=blueprint?.eventsRegistered||[];
  const reactive=eventNames.filter(e=>!['PLAYER_LOGIN','PLAYER_ENTERING_WORLD','ADDON_LOADED'].includes(e));
  if(reactive.length<1)errors.push('At least one progression/reactive game event is mandatory, not just login');
  if(!reactive.some(e=>sources.includes(e)))errors.push('Reactive events must be referenced in the actual addon Lua');
  const transitions=c.automaticTransitions;
  if(!Array.isArray(transitions)||transitions.length<2||transitions.some(x=>!isMeaningful(x?.trigger)||!isMeaningful(x?.response)))
    errors.push('At least two meaningful automatic trigger → response transitions are required');
  if(!isMeaningful(c.nextBestAction))errors.push('Addon must guide a concrete NEXT BEST ACTION based on current player state');
  if(!isMeaningful(c.recovery))errors.push('Addon must explain state recovery/reconciliation on reload, missed events or changed context');
  if(!c.manualAsFallbackOnly)errors.push('Manual checklists/controls may only be supplementary, not the core experience');
  if(!Array.isArray(c.acceptanceScenarios)||c.acceptanceScenarios.length<3||c.acceptanceScenarios.some(x=>!isMeaningful(x?.given)||!isMeaningful(x?.when)||!isMeaningful(x?.then)))
    errors.push('At least 3 Given/When/Then automatic behavior acceptance scenarios are required');
  if(typeof c.testFile!=='string'||!/^tests\/[A-Za-z0-9_.-]+\.test\.ts$/.test(c.testFile))errors.push('testFile must point to tests/<addon-specific>.test.ts');
  else if(!fs.existsSync(path.join(ROOT,c.testFile)))errors.push('Acceptance test file does not exist: '+c.testFile);
  // Explicit integration ensures first opening shows the hunter credits.
  if(!/ns\.TonhoBranding\s*:\s*RegisterWindow\s*\(/.test(sources) && !/ns\.TonhoBranding\s*:\s*Show\s*\(/.test(sources))
    errors.push('Addon Lua must invoke ns.TonhoBranding:RegisterWindow(mainFrame) or ns.TonhoBranding:Show() on first opening');
  if(!/\bif\b/.test(sources))errors.push('A static list with no contextual decision branches is not an interactive addon');
  return {ok:errors.length===0,errors,signals:supported,reactiveEvents:reactive,scenarios:c.acceptanceScenarios?.length||0,testFile:c.testFile||null};
}
