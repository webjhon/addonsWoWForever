# Cliente Forever 70938: NamePlate

Documento NamePlateDocumentation.lua; SHA256 1af6fb8f2428211ce696b2af18d09503116a12920d28ca76231bedb72a88292c. Coincide exatamente com a referência Gethe já versionada.

Tipo System; namespace C_NamePlate. ScriptObject indica métodos, não globals. Catálogo factual completo em knowledge/client/api-signatures.json, incluindo restrições e nilabilidade. Null significa não especificado. Todas as funções continuam UNVERIFIED no jogo.

C_NamePlate.GetNamePlateForUnit(unitToken:UnitTokenNamePlate, includeForbidden:bool) -> nameplate:NamePlateFrame. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_NamePlate.GetNamePlateSize() -> width:uiUnit, height:uiUnit. SecretArguments=null; HasRestrictions=null.
C_NamePlate.GetNamePlates() -> nameplates:table. SecretArguments=null; HasRestrictions=null.
C_NamePlate.SetNamePlateSize(width:uiUnit, height:uiUnit) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=true.
