local _, A = ...
A.version="3.0.0"
local char, snapshot
local scheduled=false
local function completed(id)
    return (char and char.completed[id]==true) or A.truth(A.safe((C_QuestLog or {}).IsQuestFlaggedCompleted,id))
end
function A.state() return char end
function A.current() return snapshot end
function A.allowed(s)
    return s and s.faction=="Alliance" and s.level and s.level>=1 and s.level<=60
end
function A.init()
    local guid=A.str(A.safe(function() return UnitGUID("player") end))
    if guid=="" then return false end
    if not A.table(AllianceDungeonTrailDB) then AllianceDungeonTrailDB={} end
    local db=AllianceDungeonTrailDB
    if not A.table(db.characters) then db.characters={} end
    if not A.table(db.characters[guid]) then db.characters[guid]={} end
    char=db.characters[guid]
    A.freshLogin=true
    if char.schema~=2 then
        -- A v1 checkbox/binding is never evidence of real progress.
        local position=A.table(char.position) and char.position or nil
        for k in pairs(char) do char[k]=nil end
        char.schema=2;char.position=position
    end
    for _,key in ipairs({"completed","seen","notified","history","instances"}) do
        if not A.table(char[key]) then char[key]={} end
    end
    if A.initOptions then A.initOptions(char) end
    if char.run then char.run=nil;char.recovery="Expedição anterior excluída da estimativa após reload." end
    return true
end
function A.findDungeon(key)
    for _,d in ipairs(A.catalog) do if d.key==key then return d end end
end
function A.questAllowed(q,s)
    return (not q.class or q.class==s.class) and (not q.required or q.required<=s.level)
end
function A.questState(q,s)
    local live=s.quests[q.id]
    -- Repeatable quests currently in the log take precedence over historical completion.
    if live then
        if live.failed then return "FAILED",live end
        if live.complete then return "READY",live end
        return "ACTIVE",live
    end
    if completed(q.id) then return "TURNED_IN" end
    if char.seen[q.id] then return "MISSING" end
    return "AVAILABLE_UNKNOWN"
end
local function matchDungeon(s)
    for _,d in ipairs(A.catalog) do if s.instanceID==d.instanceID then return d end end
    local observed=s.instanceID and char.instances[s.instanceID]
    if observed then return A.findDungeon(observed) end
    for _,d in ipairs(A.catalog) do
        local matches=s.instance==d.name or s.mapName==d.name
        for _,alias in ipairs(d.aliases or {}) do if s.instance==alias or s.mapName==alias then matches=true end end
        if matches then
            if s.instanceID then char.instances[s.instanceID]=d.key end
            return d
        end
    end
end
function A.recommend(s)
    local selected,score
    for _,d in ipairs(A.catalog) do
        if d.covered and d.level<=s.level and s.level<=d.high then
            local value=d.level+((s.zone==d.zone or s.mapName==d.zone) and 10 or 0)
            if not score or value>score then selected=d;score=value end
        end
    end
    return selected
end
function A.nextDungeon(level)
    for _,d in ipairs(A.catalog) do if d.covered and d.level>level then return d end end
end
A.instanceDungeon=matchDungeon
local function activeCount(d,s)
    local n=0;for _,q in ipairs(d.quests) do if s.quests[q.id] then n=n+1 end end;return n
end
local function selectDungeon(s)
    if s.inside then return matchDungeon(s) end
    if char.plan then local planned=A.findDungeon(char.plan);if planned then return planned end end
    -- Ready turn-ins across the whole catalog cannot be lost at a level boundary.
    for _,d in ipairs(A.catalog) do
        for _,q in ipairs(d.quests) do if s.quests[q.id] and s.quests[q.id].complete then return d end end
    end
    local prior=A.findDungeon(char.focusDungeon)
    if prior and activeCount(prior,s)>0 then return prior end
    for _,d in ipairs(A.catalog) do if activeCount(d,s)>0 then return d end end
    if prior and prior.covered and prior.level<=s.level and s.level<=prior.high then return prior end
    return A.recommend(s)
end
local function make(kind,title,detail,d,q)
    return {kind=kind,title=title,detail=detail or "",dungeon=d,quest=q,id=q and q.id}
