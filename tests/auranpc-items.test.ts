import test from 'node:test';import fs from 'node:fs';import {run} from './auranpc/harness.ts';
const setup=fs.readFileSync('tests/auranpc/items-mock.lua','utf8');
for(const faction of ['Alliance','Horde'])test('quest NPC and item highlights react automatically for '+faction,()=>run(setup+`
 TEST.faction='${faction}';accept(7,'Minha quest');plate('nameplate1',6);assert(AURA.stats.drawn==1)
 local b=bagbutton(0,1,{questID=7,isQuestItem=true,isActive=true})
 local l=lootrow(1,{link='item:101',questID=7,isQuestItem=true,isActive=true})
 fire('LOOT_OPENED');assert(marked(b) and marked(l));assert(AURA.itemMarks[l].pulse:IsPlaying())
 fire('QUEST_REMOVED',7);assert(not marked(b) and not marked(l));assert(AURA.stats.drawn==0)
`));
test('common objective items use exact active public tooltip titles; generic quest class alone is insufficient',()=>run(setup+`
 accept(7,'Flores para alguém')
 local common=bagbutton(0,1,{isQuestItem=false,isActive=false});TEST.bagTips['0:1']=tip('Flores para alguém')
 local starter=bagbutton(0,2,{questID=99,isQuestItem=true,isActive=false});TEST.bagTips['0:2']=tip('Flores para alguém')
 local leftover=bagbutton(0,3,{isQuestItem=true,isActive=false})
 fire('BAG_UPDATE_DELAYED');assert(marked(common));assert(not marked(starter) and not marked(leftover))
`));
test('completed active quest retains bag hand-in badge while extra loot is no longer highlighted',()=>run(setup+`
 accept(7);local b=bagbutton(0,1,{questID=7});local l=lootrow(1,{link='item:101',questID=7})
 fire('LOOT_OPENED');assert(marked(b) and marked(l))
 TEST.ready[7]=true;fire('QUEST_LOG_UPDATE');assert(marked(b) and not marked(l))
 fire('QUEST_TURNED_IN',7);assert(not marked(b))
`));
test('recycling, movement, removal, scrolling and closing never leave stale badges',()=>run(setup+`
 accept(7);local b=bagbutton(0,1,{questID=7});local l=lootrow(1,{link='item:101',questID=7})
 fire('LOOT_OPENED');assert(marked(b) and marked(l));local mark=AURA.itemMarks[b]
 TEST.bags['0:1']=nil;b.slot=2;TEST.bags['0:2']={quest={}};fire('BAG_UPDATE_DELAYED');assert(not marked(b))
 TEST.bags['0:2'].quest={questID=7};fire('BAG_UPDATE_DELAYED');assert(marked(b) and AURA.itemMarks[b]==mark)
 fire('LOOT_SLOT_CLEARED',1);assert(not marked(l));tick();assert(not marked(l))
 TEST.loot[2]={link='item:102',questID=7};l.slot=2;fire('LOOT_SLOT_CHANGED',2);assert(marked(l))
 l:Hide();tick();assert(not marked(l));l:Show();tick();assert(marked(l))
 fire('LOOT_CLOSED');assert(not marked(l) and marked(b))
`));
test('settings disable independently; solid border survives pulse off and global disable clears everything',()=>run(setup+`
 accept(7);local b=bagbutton(0,1,{questID=7});local l=lootrow(1,{link='item:101',questID=7})
 fire('LOOT_OPENED');AURA.settings.itemPulse=false;AURA.Reconcile();assert(marked(l) and not AURA.itemMarks[l].pulse:IsPlaying())
 AURA.settings.bagItems=false;AURA.Reconcile();assert(not marked(b) and marked(l))
 AURA.settings.bagItems=true;AURA.settings.lootItems=false;AURA.Reconcile();assert(marked(b) and not marked(l))
 AURA.settings.enabled=false;AURA.Reconcile();assert(not marked(b) and not marked(l))
`));
test('unknown or secret values and forbidden frames fail safely; reload rebuilds authoritative state',()=>run(setup+`
 accept(7);local b=bagbutton(0,1,{questID=7});fire('BAG_UPDATE_DELAYED');assert(marked(b))
 b.forbidden=true;tick();assert(not marked(b));b.forbidden=false
 TEST.bags['0:1'].quest={questID={secret=true},isQuestItem={secret=true}};fire('BAG_UPDATE_DELAYED');assert(not marked(b))
 TEST.bags['0:1'].quest={questID=7};TEST.faction='Unknown';fire('PLAYER_ENTERING_WORLD');assert(not marked(b))
 TEST.faction='Horde';fire('PLAYER_LOGIN');assert(marked(b))
 C_Container=nil;fire('BAG_UPDATE_DELAYED');assert(not marked(b))
`));
test('duplicate active titles do not manufacture an item association and coalesced bag events do not scan quests',()=>run(setup+`
 accept(7,'Mesmo nome');accept(8,'Mesmo nome');local b=bagbutton(0,1,{})
 TEST.bagTips['0:1']=tip('Mesmo nome');fire('BAG_UPDATE_DELAYED');assert(not marked(b))
 local reads=TEST.reads;TEST.defer=true;for i=1,50 do fire('BAG_UPDATE_DELAYED')end;assert(#TEST.timers==1);flush();TEST.defer=false;assert(TEST.reads==reads)
`));
test('modern bag discovery and post hooks keep overlays on the actual updated buttons',()=>run(setup+`
 local container=CreateFrame('Frame',nil,UIParent)
 local b=bagbutton(0,1,{questID=7});AURA.itemButtons[b]=nil
 function container:EnumerateValidItems()return ipairs({b})end
 function ContainerFrameUtil_EnumerateContainerFrames()return ipairs({container})end
 accept(7);assert(marked(b))
 local hooks={};function hooksecurefunc(t,k,fn)hooks[k]=fn end
 ContainerFrameItemButtonMixin={UpdateQuestItem=function()end};LootFrameElementMixin={Init=function()end};AURA.RefreshItems()
 assert(hooks.UpdateQuestItem and hooks.Init);hooks.UpdateQuestItem(b);flush();assert(marked(b))
`));

for(const faction of ['Alliance','Horde'])test('Live regression shape for '+faction+': objective name matches bag and loot with nil questID and isActive false',()=>run(setup+`
 TEST.faction='${faction}';
 accept(33,'Só louco não come lobo',{{type='item',text='1/8 Carne Dura de Lobo',finished=false}})
 local b=bagbutton(0,3,{isQuestItem=true,isActive=false})
 TEST.bagTips['0:3']={lines={{type=22,leftText='Carne Dura de Lobo'},{type=20,leftText='Item de missão'}}}
 local l=lootrow(1,{name='Carne Dura de Lobo',link='item:101',isQuestItem=true,isActive=false})
 fire('LOOT_OPENED');assert(marked(b) and marked(l))
 TEST.objectivesByID[33][1].finished=true;TEST.ready[33]=true;fire('QUEST_LOG_UPDATE');assert(marked(b) and not marked(l))
 fire('QUEST_REMOVED',33);assert(not marked(b));accept(33,'Só louco não come lobo',{{type='item',text='0/8 Carne Dura de Lobo',finished=false}});TEST.ready[33]=false;fire('QUEST_LOG_UPDATE');assert(marked(b))
 TEST.bagTips['0:3'].lines[1].leftText={secret=true};fire('BAG_UPDATE_DELAYED');assert(not marked(b))
`));
