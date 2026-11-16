# Relatório executado — AllianceDungeonTrail2.0.0

Execução: 2026-11-16T03:35:00.948Z. Node v24.18.0. **STATIC_PASSED / MOCK_PASSED. CLIENT_VERIFIED: NÃO. Nenhum teste dentro do WoW foi realizado.**

- Suíte completa: **60/60**, zero falhas. Inclui comportamento do addon em Fengari e testes da fábrica/base factual. Logs integrais em node-tests.log; cenários detalhados em tests/dungeon-trail.test.ts.
- Motor Lua executado em cenários de aceite localizado, viagem/entrada, objetivos fora de ordem, confirmação autoritativa, entrega/abandono, oferta do NPC, mapa/waypoint ausente, rastreamento externo, combate/retomada, morte/ressurreição, reload/GUID, migração de checks antigos, API ausente/valores secretos simulados, rajadas de eventos e calibração de XP conservadora. Não são só testes de regex ou presença de campos.
- Luaparse valida sintaxe Lua5.1; Fengari executa semântica Lua5.3. Mock não reproduz cliente, taint, valores secretos reais, renderização ou gameplay.
- Os validadores novos de qualidade/autoria permanecem intactos. O teste legado foi substituído por contrato2.0 e verificações de rejeição para autoria antiga/contrato ausente. Empacotador também executa a suíte específica antes de criar ZIP.
- Identificação das27 instâncias testada com IDs factuais da tabela Map70938 e nomes localizados; quests selecionadas têm IDs da base factual compartilhada. Dados DB2 são referência da build, não execução no jogo.
- Evals, doctor, exemplo e jornada determinística executados. Ver pacote e hashes em package-verification.json. Conteúdos do ZIP são comparados com o blueprint e branding injetado; CRC32, TOC, autoria, ordem de carga, Hunter, íconeTGA512×512×32 e metadados conferidos.
- Três prévias vêm da cena do mock executando o código real: preparação, objetivo e entrega. Fontes/posicionamento aproximados, explicitamente marcadas **não são capturas do WoW**. Não comprovam aparência no cliente.

## Limites e revisão

Ver PRODUCT-REVIEW.md, RESEARCH.md e API-CAPABILITIES.json. O executável instalado é1.60.1.70938; interface16001 ainda requer confirmação por GetBuildInfo em sessão real. APIs estão documentadas na branch Forever da UI Blizzard, com runtime desta build UNVERIFIED. Quatro guias continuam bloqueados por falta de dados de quests; catálogo selecionado, pré-requisitos parciais e disponibilidade de fase não garantida. Navegação usa exclusivamente waypoint/texto do cliente; sem ele não há seta precisa. Não há pathfinding indoor. Estimativa mede expedições comparáveis, não clears confirmados nem XP futura garantida.

Antes de aprovação final: executar roteiro de INSTALL.md no WoW, conferir eventos reais, objetivos/entregas, textura/fontes/escala, taint, reload, classe/idioma e utilidade durante sessão prolongada. **Não aprovado como produto final; PR candidato para revisão do usuário, sem merge automático.**
