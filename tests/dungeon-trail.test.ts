import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {ROOT} from '../src/core.ts';
import {validateBlueprint} from '../src/guards.ts';
import {verifyProductContract} from '../src/product-quality.ts';
import {run} from './dungeon-trail/harness.ts';
const require=createRequire(import.meta.url),parser=require('luaparse');
const blueprint=()=>JSON.parse(fs.readFileSync(path.join(ROOT,'research/AllianceDungeonTrail/AllianceDungeonTrail.blueprint.json'),'utf8'));
test('Rebuilt product satisfies unchanged factory gates, exact authorship, branding and Lua 5.1',()=>{
 const b=blueprint();assert.deepEqual(validateBlueprint(b).errors,[]);assert.equal(b.version,'2.0.0');
 assert.equal(verifyProductContract(b).ok,true);
 for(const f of b.files){if(f.filename.endsWith('.lua'))parser.parse(f.content,{luaVersion:'5.1'});assert.equal(fs.readFileSync(path.join(ROOT,'addon-src/AllianceDungeonTrail',f.filename),'utf8').replaceAll('\r\n','\n'),f.content);}
 const bad=structuredClone(b);bad.files.find(f=>f.filename.endsWith('.toc')).content=bad.files.find(f=>f.filename.endsWith('.toc')).content.replace('Tonho Contrabando','Alliance Addon Factory');
 assert.ok(validateBlueprint(bad).errors.some(e=>e.includes('Author')));
 delete bad.interactivity;assert.ok(validateBlueprint(bad).errors.some(e=>e.includes('interactivity')));
});
test('Factual catalog IDs come from shared bank, unknown coverage stays explicit, no fabricated coordinates',()=>{
 const c=JSON.parse(fs.readFileSync(path.join(ROOT,'research/AllianceDungeonTrail/catalog.json'),'utf8'));
 const bank=JSON.parse(fs.readFileSync(path.join(ROOT,'knowledge/alliance/quest/wowhead-forever.json'),'utf8')).records;
 assert.equal(c.length,27);assert.equal(c.filter(d=>!d.covered).length,4);
 for(const d of c)for(const q of d.quests){assert.ok(bank.some(r=>r.game_id===q.id&&r.name===q.name));assert.ok(q.source.includes('quest='+q.id));assert.equal(q.coordinates,undefined);}
 assert.ok(c.flatMap(d=>d.quests).length>=66);
});
test('First-open tracker has automatic preparation, pixel hunter credits and no progress controls',()=>run(`
 assert(DT.action.kind=='PREPARE');assert(DT.frame:IsShown());assert(visibleText('CRÉDITOS A'));assert(visibleText('Tonho'));assert(visibleText('Procure:'))
 assert(DT.startRun==nil and DT.check==nil and DT.bind==nil)
 TEST.level=1;fire('PLAYER_LEVEL_UP');assert(DT.action.kind=='PRE_LEVEL');assert(visibleText('Prepare seu primeiro grupo'))
`));
test('Localized acceptance → travel → instance objective: no manual click',()=>run(`
 accept(2040,'Investida Subterrânea');assert(DT.action.kind=='TRAVEL' and DT.action.id==2040)
 enter('deadmines');assert(DT.action.kind=='OBJECTIVE');assert(DT.action.id==2040);assert(visibleText('Sneed'))
 assert(DT.state().run and DT.state().run.key=='deadmines')
`));
test('Real counters advance two objectives, authoritative completion then actual turn-in',()=>run(`
 TEST.objectivesByID[2040]={{text='Máquina 0/1',finished=false},{text='Componente 0/1',finished=false}}
 accept(2040);enter('deadmines');assert(DT.action.title=='Máquina 0/1' and DT.action.objective==1)
 TEST.objectivesByID[2040][1].finished=true;fire('QUEST_WATCH_UPDATE',2040);assert(DT.action.title=='Componente 0/1' and visibleText('Componente 0/1'))
 TEST.objectivesByID[2040][2].finished=true;fire('QUEST_LOG_UPDATE');assert(DT.action.kind=='VERIFY')
 TEST.ready[2040]=true;fire('QUEST_LOG_UPDATE');assert(DT.action.kind=='TURN_IN');assert(not DT.state().completed[2040])
 TEST.journal={};TEST.ready[2040]=nil;fire('QUEST_TURNED_IN',2040);assert(DT.state().completed[2040]);assert(DT.action.id~=2040)
`));
test('Other unfinished dungeon quest wins before leaving for a completed turn-in; out-of-order progress works',()=>run(`
 accept(2040);accept(214);enter('deadmines');TEST.ready[2040]=true;fire('QUEST_LOG_UPDATE')
 assert(DT.action.id==214 and DT.action.kind=='OBJECTIVE')
 TEST.ready[214]=true;fire('QUEST_LOG_UPDATE');assert(DT.action.kind=='TURN_IN')
 leave();assert(DT.action.kind=='TURN_IN')
`));
test('External cavern quest is never presented as an indoor task',()=>run(`
 accept(168);accept(2040);assert(DT.action.kind=='OBJECTIVE' and DT.action.id==168)
 enter('deadmines');assert(DT.action.id==2040);assert(visibleText('externas ao portal'))
`));
test('Abandon and missing quest are distinct from completion; repeatable log wins historical completion',()=>run(`
 accept(2040);TEST.journal={};fire('QUEST_REMOVED',2040)
 assert(not DT.state().completed[2040]);assert(DT.action.kind=='PREPARE')
 local d=DT.findDungeon('deadmines');local q;for _,v in ipairs(d.quests)do if v.id==2040 then q=v end end
 assert(DT.questState(q,DT.current())=='MISSING')
 TEST.finished[2040]=true;accept(2040);assert(DT.action.kind=='TRAVEL')
`));
test('Reload rehydrates real quest state per GUID and excludes interrupted XP sample',()=>run(`
 accept(2040);enter('deadmines');DT.state().hidden=false;assert(DT.init());DT.reconcile()
 assert(DT.action.kind=='OBJECTIVE' and DT.action.id==2040);assert(not DT.state().completed[2040])
 fire('QUEST_TURNED_IN',2040);TEST.guid='Player-B';DT.init();DT.reconcile();assert(not DT.state().completed[2040])
 TEST.guid='Player-Test-A';DT.init();DT.reconcile();assert(DT.state().completed[2040])
`));
test('Legacy manual confirmations migrate without becoming accepted or completed quests',()=>run(`
 AllianceDungeonTrailDB.characters[TEST.guid]={schema=1,checks={x=true},completed={[2040]=true},bindings={x=2040},run={gain=999}}
 DT.init();DT.reconcile();assert(DT.state().schema==2);assert(not DT.state().completed[2040]);assert(not DT.state().checks)
 assert(DT.action.kind=='PREPARE')
`));
test('Native waypoint progresses, disappears safely, never persists synthetic coordinates',()=>run(`
 TEST.waypoints[2040]={map=7,x=.4,y=.6};accept(2040);assert(DT.action.nav.map==7);assert(TEST.tracked==2040)
 TEST.waypoints[2040]={map=8,x=.2,y=.3};fire('QUEST_POI_UPDATE');assert(DT.action.nav.map==8);assert(visibleText('Map 8'))
 TEST.waypoints[2040]=nil;fire('WAYPOINT_UPDATE');assert(not DT.action.nav);assert(TEST.tracked==0);assert(visibleText('Sem marcador'))
 TEST.waypoints[2040]={map=7,x=2,y=.5};fire('WAYPOINT_UPDATE');assert(not DT.action.nav)
 assert(DT.state().waypoints==nil)
`));
test('User tracking is preserved, explicit navigation preference can take over, disable releases only own tracking',()=>run(`
 TEST.tracked=999;TEST.waypoints[2040]={map=7,x=.4,y=.6};accept(2040);assert(TEST.tracked==999)
 DT.track(DT.action,true);assert(TEST.tracked==2040)
 DT.command('navegacao off');assert(TEST.tracked==0)
 TEST.tracked=999;DT.command('navegacao off');assert(TEST.tracked==999)
 TEST.otherPin=true;TEST.tracked=0;DT.command('navegacao on');assert(TEST.tracked==0)
`));
test('Combat retains cached action, defers reads, invalidates quest XP and recovers completion',()=>run(`
 accept(2040);enter('deadmines');local reads=TEST.reads;TEST.combat=true;fire('PLAYER_REGEN_DISABLED')
 TEST.journal={};fire('QUEST_TURNED_IN',2040);assert(TEST.reads==reads);assert(DT.pending);assert(not DT.state().run.valid)
 assert(DT.action.id==2040);assert(visibleText('COMBATE'))
 TEST.combat=false;fire('PLAYER_REGEN_ENABLED');assert(not DT.pending);assert(DT.action.id~=2040);assert(DT.state().completed[2040])
`));
test('Death suspends action and invalidates calibration; resurrection restores from journal',()=>run(`
 accept(2040);enter('deadmines');TEST.dead=true;fire('PLAYER_DEAD');assert(DT.action.kind=='RECOVER');assert(not DT.state().run.valid)
 TEST.dead=false;fire('PLAYER_UNGHOST');assert(DT.action.kind=='OBJECTIVE')
`));
test('Failed quest, unavailable objectives, API absence and secret values cannot manufacture progress',()=>run(`
 accept(2040);enter('deadmines');TEST.failed=2040;fire('QUEST_LOG_UPDATE');assert(DT.action.kind=='FAILED')
 TEST.failed=nil;TEST.objectivesByID[2040]={secretTable=true};fire('QUEST_LOG_UPDATE');assert(DT.action.kind=='WAIT_DATA')
 C_QuestLog.GetQuestObjectives=nil;fire('QUEST_LOG_UPDATE');assert(DT.action.kind=='BLOCKED')
 C_QuestLog.GetInfo=function()return {secret=true}end;fire('QUEST_LOG_UPDATE');assert(DT.action.kind=='BLOCKED')
 assert(not DT.state().completed[2040])
`));
test('Unknown instance, uncurated dungeon, raid and Horde never receive a fabricated route',()=>run(`
 TEST.kind='party';TEST.instance='Unknown localized instance';TEST.mapName='Unknown';TEST.instanceID=987;fire('PLAYER_ENTERING_WORLD');assert(DT.action.kind=='COVERAGE_GAP')
 enter('alcaz');assert(DT.action.kind=='COVERAGE_GAP')
 TEST.kind='raid';fire('PLAYER_ENTERING_WORLD');assert(DT.action.kind=='OUT_OF_SCOPE')
 TEST.faction='Horde';fire('PLAYER_ENTERING_WORLD');assert(not DT.frame:IsShown())
 TEST.faction='Alliance';TEST.level=61;fire('PLAYER_LEVEL_UP');assert(not DT.frame:IsShown())
`));
test('Level unlock alerts deduplicate, active quests survive suggested range changes, class gates hold',()=>run(`
 local n=#TEST.log;fire('PLAYER_LEVEL_UP');assert(#TEST.log==n)
 accept(2040);TEST.level=28;fire('PLAYER_LEVEL_UP');assert(#TEST.log>n);assert(DT.action.id==2040)
 n=#TEST.log;fire('PLAYER_LEVEL_UP');assert(#TEST.log==n)
 local d=DT.findDungeon('deadmines');for _,q in ipairs(d.quests)do if q.id==1654 then assert(not DT.questAllowed(q,DT.current())) end end
`));
test('Event bursts coalesce and repeated reconciliation allocates no extra UI frames',()=>run(`
 local n=#TEST.frames;local reads=TEST.reads;TEST.defer=true
 for i=1,100 do fire('QUEST_LOG_UPDATE') end;assert(#TEST.timers==1);flush();assert(TEST.reads==reads+1)
 for i=1,100 do fire('QUEST_LOG_UPDATE');flush() end;assert(#TEST.frames==n)
`));
test('Automatic XP expeditions count rollover once; no completion claims; two conservative comparable samples',()=>run(`
 TEST.xp=900;enter('deadmines');TEST.level=18;TEST.xp=100;TEST.max=1100;fire('PLAYER_XP_UPDATE');fire('PLAYER_LEVEL_UP')
 assert(DT.state().run.gain==200);TEST.now=TEST.now+600;leave();assert(#DT.state().history==1);assert(DT.state().history[1].valid)
 enter('deadmines');TEST.xp=320;fire('PLAYER_XP_UPDATE');TEST.now=TEST.now+600;leave()
 assert(#DT.state().history==2);assert(DT.estimate(DT.current()):find('expedições semelhantes'))
`));
test('Quest turn-in, reload, XP anomaly, short visits and different build cannot calibrate',()=>run(`
 enter('deadmines');TEST.xp=500;fire('PLAYER_XP_UPDATE');TEST.now=TEST.now+10;leave();assert(not DT.state().history[1].valid)
 enter('deadmines');fire('QUEST_TURNED_IN',12345);TEST.xp=800;fire('PLAYER_XP_UPDATE');TEST.now=TEST.now+600;leave();assert(not DT.state().history[2].valid)
 enter('deadmines');TEST.xp=10;fire('PLAYER_XP_UPDATE');assert(not DT.state().run.valid);DT.init();DT.reconcile();TEST.now=TEST.now+600;leave()
 assert(DT.estimate(DT.current()):find('0/2'))
 enter('deadmines');TEST.build='changed';TEST.xp=700;fire('PLAYER_XP_UPDATE');TEST.now=TEST.now+600;leave();assert(not DT.state().history[#DT.state().history].valid)
`));

