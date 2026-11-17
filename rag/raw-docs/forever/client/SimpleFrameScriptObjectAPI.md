# Cliente Forever 70938: SimpleFrameScriptObjectAPI

Documento SimpleFrameScriptObjectAPIDocumentation.lua; SHA256 09c85f7ee160d6f4d39765ba92a93ccd112d9e578b48d6f99b79f65e2ec42b1d. Extraído do CASC local selecionado por manifesto.

Tipo ScriptObject; namespace nenhum. ScriptObject indica métodos, não globals. Catálogo factual completo em knowledge/client/api-signatures.json, incluindo restrições e nilabilidade. Null significa não especificado. Todas as funções continuam UNVERIFIED no jogo.

SimpleFrameScriptObjectAPI.AddAccessRestrictions(restrictions:ScriptObjectAccessRestriction) -> sem retorno declarado. SecretArguments="NotAllowed"; HasRestrictions=true.
SimpleFrameScriptObjectAPI.AddForbiddenAspects(aspects:ForbiddenAspect) -> sem retorno declarado. SecretArguments="NotAllowed"; HasRestrictions=true.
SimpleFrameScriptObjectAPI.AddSecretAspect(aspect:SecretAspect) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=true.
SimpleFrameScriptObjectAPI.CanBeAccessedInContext() -> canAccess:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameScriptObjectAPI.GetAccessRestrictions() -> restrictions:ScriptObjectAccessRestriction. SecretArguments=null; HasRestrictions=null.
SimpleFrameScriptObjectAPI.GetForbiddenAspects() -> aspects:ForbiddenAspect. SecretArguments=null; HasRestrictions=null.
SimpleFrameScriptObjectAPI.GetInheritableForbiddenAspects(path:ScriptObjectPropagationPath) -> aspects:ForbiddenAspect. SecretArguments="NotAllowed"; HasRestrictions=null.
SimpleFrameScriptObjectAPI.GetName() -> name:cstring. SecretArguments=null; HasRestrictions=null.
SimpleFrameScriptObjectAPI.GetObjectTable() -> objectTable:FrameScriptObject. SecretArguments=null; HasRestrictions=null.
SimpleFrameScriptObjectAPI.GetObjectType() -> objectType:cstring. SecretArguments=null; HasRestrictions=null.
SimpleFrameScriptObjectAPI.HasAccessConstraints() -> hasAccessConstraints:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameScriptObjectAPI.HasAnyAccessRestrictions(restrictions:ScriptObjectAccessRestriction?) -> hasAnyAccessRestriction:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameScriptObjectAPI.HasAnyForbiddenAspects(aspects:ForbiddenAspect?) -> hasAnyForbiddenAspect:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameScriptObjectAPI.HasAnySecretAspect() -> hasSecretAspect:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameScriptObjectAPI.HasSecretAspect(aspect:SecretAspect) -> hasSecretAspect:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameScriptObjectAPI.HasSecretValues() -> hasSecretValues:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameScriptObjectAPI.IsForbidden() -> isForbidden:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameScriptObjectAPI.IsObjectType(objectType:cstring) -> isType:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
SimpleFrameScriptObjectAPI.IsPreventingSecretValues() -> isPreventingSecretValues:bool. SecretArguments=null; HasRestrictions=null.
SimpleFrameScriptObjectAPI.SetForbidden() -> sem retorno declarado. SecretArguments=null; HasRestrictions=true.
SimpleFrameScriptObjectAPI.SetToDefaults() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
