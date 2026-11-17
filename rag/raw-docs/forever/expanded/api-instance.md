# Contexto de instância: dungeon, exterior e conteúdo desconhecido

Escopo: Alliance1–60, interface16001. Snapshot documental bebcb6bf309cf41b41bd74f8ca651e6a105b2676. Runtime das funções abaixo permanece UNVERIFIED até teste específico.

## Contexto de produto

Usar identificadores documentados por build para reconhecer uma instância. Nome localizado sozinho não é identidade confiável. Distinguir dungeon, raid, exterior e mapa não mapeado. Catálogo de encontros não prova que cada boss existe na fase ou já foi derrotado.

## Reconciliação e falhas

A instância real pode alterar a ação aplicável sem destruir o plano escolhido. Ao sair, reconciliar o plano com quests atuais. Em instância desconhecida, mostrar limite e objetivos reais legíveis; nunca fabricar rota interna.

## Contrato: GetInstanceInfo

Argumentos: nenhum declarado no snapshot. Retornos: name: cstring; instanceType: cstring; difficultyID: number; difficultyName: cstring; maxPlayers: number; dynamicDifficulty: number; isDynamic: bool (pode ser nil); instanceID: number; instanceGroupSize: number; lfgDungeonID: number (pode ser nil); hasWorldTier: bool. Pode não retornar valores: não declarado. SecretArguments: não declarado. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/InstanceDocumentation.lua.

## Contrato: IsInInstance

Argumentos: nenhum declarado no snapshot. Retornos: isInInstance: bool; instanceType: cstring. Pode não retornar valores: não declarado. SecretArguments: não declarado. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/InstanceDocumentation.lua.

## Critérios mínimos de validação

Testar valor ausente/secreto, evento duplicado, reload, desativação e recuperação. Preservar intenção do personagem sem salvar uma falsa conclusão. Mock valida transições; cliente real valida legibilidade, disponibilidade de dados e restrições. Registrar o cenário observado e o que não foi executado.
