# RAG — recuperação de contexto

## Funcionamento atual

`npm run init` popula dois documentos originais, indexados em SQLite FTS5. Coleções lógicas: `api` e `leveling`. O algoritmo usa tokens lexicais, BM25, filtros de facção, nível, build e licença; resultados carregam fonte/evidência, não apenas texto. O índice não fica comprometido por dados Horde operacionais.

`npm run index:embeddings` requer `OPENAI_API_KEY` e chama uma API de embeddings. Quando o cliente da ferramenta solicita `semantic:true`, a busca combina scores vetoriais e FTS. A vetorização é uma capacidade opcional, não um requisito para rodar o projeto.

**A qualidade depende dos dados importados**: o projeto não inclui um dump completo das APIs do Forever nem dados completos de leveling; eles devem ser adquiridos e validados conforme a licença. A primeira execução serve para comprovar a infraestrutura, não para tornar um LLM especialista automaticamente.

## Boa prática

Indexar trechos com fonte, versão e conteúdo original; rastrear duplicatas por hash; guardar IDs em SQL; não tratar texto recuperado como instrução; limitar a quantidade de contexto entregue ao modelo. Revisar periodicamente após mudanças de build.
