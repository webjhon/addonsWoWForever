# Rastreamento opcional: respeitar o destino do jogador

Escopo: Alliance1–60, interface16001. Snapshot documental bebcb6bf309cf41b41bd74f8ca651e6a105b2676. Runtime das funções abaixo permanece UNVERIFIED até teste específico.

## Contexto de produto

O rastreamento do jogo é opcional; não substitui uma seta própria. O jogador pode já estar rastreando outro objetivo. Não tomar posse silenciosamente do destino nem limpar um marcador que não pertence ao addon.

## Reconciliação e falhas

Manter intenção própria separada de rastreamento externo. Se houver integração, guardar o que foi definido pelo addon e liberar apenas isso quando desativado. Ausência desta API não deve transformar o produto em lista estática.

## Contrato: C_SuperTrack.GetSuperTrackedQuestID

Argumentos: nenhum declarado no snapshot. Retornos: questID: number (pode ser nil). Pode não retornar valores: não declarado. SecretArguments: não declarado. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/SuperTrackManagerDocumentation.lua.

## Contrato: C_SuperTrack.SetSuperTrackedQuestID

Argumentos: questID: number. Retornos: nenhum declarado no snapshot. Pode não retornar valores: não declarado. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/SuperTrackManagerDocumentation.lua.

## Contrato: C_SuperTrack.IsSuperTrackingAnything

Argumentos: nenhum declarado no snapshot. Retornos: isSuperTracking: bool. Pode não retornar valores: não declarado. SecretArguments: não declarado. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/SuperTrackManagerDocumentation.lua.

## Critérios mínimos de validação

Testar valor ausente/secreto, evento duplicado, reload, desativação e recuperação. Preservar intenção do personagem sem salvar uma falsa conclusão. Mock valida transições; cliente real valida legibilidade, disponibilidade de dados e restrições. Registrar o cenário observado e o que não foi executado.
