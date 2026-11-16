# Instalação — AllianceDungeonTrail 2.0

Descompacte `AllianceDungeonTrail-2.0.0-candidate.zip` e copie a pasta `AllianceDungeonTrail` para `_forever_/Interface/AddOns/`. A pasta deve conter `AllianceDungeonTrail.toc` diretamente. Substitua a pasta antiga inteira para evitar arquivos obsoletos. Reinicie o jogo ou use `/reload`.

O tracker abre com a próxima ação. Jogue normalmente: aceite quests na janela do WoW, faça objetivos e entre na dungeon. O addon detecta essas mudanças. Ele não aceita/entrega quests nem movimenta o personagem.

- `/adt`: reabrir o tracker.
- `–` / `+`: modo compacto/expandido; arraste pelo painel para reposicionar.
- `SEGUIR QUEST`: assumir explicitamente rastreamento nativo quando outra marcação já está ativa.
- `/adt navegacao off` / `/adt navegacao on`: preferência de navegação.
- `/adt resetpos`: centralizar janela.
- `/adt diagnostico`: build observada, estado e APIs essenciais ausentes.

Créditos: **Tonho Contrabando**. O Hunter pixel art aparece na primeira abertura por sessão. Ícone original de portal/escadaria.

Migração: confirmações e vínculos manuais da versão1 não provam progresso e são descartados; o diário real reconstrói a jornada. Estado e preferências separados por personagem. Não há botões de marcar objetivo ou registrar run.

## O que a candidata cobre

Alliance1–60; identificação de27 instâncias por IDs Map da build70938, quests selecionadas em23; aceites/objetivos/entrega por ID, ofertas do NPC, instância, avisos de faixa e expedições de XP observadas. Waypoints vêm exclusivamente do cliente, quando disponíveis. Referências comunitárias de NPC/boss/área continuam dependentes da fase atual.

Shadowfang Keep, Alcaz Prison, Blackmaw Hold e Shaper's Terrace ainda estão bloqueadas por dados de quests. Em mapas compartilhados, combine a ala com o grupo. Estimativas são de segmentos de expedição semelhantes, não contagem comprovada de clears; não garantem níveis futuros. Sem waypoint, a orientação usa o objetivo real e referências textuais.

## Validação no jogo pendente — não executada

1. Confirmar `/dump GetBuildInfo()` e interface16001; conferir ausência de erro Lua no login e créditos na primeira abertura.
2. Aceitar uma quest reconhecida; observar mudança sem clicar no addon. Conferir título localizado, objetivos e contadores reais.
3. Entrar na dungeon, completar objetivos fora de ordem, saquear e entregar. Observar prioridade de outras tarefas internas antes da entrega.
4. Conferir seta/posição quando o cliente fornecer waypoint; testar perda de waypoint e rastreamento externo preservado. Não esperar pathfinding indoor.
5. Testar combate, morte, retorno à vida, abandono, `/reload`, logout e outro personagem. Confirmar recuperação sem falsa conclusão.
6. Inspecionar fontes, pixel art, recorte de texto, escala e arraste em resolução real; conferir erros e taint em sessão prolongada.
7. Para estimativa, observar ao menos duas expedições comparáveis sem quests; confirmar que morte, entrega, reload e visitas curtas não calibram.

Status de entrega: candidato técnico, **NÃO CLIENT_VERIFIED**. O relatório distingue testes executados de testes pendentes.
