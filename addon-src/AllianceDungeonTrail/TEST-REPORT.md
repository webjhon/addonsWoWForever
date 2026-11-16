# AllianceDungeonTrail 3.0.0 — relatório executado

Execução: 2026-11-16T13:02:00.140Z. Node v24.18.0. **71/71 testes aprovados**, incluindo36 cenários específicos. STATIC_PASSED/MOCK_PASSED. **Nenhum teste dentro do WoW realizado.**

Interface reconstruída: hub com seletor das27 dungeons, overview de acesso/encontros/quests, configurações persistentes e tracker separado. Plano escolhido é preservado; instância atual prevalece temporariamente. A seta é desenhada e rotacionada por código original e arte própria, com distância em linha reta e chegada que não conclui quest. Ticker limitado atualiza só geometria, sem consultar diário.

Cenários executados: seleção pela interface sem abandonar quests; entrada/saída e retomada de plano; configurações/GUID/reload; overview das27; setas sem C_SuperTrack/GetNextWaypoint; geometria cardinal e giro; movimento/chegada; perda de mapa; boss observado por evento; cancelamento do ticker; progressão autoritativa anterior, combate, morte, abandono e migração.

Dados próprios embarcados: coordenadas factuais MIT versionadas para48 coletas,55 entregas,16 entradas; áreas de objetivos selecionadas por tipo/máscara; catálogo de encontros da tabela DB2 da build70938. Referências comunitárias continuam UNVERIFIED em runtime. Ponto de entrada nunca vira coordenada de boss. **Não há pathfinding nem cobertura de posições internas garantida.**

Fengari executa Lua5.3 em mock; luaparse valida sintaxe5.1. Evals, doctor, exemplo e jornada determinística executados. Gates/autoria preservados. Verificação de conteúdo do ZIP, CRC32, TOC, branding, ícone e Arrow.tga. Prévias de hub/configurações/quests/seta são cenas de mock, não capturas do jogo.

Pendente para aprovação final: validar no Forever70938 as APIs de posição/rumo, direção visual da seta, fontes/escala/scroll, eventos reais de encontros, coordenadas comunitárias e utilidade em sessão de leveling. Quatro dungeons continuam sem quests curadas; overview não é mapa geométrico nem lista garantida de bosses ativos da fase. Nenhum resultado foi promovido a CLIENT_VERIFIED.
