# AURANPC — relatório executado

Execução: 2026-11-16T04:20:02.998Z. Node v24.18.0. **STATIC_PASSED / MOCK_PASSED. CLIENT_VERIFIED: NÃO. Nenhum teste em jogo realizado.**

- Suíte completa: **76/76**, zero falhas. Inclui15 testes do motor AURANPC e um teste do ZIP distribuído, além das suítes existentes. Logs completos em node-tests.log.
- Fengari executou código original e branding da fábrica: ativação do CVar com readback, nenhuma escrita redundante, quests/alvo/contexto, mundo/party, pausa e restauração, conflitos externos, combate/retomada, API ausente/secreta/locked/secure/readOnly, falha de escrita/restauração, reload/GUID, Horde/nível61/raid/PvP, rajadas de eventos e primeira abertura.
- **O mock não renderiza círculos no mundo.** Transitar para party no mock prova somente que a política não desliga o recurso, não que o círculo aparece em uma dungeon real. Movimento, cor amarela, seleção de NPC e renderização do motor precisam de verificação visual no cliente.
- Sintaxe Lua5.1 validada por luaparse; execução headless Fengari Lua5.3 não reproduz cliente, taint ou valores secretos reais. Nenhum validador enfraquecido.
- Evals, doctor, exemplo e jornada obrigatória executados. Empacotador executa os testes específicos antes do ZIP. Conteúdos, CRC32, TOC, ordem de carga, autoria Tonho Contrabando, branding/Hunter e ícone original512×512 verificados.
- Três prévias mostram o painel em ativo, conflito e bloqueado, executando código real no mock. São aproximações de fontes/posicionamento, não capturas do WoW nem prova da aura no cenário.

A implementação gerencia **ShowQuestUnitCircles**, recurso nativo documentado na UI Forever. Não cria aura3D arbitrária nem controla cor/formato/cobertura de doadores/entregadores. Runtime70938 e aparência continuam UNVERIFIED. Ver RESEARCH.md para fontes, capacidade e revisão crítica; INSTALL.md contém o roteiro de validação real. Não publicar como testado no cliente antes dessa etapa.
