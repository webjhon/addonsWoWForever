local _, A = ...
local F=CreateFrame("Frame","AllianceDungeonTrailFrame",UIParent)
A.frame=F
F:SetSize(800,580); F:SetPoint("CENTER"); F:SetClampedToScreen(true)
F:SetMovable(true); F:EnableMouse(true); F:RegisterForDrag("LeftButton")
F:SetScript("OnDragStart",function(self) self:StartMoving() end)
F:SetScript("OnDragStop",function(self)
    self:StopMovingOrSizing()
    local s=A.state(); if s then local _,_,_,x,y=self:GetPoint(); s.position={x=x,y=y} end
end)
F:SetFrameStrata("MEDIUM"); F:Hide()
local function fill(parent,r,g,b,a)
    local t=parent:CreateTexture(nil,"BACKGROUND"); t:SetAllPoints(); t:SetColorTexture(r,g,b,a or 1); return t
end
fill(F,.025,.041,.065,.98)
local edge=F:CreateTexture(nil,"ARTWORK"); edge:SetColorTexture(.83,.66,.34); edge:SetPoint("TOPLEFT");edge:SetPoint("TOPRIGHT");edge:SetHeight(2)
local function label(parent,text,x,y,width,size,color)
    local t=parent:CreateFontString(nil,"OVERLAY","GameFontNormal")
    t:SetPoint("TOPLEFT",x,y); t:SetWidth(width); t:SetJustifyH("LEFT"); t:SetJustifyV("TOP")
    if t.SetFont then t:SetFont(STANDARD_TEXT_FONT or "Fonts\\FRIZQT__.TTF",size or 12,"") end
    local c=color or {.86,.9,.94}; t:SetTextColor(c[1],c[2],c[3]); t:SetText(text); return t
end
local function button(parent,text,x,y,w,fn)
    local b=CreateFrame("Button",nil,parent); b:SetPoint("TOPLEFT",x,y);b:SetSize(w,27)
    b.back=fill(b,.09,.15,.21)
    b.caption=label(b,text,8,-7,w-16,11)
    b:SetScript("OnClick",fn)
    b:SetScript("OnEnter",function(self) self.back:SetColorTexture(.16,.27,.33,1) end)
    b:SetScript("OnLeave",function(self) self.back:SetColorTexture(.09,.15,.21,1) end)
    return b
