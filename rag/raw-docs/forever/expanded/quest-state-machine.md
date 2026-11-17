# Máquina de estados de quests com dados desconhecidos

## Evidência e escopo

Identidade numérica, objetivos atuais e informação de entrega devem ser fontes de verdade independentes do checklist. MISSING não equivale a TURNED_IN; READY não equivale a entrega. Objetivo indisponível não pode ser interpretado como concluído. Desconhecido precisa continuar desconhecido.

## Decisões para implementação

Reconciliar depois de aceitação, mudança de objetivo, remoção e reload. Eventos podem chegar repetidos ou fora da ordem. Só emitir avanço autoritativo após sinal correspondente. Incluir testes de abandono, falha, segredo, morte, troca de personagem e retorno de API.

## Como verificar

Defina comportamento observável, cenário de falha e resultado esperado antes do código. Repita o caso que falhou após corrigir. Separe STATIC_PASSED/MOCK_PASSED de teste real; registre build, versão instalada e ações executadas. Confira o código/ZIP efetivamente instalado e não use uma aprovação parcial para prometer cenários não percorridos. Fonte completa: docs/PROFESSIONAL-INTERACTIVITY.md.
