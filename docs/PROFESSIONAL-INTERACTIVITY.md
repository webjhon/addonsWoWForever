# PADRÃO OBRIGATÓRIO — ADDONS PROFISSIONAIS E REATIVOS

**Aplica-se a todos os addons, sem exceção.** Não se deve entregar menus de consulta, listas de quests, diários manuais, PDFs incorporados, checklists ou um painel que só abre e fecha como principal funcionalidade.

## Pergunta que deve ser respondida antes do código

**Que trabalho o addon fará automaticamente pelo jogador enquanto ele joga, e qual será a próxima melhor ação recomendada?**

Exemplos de comportamentos aceitáveis (não copiar o código de terceiros):

- Guia de quests: detectar contexto de personagem e zona, identificar o passo vigente, orientar o NPC/objetivo por dados verificados, acompanhar o diário, avançar automaticamente após objetivo/entrega, recuperar progresso se o jogador agir fora da ordem. Waypoints só com coordenadas de fontes verificadas e APIs compatíveis.
- Hunter: reagir a alvo, pet, foco, nível, estado do combate e distâncias disponíveis; recomendar ação permitida, sem executar combate pelo jogador.
- Profissões/inventário: observar aquisição de materiais, progresso e requisitos, sinalizar oportunidade e próxima ação sem exigir digitação de contagens.
- Masmorras: observar eventos e estados reais, orientar preparação e objetivos; registro manual de run por si só NÃO atende.

## Requisitos executáveis (hard gates)

1. Contrato `interactivity` no blueprint: `playerBenefit`, >=2 `liveSignals` verificáveis no código, >=2 `automaticTransitions`, `nextBestAction`, `recovery`, `manualAsFallbackOnly: true`, >=3 `acceptanceScenarios`, `testFile` válido.
2. O código deve realmente consultar as APIs associadas aos sinais declarados. Deve referenciar eventos de progressão além de login. Pelo menos duas transições e decisão contextual, não apenas renderização de texto.
3. Um teste de aceitação por addon em `tests/<...>.test.ts` precisa executar e passar durante o próprio empacotamento. Os testes precisam simular pelo menos três mudanças de estado e validar a saída observável. Os testes de fábrica não substituem os testes de produto.
4. Interface contextual de uso durante o jogo, com clareza de próximo passo e continuidade. Créditos Tonho Contrabando via branding central, obrigatório em TOC e primeiro abrir.
5. Status correto: `STATIC_PASSED` e `MOCK_PASSED` não significam `CLIENT_VERIFIED` nem satisfação do usuário. Sem cliente real, entregue candidato para teste e não uma promessa de 100% compatibilidade.
6. Fase final é um PR aberto para revisão pelo usuário, com arquivos em `addons/<name>/`, ZIP em `releases/`, imagens e evidência. Nada vai para `main` antes de aprovação.

## Como impedir o caso AllianceDungeonTrail

Uma lista de 27 masmorras, 63 quests e dois botões de registrar run pode passar em testes estruturais, mas falha no OBJETIVO DO PRODUTO se não houver acompanhamento automático e orientação para próxima ação. A quantidade de fontes, linhas, questões ou testes nunca substitui valor funcional. Se o motor de quests/rotas não pode ser implementado porque APIs e coordenadas faltam, marque o projeto como **BLOQUEADO POR DADOS** e exponha lacunas. **Não complete um addon substituto pouco útil.**

## Teste humano de qualidade

Antes do PR, veja três estados diferentes do usuário: início, execução e após conclusão. Há evolução automática da orientação sem checklist manual? O usuário precisaria abrir um site para descobrir a próxima missão? A interface toma pouco espaço na tela em combate/exploração? Há suporte a reinício, login, mudanças de zona/nível? O tempo da implementação foi investido no acompanhamento, não em relatórios? Se não, redesenhe.

## Limites de automação

Addons podem observar dados e mostrar recomendações/waypoints quando as APIs, permissões e dados permitirem. Nunca movimentar, aceitar, entregar, atacar ou usar ações protegidas automaticamente. Dados indisponíveis ou secretos devem ser tratados honestamente.

**Nota:** a análise estática não prova excelência e pode ser contornada por código superficial. A revisão funcional, os testes de comportamento e testes no cliente permanecem necessários.
