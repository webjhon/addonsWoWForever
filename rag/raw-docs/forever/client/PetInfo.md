# Cliente Forever 70938: PetInfo

Documento PetInfoDocumentation.lua; SHA256 f6fd0e548fa15b7ff1d135215456c027f2e2f3fdeff7fbd3a8b9dbec0a154b04. Coincide exatamente com a referência Gethe já versionada.

Tipo System; namespace C_PetInfo. ScriptObject indica métodos, não globals. Catálogo factual completo em knowledge/client/api-signatures.json, incluindo restrições e nilabilidade. Null significa não especificado. Todas as funções continuam UNVERIFIED no jogo.

C_PetInfo.CanPetEatItem(itemID:number) -> canEat:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_PetInfo.GetPetFoodTypes() -> foodTypes:table. SecretArguments=null; HasRestrictions=null.
C_PetInfo.GetPetHappiness() -> happiness:number, damagePercentage:number, loyaltyRate:number. SecretArguments=null; HasRestrictions=null.
C_PetInfo.GetPetLoyalty() -> loyaltyName:string. SecretArguments=null; HasRestrictions=null.
C_PetInfo.GetPetTalentTree() -> talentTreeName:stringView. SecretArguments=null; HasRestrictions=null.
C_PetInfo.GetPetTamersForMap(uiMapID:number) -> petTamers:table. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_PetInfo.GetPetTrainingPoints() -> totalPoints:number, usedPoints:number. SecretArguments=null; HasRestrictions=null.
C_PetInfo.GetPetUIModelSceneID() -> modelSceneID:number. SecretArguments=null; HasRestrictions=null.
C_PetInfo.GetSpellForPetAction(actionID:number) -> spellID:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_PetInfo.IsPetActionPassive(actionID:number) -> isPassive:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_PetInfo.IsPetOrderMoveToPending() -> isPetOrderMoveToPending:bool. SecretArguments=null; HasRestrictions=null.
C_PetInfo.PetAbandon(petNumber:number?) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_PetInfo.PetAssistMode() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
C_PetInfo.PetRename(name:cstring, petNumber:number?, declensions:table?) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
