# Cliente Forever 70938: MapUI

Documento MapDocumentation.lua; SHA256 b73a2ed1d1552c1b38bc59df0a586a0986dfad54991efc905abc87799cecce57. Coincide exatamente com a referência Gethe já versionada.

Tipo System; namespace C_Map. ScriptObject indica métodos, não globals. Catálogo factual completo em knowledge/client/api-signatures.json, incluindo restrições e nilabilidade. Null significa não especificado. Todas as funções continuam UNVERIFIED no jogo.

C_Map.CanSetUserWaypointOnMap(uiMapID:number) -> canSet:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.ClearUserWaypoint() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
C_Map.CloseWorldMapInteraction() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
C_Map.GetAreaInfo(areaID:number) -> name:cstring. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetBestMapForUnit(unitToken:UnitToken) -> uiMapID:number?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetBountySetMaps(bountySetID:number) -> mapIDs:table. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetFallbackWorldMapID() -> uiMapID:number. SecretArguments=null; HasRestrictions=null.
C_Map.GetMapArtBackgroundAtlas(uiMapID:number) -> atlasName:textureAtlas. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetMapArtHelpTextPosition(uiMapID:number) -> position:MapCanvasPosition. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetMapArtID(uiMapID:number) -> uiMapArtID:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetMapArtLayerTextures(uiMapID:number, layerIndex:luaIndex) -> textures:table. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetMapArtLayers(uiMapID:number) -> layerInfo:table. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetMapArtZoneTextPosition(uiMapID:number) -> position:MapCanvasPosition. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetMapBannersForMap(uiMapID:number) -> mapBanners:table. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetMapChildrenInfo(uiMapID:number, mapType:UIMapType?, allDescendants:bool?) -> info:table. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetMapDisplayInfo(uiMapID:number) -> hideIcons:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetMapGroupID(uiMapID:number) -> uiMapGroupID:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetMapGroupMembersInfo(uiMapGroupID:number) -> info:table. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetMapHighlightInfoAtPosition(uiMapID:number, x:number, y:number) -> fileDataID:fileID, atlasID:textureAtlas, texturePercentageX:number, texturePercentageY:number, textureX:number, textureY:number, scrollChildX:number, scrollChildY:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetMapHighlightPulseInfo(uiMapID:number) -> fileDataID:fileID, atlasID:textureAtlas, texturePercentageX:number, texturePercentageY:number, textureX:number, textureY:number, scrollChildX:number, scrollChildY:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetMapInfo(uiMapID:number) -> info:UiMapDetails. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetMapInfoAtPosition(uiMapID:number, x:number, y:number, ignoreZoneMapPositionData:bool?) -> info:UiMapDetails. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetMapLevels(uiMapID:number) -> playerMinLevel:number, playerMaxLevel:number, petMinLevel:number, petMaxLevel:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetMapLinksForMap(uiMapID:number) -> mapLinks:table. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetMapPosFromWorldPos(continentID:number, worldPosition:vector2, overrideUiMapID:number?) -> uiMapID:number, mapPosition:vector2. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetMapRectOnMap(uiMapID:number, topUiMapID:number) -> minX:number, maxX:number, minY:number, maxY:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetMapWorldSize(uiMapID:number) -> width:number, height:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetPlayerMapPosition(uiMapID:number, unitToken:UnitToken) -> position:vector2?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetUserWaypoint() -> point:UiMapPoint. SecretArguments=null; HasRestrictions=null.
C_Map.GetUserWaypointFromHyperlink(hyperlink:string) -> point:UiMapPoint. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetUserWaypointHyperlink() -> hyperlink:string. SecretArguments=null; HasRestrictions=null.
C_Map.GetUserWaypointPositionForMap(uiMapID:number) -> mapPosition:vector2. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.GetWorldPosFromMapPos(uiMapID:number, mapPosition:vector2) -> continentID:number, worldPosition:vector2. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.HasUserWaypoint() -> hasUserWaypoint:bool. SecretArguments=null; HasRestrictions=null.
C_Map.IsCityMap(uiMapID:number) -> isCityMap:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.IsMapValidForNavBarDropdown(uiMapID:number) -> isValid:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.MapHasArt(uiMapID:number) -> hasArt:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.OpenWorldMap(uiMapID:number?) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=true.
C_Map.RequestPreloadMap(uiMapID:number) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_Map.SetUserWaypoint(point:UiMapPoint) -> wasSet:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
