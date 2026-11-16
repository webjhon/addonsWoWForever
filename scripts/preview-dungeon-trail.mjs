// Draws the actual mock UI scene. This is an approximation, never a WoW screenshot.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {Resvg} from '@resvg/resvg-js';
const require=createRequire(import.meta.url);
const {lua,lauxlib,lualib,to_luastring,to_jsstring}=require('fengari');
const root=path.resolve(import.meta.dirname,'..');
const L=lauxlib.luaL_newstate();lualib.luaL_openlibs(L);
function exec(s){let r=lauxlib.luaL_loadstring(L,to_luastring(s));if(!r)r=lua.lua_pcall(L,0,0,0);if(r)throw Error(to_jsstring(lua.lua_tostring(L,-1)));}
exec(fs.readFileSync(path.join(root,'tests/dungeon-trail/mock.lua'),'utf8'));
exec(`local function brand(...)\n${fs.readFileSync(path.join(root,'design-system/branding/TonhoBranding.lua'),'utf8')}\nend\nbrand('AllianceDungeonTrail', DT)`);
for(const f of ['Data.lua','Adapters.lua','Navigation.lua','Core.lua','Product.lua','UI.lua'])exec(`local function chunk(...)\n${fs.readFileSync(path.join(root,'addon-src/AllianceDungeonTrail',f),'utf8')}\nend\nchunk('AllianceDungeonTrail', DT)`);
const state=process.argv[2]||'objective';
const scenarios={preparation:"fire('PLAYER_LOGIN')",objective:"fire('PLAYER_LOGIN');TEST.objectivesByID[2040]={{text='Gnoam Sprecklesprocket: 0/1',finished=false,numFulfilled=0,numRequired=1}};accept(2040,'Investida Subterrânea');enter('deadmines')",'turn-in':"fire('PLAYER_LOGIN');accept(2040,'Investida Subterrânea');TEST.ready[2040]=true;fire('QUEST_LOG_UPDATE')"};
scenarios.overview="fire('PLAYER_LOGIN');DT.selectPlan('deadmines')";
scenarios.settings="fire('PLAYER_LOGIN');clickTab('CONFIGURAÇÕES')";
scenarios.quests="fire('PLAYER_LOGIN');DT.selectPlan('deadmines');accept(2040,'Investida Subterrânea');clickTab('QUESTS')";
scenarios.navigation="fire('PLAYER_LOGIN');DT.guide('pickup',DT.findDungeon('deadmines'),{id=2040})";
if(!scenarios[state])throw Error('Unknown preview state');
exec(scenarios[state]);
function field(i,k){lua.lua_getfield(L,i,to_luastring(k));let v;const t=lua.lua_type(L,-1);if(t===lua.LUA_TSTRING)v=to_jsstring(lua.lua_tostring(L,-1));else if(t===lua.LUA_TNUMBER)v=lua.lua_tonumber(L,-1);else if(t===lua.LUA_TBOOLEAN)v=lua.lua_toboolean(L,-1);else if(t===lua.LUA_TTABLE)v=lua.lua_topointer(L,-1);lua.lua_pop(L,1);return v;}
lua.lua_getglobal(L,to_luastring('TEST'));lua.lua_getfield(L,-1,to_luastring('frames'));
const frames=[],pointers=new Map();
for(let i=1;i<=lua.lua_rawlen(L,-1);i++){
 lua.lua_rawgeti(L,-1,i);const idx=lua.lua_absindex(L,-1);
 const f={id:i,pointer:lua.lua_topointer(L,idx)};pointers.set(f.pointer,f);
 for(const key of ['kind','name','parent','width','height','shown','text','fontSize','texture','rotation'])f[key]=field(idx,key);
 if(f.kind==='FontString'&&!f.width){f.width=(f.text||'').length*(f.fontSize||12)*.55;f.height=f.fontSize||12;}
 lua.lua_getfield(L,idx,to_luastring('points'));lua.lua_rawgeti(L,-1,1);
 if(lua.lua_istable(L,-1)){
  f.point=[];for(let j=1;j<=lua.lua_rawlen(L,-1);j++){lua.lua_rawgeti(L,-1,j);const t=lua.lua_type(L,-1);f.point.push(t===lua.LUA_TNUMBER?lua.lua_tonumber(L,-1):t===lua.LUA_TSTRING?to_jsstring(lua.lua_tostring(L,-1)):null);lua.lua_pop(L,1);}
 }lua.lua_pop(L,2);
 lua.lua_getfield(L,idx,to_luastring('color'));f.color=[];if(lua.lua_istable(L,-1))for(let j=1;j<=3;j++){lua.lua_rawgeti(L,-1,j);f.color.push(lua.lua_tonumber(L,-1));lua.lua_pop(L,1);}lua.lua_pop(L,1);
 frames.push(f);lua.lua_pop(L,1);
}
const main=frames.find(f=>f.name===(state==='navigation'?'AllianceDungeonTrailArrow':'AllianceDungeonTrailFrame'));
function geom(f){
 if(f===main)return {x:0,y:0,visible:true,clip:null};
 const p=pointers.get(f.parent);if(!p)return {x:0,y:0,visible:false};
 const g=geom(p),pt=f.point||[],dx=pt.length===3?pt[1]:pt[3]||0,dy=pt.length===3?pt[2]:pt[4]||0;
 const anchor=pt[0]||'TOPLEFT',relative=pt.length===5?pt[2]:anchor;
 const ax=(a,w)=>a.includes('RIGHT')?w:a.includes('LEFT')?0:w/2;
 const ay=(a,h)=>a.includes('BOTTOM')?h:a.includes('TOP')?0:h/2;
 return {x:g.x+dx+ax(relative,p.width)-ax(anchor,f.width),y:g.y-dy+ay(relative,p.height)-ay(anchor,f.height),visible:g.visible&&f.shown!==false,clip:p.kind==='ScrollFrame'?`clip${p.id}`:g.clip};
}
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
let defs='',body='';
for(const f of frames){
 const g=geom(f);if(!g.visible)continue;
 if(!Number.isFinite(g.x)||!Number.isFinite(g.y)||g.x>main.width||g.y>main.height||g.x+Math.max(f.width,1)<0||g.y+Math.max(f.height,20)<0)continue;
 if(g.clip){const c=frames.find(c=>'clip'+c.id===g.clip),cg=c&&geom(c);if(cg&&(g.y>cg.y+c.height||g.y+Math.max(f.height,20)<cg.y))continue;}
 if(f.kind==='ScrollFrame')defs+=`<clipPath id="clip${f.id}"><rect x="${g.x}" y="${g.y}" width="${f.width}" height="${f.height}"/></clipPath>`;
 if(f.kind==='Texture'&&f.color.length===3){const p=pointers.get(f.parent);const pg=geom(p);const w=f.width||p.width,h=f.height||p.height;if(w>0&&h>0)body+=`<rect x="${pg.x}" y="${pg.y}" width="${w}" height="${h}" fill="rgb(${f.color.map(c=>Math.round(c*255)).join(',')})" ${g.clip?`clip-path="url(#${g.clip})"`:''}/>`;}
 if(f.kind==='Texture'&&f.texture?.endsWith('Arrow.tga'))body+=`<g transform="translate(${g.x} ${g.y}) scale(${f.width/64})"><polygon points="32,3 7,31 24,27 24,58 40,58 40,27 57,31" fill="#f2c569" transform="rotate(${-(f.rotation||0)*180/Math.PI} 32 32)"/></g>`;
 if(f.kind==='FontString'&&f.text){
  if(g.clip){const clip=frames.find(c=>'clip'+c.id===g.clip),cg=geom(clip);if(g.y>cg.y+clip.height||g.y+Math.max(f.height,20)<cg.y)continue;}
  const size=f.fontSize||12,color=f.color.length===3?`rgb(${f.color.map(c=>Math.round(c*255)).join(',')})`:'#d7e0ea';
  let lines=[];
  for(const paragraph of f.text.replace(/\|c[0-9a-f]{8}|\|r/g,'').split('\n')){
   let line='';for(const word of paragraph.split(' ')){if((line+word).length*size*.51>f.width&&line){lines.push(line.trim());line='';}line+=word+' ';}lines.push(line.trim());
  }
  body+=`<text x="${g.x}" y="${g.y+size}" font-family="Segoe UI,Arial,sans-serif" font-size="${size}" fill="${color}" ${g.clip?`clip-path="url(#${g.clip})"`:''}>${lines.map((l,i)=>`<tspan x="${g.x}" dy="${i?size+2:0}">${esc(l)}</tspan>`).join('')}</text>`;
 }
}
const icon=fs.readFileSync(path.join(root,'releases/AllianceDungeonTrail-icon.png')).toString('base64');
body+=`<image href="data:image/png;base64,${icon}" x="16" y="15" width="34" height="34"/>`;
let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1000" viewBox="-20 -20 930 660"><defs>${defs}</defs><rect x="-20" y="-20" width="930" height="660" fill="#111b2a"/>${body}<text x="0" y="627" fill="#a7b3c6" font-family="Segoe UI,Arial" font-size="7">PRÉVIA DO MOCK • fontes e scroll aproximados • não é captura do WoW</text></svg>`;
if(state==='navigation')svg=svg.replace('width="1400" height="1000" viewBox="-20 -20 930 660"','width="900" height="600" viewBox="-20 -20 320 210"').replace('y="627"','y="175"').replace(new RegExp('<image[^>]+>'),'');
fs.writeFileSync(path.join(root,'research/AllianceDungeonTrail/UI-'+state+'.svg'),svg);
fs.writeFileSync(path.join(root,'research/AllianceDungeonTrail/UI-'+state+'.png'),new Resvg(svg).render().asPng());
lua.lua_close(L);console.log('Saved mock UI scene preview (not a client screenshot).');
