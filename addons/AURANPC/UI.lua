local _, ns = ...
local A=ns
local f=CreateFrame("Frame","AURANPCFrame",UIParent)
f:Hide()
ns.TonhoBranding:RegisterWindow(f)
A.frame=f
f:SetSize(420,330);f:SetPoint("CENTER",UIParent,"CENTER",0,0);f:SetClampedToScreen(true)
f:EnableMouse(true);f:SetMovable(true);f:RegisterForDrag("LeftButton");f:SetFrameStrata("DIALOG")
f:SetScript("OnDragStart",function() if not InCombatLockdown() then f:StartMoving() end end)
f:SetScript("OnDragStop",function() f:StopMovingOrSizing() end)
local bg=f:CreateTexture(nil,"BACKGROUND");bg:SetAllPoints();bg:SetColorTexture(.025,.04,.055,.98)
local edge=f:CreateTexture(nil,"ARTWORK");edge:SetPoint("TOPLEFT",f,"TOPLEFT",0,0);edge:SetSize(420,3);edge:SetColorTexture(1,.78,.19,1)
local function text(x,y,w,h,size,color)
 local t=f:CreateFontString(nil,"OVERLAY");t:SetPoint("TOPLEFT",f,"TOPLEFT",x,-y);t:SetSize(w,h);t:SetFont(STANDARD_TEXT_FONT or "Fonts\\FRIZQT__.TTF",size,"");t:SetJustifyH("LEFT");t:SetJustifyV("TOP");t:SetTextColor(unpack(color));return t
end
local icon=f:CreateTexture(nil,"ARTWORK");icon:SetSize(42,42);icon:SetPoint("TOPLEFT",f,"TOPLEFT",18,-19);icon:SetTexture("Interface\\AddOns\\AURANPC\\assets\\Icon.tga")
text(74,20,300,25,20,{1,.81,.28}):SetText("AURANPC")
text(75,48,310,20,10,{.6,.7,.76}):SetText("QUEST EM DESTAQUE • TONHO CONTRABANDO")
local status=text(20,90,380,48,18,{.92,.95,.96})
local detail=text(20,147,380,89,12,{.78,.84,.88})
local place=text(20,242,380,24,10,{.55,.67,.73})
local function button(caption,x,width,fn)
 local b=CreateFrame("Button",nil,f);b:SetSize(width,30);b:SetPoint("TOPLEFT",f,"TOPLEFT",x,-282)
 local bg=b:CreateTexture(nil,"BACKGROUND");bg:SetAllPoints();bg:SetColorTexture(.16,.14,.065,1)
 local t=b:CreateFontString(nil,"OVERLAY");t:SetPoint("CENTER",b,"CENTER",0,0);t:SetFont(STANDARD_TEXT_FONT or "Fonts\\FRIZQT__.TTF",11,"");t:SetTextColor(1,.85,.4);t:SetText(caption);b:SetScript("OnClick",fn)
end
button("REATIVAR",20,112,function() A.setEnabled(true) end)
button("PAUSAR",145,112,function() A.setEnabled(false) end)
button("FECHAR",270,130,function() f:Hide() end)
function A.render()
 local s=A.status;if not s then return end
 status:SetText(s.title);detail:SetText(s.detail)
 place:SetText(A.context and ((A.context.kind=="party" and "DUNGEON" or "MUNDO").." • "..A.context.zone) or "Aguardando dados do personagem")
end
