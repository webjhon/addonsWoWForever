# Validação do banco factual Forever — 15/11/2026

Resultado: **STATIC_PASSED**. **30/30 testes automatizados aprovados**. Testes no jogo: **não realizados**; esta alteração é da fábrica e da ingestão de conhecimento.

- Base do PR: main 80a0738ae386d1a4412f6e4cbda9e88475c7dc24.
- Node v24.18.0; Ajv 8.20.0 com JSON Schema 2020-12. Auditoria npm: zero vulnerabilidades reportadas.
- 176 entidades, 72 quests, 84 IDs internos referenciados, 124 relações e 89 fontes. Cobertura parcial, build desconhecida, nenhuma promoção para CLIENT_VERIFIED.
- Validação de schema, campos com fontes, fonte individual de IDs, domínios Forever, facção, duplicatas, requisitos desconhecidos, arestas quebradas e ciclos.
- Ingestão e reimportação idempotentes; remoção de fatos antigos e FTS; isolamento de registros externos; rollback em falhas de integridade; quarentena de acesso desconhecido.
- MCP: cobertura, consulta por ID, busca tipada e RAG de leveling retornaram a quest 92489 com fonte e relação ao NPC 5694, sem afirmar disponibilidade confirmada.
- O indexador TXT foi executado em dois processos isolados; a segunda execução não cria fragmentos adicionais. Regressão da falha inicialmente reproduzida foi corrigida.
- Avaliador interno agora descobre todos os arquivos de testes, incluindo a suíte nova. O exemplo de empacotamento da fábrica concluiu a jornada com revisão explícita do pacote e suas lacunas.
- Inicialização, indexação, exportação TXT/JSON, doctor e consultas locais foram executados. Embeddings pagos não foram usados.

Os dados não são um dump integral do Wowhead. Coordenadas, IDs de mapas, cadeias completas, ranks, receitas, spawns, voos e disponibilidade por fase continuam como lacunas. Faixas de zona são editoriais. Há campos exigidos desconhecidos em cinco quests. Consulte [o guia](../WOWHEAD-KNOWLEDGE.md), [a cobertura](../../knowledge/gaps/wowhead-forever.json) e [a evidência JSON](wowhead-knowledge-2026-11-15.json).

Hash SHA-256 do bundle validado: 6281300db2407b83d3d06d044ff30db1db2a67766cc924d5211b9a90e7e02201.

O PR deve permanecer aberto até confirmação explícita do usuário para merge.
