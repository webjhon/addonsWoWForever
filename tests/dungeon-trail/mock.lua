-- Minimal deterministic harness. This is NOT a WoW client or security model.
unpack=table.unpack
TEST={level=17,xp=200,max=1000,faction="Alliance",guid="Player-Test-A",combat=false,journal={},complete={},log={},frames={},day="2026-11-15",build="69893"}
SlashCmdList={}
STANDARD_TEXT_FONT="Fonts\\FRIZQT__.TTF"
function print(s) table.insert(TEST.log,s) end
function UnitLevel() return TEST.level end
function UnitXP() return TEST.xp end
function UnitXPMax() return TEST.max end
function UnitFactionGroup() return TEST.faction end
function UnitGUID() return TEST.guid end
function UnitClass() return "Warrior","WARRIOR" end
function InCombatLockdown() return TEST.combat end
function GetBuildInfo() return "1.60.1",TEST.build,"",16001 end
function issecretvalue(v) return type(v)=="table" and v.secret==true end
function date() return TEST.day end
C_QuestLog={
 GetNumQuestLogEntries=function() return #TEST.journal end,
 GetInfo=function(i) return TEST.journal[i] end,
 GetQuestObjectives=function(id) return TEST.objectives or {{text="Test objective 0/1",finished=false}} end,
 IsComplete=function(id) return TEST.complete[id] or false end,
 IsQuestFlaggedCompleted=function(id) return TEST.turnedIn==id end,
}
local methods={}
local function frame(kind,name,parent)
 local f={kind=kind,name=name,parent=parent,scripts={},points={},width=0,height=0,shown=true}
 setmetatable(f,{__index=methods});table.insert(TEST.frames,f);return f
