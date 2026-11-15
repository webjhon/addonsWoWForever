# Contratos de integração

## Entradas

`schema/addon-blueprint.schema.json` define o conteúdo autoral gerado pelo agente: nome, versionamento, objetivo Alliance, nível 1–60, Interface, arquivos TOC/Lua/XML/Markdown, eventos/APIs e fontes de evidência. Os caminhos são relativos ao addon e são examinados para evitar traversal; symlinks não são aceitos no empacotamento.

## Serviços

- `openDb`, `upsertEntity`, `queryAlliance`, `linkEntities`, `getRelations` em `src/db.ts`.
- `searchKnowledge(query, options)` em `src/search.ts`.
- `capability` e `setCapability` em `src/db.ts`.
- `recordMemory`, `getMemories` em `src/db.ts`.
- `validateBlueprint` em `src/guards.ts`.
- `executeJourney({blueprintPath|prompt})` em `orchestrator.ts`.
- `buildAddon(blueprintFile)` em `tools/build-addon.ts`.
- `parseProbe`, `importProbe` em `src/diagnostics.ts`.

## MCP

O servidor `mcp/server.ts` publica essas ferramentas por MCP stdio local. Use apenas a configuração permitida pelo agente/cliente. Chamadas para empacotamento restringem caminhos a `evals/fixtures/` e `.data/generated/`; o agente externo deve escrever o blueprint antes de chamar a ferramenta.

**Não há mecanismo de execução remota de código arbitrário pelo MCP da fábrica.** Um Work que não suporte esse servidor stdio precisará de uma integração de transporte remoto adicional.
