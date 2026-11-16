local _, ns = ...
local A=ns
local gold={.91,.74,.43};local ice={.85,.91,.94};local muted={.55,.66,.73};local teal={.36,.83,.76}
local f=CreateFrame("Frame","AllianceDungeonTrailFrame",UIParent)
f:Hide()
ns.TonhoBranding:RegisterWindow(f)
A.frame=f
f:SetSize(390,438);f:SetPoint("CENTER",UIParent,"CENTER",490,0);f:SetClampedToScreen(true)
f:SetMovable(true);f:EnableMouse(true);f:RegisterForDrag("LeftButton");f:SetFrameStrata("MEDIUM")
local bg=f:CreateTexture(nil,"BACKGROUND");bg:SetAllPoints();bg:SetColorTexture(.025,.045,.068,.96)
local line=f:CreateTexture(nil,"ARTWORK");line:SetPoint("TOPLEFT",f,"TOPLEFT",0,0);line:SetSize(390,3);line:SetColorTexture(.91,.74,.43,1)
local function label(x,y,w,h,size,color)
    local t=f:CreateFontString(nil,"OVERLAY");t:SetPoint("TOPLEFT",f,"TOPLEFT",x,-y);t:SetSize(w,h)
    t:SetFont(STANDARD_TEXT_FONT or "Fonts\\FRIZQT__.TTF",size,"");t:SetJustifyH("LEFT");t:SetJustifyV("TOP");t:SetTextColor(unpack(color));return t
end
local icon=f:CreateTexture(nil,"ARTWORK");icon:SetPoint("TOPLEFT",f,"TOPLEFT",16,-15);icon:SetSize(34,34)
icon:SetTexture("Interface\\AddOns\\AllianceDungeonTrail\\assets\\Icon.tga")
label(61,16,250,18,14,gold):SetText("DUNGEON TRAIL")
local context=label(61,35,270,20,10,muted)
local stage=label(18,69,354,18,10,teal)
local title=label(18,94,354,64,19,ice)
local quest=label(18,164,354,30,11,gold)
local detail=label(18,199,354,94,12,ice)
local navigation=label(18,300,354,43,11,teal)
local continuity=label(18,351,354,34,10,muted)
local footer=label(18,392,354,30,10,muted)
local function button(caption,x,y,width,fn)
    local b=CreateFrame("Button",nil,f);b:SetSize(width,25);b:SetPoint("TOPLEFT",f,"TOPLEFT",x,-y)
    local bg=b:CreateTexture(nil,"BACKGROUND");bg:SetAllPoints();bg:SetColorTexture(.075,.14,.18,1)
    local t=b:CreateFontString(nil,"OVERLAY");t:SetPoint("CENTER",b,"CENTER",0,0);t:SetFont(STANDARD_TEXT_FONT or "Fonts\\FRIZQT__.TTF",10,"");t:SetTextColor(unpack(ice));t:SetText(caption)
    b.caption=t;b:SetScript("OnClick",fn);return b
