local _, A = ...
local defaults={arrow=true,tracker=true,alerts=true,nativeTracking=false,scale=1,arrival=15,units="m",lockArrow=false}
function A.initOptions(char)
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
    A.state().plan=key;A.state().focusQuest=nil;A.inspect=key;A.navOverride=nil;A.reconcile();return true
end
function A.viewDungeon()
    return A.findDungeon(A.inspect or A.state().plan) or (A.action and A.action.dungeon) or A.catalog[1]
end
function A.guide(kind,d,q)
    local title=q and q.name;if not title and q then for _,item in ipairs(d.quests)do if item.id==q.id then title=item.name end end end
    A.navOverride={kind=kind,dungeon=d.key,id=q and q.id,title=title};if q then A.state().focusQuest=q.id end
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