test('NPC dialogue advertises actual offered quest and advances on acceptance without addon confirmation',()=>run(`
 TEST.offers={{questID=2040,title='Investida Subterrânea'}};fire('GOSSIP_SHOW')
 assert(DT.action.kind=='OFFERED');assert(visibleText('Aceite: Investida Subterrânea'));assert(DT.action.id==nil)
 accept(2040,'Investida Subterrânea');assert(DT.action.kind=='TRAVEL')
 TEST.offers={};fire('GOSSIP_CLOSED');assert(DT.action.kind=='TRAVEL')
`));
test('All catalog dungeons identify by build-specific instance ID despite translated or unknown names',()=>run(`
 for _,d in ipairs(DT.catalog)do
  TEST.kind='party';TEST.instance='Nome localizado';TEST.mapName='Nome localizado';TEST.instanceID=d.instanceID
  fire('PLAYER_ENTERING_WORLD');assert(DT.action.dungeon and DT.action.dungeon.key==d.key,d.key)
 end
 TEST.instanceID=36;TEST.instance='Minas Mortas';TEST.mapName='Minas Mortas';accept(2040,'Investida Subterrânea')
 assert(DT.action.kind=='OBJECTIVE' and DT.action.dungeon.key=='deadmines')
`));
test('Reload inside without quests must not start a valid new entry sample',()=>run(`
 enter('deadmines');TEST.xp=600;fire('PLAYER_XP_UPDATE');DT.init();DT.reconcile()
 assert(not DT.state().run.valid);TEST.now=TEST.now+600;TEST.xp=900;fire('PLAYER_XP_UPDATE');leave()
 assert(not DT.state().history[#DT.state().history].valid)
`));
test('Map provenance binds 27 unique real instance IDs to target build and separate localized names',()=>{
 const m=JSON.parse(fs.readFileSync(path.join(ROOT,'knowledge/alliance/forever-dungeon-maps.json'),'utf8').replace(/^\uFEFF/,''));
 assert.equal(m.build,'1.60.1.70938');assert.equal(m.clientExecuted,false);assert.equal(m.records.length,27);
 assert.equal(new Set(m.records.map(r=>r.instanceID)).size,27);
 assert.deepEqual(m.records.find(r=>r.key==='deadmines'),{key:'deadmines',instanceID:36,aliases:['Deadmines','Minas Mortas'],sourceType:'Map DB2 / InstanceType 1',sharedWings:false});
 for(const s of m.sources){assert.match(s.sha256,/^[0-9a-f]{64}$/);assert.ok(s.uri.includes('build=1.60.1.70938'));}
});

test('Native destination text remains useful even when no coordinates are returned',()=>run(`
 C_QuestLog.GetNextWaypointText=function()return 'Retorne a Shoni em Ventobravo' end
 accept(2040);TEST.ready[2040]=true;fire('QUEST_LOG_UPDATE')
 assert(DT.action.kind=='TURN_IN' and not DT.action.nav);assert(visibleText('Retorne a Shoni em Ventobravo'))
`));
