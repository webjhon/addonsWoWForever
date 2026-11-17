# Cliente Forever 70938: SpellBook

Documento SpellBookDocumentation.lua; SHA256 509fabe6d33de10f7166dc71bfb853dc969803d86536acac0833d30b1d0f9179. Coincide exatamente com a referência Gethe já versionada.

Tipo System; namespace C_SpellBook. ScriptObject indica métodos, não globals. Catálogo factual completo em knowledge/client/api-signatures.json, incluindo restrições e nilabilidade. Null significa não especificado. Todas as funções continuam UNVERIFIED no jogo.

C_SpellBook.AbortSpellIntro(spellID:number) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.CastSpellBookItem(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank, targetSelf:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.ContainsAnyDisenchantSpell() -> contains:bool. SecretArguments=null; HasRestrictions=null.
C_SpellBook.FindBaseSpellByID(spellID:number) -> baseSpellID:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.FindFlyoutSlotBySpellID(spellID:number) -> flyoutSlot:luaIndex. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.FindSpellBookSlotForSpell(spellIdentifier:SpellIdentifier, includeHidden:bool, includeFlyouts:bool, includeFutureSpells:bool, includeOffSpec:bool) -> spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.FindSpellOverrideByID(spellID:number) -> overrideSpellID:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.GetClassSkillLineInfo() -> skillLineInfo:SpellBookSkillLineInfo. SecretArguments=null; HasRestrictions=null.
C_SpellBook.GetCurrentLevelSpells(level:number) -> spellIDs:table. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.GetNumSpellBookSkillLines() -> numSpellBookSkillLines:number. SecretArguments=null; HasRestrictions=null.
C_SpellBook.GetSkillLineIndexByID(skillLineID:number) -> skillIndex:luaIndex?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.GetSpellBookItemAutoCast(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> autoCastAllowed:bool, autoCastEnabled:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.GetSpellBookItemCastCount(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> castCount:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.GetSpellBookItemChargeDuration(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> duration:LuaDurationObject. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.GetSpellBookItemCharges(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> chargeInfo:SpellChargeInfo. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.GetSpellBookItemCooldown(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> spellCooldownInfo:SpellCooldownInfo. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.GetSpellBookItemCooldownDuration(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank, ignoreGCD:bool) -> duration:LuaDurationObject. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.GetSpellBookItemDescription(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> description:string. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.GetSpellBookItemInfo(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> spellBookItemInfo:SpellBookItemInfo. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.GetSpellBookItemLevelLearned(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> levelLearned:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.GetSpellBookItemLink(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank, glyphID:number?) -> spellLink:string. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.GetSpellBookItemLossOfControlCooldownDuration(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> duration:LuaDurationObject. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.GetSpellBookItemLossOfControlCooldownInfo(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> lossOfControlInfo:SpellLossOfControlInfo. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.GetSpellBookItemName(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> name:string, subName:string. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.GetSpellBookItemPowerCost(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> powerCosts:table. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.GetSpellBookItemSkillLineIndex(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> skillLineIndex:luaIndex?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.GetSpellBookItemTexture(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> iconID:fileID. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.GetSpellBookItemTradeSkillLink(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> spellLink:string. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.GetSpellBookItemType(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> itemType:SpellBookItemType, actionID:number, spellID:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.GetSpellBookSkillLineInfo(skillLineIndex:luaIndex) -> skillLineInfo:SpellBookSkillLineInfo. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.HasPetSpells() -> numPetSpells:number, petNameToken:string. SecretArguments=null; HasRestrictions=null.
C_SpellBook.IsAutoAttackSpellBookItem(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> isAutoAttack:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.IsClassTalentSpellBookItem(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> isClassTalent:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.IsPvPTalentSpellBookItem(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> isPvPTalent:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.IsRangedAutoAttackSpellBookItem(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> isRangedAutoAttack:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.IsSpellBookItemHarmful(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> isHarmful:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.IsSpellBookItemHelpful(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> isHelpful:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.IsSpellBookItemInRange(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank, targetUnit:UnitToken?) -> inRange:bool?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.IsSpellBookItemLooseFlyoutMember(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> isFlyoutMember:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.IsSpellBookItemLowRank(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> isLowRank:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.IsSpellBookItemOffSpec(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> isOffSpec:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.IsSpellBookItemPassive(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> isPassive:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.IsSpellBookItemUsable(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> isUsable:bool, insufficientPower:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.IsSpellInSpellBook(spellID:number, spellBank:SpellBookSpellBank, includeOverrides:bool) -> isInSpellBook:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.IsSpellKnown(spellID:number, spellBank:SpellBookSpellBank) -> isKnown:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.IsSpellKnownOrInSpellBook(spellID:number, spellBank:SpellBookSpellBank, includeOverrides:bool) -> isKnownOrInSpellBook:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.PickupSpellBookItem(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.SetBarSlotFromIntro(spellID:number, slotIndex:luaIndex) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.SetSpellBookItemAutoCastEnabled(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank, enabled:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.SpellBookItemHasRange(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> hasRange:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SpellBook.ToggleSpellBookItemAutoCast(spellBookItemSlotIndex:luaIndex, spellBookItemSpellBank:SpellBookSpellBank) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
