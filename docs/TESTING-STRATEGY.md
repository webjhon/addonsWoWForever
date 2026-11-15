# Estratégia de testes e significado dos resultados

1. **Node/SQL**: `npm test` — valida estrutura, segurança, filtro Alliance, RAG, memória, importer e MCP.
2. **Mock Lua (opcional)**: `sh evals/run-evals.sh` detecta presença de `lua`; sem o interpretador, registra SKIP. Um mock não prova segurança nem compatibilidade real.
3. **Candidate build**: `npm run example` valida o blueprint e empacota com status `STATIC_PASSED` (verificação estrutural e estática própria, **não** compilação Lua obrigatória).
4. **Cliente real**: copiar addon, reiniciar o Forever, testar personagem Alliance, level adequado, logout/reload, comandos, UI, erros Lua, variação de resolução/combate. Somente depois documentar `CLIENT_VERIFIED` com build e evidências.
5. **CurseForge**: publicar apenas depois da revisão de direitos, imagens, descrição, changelog e compatibilidade específica.

O benchmark de 12 cenários em `evals/benchmarks/scenarios.json` define **casos propostos**, não pontuações automaticamente produzidas nem testes de addon real. Resultados `NOT_RUN`, `STATIC_PASSED`, `MOCK_PASSED`, `INTEGRATION_PASSED`, `CLIENT_VERIFIED`, `FAILED`, `BLOCKED`, `INCONCLUSIVE` são distintos.

Nota: o mock não intercepta todas as chamadas nativas WoW, não implementa taint e secret values e não verifica o funcionamento de texturas e controles em jogo.
