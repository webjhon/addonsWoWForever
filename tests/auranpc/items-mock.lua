TEST.bags={};TEST.bagTips={};TEST.loot={};TEST.lootTips={};TEST.lootRows={};TEST.bagButtons={}
 C_Container={GetContainerItemInfo=function(b,s)return TEST.bags[b..':'..s]end,GetContainerItemQuestInfo=function(b,s)local r=TEST.bags[b..':'..s];return r and r.quest end}
 C_TooltipInfo.GetBagItem=function(b,s)return TEST.bagTips[b..':'..s]end
 C_TooltipInfo.GetLootItem=function(s)return TEST.lootTips[s]end
 function GetLootSlotInfo(s)local r=TEST.loot[s];if r then return nil,nil,1,nil,1,false,r.isQuestItem,r.questID,r.isActive end end
 function GetLootSlotLink(s)local r=TEST.loot[s];return r and r.link end
 LootFrame=CreateFrame('Frame',nil,UIParent);LootFrame.ScrollBox={EnumerateFrames=function()local i=0;return function()i=i+1;return TEST.lootRows[i]end end}
 function bagbutton(b,s,q)
  local f=CreateFrame('Button',nil,UIParent);f.bag=b;f.slot=s;f:SetSize(36,36)
  function f:GetBagID()return self.bag end;function f:GetID()return self.slot end
  TEST.bags[b..':'..s]={itemID=100+s,quest=q};AURA.TrackBagButton(f);return f
 end
 function lootrow(s,q)
  local f=CreateFrame('Frame',nil,LootFrame);f.slot=s;f:SetSize(250,40)
  function f:GetSlotIndex()return self.slot end
  TEST.lootRows[#TEST.lootRows+1]=f;TEST.loot[s]=q;return f
 end
 function marked(f)return AURA.itemMarks[f] and AURA.itemMarks[f]:IsShown()end
 function tip(title)return {lines={{type=17,leftText=title}}}end
