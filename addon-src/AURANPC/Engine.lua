local _, ns = ...
ns.units, ns.markers, ns.pool, ns.quests, ns.byNPC = {}, {}, {}, {}, {}
ns.stats = {}
ns.removed = {}
local MAX_UNITS = 80
function ns.Public(v)
    if issecretvalue and issecretvalue(v) then return false end
    if type(v) == 'table' and issecrettable and issecrettable(v) then return false end
    return true
end
function ns.Read(fn, ...)
    if type(fn) ~= 'function' then return nil end
    local ok, value = pcall(fn, ...)
    if ok and ns.Public(value) then return value end
end
local function number(v) return ns.Public(v) and type(v) == 'number' and v == v end
local function text(v) return ns.Public(v) and type(v) == 'string' end
ns.IsNumber, ns.IsText = number, text
function ns.Context()
    local faction = ns.Read(function() return UnitFactionGroup('player') end)
    local level = ns.Read(function() return UnitLevel('player') end)
    return (faction == 'Alliance' or faction == 'Horde') and number(level) and level >= 1 and level <= 60
end
function ns.ScanQuests()
    ns.quests, ns.byNPC, ns.titles = {}, {}, {}
    ns.itemQuests, ns.itemTitles = {}, {}
    ns.questReadable = false
    local count = ns.Read(function() return C_QuestLog.GetNumQuestLogEntries() end)
    if not number(count) or count < 0 or count > 200 then return end
    ns.questReadable = true
    for i = 1, count do
        local info = ns.Read(C_QuestLog.GetInfo, i)
        if type(info)=='table' and number(info.questID) and info.questID > 0 and ns.Public(info.isHeader) and not info.isHeader then
            local id = info.questID
            local complete = ns.Read(C_QuestLog.IsComplete, id)
            local failed = ns.Read(C_QuestLog.IsFailed, id)
            local objectives = ns.Read(C_QuestLog.GetQuestObjectives, id)
            if ns.itemQuests and not ns.removed[id] and failed==false then
                local title=text(info.title) and info.title or ('Quest '..id)
                ns.itemQuests[id]={id=id,title=title,complete=complete}
                if ns.itemTitles[title]==nil then ns.itemTitles[title]=id else ns.itemTitles[title]=false end
            end
            if not ns.removed[id] and complete == false and failed ~= true and type(objectives)=='table' then
                local quest = {id=id, title=text(info.title) and info.title or ('Quest '..id), needed={}, known={}}
                local ordinal = {monster=0,item=0,object=0}
                local kinds = {monster=1,item=3,object=2}
                local valid = true
                for _, obj in ipairs(objectives) do
                    if not ns.Public(obj) or type(obj)~='table' then valid=false;break end
                    local kind = ns.Public(obj.type) and obj.type
                    if text(kind) and ordinal[kind] then
                        local index = ordinal[kind]; ordinal[kind] = index+1
                        -- Unknown completion is never interpreted as unfinished.
                        if ns.Public(obj.finished) and obj.finished == false then
                            quest.needed[kinds[kind]..':'..index] = text(obj.text) and obj.text or quest.title
                        end
                    end
                end
                if valid then
                    local unfinished = false
                    for _ in pairs(quest.needed) do unfinished=true;break end
                    if unfinished then
                        ns.quests[id] = quest
                        if ns.titles[quest.title] == nil then ns.titles[quest.title]=id else ns.titles[quest.title]=false end
                        for _, link in ipairs(ns.data[id] or {}) do
                            local kind, index, npc = link[1], link[2], link[3]
                            quest.known[npc]=true
                            local objective=quest.needed[kind..':'..index]
                            if objective then
                                ns.byNPC[npc]=ns.byNPC[npc] or {}
                                table.insert(ns.byNPC[npc], {id=id,title=quest.title,objective=objective,loot=kind==3})
                            end
                        end
                    end
                end
            end
        end
    end
end
function ns.NPCID(unit)
    local guid = ns.Read(function() return UnitGUID(unit) end)
    if not text(guid) then return nil end
    local kind, npc = guid:match('^(%a+)%-[^-]+%-[^-]+%-[^-]+%-[^-]+%-(%d+)%-')
    if kind == 'Creature' or kind == 'Vehicle' then return tonumber(npc) end
