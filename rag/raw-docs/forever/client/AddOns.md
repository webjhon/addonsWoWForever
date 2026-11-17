# Cliente Forever 70938: AddOns

Documento AddOnsDocumentation.lua; SHA256 8535c5ab5e2a2a4f2ad9e14a355a619d4e12fa2b975e28bda01da6eb6580db75. Extraído do CASC local selecionado por manifesto.

Tipo System; namespace C_AddOns. ScriptObject indica métodos, não globals. Catálogo factual completo em knowledge/client/api-signatures.json, incluindo restrições e nilabilidade. Null significa não especificado. Todas as funções continuam UNVERIFIED no jogo.

C_AddOns.DisableAddOn(name:uiAddon, character:cstring) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.DisableAllAddOns(character:cstring?) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.DoesAddOnExist(name:uiAddon) -> exists:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.DoesAddOnHaveLoadError(name:uiAddon) -> hadError:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.EnableAddOn(name:uiAddon, character:cstring) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.EnableAllAddOns(character:cstring?) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.GetAddOnDependencies(name:uiAddon) -> deps:cstring. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.GetAddOnEnableState(name:uiAddon, character:cstring) -> state:AddOnEnableState. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.GetAddOnInfo(name:uiAddon) -> name:cstring, title:cstring, notes:cstring, loadable:bool, reason:cstring, security:cstring. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.GetAddOnInterfaceVersion(name:uiAddon) -> interfaceVersion:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.GetAddOnLocalTable(name:uiAddon) -> table:LuaValueVariant. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.GetAddOnMetadata(name:uiAddon, variable:cstring) -> value:cstring. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.GetAddOnName(index:uiAddon) -> name:cstring. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.GetAddOnNotes(name:uiAddon) -> notes:cstring. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.GetAddOnOptionalDependencies(name:uiAddon) -> deps:cstring. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.GetAddOnSecurity(name:uiAddon) -> security:AddOnSecurityStatus. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.GetAddOnTitle(name:uiAddon) -> title:cstring. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.GetNumAddOns() -> numAddOns:number. SecretArguments=null; HasRestrictions=null.
C_AddOns.GetScriptsDisallowedForBeta() -> disallowed:bool. SecretArguments=null; HasRestrictions=null.
C_AddOns.IsAddOnDefaultEnabled(name:uiAddon) -> defaultEnabled:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.IsAddOnLoadOnDemand(name:uiAddon) -> loadOnDemand:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.IsAddOnLoadable(name:uiAddon, character:cstring, demandLoaded:bool) -> loadable:bool, reason:cstring. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.IsAddOnLoaded(name:uiAddon) -> loadedOrLoading:bool, loaded:bool. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.IsAddonVersionCheckEnabled() -> isEnabled:bool. SecretArguments=null; HasRestrictions=null.
C_AddOns.LoadAddOn(name:uiAddon) -> loaded:bool?, value:string?. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOns.ResetAddOns() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
C_AddOns.ResetDisabledAddOns() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
C_AddOns.SaveAddOns() -> sem retorno declarado. SecretArguments=null; HasRestrictions=null.
C_AddOns.SetAddonVersionCheck(enabled:bool) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
