# Contrato 3.0 antes da implementação

Requisitos observáveis: hub com seletor das27 dungeons sem prisão por quest aceita; overview contextual de entrada, faixas, encontros e quests; configuração visível e persistente por personagem; tracker compacto separado; seta própria desenhada/rotacionada pelo addon e distância em linha reta. Progressão continua autoritativa por eventos/diário, nunca por checkboxes.

O plano manual representa intenção, não progresso. Instância real prevalece enquanto o jogador estiver dentro; o plano selecionado reaparece na saída. Configurar navegação, tracker, escala, alertas, unidades, chegada e rastreamento externo opcional. Nunca sobrescrever marcações externas por padrão.

Seta: coordenadas factuais versionadas de coleta, entrega, áreas de objetivo e16 entradas; calcular posição/direção com C_Map/GetPlayerFacing. Não depende de C_SuperTrack nem GetNextWaypoint. Dados do diário podem complementar, mas não são a única fonte. Mostrar mapa diferente/ausente e nenhum rumo falso. Atualizar por ticker limitado enquanto necessário, sem polling de diário.

Não há dados de posição interna confiáveis na referência consultada: indicadores de entrada são identificados como entrada e não usados como localização de boss. Overview não é mapa geométrico/pathfinding; ordem do catálogo de encontros não é proclamada rota otimizada. Incluir vínculos de quests e avanços automáticos; encontro confirmado via ENCOUNTER_END recebe estado observado.

Aceitação: trocar entre dungeon A/B sem abandonar quests; manter plano ao entrar/sair de C; navegar sem APIs de supertracking; testar N/E/S/O e mudança de rumo; chegada não conclui quest; perda de mapa/combate/reload não deixa seta obsoleta; config restaura por GUID; todas27 possuem overview e lacunas visíveis; nenhum dado secreto entra na matemática; teste real no cliente continua pendente.
