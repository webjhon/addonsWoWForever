# Cobertura real e testes pendentes — AURANPC2.1.1

Executados parcialmente em Alliance nível1/ptBR, build70959: bag, mudança de slot, loot real, coleta, reload, configurações e NPCs em mundo aberto. Veja LIVE-ITEMS-TEST.md. Os cenários amplos abaixo continuam pendentes onde não estiverem cobertos pelo relatório; verificar separadamente em Alliance e Horde:

1. Quest aceita com item pendente: abrir loot visível, confirmar !/borda/pulso no item certo, clicar/coletar normalmente e confirmar remoção quando a linha some. Moedas e outros itens sem associação não devem receber efeito.
2. Bolsas normais e combinadas: item específico e item comum necessário para quest; mover entre slots/bolsas, ordenar e fechar/reabrir. O selo acompanha a nova posição e não fica no item substituto.
3. Objetivo completo: selo de bolsa permanece enquanto a quest está aceita e aguarda entrega; loot adicional deixa de ser destacado. Abandonar ou entregar remove o selo, inclusive com outras quests ainda ativas.
4. Item que inicia quest ainda não aceita e item de missão abandonada: não marcar apenas pela classificação genérica. Aceitar/reaceitar atualiza a relação.
5. /reload, troca de personagem e identidade desconhecida: preferências por personagem corretas; progresso relido do diário; sem selos antigos. Testar os três controles novos e desativação geral.
6. Combate, clique/tooltip/drag do item, rolagem do loot, UI em escala diferente e modo combinado: overlays não capturam mouse nem quebram a janela. Conferir secret values/frames proibidos e ausência de erros/taint.
7. Retestar NPC real em mundo aberto e dungeon, inclusive movimento, relação pública, pulso e desligar/reativar. Demonstração visual não valida associação.
8. Addons de bolsas/loot de terceiros exigem cenário separado. Não declarar compatibilidade por inferência de nomes ou por sucesso na UI padrão.
