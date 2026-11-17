# Inventário e coleta: itens, slots e objetivos

Escopo: Alliance e Horde1–60, interface16001. Snapshot documental bebcb6bf309cf41b41bd74f8ca651e6a105b2676. Runtime das funções abaixo permanece UNVERIFIED até teste específico.

## Contexto de produto

Quantidade no inventário e objetivo de quest podem representar coisas distintas. Um item pode pertencer a outra missão, estar no banco ou não ter sido contado ainda. IDs, tipos e ordinais de objetivo precisam de fonte e leitura autoritativa.

## Reconciliação e falhas

Agrupar eventos de bolsas; não percorrer inventário por frame. Atualizar o objetivo pelo diário quando o evento de quest chegar. Não vender, destruir, equipar ou usar item automaticamente como parte desta orientação.

## Contrato: C_Container.GetContainerNumSlots

Argumentos: containerIndex: BagIndex. Retornos: numSlots: number. Pode não retornar valores: não declarado. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/ContainerDocumentation.lua.

## Contrato: C_Container.GetContainerItemInfo

Argumentos: containerIndex: BagIndex; slotIndex: luaIndex. Retornos: containerInfo: ContainerItemInfo. Pode não retornar valores: true. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/ContainerDocumentation.lua.

## Critérios mínimos de validação

Testar valor ausente/secreto, evento duplicado, reload, desativação e recuperação. Preservar intenção do personagem sem salvar uma falsa conclusão. Mock valida transições; cliente real valida legibilidade, disponibilidade de dados e restrições. Registrar o cenário observado e o que não foi executado.
