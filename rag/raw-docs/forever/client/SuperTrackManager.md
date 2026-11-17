# Cliente Forever 70938: SuperTrackManager

Documento SuperTrackManagerDocumentation.lua; SHA256 4fe3b1216557a520d9c6f653fe8acca2b03fa650d5405869eea819d0010e4884. Coincide exatamente com a referência Gethe já versionada.

Tipo System; namespace C_SuperTrack. ScriptObject indica métodos, não globals. Catálogo factual completo em knowledge/client/api-signatures.json, incluindo restrições e nilabilidade. Null significa não especificado. Todas as funções continuam UNVERIFIED no jogo.

C_SuperTrack.ClearAllSuperTracked() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
C_SuperTrack.ClearSuperTrackedContent() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
C_SuperTrack.ClearSuperTrackedMapPin() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
C_SuperTrack.GetHighestPrioritySuperTrackingType() -> type:SuperTrackingType?. SecretArguments=null; HasRestrictions=null.
C_SuperTrack.GetSuperTrackedContent() -> trackableType:ContentTrackingType, trackableID:number. SecretArguments=null; HasRestrictions=null.
C_SuperTrack.GetSuperTrackedItemName() -> name:string, description:string. SecretArguments=null; HasRestrictions=null.
C_SuperTrack.GetSuperTrackedMapPin() -> type:SuperTrackingMapPinType, typeID:number. SecretArguments=null; HasRestrictions=null.
C_SuperTrack.GetSuperTrackedQuestID() -> questID:number?. SecretArguments=null; HasRestrictions=null.
C_SuperTrack.GetSuperTrackedVignette() -> vignetteGUID:WOWGUID?. SecretArguments=null; HasRestrictions=null.
C_SuperTrack.IsSuperTrackingAnything() -> isSuperTracking:bool. SecretArguments=null; HasRestrictions=null.
C_SuperTrack.IsSuperTrackingContent() -> isSuperTracking:bool. SecretArguments=null; HasRestrictions=null.
C_SuperTrack.IsSuperTrackingCorpse() -> isSuperTracking:bool. SecretArguments=null; HasRestrictions=null.
C_SuperTrack.IsSuperTrackingMapPin() -> isSuperTracking:bool. SecretArguments=null; HasRestrictions=null.
C_SuperTrack.IsSuperTrackingQuest() -> isSuperTracking:bool. SecretArguments=null; HasRestrictions=null.
C_SuperTrack.IsSuperTrackingUserWaypoint() -> isSuperTracking:bool. SecretArguments=null; HasRestrictions=null.
C_SuperTrack.SetSuperTrackedContent(trackableType:ContentTrackingType, trackableID:number) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SuperTrack.SetSuperTrackedMapPin(type:SuperTrackingMapPinType, typeID:number) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SuperTrack.SetSuperTrackedQuestID(questID:number) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SuperTrack.SetSuperTrackedUserWaypoint(superTracked:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_SuperTrack.SetSuperTrackedVignette(vignetteGUID:WOWGUID) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