end
local function objective(d,q,live,s)
    if live.failed then return make("FAILED","Quest falhou: "..live.title,"Abandone/reobtenha a quest conforme o diário. O addon não declara conclusão.",d,q) end
    if not live.objectivesOK then return make("WAIT_DATA","Aguardando objetivos do cliente",live.title.." • nenhuma conclusão será presumida.",d,q) end
    for _,o in ipairs(live.objectives) do
        if not o.done then
            local a=make("OBJECTIVE",o.text~="" and o.text or live.title,q.guide,d,q)
            a.objective=o.index;a.count=o.count;a.total=o.total;a.questTitle=live.title
            return a
        end
    end
    return make("VERIFY","Confira a interação ou saque pendente",live.title.." • objetivos contabilizados; aguardando confirmação de conclusão pelo diário. "..q.guide,d,q)
end
local function candidateQuest(d,s)
    for _,q in ipairs(d.quests) do
        if A.questAllowed(q,s) and not q.insidePickup and not s.quests[q.id] and not completed(q.id) then
            local prerequisites=true
            for _,id in ipairs(q.requires or {}) do if not completed(id) then prerequisites=false end end
            if prerequisites then return q end
        end
    end
end
function A.decide(s)
    if not A.allowed(s) then return make("OUT_OF_SCOPE","Alliance • leveling 1–60","Este personagem está fora do escopo.") end
    if not s.contextOK or not s.journalOK or type((C_QuestLog or {}).IsComplete)~="function" or type((C_QuestLog or {}).GetQuestObjectives)~="function" then
        return make("BLOCKED","Acompanhamento indisponível","Não foi possível ler instância/diário com segurança. /adt diagnostico informa as APIs ausentes; não há progresso manual substituto.")
    end
    if s.dead then return make("RECOVER","Retorne ao corpo ou ressuscite","Seu objetivo será restaurado automaticamente ao voltar à vida.") end
    if s.inside and s.kind~="party" then return make("OUT_OF_SCOPE","Fora de uma dungeon de leveling","Acompanhamento suspenso nesta instância.") end
    local d=selectDungeon(s)
    if s.inside and not d then return make("COVERAGE_GAP","Instância ainda não identificada",s.instance.." • nenhum vínculo com uma dungeon foi presumido. Identificação localizada requer validação; não confundir quests carregadas com a instância atual.") end
    if not d then
        if s.level==60 then return make("FINISHED","Leveling 1–60 concluído","A jornada de leveling termina aqui.") end
        local first=A.catalog[1]
        return make("PRE_LEVEL","Prepare seu primeiro grupo",first.name.." • faixa sugerida "..first.level.."–"..first.high..". Acompanhe o nível; avisarei quando chegar à faixa.",first)
    end
    for _,offeredDungeon in ipairs(A.catalog) do
        if not s.inside or offeredDungeon.key==d.key then
            for _,q in ipairs(offeredDungeon.quests) do
                if s.offers[q.id] and not s.quests[q.id] then
                    local a=make("OFFERED","Aceite: "..s.offers[q.id],"Quest oferecida agora pelo NPC. Aceite na janela do jogo; eu reconheço o aceite e passo ao próximo objetivo.",offeredDungeon,q)
                    a.id=nil;return a
                end
            end
        end
    end
    char.focusDungeon=d.key
    if s.inside and not d.covered then return make("COVERAGE_GAP","Guia desta dungeon bloqueado por dados",d.name.." • quests/objetivos locais ainda não curados. Não há checklist manual substituto.",d) end
    local active,ready={},{}
    for _,q in ipairs(d.quests) do
        local state,live=A.questState(q,s)
        if live then
            if state=="READY" then ready[#ready+1]={q=q,live=live}
            elseif not s.inside or q.phase~="outside" then active[#active+1]={q=q,live=live} end
        end
    end
    if s.inside and #active>0 then
        local chosen=active[1]
        local tracked=A.num(A.safe((C_SuperTrack or {}).GetSuperTrackedQuestID))
        for _,v in ipairs(active) do if v.q.id==char.focusQuest then chosen=v end end
        for _,v in ipairs(active) do if v.q.id==tracked then chosen=v end end
        return objective(d,chosen.q,chosen.live,s)
    end
    if #ready>0 then
        local q,live=ready[1].q,ready[1].live
        return make("TURN_IN","Entregue: "..live.title,"Destino do diário tem prioridade. Referência de coleta: "..q.pickup..(s.inside and " • há quest pronta; outras quests externas podem continuar pendentes." or ""),d,q)
    end
    if #active>0 then
        local chosen=active[1]
        for _,v in ipairs(active) do if v.q.id==char.focusQuest then chosen=v end end
        if chosen.q.phase=="outside" then return objective(d,chosen.q,chosen.live,s) end
        return make("TRAVEL","Vá para "..d.name,d.access.." • "..chosen.live.title.." aceita; objetivo: "..chosen.q.guide,d,chosen.q)
    end
    if s.inside then
        return make("EXPLORE","Continue com o grupo",d.name.." • sem objetivos internos aceitos pendentes. Observe quests oferecidas e saque; a próxima quest aceita será acompanhada automaticamente.",d)
    end
    if s.level==60 then return make("FINISHED","Leveling 1–60 concluído","Entregas pendentes continuam acompanhadas quando estiverem no diário.") end
    local q=candidateQuest(d,s)
    if q then
        local a=make("PREPARE","Procure: "..q.name,q.pickup.." • oferta potencial: pré-requisitos e fase precisam ser confirmados pelo NPC. Ao aceitar, eu acompanho automaticamente.",d,q)
        a.id=nil -- An unaccepted quest has no authoritative live navigation.
        return a
    end
    return make("TRAVEL","Forme grupo para "..d.name,d.access.." • quests conhecidas resolvidas ou indisponíveis; a entrada é detectada automaticamente.",d)
end
local function updateXP(s)
    local r=char.run
    if not r then return end
    if not s.xp or not s.max or s.max<=0 or not s.level or r.build~=s.build or not r.lastXP then r.valid=false;return end
    local delta
    if s.level==r.lastLevel and s.xp>=r.lastXP then delta=s.xp-r.lastXP
    elseif s.level==r.lastLevel+1 then delta=r.lastMax-r.lastXP+s.xp
    else r.valid=false end
    if delta then r.gain=r.gain+delta;r.fraction=r.fraction+delta/r.lastMax end
    r.lastXP,r.lastMax,r.lastLevel=s.xp,s.max,s.level
    if s.dead then r.valid=false end
end
local function reconcileRun(s)
    local d=s.inside and s.kind=="party" and matchDungeon(s)
    local key=d and d.key
    local r=char.run
    -- Never attribute the exit event's outdoor XP to an indoor segment.
    if r and r.key~=key then
        r.duration=(s.now and r.started and s.now-r.started) or 0
        r.valid=r.valid and r.duration>=300 and r.gain>0 and r.build==s.build and s.level-r.level<=2
        char.history[#char.history+1]={key=r.key,gain=r.gain,fraction=r.fraction,level=r.level,build=r.build,at=s.now,valid=r.valid,duration=r.duration}
        while #char.history>20 do table.remove(char.history,1) end
        char.run=nil
    end
    if key and not char.run then
        if not A.freshLogin then char.encounters[key]={} end
        char.run={key=key,build=s.build,level=s.level,lastLevel=s.level,lastXP=s.xp,lastMax=s.max,gain=0,fraction=0,started=s.now,
            valid=not A.freshLogin and s.xp~=nil and s.max~=nil and s.max>0 and activeCount(d,s)==0 and not s.dead}
    elseif key then updateXP(s) end
end
function A.estimate(s)
    local d=A.action and A.action.dungeon
    if not d or s.level>=60 then return "" end
    local gains,lo,hi={},nil,nil
    for _,r in ipairs(char.history) do
        if r.valid and r.key==d.key and r.build==s.build and r.at and s.now and s.now-r.at>=0 and s.now-r.at<=86400 and math.abs(s.level-r.level)<=2 and r.fraction>0 then
            gains[#gains+1]=r.fraction;lo=math.min(lo or r.fraction,r.fraction);hi=math.max(hi or r.fraction,r.fraction)
        end
    end
    if #gains<2 then return "Previsão aprendendo • "..#gains.."/2 expedições comparáveis sem quests. Entrada e saída são automáticas." end
    local nextD=A.nextDungeon(s.level)
    if not nextD or not s.xp or not s.max or s.max<=0 then return "Sem próxima faixa conhecida para estimar." end
    local remaining=nextD.level-s.level-s.xp/s.max
    return "Até "..nextD.name..": ~"..math.max(1,math.ceil(remaining/hi)).."–"..math.max(1,math.ceil(remaining/lo)).." expedições semelhantes ("..#gains.." amostras). Heurística, não clears confirmados nem XP futura garantida."
end
function A.reconcile()
    scheduled=false
    if not char and not A.init() then return end
    if A.truth(A.safe(function() return InCombatLockdown() end)) then A.pending=true;if A.render then A.render() end;return end
    A.pending=false
    snapshot=A.snapshot()
    local s=snapshot
    if A.allowed(s) and s.contextOK and s.journalOK then
        for id in pairs(s.quests) do char.seen[id]=true end
        reconcileRun(s)
        if char.run and (not s.journalOK or activeCount(A.findDungeon(char.run.key),s)>0) then char.run.valid=false end
        for _,d in ipairs(A.catalog) do
            if d.level<=s.level and s.level<=d.high and not char.notified[d.key] then
                char.notified[d.key]=true
                if not char.options or char.options.alerts then print("|cffdfba72Dungeon Trail|r Nova faixa sugerida: "..d.name.." ("..d.level.."–"..d.high.."). Acesso não garantido.") end
            end
        end
    elseif char.run then char.run.valid=false end
    A.freshLogin=false
    A.action=A.decide(s)
    char.focusQuest=A.action.id
    if A.action.id and s.quests[A.action.id] and A.action.kind~="WAIT_DATA" then
        A.action.nav=A.waypoint(A.action.id,s)
        A.action.waypointText=A.str(A.safe((C_QuestLog or {}).GetNextWaypointText,A.action.id))
        if A.action.waypointText~="" then A.action.detail=A.action.waypointText.."\n"..A.action.detail end
    end
    A.track(A.action)
    if A.setGoal then A.setGoal(s) end
    if A.render then A.render() end
end
function A.schedule()
    if scheduled then return end
    scheduled=true
    if C_Timer and type(C_Timer.After)=="function" then C_Timer.After(.15,A.reconcile) else A.reconcile() end
end
function A.diagnostics()
    local missing={}
    for _,name in ipairs({"GetNumQuestLogEntries","GetInfo","GetQuestObjectives","IsComplete"}) do
        if type((C_QuestLog or {})[name])~="function" then missing[#missing+1]="C_QuestLog."..name end
    end
    print("Dungeon Trail "..A.version.." • build "..A.build().." • "..(A.action and A.action.kind or "INITIALIZING").." • APIs ausentes: "..(#missing>0 and table.concat(missing,", ") or "nenhuma das essenciais"))
end
A.events=CreateFrame("Frame")
local events={"PLAYER_LOGIN","PLAYER_ENTERING_WORLD","ZONE_CHANGED_NEW_AREA","ZONE_CHANGED","PLAYER_MAP_CHANGED","PLAYER_LEVEL_UP","PLAYER_XP_UPDATE","QUEST_ACCEPTED","QUEST_REMOVED","QUEST_TURNED_IN","QUEST_LOG_UPDATE","QUEST_WATCH_UPDATE","QUEST_POI_UPDATE","QUEST_DATA_LOAD_RESULT","WAYPOINT_UPDATE","PLAYER_REGEN_DISABLED","PLAYER_REGEN_ENABLED","PLAYER_DEAD","PLAYER_ALIVE","PLAYER_UNGHOST","SUPER_TRACKED_QUEST_CHANGED","ENCOUNTER_END","GOSSIP_SHOW","GOSSIP_OPTIONS_REFRESHED","GOSSIP_CLOSED"}
A.registrationErrors={}
for _,event in ipairs(events) do local ok=pcall(A.events.RegisterEvent,A.events,event);if not ok then A.registrationErrors[#A.registrationErrors+1]=event end end
A.events:SetScript("OnEvent",function(_,event,id,name,difficulty,groupSize,success)
    if event=="PLAYER_LOGIN" then A.init() end
    if event=="GOSSIP_SHOW" or event=="GOSSIP_OPTIONS_REFRESHED" then A.gossipOpen=true end
    if event=="GOSSIP_CLOSED" or event=="PLAYER_ENTERING_WORLD" then A.gossipOpen=false end
    if char and event=="ENCOUNTER_END" and A.numberSafeSuccess then A.numberSafeSuccess(id,success) end
    if char and event=="QUEST_TURNED_IN" then
        id=A.num(id);if id and id>0 then char.completed[id]=true end
    end
    if char and char.run and (event=="QUEST_TURNED_IN" or event=="QUEST_ACCEPTED" or event=="PLAYER_DEAD" ) then char.run.valid=false end
    A.schedule()
end)
