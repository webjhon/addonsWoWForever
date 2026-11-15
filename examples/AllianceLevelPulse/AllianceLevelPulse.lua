-- WoW Forever Alliance leveling demonstration. API use needs live client confirmation.
local addonName, ns = ...
local frame = CreateFrame("Frame", "AllianceLevelPulseFrame", UIParent)
frame:SetSize(270, 74)
frame:SetPoint("CENTER", UIParent, "CENTER", 0, -205)
frame:SetMovable(true)
frame:EnableMouse(true)
frame:RegisterForDrag("LeftButton")
frame:SetScript("OnDragStart", function(self) self:StartMoving() end)
frame:SetScript("OnDragStop", function(self) self:StopMovingOrSizing() end)
local bg = frame:CreateTexture(nil, "BACKGROUND")
bg:SetAllPoints()
bg:SetColorTexture(0.055, 0.09, 0.14, 0.94)
local icon = frame:CreateTexture(nil, "ARTWORK")
icon:SetTexture("Interface\\AddOns\\AllianceLevelPulse\\assets\\Icon.tga")
icon:SetSize(35, 35)
icon:SetPoint("LEFT", frame, "LEFT", 12, 0)
local text = frame:CreateFontString(nil, "OVERLAY", "GameFontNormal")
text:SetPoint("TOPLEFT", icon, "TOPRIGHT", 10, -1)
local bar = CreateFrame("StatusBar", nil, frame)
bar:SetPoint("TOPLEFT", icon, "BOTTOMRIGHT", 10, 15)
bar:SetSize(186, 10)
bar:SetStatusBarTexture("Interface\\TargetingFrame\\UI-StatusBar")
bar:SetStatusBarColor(0.18, 0.65, 0.86, 1)
bar:SetMinMaxValues(0, 100)

local function update()
    if UnitFactionGroup("player") ~= "Alliance" then frame:Hide(); return end
    local level = UnitLevel("player") or 1
    if level < 1 or level > 60 then frame:Hide(); return end
    if AllianceLevelPulseDB and AllianceLevelPulseDB.hidden then frame:Hide(); return end
    frame:Show()
    if level == 60 then text:SetText("Alliance  |  Level 60 reached"); bar:SetValue(100); return end
    local xp = UnitXP("player") or 0
    local maxXP = UnitXPMax("player") or 0
    local pct = maxXP > 0 and math.floor(xp * 100 / maxXP) or 0
    text:SetText(string.format("Alliance  |  Lv %d  |  XP %d%%", level, pct))
    bar:SetValue(pct)
end
frame:RegisterEvent("PLAYER_ENTERING_WORLD")
frame:RegisterEvent("PLAYER_XP_UPDATE")
frame:RegisterEvent("PLAYER_LEVEL_UP")
frame:SetScript("OnEvent", function() update() end)
SLASH_ALLIANCELEVELPULSE1 = "/alp"
SlashCmdList["ALLIANCELEVELPULSE"] = function(msg)
    AllianceLevelPulseDB = AllianceLevelPulseDB or {}
    if msg == "hide" then AllianceLevelPulseDB.hidden = true
    elseif msg == "show" then AllianceLevelPulseDB.hidden = false
    else print("Alliance Level Pulse: /alp show | /alp hide") end
    update()
end
update()
