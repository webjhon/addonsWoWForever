local _, ns = ...
local A=ns
local gold={.93,.77,.46};local textColor={.86,.92,.95};local muted={.53,.65,.73};local teal={.35,.81,.75}
local f=CreateFrame('Frame','AllianceDungeonTrailFrame',UIParent);f:Hide();ns.TonhoBranding:RegisterWindow(f);A.frame=f
f:SetSize(890,610);f:SetPoint('CENTER',UIParent,'CENTER',0,0);f:SetClampedToScreen(true);f:SetMovable(true);f:EnableMouse(true);f:RegisterForDrag('LeftButton')
f:SetScript('OnDragStart',function()if not InCombatLockdown() then f:StartMoving() end end);f:SetScript('OnDragStop',function()f:StopMovingOrSizing()end)
local function panel(frame,r,g,b)local t=frame:CreateTexture(nil,'BACKGROUND');t:SetAllPoints();t:SetColorTexture(r,g,b,.97);return t end
panel(f,.025,.045,.068)
local function label(parent,x,y,w,h,size,color)
 local t=parent:CreateFontString(nil,'OVERLAY');t:SetPoint('TOPLEFT',parent,'TOPLEFT',x,-y);t:SetSize(w,h);t:SetFont(STANDARD_TEXT_FONT or 'Fonts\\FRIZQT__.TTF',size,'');t:SetJustifyH('LEFT');t:SetJustifyV('TOP');t:SetTextColor(unpack(color or textColor));return t
end
local function button(parent,caption,x,y,w,h,fn)
 local b=CreateFrame('Button',nil,parent);b:SetPoint('TOPLEFT',parent,'TOPLEFT',x,-y);b:SetSize(w,h);panel(b,.075,.14,.18)
 b.caption=label(b,10,8,w-16,h-10,11,gold);b.caption:SetText(caption);b:SetScript('OnClick',fn);return b
