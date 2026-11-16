# AURANPC — comportamento antes da implementação

Benefício: manter disponível o círculo nativo de quest, no chão ao redor de unidades reconhecidas pelo próprio cliente, sem depender de nameplates, coordenadas ou acompanhamento manual de NPC. O motor do jogo decide a relevância, renderiza e acompanha movimento/progresso. O addon configura esse recurso e reage a estado do personagem, diário, alvo, ambiente e conflitos de configuração.

Escopo: Forever / Alliance / níveis1–60. Usar `ShowQuestUnitCircles`, existente na UI Blizzard Forever. Não simular uma aura3D com textura presa à tela, não alegar que um novo efeito3D foi criado, não forçar NPC arbitrário nem todos os NPCs de quests não aceitas. Cor/formato/renderização são nativos. Mundo aberto e dungeons usam o mesmo mecanismo; restrições visuais específicas continuam dependentes do cliente.

Aceitação:
1. Login elegível com CVar público/desbloqueado0 → escrever1 uma vez e confirmar leitura; mudança de zona, quests e alvo não causam escritas repetidas. Não exigir selecionar ou marcar NPC.
2. Mudança de objetivo/aceite/entrega → reconciliar contagem/contexto e deixar o motor nativo remover/adicionar círculos. Mock verifica política/contexto, não a renderização.
3. NPC move → sem cálculo de posição ou frames por NPC: círculo pertence à unidade no motor. Isso precisa de teste visual no cliente para comprovação nesta build, não pode receber MOCK_PASSED como evidência de movimento.
4. CVar ausente, secreto, bloqueado ou falha de escrita → estado indisponível, sem sucesso falso. Nunca registrar CVar inexistente.
5. Alteração externa para0 → ceder controle, informar conflito e não disputar em loop; opção de reativar explícita. Desativar/restaurar apenas valor que o addon realmente alterou, preservando mudanças externas.
6. Combate → não escrever CVar nem ler valores de unidade restritos; retomar fora de combate. Reload/novo personagem recupera preferência por GUID e configuração original de forma conservadora.
7. Horde, nível61 ou ambiente raid/PvP → suspender e restaurar somente ajuste próprio; continuar em dungeons party e mundo aberto.

Produto: automático, sem painel obrigatório durante o jogo. `/auranpc` abre status e configuração compacta com créditos Tonho Contrabando; ícone próprio pixel art. Só produzir candidato técnico se feature existir na referência; validação em runtime continua obrigatória antes de alegar sucesso visual.
