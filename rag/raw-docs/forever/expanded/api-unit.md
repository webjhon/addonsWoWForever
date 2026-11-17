# Personagem e unidades: dados públicos, facção, XP e morte

Escopo: Alliance1–60, interface16001. Snapshot documental bebcb6bf309cf41b41bd74f8ca651e6a105b2676. Runtime das funções abaixo permanece UNVERIFIED até teste específico.

## Contexto de produto

O contrato de uma API documenta forma, não garante que todo valor será público. WoW Forever usa família Mainline; reproduzir chamadas de Classic sem verificar pode falhar. Personagem morto, Horde ou nível fora do escopo requerem estados explícitos.

## Reconciliação e falhas

Verificar segredo antes de comparação, string, aritmética ou parsing. pcall evita algumas exceções, mas não torna um valor secreto público. Para XP, tratar troca de nível e reinício da sessão separadamente; ganho positivo não prova conclusão de dungeon.

## Contrato: UnitGUID

Argumentos: unit: UnitTokenPvPRestrictedForAddOns. Retornos: result: WOWGUID (pode ser nil). Pode não retornar valores: não declarado. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/UnitDocumentation.lua.

## Contrato: UnitLevel

Argumentos: name: cstring. Retornos: result: number. Pode não retornar valores: não declarado. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/UnitDocumentation.lua.

## Contrato: UnitXP

Argumentos: unit: UnitToken. Retornos: result: number. Pode não retornar valores: não declarado. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/UnitDocumentation.lua.

## Contrato: UnitXPMax

Argumentos: unit: UnitToken. Retornos: result: number. Pode não retornar valores: não declarado. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/UnitDocumentation.lua.

## Contrato: UnitFactionGroup

Argumentos: unitName: cstring; checkDisplayRace: bool. Retornos: factionGroupTag: cstring; localized: cstring. Pode não retornar valores: não declarado. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/UnitDocumentation.lua.

## Contrato: UnitIsDeadOrGhost

Argumentos: unit: UnitToken. Retornos: result: bool. Pode não retornar valores: não declarado. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/UnitDocumentation.lua.

## Critérios mínimos de validação

Testar valor ausente/secreto, evento duplicado, reload, desativação e recuperação. Preservar intenção do personagem sem salvar uma falsa conclusão. Mock valida transições; cliente real valida legibilidade, disponibilidade de dados e restrições. Registrar o cenário observado e o que não foi executado.
