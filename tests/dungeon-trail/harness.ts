import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {ROOT} from '../../src/core.ts';
const require=createRequire(import.meta.url);
const {lua,lauxlib,lualib,to_luastring,to_jsstring}=require('fengari');
export function run(code:string){
 const L=lauxlib.luaL_newstate();lualib.luaL_openlibs(L);
 const exec=(s:string,name:string)=>{
  let status=lauxlib.luaL_loadbuffer(L,to_luastring(s),null,to_luastring(name));
  if(status===lua.LUA_OK)status=lua.lua_pcall(L,0,0,0);
  if(status!==lua.LUA_OK)throw new Error(name+': '+to_jsstring(lua.lua_tostring(L,-1)));
 };
 try{
  exec(fs.readFileSync(path.join(ROOT,'tests/dungeon-trail/mock.lua'),'utf8'),'mock');
  for(const f of ['design-system/branding/TonhoBranding.lua',...['Data.lua','Adapters.lua','Navigation.lua','Core.lua','UI.lua'].map(f=>'addon-src/AllianceDungeonTrail/'+f)]){
   exec(`local function chunk(...)\n${fs.readFileSync(path.join(ROOT,f),'utf8')}\nend\nchunk('AllianceDungeonTrail', DT)`,f);
  }
  exec("fire('PLAYER_LOGIN')",'login');exec(code,'scenario');
 }finally{lua.lua_close(L);}
}
