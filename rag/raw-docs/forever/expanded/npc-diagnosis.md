# Diagnóstico de destaque: desenhar não é detectar

## Evidência e escopo

Na sessão inicial houve 17 quests pendentes e 4 placas, porém nenhuma associação ou marcador. A demonstração desenhava, logo o defeito estava na cadeia de identificação/associação. UnitGUID do alvo era secreto fora de combate; a relação independente C_QuestLog.UnitIsRelatedToActiveQuest retornou true público. A correção desenhou indicação genérica sem inventar questID.

## Decisões para implementação

Separar observação, associação, seleção e desenho em contadores. Testar NPC movendo, remoção de placa e desligar/ligar. Uma relação booleana autoriza somente texto genérico. Não prometer visibilidade100% nem atribuir a causa sem leitura observada.

## Como verificar

Defina comportamento observável, cenário de falha e resultado esperado antes do código. Repita o caso que falhou após corrigir. Separe STATIC_PASSED/MOCK_PASSED de teste real; registre build, versão instalada e ações executadas. Confira o código/ZIP efetivamente instalado e não use uma aprovação parcial para prometer cenários não percorridos. Fonte completa: research/AURANPC/LIVE-SESSION-2026-11-16.md.
