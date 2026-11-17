# Eventos, rajadas e custo de atualização de addons

## Evidência e escopo

Os padrões de referência analisados sugerem separar cache/reconciliação de desenho, liberar observadores e reutilizar frames com limpeza. Presença de função num arquivo não prova que ela é chamada: ErrorLogger do Zygor analisado retornava antes do restante do módulo.

## Decisões para implementação

Agrupar rajadas de eventos, limitar ticker visual e cancelar quando oculto/pausado sem necessidade de desenho. Geometria pode atualizar sem reler todo diário. Medir frames, callbacks e consultas após trocar guias repetidamente. Não declarar performance no jogo com base no mock.

## Como verificar

Defina comportamento observável, cenário de falha e resultado esperado antes do código. Repita o caso que falhou após corrigir. Separe STATIC_PASSED/MOCK_PASSED de teste real; registre build, versão instalada e ações executadas. Confira o código/ZIP efetivamente instalado e não use uma aprovação parcial para prometer cenários não percorridos. Fonte completa: knowledge/lessons/reference-patterns.json.
