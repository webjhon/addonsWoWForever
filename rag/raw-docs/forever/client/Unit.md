# Cliente Forever 70938: Unit

Documento UnitDocumentation.lua; SHA256 93004ac1b260127741471b7861360cdf7536afcb18d4c1db73b7259faa43e61c. Coincide exatamente com a referência Gethe já versionada.

Tipo System; namespace nenhum. ScriptObject indica métodos, não globals. Catálogo factual completo em knowledge/client/api-signatures.json, incluindo restrições e nilabilidade. Null significa não especificado. Todas as funções continuam UNVERIFIED no jogo.

CanEjectPassengerFromSeat(virtualSeatIndex:luaIndex) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
CanSwitchVehicleSeat() -> result:bool. SecretArguments=null; HasRestrictions=null.
ClosestGameObjectPosition(gameObjectID:number) -> xPos:number, yPos:number, distance:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
ClosestUnitPosition(creatureID:number) -> xPos:number, yPos:number, distance:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
CreateUnitHealPredictionCalculator() -> healPredictionCalculator:UnitHealPredictionCalculator. SecretArguments=null; HasRestrictions=null.
EjectPassengerFromSeat(virtualSeatIndex:luaIndex) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
GetComboPoints(unit:UnitTokenPvPRestrictedForAddOns, target:UnitTokenPvPRestrictedForAddOns) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
GetNegativeCorruptionEffectInfo() -> corruptionEffects:table. SecretArguments=null; HasRestrictions=null.
GetUnitChargedPowerPoints(unit:UnitToken) -> pointIndices:table. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
GetUnitEmpowerHoldAtMaxTime(unit:UnitToken) -> holdAtMaxTime:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
GetUnitEmpowerMinHoldTime(unit:UnitToken) -> minHoldTime:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
GetUnitEmpowerStageDuration(unit:UnitToken, index:number) -> duration:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
GetUnitHealthModifier(unit:UnitToken) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
GetUnitMaxHealthModifier(unit:UnitToken) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
GetUnitPowerBarInfo(unitToken:UnitToken) -> info:UnitPowerBarInfo. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
GetUnitPowerBarInfoByID(barID:number) -> info:UnitPowerBarInfo. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
GetUnitPowerBarStrings(unitToken:UnitToken) -> name:cstring?, tooltip:cstring?, cost:cstring?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
GetUnitPowerBarStringsByID(barID:number) -> name:cstring?, tooltip:cstring?, cost:cstring?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
GetUnitPowerBarTextureInfo(unitToken:UnitToken, textureIndex:luaIndex, timerIndex:luaIndex?) -> texture:fileID, colorR:number, colorG:number, colorB:number, colorA:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
GetUnitPowerBarTextureInfoByID(barID:number, textureIndex:luaIndex) -> texture:fileID, colorR:number, colorG:number, colorB:number, colorA:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
GetUnitPowerModifier(unit:UnitToken) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
GetUnitSpeed(unit:UnitToken) -> currentSpeed:number, runSpeed:number, flightSpeed:number, swimSpeed:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
GetUnitTotalModifiedMaxHealthPercent(unit:UnitToken) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
GetVehicleUIIndicator(vehicleIndicatorID:number) -> backgroundTextureID:fileID, numSeatIndicators:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
GetVehicleUIIndicatorSeat(vehicleIndicatorID:number, indicatorSeatIndex:luaIndex) -> virtualSeatIndex:number, xPos:number, yPos:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
IsFalling(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
IsFlying(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
IsPlayerInGuildFromGUID(playerGUID:WOWGUID) -> IsInGuild:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
IsSubmerged(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
IsSwimming(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
IsUnitModelReadyForUI(unitToken:UnitToken) -> isReady:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
PlayerIsPVPInactive(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
PlayerIsSpellTarget(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
PlayerVehicleHasComboPoints() -> vehicleHasComboPoints:bool. SecretArguments=null; HasRestrictions=null.
RegionalUniqueNamesEnabled() -> result:bool. SecretArguments=null; HasRestrictions=null.
ReportPlayerIsPVPAFK(unit:UnitToken) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=true.
ResistancePercent(resistance:number, casterLevel:number) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SetPortraitTexture(textureObject:SimpleTexture, unitToken:UnitToken, disableMasking:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SetPortraitTextureFromCreatureDisplayID(textureObject:SimpleTexture, creatureDisplayID:number) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SetUnitCursorTexture(textureObject:SimpleTexture, unit:UnitToken, style:CursorStyle?, includeLowPriority:bool?, preferGamepadIcon:bool?) -> hasCursor:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitAffectingCombat(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitAlliedRaceInfo(unit:UnitToken) -> isAlliedRace:bool, hasHeritageArmorUnlocked:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitArmor(unit:UnitToken) -> base:number, effective:number, real:number, bonus:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitAttackPower(unit:UnitToken) -> attackPower:number, posBuff:number, negBuff:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitAttackSpeed(unit:UnitToken) -> attackSpeed:number, offhandAttackSpeed:number?, rangedAttackSpeed:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitBattlePetLevel(unit:UnitToken) -> result:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitBattlePetSpeciesID(unit:UnitToken) -> result:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitBattlePetType(unit:UnitToken) -> result:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitCanAssist(unit:UnitToken, target:UnitToken, canAssistImmunePC:bool, canAssistUninteractable:bool) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitCanAttack(unit:UnitToken, target:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitCanCooperate(unit:UnitToken, target:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitCanPetBattle(unit:UnitToken, target:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitCastingDuration(unit:UnitTokenPvPRestrictedForAddOns) -> duration:LuaDurationObject. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitCastingInfo(unit:UnitTokenPvPRestrictedForAddOns) -> name:cstring, displayName:string, textureID:fileID, startTimeMs:number, endTimeMs:number, isTradeskill:bool, castID:WOWGUID, notInterruptible:bool?, castingSpellID:number, castBarID:UnitCastBarID?, delayTimeMs:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitChannelDuration(unit:UnitTokenPvPRestrictedForAddOns) -> duration:LuaDurationObject. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitChannelInfo(unit:UnitTokenPvPRestrictedForAddOns) -> name:cstring, displayName:cstring, textureID:fileID, startTimeMs:number, endTimeMs:number, isTradeskill:bool, notInterruptible:bool?, spellID:number, isEmpowered:bool, numEmpowerStages:number, castBarID:UnitCastBarID?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitChromieTimeID(unit:UnitToken) -> ID:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitClass(unit:UnitToken) -> className:cstring, classFilename:cstring, classID:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitClassBase(unit:UnitToken) -> classFilename:cstring, classID:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitClassFromGUID(unitGUID:WOWGUID) -> className:cstring, classFilename:cstring, classID:number. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
UnitClassification(unit:UnitToken) -> result:cstring. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitControllingVehicle(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitCreatureFamily(unit:UnitToken) -> name:cstring, id:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitCreatureID(unit:UnitToken) -> creatureID:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitCreatureType(unit:UnitToken) -> name:cstring, id:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitDamage(unit:UnitToken) -> minDamage:number, maxDamage:number, offhandMinDamage:number, offhandMaxDamage:number, posBuff:number, negBuff:number, percent:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitDefenseSkill(unit:UnitToken) -> base:number, modifier:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitDetailedThreatSituation(unit:UnitToken, mobGUID:UnitToken) -> isTanking:bool, status:number, scaledPercentage:number, rawPercentage:number, rawThreat:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitDistanceSquared(unit:UnitToken) -> distance:number, checkedDistance:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitEffectiveLevel(name:cstring) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitEmpoweredChannelDuration(unit:UnitToken, includeHoldAtMaxTime:bool) -> duration:LuaDurationObject. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitEmpoweredStageDurations(unit:UnitToken) -> duration:table. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitEmpoweredStagePercentages(unit:UnitToken, includeHoldAtMaxTime:bool) -> percentages:table. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitExists(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitFactionGroup(unitName:cstring, checkDisplayRace:bool) -> factionGroupTag:cstring, localized:cstring. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitFullName(unit:UnitToken) -> unitName:cstring, unitServer:cstring. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitGUID(unit:UnitTokenPvPRestrictedForAddOns) -> result:WOWGUID?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitGetDetailedHealPrediction(unit:UnitTokenPvPRestrictedForAddOns, healerUnit:UnitTokenPvPRestrictedForAddOns?, healPredictionCalculator:UnitHealPredictionCalculator) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitGetIncomingHeals(unit:UnitTokenPvPRestrictedForAddOns, healerGUID:UnitTokenPvPRestrictedForAddOns?) -> result:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitGetTotalAbsorbs(unit:UnitTokenPvPRestrictedForAddOns) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitGetTotalHealAbsorbs(unit:UnitTokenPvPRestrictedForAddOns) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitGroupRolesAssigned(unit:UnitToken?) -> result:cstring. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitGroupRolesAssignedEnum(unit:UnitToken?) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitHPPerStamina(unit:UnitToken) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitHasEffectivelyTankAura(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitHasLootInteraction(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitHasMouseoverHighlight(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitHasPowerType(unitToken:UnitTokenPvPRestrictedForAddOns, powerType:PowerType) -> hasPower:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitHasRelicSlot(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitHasVehiclePlayerFrameUI(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitHasVehicleUI(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitHealthMax(unit:UnitTokenPvPRestrictedForAddOns) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitHealthMissing(unit:UnitTokenPvPRestrictedForAddOns, usePredicted:bool) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitHealthPercent(unit:UnitTokenPvPRestrictedForAddOns, usePredicted:bool, curve:LuaCurveObjectBase?) -> result:LuaCurveEvaluatedResult. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitHealth(unit:UnitTokenPvPRestrictedForAddOns, usePredicted:bool) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitHonor(unit:UnitToken) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitHonorLevel(unit:UnitToken) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitHonorMax(unit:UnitToken) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitInAnyGroup(unit:UnitToken?, partyIndex:luaIndex?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitInBattleground(unit:UnitToken?, partyIndex:luaIndex?) -> result:luaIndex?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitInOtherParty(unit:UnitToken) -> inOtherParty:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitInParty(unit:UnitToken?, partyIndex:luaIndex?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitInPartyIsAI(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitInPartyShard(unit:UnitToken) -> inPartyShard:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitInRaid(unit:UnitToken?, partyIndex:luaIndex?) -> result:luaIndex?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitInRange(unit:UnitToken) -> inRange:bool, checkedRange:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitInSubgroup(unit:UnitToken?, partyIndex:luaIndex?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitInVehicle(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitInVehicleControlSeat(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitInVehicleHidesPetFrame(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsAFK(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsBattlePet(unit:UnitToken) -> result:bool?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsBattlePetCompanion(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsBossMob(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsCharmed(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsConnected(unit:UnitToken) -> isConnected:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsControlling(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsCorpse(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsDND(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsDead(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsDeadOrGhost(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsEnemy(unit:UnitToken, target:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsFeignDeath(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsFriend(unit:UnitToken, target:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsGameObject(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsGhost(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsGroupAssistant(unit:UnitToken) -> isAssistant:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsGroupLeader(unit:UnitToken, partyCategory:luaIndex?) -> isLeader:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsHumanPlayer(unit:UnitToken?, partyIndex:luaIndex?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsInInteractRange(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsInMyGuild(unit:cstring) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsInteractable(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsLieutenant(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsMercenary(name:cstring) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsMinion(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsNPCAsPlayer(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsOtherPlayersBattlePet(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsOtherPlayersPet(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsOwnerOrControllerOfUnit(controllingUnit:UnitToken, controlledUnit:UnitToken) -> unitIsOwnerOrControllerOfUnit:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsPVP(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsPVPFreeForAll(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsPVPSanctuary(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsPlayer(unit:UnitToken?, partyIndex:luaIndex?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsPlayerControlledOrGroupMember(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsPossessed(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsQuestBoss(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsRaidOfficer(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsSameServer(unitName:cstring) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsTapDenied(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsTrivial(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsUnconscious(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsUnit(unit1:UnitToken, unit2:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsVisible(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitIsWildBattlePet(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitLeadsAnyGroup(unit:UnitToken) -> isLeader:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitLevel(name:cstring) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitName(unit:UnitToken) -> unitName:cstring, unitServer:cstring. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
UnitNameFromGUID(unitGUID:WOWGUID) -> unitName:cstring, unitServer:cstring. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
UnitNameUnmodified(unit:UnitToken) -> unitName:cstring, unitServer:cstring. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitNameplateShowsWidgetsOnly(unit:UnitToken) -> nameplateShowsWidgetsOnly:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitNumPowerBarTimers(unit:UnitToken) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitOnTaxi(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitOwnerGUID(unit:UnitTokenPvPRestrictedForAddOns) -> ownerGUID:WOWGUID. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitPVPName(unit:UnitToken) -> result:string. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitPartialPower(unitToken:UnitTokenPvPRestrictedForAddOns, powerType:PowerType?, unmodified:bool) -> partialPower:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitPercentHealthFromGUID(unitGUID:WOWGUID) -> percentHealth:number?. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
UnitPhaseReason(unit:UnitToken) -> reason:PhaseReason?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitPlayerControlled(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitPlayerOrPetInParty(unit:UnitToken?, partyIndex:luaIndex?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitPlayerOrPetInRaid(unit:UnitToken?, partyIndex:luaIndex?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitPosition(unit:UnitToken) -> positionX:number, positionY:number, positionZ:number, mapID:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitPower(unitToken:UnitTokenPvPRestrictedForAddOns, powerType:PowerType?, unmodified:bool) -> power:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitPowerBarID(unitToken:UnitToken) -> barID:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitPowerBarTimerInfo(unit:UnitToken, index:luaIndex) -> duration:number, expiration:number, barID:number, auraID:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitPowerDisplayMod(powerType:PowerType) -> displayMod:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitPowerMax(unitToken:UnitTokenPvPRestrictedForAddOns, powerType:PowerType?, unmodified:bool) -> maxPower:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitPowerMissing(unitToken:UnitTokenPvPRestrictedForAddOns, powerType:PowerType?, unmodified:bool) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitPowerPercent(unitToken:UnitTokenPvPRestrictedForAddOns, powerType:PowerType?, unmodified:bool, curve:LuaCurveObjectBase?) -> result:LuaCurveEvaluatedResult. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitPowerType(unit:UnitTokenPvPRestrictedForAddOns, index:number) -> powerType:PowerType, powerTypeToken:string, rgbX:number, rgbY:number, rgbZ:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitPvpClassification(unit:UnitTokenPvPRestrictedForAddOns) -> classification:PvPUnitClassification?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitQuestTrivialLevelRange(unit:UnitToken) -> levelRange:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitQuestTrivialLevelRangeScaling(unit:UnitToken) -> levelRange:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitRace(unit:UnitToken) -> localizedRaceName:cstring, englishRaceName:cstring, raceID:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitRangedAttackPower(unit:UnitToken) -> attackPower:number, posBuff:number, negBuff:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitRangedDamage(unit:UnitToken) -> speed:number, minDamage:number, maxDamage:number, posBuff:number, negBuff:number, percent:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitReaction(unit:UnitToken, target:UnitToken) -> result:luaIndex?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitRealmRelationship(unit:UnitToken) -> realmRelationship:luaIndex?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitResistance(unit:UnitToken, damageClass:Damageclass) -> baseResistance:number, realResistance:number, effectiveResistance:number, bonusResistance:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitSelectionColor(unit:UnitToken, useExtendedColors:bool) -> resultR:number, resultG:number, resultB:number, resultA:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitSelectionType(unit:UnitToken, useExtendedColors:bool) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitSex(unit:UnitToken) -> sex:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitSexBase(unit:UnitToken) -> sex:UnitSex?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitShouldDisplayName(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitShouldDisplaySpellTargetName(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitSpellHaste(unit:UnitToken) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitSpellTargetClass(unit:UnitToken) -> classFilename:cstring. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitSpellTargetName(unit:UnitToken) -> targetName:string. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitStagger(unit:UnitTokenPvPRestrictedForAddOns) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitStat(unit:UnitToken, index:luaIndex) -> currentStat:number, effectiveStat:number, statPositiveBuff:number, statNegativeBuff:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitSwitchToVehicleSeat(unit:UnitToken, virtualSeatIndex:luaIndex) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitTargetsVehicleInRaidUI(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitThreatLeadSituation(unit:UnitToken, mobGUID:UnitToken) -> result:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitThreatPercentageOfLead(unit:UnitToken, mobGUID:UnitToken) -> result:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitThreatSituation(unit:UnitToken, mobGUID:UnitToken?) -> result:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitTokenFromGUID(unitGUID:WOWGUID) -> unitToken:string?. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
UnitTreatAsPlayerForDisplay(unit:UnitToken) -> treatAsPlayer:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitTrialBankedLevels(unit:UnitToken) -> bankedLevels:number, xpIntoCurrentLevel:number, xpForNextLevel:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitTrialXP(unit:UnitToken) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitUsesAmmo(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitUsingVehicle(unit:UnitToken) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitVehicleSeatCount(unit:UnitToken) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitVehicleSeatInfo(unit:UnitToken, virtualSeatIndex:luaIndex) -> controlType:cstring, occupantName:cstring, serverName:cstring, ejectable:bool, canSwitchSeats:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitVehicleSkin(unit:UnitToken?) -> result:fileID. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitWeaponAttackPower(unit:UnitToken) -> mainHandWeaponAttackPower:number, offHandWeaponAttackPower:number, rangedWeaponAttackPower:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitWidgetSet(unit:UnitToken) -> uiWidgetSet:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitXP(unit:UnitToken) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
UnitXPMax(unit:UnitToken) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
WorldLootObjectExists(unit:UnitToken?) -> result:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
