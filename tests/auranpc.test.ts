import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {run} from './auranpc/harness.ts';
const require=createRequire(import.meta.url),parse=require('luaparse').parse;
test('AURANPC original Lua compiles as WoW Lua 5.1',()=>{for(const f of fs.readdirSync('addon-src/AURANPC').filter(f=>f.endsWith('.lua')))assert.doesNotThrow(()=>parse(fs.readFileSync('addon-src/AURANPC/'+f,'utf8'),{luaVersion:'5.1'}));});
test('accept quest automatically draws actual marker and HUD, follows plate anchor',()=>run(`
 plate('nameplate1',6);assert(AURA.stats.drawn==0)
 accept(7);assert(AURA.stats.drawn==1);assert(AURA.hud:IsShown())
 local m=AURA.markers.nameplate1;assert(m:IsShown() and m.bound==TEST.plates.nameplate1 and m.pulse:IsPlaying())
 assert(m.points[1][2]==TEST.plates.nameplate1)
 TEST.plates.nameplate1:SetPoint('CENTER',UIParent,'CENTER',300,200);tick();assert(AURA.markers.nameplate1==m)
`));
test('objective kind ordinals are separate; finished objective never reactivated by tooltip',()=>run(`
 AURA.data[900001]={{1,0,111},{3,0,222},{1,1,333}}
 accept(900001,'Duas tarefas',{{type='monster',finished=true},{type='item',finished=false},{type='monster',finished=false}})
 plate('nameplate1',111);plate('nameplate2',222);plate('nameplate3',333)
 TEST.tooltips.nameplate1={lines={{type=17,leftText='Duas tarefas'}}};tick()
 assert(not AURA.markers.nameplate1 and AURA.markers.nameplate2 and AURA.markers.nameplate3)
 TEST.objectivesByID[900001][2].finished=true;fire('QUEST_LOG_UPDATE');assert(not AURA.markers.nameplate2 and AURA.markers.nameplate3)
`));
test('completion removes marker, reaccept restores, abandonment tombstone blocks delayed log',()=>run(`
 accept(7);plate('nameplate1',6);TEST.ready[7]=true;fire('QUEST_WATCH_UPDATE');assert(AURA.stats.drawn==0)
 TEST.ready[7]=false;fire('QUEST_LOG_UPDATE');assert(AURA.stats.drawn==1)
 fire('QUEST_REMOVED',7);assert(AURA.stats.drawn==0);tick();assert(AURA.stats.drawn==0)
 fire('QUEST_ACCEPTED',7);assert(AURA.stats.drawn==1)
 fire('QUEST_TURNED_IN',7);assert(AURA.stats.drawn==0)
`));
test('token reuse, remove event, missed removal and pool reuse do not leave stale marker',()=>run(`
 accept(7);local p=plate('nameplate1',6);local m=AURA.markers.nameplate1
 TEST.npcs.nameplate1.id=999999;tick();assert(not m:IsShown() and AURA.stats.drawn==0)
 TEST.npcs.nameplate1.id=6;tick();assert(AURA.markers.nameplate1==m)
 remove('nameplate1');assert(not m:IsShown());plate('nameplate2',6);assert(AURA.markers.nameplate2==m)
 TEST.plates.nameplate2=nil;tick();assert(AURA.stats.visible==0 and not m:IsShown())
`));
test('dungeon combat preserves permitted visuals, forbidden and hidden plates are rejected',()=>run(`
 accept(7);local p=plate('nameplate1',6);TEST.kind='party';TEST.combat=true;fire('PLAYER_ENTERING_WORLD');assert(AURA.stats.drawn==1)
 p.forbidden=true;tick();assert(AURA.stats.drawn==0 and AURA.stats.restricted==1)
 p.forbidden=false;p:Hide();tick();assert(AURA.stats.drawn==0)
 p:Show();tick();assert(AURA.stats.drawn==1)
`));
test('secret GUID and secret quest/objective/tooltip values fail closed',()=>run(`
 accept(7);plate('nameplate1',6);TEST.npcs.nameplate1.guid={secret=true};tick();assert(AURA.stats.drawn==0)
 TEST.tooltips.nameplate1={lines={{type={secret=true},leftText='Quest traduzida'}}};tick();assert(AURA.stats.drawn==0)
 TEST.npcs.nameplate1.guid=nil;TEST.objectivesByID[7]={{type='monster',finished={secret=true}}};fire('QUEST_LOG_UPDATE');assert(AURA.stats.drawn==0)
 TEST.objectivesByID[7]={secretTable=true};fire('QUEST_LOG_UPDATE');assert(AURA.stats.drawn==0)
 TEST.journal[1].questID={secret=true};fire('QUEST_LOG_UPDATE');assert(AURA.stats.drawn==0)
`));
test('exact unique own quest title fallback; unrelated and duplicate titles do not match',()=>run(`
 accept(900001,'Minha missão');plate('nameplate1',99999)
 TEST.tooltips.nameplate1={lines={{type=17,leftText='Quest do grupo'}}};tick();assert(AURA.stats.drawn==0)
 TEST.tooltips.nameplate1={lines={{type=17,leftText='Minha missão'}}};tick();assert(AURA.stats.drawn==1)
 accept(900002,'Minha missão');assert(AURA.stats.drawn==0)
`));
test('dead kill targets are suppressed but corpse loot remains relevant',()=>run(`
 accept(7);plate('nameplate1',6);TEST.npcs.nameplate1.dead=true;tick();assert(AURA.stats.drawn==0)
 accept(6,'Coleta',{{type='item',finished=false}});plate('nameplate2',103);TEST.npcs.nameplate2.dead=true;tick();assert(AURA.stats.drawn==1 and AURA.markers.nameplate2.action.text:find('SAQUE'))
`));
test('reload/login reconstructs quests and per-character configuration, caps allocations',()=>run(`
 accept(7);plate('nameplate1',6);AURA.settings.scale=1.4;local old=AURA.ticker;AURA.Login();assert(old.cancelled and AURA.settings.scale==1.4 and AURA.stats.drawn==1)
 TEST.guid='Player-Other';TEST.journal={};AURA.Login();assert(AURA.settings.scale==1 and AURA.stats.drawn==0)
 accept(7);for i=1,100 do plate('nameplate'..i,6) end
 assert(AURA.stats.visible<=80 and AURA.stats.drawn<=40 and AURA.created<=40)
`));
test('out of scope or disabled automatically hides; enemy plate assistance restores local setting',()=>run(`
 accept(7);plate('nameplate1',6);TEST.faction='Horde';fire('PLAYER_ENTERING_WORLD');assert(AURA.stats.drawn==0)
 TEST.faction='Alliance';TEST.level=61;fire('PLAYER_LEVEL_UP');assert(AURA.stats.drawn==0)
 TEST.level=20;TEST.cvars.nameplateShowEnemies='0';fire('PLAYER_ENTERING_WORLD');assert(TEST.cvars.nameplateShowEnemies=='1' and AURA.stats.drawn==1)
 AURA.settings.enabled=false;AURA.ApplyPlateSetting();AURA.Reconcile();assert(TEST.cvars.nameplateShowEnemies=='0' and AURA.stats.drawn==0)
 for _,v in ipairs(TEST.cvarWrites)do assert(v[1]=='nameplateShowEnemies')end
`));
test('missing APIs fail closed; demo is distinct and settings pulse has solid fallback',()=>run(`
 accept(7);plate('nameplate1',6);AURA.settings.pulse=false;AURA.Reconcile();assert(AURA.markers.nameplate1:IsShown() and not AURA.markers.nameplate1.pulse:IsPlaying())
 C_NamePlate.GetNamePlateForUnit=nil;tick();assert(AURA.stats.drawn==0)
 AURA.Demo();assert(AURA.demo:IsShown() and AURA.demo.name.text:find('DEMONSTRAÇÃO'));assert(AURA.stats.drawn==0)
 C_QuestLog=nil;AURA.ScanQuests();AURA.Reconcile();assert(not AURA.questReadable and AURA.stats.drawn==0)
`));
test('events coalesce, timer does not rescan quest log; sound is private and throttled',()=>run(`
 AURA.settings.sound=true;accept(7);plate('nameplate1',6);assert(TEST.sounds==1)
 local reads=TEST.reads;for i=1,10 do tick() end;assert(TEST.reads==reads and TEST.sounds==1)
 TEST.defer=true;for i=1,30 do fire('QUEST_LOG_UPDATE')end;assert(#TEST.timers==1);TEST.defer=false;flush();assert(TEST.reads==reads+1)
 TEST.combat=true;TEST.cvars.nameplateShowEnemies='0';AURA.ApplyPlateSetting();assert(TEST.cvars.nameplateShowEnemies=='0')
`));
test('shipped dungeon quest2040 maps item objective to npc642 and runs outdoors or in instance',()=>run(`
 assert(AURA.data[2040][1][1]==3 and AURA.data[2040][1][3]==642)
 accept(2040,'Título do diário',{{type='item',text='Item: 0/1',finished=false}})
 plate('nameplate1',642);assert(AURA.stats.drawn==1)
 TEST.kind='party';fire('PLAYER_ENTERING_WORLD');assert(AURA.stats.drawn==1)
 TEST.objectivesByID[2040][1].finished=true;fire('QUEST_LOG_UPDATE');assert(AURA.stats.drawn==0)
`));
test('startup discovery finds existing plates and drawing failure is never counted as drawn',()=>run(`
 accept(7);plate('nameplate1',6);AURA.Drop('nameplate1');assert(not AURA.markers.nameplate1)
 AURA.Login();assert(AURA.stats.drawn==1)
 local original=AURA.Draw;AURA.Draw=function()error('anchor denied')end;tick()
 assert(AURA.stats.drawn==0 and AURA.stats.restricted==1 and not AURA.markers.nameplate1)
 AURA.Draw=original;tick();assert(AURA.stats.drawn==1)
`));
test('malformed data and other players quests never manufacture own progress',()=>run(`
 plate('nameplate1',6);TEST.tooltips.nameplate1={lines={{type=17,leftText='Quest do grupo'}}};tick();assert(AURA.stats.drawn==0)
 accept(7);TEST.objectivesByID[7]=42;fire('QUEST_LOG_UPDATE');assert(AURA.stats.drawn==0)
 TEST.objectivesByID[7]={false};fire('QUEST_LOG_UPDATE');assert(AURA.stats.drawn==0)
 TEST.objectivesByID[7]={{type='monster',finished=false}};fire('QUEST_LOG_UPDATE');assert(AURA.stats.drawn==1)
 TEST.ready[7]={secret=true};fire('QUEST_LOG_UPDATE');assert(AURA.stats.drawn==0)
`));
test('real Forever failure: secret GUID and tooltip text, public quest relation draws without revealing identity',()=>run(`
 accept(7);plate('nameplate1',6);TEST.npcs.nameplate1.guid={secret=true}
 TEST.tooltips.nameplate1={lines={{type=17,leftText={secret=true}}}}
 TEST.relations.nameplate1=true;tick();assert(AURA.stats.drawn==1)
 local m=AURA.markers.nameplate1;assert(m.quest.text=='NPC de uma quest ativa')
 TEST.relations.nameplate1={secret=true};tick();assert(AURA.stats.drawn==0)
 TEST.relations.nameplate1=false;tick();assert(AURA.stats.drawn==0)
 TEST.relations.nameplate1=true;TEST.ready[7]=true;fire('QUEST_LOG_UPDATE');assert(AURA.stats.drawn==0)
`));
