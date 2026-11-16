AN={};TEST.native='0';TEST.writes=0;TEST.locked=false;TEST.secure=false;TEST.readonly=false
C_CVar={GetCVar=function()return TEST.native end,GetCVarInfo=function()return TEST.native,'1',false,false,TEST.locked,TEST.secure,TEST.readonly end,
SetCVar=function(name,v)assert(not TEST.combat);assert(name=='ShowQuestUnitCircles');TEST.writes=TEST.writes+1;if TEST.writeError then error('denied') end;if TEST.reject then return false end;TEST.native=v;return true end}
C_QuestLog.GetNumQuestLogEntries=function()return #TEST.journal,#TEST.journal end
function UnitIsQuestBoss(unit)return TEST.questTarget end
function fire(event,...)AN.events.scripts.OnEvent(AN.events,event,...);if not TEST.defer then flush() end end