end
function ns.Match(unit)
    if not next(ns.quests) then return nil end
    local npc = ns.NPCID(unit)
    local dead = ns.Read(UnitIsDeadOrGhost,unit)
    for _, match in ipairs(npc and ns.byNPC[npc] or {}) do
        if dead ~= true or match.loot then return match end
    end
    -- Live Forever70938: GUID and tooltip text can be secret even out of combat.
    -- This public relation is an independent API result, not a decoded secret.
    -- It does not identify WHICH quest: never invent a quest ID/title here.
    local related=ns.Read(function() return C_QuestLog.UnitIsRelatedToActiveQuest(unit) end)
    if related==true then
        return {id=0,title='NPC de uma quest ativa',objective='Confira interação ou saque',relation=true}
    end
    -- Tooltip fallback uses exact UNIQUE active quest title, never generic quest-boss flags.
    local tooltip = ns.Read(function() return C_TooltipInfo.GetUnit(unit) end)
    local lines = type(tooltip)=='table' and ns.Public(tooltip.lines) and tooltip.lines
    if type(lines) ~= 'table' then return nil,not npc and 'unreadable' or nil end
    local titleType = Enum and Enum.TooltipDataLineType and Enum.TooltipDataLineType.QuestTitle or 17
    for _, line in ipairs(lines) do
        if ns.Public(line) and type(line)=='table' and ns.Public(line.type) and line.type == titleType and text(line.leftText) then
            local id = ns.titles[line.leftText]
            local quest = id and ns.quests[id]
            -- A mapped NPC with a finished objective cannot be reactivated by its quest title.
            if quest and not (npc and quest.known[npc]) and dead ~= true then
                return {id=id,title=quest.title,objective='Confira o objetivo desta quest no diário',tooltip=true}
            end
        end
    end
    return nil,not npc and 'unreadable' or nil
end
function ns.Drop(unit)
    ns.units[unit] = nil
    local marker=ns.markers[unit]
    if marker then ns.Release(marker);ns.markers[unit]=nil end
end
function ns.Add(unit)
    if not text(unit) or not unit:match('^nameplate%d+$') then return end
    local count=0;for _ in pairs(ns.units) do count=count+1 end
    if count < MAX_UNITS then ns.units[unit]=true end
end
function ns.Discover()
    local plates=ns.Read(function() return C_NamePlate.GetNamePlates() end)
    if type(plates)~='table' then return end
    local present={}
    for _, plate in ipairs(plates) do
        if ns.Public(plate) then
            local ok, forbidden=pcall(function() return plate:IsForbidden() end)
            if ok and ns.Public(forbidden) and forbidden==false then
                local token=plate.namePlateUnitToken
                if text(token) then present[token]=true;ns.Add(token) end
            end
        end
    end
    for unit in pairs(ns.units) do
        if not present[unit] and not ns.Read(function() return C_NamePlate.GetNamePlateForUnit(unit) end) then ns.Drop(unit) end
    end
end
function ns.Reconcile()
    local s={visible=0,matched=0,drawn=0,restricted=0,unreadable=0,quests=0}
    for _ in pairs(ns.quests) do s.quests=s.quests+1 end
    local active=ns.settings and ns.settings.enabled and ns.Context()
    local first
    for unit in pairs(ns.units) do
        s.visible=s.visible+1
        local plate=active and ns.Read(function() return C_NamePlate.GetNamePlateForUnit(unit) end)
        local allowed=false
        if plate then
            local ok, forbidden=pcall(function() return plate:IsForbidden() end)
            allowed=ok and ns.Public(forbidden) and forbidden==false
            if allowed then allowed=ns.Read(function() return plate:IsShown() end)==true end
            if not allowed then s.restricted=s.restricted+1 end
        end
        local match,reason
        if allowed then match,reason=ns.Match(unit) end
        if reason=='unreadable' then s.unreadable=s.unreadable+1 end
        if match then
            s.matched=s.matched+1
            local marker=ns.markers[unit] or ns.Acquire()
            if marker then
                ns.markers[unit]=marker
                local name=ns.Read(UnitName,unit)
                local ok=pcall(ns.Draw,marker,plate,text(name) and name or 'NPC de quest',match)
                if ok then
                    s.drawn=s.drawn+1;first=first or {name=text(name) and name or 'NPC de quest',match=match}
                else ns.Release(marker);ns.markers[unit]=nil;s.restricted=s.restricted+1 end
            end
        elseif ns.markers[unit] then ns.Release(ns.markers[unit]);ns.markers[unit]=nil end
    end
    ns.stats=s
    if ns.RefreshItems then ns.RefreshItems() end
    if ns.UpdateHUD then ns.UpdateHUD(first) end
    if ns.UpdateStatus then ns.UpdateStatus() end
end
function ns.Schedule(scan)
    ns.needsScan=ns.needsScan or scan
    if ns.pending then return end
    ns.pending=true
    C_Timer.After(.08,function()
        ns.pending=false
        if ns.needsScan then ns.needsScan=false;ns.ScanQuests() end
        ns.Reconcile()
    end)
end
