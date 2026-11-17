# Cliente Forever 70938: QuestLog

Documento QuestLogDocumentation.lua; SHA256 e637368f36d153f8b432455cfa247d0c67c84996dce8d591bc1eb4d1cd7bc098. Coincide exatamente com a referência Gethe já versionada.

Tipo System; namespace C_QuestLog. ScriptObject indica métodos, não globals. Catálogo factual completo em knowledge/client/api-signatures.json, incluindo restrições e nilabilidade. Null significa não especificado. Todas as funções continuam UNVERIFIED no jogo.

C_QuestLog.AbandonQuest() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
C_QuestLog.AddQuestWatch(questID:number) -> wasWatched:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.AddWorldQuestWatch(questID:number, watchType:QuestWatchType?) -> wasWatched:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.CanAbandonQuest(questID:number) -> canAbandon:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.DoesQuestAwardReputationWithFaction(questID:number, targetFactionID:number) -> awardsReputation:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetAbandonQuest() -> questID:number. SecretArguments=null; HasRestrictions=null.
C_QuestLog.GetAbandonQuestItems() -> itemIDs:table. SecretArguments=null; HasRestrictions=null.
C_QuestLog.GetActivePreyQuest() -> questID:number. SecretArguments=null; HasRestrictions=null.
C_QuestLog.GetActiveThreatMaps() -> uiMapIDs:table. SecretArguments=null; HasRestrictions=null.
C_QuestLog.GetAllCompletedQuestIDs() -> quests:table. SecretArguments=null; HasRestrictions=null.
C_QuestLog.GetBountiesForMapID(uiMapID:number) -> bounties:table?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetBountySetInfoForMapID(uiMapID:number) -> displayLocation:MapOverlayDisplayLocation, lockQuestID:number, bountySetID:number, isActivitySet:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetDistanceSqToQuest(questID:number) -> distanceSq:number, onContinent:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetHeaderIndexForQuest(questID:number) -> index:luaIndex?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetInfo(questLogIndex:luaIndex) -> info:QuestInfo?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetLogIndexForQuestID(questID:number) -> questLogIndex:luaIndex?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetMapForQuestPOIs() -> uiMapID:number. SecretArguments=null; HasRestrictions=null.
C_QuestLog.GetMaxNumQuests() -> maxNumQuests:number. SecretArguments=null; HasRestrictions=null.
C_QuestLog.GetMaxNumQuestsCanAccept() -> maxNumQuestsCanAccept:number. SecretArguments=null; HasRestrictions=null.
C_QuestLog.GetNextWaypoint(questID:number) -> mapID:number, x:number, y:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetNextWaypointForMap(questID:number, uiMapID:number) -> x:number, y:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetNextWaypointText(questID:number) -> waypointText:string. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetNumQuestLogEntries() -> numShownEntries:number, numQuests:number. SecretArguments=null; HasRestrictions=null.
C_QuestLog.GetNumQuestObjectives(questID:number) -> leaderboardCount:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetNumQuestWatches() -> numQuestWatches:number. SecretArguments=null; HasRestrictions=null.
C_QuestLog.GetNumWorldQuestWatches() -> numQuestWatches:number. SecretArguments=null; HasRestrictions=null.
C_QuestLog.GetQuestAdditionalHighlights(questID:number) -> uiMapID:number, worldQuests:bool, worldQuestsElite:bool, dungeons:bool, treasures:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetQuestDetailsTheme(questID:number) -> theme:QuestTheme?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetQuestDifficultyLevel(questID:number) -> level:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetQuestIDForLogIndex(questLogIndex:luaIndex) -> questID:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetQuestIDForQuestWatchIndex(questWatchIndex:luaIndex) -> questID:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetQuestIDForWorldQuestWatchIndex(questWatchIndex:luaIndex) -> questID:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetQuestLogMajorFactionReputationRewards(questID:number) -> reputationRewards:table. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetQuestLogPortraitGiver(questLogIndex:luaIndex?) -> portraitGiver:number, portraitGiverText:cstring, portraitGiverName:cstring, portraitGiverMount:number, portraitGiverModelSceneID:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetQuestObjectives(questID:number) -> objectives:table. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetQuestRewardCurrencies(questID:number) -> questRewardCurrencies:table. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetQuestRewardCurrencyInfo(questID:number, currencyIndex:luaIndex, isChoice:bool) -> questRewardCurrencyInfo:QuestRewardCurrencyInfo?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetQuestTagInfo(questID:number) -> info:QuestTagInfo?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetQuestTimers() -> questTimers:table. SecretArguments=null; HasRestrictions=null.
C_QuestLog.GetQuestType(questID:number) -> questType:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetQuestWatchType(questID:number) -> watchType:QuestWatchType?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetQuestsOnMap(uiMapID:number) -> quests:table. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetRequiredMoney(questID:number?) -> requiredMoney:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetSelectedQuest() -> questID:number. SecretArguments=null; HasRestrictions=null.
C_QuestLog.GetSuggestedGroupSize(questID:number) -> suggestedGroupSize:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetTimeAllowed(questID:number) -> totalTime:number, elapsedTime:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetTitleForLogIndex(questLogIndex:luaIndex) -> title:cstring?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetTitleForQuestID(questID:number) -> title:cstring?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.GetTrivialRange() -> range:number. SecretArguments=null; HasRestrictions=null.
C_QuestLog.GetZoneStoryInfo(uiMapID:number) -> achievementID:number, storyMapID:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.HasActiveThreats() -> hasActiveThreats:bool. SecretArguments=null; HasRestrictions=null.
C_QuestLog.IsAccountQuest(questID:number) -> isAccountQuest:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsComplete(questID:number) -> isComplete:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsEliteQuest(questID:number) -> isEliteQuest:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsFailed(questID:number) -> isFailed:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsImportantQuest(questID:number) -> isImportant:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsMetaQuest(questID:number) -> isMeta:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsOnMap(questID:number) -> onMap:bool, hasLocalPOI:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsOnQuest(questID:number) -> isOnQuest:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsPushableQuest(questID:number) -> isPushable:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsQuestBounty(questID:number) -> isBounty:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsQuestCalling(questID:number) -> isCalling:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsQuestCriteriaForBounty(questID:number, bountyQuestID:number) -> isCriteriaForBounty:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsQuestDisabledForSession(questID:number) -> isDisabled:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsQuestFlaggedCompleted(questID:number) -> isCompleted:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsQuestFlaggedCompletedOnAccount(questID:number) -> isCompletedOnAccount:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsQuestFromContentPush(questID:number) -> isFromContentPush:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsQuestInvasion(questID:number) -> isInvasion:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsQuestReplayable(questID:number) -> isReplayable:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsQuestReplayedRecently(questID:number) -> recentlyReplayed:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsQuestTask(questID:number) -> isTask:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsQuestTrivial(questID:number) -> isTrivial:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsRepeatableQuest(questID:number) -> isRepeatable:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsThreatQuest(questID:number) -> isThreat:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsUnitOnQuest(unit:UnitToken, questID:number) -> isOnQuest:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.IsWorldQuest(questID:number) -> isWorldQuest:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.QuestCanHaveWarModeBonus(questID:number) -> hasBonus:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.QuestContainsFirstTimeRepBonusForPlayer(questID:number) -> questContainsFirstTimeRepBonusForPlayer:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.QuestHasQuestSessionBonus(questID:number) -> hasBonus:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.QuestHasWarModeBonus(questID:number) -> hasBonus:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.QuestIgnoresAccountCompletedFiltering(questID:number) -> questIgnoresAccountCompletedFiltering:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.ReadyForTurnIn(questID:number) -> readyForTurnIn:bool?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.RemoveQuestWatch(questID:number) -> wasRemoved:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.RemoveWorldQuestWatch(questID:number) -> wasRemoved:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.RequestLoadQuestByID(questID:number) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.SetAbandonQuest() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
C_QuestLog.SetMapForQuestPOIs(uiMapID:number) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.SetSelectedQuest(questID:number) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.ShouldDisplayTimeRemaining(questID:number) -> displayTimeRemaining:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.ShouldShowQuestRewards(questID:number) -> shouldShow:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.SortQuestWatches() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
C_QuestLog.UnitIsRelatedToActiveQuest(unit:UnitToken) -> isRelatedToActiveQuest:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_QuestLog.UpdateCampaignHeaders() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
