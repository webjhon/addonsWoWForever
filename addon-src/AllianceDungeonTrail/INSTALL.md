# AllianceDungeonTrail 3.0 — instalação e uso

Extraia `AllianceDungeonTrail-3.1.0-candidate.zip` e copie a pasta `AllianceDungeonTrail` para `_forever_/Interface/AddOns/`, substituindo a pasta anterior inteira. O TOC deve ficar diretamente nessa pasta. Reinicie ou use `/reload`.

`/adt` abre o hub. Escolha qualquer uma das27 dungeons na lateral (páginas e filtro por faixa). A seleção passa a ser seu plano; você não precisa abandonar quests de outra dungeon. A instância em que você realmente está sempre prevalece durante a run; ao sair, o plano escolhido é retomado. MODO AUTOMÁTICO volta à recomendação por contexto.

- **Visão geral:** acesso, níveis, referências, catálogo de encontros e estados reais das quests. Encontros observados por evento são indicados; a ordem do catálogo não é caminho geométrico nem garantia de fase ativa.
- **Quests:** coleta, objetivo, entrega e opções de guiar. Esses botões escolhem intenção/destino; nunca confirmam progresso. O diário e eventos continuam sendo autoridade.
- **Configurações:** seta própria, tracker, avisos, escala, unidades, proximidade de chegada e integração opcional com rastreio do jogo. Preferências por personagem.
- **Tracker:** orientação atual durante o jogo, separado do hub. OPÇÕES abre configurações.
- **Seta própria:** o addon escolhe um ponto da base embarcada, calcula rumo/distância pela posição/rotação pública do personagem e desenha sua própria textura. Não requer TomTom, Questie, C_SuperTrack ou GetNextWaypoint. Chegar ao local não completa quest.

Outros comandos: `/adt config`, `/adt auto`, `/adt dungeon deadmines`, `/adt diagnostico`, `/adt navegacao off`, `/adt navegacao on`, `/adt resetpos`.

## Cobertura e limites

Catálogo de27 dungeons, quests selecionadas em23. Coordenadas comunitárias versionadas:48 coletas,55 entregas,16 entradas e áreas de objetivos. Referências podem mudar por fase/build. A seta aponta em **linha reta**; não calcula caminho por paredes, transporte ou relevo. Posição indisponível/outro continente/combate interrompem a indicação direcional, com estado explícito.

**Não há posições internas garantidas.** Muitos dados de quests internas registram somente a entrada da instância; esses pontos nunca são apresentados como localização do boss. Dentro, acompanhe objetivos reais e referências de encontros. Visão geral não é mapa topográfico. Shadowfang Keep, Alcaz Prison, Blackmaw Hold e Shaper's Terrace continuam sem guia de quests curado; dados ausentes são mostrados como lacuna.

Autores/créditos: **Tonho Contrabando**, Hunter pixel art e ícone original. Coordenadas selecionadas da fonte MIT EverythingQuests com atribuição em THIRD-PARTY.md; nenhuma implementação ou texto de guia copiado.

## Verificação real pendente

Nenhum teste no WoW foi executado nesta candidata. Antes de aprovar: confirmar GetBuildInfo/interface16001 na build instalada70938; testar direção visual com personagem girando/andando; coleta e entrega com pontos factuais; troca de plano antes/durante/depois de dungeon; scroll/escala/abas em resolução real; objetivos, encontros, combate, morte e reload; ausência de erros/taint. Mock e CI verdes não provam essas condições.

3.1.0: arraste flecha/tracker/painel para reposicionar; posições são salvas por personagem. X da flecha desliga apenas a seta; X do tracker oculta apenas o tracker. /adt abre/fecha o painel; /adt ocultar pausa o guia inteiro sem abandonar quests; /adt retomar retoma; /adt resetpos restaura posições. Selecionar dungeon ou guiar um ponto retoma explicitamente. Configurações incluem trava da flecha e restauração de posições, acessíveis rolando a lista.
