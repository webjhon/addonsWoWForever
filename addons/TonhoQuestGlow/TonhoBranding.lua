-- Tonho Contrabando: opening credits.
-- Each addon receives its OWN namespace: multiple addons do not share global state.
local addonName, ns = ...
if type(ns) ~= "table" then return end
local B = {}
ns.TonhoBranding = B
local alreadyShown = false
local dialog
local registered = {}

local function createDialog()
    if dialog then return dialog end
    local f = CreateFrame("Frame", nil, UIParent)
    f:SetSize(430, 265)
    f:SetPoint("CENTER", UIParent, "CENTER", 0, 50)
    f:SetFrameStrata("FULLSCREEN_DIALOG")
    f:SetFrameLevel(400)
    f:EnableMouse(true)
    local bg = f:CreateTexture(nil, "BACKGROUND")
    bg:SetAllPoints()
    bg:SetColorTexture(0.028, 0.052, 0.078, 0.985)
    local stripe = f:CreateTexture(nil, "ARTWORK")
    stripe:SetPoint("TOPLEFT", 0, 0)
    stripe:SetPoint("TOPRIGHT", 0, 0)
    stripe:SetHeight(4)
    stripe:SetColorTexture(0.89, 0.67, 0.26, 1)
    local hunter = f:CreateTexture(nil, "ARTWORK")
    hunter:SetSize(176, 176)
    hunter:SetPoint("LEFT", 21, 18)
    hunter:SetTexture("Interface\\AddOns\\" .. addonName .. "\\assets\\TonhoHunter.tga")
    local function text(value, point, x, y, font, color)
        local t = f:CreateFontString(nil, "OVERLAY", font)
        t:SetPoint(point, f, point, x, y)
        t:SetText(value)
        t:SetTextColor(color[1], color[2], color[3])
        return t
    end
    text("CRÉDITOS A", "TOPLEFT", 218, -43, "GameFontNormalSmall", {0.78, 0.86, 0.93})
    text("Tonho", "TOPLEFT", 215, -68, "GameFontNormalHuge", {0.95, 0.78, 0.38})
    text("Contrabando", "TOPLEFT", 215, -103, "GameFontNormalLarge", {0.95, 0.78, 0.38})
    text("WoW Forever | Alliance e Horde", "TOPLEFT", 215, -148, "GameFontNormalSmall", {0.75, 0.83, 0.89})
    local ok = CreateFrame("Button", nil, f)
    ok:SetSize(156, 34)
    ok:SetPoint("BOTTOMRIGHT", f, "BOTTOMRIGHT", -24, 21)
    local tile = ok:CreateTexture(nil, "BACKGROUND")
    tile:SetAllPoints()
    tile:SetColorTexture(0.13, 0.31, 0.34, 1)
    local label = ok:CreateFontString(nil, "OVERLAY", "GameFontNormal")
    label:SetPoint("CENTER")
    label:SetText("CONTINUAR")
    ok:SetScript("OnClick", function() f:Hide() end)
    dialog = f
    f:Hide()
    return f
end

function B:Show()
    if alreadyShown then return end
    if InCombatLockdown and InCombatLockdown() then return end
    alreadyShown = true
    createDialog():Show()
end

-- REQUIRED INTEGRATION: call ns.TonhoBranding:RegisterWindow(mainFrame)
-- immediately after creating the addon's primary frame. The splash appears
-- on the FIRST OPEN of that addon in each login session (not every login).
function B:RegisterWindow(frame)
    if not frame or registered[frame] then return end
    registered[frame] = true
    if type(frame.HookScript) == "function" then
        frame:HookScript("OnShow", function() self:Show() end)
    end
    if type(frame.IsShown) == "function" and frame:IsShown() then self:Show() end
end
