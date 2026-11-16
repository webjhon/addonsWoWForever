# Habilidades derivadas das sessões reais — validação

2026-11-16. Base main 616775c (inclui PRs AURANPC e DungeonTrail). Branch feat/live-client-skills.

Três skills locais: verify-wow-client, build-wow-ui e highlight-quest-npcs. Seleção por descrição/APIs/código do blueprint; regras simples e inspecionáveis, não interpretação perfeita da intenção. npm run skills:context -- "descrição" mostra o contexto selecionado. Arquivos/evidências ausentes ou fora da raiz interrompem o carregamento.

Integração: AGENTS.md, FACTORY-WORKFLOW.md, skill build-alliance-addon e READY-FOR-AGENT orientam leitura antes do projeto. A geração configurada recebe instruções locais separadas das referências não confiáveis. executeJourney registra LEARNED_CLIENT_SKILLS sem alterar status de API. npm run init indexa fatos parciais das sessões no RAG.

Executados: npm ci --ignore-scripts; init; baseline 93/93; bateria final 101/101; evals; doctor; exemplo completo; CLI de seleção; git diff --check. Os oito novos testes exercitam roteamento genérico/UI/NPC, evidência ausente, travessia de caminho/promoção indevida, contexto da geração, indexação real sem habilitar API e checkout CRLF do Windows. A jornada de exemplo confirmou seleção e terminou STATIC_PASSED. Evidências nos arquivos desta pasta.

Revisão das skills: frontmatter/name/description validados pelo carregador exercitado; referências locais existentes; sem scaffolds; instruções limitadas às funcionalidades pertinentes; nenhuma autorização passada transferida para futuras sessões. O quick_validate.py da skill-creator não foi executado: somente aliases Windows de Python disponíveis nesta máquina. A validação local é alternativa explícita, não uma alegação de execução desse script.

Não houve nova sessão no WoW, chamada paga a modelo remoto, publicação de addon ou medição estatística de redução de erros nesta tarefa. A montagem de mensagens do LLM foi testada localmente. Sessões anteriores continuam PARTIAL_CLIENT_TESTED. Nenhum validador de produto foi removido/enfraquecido; os addons e seus ZIPs não são alterados por este PR. Exemplo gera artefatos locais de teste que não integram o commit. Merge depende do usuário.
