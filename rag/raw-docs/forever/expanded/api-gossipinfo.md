# Diálogo de NPC: ofertas de quests e limites de elegibilidade

Escopo: Alliance1–60, interface16001. Snapshot documental bebcb6bf309cf41b41bd74f8ca651e6a105b2676. Runtime das funções abaixo permanece UNVERIFIED até teste específico.

## Contexto de produto

As ofertas de um diálogo aberto descrevem aquele NPC naquele momento; não são a lista universal de quests possíveis. Distinguir oferta observada, catálogo potencial e quest já no diário. Pré-requisitos desconhecidos não podem virar elegibilidade garantida.

## Reconciliação e falhas

Ao abrir diálogo, atualizar ofertas públicas. Aceitação é detectada pelo evento e diário, não por botão de confirmar no addon. Uma lista vazia pode significar que o NPC não oferece missão naquele contexto; não inventar oferta nem aceitar automaticamente.

## Contrato: C_GossipInfo.GetAvailableQuests

Argumentos: nenhum declarado no snapshot. Retornos: info: table. Pode não retornar valores: não declarado. SecretArguments: não declarado. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/GossipInfoDocumentation.lua.

## Contrato: C_GossipInfo.GetActiveQuests

Argumentos: nenhum declarado no snapshot. Retornos: info: table. Pode não retornar valores: não declarado. SecretArguments: não declarado. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/GossipInfoDocumentation.lua.

## Critérios mínimos de validação

Testar valor ausente/secreto, evento duplicado, reload, desativação e recuperação. Preservar intenção do personagem sem salvar uma falsa conclusão. Mock valida transições; cliente real valida legibilidade, disponibilidade de dados e restrições. Registrar o cenário observado e o que não foi executado.
