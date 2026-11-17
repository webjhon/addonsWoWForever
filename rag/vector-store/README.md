# Snapshot vetorial portável

manifest.json identifica modelo, revisão, dimensão384, quantidade, hash do conjunto de conteúdos e SHA256 do arquivo. forever-e5.jsonl.gz contém linhas {id, contentHash, embedding}; embeddings são float arrays normalizados gerados por inferência real do modelo local sobre documentos originais/autorizados. Não são hashes, vetores aleatórios nem resultados inventados.

npm run init importa só IDs presentes e hashes correspondentes, mantendo filtros de acesso/licença; npm run rag:embed regenera. O SQLite ativo fica em .data/factory.sqlite. Pesos/cache ficam em .data/models e não são distribuídos neste snapshot. Consultas neurais exigem preparação local explícita; sem ela, auto retorna lexical com indicação de fallback. Ver rag/README.md.
