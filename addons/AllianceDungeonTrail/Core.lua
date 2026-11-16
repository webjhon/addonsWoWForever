local _, A = ...
A.version = "1.0.0"
A.rows, A.journal = {}, {}
local db, char
local function plain(v)
    return not (issecretvalue and issecretvalue(v)) and not (issecrettable and type(v)=="table" and issecrettable(v))
end
local function safe(fn, ...)
    if type(fn) ~= "function" then return nil end
    local ok, value = pcall(fn, ...)
    if ok and plain(value) then return value end
end
A.safe = safe
function A.text(v)
    if not plain(v) or type(v) ~= "string" then return "" end
    return v:gsub("|", "||"):sub(1, 1200)
end
function A.number(v)
    if plain(v) and type(v) == "number" and v == v and v >= 0 and v < 1000000000 then return v end
end
local function sample()
    return A.number(safe(UnitLevel, "player")), A.number(safe(UnitXP, "player")), A.number(safe(UnitXPMax, "player"))
end
function A.allowed()
    local level = A.number(safe(UnitLevel, "player"))
    return safe(UnitFactionGroup, "player") == "Alliance" and level and level >= 1 and level <= 60
end
function A.message(s)
    if A.allowed() then print("|cffdfba72Dungeon Trail|r  " .. s) end
end
function A.dungeon()
    return A.catalog[char and char.selected or 1]
end
function A.state() return char end
function A.init()
    AllianceDungeonTrailDB = type(AllianceDungeonTrailDB) == "table" and AllianceDungeonTrailDB or {}
    db = AllianceDungeonTrailDB
    db.schema, db.characters = 1, type(db.characters) == "table" and db.characters or {}
    local key = safe(UnitGUID, "player")
    if type(key) ~= "string" then return false end
    db.characters[key] = type(db.characters[key]) == "table" and db.characters[key] or {}
    char = db.characters[key]
    for _, k in ipairs({"checks", "bindings", "notes", "history", "notified", "custom", "completed"}) do
        if type(char[k]) ~= "table" then char[k] = {} end
    end
    if not A.catalog[char.selected or 0] then
        char.selected = 1
        local level=A.number(safe(UnitLevel,"player")) or 1
        for i,d in ipairs(A.catalog) do if d.level<=level and level<=d.high then char.selected=i end end
    end
    -- A reloaded session cannot safely attribute XP across logout or a reset.
    if char.run then char.run = nil; A.message("Run interrompida por reload/logout: amostra descartada; checklist preservado.") end
    return true
end
function A.nextDungeon(level)
    for _, d in ipairs(A.catalog) do
        if d.level > level then return d end
    end
