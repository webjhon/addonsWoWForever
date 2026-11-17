# Cliente Forever 70938: SimpleTextureBaseAPI

Documento SimpleTextureBaseAPIDocumentation.lua; SHA256 e4ccf4dbc0458473f5f31f69986e7aa12171bfa7359a32f7b884b2edfd6bff00. Extraído do CASC local selecionado por manifesto.

Tipo ScriptObject; namespace nenhum. ScriptObject indica métodos, não globals. Catálogo factual completo em knowledge/client/api-signatures.json, incluindo restrições e nilabilidade. Null significa não especificado. Todas as funções continuam UNVERIFIED no jogo.

SimpleTextureBaseAPI.ClearRadialProgressBar() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.ClearSVG() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.ClearTextureSlice() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.ClearVertexOffsets() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.GetAtlas() -> atlas:textureAtlas. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.GetBlendMode() -> blendMode:BlendMode. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.GetDesaturation() -> desaturation:normalizedValue. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.GetHorizTile() -> tiling:bool. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.GetRadialProgressBarEndOffset() -> offset:normalizedValue. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.GetRadialProgressBarFeather() -> feather:normalizedValue. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.GetRadialProgressBarPercent() -> percent:normalizedValue. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.GetRadialProgressBarReverse() -> reverse:bool. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.GetRadialProgressBarStartOffset() -> offset:normalizedValue. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.GetRotation() -> radians:number, normalizedRotationPoint:vector2. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.GetTexCoord() -> ulX:number, ulY:number, llX:number, llY:number, urX:number, urY:number, lrX:number, lrY:number. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.GetTexelSnappingBias() -> bias:normalizedValue. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.GetTexture() -> textureFile:cstring?. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.GetTextureFileID() -> textureFile:fileID. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.GetTextureFilePath() -> textureFile:cstring?. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.GetTextureSliceMargins() -> left:number, top:number, right:number, bottom:number. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.GetTextureSliceMode() -> sliceMode:UITextureSliceMode. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.GetVertTile() -> tiling:bool. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.GetVertexOffset(vertexIndex:luaIndex) -> offsetX:uiUnit, offsetY:uiUnit. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleTextureBaseAPI.IsBlockingLoadRequested() -> blocking:bool. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.IsDesaturated() -> desaturated:bool. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.IsSnappingToPixelGrid() -> snap:bool. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.ResetTexCoord() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
SimpleTextureBaseAPI.SetAtlas(atlas:textureAtlas, useAtlasSize:bool, filterMode:FilterMode?, resetTexCoords:bool?, wrapModeHorizontal:cstring?, wrapModeVertical:cstring?) -> sem retorno declarado. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetBlendMode(blendMode:BlendMode) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetBlockingLoadsRequested(blocking:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetColorTexture(colorR:number, colorG:number, colorB:number, a:SingleColorValue?) -> sem retorno declarado. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetDesaturated(desaturated:bool) -> sem retorno declarado. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetDesaturation(desaturation:normalizedValue) -> sem retorno declarado. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetGradient(orientation:Orientation, minColor:colorRGBA, maxColor:colorRGBA) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetHorizTile(tiling:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetMask(file:cstring) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetRadialProgressBarEndOffset(offset:normalizedValue) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetRadialProgressBarFeather(feather:normalizedValue) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetRadialProgressBarPercent(percent:normalizedValue) -> sem retorno declarado. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetRadialProgressBarReverse(reverse:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetRadialProgressBarStartOffset(offset:normalizedValue) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetRotation(radians:number, normalizedRotationPoint:vector2?) -> sem retorno declarado. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetSVG(svgAsset:FileAsset) -> success:bool. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetSnapToPixelGrid(snap:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetSpriteSheetCell(cell:luaIndex, numRows:number, numColumns:number, cellWidth:number?, cellHeight:number?) -> sem retorno declarado. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetTexCoord(left:number, right:number, bottom:number, top:number) -> sem retorno declarado. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetTexelSnappingBias(bias:normalizedValue) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetTexture(textureAsset:cstring?, wrapModeHorizontal:cstring?, wrapModeVertical:cstring?, filterMode:cstring?) -> success:bool. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetTextureSliceMargins(left:number, top:number, right:number, bottom:number) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetTextureSliceMode(sliceMode:UITextureSliceMode) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetVertTile(tiling:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleTextureBaseAPI.SetVertexOffset(vertexIndex:luaIndex, offsetX:uiUnit, offsetY:uiUnit) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
