# RAG operacional da fábrica

O corpus agora inclui documentos originais com contexto, limites, fontes e critérios, além dos fatos estruturados da base Alliance. raw-docs contém sínteses autorizadas, não dumps de guias proprietários. O banco operacional é .data/factory.sqlite (docs/FTS e doc_vectors), local e ignorado pelo Git. vector-store contém um snapshot portável de vetores reais; não é uma pasta usada como SQLite.

## Preparar e consultar

1. npm ci --ignore-scripts
2. npm run init — gera os 44 documentos expandidos, indexa o corpus e importa somente vetores cujo conteúdo bate com o hash atual.
3. npm run rag:status — mostra cobertura atual e disponibilidade do modelo; doctor e MCP get_rag_status também expõem isso.
4. npm run rag:model — preparação explícita, uma vez por cache, de Xenova/multilingual-e5-small na revisão fixada em config/rag.json. Baixa aproximadamente135MB de tokenizer/pesos/configuração para .data/models. Inferência posterior é local em CPU, sem chave ou custo por chamada.
5. npm run search -- "por que o NPC de quest não destaca?" --semantic — exige vetor e modelo locais; --lexical força apenas FTS. Sem flag, auto usa híbrida quando disponível e informa fallback lexical quando o modelo não foi preparado.

## Atualizar e avaliar

npm run init atualiza fontes geradas e chunks; npm run rag:embed gera vetores ausentes/desatualizados e exporta o snapshot. npm run rag:eval compara FTS e híbrida na amostra versionada evals/rag-queries.json. O teste local anterior usou um backup da base anterior com --baseline-db. A amostra é diagnóstica e não prova desempenho em qualquer pergunta.

Os embeddings são reais, de 384 dimensões, pooling mean, L2 e prefixos query:/passage: conforme a família E5. Modelo e revisão são identificados integralmente; vetores de outros modelos ou de conteúdo antigo não entram na busca. Modelos/pesos não são commitados. A dependência de inferência é opcional; pesquisa lexical e importação funcionam sem ela. Não chamar automaticamente API de embeddings paga: o helper remoto legado exige uso explícito e credencial.

## Conteúdo e procedência

- 33 contratos factuais de APIs de documentação versionada Gethe/wow-ui-source, snapshot bebcb6bf309cf41b41bd74f8ca651e6a105b2676; todos permanecem UNVERIFIED em runtime.
- Nove documentos técnicos, oito documentos de diagnóstico/engenharia e 27 fichas de dungeons, gerados por scripts/prepare-rag-corpus.mjs. Fichas usam o banco factual já revisado; não inventam quests ausentes ou posições internas.
- Casos reais AURANPC/DungeonTrail conservam PARTIAL_CLIENT_TESTED. Análises Zygor/RestedXP permanecem STATIC_REFERENCE_ANALYSIS. Busca e vetorização não promovem essas evidências.
- Cada arquivo tem .meta.json; rag/corpus-manifest.json registra hashes das sínteses geradas. Arquivos brutos market-references ficam fora do indexador.

## Integridade e recuperação

Chunks preservam título, seção e resumo contextual. Mudança de conteúdo invalida o vetor imediatamente. Encolher/apagar arquivo gerenciado limpa chunks/vetores antigos sem apagar registros de outro importador. Mudança apenas de metadados atualiza procedência/filtros. Indexação pode ser repetida sem duplicar. Backfill calcula vetores que faltam mesmo quando o texto não mudou.

O snapshot usa gzip JSONL e manifest SHA256; init rejeita checksum/forma/modelo inválidos antes de escrever. Conteúdo atualizado que não bate com snapshot antigo é ignorado e aparece como lacuna no status até regenerar. Atualizações inválidas de metadados não devem ser usadas como prova de elegibilidade Alliance ou compatibilidade.

Referências técnicas: https://huggingface.co/Xenova/multilingual-e5-small e https://huggingface.co/intfloat/multilingual-e5-small . Motor fixado no package-lock.json. Uso da API de pipeline foi validado com a versão instalada; não depender de uma versão inferida pela documentação online. Nenhum teste de jogo novo é feito por esses comandos.
