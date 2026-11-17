local _, ns = ...
local FONT='Fonts\\FRIZQT__.TTF'
local function label(parent,size,r,g,b)
    local t=parent:CreateFontString(nil,'OVERLAY');t:SetFont(FONT,size,'OUTLINE');t:SetTextColor(r,g,b);return t
end
local function rect(parent,w,h,x,y,r,g,b,a)
    local t=parent:CreateTexture(nil,'ARTWORK');t:SetColorTexture(r,g,b,a or 1);t:SetSize(w,h);t:SetPoint('CENTER',parent,'CENTER',x,y);return t
end
function ns.NewMarker()
    local f=CreateFrame('Frame',nil,UIParent);f:SetSize(244,86);f:SetFrameStrata('HIGH');f:EnableMouse(false);f:Hide()
    rect(f,244,62,0,12,.025,.025,.02,.94)
    -- Solid yellow silhouette remains visible throughout the animation.
    for _, p in ipairs({{244,5,0,43},{244,5,0,-19},{5,62,-120,12},{5,62,120,12}}) do rect(f,p[1],p[2],p[3],p[4],1,.83,0) end
    f.glow=CreateFrame('Frame',nil,f);f.glow:SetAllPoints(f)
    for _, p in ipairs({{256,3,0,49},{256,3,0,-25},{3,76,-127,12},{3,76,127,12}}) do rect(f.glow,p[1],p[2],p[3],p[4],1,1,.3,.9) end
    local group=f.glow:CreateAnimationGroup()
    local fade=group:CreateAnimation('Alpha');fade:SetFromAlpha(.15);fade:SetToAlpha(1);fade:SetDuration(.55);fade:SetOrder(1)
    local back=group:CreateAnimation('Alpha');back:SetFromAlpha(1);back:SetToAlpha(.15);back:SetDuration(.55);back:SetOrder(2)
    group:SetLooping('REPEAT');f.pulse=group
    local badge=label(f,48,1,.87,.1);badge:SetPoint('LEFT',f,'LEFT',7,12);badge:SetText('!')
    f.name=label(f,14,1,1,.82);f.name:SetSize(194,20);f.name:SetJustifyH('LEFT');f.name:SetPoint('TOPLEFT',f,'TOPLEFT',40,-7)
    f.quest=label(f,11,1,.87,.2);f.quest:SetSize(194,20);f.quest:SetJustifyH('LEFT');f.quest:SetPoint('TOPLEFT',f,'TOPLEFT',40,-27)
    f.action=label(f,10,.82,.88,.92);f.action:SetSize(194,18);f.action:SetJustifyH('LEFT');f.action:SetPoint('TOPLEFT',f,'TOPLEFT',40,-44)
    local arrow=label(f,32,1,.9,0);arrow:SetText('v');arrow:SetPoint('TOP',f,'BOTTOM',0,24)
    return f
end
function ns.Acquire()
    if #ns.pool>0 then return table.remove(ns.pool) end
    ns.created=(ns.created or 0)+1
    if ns.created>40 then ns.created=40;return nil end
    return ns.NewMarker()
