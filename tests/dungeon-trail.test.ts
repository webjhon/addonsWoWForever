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
 const b=blueprint();assert.deepEqual(validateBlueprint(b).errors,[]);assert.equal(b.version,'3.0.0');
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
 DT.option('nativeTracking',true);TEST.waypoints[2040]={map=7,x=.4,y=.6};accept(2040);assert(DT.action.nav.map==7);assert(TEST.tracked==2040)
 TEST.waypoints[2040]={map=8,x=.2,y=.3};fire('QUEST_POI_UPDATE');assert(DT.action.nav.map==8)
 TEST.waypoints[2040]=nil;fire('WAYPOINT_UPDATE');assert(not DT.action.nav);assert(TEST.tracked==0);assert(DT.navGoal)
 TEST.waypoints[2040]={map=7,x=2,y=.5};fire('WAYPOINT_UPDATE');assert(not DT.action.nav)
 assert(DT.state().waypoints==nil)
`));
test('User tracking is preserved, explicit navigation preference can take over, disable releases only own tracking',()=>run(`
 DT.option('nativeTracking',true);TEST.tracked=999;TEST.waypoints[2040]={map=7,x=.4,y=.6};accept(2040);assert(TEST.tracked==999)
 DT.track(DT.action,true);assert(TEST.tracked==2040)
 DT.option('nativeTracking',false);assert(TEST.tracked==0)
 TEST.tracked=999;DT.command('navegacao off');assert(TEST.tracked==999)
 TEST.otherPin=true;TEST.tracked=0;DT.option('nativeTracking',true);assert(TEST.tracked==0)
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

