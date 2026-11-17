# Cliente Forever 70938: Instance

Documento InstanceDocumentation.lua; SHA256 136d6554c346ce090324ac905e086a149a7b7f6a23193c03262a17a0ee85719f. Coincide exatamente com a referência Gethe já versionada.

Tipo System; namespace nenhum. ScriptObject indica métodos, não globals. Catálogo factual completo em knowledge/client/api-signatures.json, incluindo restrições e nilabilidade. Null significa não especificado. Todas as funções continuam UNVERIFIED no jogo.

CanChangePlayerDifficulty() -> canChange:bool, notOnCooldown:bool. SecretArguments=null; HasRestrictions=null.
CanMapChangeDifficulty(mapID:number?) -> canChange:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
CanShowResetInstances() -> result:bool. SecretArguments=null; HasRestrictions=null.
GetBaseDifficultyID(difficultyID:number) -> baseDifficultyID:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
GetDifficultyInfo(difficultyID:number) -> name:cstring, instanceType:cstring, isHeroic:bool, isChallengeMode:bool, displayHeroic:bool, displayMythic:bool, toggleDifficultyID:number?, isLFR:bool, minPlayers:number?, maxPlayers:number?, isUserSelectable:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
GetDungeonDifficultyID() -> result:number. SecretArguments=null; HasRestrictions=null.
GetInstanceBootTimeRemaining() -> result:number. SecretArguments=null; HasRestrictions=null.
GetInstanceInfo() -> name:cstring, instanceType:cstring, difficultyID:number, difficultyName:cstring, maxPlayers:number, dynamicDifficulty:number, isDynamic:bool?, instanceID:number, instanceGroupSize:number, lfgDungeonID:number?, hasWorldTier:bool. SecretArguments=null; HasRestrictions=null.
GetInstanceLockTimeRemaining() -> timeLeft:number, extending:bool, encountersTotal:number, encountersCompleted:number. SecretArguments=null; HasRestrictions=null.
GetInstanceLockTimeRemainingEncounter(encounterIndex:luaIndex) -> encounterName:cstring, texture:cstring, isKilled:bool, ineligible:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
GetLegacyRaidDifficultyID() -> result:number?. SecretArguments=null; HasRestrictions=null.
GetRaidDifficultyID() -> result:number?. SecretArguments=null; HasRestrictions=null.
IsInInstance() -> isInInstance:bool, instanceType:cstring. SecretArguments=null; HasRestrictions=null.
IsLegacyDifficulty(difficultyID:number) -> result:bool?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
ResetInstances() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
SetDungeonDifficultyID(difficultyID:number) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SetLegacyRaidDifficultyID(difficultyID:number, force:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SetRaidDifficultyID(difficultyID:number, force:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