end
local small=button("–",331,14,24,function()
    if not A.state() then return end
    A.state().compact=not A.state().compact;A.render()
end)
button("×",358,14,21,function() if A.state() then A.state().hidden=true end;f:Hide() end)
local navButton=button("SEGUIR QUEST",241,405,130,function()
    if A.action and A.action.nav and not A.truth(A.safe(function() return InCombatLockdown() end)) then
        A.state().navigation=true;A.track(A.action,true);A.render()
    end
end)
f:SetScript("OnDragStart",function() if not A.truth(A.safe(function() return InCombatLockdown() end)) then f:StartMoving() end end)
f:SetScript("OnDragStop",function()
    f:StopMovingOrSizing()
    if A.state() then
        local point,_,relative,x,y=f:GetPoint()
        if A.num(math.abs(x or 0)) and A.num(math.abs(y or 0)) then A.state().position={point=point,relative=relative,x=x,y=y} end
    end
end)
local restored=false
local stages={OFFERED="NPC • QUEST DISPONÍVEL AGORA",PRE_LEVEL="PREPARAÇÃO",PREPARE="PREPARAÇÃO • OFERTA POTENCIAL",TRAVEL="VIAGEM",OBJECTIVE="AGORA • OBJETIVO AO VIVO",VERIFY="CONFIRMAÇÃO DO CLIENTE",TURN_IN="ENTREGA",EXPLORE="EM EXPEDIÇÃO",RECOVER="RECUPERAÇÃO",WAIT_DATA="AGUARDANDO DADOS",BLOCKED="BLOQUEADO • LEITURA INDISPONÍVEL",COVERAGE_GAP="BLOQUEADO • COBERTURA",FINISHED="JORNADA CONCLUÍDA",FAILED="QUEST FALHOU",OUT_OF_SCOPE="ACOMPANHAMENTO SUSPENSO"}
function A.render()
    local s,a=A.current(),A.action
    if not s or not a or not A.state() then return end
    if not restored then
        local p=A.state().position
        if A.table(p) and type(p.x)=="number" and type(p.y)=="number" and type(p.point)=="string" and type(p.relative)=="string" then
            pcall(function() f:ClearAllPoints();f:SetPoint(p.point,UIParent,p.relative,p.x,p.y) end)
        end
        local w=UIParent:GetWidth();local h=UIParent:GetHeight()
        f:SetScale(math.min(1,math.max(.65,w/700),math.max(.65,h/600)))
        restored=true
    end
    if not A.allowed(s) or A.state().hidden then f:Hide();return end
    context:SetText("ALLIANCE  /  NÍVEL "..s.level.."  /  "..(a.dungeon and a.dungeon.name or s.zone))
    stage:SetText(A.pending and "COMBATE • RETOMA AUTOMATICAMENTE" or stages[a.kind] or a.kind)
    title:SetText(a.title)
    local live=a.id and s.quests[a.id]
    quest:SetText(live and (live.title..(a.objective and " • objetivo "..a.objective or "")) or (a.dungeon and a.dungeon.zone or "Tonho Contrabando"))
    detail:SetText(a.detail)
    if a.nav then
        navigation:SetText(string.format("DESTINO DO CLIENTE • %s  %.1f, %.1f\n%s",a.nav.name,a.nav.x*100,a.nav.y*100,a.nav.text~="" and a.nav.text or "Navegação nativa quando disponível; não é rota entre paredes."))
    else navigation:SetText(a.id and "Sem marcador de mapa para este objetivo. Siga a referência acima." or "Aceite, progresso e entrada são detectados automaticamente.") end
    local active,ready,external=0,0,0
    if a.dungeon then for _,q in ipairs(a.dungeon.quests) do
        local v=s.quests[q.id]
        if v then if v.complete then ready=ready+1 else active=active+1 end;if q.phase=="outside" and not v.complete then external=external+1 end end
    end end
    continuity:SetText(active.." quests em progresso  •  "..ready.." prontas"..(external>0 and ("  •  "..external.." externas ao portal") or "").."\n"..(A.nextDungeon(s.level) and ("Próxima faixa: "..A.nextDungeon(s.level).name.." • "..A.nextDungeon(s.level).level) or "Sem próxima faixa conhecida"))
    footer:SetText(A.estimate(s))
    local compact=A.state().compact
    f:SetHeight(compact and 162 or 502)
    for _,t in ipairs({quest,detail,navigation,continuity,footer}) do if compact then t:Hide() else t:Show() end end
    -- Footer has dedicated height in the expanded tracker.
    footer:SetSize(354,62)
    navButton:ClearAllPoints();navButton:SetPoint("TOPLEFT",f,"TOPLEFT",241,-467)
    if not compact and a.nav and not A.pending then navButton:Show() else navButton:Hide() end
    small.caption:SetText(compact and "+" or "–")
    f:Show()
end
function A.command(value)
    value=(value or ""):lower()
    if value=="diagnostico" then A.diagnostics();return end
    if value=="navegacao off" then if A.state() then A.state().navigation=false;A.track(nil);A.render() end;return end
    if value=="navegacao on" then if A.state() then A.state().navigation=true;A.reconcile() end;return end
    if value=="resetpos" and A.state() then A.state().position=nil;f:ClearAllPoints();f:SetPoint("CENTER",UIParent,"CENTER",0,0) end
    if A.state() then A.state().hidden=false end
    A.reconcile()
end
SLASH_ALLIANCEDUNGEONTRAIL1="/adt"
SLASH_ALLIANCEDUNGEONTRAIL2="/dungeontrail"
SlashCmdList.ALLIANCEDUNGEONTRAIL=A.command