test('Hub selection switches dungeon without abandoning accepted quests; actual instance temporarily prevails',()=>run(`
 accept(2040);assert(DT.action.dungeon.key=='deadmines')
 clickTab('VISÃO GERAL')
 local clicked=false;for _,f in ipairs(TEST.frames)do if f.caption and f.caption.text and f.caption.text:find('Wailing Caverns',1,true) and f.scripts.OnClick then f.scripts.OnClick(f);clicked=true;break end end
 assert(clicked and DT.state().plan=='wailing');assert(DT.action.dungeon.key=='wailing');assert(DT.current().quests[2040])
 enter('deadmines');assert(DT.action.dungeon.key=='deadmines');assert(DT.state().plan=='wailing')
 leave();assert(DT.action.dungeon.key=='wailing');DT.selectPlan(nil);assert(not DT.state().plan)
`));
test('Overview is available for all27 dungeons with access, quests and encounter metadata',()=>run(`
 for _,d in ipairs(DT.catalog)do DT.selectPlan(d.key);assert(DT.viewDungeon().key==d.key);assert(DT.overviews[d.key]);assert(visibleText(d.name))end
 DT.selectPlan('deadmines');assert(visibleText('Rhahk'))
`));
test('Visible configuration changes actual arrow/tracker behavior and survives reload by GUID',()=>run(`
 clickTab('CONFIGURAÇÕES');assert(visibleText('Seta de navegação própria'))
 DT.option('arrow',false);assert(not DT.arrow:IsShown());DT.option('tracker',false);assert(not DT.tracker:IsShown())
 DT.option('scale',1.2);DT.option('units','jd');DT.init();DT.reconcile()
 assert(not DT.state().options.arrow and DT.state().options.scale==1.2 and DT.state().options.units=='jd')
 TEST.guid='Player-new';DT.init();DT.reconcile();assert(DT.state().options.arrow and DT.state().options.scale==1)
`));
test('Own arrow has factual pickup target without quest waypoint or supertracking APIs',()=>run(`
 C_SuperTrack=nil;C_QuestLog.GetNextWaypoint=nil;C_QuestLog.GetNextWaypointForMap=nil
 DT.selectPlan('deadmines');DT.guide('pickup',DT.findDungeon('deadmines'),{id=2040})
 assert(DT.navGoal and DT.navGoal.map==1453);assert(math.abs(DT.navGoal.x-.6263)<.00001)
 assert(DT.arrow.texture:IsShown());assert(DT.arrow.distance>0);assert(TEST.trackCalls==0)
`));
test('Own direction geometry covers cardinal points and player heading',()=>run(`
 local r,d=DT.bearing(100,0,0);assert(math.abs(r)<.00001 and d==100)
 r=DT.bearing(0,-100,0);assert(math.abs(r+math.pi/2)<.00001)
 r=DT.bearing(-100,0,0);assert(math.abs(math.abs(r)-math.pi)<.00001)
 r=DT.bearing(0,100,0);assert(math.abs(r-math.pi/2)<.00001)
 r=DT.bearing(0,-100,-math.pi/2);assert(math.abs(r)<.00001)
`));
test('Arrow follows movement, marks arrival without completing quest, and hides stale heading on missing position',()=>run(`
 DT.guide('pickup',DT.findDungeon('deadmines'),{id=2040});local before=DT.arrow.distance
 TEST.px=.6263;TEST.py=.3411;DT.updateArrow();assert(DT.arrow.distance<1);assert(not DT.arrow.texture:IsShown())
 assert(DT.arrow.status.text:find('chegou'));assert(not DT.state().completed[2040])
 TEST.px=.2;TEST.py=.2;DT.updateArrow();assert(DT.arrow.texture:IsShown() and DT.arrow.distance~=before)
 TEST.positionMissing=true;DT.updateArrow();assert(not DT.arrow.texture:IsShown());assert(DT.arrow.status.text:find('indisponível'))
`));
test('Entrance-only source points are never used as boss coordinates inside dungeon',()=>run(`
 accept(2040);enter('deadmines');assert(not DT.navGoal);assert(not DT.arrow.texture:IsShown())
 assert(DT.arrow.status.text:find('Interior'))
`));
test('Encounter overview updates only from a successful real encounter event and persists through reload',()=>run(`
 enter('deadmines');local d=DT.findDungeon('deadmines');local b=DT.overviews.deadmines.encounters[1]
 assert(not DT.bossObserved(d,b));fire('ENCOUNTER_END',b.id,b.name,1,5,0);assert(not DT.bossObserved(d,b))
 fire('ENCOUNTER_END',b.id,b.name,1,5,1);assert(DT.bossObserved(d,b));DT.init();DT.reconcile();assert(DT.bossObserved(d,b))
`));
test('Arrow ticker is bounded and cancelled when navigation disabled; no quest log polling in tick',()=>run(`
 DT.guide('pickup',DT.findDungeon('deadmines'),{id=2040});local t=TEST.tickers[#TEST.tickers];local reads=TEST.reads
 for i=1,30 do t.callback()end;assert(TEST.reads==reads)
 DT.option('arrow',false);assert(t.cancelled);assert(not DT.arrow:IsShown())
`));
test('Own routes carry versioned sources, separate pickup/turn-in and explicitly mark entrances',()=>{
 const p=JSON.parse(fs.readFileSync(path.join(ROOT,'knowledge/alliance/dungeon-trail-routes.json'),'utf8'));
 assert.equal(p.clientVerified,false);assert.equal(Object.keys(p.dungeons).length,27);assert.equal(Object.keys(p.points).length,66);
 for(const r of Object.values(p.points) as any[])for(const kind of ['pickup','turnin','objectives'])for(const point of r[kind]){assert.ok(point.map>0&&point.x>=0&&point.x<=1&&point.y>=0&&point.y<=1);assert.ok(point.source.includes('9c1ce1e44238d8c6c8ca36d8f49836fde70b564f'));}
 assert.ok(p.points[2040].turnin[0].npc>0);assert.ok(p.points[2040].objectives.every(p=>p.entrance));
});

test('Own arrow never keeps a direction from secret coordinates or a different physical world',()=>run(`
 DT.guide('pickup',DT.findDungeon('deadmines'),{id=2040});assert(DT.arrow.texture:IsShown())
 C_Map.GetWorldPosFromMapPos=function(map,point)if map==1453 then return 1,CreateVector2D(0,0)end;return 0,CreateVector2D(0,0)end
 DT.updateArrow();assert(not DT.arrow.texture:IsShown());assert(DT.arrow.status.text:find('continente'))
 C_Map.GetWorldPosFromMapPos=function()return 0,{GetXY=function()return {secret=true},1 end}end
 DT.updateArrow();assert(not DT.arrow.texture:IsShown());assert(DT.arrow.status.text:find('indisponível'))
`));
