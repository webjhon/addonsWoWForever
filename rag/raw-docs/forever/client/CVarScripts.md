# Cliente Forever 70938: CVarScripts

Documento CVarDocumentation.lua; SHA256 7e99fe35756236ecf6d723ff755edaefd7c41007ef53f58d48e2d2f6899296b1. Extraído do CASC local selecionado por manifesto.

Tipo System; namespace C_CVar. ScriptObject indica métodos, não globals. Catálogo factual completo em knowledge/client/api-signatures.json, incluindo restrições e nilabilidade. Null significa não especificado. Todas as funções continuam UNVERIFIED no jogo.

C_CVar.AreCVarsLoaded() -> loaded:bool. SecretArguments=null; HasRestrictions=null.
C_CVar.GetCVar(name:cstring) -> value:string?. SecretArguments="NotAllowed"; HasRestrictions=null.
C_CVar.GetCVarBitfield(name:cstring, index:luaIndex) -> value:bool?. SecretArguments="NotAllowed"; HasRestrictions=null.
C_CVar.GetCVarBool(name:cstring) -> value:bool?. SecretArguments="NotAllowed"; HasRestrictions=null.
C_CVar.GetCVarDefault(name:cstring) -> defaultValue:string?. SecretArguments="NotAllowed"; HasRestrictions=null.
C_CVar.GetCVarInfo(name:cstring) -> value:cstring, defaultValue:cstring, isStoredServerAccount:bool, isStoredServerCharacter:bool, isLockedFromUser:bool, isSecure:bool, isReadOnly:bool. SecretArguments="NotAllowed"; HasRestrictions=null.
C_CVar.RegisterCVar(name:cstring, value:cstring?) -> sem retorno declarado. SecretArguments="NotAllowed"; HasRestrictions=null.
C_CVar.RemoveTempCVar(name:cstring) -> sem retorno declarado. SecretArguments="NotAllowed"; HasRestrictions=null.
C_CVar.ResetTestCVars() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
C_CVar.SetCVar(name:cstring, value:cstring?) -> success:bool. SecretArguments="NotAllowed"; HasRestrictions=null.
C_CVar.SetCVarBitfield(name:cstring, index:luaIndex, value:bool) -> success:bool. SecretArguments="NotAllowed"; HasRestrictions=null.
C_CVar.SetTempCVar(name:cstring, value:cstring?) -> sem retorno declarado. SecretArguments="NotAllowed"; HasRestrictions=null.