end
function A.unlocks()
    if not char or not A.allowed() then return end
    local level = sample()
    if not level then return end
    local names = {}
    for _, d in ipairs(A.catalog) do
        if level >= d.level and level <= d.high and not char.notified[d.key] then
            char.notified[d.key] = true
            names[#names+1] = d.name
        end
    end
    if #names > 0 then A.message("Faixa sugerida disponível: " .. table.concat(names, ", ") .. ". Abra /adt. Confira acesso e grupo.") end
end
function A.select(index)
    if not char or not A.catalog[index] then return end
    char.selected = index
    if A.scroll then A.scroll:SetVerticalScroll(0) end
    A.refresh()
end
function A.check(key)
    if not char or not A.allowed() then return end
    char.checks[key] = not char.checks[key]
    A.refresh()
end
function A.questKey(d, q, i) return d.key .. ":" .. (q.id or q.key or i) end
function A.quests(d)
    local list = {}
    local class = safe(function() if UnitClass then return select(2, UnitClass("player")) end end)
    for _, q in ipairs(d.quests) do
        if not q.class or q.class == class then list[#list+1] = q end
    end
    for _, q in ipairs(char.custom[d.key] or {}) do list[#list+1] = q end
    return list
end
function A.readJournal()
    A.journal = {}
    local Q = C_QuestLog or {}
    local n = A.number(safe(Q.GetNumQuestLogEntries))
    if not n then A.journalStatus = "Diário indisponível: use a confirmação manual."; return end
    for i = 1, math.min(n, 200) do
        local info = safe(Q.GetInfo, i)
        if type(info) == "table" and plain(info.isHeader) and not info.isHeader then
            local id = A.number(info.questID)
            local title = A.text(info.title)
            if id and id > 0 and title ~= "" then A.journal[#A.journal+1] = {id=id, title=title} end
        end
    end
    A.journalStatus = #A.journal .. " quests no diário. Vincule por ID em qualquer idioma."
end
function A.questStatus(d, q, i)
    local key = A.questKey(d, q, i)
    local id = char.bindings[key] or q.id
    local Q = C_QuestLog or {}
    if id and (char.completed[id] or safe(Q.IsQuestFlaggedCompleted, id) == true) then return "ENTREGUE", {}, id end
    local found
    for _, entry in ipairs(A.journal) do
        if entry.id == id or (not id and entry.title == q.name) then found = entry.id; break end
    end
    if not found then
        return char.checks[key .. ":picked"] and "PEGUEI (manual)" or "A OBTER", {}, id
    end
    char.bindings[key] = found
    local objectives, raw = {}, safe(Q.GetQuestObjectives, found)
    if type(raw) == "table" then
        for j, o in ipairs(raw) do
            if j > 40 then break end
            if type(o) == "table" then
                local text = A.text(o.text)
                if text ~= "" then objectives[#objectives+1] = {text=text, done=plain(o.finished) and o.finished == true} end
            end
        end
    end
    local complete = safe(Q.IsComplete, found)
    return complete == true and "PRONTA PARA ENTREGAR" or "NO DIÁRIO", objectives, found
end
function A.bind(questIndex, id)
    if not char or not A.allowed() then return false end
    local d = A.dungeon()
    local q = A.quests(d)[questIndex]
    if not q or not id or id < 1 or id % 1 ~= 0 then return false end
    for _, e in ipairs(A.journal) do
        if e.id == id then char.bindings[A.questKey(d,q,questIndex)] = id; A.refresh(); return true end
    end
    A.message("ID ausente do diário; abra a aba Diário e confira.")
    return false
end
function A.addQuest(id)
    if not char or not A.allowed() then return false end
    local d = A.dungeon()
    for _, e in ipairs(A.journal) do
        if e.id == id then
            for _, q in ipairs(A.quests(d)) do if q.id == id then return false end end
            char.custom[d.key] = char.custom[d.key] or {}
            table.insert(char.custom[d.key], {id=id, name=e.title, pickup="Adicionada do seu diário.", guide="Leia os objetivos abaixo. Registre uma referência com /adt nota N texto.", source="Diário do jogador", evidence="PLAYER_RECORD"})
            A.refresh(); return true
        end
    end
    return false
end
function A.startRun()
    if not char or safe(InCombatLockdown) or not A.allowed() or char.run then return false end
    local level, xp, max = sample()
    if not level or not xp or not max or max <= 0 or level == 60 then return false end
    char.run = {dungeon=A.dungeon().key, level=level, lastLevel=level, lastXP=xp, lastMax=max, gain=0, fraction=0, valid=true, repeatRun=char.repeatRun == true}
    A.message("Entrada registrada. Finalize ao terminar; descarte se sair ou trocar de grupo. Runs com quests não alimentam a previsão.")
    A.refresh(); return true
end
function A.recordXP()
    local r = char and char.run
    if not r then return end
    local l,x,m = sample()
    if not l or not x or not m or m <= 0 then r.valid=false; return end
    local gain
    if l == r.lastLevel then gain = x-r.lastXP
    elseif l == r.lastLevel+1 then gain = r.lastMax-r.lastXP+x
    else r.valid=false end
    if gain and gain >= 0 then
        r.gain = r.gain+gain
        if l == r.lastLevel then r.fraction = r.fraction+gain/r.lastMax
        else r.fraction = r.fraction+(r.lastMax-r.lastXP)/r.lastMax+x/m end
    else r.valid=false end
    r.lastLevel,r.lastXP,r.lastMax=l,x,m
end
function A.finishRun(discard)
    if not char or not char.run then return false end
    if not discard and safe(InCombatLockdown) then return false end
    A.recordXP()
    local r=char.run
    char.run=nil
    if not discard then
        local _, build = GetBuildInfo()
        local h=char.history[r.dungeon] or {}
        h[#h+1]={level=r.level,gain=r.gain,fraction=r.fraction,valid=r.valid,repeatRun=r.repeatRun,build=A.text(build),day=safe(date,"%Y-%m-%d") or "session"}
        while #h>12 do table.remove(h,1) end
        char.history[r.dungeon]=h
        A.message("Run registrada: " .. math.floor(r.gain) .. " XP" .. (r.valid and "." or " (excluída da previsão: leitura incompleta)."))
    end
    A.refresh(); return true
end
function A.estimate()
    local l,x,m=sample()
    if not l or not x or not m or m<=0 or l==60 then return "Nível 60: jornada concluída." end
    local n,total,fraction,low,high=0,0,0,nil,nil
    local _, build=GetBuildInfo()
    build=A.text(build)
    local day=safe(date,"%Y-%m-%d") or "session"
    for _, r in ipairs(char.history[A.dungeon().key] or {}) do
        if r.valid and r.repeatRun and r.gain>0 and math.abs(r.level-l)<=2 and r.build==build and r.day==day then
            n=n+1; total=total+r.gain; fraction=fraction+r.fraction
            low=not low and r.fraction or math.min(low,r.fraction)
            high=not high and r.fraction or math.max(high,r.fraction)
        end
    end
    if n<2 then return "Faça 2 runs de repetição hoje para calibrar. Amostras: " .. n .. "/2. A primeira visita com quests fica fora da previsão." end
    local next=A.nextDungeon(l)
    local remaining=next and (next.level-l-x/m) or (60-l-x/m)
    local target=next and next.name or "nível 60"
    local best=math.max(1,math.ceil(remaining/high))
    local worst=math.max(1,math.ceil(remaining/low))
    return string.format("Próximo nível: ~%d runs. Até %s (heurística): %d–%d runs; média ~%d. %d amostras locais.\nXP futura, bônus, grupo e resets podem alterar tudo. Sem garantia; recalcule a cada nível.",math.ceil((m-x)/(total/n)),target,best,worst,math.ceil(remaining/(fraction/n)),n)
end
function A.refresh()
    if not char then return end
    if A.render then A.render() end
end
function A.command(msg)
    if not char or safe(InCombatLockdown) or not A.allowed() then return end
    local cmd, rest = (msg or ""):match("^(%S*)%s*(.-)$")
    if cmd=="vincular" then local a,b=rest:match("^(%d+)%s+(%d+)$"); A.bind(tonumber(a),tonumber(b))
    elseif cmd=="adicionar" then A.addQuest(tonumber(rest))
    elseif cmd=="fonte" then
        local q=A.quests(A.dungeon())[tonumber(rest)]
        if q then A.message(A.text(q.source)) end
    elseif cmd=="nota" then
        local i,note=rest:match("^(%d+)%s+(.+)$")
        local d=A.dungeon(); i=tonumber(i)
        local q=i and A.quests(d)[i]
        if q then char.notes[A.questKey(d,q,i)]=A.text(note); A.refresh() end
    elseif cmd=="entrar" then A.startRun()
    elseif cmd=="fim" then A.finishRun(false)
    elseif cmd=="descartar" then A.finishRun(true)
    elseif cmd=="ocultar" then char.hidden=true; A.refresh()
    elseif cmd=="ajuda" then A.message("/adt | entrar | fim | descartar | adicionar ID | vincular N ID | nota N texto | ocultar. Escolha a dungeon antes de registrar a entrada.")
    else char.hidden=false; A.refresh() end
end
local events=CreateFrame("Frame")
A.events=events
for _, event in ipairs({"PLAYER_LOGIN","PLAYER_ENTERING_WORLD","PLAYER_XP_UPDATE","PLAYER_LEVEL_UP","QUEST_LOG_UPDATE","QUEST_TURNED_IN","PLAYER_REGEN_ENABLED"}) do pcall(events.RegisterEvent, events,event) end
events:SetScript("OnEvent",function(_,event,...)
    if not char then if event~="PLAYER_LOGIN" and event~="PLAYER_ENTERING_WORLD" then return end; if not A.init() then return end end
    if event=="QUEST_TURNED_IN" and char.run then char.run.repeatRun=false end
    -- Do not inspect journal/progression while combat restrictions may apply.
    if safe(InCombatLockdown) then A.refresh(); return end
    if not A.allowed() then if char.run then char.run=nil end; A.refresh(); return end
    if event=="PLAYER_XP_UPDATE" or event=="PLAYER_LEVEL_UP" or event=="PLAYER_REGEN_ENABLED" then A.recordXP() end
    if event=="QUEST_TURNED_IN" then
        local id=A.number((...)); if id then char.completed[id]=true end
        if char.run then char.run.repeatRun=false end
    end
    if event=="PLAYER_ENTERING_WORLD" and char.run then
        -- Zone transitions are only a reminder; entry/exit remain explicit.
        A.message("Mudança de zona: confira a run ativa. Descarte se houve XP fora da dungeon.")
    end
    A.readJournal(); A.unlocks(); A.refresh()
end)
SLASH_ALLIANCEDUNGEONTRAIL1="/adt"
SlashCmdList.ALLIANCEDUNGEONTRAIL=A.command
