import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {ROOT} from '../src/core.ts';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{lua,lauxlib,lualib,to_luastring,to_jsstring}=require('fengari');
const b=JSON.parse(fs.readFileSync(path.join(ROOT,'evals/fixtures/alliance-level-pulse.blueprint.json'),'utf8'));
const code=b.files.find(f=>f.filename.endsWith('.lua')).content;
test('reactive leveling recommendations vary by player XP',()=>{
  assert.match(code,/UnitLevel\("player"\)/);
  assert.match(code,/UnitXP\("player"\)/);
  assert.match(code,/pct\s*>=\s*85/);
  assert.match(code,/pct\s*>=\s*40/);
  assert.match(code,/nextAction/);
  assert.match(code,/PLAYER_XP_UPDATE/);
});
test('brand credits appear before player UI is opened',()=>{
  assert.match(code,/ns\.TonhoBranding:RegisterWindow\(frame\)/);
  assert.match(b.files[0].content,/## Author: Tonho Contrabando/);
});

function gameplay(faction,tail){
 const L=lauxlib.luaL_newstate();lualib.luaL_openlibs(L);
 const mock=`TEST={faction=${JSON.stringify(faction)},level=12,xp=100,max=1000,shown=false}
 UIParent={};SlashCmdList={}
 local function object()
  local o={}
  return setmetatable(o,{__index=function(t,k)
   if k=='CreateTexture' or k=='CreateFontString' then return function()return object()end end
   if k=='SetScript' then return function(self,event,fn)if event=='OnEvent' then TEST.update=fn end end end
   if k=='SetText' then return function(self,text)TEST.text=text end end
   if k=='Show' then return function()TEST.shown=true end end
   if k=='Hide' then return function()TEST.shown=false end end
   return function()end
  end})
 end
 function CreateFrame()return object()end
 function UnitFactionGroup()return TEST.faction end
 function UnitLevel()return TEST.level end
 function UnitXP()return TEST.xp end
 function UnitXPMax()return TEST.max end
 local function addon(...)
 ${code}
 end
 addon('AllianceLevelPulse',{TonhoBranding={RegisterWindow=function()end}})
 ${tail}`;
 try{const status=lauxlib.luaL_dostring(L,to_luastring(mock));assert.equal(status,lua.LUA_OK,status?to_jsstring(lua.lua_tostring(L,-1)):'');}finally{lua.lua_close(L);}
}
for(const faction of ['Alliance','Horde'])test('actual demo Lua reacts to XP and level for '+faction,()=>gameplay(faction,`
 assert(TEST.shown);local old=TEST.text
 TEST.xp=900;TEST.update();assert(TEST.shown and TEST.text~=old)
 TEST.level=60;TEST.update();assert(TEST.shown and string.find(TEST.text,'60'))
 TEST.level=61;TEST.update();assert(not TEST.shown)
`));
test('demo hides unknown faction and recovers when Horde identity becomes available',()=>gameplay('Unknown',`
 assert(not TEST.shown);TEST.faction='Horde';TEST.update();assert(TEST.shown)
 TEST.faction=nil;TEST.update();assert(not TEST.shown)
 TEST.faction='Alliance';TEST.update();assert(TEST.shown)
`));
