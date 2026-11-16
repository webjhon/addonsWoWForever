local _, A = ...
local defaults={arrow=true,tracker=true,alerts=true,nativeTracking=false,scale=1,arrival=15,units="m",lockArrow=false}
function A.initOptions(char)
    char.layout=type(char.layout)=='table' and char.layout or {}
    char.paused=char.paused==true
    local choice=char.navChoice
    A.navOverride=nil
    if A.table(choice) and A.findDungeon(choice.dungeon) and
        (choice.kind=='entrance' or ((choice.kind=='pickup' or choice.kind=='turnin') and A.num(choice.id) and A.routes[choice.id])) then A.navOverride=choice else char.navChoice=nil end
    char.options=type(char.options)=="table" and char.options or {}
    for k,v in pairs(defaults) do if type(char.options[k])~=type(v) then char.options[k]=v end end
    char.options.scale=math.max(.75,math.min(1.3,char.options.scale))
    char.options.arrival=math.max(5,math.min(40,char.options.arrival))
    if char.options.units~="m" and char.options.units~="jd" then char.options.units="m" end
    char.encounters=type(char.encounters)=="table" and char.encounters or {}
end
function A.option(key,value)
    local char=A.state();if not char or defaults[key]==nil or type(value)~=type(defaults[key]) then return false end
    char.options[key]=value;A.initOptions(char);A.reconcile();return true
end
function A.selectPlan(key)
    if key and not A.findDungeon(key) then return false end
    A.state().paused=false;A.state().plan=key;A.state().focusQuest=nil;A.state().navChoice=nil;A.inspect=key;A.navOverride=nil;A.reconcile();return true
end
function A.pauseGuide(paused)
    local char=A.state();if not char then return end
    char.paused=paused==true;A.navOverride=nil;char.navChoice=nil;char.focusQuest=nil
    if char.paused then char.plan=nil;A.inspect=nil end
    if char.paused and A.current() then A.setGoal(A.current()) end
    A.reconcile()
end
local anchors={CENTER=true,TOP=true,BOTTOM=true,LEFT=true,RIGHT=true,TOPLEFT=true,TOPRIGHT=true,BOTTOMLEFT=true,BOTTOMRIGHT=true}
local defaultsLayout={hub={'CENTER',0,80},arrow={'CENTER',0,210},tracker={'RIGHT',-24,0}}
function A.savePosition(frame,key)
    local point,relative,relativePoint,x,y=A.safe(frame.GetPoint,frame,1)
    if not anchors[point] or not anchors[relativePoint] or not A.finite(x) or not A.finite(y) or math.abs(x)>10000 or math.abs(y)>10000 then return end
    A.state().layout[key]={point=point,relativePoint=relativePoint,x=x,y=y}
end
function A.loadPosition(frame,key)
    local char=A.state();if not frame or not char or frame.layoutOwner==char then return end
    local p=char.layout[key];local fallback=defaultsLayout[key]
    frame:ClearAllPoints()
    if A.table(p) and anchors[p.point] and anchors[p.relativePoint] and A.finite(p.x) and A.finite(p.y) and math.abs(p.x)<=10000 and math.abs(p.y)<=10000 then
        frame:SetPoint(p.point,UIParent,p.relativePoint,p.x,p.y)
    else frame:SetPoint(fallback[1],UIParent,fallback[1],fallback[2],fallback[3]) end
    frame.layoutOwner=char
end
function A.resetPositions()
    A.state().layout={}
    for _,entry in ipairs({{A.frame,'hub'},{A.arrow,'arrow'},{A.tracker,'tracker'}}) do
        entry[1].layoutOwner=nil;A.loadPosition(entry[1],entry[2])
    end
end
function A.viewDungeon()
    return A.findDungeon(A.inspect or A.state().plan) or (A.action and A.action.dungeon) or A.catalog[1]
end
function A.guide(kind,d,q)
    A.state().paused=false
    local title=q and q.name;if not title and q then for _,item in ipairs(d.quests)do if item.id==q.id then title=item.name end end end
    A.navOverride={kind=kind,dungeon=d.key,id=q and q.id,title=title};if q then A.state().focusQuest=q.id end
    A.state().navChoice=A.navOverride
    A.reconcile()
end
function A.numberSafeSuccess(id,success)
    id=A.num(id);if not id or not A.plain(success) or success~=1 then return end
    local s=A.current();if not s or not s.inside or not A.allowed(s) then return end
    local d=A.instanceDungeon(s);if not d then return end
    local known=false;for _,b in ipairs((A.overviews[d.key] or {}).encounters or {}) do for _,alias in ipairs(b.ids or {b.id}) do if alias==id then known=true end end end
    if known then A.state().encounters[d.key]=A.state().encounters[d.key] or {};A.state().encounters[d.key][id]=true end
end
function A.bossObserved(d,b)
    local saved=A.state().encounters[d.key] or {};for _,id in ipairs(b.ids or {b.id}) do if saved[id] then return true end end;return false
end
function A.questRows(d)
    local rows={};local s=A.current();if not s then return rows end
    for _,q in ipairs(d.quests) do if A.questAllowed(q,s) then local state,live=A.questState(q,s);rows[#rows+1]={q=q,state=state,live=live,points=A.routes[q.id] or {}} end end
    return rows
end
