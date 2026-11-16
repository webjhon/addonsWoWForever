local _, ns = ...
local defaults={enabled=true,pulse=true,sound=false,banner=true,plates=true,scale=1,offset=10}
function ns.ApplyPlateSetting()
    if not ns.settings then return end
    if ns.Read(function() return InCombatLockdown() end) ~= false then return end
    local current=ns.Read(function() return C_CVar.GetCVar('nameplateShowEnemies') end)
    local want=ns.settings.enabled and ns.settings.plates and ns.Context()
    if want and current=='0' and not ns.plateLease then
        local ok=pcall(function() C_CVar.SetCVar('nameplateShowEnemies','1') end)
        if ok and ns.Read(function() return C_CVar.GetCVar('nameplateShowEnemies') end)=='1' then ns.plateLease='0' end
    elseif not want and ns.plateLease then
        if current=='1' then pcall(function() C_CVar.SetCVar('nameplateShowEnemies',ns.plateLease) end) end
        ns.plateLease=nil
    end
end
function ns.Login()
    ns.removed={}
    local guid=ns.Read(function() return UnitGUID('player') end)
    if not ns.IsText(guid) then return end
    if type(AURANPCDB)~='table' then AURANPCDB={} end
    if type(AURANPCDB.characters)~='table' then AURANPCDB.characters={} end
    local settings=AURANPCDB.characters[guid]
    if type(settings)~='table' then settings={};AURANPCDB.characters[guid]=settings end
    for key,value in pairs(defaults) do if type(settings[key])~=type(value) then settings[key]=value end end
    settings.scale=math.min(1.7,math.max(.65,settings.scale));settings.offset=math.min(90,math.max(0,settings.offset))
    ns.settings=settings
    if not ns.window then ns.CreateUI() end
    ns.ApplyPlateSetting();ns.ScanQuests();ns.Discover();ns.Reconcile()
    if ns.ticker then ns.ticker:Cancel() end
    ns.ticker=C_Timer.NewTicker(.75,function() ns.Discover();ns.Reconcile() end)
    if not settings.opened then settings.opened=true;ns.window:Show() end
end
ns.events=CreateFrame('Frame')
local events={'PLAYER_LOGIN','PLAYER_ENTERING_WORLD','PLAYER_LEVEL_UP','QUEST_ACCEPTED','QUEST_LOG_UPDATE','QUEST_WATCH_UPDATE','QUEST_REMOVED','QUEST_TURNED_IN','NAME_PLATE_UNIT_ADDED','NAME_PLATE_UNIT_REMOVED','PLAYER_REGEN_ENABLED','CVAR_UPDATE','PLAYER_LOGOUT'}
for _,event in ipairs(events) do ns.events:RegisterEvent(event) end
ns.events:SetScript('OnEvent',function(_,event,...)
    if event=='PLAYER_LOGIN' then ns.Login();return end
    if not ns.settings then return end
    if event=='PLAYER_LOGOUT' then
        if ns.ticker then ns.ticker:Cancel();ns.ticker=nil end
        if ns.plateLease and ns.Read(function() return InCombatLockdown() end)==false then
            if ns.Read(function() return C_CVar.GetCVar('nameplateShowEnemies') end)=='1' then pcall(function() C_CVar.SetCVar('nameplateShowEnemies',ns.plateLease) end) end
        end
        return
    elseif event=='NAME_PLATE_UNIT_REMOVED' then ns.Drop(...);ns.Schedule(false);return
    elseif event=='NAME_PLATE_UNIT_ADDED' then ns.Add(...);ns.Schedule(false);return
    elseif event=='QUEST_TURNED_IN' or event=='QUEST_REMOVED' then
        local id=...
        if ns.IsNumber(id) then
            ns.removed[id]=true
            ns.quests[id]=nil
            for unit,marker in pairs(ns.markers) do ns.Release(marker);ns.markers[unit]=nil end
        end
        ns.Schedule(true);return
    elseif event=='QUEST_ACCEPTED' then
        -- Versioned Forever documentation: questId (one argument).
        local id=...
        if ns.IsNumber(id) then ns.removed[id]=nil end
        ns.Schedule(true);return
    elseif event=='CVAR_UPDATE' then
        -- Respect external plate changes; do not fight other addons/user settings.
        ns.Schedule(false);return
    end
    ns.ApplyPlateSetting();ns.Schedule(true)
end)
SLASH_AURANPC1='/auranpc'
SlashCmdList.AURANPC=function(input)
    if not ns.settings then ns.Login() end
    if not ns.settings then print('AURANPC: personagem indisponível.');return end
    if input=='test' then ns.Demo()
    elseif input=='status' then ns.UpdateStatus();print('AURANPC: '..ns.status:GetText())
    elseif ns.window:IsShown() then ns.window:Hide() else ns.window:Show() end
end
