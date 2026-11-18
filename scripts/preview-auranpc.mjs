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
exec(fs.readFileSync(path.join(root,'tests/auranpc/mock.lua'),'utf8'));
exec(`local function brand(...)\n${fs.readFileSync(path.join(root,'design-system/branding/TonhoBranding.lua'),'utf8')}\nend\nbrand('AURANPC', AURA)`);
for(const f of ['Data.lua','Engine.lua','Visuals.lua','Items.lua','Core.lua'])exec(`local function chunk(...)\n${fs.readFileSync(path.join(root,'addon-src/AURANPC',f),'utf8')}\nend\nchunk('AURANPC', AURA)`);
const state=process.argv[2]||'settings';
const scenarios={settings:'fire("PLAYER_LOGIN");AURA.window:Show()',highlight:'fire("PLAYER_LOGIN");AURA.window:Hide();accept(7,"Mate os inimigos da quest");plate("nameplate1",6,"NPC da sua quest");TEST.plates.nameplate1:SetPoint("CENTER",UIParent,"CENTER",0,0)',complete:'fire("PLAYER_LOGIN");accept(7);plate("nameplate1",6);TEST.ready[7]=true;fire("QUEST_LOG_UPDATE");AURA.window:Show()'};
scenarios.items=String.raw`fire('PLAYER_LOGIN');AURA.window:Hide()
accept(7,'Quest ativa • exemplo');
local function panel(x,title)
 local f=CreateFrame('Frame',nil,UIParent);f:SetSize(340,240);f:SetPoint('TOPLEFT',UIParent,'TOPLEFT',x,-280)
 local bg=f:CreateTexture(nil,'BACKGROUND');bg:SetAllPoints(f);bg:SetColorTexture(.035,.045,.06,1)
 local t=f:CreateFontString(nil,'OVERLAY');t:SetFont('Fonts\\FRIZQT__.TTF',18);t:SetTextColor(1,.85,.1);t:SetPoint('TOPLEFT',f,'TOPLEFT',14,-15);t:SetText(title);return f
end
LootFrame:SetPoint('TOPLEFT',UIParent,'TOPLEFT',570,-280);LootFrame:SetSize(340,240)
local lootPanel=panel(570,'LOOT • MOCK DO ADDON')
local row=lootrow(1,{link='item:101',questID=7});row:SetPoint('TOPLEFT',LootFrame,'TOPLEFT',18,-65)
local label=row:CreateFontString(nil,'OVERLAY');label:SetFont('Fonts\\FRIZQT__.TTF',13);label:SetTextColor(1,1,1);label:SetText('Item da quest ativa');label:SetPoint('TOPLEFT',row,'TOPLEFT',28,-10)
local bagPanel=panel(970,'BOLSAS • MOCK DO ADDON')
local b=bagbutton(0,1,{questID=7});b.parent=bagPanel;b:SetSize(46,46);b:SetPoint('TOPLEFT',bagPanel,'TOPLEFT',20,-65)
local other=bagbutton(0,2,{});other.parent=bagPanel;other:SetSize(46,46);other:SetPoint('TOPLEFT',bagPanel,'TOPLEFT',82,-65)
for _,btn in ipairs({b,other})do local t=btn:CreateTexture(nil,'BACKGROUND');t:SetAllPoints(btn);t:SetColorTexture(.18,.24,.3,1)end
fire('LOOT_OPENED')`.replace(/^\+/gm,'');
if(state==='items')exec(fs.readFileSync(path.join(root,'tests/auranpc/items-mock.lua'),'utf8'));
if(!scenarios[state])throw Error('Unknown preview state');
exec(scenarios[state]);
exec(`for _,f in ipairs(TEST.frames)do if f.text=="CONTINUAR" then f.parent.scripts.OnClick() end end`);
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
  f.point=[];for(let j=1;j<=lua.lua_rawlen(L,-1);j++){lua.lua_rawgeti(L,-1,j);const t=lua.lua_type(L,-1);f.point.push(t===lua.LUA_TNUMBER?lua.lua_tonumber(L,-1):t===lua.LUA_TSTRING?to_jsstring(lua.lua_tostring(L,-1)):t===lua.LUA_TTABLE?lua.lua_topointer(L,-1):null);lua.lua_pop(L,1);}
 }lua.lua_pop(L,2);
 lua.lua_getfield(L,idx,to_luastring('color'));f.color=[];if(lua.lua_istable(L,-1))for(let j=1;j<=4;j++){lua.lua_rawgeti(L,-1,j);f.color.push(lua.lua_tonumber(L,-1));lua.lua_pop(L,1);}lua.lua_pop(L,1);
 frames.push(f);lua.lua_pop(L,1);
}
const main=frames.find(f=>f.name===((state==='highlight'||state==='items')?'UIParent':'AURANPCSettings'));
if(state==='highlight'||state==='items'){main.width=1920;main.height=1080;}
function geom(f){
 if(f===main)return {x:0,y:0,visible:true,clip:null};
 const p=pointers.get(f.parent);if(!p)return {x:0,y:0,visible:false};
 const pt=f.point||[],relativeFrame=pointers.get(pt[1]);const actual=relativeFrame||p;const g=geom(actual),dx=relativeFrame?(pt[3]||0):(pt.length===3?pt[1]:0),dy=relativeFrame?(pt[4]||0):(pt.length===3?pt[2]:0);
 const anchor=pt[0]||'TOPLEFT',relative=relativeFrame?pt[2]:anchor;
 const ax=(a,w)=>a.includes('RIGHT')?w:a.includes('LEFT')?0:w/2;
 const ay=(a,h)=>a.includes('BOTTOM')?h:a.includes('TOP')?0:h/2;
 return {x:g.x+dx+ax(relative,actual.width)-ax(anchor,f.width),y:g.y-dy+ay(relative,actual.height)-ay(anchor,f.height),visible:g.visible&&f.shown!==false,clip:p.kind==='ScrollFrame'?`clip${p.id}`:g.clip};
}
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
let defs='',body='';
for(const f of frames){
 const g=geom(f);if(!g.visible)continue;
 if(!Number.isFinite(g.x)||!Number.isFinite(g.y)||g.x>main.width||g.y>main.height||g.x+Math.max(f.width,1)<0||g.y+Math.max(f.height,20)<0)continue;
 if(g.clip){const c=frames.find(c=>'clip'+c.id===g.clip),cg=c&&geom(c);if(cg&&(g.y>cg.y+c.height||g.y+Math.max(f.height,20)<cg.y))continue;}
 if(f.kind==='ScrollFrame')defs+=`<clipPath id="clip${f.id}"><rect x="${g.x}" y="${g.y}" width="${f.width}" height="${f.height}"/></clipPath>`;
 if(f.kind==='Texture'&&f.color.length>=3){const p=pointers.get(f.parent);const pg=geom(p);const w=f.width||p.width,h=f.height||p.height;if(w>0&&h>0)body+=`<rect x="${g.x}" y="${g.y}" width="${w}" height="${h}" fill="rgb(${f.color.slice(0,3).map(c=>Math.round(c*255)).join(',')})" fill-opacity="${f.color[3]||1}" ${g.clip?`clip-path="url(#${g.clip})"`:''}/>`;}
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
const icon=fs.readFileSync(path.join(root,'releases/AURANPC-icon.png')).toString('base64');
if(state==='settings'||state==='complete')body+=`<image href="data:image/png;base64,${icon}" x="20" y="17" width="40" height="40"/>`;
let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1000" viewBox="-20 -20 600 640"><defs>${defs}</defs><rect x="-20" y="-20" width="2200" height="1400" fill="#111b2a"/>${body}<text x="0" y="590" fill="#a7b3c6" font-family="Segoe UI,Arial" font-size="7">PRÉVIA DO MOCK • fontes e scroll aproximados • não é captura do WoW</text></svg>`;
if(state==='highlight'||state==='items')svg=svg.replace(/width="1200" height="1000" viewBox="-20 -20 600 640"/,'width="1440" height="810" viewBox="0 0 1920 1080"').replace('y="590"','y="1030"');
fs.writeFileSync(path.join(root,'research/AURANPC/UI-'+state+'.svg'),svg);
fs.writeFileSync(path.join(root,'research/AURANPC/UI-'+state+'.png'),new Resvg(svg).render().asPng());
lua.lua_close(L);console.log('Saved mock UI scene preview (not a client screenshot).');
