# Mapas e coordenadas: posição, mundo e ausência de dados

Escopo: Alliance1–60, interface16001. Snapshot documental bebcb6bf309cf41b41bd74f8ca651e6a105b2676. Runtime das funções abaixo permanece UNVERIFIED até teste específico.

## Contexto de produto

MapID, InstanceID, coordenada normalizada e posição de mundo são conceitos diferentes. Não comparar diretamente valores de mapas ou continentes diferentes. Se o mapa ou posição não estiver disponível, apagar a geometria anterior e explicar o limite.

## Reconciliação e falhas

Selecionar primeiro o destino que corresponde à ação vigente. Converter coordenadas somente com informação pública e fonte apropriada. Mostrar distância em linha reta sem prometer desviar de paredes ou portas. Entrada de dungeon não serve como posição de boss.

## Contrato: C_Map.GetBestMapForUnit

Argumentos: unitToken: UnitToken. Retornos: uiMapID: number (pode ser nil). Pode não retornar valores: não declarado. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/MapDocumentation.lua.

## Contrato: C_Map.GetPlayerMapPosition

Argumentos: uiMapID: number; unitToken: UnitToken. Retornos: position: vector2 (pode ser nil). Pode não retornar valores: não declarado. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/MapDocumentation.lua.

## Contrato: C_Map.GetWorldPosFromMapPos

Argumentos: uiMapID: number; mapPosition: vector2. Retornos: continentID: number; worldPosition: vector2. Pode não retornar valores: true. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/MapDocumentation.lua.

## Contrato: C_Map.GetMapInfo

Argumentos: uiMapID: number. Retornos: info: UiMapDetails. Pode não retornar valores: true. SecretArguments: AllowedWhenUntainted. Estado de execução: UNVERIFIED. Fonte: https://github.com/Gethe/wow-ui-source/blob/bebcb6bf309cf41b41bd74f8ca651e6a105b2676/Interface/AddOns/Blizzard_APIDocumentationGenerated/MapDocumentation.lua.

## Critérios mínimos de validação

Testar valor ausente/secreto, evento duplicado, reload, desativação e recuperação. Preservar intenção do personagem sem salvar uma falsa conclusão. Mock valida transições; cliente real valida legibilidade, disponibilidade de dados e restrições. Registrar o cenário observado e o que não foi executado.
