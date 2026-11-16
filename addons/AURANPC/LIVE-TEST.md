# Teste real inicial — 16/11/2026

Resultado: falha inicial2.0.0 reproduzida; correção2.0.1 com PARTIAL_CLIENT_TESTED. Não promover a CLIENT_VERIFIED integral.

Usuário deixou personagem Alliance nível26 parado em dungeon com Prisioneiro Défias selecionado; objetivo visível 0/10 Prisioneiro Défias. Não houve movimento, ataque, abandono ou alteração de quest pelo agente. AURANPC instalado em versão2.0.0, conforme TOC.

Executado `/auranpc status`, saída real observada: 17 quests pendentes; 4 placas; 0 associados; 0 desenhados; 0 restritos; 4 sem identidade pública. Nenhuma moldura própria no NPC selecionado. Isso reproduz o relato do usuário; os testes automatizados anteriores não cobriram o dado real responsável pela falha.

Uma consulta de leitura via `/run` sobre disponibilidade de GUID/tooltip/combate abriu a confirmação de scripts personalizados do WoW. Ainda não houve resultado dessa consulta. Não atribuir a falha a secret values ou ao formato de GUID sem evidência. O usuário deve resolver a confirmação manualmente; nenhuma barreira foi contornada.

Após usuário resolver manualmente o aviso e reconectar: consulta retornou `issecretvalue(UnitGUID("target")) = true`, tooltip de tipo table e combate false. Tabelas do tooltip/linhas públicas, mas nenhum leftText público retornou no laço filtrado. A leitura `C_QuestLog.UnitIsRelatedToActiveQuest("target")` retornou valor não secreto true. Isso identifica a causa operacional e a alternativa pública, sem inspecionar/decodificar os dados secretos.

Implementada consulta independente da relação de quest. Ela NÃO identifica qual quest nem o NPC: apresentação genérica `NPC de quest / NPC de uma quest ativa / Confira interação ou saque`. Dados não públicos continuam descartados. Código da engine instalada comparado por SHA256 à engine empacotada.

Executados e observados após correção e `/reload`: destaque automático em NPC real; NPC movendo-se naturalmente e marcador acompanhando sua placa; faixa local; contagem1 e depois2 marcadores conforme placas relevantes aparecem; créditos do Hunter; abertura/fechamento de opções; desativar remove todos os marcadores/faixa; reativar restaura; desligar pulso preserva borda sólida; religar restaura pulso. Demonstração original2.0.0 também desenhou corretamente antes da correção de detecção. Nenhum erro Lua visível durante esses passos; isso não é auditoria exaustiva de taint.

Personagem não foi movido nem iniciou combate pelo agente. Opções retornaram a destaques/pulso/faixa ligados e som desligado. Evidência recortada real: live/dungeon-highlight.png, sem chat/identificadores do personagem. Sobreposição de dois marcadores próximos foi observada; legibilidade em grupos densos permanece limitação.

Pendentes: combate, abate/saque, conclusão/abandono/entrega reais, áreas abertas, outras dungeons, placas amigáveis, som, longa sessão/performance. Não inventar aprovação desses cenários por analogia ao teste pontual.
