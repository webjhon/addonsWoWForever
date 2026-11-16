# Revisão crítica — candidata 3.0

A versão2.0 foi reprovada pelo usuário: faltavam configuração, escolha livre de dungeon, overview e seta visível. O contrato3.0 trata essas falhas como comportamentos de produto, não como necessidade de mais relatórios.

Agora há hub de planejamento, três abas, todas27 dungeons acessíveis por páginas/filtro, tracker separado e seletor persistente. O plano manual não significa marcar progresso: quests continuam autoritativas e a instância real prevalece durante a run. Testes executam o clique no seletor, troca com quests pendentes, entrada e retorno ao plano.

A seta pertence ao addon: escolhe pontos factuais embarcados, lê posição pública, calcula direção/distância e rotaciona textura original. Os testes removem C_SuperTrack/GetNextWaypoint e verificam que ela ainda funciona; testam cardinais, mudança de rumo/posição, chegada sem conclusão, dados secretos, outro mundo e cancelamento do ticker. Não é mais apresentada uma integração opcional com o cliente como se fosse uma seta própria.

O overview apresenta acesso, encontros de referência e progresso de quests; evento de encontro bem-sucedido pode marcar observação, nunca checkbox. A ordem DB2 é catálogo, não rota otimizada. O usuário pode consultar objetivos e destinos antes da run sem ficar preso à primeira dungeon com quests.

Limites ainda importantes:71 testes não provam utilidade durante horas nem renderização no WoW. Não houve sessão real. APIs de posição podem retornar nil/restrições; coordenadas comunitárias podem mudar; nem todos os NPCs e entradas estão mapeados. Fonte selecionada contém pontos de portal para objetivos internos: esses pontos não são exibidos como bosses. Não há pathfinding, mapa topográfico ou navegação indoor garantida. Quatro guias de quests continuam bloqueados por dados. Esses limites estão expostos no produto e no PR, não escondidos atrás de “quando disponível”.

Resultado: candidato técnico para avaliação do usuário, não aprovação final de gameplay. O roteiro em INSTALL.md precisa ser executado no Forever antes dessa aprovação.
