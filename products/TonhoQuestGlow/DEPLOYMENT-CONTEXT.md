# Tonho QuestGlow — janela de contexto da entrega

## Identidade e retomada

Data18/11/2026, branch release/tonho-questglow a partir de main440f974. Produto derivado do AURANPC2.1.1 aprovado. Nome público Tonho QuestGlow, pasta/TOC TonhoQuestGlow, versão1.0.0, Author Tonho Contrabando, escopo Alliance/Horde1–60. Código autoral existente e dados preservados; aliases e comandos explícitos adicionados. Fontes em addon-src/TonhoQuestGlow, build gerado em addons/TonhoQuestGlow. Não fazer merge sem aprovação do usuário.

## Materiais e reprodução

products/TonhoQuestGlow reúne instalador/SHA256, seis screenshots reais/manifesto, ícone400×400, descrição inglês+português, changelog inglês+português, metadados, auditoria e relatórios. O ZIP contém13 arquivos de runtime/arte/documentos e não leva blueprints/logs/relatórios/caches da fábrica. Copyrights MIT obrigatórios permanecem; não há ofuscação.

Reproduzir pacote: node scripts/prepare-questglow.mjs → node --experimental-strip-types orchestrator.ts --blueprint research/TonhoQuestGlow/TonhoQuestGlow.blueprint.json → node --experimental-strip-types scripts/stage-questglow.ts. stage preserva o changelog bilíngue de postagem já revisado. Public distribution conserva os validadores existentes. Evidência do empacotador é STATIC_PASSED/clientVerified:false, independente dos cenários reais parciais.

## Jogo e medidas

Cliente observado GetBuildInfo1.60.1 build70959/interface16001, ptBR, Alliance nível2, Vila Norte. Pasta nova reconhecida após reload. Migração opcional usa AURANPCDB disponível na primeira sessão; depois AURANPC foi desativado e TonhoQuestGlow sozinho testado. Todos os13 arquivos instalados conferidos por SHA256 com addon gerado (research/TonhoQuestGlow/INSTALLED-HASHES.json).

Observados: créditos/painel com identidade final, abrir/fechar por comando, selo bag ligado/desligado, NPC marcado em movimento/combate manual, carne da quest destacada no loot e bag, lixo comum sem destaque, coleta5/8→6/8 e limpeza. Após última mudança só na ajuda, reinstalação/reload e nova conferência proporcional. No final do teste o personagem estava vivo, sem combate; autoInteract0/autoLootDefault1 restaurados e confirmados. Não deletado quest item nesta entrega.

Benchmark real: referência AURANPC aquecida7,49–8,03MiB; QuestGlow após reload1,98–2,41MiB; uso representativo3,54–9,05MiB. Sem comparação percentual devido a estados diferentes. Custo não demonstrou necessidade de otimização; funcionalidades/algoritmos aprovados preservados. BENCHMARK.json tem valores/intervalos brutos, BENCHMARK.md metodologia e limites. CPU/RSS/VRAM/longa duração não medidos. Controle do app desktop CurseForge travou cerca22min antes da coleta final; houve recuperação/verificação do personagem, sem alegar observação contínua.

## Verificação e conhecimento

188 testes locais passaram sem falhas/pulados; suíte histórica reexecutada contra produto novo, regressões nil questID/isActivefalse preservadas, duas facções no mock e unknown faction. Evals PASSED, doctor executado. Testes reais PARTIAL_CLIENT_TESTED: não certificar Horde/dungeon/outras línguas/UIs alternativas. GitHub Actions precisa ser conferido no SHA do PR; seu resultado é registrado no PR.

Nova skill roteada .agents/skills/publish-wow-addon/SKILL.md; registry knowledge/lessons/live-client.json, entradas AGENTS/FACTORY-WORKFLOW. Skill validada por carregamento/roteamento e revisão do frontmatter; quick_validate.py não executado porque Python disponível era alias WindowsApps sem intérprete funcional.

Lição original indexada: knowledge/seed-docs/forever-addon-publication.md, source_id forever-addon-publication-2026-11-18. npm run init e rag:embed adicionaram a lição com7 chunks/vetores, snapshot597/597 atual, E5 multilingual local384 dimensões sem API paga. Avaliação15 consultas: lexical14/15; híbrida15/15, inclusive nova consulta de publicação. Amostra diagnóstica, não garantia geral. Evidências: research/TonhoQuestGlow/retrieval-evaluation.json. Buscar: npm run search -- "ZIP público CurseForge benchmark memória" --semantic. Conteúdo procedural compartilhável não equivale a gameplay Horde testado.

## CurseForge — estado separado

Portal autenticado pelo usuário. Projeto criado ID1815151, preview https://www.curseforge.com/wow/addons/tonho-questglow/preview ; gestão https://authors.curseforge.com/#/projects/1815151/files . Nome/resumo inglês, descrição inglês primeiro, ícone próprio400, licença MIT, categorias Quests & Leveling / Bags & Inventory, comentários habilitados e distribuição extra CurseForge desabilitada. Arquivo9689104, TonhoQuestGlow-1.0.0.zip submetido como Release para WoW Forever1.60.1, publicação automática somente após aprovação. Estado final observado após reload do portal: Under Review. Seis screenshots reais carregadas e legendadas. Fonte GitHub configurada sem empacotamento automático. Capturas de comprovação: curseforge/submission.jpg e gallery.jpg. Projeto novo exige moderação; não declarar PUBLISHED antes da aprovação visível.

Seletor de logo não respondeu à automação; usuário concluiu esse envio. No envio ZIP, o fluxo documentado waitForEvent(filechooser) antes de clicar no botão Choose File funcionou. Para texto longo usar paste/fill: typeText caractere a caractere atingiu timeout e deixou conteúdo parcial, que foi substituído e conferido integralmente. O upload não autoriza contornar CAPTCHA/acordos. Evitar app desktop travado; portal é suficiente.

Fontes oficiais consultadas18/11/2026: https://support.curseforge.com/support/solutions/articles/9000197279 ; https://support.curseforge.com/support/solutions/articles/9000197241 ; https://support.curseforge.com/support/solutions/articles/9000199552 ; https://us.forums.blizzard.com/en/wow/t/ui-add-on-development-policy/24534 . Reconsultar regras e opções atuais na próxima publicação.
