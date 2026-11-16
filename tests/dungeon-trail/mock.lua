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
function methods:GetPoint() return "CENTER",UIParent,"CENTER",0,0 end
function methods:SetAllPoints() end
function methods:SetClampedToScreen() end
function methods:SetMovable() end
function methods:EnableMouse() end
function methods:RegisterForDrag() end
function methods:SetScript(k,v) self.scripts[k]=v end
function methods:RegisterEvent(e) self[e]=true end
function methods:StartMoving() end
function methods:StopMovingOrSizing() end
function methods:SetFrameStrata() end
function methods:Show() self.shown=true end
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
function fire(event,...) DT.events.scripts.OnEvent(DT.events,event,...) end
function findDungeon(key) for i,d in ipairs(DT.catalog) do if d.key==key then return i end end end
function clickTab(name)
 for _,f in ipairs(TEST.frames) do if f.caption and f.caption.text==name and f.scripts.OnClick then f.scripts.OnClick(f);return end end
 error("Tab not found: "..name)
end