end
function methods:SetSize(w,h) self.width,self.height=w,h end
function methods:SetWidth(w) self.width=w end
function methods:SetHeight(h) self.height=h end
function methods:GetWidth() return self.width end
function methods:GetHeight() return self.height end
function methods:SetPoint(...) table.insert(self.points,{...}) end
function methods:ClearAllPoints() self.points={} end
function methods:GetPoint() local p=self.points[1];if p and #p==5 then return table.unpack(p)end;return "CENTER",UIParent,"CENTER",0,0 end
function methods:SetAllPoints() end
function methods:SetClampedToScreen() end
function methods:SetMovable() end
function methods:EnableMouse() end
function methods:RegisterForDrag() end
function methods:SetScript(k,v) self.scripts[k]=v end
function methods:RegisterEvent(e) self[e]=true end
function methods:StartMoving() self.moving=true end
function methods:StopMovingOrSizing() self.moving=false end
function methods:SetFrameStrata(value) self.strata=value end
function methods:Show() local changed=not self.shown;self.shown=true;if changed and self.scripts.OnShow then self.scripts.OnShow(self) end end
function methods:Hide() self.shown=false end
function methods:SetScale(s) self.scale=s end
function methods:CreateTexture() return frame("Texture",nil,self) end
function methods:CreateFontString() return frame("FontString",nil,self) end
function methods:SetColorTexture(...) self.color={...} end
function methods:SetTexture(t) self.texture=t end
function methods:SetJustifyH() end
function methods:SetJustifyV() end
function methods:SetFont(_,size) self.fontSize=size end
function methods:SetTextColor(...) self.color={...} end
function methods:SetText(t) self.text=t end
function methods:GetStringHeight()
 local lines=0;local size=self.fontSize or 12
 for line in ((self.text or "").."\n"):gmatch("(.-)\n") do lines=lines+math.max(1,math.ceil(#line*size*.5/math.max(1,self.width))) end
 return lines*(size+2)
end
function methods:SetStatusBarTexture() end
function methods:SetStatusBarColor() end
function methods:SetMinMaxValues() end
function methods:SetValue(v) assert(v==v);self.value=v end
function methods:SetScrollChild(c) self.scrollChild=c end
function methods:SetVerticalScroll(n) self.scroll=n end
UIParent=frame("Frame","UIParent"); UIParent:SetSize(1920,1080)
function CreateFrame(kind,name,parent) return frame(kind,name,parent or UIParent) end
DT={}
function fire(event,...) DT.events.scripts.OnEvent(DT.events,event,...);if not TEST.defer then flush() end end
function findDungeon(key) for i,d in ipairs(DT.catalog) do if d.key==key then return i end end end
function clickTab(name)
 for _,f in ipairs(TEST.frames) do if f.caption and f.caption.text==name and f.scripts.OnClick then f.scripts.OnClick(f);return end end
 error("Tab not found: "..name)
end

TEST.now=100000;TEST.kind='none';TEST.instance='';TEST.instanceID=0;TEST.map=1;TEST.mapName='Westfall';TEST.tracked=0
TEST.objectivesByID={};TEST.ready={};TEST.finished={};TEST.waypoints={};TEST.timers={};TEST.reads=0;TEST.trackCalls=0
function issecrettable(v) return type(v)=='table' and v.secretTable==true end
function UnitIsDeadOrGhost() return TEST.dead==true end
function GetServerTime() return TEST.now end
function GetRealZoneText() return TEST.mapName end
function GetZoneText() return TEST.mapName end
function GetInstanceInfo() return TEST.instance,TEST.kind,1,'Normal',5,0,false,TEST.instanceID end
function IsInInstance() return TEST.kind~='none',TEST.kind end
C_Timer={After=function(delay,fn) TEST.timers[#TEST.timers+1]=fn end}
function flush() local tries=0;while #TEST.timers>0 do local q=TEST.timers;TEST.timers={};for _,fn in ipairs(q) do fn() end;tries=tries+1;assert(tries<20,'timer feedback loop') end end
C_Map={GetBestMapForUnit=function()return TEST.map end,GetMapInfo=function(id)return {name=id==TEST.map and TEST.mapName or 'Map '..id} end}
C_QuestLog.GetNumQuestLogEntries=function() TEST.reads=TEST.reads+1;return #TEST.journal end
C_QuestLog.GetQuestObjectives=function(id)return TEST.objectivesByID[id] or {{text='Objetivo do cliente 0/1',finished=false,numFulfilled=0,numRequired=1}} end
C_QuestLog.IsComplete=function(id)return TEST.ready[id] or false end
C_QuestLog.IsFailed=function(id)return TEST.failed==id end
C_QuestLog.IsQuestFlaggedCompleted=function(id)return TEST.finished[id] or false end
C_QuestLog.GetNextWaypoint=function(id)local p=TEST.waypoints[id];if p then return p.map,p.x,p.y end end
C_QuestLog.GetNextWaypointForMap=function(id,map)local p=TEST.waypoints[id];if p and p.map==map then return p.x,p.y end end
C_QuestLog.GetNextWaypointText=function(id)return TEST.waypoints[id] and 'Destino ao vivo' end
C_SuperTrack={GetSuperTrackedQuestID=function()return TEST.tracked end,IsSuperTrackingAnything=function()return TEST.otherPin or TEST.tracked>0 end,
SetSuperTrackedQuestID=function(id)assert(not TEST.combat,'tracking in combat');TEST.trackCalls=TEST.trackCalls+1;TEST.tracked=id end}
function methods:IsShown() return self.shown end
function methods:SetFrameLevel() end
function methods:HookScript(k,fn)local old=self.scripts[k];self.scripts[k]=function(...)if old then old(...) end;fn(...) end end
function accept(id,title)TEST.journal[#TEST.journal+1]={questID=id,title=title or 'Título localizado',isHeader=false};fire('QUEST_ACCEPTED',id)end
function enter(key)local d=DT.catalog[findDungeon(key)];TEST.kind='party';TEST.instance=d.name;TEST.instanceID=d.instanceID;TEST.map=TEST.instanceID;TEST.mapName=d.name;fire('PLAYER_ENTERING_WORLD')end
function leave()TEST.kind='none';TEST.instance='';TEST.map=1;TEST.mapName='Westfall';fire('PLAYER_ENTERING_WORLD')end
function visibleText(fragment)for _,f in ipairs(TEST.frames)do if f.text and f.text:find(fragment,1,true)then return true end end;return false end
C_GossipInfo={GetAvailableQuests=function()return TEST.offers or {}end}

function methods:EnableMouseWheel()end
function methods:SetRotation(v)self.rotation=v end
function GetPlayerFacing()return TEST.facing or 0 end
function CreateVector2D(x,y)return {GetXY=function()return x,y end}end
C_Map.GetPlayerMapPosition=function(map,unit)if TEST.positionMissing then return nil end;return CreateVector2D(TEST.px or .5,TEST.py or .5)end
C_Map.GetWorldPosFromMapPos=function(map,point)local x,y=point:GetXY();return TEST.world or 0,CreateVector2D(-y*1000,-x*1000)end
C_Timer.NewTicker=function(interval,fn)local t={callback=fn};function t:Cancel()self.cancelled=true end;TEST.tickers=TEST.tickers or {};table.insert(TEST.tickers,t);return t end
