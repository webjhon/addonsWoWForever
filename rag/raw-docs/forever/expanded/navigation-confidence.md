# Navegação útil com mapa ausente e direção em linha reta

## Evidência e escopo

Caminhada curta na cidade alterou distância aproximadamente35→25→15m e a direção ao passar pelo ponto. Isso verifica geometria naquele contexto; não comprova percurso interno, pathfinding ou todas as entradas. Coordenadas de entrada não foram promovidas a posição de boss.

## Decisões para implementação

Separar seleção do destino, conversão de mapa e desenho. Ao perder dados ou mudar de continente, não manter seta antiga. Mostrar referência textual quando houver. Não concluir missão por chegada. Uso de APIs e dados de posição exige validação por build e contexto.

## Como verificar

Defina comportamento observável, cenário de falha e resultado esperado antes do código. Repita o caso que falhou após corrigir. Separe STATIC_PASSED/MOCK_PASSED de teste real; registre build, versão instalada e ações executadas. Confira o código/ZIP efetivamente instalado e não use uma aprovação parcial para prometer cenários não percorridos. Fonte completa: research/AllianceDungeonTrail/LIVE-TEST.md.
