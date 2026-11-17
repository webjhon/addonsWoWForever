# RAG operacional

Em2026-11-16: corpus ampliado64 documentos raw,468 chunks com vetores E5 reais. Comandos init/ rag:model/ rag:embed/ rag:status/ rag:eval e MCPget_rag_status documentados em rag/README.md. Busca auto usa inferência local apenas quando preparada; fallback lexical é explícito. Mudança de fonte invalida vetores; snapshot é hash-correspondente, não prova de API. Benchmark diagnóstico14 perguntas passou5→14 acertos@5, sem garantia geral. Evidências em research/rag/TEST-REPORT.md.
