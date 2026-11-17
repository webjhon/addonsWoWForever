# Diário de quests: aceitação, objetivos e entrega

Escopo: Alliance e Horde1–60, interface16001. Snapshot documental bebcb6bf309cf41b41bd74f8ca651e6a105b2676. Runtime das funções abaixo permanece UNVERIFIED até teste específico.

## Contexto de produto

O diário é a fonte de progresso, não os cliques no painel. Diferenciar quest não aceita, ativa com objetivos pendentes, pronta para entregar, entregue, falhou e dados indisponíveis. Uma quest que some pode ter sido abandonada; isso não prova entrega. O resultado booleano de relação de unidade com quest não identifica qual quest.

## Reconciliação e falhas

Aceitação e alterações do diário disparam reconciliação. Após reload releia IDs e objetivos; eventos fora de ordem e repetidos devem ser idempotentes. Não concluir por proximidade, por morrer o NPC nem por marcar um checkbox.

## Contrato: C_QuestLog.GetNumQuestLogEntries

Argumentos: nenhum declarado no snapshot. Retornos: numShownEntries: number; numQuests: number. Pode não retornar valores: não declarado. SecretArguments: não declarado. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/QuestLogDocumentation.lua.

## Contrato: C_QuestLog.GetInfo

Argumentos: questLogIndex: luaIndex. Retornos: info: QuestInfo (pode ser nil). Pode não retornar valores: não declarado. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/QuestLogDocumentation.lua.

## Contrato: C_QuestLog.GetQuestObjectives

Argumentos: questID: number. Retornos: objectives: table. Pode não retornar valores: true. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/QuestLogDocumentation.lua.

## Contrato: C_QuestLog.IsComplete

Argumentos: questID: number. Retornos: isComplete: bool. Pode não retornar valores: não declarado. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/QuestLogDocumentation.lua.

## Contrato: C_QuestLog.IsFailed

Argumentos: questID: number. Retornos: isFailed: bool. Pode não retornar valores: não declarado. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/QuestLogDocumentation.lua.

## Contrato: C_QuestLog.IsQuestFlaggedCompleted

Argumentos: questID: number. Retornos: isCompleted: bool. Pode não retornar valores: não declarado. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/QuestLogDocumentation.lua.

## Contrato: C_QuestLog.UnitIsRelatedToActiveQuest

Argumentos: unit: UnitToken. Retornos: isRelatedToActiveQuest: bool. Pode não retornar valores: não declarado. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/QuestLogDocumentation.lua.

## Contrato: C_QuestLog.GetNextWaypoint

Argumentos: questID: number. Retornos: mapID: number; x: number; y: number. Pode não retornar valores: true. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/QuestLogDocumentation.lua.

## Contrato: C_QuestLog.GetNextWaypointForMap

Argumentos: questID: number; uiMapID: number. Retornos: x: number; y: number. Pode não retornar valores: true. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/QuestLogDocumentation.lua.

## Contrato: C_QuestLog.GetNextWaypointText

Argumentos: questID: number. Retornos: waypointText: string. Pode não retornar valores: true. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/QuestLogDocumentation.lua.

## Critérios mínimos de validação

Testar valor ausente/secreto, evento duplicado, reload, desativação e recuperação. Preservar intenção do personagem sem salvar uma falsa conclusão. Mock valida transições; cliente real valida legibilidade, disponibilidade de dados e restrições. Registrar o cenário observado e o que não foi executado.
