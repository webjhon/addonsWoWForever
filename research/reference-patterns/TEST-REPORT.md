# Validação da integração de padrões de referência

2026-11-16. Base main 768381a, branch feat/reference-patterns. Inspeção estática dos módulos selecionados dos snapshots locais Zygor1.6 Forever e RestedXPv4.11.36; não é auditoria de todos os arquivos nem teste no jogo. Evidências e decisões em ANALYSIS.md; catálogo e SHA256 em knowledge/lessons/reference-patterns.json.

Executados: npm ci --ignore-scripts; init; baseline101/101; bateria final107/107; evals; doctor; exemplo completo; CLI patterns:context. Os seis testes novos validam consideração universal e pertinência, contexto da geração, política/procedência inválida, ausência das pastas brutas/CRLF e RAG sem promoção de capacidade. O exemplo terminou STATIC_PASSED com REFERENCE_PATTERN_REVIEW e os 12 padrões registrados. Logs nesta pasta. git diff --check passou.

Frontmatter/nome/descrição da skill exercitados pelo carregador; referências originais e caminhos revisados. quick_validate.py não executado por ausência de runtime Python neste ambiente; não declarar execução desse script. Mensagens de geração testadas localmente, sem chamada paga a modelo remoto. Nenhuma nova sessão no WoW, modificação dos addons ou nova aprovação CLIENT_VERIFIED.

Contextos de RAG/geração contêm somente análise original. Módulos de guia e datasets de terceiros não são carregados pelos novos seletores, incluídos em blueprints ou copiados em releases. Declarações de licença locais são registradas como metadados, sem assumir autorização global. Reuso proposto é conceitual, com implementação original e APIs/dados verificados separadamente.

Seleção de padrões não prova que o próximo addon os implementou: a skill exige registrar adoção/adaptação/não aplicabilidade no plano/PR e converter o que for adotado em critérios do produto. Não se mediu redução estatística de defeitos. Validadores anteriores preservados. PR depende de revisão do usuário, sem merge automático.
