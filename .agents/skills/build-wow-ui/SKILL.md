---
name: build-wow-ui
description: Projetar e revisar painéis, setas e trackers próprios de addons Forever com interação, persistência e recuperação verificáveis.
---

# build-wow-ui

Use para interface de addon ou navegação. Consulte knowledge/seed-docs/forever-live-client-lessons.md e o relatório research/AllianceDungeonTrail/LIVE-TEST.md.

- Defina o ciclo abrir → escolher → jogar → ocultar/pausar → recuperar. Acompanhar progresso continua automático; controles manuais servem para intenção e configuração. Fechar o hub, esconder uma seta e pausar o guia têm efeitos distintos; rotule-os e permita recuperação sem abandonar quests.
- Para frame arrastável, habilite mouse/movimento/drag, bloqueie início em combate e salve no término. No jogo, confirme mudança do frame sem girar a câmera. Persista posições por personagem com âncoras/valores finitos validados, clamp e opção de restauração. Não copie coordenadas de uma única resolução.
- Persista intenção (dungeon, tipo e identificador), não snapshots de objetivos ou posição do personagem. Releia o diário/contexto após reload. Trocar de objetivo deve limpar a rota anterior também no SavedVariables; mudança de personagem não herda seleção/layout alheios.
- Pause cancela ticker de navegação, esconde overlays e impede recriação no próximo evento/reload. Retomar reconcilia sinais atuais. Não confunda remover um guia com abandonar quests.
- Strata/nível precisam considerar hit-testing, não só aparência. Teste cliques nos mesmos locais sobre ObjectiveTracker, barras e outros addons. Escolha a menor prioridade que funciona; DIALOG/FULLSCREEN_DIALOG resolveram casos locais, não são regra universal para todos os frames. Créditos devem continuar legíveis e clicáveis.
- Confira legenda de botões pequenos, footer sobre barras, opções fora da altura visível e dica/rolagem até a última opção. Teste escala e resolução pertinentes; um teste em 1920x1080 não valida todas.
- Seta própria deve responder a movimento/rumo, cancelar geometria antiga quando mapa/posição deixam de ser legíveis e não exibir texto solto sem destino. Linha reta não é caminho: não prometa contornar paredes ou navegação indoor sem dados e teste específicos. Chegar a uma área não conclui quest.
- Automatize as transições de seleção, pausa/reload, fechar/recuperar e layout por personagem; o teste real precisa validar hit-testing, legibilidade e direção. Mock de Frame não comprova essas propriedades.

Referências de implementação original, para consulta e adaptação: addon-src/AllianceDungeonTrail/{Product,Navigation,UI}.lua; regressões em tests/dungeon-trail.test.ts. Não trate as 27 dungeons do catálogo como 27 percursos testados.