end
local icon=F:CreateTexture(nil,"ARTWORK");icon:SetSize(42,42);icon:SetPoint("TOPLEFT",18,-18)
icon:SetTexture("Interface\\AddOns\\AllianceDungeonTrail\\assets\\Icon.tga")
label(F,"DUNGEON TRAIL",74,-18,570,21,{.89,.75,.47})
label(F,"ALLIANCE   /   JORNADA 1–60",75,-44,500,10,{.45,.65,.74})
button(F,"×",757,-18,26,function() local s=A.state();if s then s.hidden=true; A.refresh() end end)
local progress=CreateFrame("StatusBar",nil,F);progress:SetPoint("TOPLEFT",18,-76);progress:SetSize(764,4)
progress:SetStatusBarTexture("Interface\\TargetingFrame\\UI-StatusBar");progress:SetStatusBarColor(.23,.77,.70);progress:SetMinMaxValues(0,1)
local sidebar=CreateFrame("ScrollFrame",nil,F,"UIPanelScrollFrameTemplate")
sidebar:SetPoint("TOPLEFT",18,-100);sidebar:SetSize(188,411)
local menu=CreateFrame("Frame",nil,sidebar);menu:SetSize(184,#A.catalog*42);sidebar:SetScrollChild(menu)
local menuButtons={}
for i,d in ipairs(A.catalog) do
    local b=button(menu,d.level .. "  " .. d.name,0,-(i-1)*42,182,function() A.select(i) end)
    b.caption:SetWidth(166);b:SetHeight(37);b.caption:SetPoint("TOPLEFT",8,-5)
    menuButtons[i]=b
end
local title=label(F,"",242,-99,530,20)
local sub=label(F,"",243,-127,531,11,{.49,.70,.76})
local tab="Plano"
local tabs={}
for i,name in ipairs({"Plano","Quests","Diário","Ajuda"}) do
    tabs[name]=button(F,name,242+(i-1)*132,-154,123,function() tab=name; if A.scroll then A.scroll:SetVerticalScroll(0) end; A.refresh() end)
end
local scroll=CreateFrame("ScrollFrame",nil,F,"UIPanelScrollFrameTemplate")
A.scroll=scroll
scroll:SetPoint("TOPLEFT",242,-197);scroll:SetSize(516,302)
local content=CreateFrame("Frame",nil,scroll);content:SetSize(510,302);scroll:SetScrollChild(content)
local pool,used={},0
local function row(text,y,size,color,action)
    used=used+1
    local r=pool[used]
    if not r then
        r=CreateFrame("Button",nil,content);r:SetWidth(505)
        r.t=label(r,"",0,0,499,12)
        pool[used]=r
    end
    r:ClearAllPoints();r:SetPoint("TOPLEFT",0,-y)
    r.t:SetFont(STANDARD_TEXT_FONT or "Fonts\\FRIZQT__.TTF",size or 12,"")
    local c=color or {.83,.87,.91};r.t:SetTextColor(c[1],c[2],c[3]);r.t:SetText(text)
    local h=math.max(20,r.t:GetStringHeight()+9)
    r:SetHeight(h);r:SetScript("OnClick",action);r:Show()
    return y+h
end
local gold={.89,.75,.47};local teal={.32,.80,.72};local muted={.51,.62,.70}
local function escape(s) return A.text(s or "") end
local start=button(F,"Registrar entrada",242,-523,162,function() A.startRun() end)
local finish=button(F,"Finalizar",412,-523,108,function() A.finishRun(false) end)
button(F,"Descartar",528,-523,108,function() A.finishRun(true) end)
local mode=button(F,"",644,-523,138,function() local s=A.state();if not s.run then s.repeatRun=not s.repeatRun; A.refresh() end end)
label(F,"/adt ajuda   •   Arraste para mover   •   v1.0.0",18,-561,760,10,muted)
local restored=false
function A.render()
    local s=A.state()
    if A.safe(InCombatLockdown) then F:Hide();return end
    if not s or not A.allowed() or s.hidden then F:Hide();return end
    if not restored then
        F:SetScale(math.min(1, math.max(.5,(UIParent:GetWidth()-40)/800), math.max(.5,(UIParent:GetHeight()-40)/580)))
        if type(s.position)=="table" and A.number(math.abs(s.position.x or 0)) and A.number(math.abs(s.position.y or 0)) then
            F:ClearAllPoints();F:SetPoint("CENTER",UIParent,"CENTER",s.position.x,s.position.y)
        end
        restored=true
    end
    F:Show()
    local d=A.dungeon(); local level=A.number(A.safe(UnitLevel,"player")) or 1
    local xp=A.number(A.safe(UnitXP,"player")) or 0;local max=A.number(A.safe(UnitXPMax,"player")) or 0
    progress:SetValue(max>0 and xp/max or 1)
    title:SetText(escape(d.name))
    sub:SetText("Nível " .. level .. "   •   Faixa sugerida " .. d.level .. "–" .. d.high .. "   •   " .. escape(d.zone))
    start.caption:SetText(s.run and "Run em andamento" or "Registrar entrada")
    mode.caption:SetText(s.repeatRun and "Modo: repetição" or "Modo: com quests")
    for i,b in ipairs(menuButtons) do b.caption:SetTextColor(unpack(i==s.selected and gold or muted)) end
    for name,b in pairs(tabs) do b.caption:SetTextColor(unpack(name==tab and teal or muted)) end
    used=0;local y=0
    if tab=="Plano" then
        if level<13 then y=row("ANTES DA PRIMEIRA DUNGEON",y,13,gold);y=row("Níveis 1–12: faça quests externas e prepare seu grupo. O catálogo começa na faixa 13; isso não confirma o nível mínimo de entrada.",y) end
        if level<d.level then y=row("Abaixo da faixa sugerida. Prepare as quests; confirme acesso no cliente.",y,12,gold) end
        y=row("PREPARAR  →  ENTRAR  →  CONCLUIR  →  REPETIR",y,12,teal)
        y=row(escape(d.access),y)
        y=row("PRÓXIMA ETAPA",y+9,12,gold)
        local next=A.nextDungeon(level)
        y=row(next and (escape(next.name) .. " • faixa " .. next.level .. "–" .. next.high) or "Complete sua jornada até 60; não há conteúdo de raid neste guia.",y)
        y=row(A.estimate(),y+5)
        y=row("RUN ATIVA",y+9,12,gold)
        local active
        if s.run then for _,entry in ipairs(A.catalog) do if entry.key==s.run.dungeon then active=entry.name end end end
        y=row(s.run and (escape(active) .. " • " .. math.floor(s.run.gain) .. " XP observada • " .. (s.run.repeatRun and "repetição" or "com quests")) or "Escolha a dungeon, pegue as quests e registre sua entrada. Finalize antes de entregar quests fora da dungeon.",y)
        y=row("DADOS E ACESSO",y+9,12,gold)
        y=row("Faixas são sugestões de planejamento; confirme requisitos, pré-quests e disponibilidade no jogo. " .. (#d.quests==0 and "Sem quests curadas: use Diário para montar seu checklist." or "Seleção de quests, não catálogo exaustivo."),y)
        y=row("Referências ainda precisam de confirmação no cliente. Consulte a documentação incluída para fontes e cobertura.",y,11,muted)
    elseif tab=="Quests" then
        y=row("Clique em [ ] para confirmação manual. Objetivos do diário atualizam sozinhos. Um check manual não entrega nem conclui a quest.",y,11,muted)
        for i,q in ipairs(A.quests(d)) do
            local key=A.questKey(d,q,i)
            local status,objectives,id=A.questStatus(d,q,i)
            y=row(i .. ". " .. escape(q.name) .. "  |cff52ccba" .. status .. "|r",y+10,13,gold)
            y=row("Obter: " .. escape(q.pickup),y)
            y=row("Fazer: " .. escape(q.guide),y)
            y=row("[" .. (s.checks[key..":picked"] and "x" or " ") .. "] Peguei esta quest (manual)",y,11,teal,function() A.check(key..":picked") end)
            for _,o in ipairs(objectives) do y=row((o.done and "[x] " or "[ ] ") .. o.text,y,11,o.done and teal or nil) end
            y=row("[" .. (s.checks[key..":step"] and "x" or " ") .. "] Conferi objetivos e saque (manual)",y,11,teal,function() A.check(key..":step") end)
            if s.notes[key] then y=row("Sua referência: " .. s.notes[key],y,11) end
            y=row((id and "ID " .. id .. " • " or "Vincular: /adt vincular " .. i .. " ID • ") .. "Conferir no cliente. Fonte: /adt fonte " .. i,y,10,muted)
        end
        if #A.quests(d)==0 then y=row("Nenhuma quest curada nesta dungeon. Abra Diário e clique nas suas quests para adicioná-las. Use /adt nota N texto para referências de NPC, boss e sala.",y) end
    elseif tab=="Diário" then
        y=row(A.journalStatus or "Aguardando leitura do diário.",y,12,teal)
        y=row("Clique para adicionar uma quest à dungeon selecionada. Para ligar a uma sugestão existente, use /adt vincular N ID. Isso funciona com títulos traduzidos.",y,11)
        for _,q in ipairs(A.journal) do y=row("[+] " .. q.id .. "  " .. q.title,y+5,12,gold,function() A.addQuest(q.id) end) end
    else
        y=row("SEU CICLO DE DUNGEONS",y,14,gold)
        y=row("1. Escolha uma dungeon à esquerda. Em Quests, veja onde obter cada missão e as pré-quests conhecidas.\n2. Confira o diário e vincule IDs se usar outro idioma.\n3. No portal, registre entrada. Use 'com quests' na primeira visita; selecione 'repetição' só para runs comparáveis sem entregas.\n4. Durante a run, acompanhe objetivos e marque sua conferência.\n5. Finalize antes de viajar ou entregar quests. Escolha a próxima faixa quando o aviso chegar.",y)
        y=row("COMANDOS",y+8,12,teal)
        y=row("/adt • abrir\n/adt entrar • registrar entrada\n/adt fim • finalizar\n/adt descartar • ignorar amostra\n/adt adicionar ID • importar quest do diário\n/adt vincular N ID • ligar ID à sugestão N\n/adt nota N texto • salvar referência pessoal\n/adt fonte N • consultar fonte da quest\n/adt ocultar • esconder",y)
        y=row("LIMITES HONESTOS",y+8,12,gold)
        y=row("Sem setas indoor: referências textuais e objetivos reais do diário. Não há automação de combate, movimento, aceite, entrega ou reset. Runs são manuais. Em combate a janela fica oculta e as leituras são adiadas. Sem previsão com XP zero ou menos de 2 amostras válidas do mesmo dia/build e nível próximo. Ajustes de grupo e bônus exigem nova calibração.",y)
        local version,build,_,interface=GetBuildInfo()
        y=row("Cliente observado: " .. escape(version) .. " / " .. escape(build) .. " • interface " .. tostring(A.number(interface) or 0) .. ". Alvo: 16001. Validação no jogo pendente.",y,11,muted)
    end
    for i=used+1,#pool do pool[i]:Hide() end
    content:SetHeight(math.max(302,y+12))
end
