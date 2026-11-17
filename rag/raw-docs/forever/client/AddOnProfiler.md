# Cliente Forever 70938: AddOnProfiler

Documento AddOnProfilerDocumentation.lua; SHA256 a43d1e6dcf099c9118ef1c01fdeaab66787feb4adb8daf897888f73f24545489. Extraído do CASC local selecionado por manifesto.

Tipo System; namespace C_AddOnProfiler. ScriptObject indica métodos, não globals. Catálogo factual completo em knowledge/client/api-signatures.json, incluindo restrições e nilabilidade. Null significa não especificado. Todas as funções continuam UNVERIFIED no jogo.

C_AddOnProfiler.AddMeasuredCallEvent(name:stringView) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOnProfiler.AddPerformanceMessageShown(msg:AddOnPerformanceMessage) -> sem retorno declarado. SecretArguments="AllowedWhenUntainted"; HasRestrictions=true.
C_AddOnProfiler.CheckForPerformanceMessage() -> msg:AddOnPerformanceMessage. SecretArguments=null; HasRestrictions=null.
C_AddOnProfiler.GetAddOnMetric(name:cstring, metric:AddOnProfilerMetric) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOnProfiler.GetApplicationMetric(metric:AddOnProfilerMetric) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOnProfiler.GetOverallMetric(metric:AddOnProfilerMetric) -> result:number. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOnProfiler.GetTicksPerSecond() -> frequency:BigInteger. SecretArguments=null; HasRestrictions=null.
C_AddOnProfiler.GetTopKAddOnsForMetric(metric:AddOnProfilerMetric, k:number) -> results:table. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
C_AddOnProfiler.IsEnabled() -> enabled:bool. SecretArguments=null; HasRestrictions=null.
C_AddOnProfiler.MeasureCall(func:LuaValueVariant, arguments:LuaValueVariant) -> results:AddOnProfilerCallResults, returns:LuaValueVariant. SecretArguments="AllowedWhenUntainted"; HasRestrictions=null.
