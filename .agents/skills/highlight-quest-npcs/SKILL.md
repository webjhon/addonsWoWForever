---
name: highlight-quest-npcs
description: Construir destaque local de NPCs de quest no Forever quando associação por identidade ou tooltip pode estar indisponível.
---

# highlight-quest-npcs

Use para marcação/destaque de NPCs ou nameplates ligados a quests. Leia research/AURANPC/LIVE-SESSION-2026-11-16.md e knowledge/seed-docs/forever-live-client-lessons.md antes de escolher a associação.

- Separe detecção e renderização. Contadores de quests, placas, associações, marcadores, identidade indisponível e restrição ajudam a provar em que etapa a cadeia falhou. Demonstração visual não substitui associação a NPC real.
- GUID/tooltip secretos foram observados fora de combate no Forever70938. Não assuma que estar fora de combate os torna legíveis. Não extraia NPC ID ou texto de valores secretos nem use a restrição como motivo para tentar canais alternativos que exponham o mesmo dado.
- C_QuestLog.UnitIsRelatedToActiveQuest(unit) retornou true público no alvo observado; é uma consulta independente, não decodificação. Se pública e disponível, permite indicação genérica de relação com quest, mas não identifica quest, objetivo ou NPC. Verifique em cada build/contexto e use rótulos proporcionais à evidência.
- Dados numéricos de NPC/objetivo e leitura do diário só autorizam texto específico quando públicos e correspondentes. Não invente o nome/quest a partir de relação booleana. Não transforme estado desconhecido em objetivo incompleto/concluído.
- Faça o efeito próprio seguir cada placa pública com ciclo de criação, atualização e remoção; limpe frames reciclados para não marcar outra unidade. Borda sólida deve continuar distinguível quando pulso estiver desligado. Teste NPC movendo e reaparecimento de placas.
- Para efeito individual, desenhe no cliente. Não use raid marks, mensagens de grupo ou mudança de alvo como substituto de destaque local. Uma moldura na placa não é aura 3D ao redor do modelo; declare o resultado que realmente existe.
- Se a placa estiver indisponível/proibida, não contorne o cliente nem prometa cobertura total. Ofereça feedback próprio compatível quando houver dados públicos, com limite explícito. Não garanta 100% de visibilidade: densidade, placas ocultas e campo de visão limitam o resultado.
- Teste desativar/reativar, pulso independente, movimento da unidade, reciclagem, dados secretos e perda de associação; quests concluídas, abate/saque, combate, mundo aberto e densidade são cenários separados. Sessão de Stockade não aprova os demais.

Referência original: addon-src/AURANPC/Engine.lua e tests/auranpc*. O relatório factual é mais específico que o status global de um pacote.
