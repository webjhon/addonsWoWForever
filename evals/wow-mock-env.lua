-- Minimal headless API subset. This mock cannot establish WoW Forever compatibility.
_G.UIParent = {}
_G.SlashCmdList = {}
_G.UnitFactionGroup = function() return "Alliance" end
_G.UnitLevel = function() return 20 end
_G.UnitXP = function() return 3500 end
_G.UnitXPMax = function() return 10000 end
_G.GetBuildInfo = function() return "1.60.1", "TEST_BUILD", "", 16001 end
local function noop() end
_G.CreateFrame = function()
    local scripts, events = {}, {}
    local ui = {SetSize=noop,SetPoint=noop,SetMinMaxValues=noop,SetValue=noop,SetStatusBarTexture=noop,SetStatusBarColor=noop,SetMovable=noop,EnableMouse=noop,RegisterForDrag=noop,StartMoving=noop,StopMovingOrSizing=noop,Show=noop,Hide=noop,RegisterEvent=function(_,e)events[e]=true end,SetScript=function(_,e,fn)scripts[e]=fn end}
    ui.CreateTexture=function()return{SetAllPoints=noop,SetColorTexture=noop,SetTexture=noop,SetPoint=noop,SetSize=noop}end
    ui.CreateFontString=function()return{SetPoint=noop,SetText=noop}end
    ui._Trigger=function(self,event) if events[event] and scripts.OnEvent then scripts.OnEvent(self,event) end end
    return ui
end
if arg and arg[1] then
    local chunk=assert(loadfile(arg[1]));chunk("AllianceLevelPulse",{})
    assert(type(SlashCmdList.ALLIANCELEVELPULSE)=="function","Missing slash command")
    SlashCmdList.ALLIANCELEVELPULSE("hide")
    SlashCmdList.ALLIANCELEVELPULSE("show")
    print("MOCK_PASSED (not CLIENT_VERIFIED)")
end
