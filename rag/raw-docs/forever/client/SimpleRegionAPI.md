# Cliente Forever 70938: SimpleRegionAPI

Documento SimpleRegionAPIDocumentation.lua; SHA256 f311fdf12572f2a32df67c3a0cd11195bc699a6f3872dd69f8300cd542bcfbd0. Extraído do CASC local selecionado por manifesto.

Tipo ScriptObject; namespace nenhum. ScriptObject indica métodos, não globals. Catálogo factual completo em knowledge/client/api-signatures.json, incluindo restrições e nilabilidade. Null significa não especificado. Todas as funções continuam UNVERIFIED no jogo.

SimpleRegionAPI.GetAlpha() -> alpha:SingleColorValue. SecretArguments=null; HasRestrictions=null.
SimpleRegionAPI.GetDrawLayer() -> layer:DrawLayer, sublayer:number. SecretArguments=null; HasRestrictions=null.
SimpleRegionAPI.GetEffectiveScale() -> effectiveScale:number. SecretArguments=null; HasRestrictions=null.
SimpleRegionAPI.GetScale() -> scale:number. SecretArguments=null; HasRestrictions=null.
SimpleRegionAPI.GetVertexColor() -> colorR:number, colorG:number, colorB:number, colorA:number. SecretArguments=null; HasRestrictions=null.
SimpleRegionAPI.IsIgnoringParentAlpha() -> isIgnoring:bool. SecretArguments=null; HasRestrictions=null.
SimpleRegionAPI.IsIgnoringParentScale() -> isIgnoring:bool. SecretArguments=null; HasRestrictions=null.
SimpleRegionAPI.IsObjectLoaded() -> isLoaded:bool. SecretArguments=null; HasRestrictions=null.
SimpleRegionAPI.SetAlpha(alpha:SingleColorValue) -> sem retorno declarado. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
SimpleRegionAPI.SetAlphaFromBoolean(value:bool, alphaIfTrue:SingleColorValue, alphaIfFalse:SingleColorValue) -> sem retorno declarado. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
SimpleRegionAPI.SetDrawLayer(layer:DrawLayer, sublevel:number) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleRegionAPI.SetIgnoreParentAlpha(ignore:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleRegionAPI.SetIgnoreParentScale(ignore:bool) -> sem retorno declarado. SecretArguments="NotAllowed"; HasRestrictions=null.
SimpleRegionAPI.SetScale(scale:number) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleRegionAPI.SetVertexColor(colorR:number, colorG:number, colorB:number, a:SingleColorValue?) -> sem retorno declarado. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
SimpleRegionAPI.SetVertexColorFromBoolean(value:bool, colorIfTrue:colorRGBA, colorIfFalse:colorRGBA) -> sem retorno declarado. SecretArguments="AllowedWhenTainted"; HasRestrictions=null.
