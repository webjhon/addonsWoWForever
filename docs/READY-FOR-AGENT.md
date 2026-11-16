# Handoff operacional para Codex, ChatGPT Work e outros agentes

1. Abra o repositório e leia `AGENTS.md` e `FACTORY-WORKFLOW.md` antes de criar qualquer arquivo.
2. Instale Node 22.16+ e execute `npm ci --ignore-scripts`, `npm run init`, `npm test`, `npm run doctor`.
3. Leia `config/wow-version.json`; peça confirmação da build real antes de afirmar compatibilidade.
4. Consulte `rag/`, `knowledge/`, `memory/` e `market-references/README.md`. Use apenas referências autorizadas.
5. Para novo addon, faça pesquisa de APIs, capacidades e fatos de leveling; registre fontes por função e quest. Se não souber, marque desconhecido e gere alternativas honestas.
6. Defina UI original e um blueprint conforme o schema. O gerador de arte criará ícone próprio por nome; para publicação de alto padrão, revise a arte com o usuário.
7. Execute a jornada `orchestrator.ts --blueprint ...`. Se falhar, corrija a causa e repita; não altere manualmente o relatório para passar.
8. Guarde o candidato em `releases/`. Verifique dentro do WoW, corrija bugs do cliente e gere novo pacote.
9. Documente testes executados/pendentes, build, fontes, changelog e plano de melhorias.
10. Depois de testes reais e aprovação, publique manualmente no CurseForge, com ícone PNG e capturas originais.

**Exemplo de pedido ao agente:** "Crie AllianceQuestAid para leveling Alliance 1–60 no WoW Forever. Pesquise as APIs/quests e identifique lacunas. Gere blueprint, implemente, teste, empacote um candidato ZIP e forneça checklist de testes no cliente. Não invente dados e não copie guias pagos."

## Lembretes de capacidade

A instalação padrão não inclui acesso gratuito a API de geração de texto; o agente do Codex/Work deve operar sobre o clone. O Work precisa de acesso efetivo a arquivos e ferramentas; apenas apontar para um URL GitHub não executa o pipeline. O MCP é stdio local e requer configuração explícita no cliente.

## CONTRATO REVISADO: obrigatório para todos os addons

Leia também `docs/PROFESSIONAL-INTERACTIVITY.md` e `docs/TONHO-BRANDING.md`. A fábrica rejeita blueprints sem `interactivity`, fontes de dados reais, resposta automática e teste específico do addon. O gerador insere splash/arte e créditos **Tonho Contrabando**. Trabalhe numa branch e termine abrindo PR com ZIP, código e evidências; não faça merge sem aprovação. Não entregue manual de quests em vez de acompanhamento automático.
