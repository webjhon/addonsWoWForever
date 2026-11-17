# Placas de identificação e destaque local de NPCs

Escopo: Alliance e Horde1–60, interface16001. Snapshot documental bebcb6bf309cf41b41bd74f8ca651e6a105b2676. Runtime das funções abaixo permanece UNVERIFIED até teste específico.

## Contexto de produto

A existência de uma placa não garante identidade pública, tooltip legível ou relação com quest. O efeito próprio pode seguir a placa, mas não é aura 3D em torno do modelo. Não usar raid marks ou mensagens de grupo para obter um destaque individual.

## Reconciliação e falhas

Inscrever criação/remoção de placas conforme eventos validados e limpar frames reciclados. Mostrar borda sólida com pulso opcional. Desativar precisa remover todos os efeitos. Em dados secretos, descartar antes de comparar, converter ou extrair NPCID.

## Contrato: C_NamePlate.GetNamePlateForUnit

Argumentos: unitToken: UnitTokenNamePlate; includeForbidden: bool. Retornos: nameplate: NamePlateFrame. Pode não retornar valores: não declarado. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/NamePlateDocumentation.lua.

## Contrato: C_NamePlate.GetNamePlates

Argumentos: nenhum declarado no snapshot. Retornos: nameplates: table. Pode não retornar valores: não declarado. SecretArguments: não declarado. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/NamePlateDocumentation.lua.

## Critérios mínimos de validação

Testar valor ausente/secreto, evento duplicado, reload, desativação e recuperação. Preservar intenção do personagem sem salvar uma falsa conclusão. Mock valida transições; cliente real valida legibilidade, disponibilidade de dados e restrições. Registrar o cenário observado e o que não foi executado.
