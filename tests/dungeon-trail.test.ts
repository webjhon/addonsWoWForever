import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {ROOT} from '../src/core.ts';
import {validateBlueprint} from '../src/guards.ts';
const require=createRequire(import.meta.url);
const {lua,lauxlib,lualib,to_luastring,to_jsstring}=require('fengari');
const parser=require('luaparse');
const src=path.join(ROOT,'addon-src/AllianceDungeonTrail');
function run(code){
 const L=lauxlib.luaL_newstate();lualib.luaL_openlibs(L);
 const exec=(s,name)=>{
  let status=lauxlib.luaL_loadbuffer(L,to_luastring(s),null,to_luastring(name));
  if(status===lua.LUA_OK)status=lua.lua_pcall(L,0,0,0);
  if(status!==lua.LUA_OK)throw new Error(to_jsstring(lua.lua_tostring(L,-1)));
 };
 try{
  exec(fs.readFileSync(path.join(ROOT,'tests/dungeon-trail/mock.lua'),'utf8'),'mock');
  for(const f of ['Data.lua','Core.lua','UI.lua'])exec(`local function chunk(...)\n${fs.readFileSync(path.join(src,f),'utf8')}\nend\nchunk('AllianceDungeonTrail', DT)`,f);
  exec("fire('PLAYER_LOGIN')",'login');exec(code,'scenario');
 }finally{lua.lua_close(L);}
}
test('Dungeon Trail blueprint and every Lua file parse as Lua 5.1',()=>{
 const b=JSON.parse(fs.readFileSync(path.join(ROOT,'research/AllianceDungeonTrail/AllianceDungeonTrail.blueprint.json'),'utf8'));
 assert.deepEqual(validateBlueprint(b).errors,[]);
 for(const f of b.files.filter(x=>x.filename.endsWith('.lua')))parser.parse(f.content,{luaVersion:'5.1'});
 for(const f of b.files)assert.equal(fs.readFileSync(path.join(src,f.filename),'utf8'),f.content);
});
test('Catalog preserves provenance, Alliance access, range and known gaps',()=>{
 const data=JSON.parse(fs.readFileSync(path.join(ROOT,'research/AllianceDungeonTrail/catalog.json'),'utf8'));
 assert.equal(data.length,27);assert.equal(new Set(data.map(d=>d.key)).size,27);
 for(const d of data){assert.ok(d.source.startsWith('https:'));assert.ok(d.level>=1&&d.high<=60&&d.level<=d.high);for(const q of d.quests){assert.equal(q.faction,'AllianceAccessible');assert.ok(q.source&&q.evidence&&q.pickup&&q.guide)}}
 assert.equal(data.reduce((n,d)=>n+d.quests.length,0),63);
 assert.ok(data.filter(d=>d.quests.length===0).every(d=>/Sem|sem/.test(d.access)));
});
test('Level alerts fire once and only appropriate ranges; level 1 has preparation guidance',()=>run(`
 local n=#TEST.log;fire('PLAYER_ENTERING_WORLD');assert(#TEST.log==n)
 TEST.level=28;fire('PLAYER_LEVEL_UP');assert(#TEST.log>n);n=#TEST.log
 fire('PLAYER_LEVEL_UP');assert(#TEST.log==n)
 TEST.level=1;fire('PLAYER_ENTERING_WORLD');assert(DT.frame.shown)
 local found=false;for _,f in ipairs(TEST.frames) do if f.text and f.text:find('ANTES DA PRIMEIRA') then found=true end end;assert(found)
`));
test('Two repeat runs calibrate, one does not; discard does not count',()=>run(`
 DT.select(findDungeon('deadmines'));local s=DT.state();s.repeatRun=true
 assert(DT.startRun());TEST.xp=400;fire('PLAYER_XP_UPDATE');assert(DT.finishRun(false))
 assert(DT.estimate():find('1/2'))
 assert(DT.startRun());TEST.xp=600;fire('PLAYER_XP_UPDATE');DT.finishRun(true)
 assert(DT.estimate():find('1/2'))
 DT.startRun();TEST.xp=800;fire('PLAYER_XP_UPDATE');DT.finishRun(false)
 assert(DT.estimate():find('Próximo nível: ~1 runs'));assert(DT.estimate():find('2 amostras'))
`));
test('XP rollover counted once despite duplicate level and XP events',()=>run(`
 DT.select(findDungeon('deadmines'));TEST.xp=900;DT.state().repeatRun=true;DT.startRun()
 TEST.level=18;TEST.xp=100;TEST.max=1100;fire('PLAYER_LEVEL_UP');fire('PLAYER_XP_UPDATE')
 assert(DT.state().run.gain==200);assert(DT.state().run.valid)
 DT.finishRun(false);assert(DT.state().history.deadmines[1].gain==200)
`));
test('Zero XP, quest turn-ins, new build/day and distant levels never produce false run estimates',()=>run(`
 DT.state().repeatRun=true;DT.startRun();DT.finishRun(false);DT.startRun();DT.finishRun(false)
 assert(DT.estimate():find('0/2'))
 DT.startRun();TEST.xp=300;fire('QUEST_TURNED_IN',123);fire('PLAYER_XP_UPDATE');DT.finishRun(false)
 assert(DT.estimate():find('0/2'))
 local key=DT.dungeon().key
 DT.state().history[key]={{valid=true,repeatRun=true,gain=200,fraction=.2,level=17,build='old',day=TEST.day},{valid=true,repeatRun=true,gain=200,fraction=.2,level=17,build=TEST.build,day='old'}}
 assert(DT.estimate():find('0/2'))
 TEST.level=60;assert(DT.estimate():find('concluída'));assert(not DT.startRun())
`));
test('Combat defers journal and XP reads; regen catches up without gameplay actions',()=>run(`
 DT.startRun();TEST.combat=true;TEST.xp=500;fire('PLAYER_XP_UPDATE');assert(not DT.frame.shown)
 assert(DT.state().run.gain==0);assert(not DT.finishRun(false))
 TEST.combat=false;fire('PLAYER_REGEN_ENABLED');assert(DT.state().run.gain==300);assert(DT.frame.shown)
`));
test('Localized journal IDs bind and objective progress stays authoritative',()=>run(`
 DT.select(findDungeon('deadmines'))
 TEST.journal={{questID=1234,title='Título traduzido',isHeader=false}}
 TEST.objectives={{text='Objetivo localizado 1/1',finished=true}};fire('QUEST_LOG_UPDATE')
 assert(DT.bind(1,1234));local d=DT.dungeon();local q=DT.quests(d)[1]
 local state,objs,id=DT.questStatus(d,q,1);assert(state=='NO DIÁRIO' and id==1234 and objs[1].done)
 TEST.complete[1234]=true;assert(DT.questStatus(d,q,1)=='PRONTA PARA ENTREGAR')
 fire('QUEST_TURNED_IN',1234);TEST.journal={};fire('QUEST_LOG_UPDATE');assert(DT.questStatus(d,q,1)=='ENTREGUE')
 assert(not DT.bind(1,9999));assert(not DT.bind(nil,1234))
`));
test('Manual picked check does not mean complete, custom quest and notes persist per character',()=>run(`
 local d=DT.dungeon();local q=DT.quests(d)[1];local key=DT.questKey(d,q,1)
 DT.check(key..':picked');assert(DT.questStatus(d,q,1)=='PEGUEI (manual)')
 TEST.journal={{questID=321,title='Quest adicional',isHeader=false}};fire('QUEST_LOG_UPDATE')
 assert(DT.addQuest(321));assert(not DT.addQuest(321))
 DT.command('nota 1 Boss na sala azul');assert(DT.state().notes[key]=='Boss na sala azul')
 DT.startRun();assert(DT.init());assert(not DT.state().run);assert(DT.state().notes[key])
 TEST.guid='Player-Test-B';DT.init();assert(not DT.state().notes[key]);assert(not DT.state().checks[key..':picked'])
 TEST.guid='Player-Test-A';DT.init();assert(DT.state().notes[key])
`));
test('Horde and out-of-scope characters are hidden; missing quest API falls back honestly',()=>run(`
 TEST.faction='Horde';local n=#TEST.log;fire('PLAYER_ENTERING_WORLD');assert(not DT.frame.shown);DT.command('entrar');assert(not DT.state().run);assert(#TEST.log==n)
 TEST.faction='Alliance';TEST.level=61;fire('PLAYER_ENTERING_WORLD');assert(not DT.frame.shown)
 TEST.level=17;C_QuestLog=nil;fire('QUEST_LOG_UPDATE');assert(DT.journalStatus:find('indisponível'))
 clickTab('Quests');assert(DT.frame.shown)
`));
test('Restricted or malformed XP never enters arithmetic or predictions',()=>run(`
 DT.startRun();TEST.xp={secret=true};fire('PLAYER_XP_UPDATE');assert(not DT.state().run.valid)
 TEST.xp=200;TEST.level=20;fire('PLAYER_XP_UPDATE');assert(not DT.state().run.valid)
 DT.finishRun(false);assert(DT.estimate():find('0/2'))
 assert(DT.number(0/0)==nil);assert(DT.text({secret=true})=='');assert(DT.text('|Hfake|h')=='||Hfake||h')
`));
test('UI renders every dungeon and tab with a bounded pool, and close/reopen works',()=>run(`
 for i=1,#DT.catalog do
  DT.select(i)
  for _,tab in ipairs({'Plano','Quests','Diário','Ajuda'}) do clickTab(tab);assert(DT.frame.shown) end
 end
 local n=#TEST.frames
 for i=1,30 do fire('QUEST_LOG_UPDATE') end
 assert(#TEST.frames==n);assert(n<250)
 DT.command('ocultar');assert(not DT.frame.shown);DT.command('');assert(DT.frame.shown)
`));
