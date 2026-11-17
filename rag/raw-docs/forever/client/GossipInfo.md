# Cliente Forever 70938: GossipInfo

Documento GossipInfoDocumentation.lua; SHA256 22cd6a48eded91316753af2e40624e542a91c728c713636549b7d3a6ef7916a5. Coincide exatamente com a referência Gethe já versionada.

Tipo System; namespace C_GossipInfo. ScriptObject indica métodos, não globals. Catálogo factual completo em knowledge/client/api-signatures.json, incluindo restrições e nilabilidade. Null significa não especificado. Todas as funções continuam UNVERIFIED no jogo.

C_GossipInfo.CloseGossip() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
C_GossipInfo.ForceGossip() -> forceGossip:bool. SecretArguments=null; HasRestrictions=null.
C_GossipInfo.GetActiveQuests() -> info:table. SecretArguments=null; HasRestrictions=null.
C_GossipInfo.GetAvailableQuests() -> info:table. SecretArguments=null; HasRestrictions=null.
C_GossipInfo.GetCompletedOptionDescriptionString() -> description:string?. SecretArguments=null; HasRestrictions=null.
C_GossipInfo.GetCustomGossipDescriptionString() -> description:string?. SecretArguments=null; HasRestrictions=null.
C_GossipInfo.GetFriendshipReputation(friendshipFactionID:number) -> reputationInfo:FriendshipReputationInfo. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_GossipInfo.GetFriendshipReputationRanks(friendshipFactionID:number) -> rankInfo:FriendshipReputationRankInfo. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_GossipInfo.GetNumActiveQuests() -> numQuests:number. SecretArguments=null; HasRestrictions=null.
C_GossipInfo.GetNumAvailableQuests() -> numQuests:number. SecretArguments=null; HasRestrictions=null.
C_GossipInfo.GetOptionUIWidgetSetsAndTypesByOptionID(gossipOptionID:number) -> gossipOptionUIWidgetSetsAndTypes:table?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_GossipInfo.GetOptions() -> info:table. SecretArguments=null; HasRestrictions=null.
C_GossipInfo.GetPoiForUiMapID(uiMapID:number) -> gossipPoiID:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_GossipInfo.GetPoiInfo(uiMapID:number, gossipPoiID:number) -> gossipPoiInfo:GossipPoiInfo?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_GossipInfo.GetText() -> gossipText:cstring. SecretArguments=null; HasRestrictions=null.
C_GossipInfo.RefreshOptions() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
C_GossipInfo.SelectActiveQuest(optionID:number) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_GossipInfo.SelectAvailableQuest(optionID:number) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_GossipInfo.SelectOption(optionID:number, text:cstring?, confirmed:bool?) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_GossipInfo.SelectOptionByIndex(optionID:number, text:cstring?, confirmed:bool?) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
