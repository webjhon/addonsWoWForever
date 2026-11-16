local _, A = ...
local owned, lastRequested
function A.waypoint(id,s)
    local Q=C_QuestLog or {}
    local map,x,y=A.safe(Q.GetNextWaypoint,id)
    map,x,y=A.num(map),A.num(x),A.num(y)
    if s.map then
        local lx,ly=A.safe(Q.GetNextWaypointForMap,id,s.map)
        lx,ly=A.num(lx),A.num(ly)
        if lx and ly and lx<=1 and ly<=1 and (lx>0 or ly>0) then map,x,y=s.map,lx,ly end
    end
    if not map or map<1 or not x or not y or x>1 or y>1 or (x==0 and y==0) then return nil end
    -- No projection, invented route, distance-through-walls or persisted position.
    local info=A.safe((C_Map or {}).GetMapInfo,map)
    return {map=map,x=x,y=y,name=A.table(info) and A.str(info.name) or ("Mapa "..map),text=A.str(A.safe(Q.GetNextWaypointText,id))}
end
function A.track(action,force)
    local S=C_SuperTrack or {}
    if A.truth(A.safe(function() return InCombatLockdown() end)) then return end
    local current=A.num(A.safe(S.GetSuperTrackedQuestID)) or 0
    if owned and current~=owned then owned=nil;lastRequested=nil end
    if not action or not action.id or not action.nav or A.state().navigation==false then
        if owned and current==owned then A.safe(S.SetSuperTrackedQuestID,0) end
        owned,lastRequested=nil,nil
        return
    end
    local anything=A.truth(A.safe(S.IsSuperTrackingAnything))
    if force or current==owned or (current==0 and not anything) then
        if current~=action.id and lastRequested~=action.id then
            A.safe(S.SetSuperTrackedQuestID,action.id)
            if A.num(A.safe(S.GetSuperTrackedQuestID))==action.id then owned=action.id;lastRequested=action.id end
        elseif current==action.id and owned==action.id then lastRequested=action.id end
    end
end
