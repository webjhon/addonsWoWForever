# Relatório de aceitação — versão inicial 0.1.0

Data: 2026-11-14. Ambiente: Node.js 22.16.0 (Linux), SQLite `node:sqlite`. Testes realizados em sandbox local.

| Critério do prompt | Evidência | Resultado |
|---|---|---|
| A — Estrutura | Pastas, arquivos, Skill, docs, MCP | PASSOU |
| B — Instalação | `npm ci --offline --ignore-scripts` | PASSOU |
| C — Banco Alliance | `npm run init`; migrações SQLite | PASSOU |
| D — Filtro de facção | Teste Alliance, Horde, Neutral permitido/negado | PASSOU |
| E — Busca de conhecimento | SQLite FTS5 e domínio filtrado | PASSOU |
| F — Proveniência | Resultados contêm `source_id`, evidência e licença | PASSOU |
| G — Memória | Gravação e recuperação de decisão com evidência | PASSOU |
| H — Capacidades | Default UNVERIFIED, SUPPORTED requer evidência | PASSOU |
| I — Diagnóstico | Importação de fixture SavedVariables sintética | PASSOU |
| J — Benchmark | 12 cenários definidos; execução completa ainda não implementada | PARCIAL |
| K — Integração | Imports diretos, MCP inicializa e expõe tools | PASSOU (offline) |
| L — Segurança | Denylist, traversal, escopo e higiene de credenciais | PASSOU nos testes previstos; não substitui auditoria |
| M — Addon demonstrativo | TOC/Lua/ícone, ZIP e validação estática | PASSOU estruturalmente; cliente não testado |
| N — Arquivo ZIP | `unzip -t` no addon demonstrativo | PASSOU |

**Testes automatizados: 14 de 14 aprovados.** Lua interpretador e Luacheck não disponíveis no ambiente de produção do ZIP; execução headless de Lua não realizada. Cliente WoW Forever não estava disponível; nenhuma funcionalidade do addon foi comprovada dentro do jogo. Nenhum LLM externo foi chamado; streaming, embeddings semânticos e fallback estão implementados como integrações opcionais, não foram exercitados com serviços reais. O servidor MCP foi verificado também por mensagens JSON-RPC reais em stdin/stdout (initialize, tools/list, tools/call).

Não interpretar `STATIC_PASSED` como `CLIENT_VERIFIED`. As fontes comunitárias são referências, não garantias de compatibilidade com a build de destino. A ingestão de quests e dados reais continua sendo trabalho de curadoria.
