local _, ns = ...
local A=ns
A.version="1.0.0"
local CVAR="ShowQuestUnitCircles"
local db,char,guid
local queued=false
function A.plain(v)
    if issecretvalue and issecretvalue(v) then return false end
    return not (type(v)=="table" and issecrettable and issecrettable(v))
end
function A.safe(fn,...)
    if type(fn)~="function" then return nil end
    local ok,a,b,c,d,e,f,g,h=pcall(fn,...)
    if not ok then return nil end
    for i=1,8 do if not A.plain(select(i,a,b,c,d,e,f,g,h)) then return nil end end
    return a,b,c,d,e,f,g,h
end
function A.text(v) return A.plain(v) and type(v)=="string" and v:gsub("|","||"):sub(1,300) or "" end
function A.number(v) if A.plain(v) and type(v)=="number" and v==v and v>=0 and v<1000000000 then return v end end
local function combat() return A.safe(function() return InCombatLockdown() end)==true end
function A.state() return char end
function A.database() return db end
function A.init()
    guid=A.text(A.safe(function() return UnitGUID("player") end))
    if guid=="" then return false end
    if type(AURANPCDB)~="table" then AURANPCDB={} end
    db=AURANPCDB;db.schema=1
    if type(db.characters)~="table" then db.characters={} end
    if type(db.characters[guid])~="table" then db.characters[guid]={enabled=true} end
    char=db.characters[guid]
    if char.enabled==nil then char.enabled=true end
    if type(db.lease)~="table" or db.lease.before~="0" or type(db.lease.owner)~="string" then db.lease=nil end
    return true
end
local function value()
    local v=A.safe(function() return C_CVar.GetCVar(CVAR) end)
    if v=="0" or v=="1" then return v end
end
local function writable()
    local v,_,_,_,locked,secure,readonly=A.safe(function() return C_CVar.GetCVarInfo(CVAR) end)
    return (v=="0" or v=="1") and locked==false and secure==false and readonly==false
end
local function write(v)
    if combat() or not writable() then return false end
    local ok=A.safe(function() return C_CVar.SetCVar(CVAR,v) end)
    return ok==true and value()==v
end
function A.release()
    if not db or not db.lease then return true end
    if combat() then return false end
    local current=value()
    if current==nil then return false end
    if current=="1" and not write(db.lease.before) then return false end
    db.lease=nil
    return true
end
local function snapshot()
    local s={level=A.number(A.safe(function() return UnitLevel("player") end)),
        faction=A.text(A.safe(function() return UnitFactionGroup("player") end)),native=value()}
    local _,kind=A.safe(GetInstanceInfo);s.kind=A.text(kind)
    s.zone=A.text(A.safe(function() return GetRealZoneText() end))
    local _,quests=A.safe(function() return C_QuestLog.GetNumQuestLogEntries() end);s.quests=A.number(quests)
    s.questTarget=A.safe(UnitIsQuestBoss,"target");if type(s.questTarget)~="boolean" then s.questTarget=nil end
    s.scope=s.faction=="Alliance" and s.level and s.level>=1 and s.level<=60 and (s.kind=="none" or s.kind=="party")
    return s
end
local function result(state,title,detail)
    A.status={state=state,title=title,detail=detail}
    if (state=="BLOCKED" or state=="CONFLICT" or state=="RESTORE_PENDING") and A.warned~=state then
        A.warned=state;print("|cffffd54fAURANPC|r "..title..". /auranpc para detalhes.")
    end
    if A.render then A.render() end
