-- Deterministic model; no real client frames, rendering or taint enforcement.
AURA={};TEST.npcs={};TEST.plates={};TEST.tooltips={};TEST.cvars={nameplateShowEnemies='1'};TEST.cvarWrites={};TEST.sounds=0
TEST.relations={}
C_QuestLog.UnitIsRelatedToActiveQuest=function(unit)return TEST.relations[unit] or false end
local methods=getmetatable(UIParent).__index
function methods:GetText() return self.text end
function methods:SetAllPoints(other)
    other=other or self.parent;self:SetSize(other.width,other.height);self:ClearAllPoints();self:SetPoint('CENTER',other,'CENTER',0,0)
end
function methods:IsForbidden() return self.forbidden or false end
function methods:CreateAnimationGroup()
    local g={playing=false}
    function g:CreateAnimation() return setmetatable({}, {__index=function()return function()end end}) end
    function g:SetLooping()end
    function g:Play()self.playing=true end
    function g:Stop()self.playing=false end
    function g:IsPlaying()return self.playing end
    return g
end
function fire(event,...) AURA.events.scripts.OnEvent(AURA.events,event,...);if not TEST.defer then flush() end end
function UnitGUID(unit) if unit=='player' then return TEST.guid end;local n=TEST.npcs[unit];return n and (n.guid or 'Creature-0-1-0-0-'..n.id..'-000001') end
function UnitName(unit) return TEST.npcs[unit] and TEST.npcs[unit].name end
function UnitIsDeadOrGhost(unit) return TEST.npcs[unit] and TEST.npcs[unit].dead or false end
function GetTime() return TEST.now end
C_CVar={GetCVar=function(key)return TEST.cvars[key]end,SetCVar=function(key,v)TEST.cvars[key]=v;table.insert(TEST.cvarWrites,{key,v})end}
C_NamePlate={GetNamePlateForUnit=function(unit)return TEST.plates[unit]end,GetNamePlates=function()local t={};for _,p in pairs(TEST.plates)do t[#t+1]=p end;return t end}
C_TooltipInfo={GetUnit=function(unit)return TEST.tooltips[unit]end}
Enum={TooltipDataLineType={QuestTitle=17}}
SOUNDKIT={RAID_WARNING=1}
function PlaySound() TEST.sounds=TEST.sounds+1 end
function SetRaidTarget()error('forbidden shared side effect')end
function SendChatMessage()error('forbidden shared side effect')end
function SendAddonMessage()error('forbidden shared side effect')end
function TargetUnit()error('forbidden automation')end
function accept(id,title,objectives)
    TEST.journal[#TEST.journal+1]={questID=id,title=title or 'Quest traduzida',isHeader=false}
    TEST.objectivesByID[id]=objectives or {{type='monster',text='Mate o alvo: 0/1',finished=false}}
    fire('QUEST_ACCEPTED',id)
end
function plate(unit,id,name)
    local p=CreateFrame('Frame',nil,UIParent);p.namePlateUnitToken=unit
    TEST.plates[unit]=p;TEST.npcs[unit]={id=id,name=name or 'Alvo'};fire('NAME_PLATE_UNIT_ADDED',unit);return p
end
function remove(unit)TEST.plates[unit]=nil;TEST.npcs[unit]=nil;fire('NAME_PLATE_UNIT_REMOVED',unit)end
function tick() AURA.ticker.callback();flush()end

function methods:IsVisible() if not self.shown then return false end;if self.parent then return self.parent:IsVisible() end;return true end