end
local icon=f:CreateTexture(nil,'ARTWORK');icon:SetPoint('TOPLEFT',f,'TOPLEFT',20,-18);icon:SetSize(42,42);icon:SetTexture('Interface\\AddOns\\AllianceDungeonTrail\\assets\\Icon.tga')
label(f,76,20,640,24,20,gold):SetText('ALLIANCE DUNGEON TRAIL')
local subtitle=label(f,77,49,720,20,11,muted)
button(f,'FECHAR',785,20,86,32,function()f:Hide()end)
local page,tab=1,'overview';local filtered=false
label(f,20,93,250,21,12,teal):SetText('ESCOLHA SEU DESTINO')
local filter=button(f,'TODAS AS DUNGEONS',20,121,250,30,function()filtered=not filtered;page=1;A.render()end)
local dungeonButtons={}
for i=1,8 do local slot=i;dungeonButtons[i]=button(f,'',20,164+(i-1)*43,250,38,function()local d=dungeonButtons[slot].dungeon;if d then A.selectPlan(d.key) end end) end
button(f,'<',20,518,50,30,function()page=math.max(1,page-1);A.render()end)
local pageText=label(f,83,526,115,20,11,muted)
button(f,'>',220,518,50,30,function()page=page+1;A.render()end)
button(f,'MODO AUTOMÁTICO',20,563,250,30,function()A.selectPlan(nil)end)
local tabButtons={}
for i,v in ipairs({{'overview','VISÃO GERAL'},{'quests','QUESTS'},{'settings','CONFIGURAÇÕES'}}) do local key=v[1];tabButtons[key]=button(f,v[2],294+(i-1)*192,89,184,33,function()tab=key;A.render()end) end
local name=label(f,294,142,570,34,22,gold);local meta=label(f,294,184,570,28,11,muted)
local entrance=button(f,'GUIAR ENTRADA',294,220,280,32,function()A.guide('entrance',A.viewDungeon())end)
local current=button(f,'VER A DUNGEON ATUAL',585,220,280,32,function()local s=A.current();local d=s and s.inside and A.instanceDungeon(s);A.inspect=d and d.key or nil;tab='overview';A.render()end)
local scroll=CreateFrame('ScrollFrame',nil,f);scroll:SetPoint('TOPLEFT',f,'TOPLEFT',294,-271);scroll:SetSize(571,276)
local child=CreateFrame('Frame',nil,scroll);child:SetSize(550,300);scroll:SetScrollChild(child)
local body=label(child,4,4,536,300,12,textColor)
local scrollValue,bodyHeight=0,300
local lastView,lastTab
scroll:EnableMouseWheel(true);scroll:SetScript('OnMouseWheel',function(_,delta)scrollValue=math.max(0,math.min(math.max(0,bodyHeight-276),scrollValue-delta*46));scroll:SetVerticalScroll(scrollValue)end)
local footer=label(f,294,564,570,38,10,muted)
local optionButtons={};local questCards={}
local choices={{'arrow','Seta de navegação própria'},{'tracker','Tracker durante o jogo'},{'alerts','Avisos de nova faixa'},{'nativeTracking','Integração opcional com rastreio do jogo'}}
for i,v in ipairs(choices) do local key=v[1];optionButtons[i]=button(child,'',4,4+(i-1)*43,526,36,function()A.option(key,not A.state().options[key]);if key=='tracker' then A.state().hidden=false;A.render() end end) end
optionButtons[5]=button(child,'',4,176,526,36,function()local s=A.state().options.scale;A.option('scale',s<.9 and 1 or (s<1.1 and 1.2 or .8))end)
optionButtons[6]=button(child,'',4,219,526,36,function()A.option('units',A.state().options.units=='m' and 'jd' or 'm')end)
optionButtons[7]=button(child,'',4,262,526,36,function()A.option('arrival',A.state().options.arrival>=30 and 10 or A.state().options.arrival+10)end)
local tracker=CreateFrame('Frame','AllianceDungeonTrailTracker',UIParent);tracker:SetSize(334,240);tracker:SetPoint('RIGHT',UIParent,'RIGHT',-24,0);tracker:SetClampedToScreen(true);panel(tracker,.025,.045,.068);A.tracker=tracker
local stage=label(tracker,16,14,220,20,10,teal);local actionTitle=label(tracker,16,42,302,62,18,gold);local actionDetail=label(tracker,16,112,302,80,11,textColor);local actionNav=label(tracker,16,202,302,28,10,muted)
button(tracker,'OPÇÕES',230,8,88,28,function()tab='settings';f:Show();A.render()end)
local states={ACTIVE='NO DIÁRIO',READY='PRONTA PARA ENTREGAR',TURNED_IN='ENTREGUE',MISSING='AUSENTE • NÃO CONCLUÍDA',AVAILABLE_UNKNOWN='OFERTA POTENCIAL',FAILED='FALHOU'}
function A.render()
 local s,a,char=A.current(),A.action,A.state();if not s or not a or not char then return end
 local opts=char.options
 if not A.allowed(s) then f:Hide();tracker:Hide();if A.arrow then A.arrow:Hide()end;return end
 f:SetScale(math.min(opts.scale,UIParent:GetWidth()/920,UIParent:GetHeight()/640));tracker:SetScale(opts.scale)
 if not char.ui3Seen and not A.pending then char.ui3Seen=true;f:Show() end
 if opts.tracker and not char.hidden then tracker:Show()else tracker:Hide()end
 stage:SetText(A.pending and 'COMBATE • ATUALIZAÇÃO PENDENTE' or 'AGORA • '..a.kind)
 actionTitle:SetText(a.title);actionDetail:SetText(a.detail:sub(1,310));actionNav:SetText(A.navGoal and ('Seta: '..A.navGoal.title) or 'Sem marcador nesta etapa • veja as referências')
 local d=A.viewDungeon();if lastView~=d.key or lastTab~=tab then scrollValue=0;lastView=d.key;lastTab=tab end;name:SetText(d.name);meta:SetText('Níveis '..d.level..'–'..d.high..'  •  '..d.zone..'  •  '..#d.quests..' quests selecionadas')
 subtitle:SetText('TONHO CONTRABANDO  /  NÍVEL '..s.level..'  /  '..(char.plan and 'PLANO ESCOLHIDO' or 'MODO AUTOMÁTICO')..(s.inside and '  /  EM INSTÂNCIA' or ''))
 local eligible={};for _,entry in ipairs(A.catalog)do if not filtered or entry.level<=s.level and s.level<=entry.high then eligible[#eligible+1]=entry end end
 local pages=math.max(1,math.ceil(#eligible/8));page=math.min(page,pages);pageText:SetText(page..' / '..pages)
 filter.caption:SetText(filtered and 'FAIXA ATUAL • CLIQUE PARA TODAS' or 'TODAS AS DUNGEONS')
 for i,b in ipairs(dungeonButtons)do local entry=eligible[(page-1)*8+i];b.dungeon=entry;if entry then b:Show();b.caption:SetText((entry.key==d.key and '› 'or '')..entry.name..'  '..entry.level..'–'..entry.high)else b:Hide()end end
 local info=A.overviews[d.key]or{};entrance.caption:SetText(info.entrance and 'GUIAR ENTRADA' or 'ENTRADA SEM COORDENADAS CURADAS')
 local rows=A.questRows(d);local ready,active,done,external=0,0,0,0;for _,r in ipairs(rows)do if r.live and r.q.phase=='outside' and not r.live.complete then external=external+1 end;if r.state=='READY'then ready=ready+1 elseif r.state=='ACTIVE'then active=active+1 elseif r.state=='TURNED_IN'then done=done+1 end end
 footer:SetText((a.dungeon and a.dungeon.key~=d.key and ('Orientação ativa: '..a.dungeon.name..' • plano em visualização: '..d.name)or a.title)..'\n'..active..' em progresso  •  '..ready..' prontas  •  '..done..' entregues'..(external>0 and (' • '..external..' externas ao portal')or''))
 for _,b in ipairs(optionButtons)do b:Hide()end;for _,card in ipairs(questCards)do card:Hide()end
 local lines={}
 if tab=='overview' then
  lines={'|cffdfba72PREPARAÇÃO E ACESSO|r',d.access,'','|cffdfba72ENCONTROS DO CATÁLOGO|r','Ordem de referência; confirme alas e percurso com o grupo.'}
  if #(info.encounters or{})==0 then lines[#lines+1]='Sem lista de encontros curada para este mapa.' end
  for i,b in ipairs(info.encounters or{})do lines[#lines+1]=(A.bossObserved(d,b)and '|cff67d3aaOBSERVADO|r 'or '— ')..i..'. '..b.name end
  lines[#lines+1]='';lines[#lines+1]='|cffdfba72QUESTS E CONTINUIDADE|r'
  for _,r in ipairs(rows)do lines[#lines+1]=(states[r.state]or r.state)..' • '..r.q.name end
  if not d.covered then lines[#lines+1]='Guia de quests bloqueado por dados nesta dungeon.'end
 elseif tab=='quests' then
  lines={'Ofertas podem exigir pré-quests. O diário determina o progresso.'}
  for i,r in ipairs(rows)do
   if not questCards[i]then
    local card=CreateFrame('Frame',nil,child);card:SetSize(536,172);panel(card,.04,.075,.1)
    card.title=label(card,12,10,510,36,12,gold);card.detail=label(card,12,50,510,70,11,textColor)
    card.button=button(card,'',12,132,240,28,function(self)
     local row=self.row;local kind=row.state=='READY'and'turnin'or(row.live and'objective'or'pickup')
     if kind=='objective'then A.navOverride=nil;A.state().focusQuest=row.q.id;A.reconcile()else A.guide(kind,A.viewDungeon(),row.q)end
    end);questCards[i]=card
   end
   local card=questCards[i];card:ClearAllPoints();card:SetPoint('TOPLEFT',child,'TOPLEFT',0,-(36+(i-1)*184));card:Show()
   card.title:SetText(r.q.name..' • '..(states[r.state]or r.state))
   card.detail:SetText((r.live and ('Objetivo: '..(r.live.objectives[1]and r.live.objectives[1].text or 'aguardando diário'))or r.q.pickup)..'\n'..r.q.guide:sub(1,220))
   card.button.row=r;card.button.caption:SetText(r.state=='READY'and'GUIAR ENTREGA'or(r.live and'ACOMPANHAR OBJETIVO'or'GUIAR COLETA'))
  end
 else
  local opts=char.options
  for i,v in ipairs(choices)do optionButtons[i]:Show();optionButtons[i].caption:SetText(v[2]..'  •  '..(opts[v[1]]and'LIGADO'or'DESLIGADO'))end
  optionButtons[5]:Show();optionButtons[5].caption:SetText('Escala da interface • '..math.floor(opts.scale*100)..'%')
  optionButtons[6]:Show();optionButtons[6].caption:SetText('Distância • '..opts.units..' (linha reta)')
  optionButtons[7]:Show();optionButtons[7].caption:SetText('Chegada à área • '..opts.arrival..' jardas')
 end
 body:SetText(table.concat(lines,'\n'));bodyHeight=tab=='settings'and 310 or (tab=='quests'and math.max(280,42+#rows*184)or math.max(280,body:GetStringHeight()+55));body:SetHeight(bodyHeight);child:SetHeight(bodyHeight)
 scrollValue=math.min(scrollValue,math.max(0,bodyHeight-276));scroll:SetVerticalScroll(scrollValue)
 if A.updateArrow then A.updateArrow()end
end
A.makeArrow()
function A.command(value)
 value=(value or ''):lower()
 if value=='diagnostico'then A.diagnostics();return end
 if value=='auto'then A.selectPlan(nil);return end
 local key=value:match('^dungeon%s+(.+)$');if key then A.selectPlan(key);return end
 if value=='navegacao off'then A.option('arrow',false);return end
 if value=='navegacao on'then A.option('arrow',true);return end
 if value=='config'then tab='settings'end
 if value=='resetpos'then f:ClearAllPoints();f:SetPoint('CENTER',UIParent,'CENTER',0,0)end
 if A.state()then A.state().hidden=false end;A.reconcile();if not A.pending then f:Show()end
end
SLASH_ALLIANCEDUNGEONTRAIL1='/adt';SLASH_ALLIANCEDUNGEONTRAIL2='/dungeontrail';SlashCmdList.ALLIANCEDUNGEONTRAIL=A.command
