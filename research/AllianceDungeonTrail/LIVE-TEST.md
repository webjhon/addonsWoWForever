# Verificação parcial no WoW Forever — 3.1.0

Data: 2026-11-16. Cliente 1.60.1.70938 / Interface 16001. Personagem Alliance, hunter nível 26, Stormwind, acesso urbano ao Stockade. Testes por controle visual autorizado; sem combate ou percurso completo dentro de dungeon.

## Critérios e observações reais

- Abrir/fechar hub e configurações: executado. Seleção de The Deadmines alterou o plano e a seta de entrada (aprox. 2181 m), sem abandonar as duas quests do Stockade no diário. Retorno ao modo automático restaurou Stockade.
- Caminhada curta com seta: executada em área segura; distância variou aproximadamente 35 → 25 → 15 m e direção mudou após passar pelo ponto. A seta oferece direção e distância em linha reta; não contorna paredes, portas ou obstáculos.
- Arraste da seta: defeito reproduzido na 3.0.0 (girava câmera). Corrigido e retestado: frame acompanha o arraste, sem girar câmera. Arraste do hub e tracker também executado.
- Persistência: após reload, hub, seta e tracker reapareceram nas posições arrastadas. Pausa permaneceu após reload, sem overlays. Retomar restabeleceu o guia automático.
- Ocultar individualmente: X da seta esconde apenas a seta; X do tracker esconde apenas o tracker. Abrir /adt recuperou o tracker. Nenhuma quest foi abandonada.
- Sobreposição: X do tracker falhava sobre o tracker de quests do jogo; funcionava quando afastado. Corrigida prioridade de desenho/entrada; clique retestado no mesmo local sobre o painel nativo e fechou corretamente.
- Hub: botões inferiores sofriam interferência das barras do jogo. Elevada prioridade, posição inicial acima das barras; controles de pausa/retomada e fechar funcionaram após correção.
- Configurações: ligar/desligar seta, rolagem até as últimas opções e botão de restaurar posições executados. Trava de arraste/combat guard têm cobertura automatizada; não foram retestados ao vivo nesta rodada.
- Estado final: guia automático Stockade, seta ligada, tracker movido para a esquerda do painel nativo; personagem parado e vivo em área segura, sem autorun.

## Problemas resolvidos

Arraste ausente; posições não salvas; ausência de pausa persistente; ausência de fechamento individual; texto solto da seta quando não há destino; conflitos de prioridade e clique entre painéis. São alterações de UX e controle do guia, sem ampliar a cobertura factual de quests.

## Limites desta verificação

PARTIAL_CLIENT_TESTED, não CLIENT_VERIFIED global. Não houve aceitação, abandono, conclusão ou entrega real de quests, combate, teste de bosses, mudança real de instância, exploração das 27 dungeons, avaliação prolongada de desempenho ou teste em outras resoluções. Transições correspondentes permanecem verificadas em mocks. A ausência de diálogo de erro durante as ações observadas não é auditoria completa de taint/Lua.

Evidência: research/AllianceDungeonTrail/live/navigation-final.png é composição de dois recortes da captura real, sem chat. Prévias UI-*.png são mocks e estão separadas. A captura navigation-restored.png registra uma etapa anterior de persistência, antes do ajuste final de prioridades.
