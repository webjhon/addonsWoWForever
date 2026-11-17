# Botão visível que não recebe clique: sobreposição e prioridade

## Evidência e escopo

O X do tracker funcionava quando afastado, mas falhava sobre o ObjectiveTracker. O ajuste de prioridade foi retestado no mesmo local e o clique passou. A seta sem suporte de drag girava a câmera; handlers próprios corrigiram. Um X com largura pequena foi truncado e teve padding corrigido.

## Decisões para implementação

Mock de Frame não comprova hit-testing. Testar sobre barras, tracker nativo e outros addons; escolher a menor prioridade funcional. Não aplicar FULLSCREEN_DIALOG indiscriminadamente. Conferir scroll até a última opção, legibilidade e controles pequenos na resolução relevante.

## Como verificar

Defina comportamento observável, cenário de falha e resultado esperado antes do código. Repita o caso que falhou após corrigir. Separe STATIC_PASSED/MOCK_PASSED de teste real; registre build, versão instalada e ações executadas. Confira o código/ZIP efetivamente instalado e não use uma aprovação parcial para prometer cenários não percorridos. Fonte completa: research/AllianceDungeonTrail/LIVE-TEST.md.
