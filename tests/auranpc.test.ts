import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {ROOT} from '../src/core.ts';
import {validateBlueprint} from '../src/guards.ts';
const require=createRequire(import.meta.url),{lua,lauxlib,lualib,to_luastring,to_jsstring}=require('fengari'),parser=require('luaparse');
function run(code:string,before=''){
 const L=lauxlib.luaL_newstate();lualib.luaL_openlibs(L);
 function exec(s:string){let r=lauxlib.luaL_loadstring(L,to_luastring(s));if(!r)r=lua.lua_pcall(L,0,0,0);if(r)throw Error(to_jsstring(lua.lua_tostring(L,-1)));}
 try{
  exec(fs.readFileSync(path.join(ROOT,'tests/dungeon-trail/mock.lua'),'utf8'));
  exec(fs.readFileSync(path.join(ROOT,'tests/auranpc/mock.lua'),'utf8'));
  for(const f of ['design-system/branding/TonhoBranding.lua','addon-src/AURANPC/Core.lua','addon-src/AURANPC/UI.lua'])exec(`local function chunk(...)\n${fs.readFileSync(path.join(ROOT,f),'utf8')}\nend\nchunk('AURANPC',AN)`);
  exec(before);exec("fire('PLAYER_LOGIN')");exec(code);
 }finally{lua.lua_close(L);}
}
test('AURANPC passes unchanged product/autorship gates and Lua5.1 parsing',()=>{
 const b=JSON.parse(fs.readFileSync(path.join(ROOT,'research/AURANPC/AURANPC.blueprint.json'),'utf8'));
 assert.deepEqual(validateBlueprint(b).errors,[]);
 for(const f of b.files){assert.equal(fs.readFileSync(path.join(ROOT,'addon-src/AURANPC',f.filename),'utf8').replaceAll('\r\n','\n'),f.content);if(f.filename.endsWith('.lua'))parser.parse(f.content,{luaVersion:'5.1'});}
 assert.ok(!b.files.some(f=>/OnUpdate|WorldToScreen|RegisterCVar\s*\(/.test(f.content)));
});
test('Eligible login enables actual native setting once, confirms readback and owns previous value',()=>run(`
 assert(TEST.native=='1' and TEST.writes==1);assert(AN.status.state=='ACTIVE');assert(AN.database().lease.before=='0')
 for i=1,50 do fire('QUEST_LOG_UPDATE');fire('CVAR_UPDATE')end;assert(TEST.writes==1)
`));
test('Already-enabled native setting is preserved without inventing ownership',()=>run(`
 assert(AN.status.state=='ACTIVE' and TEST.writes==0);assert(not AN.database().lease)
 AN.setEnabled(false);assert(TEST.native=='1' and AN.status.state=='PAUSED')
` ,"TEST.native='1'"));
test('Quest acceptance, progress and turn-in reconcile context without manual NPC marks',()=>run(`
 TEST.journal={{questID=2040}};TEST.questTarget=true;fire('QUEST_ACCEPTED',2040)
 assert(AN.context.quests==1 and AN.context.questTarget==true);assert(AN.status.detail:find('alvo atual'))
 TEST.questTarget=false;TEST.journal={};fire('QUEST_TURNED_IN',2040)
 assert(AN.context.quests==0 and not AN.context.questTarget);assert(TEST.writes==1)
`));
test('World and party dungeon transitions keep native feature enabled; engine owns positions',()=>run(`
 TEST.kind='party';TEST.instance='Minas Mortas';TEST.mapName='Minas Mortas';fire('PLAYER_ENTERING_WORLD')
 assert(AN.status.state=='ACTIVE' and TEST.native=='1');assert(AN.context.kind=='party');assert(TEST.writes==1)
 TEST.kind='none';fire('PLAYER_ENTERING_WORLD');assert(AN.status.state=='ACTIVE' and TEST.writes==1)
 local n=#TEST.frames;for i=1,100 do fire('PLAYER_TARGET_CHANGED')end;assert(#TEST.frames==n)
`));
test('Pause restores only own setting, native original1 survives pause',()=>run(`
 AN.setEnabled(false);assert(TEST.native=='0' and TEST.writes==2);assert(not AN.database().lease)
 AN.setEnabled(true);assert(TEST.native=='1' and TEST.writes==3)
`));
test('External setting change yields, does not fight or falsely restore, explicit retry reacquires',()=>run(`
 TEST.native='0';fire('CVAR_UPDATE');assert(AN.status.state=='CONFLICT');local n=TEST.writes
 for i=1,20 do fire('QUEST_LOG_UPDATE')end;assert(TEST.native=='0' and TEST.writes==n)
 AN.setEnabled(false);assert(TEST.native=='0' and TEST.writes==n)
 AN.setEnabled(true);assert(TEST.native=='1' and TEST.writes==n+1)
`));
test('Combat defers configuration writes and reads; regen restores requested pause',()=>run(`
 TEST.combat=true;AN.setEnabled(false);assert(AN.status.state=='DEFERRED' and TEST.writes==1 and TEST.native=='1')
 TEST.combat=false;fire('PLAYER_REGEN_ENABLED');assert(AN.status.state=='PAUSED' and TEST.native=='0')
`));
test('Unsupported, secret, locked, secure, read-only and rejected native settings fail closed',()=>{
 for(const before of ["TEST.native=nil","TEST.native={secret=true}","TEST.locked=true","TEST.secure=true","TEST.readonly=true","TEST.reject=true","TEST.writeError=true"]){
  run("assert(AN.status.state=='BLOCKED');assert(TEST.native~='1')",before);
 }
});
test('Reload preserves original setting and preference; paused other character releases previous lease',()=>run(`
 assert(AN.init());AN.reconcile();assert(TEST.native=='1' and TEST.writes==1)
 AN.setEnabled(false);assert(TEST.native=='0');assert(AN.init());AN.reconcile();assert(AN.status.state=='PAUSED')
 AN.setEnabled(true);TEST.guid='Player-B';AN.init();AN.setEnabled(false);assert(TEST.native=='0');assert(not AN.database().lease)
 TEST.guid='Player-Test-A';AN.init();AN.reconcile();assert(AN.status.state=='ACTIVE' and TEST.native=='1')
`));
test('Horde, level61, raid and PvP suspend own feature; return to allowed scope resumes',()=>run(`
 TEST.level=61;fire('PLAYER_LEVEL_UP');assert(AN.status.state=='OUT_OF_SCOPE' and TEST.native=='0')
 TEST.level=17;TEST.faction='Horde';fire('PLAYER_ENTERING_WORLD');assert(TEST.native=='0')
 TEST.faction='Alliance';TEST.kind='raid';fire('PLAYER_ENTERING_WORLD');assert(TEST.native=='0')
 TEST.kind='pvp';fire('PLAYER_ENTERING_WORLD');assert(TEST.native=='0')
 TEST.kind='party';fire('PLAYER_ENTERING_WORLD');assert(AN.status.state=='ACTIVE' and TEST.native=='1')
`));
test('Logout restores original setting; failed restore retains lease for recovery',()=>run(`
 TEST.reject=true;AN.setEnabled(false);assert(AN.status.state=='RESTORE_PENDING' and AN.database().lease)
 TEST.reject=false;fire('PLAYER_REGEN_ENABLED');assert(TEST.native=='0' and not AN.database().lease)
 AN.setEnabled(true);fire('PLAYER_LOGOUT');assert(TEST.native=='0' and not AN.database().lease)
`));
test('Event storms coalesce, restricted target data never becomes positive detection',()=>run(`
 TEST.defer=true;TEST.questTarget={secret=true};for i=1,100 do fire('QUEST_LOG_UPDATE')end
 assert(#TEST.timers==1);flush();assert(AN.context.questTarget==nil);assert(AN.status.state=='ACTIVE')
`));
test('First opening exposes actual status and Tonho pixel hunter credits; no panel is required for native feature',()=>run(`
 assert(not AN.frame:IsShown() and AN.status.state=='ACTIVE');AN.command('');assert(AN.frame:IsShown())
 assert(visibleText('CRÉDITOS A'));assert(visibleText('Círculos nativos habilitados'))
`));

test('Missing capability announces one actionable warning without repeated chat spam',()=>run(`
 assert(AN.status.state=='BLOCKED');assert(#TEST.log==1)
 for i=1,20 do fire('QUEST_LOG_UPDATE')end;assert(#TEST.log==1);assert(TEST.log[1]:find('/auranpc'))
`,"TEST.native=nil"));
