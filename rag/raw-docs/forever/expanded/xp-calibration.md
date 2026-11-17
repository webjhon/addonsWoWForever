# Estimativa de runs: XP observada, amostra e incerteza

## Evidência e escopo

Uma estimativa de quantas runs faltam deve usar XP restante e amostras comparáveis de ganho, com contexto de nível, grupo, dungeon e sessão. Não há número universal de runs. Uma visita curta, reload ou morte pode invalidar a amostra; XP positiva não prova clear.

## Decisões para implementação

Tratar rollover ao subir de nível uma única vez. Separar bônus/quests quando não forem mensuráveis de modo confiável, ou declarar a mistura. Sem amostras suficientes, apresentar intervalo conservador ou insuficiência; não inventar precisão nem insistir numa dungeon inadequada.

## Como verificar

Defina comportamento observável, cenário de falha e resultado esperado antes do código. Repita o caso que falhou após corrigir. Separe STATIC_PASSED/MOCK_PASSED de teste real; registre build, versão instalada e ações executadas. Confira o código/ZIP efetivamente instalado e não use uma aprovação parcial para prometer cenários não percorridos. Fonte completa: addon-src/AllianceDungeonTrail/Product.lua.
