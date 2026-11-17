local _, ns = ...
-- Own, mouse-transparent rendering; no loot, inventory or party actions.
ns.itemMarks, ns.itemButtons = {}, {}
ns.itemStats = {bags=0,loot=0,unknown=0,restricted=0}
ns.itemQuests, ns.itemTitles, ns.clearedLoot = {}, {}, {}
local MAX_BUTTONS=360
local function field(t,key)
    if type(t)=='table' and ns.Public(t) then
        local v=ns.Read(function() return t[key] end)
        return v
    end
end
local function usable(button)
    return button and ns.Public(button) and ns.Read(function() return button:IsForbidden() end)==false
        and ns.Read(function() return button:IsVisible() end)==true
end
local function method(button,name)
    return ns.Read(function() return button[name](button) end)
end
local function integer(n,low,high) return ns.IsNumber(n) and n==math.floor(n) and n>=low and n<=high end
local function active(id,kind)
    local q=ns.IsNumber(id) and ns.itemQuests[id]
    if not q or ns.removed[id] then return nil end
    if kind=='loot' and q.complete~=false then return nil end
    return q
end
function ns.ItemMatch(info,tooltip,kind)
    if not ns.questReadable then return nil,'unknown' end
    local id=field(info,'questID')
    -- A known starter for an unaccepted quest must never inherit a generic badge.
    if ns.IsNumber(id) and id>0 then return active(id,kind) end
    local lines=field(tooltip,'lines')
    if type(lines)=='table' then
        local titleType=Enum and Enum.TooltipDataLineType and Enum.TooltipDataLineType.QuestTitle
        for i,line in ipairs(lines) do
            if i>80 then break end
            if titleType and field(line,'type')==titleType then
                local title=field(line,'leftText')
                local quest=ns.IsText(title) and ns.itemTitles[title]
                local q=active(quest,kind)
                if q then return q end
            end
        end
    end
    -- Independent, public live flags: generic quest classification alone is insufficient.
    if field(info,'isQuestItem')==true and field(info,'isActive')==true then
        for quest in pairs(ns.itemQuests) do
            if active(quest,kind) then return {title='Item de quest ativa',generic=true} end
        end
    end
    return nil,'unknown'
end
local function hide(mark)
    if mark then pcall(function() mark:Hide();mark.pulse:Stop() end);mark.match=nil end
end
function ns.ClearItemMarks(kind)
    for _,mark in pairs(ns.itemMarks) do if not kind or mark.kind==kind then hide(mark) end end
end
local function rect(parent)
    local t=parent:CreateTexture(nil,'OVERLAY');t:SetColorTexture(1,.82,.02,1);return t
end
function ns.NewItemMark(button,kind)
    if (ns.itemCreated or 0)>=MAX_BUTTONS then return nil end
    local mark=CreateFrame('Frame',nil,button);mark:Hide();mark:SetAllPoints(button);mark:EnableMouse(false)
    local level=method(button,'GetFrameLevel');if ns.IsNumber(level) then mark:SetFrameLevel(level+5) end
    local strata=method(button,'GetFrameStrata');if ns.IsText(strata) then mark:SetFrameStrata(strata) end
    for _,edge in ipairs({'TOP','BOTTOM','LEFT','RIGHT'}) do
        local t=rect(mark)
        if edge=='TOP' or edge=='BOTTOM' then t:SetHeight(3);t:SetPoint(edge..'LEFT',mark,edge..'LEFT');t:SetPoint(edge..'RIGHT',mark,edge..'RIGHT')
        else t:SetWidth(3);t:SetPoint('TOP'..edge,mark,'TOP'..edge);t:SetPoint('BOTTOM'..edge,mark,'BOTTOM'..edge) end
    end
    local badge=mark:CreateTexture(nil,'OVERLAY');badge:SetColorTexture(.03,.02,0,.95);badge:SetSize(20,24);badge:SetPoint('TOPLEFT',mark,'TOPLEFT',1,-1)
    local bang=mark:CreateFontString(nil,'OVERLAY');bang:SetFont('Fonts\\FRIZQT__.TTF',23,'OUTLINE');bang:SetTextColor(1,.9,.05);bang:SetPoint('CENTER',badge,'CENTER');bang:SetText('!')
    mark.glow=rect(mark);mark.glow:SetAllPoints(mark);mark.glow:SetColorTexture(1,.8,0,.17)
    local pulse=mark.glow:CreateAnimationGroup()
    for order,values in ipairs({{.15,1},{1,.15}}) do
        local a=pulse:CreateAnimation('Alpha');a:SetFromAlpha(values[1]);a:SetToAlpha(values[2]);a:SetDuration(.55);a:SetOrder(order)
    end
    pulse:SetLooping('REPEAT');mark.pulse=pulse;mark.kind=kind;mark:Hide()
    ns.itemCreated=(ns.itemCreated or 0)+1;ns.itemMarks[button]=mark
    return mark
end
function ns.TrackBagButton(button)
    if not usable(button) then return end
    if not ns.itemButtons[button] then
        local count=0;for _ in pairs(ns.itemButtons) do count=count+1 end
        if count>=MAX_BUTTONS then return end
        ns.itemButtons[button]=true
    end
end
function ns.ScheduleItems()
    if ns.itemPending then return end
    ns.itemPending=true;C_Timer.After(.06,function() ns.itemPending=false;ns.RefreshItems() end)
