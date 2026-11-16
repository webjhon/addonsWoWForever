# Revisão crítica do produto — candidata2.0

Revisão de engenharia com simulações executadas e inspeção das prévias, não sessão de gameplay.

**Preparação:** abre com uma ação, sem seleção obrigatória de dungeon. A região pesa na sugestão e o nível filtra requisitos conhecidos. Uma oferta real no diálogo do NPC recebe prioridade; aceitar muda a ação sozinho. A preparação fora do diálogo continua potencial porque não há grafo completo de elegibilidade. Isso é um limite de dados, não uma confirmação manual escondida.

**Dentro da dungeon:** o próximo objetivo usa texto e contadores do diário localizado. A referência de boss/sala complementa o objetivo. A conclusão fora da ordem funciona; uma quest pronta não manda sair enquanto há outra tarefa interna aceita pendente. Quests de cavernas anteriores ao portal não são apresentadas como objetivos internos. A UI troca de ação sem checkboxes.

**Após conclusão:** somente IsComplete/evento real confirma os estados. Ausência/abandono não vira entrega; quest repetível atualmente aceita supera histórico. O texto de próximo destino do cliente é utilizado mesmo quando faltam coordenadas. A referência de coleta nunca é rotulada falsamente como destino de entrega.

**Uso prolongado:** tracker compacto opcional, posição e preferências por GUID, coalescência de eventos, nenhum frame novo após100 reconciliações. Combate mantém orientação em cache e retoma; morte tem estado próprio. Marcação externa preservada. Foram corrigidos perda de foco na saída, calibração de segmentos após reload e retenção de navegação sem waypoint. Nenhum loop por frame ou controle manual de progresso.

**Estimativa:** chamar saída de “clear” seria enganoso. O motor mede expedições e as apresenta como tal, com amostras conservadoras, intervalo e incerteza. Sem duas amostras não há número inventado. Essa opção tem menos precisão que detecção confiável de clear, cuja identidade de boss final não foi estabelecida para todas as dungeons.

**O que ainda impede aprovação definitiva:** falta uma sessão real de leveling. Mock não demonstra eventos reais, qualidade de rota indoor, fonte/textura, taint ou utilidade durante horas. A seta depende de waypoint do cliente; não há pathfinding. Quatro guias estão explicitamente bloqueados por dados; os demais são curadoria selecionada, não cobertura total de quests/classes/pré-requisitos. Alguns destinos de entrega dependem do texto/pin nativo quando não há destino distinto curado. Essas lacunas devem ser avaliadas pelo usuário no PR; a candidata não é apresentada como produto aprovado nem CLIENT_VERIFIED.

O critério central mudou de “painel passou no teste” para “ação observável avança sem alimentar progresso”. Os25 cenários executados cobrem essa mudança. A revisão não usa o total de testes como substituto de aprovação humana.
