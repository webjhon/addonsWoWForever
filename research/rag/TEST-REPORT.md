# RAG: corpus, vetores e recuperação — validação executada

Base main01657e7, branch feat/rag-corpus-and-vectors. Data local2026-11-16; logs de execução usam UTC. Nenhum teste novo no WoW realizado.

## Diagnóstico

raw-docs tinha20 documentos curtos e a pasta vector-store continha só .gitkeep. Parte dos fatos já existia em SQL/knowledge, mas a geração opcional antiga de vetores dependia de credencial. O indexador pulava textos inalterados antes de preencher embeddings ausentes; fragmentava por caracteres e não removia consistentemente chunks/vetores de arquivos encurtados/apagados. A busca semântica antiga não restringia modelo nem hash do conteúdo. Não era correto tratar a pasta vazia como ausência de todo o conhecimento: havia218 chunks/documentos no banco anterior usado na comparação.

## Resultado concreto

- raw-docs:64 documentos (~130KB), com44 novos:9 técnicos,8 de diagnóstico/engenharia e27 fichas de dungeons. Os fatos de quests são parciais; quatro fichas explicitam ausência de curadoria. Nenhum guia proprietário foi ingerido.
- 33 contratos factuais de APIs consultados no snapshot primário Gethe bebcb6bf309cf41b41bd74f8ca651e6a105b2676. Argumentos, retornos, nulabilidade e fontes separados de aprovação em runtime. Dois símbolos não encontrados nos documentos consultados ficam como lacunas, não como inexistentes globalmente. Propriedades não declaradas permanecem desconhecidas.
- 468 documentos/chunks ativos,468 vetores de384 dimensões gerados por inferência real local. Snapshot gzipJSONL e manifesto com SHA256 em rag/vector-store. Modelo E5 multilíngue quantizado, revisão e pesos/tokenizer identificados em model-provenance.json. Cache/pesos (~135MB) não são commitados. Nenhuma API paga usada.
- Chunk contextual com título, seção e resumo; atualização de metadados; limpeza de removidos; invalidação por hash; backfill e idempotência. Vetores incompatíveis/corrompidos e fontes fora do escopo não entram na recuperação.
- Busca híbrida por fusão de ranks. Auto nunca baixa modelo/pesos nem chama serviço pago. Sem cache preparado, informa fallback lexical. rag:model é a preparação explícita; rag:status/doctor/MCP expõem cobertura. Init importa snapshot válido sem exigir inferência ou internet.

## Testes e evidências

Baseline107/107; final117/117, incluindo10 novas regressões: contexto/frase longa; backfill e limpeza sem atingir outro importador; invalidação; filtros de facção/acesso/domínio/nível/build/licença; modelo/hash incompatível; snapshot/tamper; lote inválido; ausência de rede no cache frio; conteúdo/vetores reais rastreáveis; metadados/revisão. Evals, doctor, exemplo, indexação repetida e diff-check passaram.

Execução real do modelo com fetch bloqueado: networkRequests0,384 valores finitos e norma próxima de1 (offline-model-probe.json). Não confundir os vetores sintéticos usados para testar ramificações/filtros com esse teste de inferência real. Instalação normal usa dependência opcional fixada4.3.2; inferência em CPU foi executada neste Windows. Não alegar teste da inferência em outras plataformas.

Inicialização em banco vazio, sem modelo no cache:468 chunks e468 vetores atuais importados, status localModelReady=false/lexical-fallback, pesquisa lexical funcional (clean-*). Fonte alterada ignora snapshot antigo até regenerar. Hash/manifesto inválido interrompe importação antes de writes.

## Recuperação medida

Perguntas e alvos foram fixados em evals/rag-queries.json antes da primeira execução. Amostra diagnóstica de14 perguntas PT/EN: base anterior lexical5/14; corpus novo lexical13/14; híbrido local14/14 (MRR@5 ~0,929). Acerto exige fonte esperada e fragmento de conteúdo pertinentes entre os5 primeiros resultados. Primeira medição híbrida13/14 expôs contratos sem contexto: o resumo do documento foi acrescentado aos chunks e a mesma amostra foi repetida, sem alterar alvos/perguntas. Relatórios inicial e final preservados.

Isso não é estudo estatístico nem garantia de acerto em qualquer solicitação. Relevância/embedding não promove evidência de API ou gameplay; status UNVERIFIED, COMMUNITY_UNVERIFIED e PARTIAL_CLIENT_TESTED continuam distintos. O corpus não se tornou banco completo de quests/spells. Nenhum novo teste no jogo, treino/fine-tuning de modelo ou validação integral da build foi realizado.

## Reprodução

npm ci --ignore-scripts; npm run init; npm run rag:status; npm run rag:model (download explícito uma vez); npm run rag:embed; npm run rag:eval; npm test; npm run evals; npm run example. Para refazer apenas os contratos: baixar os10 documentos do snapshot e rodar node scripts/extract-api-contracts.mjs DIRETORIO; SHA256 precisa coincidir com a fonte revisada. Não carregar Lua remoto por execução. Mais detalhes em rag/README.md.

PR exige aprovação; sem merge automático. Addons e ZIPs existentes não foram alterados. Validadores de produto foram preservados.
