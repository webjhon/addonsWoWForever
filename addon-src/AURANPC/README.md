# AURANPC 2.0.1 — Tonho Contrabando

Instalação: feche o jogo, extraia o ZIP em `_forever_/Interface/AddOns/`. A estrutura deve ser `AddOns/AURANPC/AURANPC.toc`, sem pasta duplicada. Substitua a pasta AURANPC antiga pela nova. Não requer ForeverAuras, Questie ou outro addon.

Entre num personagem Alliance nível 1–60. O addon lê as quests aceitas e os objetivos pendentes; NPCs associados recebem moldura amarela sólida, pulso adicional, exclamação e texto da quest sobre sua própria placa. A posição acompanha a placa do NPC em movimento. Quests concluídas/abandonadas e objetivos já cumpridos deixam de destacar automaticamente. Também funciona por esse mecanismo em dungeons quando o cliente disponibiliza placas acessíveis.

`/auranpc` abre configuração e diagnóstico. Controle escala, altura, pulso, faixa local, som privado (desligado por padrão) e auxílio de placas inimigas. Esse auxílio habilita apenas a preferência local de placas quando seguro e restaura o valor anterior ao desligar/sair. Não altera a opção de círculos nativos de quest. Não marca raid targets, envia mensagens, seleciona alvos nem afeta o grupo.

`/auranpc test` ou **DEMONSTRAR** exibe por 10 segundos o mesmo desenho com rótulo de demonstração. Isso testa a apresentação, não prova reconhecimento de NPC. `/auranpc status` informa quests pendentes reconhecidas, placas, associações e marcadores efetivamente desenhados. Se há placas mas nenhum associado, confira se a quest está aceita e seu objetivo ainda está pendente; dados de quests novas podem não estar disponíveis.

O efeito é uma sobreposição 2D original sobre a placa, não uma aura 3D no corpo do NPC. Placas fora do alcance, ocultas ou proibidas não podem receber esse efeito. Não existe garantia de 100% de percepção. Placas amigáveis em instâncias podem ter restrições do cliente. O addon não contorna essas restrições.

Dados comunitários MIT: 1.454 quests com 5.208 associações de objetivos a criaturas. Somente quests atualmente aceitas pelo personagem são ativadas. Objetos de cenário não são criaturas e não são destacados. Quando GUID/textos são secretos, usa o resultado público de C_QuestLog.UnitIsRelatedToActiveQuest e rótulo genérico, sem inventar a identidade da quest. Fallback por tooltip exige título exato e único de quest própria. Dados e APIs da build instalada 1.60.1.70938 ainda precisam de validação em jogo.

Veja TEST-REPORT.md e CLIENT-TEST.md. Testes automatizados não substituem teste dentro do WoW. Candidato para aprovação; detecção, renderização, movimento natural do NPC, reload e opções foram observados em Stockade70938. Combate, conclusão de quests e mapa aberto continuam pendentes.