end
function ns.Release(f)
    f.pulse:Stop();f:Hide();f:ClearAllPoints();f.bound=nil
    ns.pool[#ns.pool+1]=f
end
function ns.Draw(f,plate,name,match)
    f:ClearAllPoints();f:SetPoint('BOTTOM',plate,'TOP',0,ns.settings.offset)
    f:SetScale(ns.settings.scale);f.name:SetText(name);f.quest:SetText(match.title)
    f.action:SetText(match.loot and 'SAQUE • objetivo pendente' or 'QUEST • '..match.objective)
    f.bound=plate
    if ns.settings.pulse then if not f.pulse:IsPlaying() then f.pulse:Play() end else f.pulse:Stop();f.glow:Hide() end
    if ns.settings.pulse then f.glow:Show() end
    f:Show()
end
function ns.CreateUI()
    local frame=CreateFrame('Frame','AURANPCSettings',UIParent);frame:Hide()
    ns.TonhoBranding:RegisterWindow(frame)
    ns.window=frame;frame:SetSize(560,580);frame:SetPoint('CENTER');frame:SetFrameStrata('DIALOG');frame:SetClampedToScreen(true)
    frame:SetMovable(true);frame:EnableMouse(true);frame:RegisterForDrag('LeftButton')
    frame:SetScript('OnDragStart',frame.StartMoving);frame:SetScript('OnDragStop',frame.StopMovingOrSizing)
    rect(frame,560,580,0,0,.025,.045,.065,.98);rect(frame,560,4,0,288,1,.83,0)
    local icon=frame:CreateTexture(nil,'ARTWORK');icon:SetTexture('Interface\\AddOns\\AURANPC\\assets\\Icon.tga');icon:SetSize(40,40);icon:SetPoint('TOPLEFT',20,-17)
    local title=label(frame,26,1,.86,.1);title:SetPoint('TOPLEFT',70,-22);title:SetText('AURANPC')
    local sub=label(frame,12,.8,.85,.9);sub:SetPoint('TOPLEFT',22,-57);sub:SetText('SEU OLHAR DE QUEST  /  Tonho Contrabando')
    local function button(caption,x,y,w,fn)
        local b=CreateFrame('Button',nil,frame);b:SetSize(w,31);b:SetPoint('TOPLEFT',x,y)
        rect(b,w,31,0,0,.12,.17,.21,1);local t=label(b,12,1,.91,.55);t:SetPoint('CENTER');t:SetText(caption)
        b:SetScript('OnClick',fn);return t
    end
    button('FECHAR',440,-20,98,function() frame:Hide() end)
    ns.status=label(frame,12,.87,.92,.95);ns.status:SetSize(512,90);ns.status:SetJustifyH('LEFT');ns.status:SetPoint('TOPLEFT',24,-94)
    ns.toggles={}
    for i, row in ipairs({{'enabled','Destaques'}, {'pulse','Pulso luminoso'}, {'sound','Som privado'}, {'banner','Faixa de alerta'}, {'plates','Auxílio de placas inimigas'}, {'lootItems','Itens no loot'}, {'bagItems','Selos nas bolsas'}, {'itemPulse','Pulso dos itens no loot'}}) do
        local key,caption=row[1],row[2]
        ns.toggles[key]={caption=caption,text=button(caption,24,-185-(i-1)*35,270,function()
            ns.settings[key]=not ns.settings[key];ns.ApplyPlateSetting();ns.Reconcile()
        end)}
    end
    button('ESCALA −',312,-185,104,function() ns.settings.scale=math.max(.65,ns.settings.scale-.15);ns.Reconcile() end)
    button('ESCALA +',428,-185,104,function() ns.settings.scale=math.min(1.7,ns.settings.scale+.15);ns.Reconcile() end)
    button('SUBIR',312,-225,104,function() ns.settings.offset=math.min(90,ns.settings.offset+10);ns.Reconcile() end)
    button('DESCER',428,-225,104,function() ns.settings.offset=math.max(0,ns.settings.offset-10);ns.Reconcile() end)
    button('DEMONSTRAR',312,-275,220,function() ns.Demo() end)
    local note=label(frame,11,.69,.75,.81);note:SetSize(510,88);note:SetJustifyH('LEFT');note:SetPoint('TOPLEFT',24,-479)
    note:SetText('Marcadores desenhados pelo AURANPC, individuais ao jogador.\nDependem de placas acessíveis e do alcance do jogo. Sem aura 3D.\nDemonstração não confirma detecção real. /auranpc status\nLoot/bolsas: interface padrão Forever; compatibilidade com outras UIs pendente.')
    ns.hud=CreateFrame('Frame',nil,UIParent);ns.hud:SetSize(520,64);ns.hud:SetPoint('TOP',UIParent,'TOP',0,-130);ns.hud:SetFrameStrata('HIGH');ns.hud:EnableMouse(false);ns.hud:Hide()
    rect(ns.hud,520,64,0,0,.025,.025,.015,.94);rect(ns.hud,520,4,0,30,1,.83,0)
    ns.hudText=label(ns.hud,16,1,.88,.1);ns.hudText:SetSize(500,54);ns.hudText:SetPoint('CENTER')
end
function ns.Demo()
    if not ns.demo then
        ns.demoPlate=CreateFrame('Frame',nil,UIParent);ns.demoPlate:SetSize(220,18);ns.demoPlate:SetPoint('CENTER',UIParent,'CENTER',0,-160)
        ns.demo=ns.NewMarker()
    end
    ns.Draw(ns.demo,ns.demoPlate,'DEMONSTRAÇÃO • NÃO É NPC',{title='Este é o destaque do AURANPC',objective='Sem vínculo com NPC real'})
    ns.demoSequence=(ns.demoSequence or 0)+1;local sequence=ns.demoSequence
    C_Timer.After(10,function() if sequence==ns.demoSequence then ns.demo:Hide();ns.demo.pulse:Stop() end end)
end
function ns.UpdateStatus()
    if not ns.status then return end
    local s=ns.stats
    local reason=not ns.Context() and 'Aguardando facção válida ou nível fora de 1–60' or (not ns.settings.enabled and 'Desativado' or (not ns.questReadable and 'Diário indisponível: sem confirmação' or 'Aguardando NPCs com objetivos pendentes'))
    if s.drawn>0 then reason='DESTAQUE DESENHADO • siga os marcadores amarelos' end
    if not C_NamePlate or type(C_NamePlate.GetNamePlateForUnit)~='function' then reason='API de placas indisponível: sem destaque real' end
    local plates=ns.Read(function() return C_CVar.GetCVar('nameplateShowEnemies') end)
    if plates~='1' and s.drawn==0 then reason=reason..'\nPlacas inimigas desligadas ou indisponíveis' end
    ns.status:SetText(reason..'\nQuests pendentes: '..s.quests..'  |  Placas: '..s.visible..'\nAssociados: '..s.matched..'  |  Desenhados: '..s.drawn..'\nRestritos: '..s.restricted..'  |  Sem identidade pública: '..s.unreadable..'\nItens: loot '..((ns.itemStats and ns.itemStats.loot) or 0)..' | bolsas '..((ns.itemStats and ns.itemStats.bags) or 0))
    for key,item in pairs(ns.toggles) do item.text:SetText(item.caption..': '..(ns.settings[key] and 'SIM' or 'NÃO')) end
end
function ns.UpdateHUD(first)
    if not ns.hud then return end
    if not first then ns.hud:Hide();ns.alertIdentity=nil;return end
    if ns.settings.banner then
        ns.hudText:SetText('!  QUEST PERTO • '..first.name..'\n'..first.match.title..'  ['..ns.stats.drawn..' NPCs]');ns.hud:Show()
    else ns.hud:Hide() end
    local now=ns.Read(GetTime) or 0
    local identity=first.name..':'..first.match.id
    if ns.settings.sound and identity~=ns.alertIdentity and now-(ns.lastSound or -100)>8 then
        if SOUNDKIT and SOUNDKIT.RAID_WARNING and PlaySound then pcall(PlaySound,SOUNDKIT.RAID_WARNING,'Master') end
        ns.lastSound=now
    end
    ns.alertIdentity=identity
end
