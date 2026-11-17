# Dado documental, fato comunitário e observação real

## Evidência e escopo

Documentação de API descreve contrato. Catálogo comunitário descreve fatos parciais. Teste de jogo comprova apenas o cenário observado. Embeddings e relevância de busca não aumentam o grau de evidência. Não promover UNVERIFIED a SUPPORTED porque uma resposta parece plausível.

## Decisões para implementação

Cada documento deve expor fonte, revisão/build quando conhecida, domínio, licença e limites. Texto original de síntese não autoriza importar guias pagos. Mudança de documento invalida seu vetor; remoção precisa limpar chunks antigos e vetores, preservando fontes de outros importadores.

## Como verificar

Defina comportamento observável, cenário de falha e resultado esperado antes do código. Repita o caso que falhou após corrigir. Separe STATIC_PASSED/MOCK_PASSED de teste real; registre build, versão instalada e ações executadas. Confira o código/ZIP efetivamente instalado e não use uma aprovação parcial para prometer cenários não percorridos. Fonte completa: FACTORY-WORKFLOW.md.