end
function A.reconcile()
    queued=false
    if not char and not A.init() then result("BLOCKED","Aguardando personagem","Não foi possível identificar este personagem.");return end
    if combat() then result("DEFERRED","Atualização após combate","O indicador já ativado continua sob controle do jogo. Alterações de configuração serão retomadas ao sair de combate.");return end
    A.context=snapshot()
    local s=A.context
    if not s.scope or not char.enabled then
        local restored=A.release()
        result(restored and (s.scope and "PAUSED" or "OUT_OF_SCOPE") or "RESTORE_PENDING",s.scope and "Gerenciamento pausado" or "Fora do escopo Alliance 1–60",
            restored and "A configuração anterior foi preservada. Abra as opções para retomar quando desejar." or "Não foi possível restaurar o ajuste anterior. O addon tentará novamente no próximo evento.")
        return
    end
    if s.native==nil then result("BLOCKED","Círculo de quest indisponível","Esta configuração não está disponível com segurança neste cliente. Nenhum efeito foi aplicado.");return end
    -- Detect competing settings before a new write; never fight another addon.
    if db.lease and db.lease.owner~=guid then
        if not A.release() then result("RESTORE_PENDING","Restaurando personagem anterior","A configuração anterior ainda não pôde ser restaurada.");return end
        s.native=value()
    end
    if db.lease and s.native~="1" then local applied=db.lease.applied;db.lease=nil;if applied then char.conflict=true end end
    if char.conflict then result("CONFLICT","Outro ajuste desativou os círculos","O AURANPC respeitou a mudança. Use REATIVAR nas opções se quiser assumir este ajuste novamente.");return end
    if s.native=="0" then
        if not writable() then result("BLOCKED","Configuração bloqueada pelo cliente","Não foi possível habilitar o indicador nativo. Nenhuma restrição será contornada.");return end
        -- Save the original value before mutation, including across reload.
        db.lease={before="0",owner=guid,applied=false}
        if not write("1") then if value()=="0" then db.lease=nil end;result("BLOCKED","Ativação não confirmada","O cliente não confirmou a alteração. Nenhum destaque visual foi comprovado.");return end
        s.native="1";db.lease.applied=true
    elseif db.lease then db.lease.applied=true
    end
    local line=s.quests==0 and "Sem quests no diário. Aceite uma quest para acompanhar seus objetivos. " or (s.quests==1 and "1 quest no diário. " or (s.quests and (s.quests.." quests no diário. ") or "Quantidade de quests indisponível. "))
    local target=s.questTarget==true and "O alvo atual tem marca de quest do cliente. " or ""
    result("ACTIVE","Círculos nativos habilitados",line..target.."Procure o círculo ao redor dos NPCs reconhecidos pelo jogo como relevantes. O próprio jogo acompanha o movimento e o progresso.")
end
function A.schedule()
    if queued then return end
    queued=true
    if C_Timer and type(C_Timer.After)=="function" then C_Timer.After(.1,A.reconcile) else A.reconcile() end
end
function A.setEnabled(enabled)
    if not char then return end
    char.enabled=enabled==true
    if enabled then char.conflict=nil end
    A.reconcile()
end
function A.command(command)
    command=(command or ""):lower()
    if command=="on" then A.setEnabled(true)
    elseif command=="off" then A.setEnabled(false)
    elseif command=="status" then
        local version,build,_,interface=A.safe(GetBuildInfo)
        print("AURANPC "..A.version.." | "..(A.status and A.status.state or "INITIALIZING").." | "..A.text(version).." / "..A.text(build).." / interface "..(A.number(interface) or 0))
    elseif A.frame then A.reconcile();if not combat() then A.frame:Show() end end
end
A.events=CreateFrame("Frame")
for _,event in ipairs({"PLAYER_LOGIN","PLAYER_ENTERING_WORLD","PLAYER_LEVEL_UP","QUEST_ACCEPTED","QUEST_REMOVED","QUEST_TURNED_IN","QUEST_LOG_UPDATE","QUEST_WATCH_UPDATE","PLAYER_TARGET_CHANGED","ZONE_CHANGED_NEW_AREA","CVAR_UPDATE","PLAYER_REGEN_ENABLED","PLAYER_REGEN_DISABLED","PLAYER_LOGOUT"}) do pcall(A.events.RegisterEvent,A.events,event) end
A.events:SetScript("OnEvent",function(_,event)
    if event=="PLAYER_LOGOUT" then A.release();return end
    if event=="PLAYER_LOGIN" then A.init() end
    A.schedule()
end)
SLASH_AURANPC1="/auranpc"
SlashCmdList.AURANPC=A.command
