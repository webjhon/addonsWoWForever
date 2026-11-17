# Pausa, reload e troca de intenção sem ressuscitar rota antiga

## Evidência e escopo

Arraste e posições dos três frames sobreviveram ao reload. Pausa persistiu sem overlays e retomada restaurou o plano automático. Na revisão de código, a troca para objetivo precisava limpar também a rota salva, e uma regressão automatizada cobriu a sequência. Esse último cenário não recebeu aprovação real de quest nesta sessão.

## Decisões para implementação

Persistir intenção e layout por personagem; reler progresso após login. Pausa cancela ticker e impede que eventos o recriem. Esconder o hub, desligar a seta e remover um guia são comandos diferentes. Trocar de guia não abandona quests.

## Como verificar

Defina comportamento observável, cenário de falha e resultado esperado antes do código. Repita o caso que falhou após corrigir. Separe STATIC_PASSED/MOCK_PASSED de teste real; registre build, versão instalada e ações executadas. Confira o código/ZIP efetivamente instalado e não use uma aprovação parcial para prometer cenários não percorridos. Fonte completa: research/AllianceDungeonTrail/LIVE-TEST.md.
