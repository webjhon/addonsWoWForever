# Arquitetura da fábrica

## Visão operacional

`Codex / Work / agente externo -> AGENTS.md + Skill / FACTORY-WORKFLOW.md -> RAG/SQL/memória/capacidades -> blueprint JSON -> validação -> build -> candidate.zip -> teste manual no cliente -> publicação autorizada`.

O único orquestrador de jornada é `orchestrator.ts`; o MCP apenas disponibiliza ferramentas. Não existem serviços distribuídos, filas ou bancos remotos exigidos na execução básica. O repositório não contém um modelo LLM.

## Módulos concretos

- `src/db.ts` — SQLite `node:sqlite`, migração inicial, FTS5, entidades, relações, capacidades, memória.
- `rag/indexer.ts` — ingestão incremental por hash, documentos de origem, embeddings opcionalmente externos.
- `src/search.ts` — recuperação híbrida quando embeddings estão disponíveis; busca lexical real offline em todos os casos.
- `src/guards.ts` — TOC, escopo, nomes, guardrails; não substitui compilador Lua nem análise de taint da Blizzard.
- `src/art.ts` — ícone TGA in-game + PNG para divulgação, originais e gerados por addon.
- `tools/build-addon.ts` — ZIP candidato padronizado, relatórios de entrega.
- `src/diagnostics.ts` — importador de formato SavedVariables limitado, sem executar Lua.
- `mcp/server.ts` — JSON-RPC MCP stdio local com recursos, ferramentas e prompt.
- `src/llm.ts` — Chat Completions opcional; streaming SSE, seleção/fallback por configuração, JSON estrito.

## Fluxo obrigatório e seus limites

A execução de `orchestrator.ts` percorre contexto, RAG, guardrails, revisão de capacidade, empacotamento e handoff, registrando a trilha. Um agente externo é responsável pela **pesquisa detalhada e programação** do blueprint quando a geração local por LLM estiver desativada. O código impede empacotar blueprints inválidos, mas não pode garantir verificação dentro de um cliente de jogo ausente. Em nenhuma situação o status estático substitui evidência de jogo.

## Evolução futura

O projeto deixa pontos de extensão para revisão humana, ingestão de documentação versionada, embeddings, fontes de gameplay e verificação in-client. Para uso remoto, implementar autenticação e um transporte MCP acessível por rede em projeto separado; não expor o stdio diretamente.
