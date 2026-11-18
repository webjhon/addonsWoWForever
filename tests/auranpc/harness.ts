import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {ROOT} from '../../src/core.ts';
const require=createRequire(import.meta.url);
const {lua,lauxlib,lualib,to_luastring,to_jsstring}=require('fengari');
export function run(code:string,{addon=process.env.FOREVER_ADDON_UNDER_TEST||'AURANPC'}={}){
 const L=lauxlib.luaL_newstate();lualib.luaL_openlibs(L);
 const exec=(s:string,name:string)=>{let r=lauxlib.luaL_loadbuffer(L,to_luastring(s),null,to_luastring(name));if(r===lua.LUA_OK)r=lua.lua_pcall(L,0,0,0);if(r!==lua.LUA_OK)throw Error(name+': '+to_jsstring(lua.lua_tostring(L,-1)));};
 try{
  exec(fs.readFileSync(path.join(ROOT,'tests/dungeon-trail/mock.lua'),'utf8'),'base mock');
  exec(fs.readFileSync(path.join(ROOT,'tests/auranpc/mock.lua'),'utf8'),'AURANPC mock');
  for(const f of ['design-system/branding/TonhoBranding.lua',...fs.readFileSync(path.join(ROOT,'addon-src/'+addon+'/'+addon+'.toc'),'utf8').split(/\r?\n/).map(s=>s.trim()).filter(s=>s.endsWith('.lua')).map(f=>'addon-src/'+addon+'/'+f)])exec('local function chunk(...)\n'+fs.readFileSync(path.join(ROOT,f),'utf8')+'\nend\nchunk("'+addon+'", AURA)',f);
  exec('fire("PLAYER_LOGIN")','login');exec(code,'scenario');
 }finally{lua.lua_close(L);}
}
