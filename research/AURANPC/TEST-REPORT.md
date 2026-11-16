# AURANPC 2.0.0 — testes executados

Execução 2026-11-16T14:01:09.409Z, Node v24.18.0. **88/88 testes aprovados** no conjunto completo, incluindo 16 testes específicos de comportamento/sintaxe e integridade do pacote. Evals da fábrica, doctor, exemplo e jornada executados. Validadores mantidos integralmente.

Status: STATIC_PASSED / MOCK_PASSED. **WoW Forever: NOT_RUN. Usuário só poderá testar depois. Nenhuma validação em jogo, visual real, compatibilidade/taint ou sucesso em dungeon foi declarada.** Executável instalado 1.60.1.70938, interface de referência16001; runtime UNVERIFIED.

Fengari executa Lua em mock: aceite/objetivos/conclusão/abandono/entrega; ordinais separados por tipo; fallback por título único da própria quest; mortes e saque; placas em movimento via âncora; troca de token e remoções perdidas; combate com placa permitida; placas proibidas/ocultas; GUID/tabelas/campos secretos; reload/GUID; limite80 unidades/40 marcadores; coalescência e ausência de rescan do diário no ticker; som local com cooldown; configuração e restauração de placas. Luaparse valida Lua5.1. Mock não reproduz o renderizador ou modelo de segurança real.

Pacote: SHA256, layout de instalação, conteúdo exato do blueprint e fonte, CRC32, autoria, branding central e TGA512x512 verificados por teste executável. As prévias UI-settings/highlight/complete são produzidas dos frames do mock, com fontes/âncoras aproximadas; não são capturas do jogo.

Revisão crítica: observação automática faz a parte principal; nenhuma marcação manual de progresso. Destaque é desenhado pelo AURANPC, com borda opaca mesmo sem pulso, exclamação e quest. Som é opt-in. Referência ForeverAuras usada apenas para avaliar arquitetura de âncoras/eventos, sem incorporar código/arte GPL. Associações MIT têm proveniência versionada, mas podem divergir de objetivos da fase atual.

Limitações materiais: efeito 2D sobre placas públicas, não aura3D; depende de alcance/visibilidade e restrições do cliente, sem promessa100%. Até40 marcadores simultâneos; sobreposição em grupos densos precisa de avaliação real. Dados cobrem1454 quests/5208 associações comunitárias de criaturas, não todas as quests; sem associação ou tooltip público correspondente, não inventa destaque. Placas amigáveis restritas em dungeon não são contornadas. Demonstração não conta como detecção. Aprovação final exige CLIENT-TEST.md no jogo.