end
function ns.InstallItemHooks()
    if type(hooksecurefunc)~='function' then return end
    if not ns.bagHooked and ContainerFrameItemButtonMixin and type(ContainerFrameItemButtonMixin.UpdateQuestItem)=='function' then
        hooksecurefunc(ContainerFrameItemButtonMixin,'UpdateQuestItem',function(button)
            hide(ns.itemMarks[button]);ns.TrackBagButton(button);ns.ScheduleItems()
        end);ns.bagHooked=true
    end
    if not ns.lootHooked and LootFrameElementMixin and type(LootFrameElementMixin.Init)=='function' then
        hooksecurefunc(LootFrameElementMixin,'Init',function(button)
            hide(ns.itemMarks[button]);ns.ScheduleItems()
        end);ns.lootHooked=true
    end
end
local function discoverBags()
    if type(ContainerFrameUtil_EnumerateContainerFrames)~='function' then return end
    pcall(function()
        local count=0
        for _,container in ContainerFrameUtil_EnumerateContainerFrames() do
            if usable(container) then
                for _,button in container:EnumerateValidItems() do
                    count=count+1;if count>MAX_BUTTONS then return end
                    ns.TrackBagButton(button)
                end
            end
        end
    end)
end
local function show(button,kind,match)
    local mark=ns.itemMarks[button] or ns.NewItemMark(button,kind)
    if not mark then return end
    mark.kind=kind;mark.match=match;mark.epoch=ns.itemEpoch;mark:Show()
    if kind=='loot' and ns.settings.itemPulse then mark.glow:Show();if not mark.pulse:IsPlaying() then mark.pulse:Play() end
    else mark.pulse:Stop();mark.glow:Hide() end
    ns.itemStats[kind]=ns.itemStats[kind]+1
end
local function safeShow(button,kind,match)
    local ok=pcall(show,button,kind,match)
    if not ok then hide(ns.itemMarks[button]);ns.itemStats.restricted=ns.itemStats.restricted+1 end
end
function ns.RefreshItems()
    ns.itemEpoch=(ns.itemEpoch or 0)+1;ns.itemStats={bags=0,loot=0,unknown=0,restricted=0}
    if not ns.settings or not ns.settings.enabled or not ns.Context() then ns.ClearItemMarks();return end
    ns.InstallItemHooks();discoverBags()
    if ns.settings.bagItems then
        for button in pairs(ns.itemButtons) do
            if usable(button) then
                local bag,slot=method(button,'GetBagID'),method(button,'GetID')
                if integer(bag,0,5) and integer(slot,1,200) then
                    local item=ns.Read(function() return C_Container.GetContainerItemInfo(bag,slot) end)
                    if type(item)=='table' then
                        local info=ns.Read(function() return C_Container.GetContainerItemQuestInfo(bag,slot) end)
                        local tip=ns.Read(function() return C_TooltipInfo.GetBagItem(bag,slot) end)
                        local match=ns.ItemMatch(info,tip,'bags')
                        if match then safeShow(button,'bags',match) else ns.itemStats.unknown=ns.itemStats.unknown+1 end
                    end
                end
            end
        end
    end
    if ns.settings.lootItems and ns.lootOpen and usable(LootFrame) then
        pcall(function()
            local count=0
            for button in LootFrame.ScrollBox:EnumerateFrames() do
                count=count+1;if count>80 then break end
                if usable(button) then
                    local slot=method(button,'GetSlotIndex')
                    if integer(slot,1,200) and not ns.clearedLoot[slot] then
                        local info=ns.Read(function()
                            local _,_,_,_,_,_,isQuestItem,questID,isActive=GetLootSlotInfo(slot)
                            return {isQuestItem=isQuestItem,questID=questID,isActive=isActive}
                        end)
                        local link=ns.Read(function() return GetLootSlotLink(slot) end)
                        if ns.IsText(link) and link:find('item:',1,true) then
                            local tip=ns.Read(function() return C_TooltipInfo.GetLootItem(slot) end)
                            local match=ns.ItemMatch(info,tip,'loot')
                            if match then safeShow(button,'loot',match) else ns.itemStats.unknown=ns.itemStats.unknown+1 end
                        end
                    end
                end
            end
        end)
    end
    for _,mark in pairs(ns.itemMarks) do if mark.epoch~=ns.itemEpoch then hide(mark) end end
end
function ns.ItemEvent(event,...)
    if event~='PLAYER_LOGOUT' and event~='ADDON_LOADED' and event~='ITEM_DATA_LOAD_RESULT'
        and not event:match('^LOOT_') and not event:match('^BAG_') then return end
    if event=='LOOT_OPENED' then ns.lootOpen=true;ns.clearedLoot={}
    elseif event=='LOOT_CLOSED' then ns.lootOpen=false;ns.ClearItemMarks('loot')
    elseif event=='LOOT_SLOT_CLEARED' then local slot=...;if ns.IsNumber(slot) then ns.clearedLoot[slot]=true end;ns.ClearItemMarks('loot')
    elseif event=='LOOT_SLOT_CHANGED' then local slot=...;if ns.IsNumber(slot) then ns.clearedLoot[slot]=nil end
    elseif event=='PLAYER_LOGOUT' then ns.ClearItemMarks();return end
    ns.ScheduleItems()
end
