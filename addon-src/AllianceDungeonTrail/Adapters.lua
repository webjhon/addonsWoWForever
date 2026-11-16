local _, A = ...
-- Secret checks precede type inspection, equality, iteration and arithmetic.
function A.plain(v)
    if issecretvalue and issecretvalue(v) then return false end
    if type(v)=="table" and issecrettable and issecrettable(v) then return false end
    return true
end
function A.safe(fn, ...)
    if type(fn)~="function" then return nil end
    local ok,a,b,c,d,e,f,g,h=pcall(fn,...)
    if not ok then return nil end
    for i=1,8 do if not A.plain(select(i,a,b,c,d,e,f,g,h)) then return nil end end
    return a,b,c,d,e,f,g,h
end
function A.num(v)
    if A.plain(v) and type(v)=="number" and v==v and v>=0 and v<1000000000 then return v end
end
function A.str(v)
    if A.plain(v) and type(v)=="string" then return v:gsub("|","||"):sub(1,1000) end
    return ""
end
function A.table(v) return A.plain(v) and type(v)=="table" end
function A.truth(v) return A.plain(v) and v==true end
function A.build()
    local _,b= A.safe(GetBuildInfo)
    return A.str(b)
end
function A.snapshot()
    local Q,M=C_QuestLog or {},C_Map or {}
    local s={level=A.num(A.safe(function() return UnitLevel("player") end)),xp=A.num(A.safe(function() return UnitXP("player") end)),max=A.num(A.safe(function() return UnitXPMax("player") end)),
        guid=A.str(A.safe(function() return UnitGUID("player") end)),faction=A.str(A.safe(function() return UnitFactionGroup("player") end)),
        dead=A.truth(A.safe(function() return UnitIsDeadOrGhost("player") end)),build=A.build(),now=A.num(A.safe(GetServerTime)),quests={}}
    local _,class=A.safe(UnitClass,"player");s.class=A.str(class)
    local name,kind,_,_,_,_,_,instanceID=A.safe(GetInstanceInfo)
    local inside=A.safe(IsInInstance)
    s.instance=A.str(name);s.kind=A.str(kind);s.inside=A.truth(inside);s.instanceID=A.num(instanceID)
    s.zone=A.str(A.safe(GetRealZoneText));if s.zone=="" then s.zone=A.str(A.safe(GetZoneText)) end
    s.map=A.num(A.safe(function() return C_Map.GetBestMapForUnit("player") end))
    local info=s.map and A.safe(M.GetMapInfo,s.map)
    s.mapName=A.table(info) and A.str(info.name) or ""
    s.offers={}
    if A.gossipOpen then
        local available=A.safe((C_GossipInfo or {}).GetAvailableQuests)
        if A.table(available) then for i=1,math.min(#available,50) do local v=available[i];if A.table(v) then local id=A.num(v.questID);if id then s.offers[id]=A.str(v.title) end end end end
    end
    s.contextOK=type(GetInstanceInfo)=="function" and type(IsInInstance)=="function" and s.kind~=""
    local n=A.num(A.safe(Q.GetNumQuestLogEntries))
    s.journalOK=n~=nil and n<=200 and type(Q.GetInfo)=="function"
    if not s.journalOK then return s end
    for i=1,n do
        local q=A.safe(Q.GetInfo,i)
        if not A.table(q) then s.journalOK=false;break end
        if not A.plain(q.isHeader) then s.journalOK=false;break end
        if not q.isHeader then
            local id=A.num(q.questID)
            if not id or id<1 then s.journalOK=false;break end
            local objectives=A.safe(Q.GetQuestObjectives,id)
            local item={id=id,title=A.str(q.title),objectives={},objectivesOK=A.table(objectives),
                complete=A.truth(A.safe(Q.IsComplete,id)),failed=A.truth(A.safe(Q.IsFailed,id))}
            if item.objectivesOK then
                for j=1,math.min(#objectives,30) do
                    local o=objectives[j]
                    if not A.table(o) or not A.plain(o.finished) or not A.plain(o.text) then item.objectivesOK=false;break end
                    item.objectives[#item.objectives+1]={text=A.str(o.text),done=o.finished==true,count=A.num(o.numFulfilled),total=A.num(o.numRequired),index=j}
                end
            end
            s.quests[id]=item
        end
    end
    return s
end
