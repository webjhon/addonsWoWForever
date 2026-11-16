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
    if A.state().options and not A.state().options.nativeTracking then action=nil end
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
-- Original navigation: selected factual points, own geometry, own rendered arrow.
local ticker
function A.finite(v)
    if A.plain(v) and type(v)=="number" and v==v and math.abs(v)<1000000000 then return v end
end
local function xy(v)
    if not A.plain(v) then return end
    local x,y=A.safe(function() return v:GetXY() end);return A.finite(x),A.finite(y)
end
local function world(p)
    if not p or not A.num(p.map) or not A.num(p.x) or not A.num(p.y) or p.x>1 or p.y>1 then return end
    local continent,position=A.safe(function() return C_Map.GetWorldPosFromMapPos(p.map,CreateVector2D(p.x,p.y)) end)
    local x,y=xy(position);return A.num(continent),x,y
end
local function player()
    local map=A.num(A.safe(function() return C_Map.GetBestMapForUnit("player") end));if not map then return end
    local p=A.safe(function() return C_Map.GetPlayerMapPosition(map,"player") end);local x,y=xy(p)
    if not x or not y or (x==0 and y==0) then return end
    return world({map=map,x=x,y=y})
end
local function atan2(y,x)
    if math.atan2 then return math.atan2(y,x) end
    if x>0 then return math.atan(y/x) end
    if x<0 then return math.atan(y/x)+(y>=0 and math.pi or -math.pi) end
    if y>0 then return math.pi/2 elseif y<0 then return -math.pi/2 end;return 0
end
function A.bearing(dx,dy,facing)
    return atan2(dy,dx)-facing,math.sqrt(dx*dx+dy*dy)
end
local function closest(points,s)
    local pc,px,py=player();local selected,score
    for _,p in ipairs(points or {}) do
        if not (s.inside and p.entrance) then
            local c,x,y=world(p);local distance=(pc and c==pc and x and y and px and py) and ((x-px)^2+(y-py)^2) or 1e18
            if not selected or distance<score then selected=p;score=distance end
        end
    end
    return selected
end
function A.setGoal(s)
    if ticker then ticker:Cancel();ticker=nil end
    local a=A.action;local d=a and a.dungeon;local candidates,name
    A.navGoal=nil
    if not A.allowed(s) or s.dead or a.kind=="BLOCKED" or a.kind=="OUT_OF_SCOPE" then A.updateArrow();return end
    local override=A.navOverride
    if override and override.id then
        local live=s.quests[override.id]
        if (override.kind=='pickup' and live) or (override.kind=='turnin' and not live) then A.navOverride=nil;override=nil end
    end
    if override and (not s.inside or (d and d.key==override.dungeon)) then
        d=A.findDungeon(override.dungeon)
        if override.kind=='entrance' then candidates={(A.overviews[d.key] or {}).entrance};name='Entrada • '..d.name
        else candidates=(A.routes[override.id] or {})[override.kind];name=(override.kind=='pickup' and 'Coleta • ' or 'Entrega • ')..(override.title or 'Quest selecionada') end
    elseif d then
        local q=a.quest;local route=q and A.routes[q.id]
        if a.kind=='PREPARE' and route then candidates=route.pickup;name='Coleta • '..q.name
        elseif a.kind=='TURN_IN' and route then candidates=route.turnin;name='Entrega • '..q.name
        elseif a.kind=='TRAVEL' then candidates={(A.overviews[d.key] or {}).entrance};name='Entrada • '..d.name
        elseif a.kind=='OBJECTIVE' and route then
            candidates={};local live=s.quests[q.id];local objective=live and live.objectives[a.objective or 1]
            local kinds={monster=1,object=2,item=3};local kind=objective and kinds[objective.kind];local ordinal=0
            if kind then for i=1,a.objective do if kinds[live.objectives[i].kind]==kind then ordinal=ordinal+1 end end end
            for _,p in ipairs(route.objectives or {}) do
                local matches=not kind or (p.kind==kind and math.floor((p.mask or 0)/2^math.max(0,ordinal-1))%2==1)
                if matches and not (s.inside and p.entrance) then candidates[#candidates+1]=p end
            end
            name='Área do objetivo • '..q.name
        end
    end
    local p=closest(candidates,s)
    if p then A.navGoal={map=p.map,x=p.x,y=p.y,source=p.source,entrance=p.entrance,title=name or a.title} end
    if ticker then ticker:Cancel();ticker=nil end
    A.updateArrow()
    if A.navGoal and A.state().options.arrow and C_Timer and type(C_Timer.NewTicker)=="function" then ticker=C_Timer.NewTicker(.2,A.updateArrow) end
end
function A.updateArrow()
    if not A.arrow or not A.state() then return end
    local frame=A.arrow;local opt=A.state().options;local s=A.current()
    if not opt.arrow or not A.allowed(s) then frame:Hide();return end
    frame:SetScale(opt.scale);frame:Show()
    local goal=A.navGoal
    frame.title:SetText(goal and goal.title or "Sem ponto de navegação nesta etapa")
    frame.texture:Hide()
    if A.truth(A.safe(function()return InCombatLockdown() end)) then frame.status:SetText('Navegação pausada em combate');return end
    if not goal then frame.status:SetText(s.inside and 'Interior: acompanhe os objetivos e encontros' or 'Consulte o overview para referências');return end
    local pc,px,py=player();local gc,gx,gy=world(goal)
    if not pc or not px or not py or not gc or not gx or not gy then frame.status:SetText('Posição ou mapa indisponível');return end
    if pc~=gc then frame.status:SetText('Outro mapa/continente • viaje até a região');return end
    local facing=A.finite(A.safe(GetPlayerFacing));if not facing then frame.status:SetText('Direção do personagem indisponível');return end
    local rotation,distance=A.bearing(gx-px,gy-py,facing)
    frame.distance=distance;frame.rotation=rotation
    if distance<=opt.arrival then frame.status:SetText('Você chegou à área • confirme o objetivo no jogo');return end
    frame.texture:SetRotation(rotation);frame.texture:Show()
    local n=opt.units=='m' and distance*.9144 or distance
    frame.status:SetText(string.format('%.0f %s em linha reta%s',n,opt.units,goal.entrance and ' • entrada' or ''))
end
function A.makeArrow()
    local f=CreateFrame('Frame','AllianceDungeonTrailArrow',UIParent);f:SetSize(260,134);f:SetPoint('CENTER',UIParent,'CENTER',0,210);f:SetClampedToScreen(true)
    local texture=f:CreateTexture(nil,'ARTWORK');texture:SetSize(62,62);texture:SetPoint('TOP',f,'TOP',0,0);texture:SetTexture('Interface\\AddOns\\AllianceDungeonTrail\\assets\\Arrow.tga')
    local function label(y,w,size)local t=f:CreateFontString(nil,'OVERLAY');t:SetPoint('TOP',f,'TOP',0,-y);t:SetSize(w,32);t:SetFont(STANDARD_TEXT_FONT or 'Fonts\\FRIZQT__.TTF',size,'');t:SetTextColor(.95,.82,.53);return t end
    f.title=label(66,260,11);f.status=label(101,280,10);f.texture=texture;f:Hide();A.arrow=f
end
