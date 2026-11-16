# WoW Forever Alliance Addon AI Factory

## Banco factual Wowhead Forever

A fábrica possui agora **176 entidades curadas**, incluindo **72 quests com IDs**, **124 relações** e **89 referências**, organizadas por categoria em `knowledge/alliance/`. A inicialização importa os fatos no SQLite e no RAG com fonte por campo e lacunas explícitas. É um catálogo parcial comunitário, não uma base completa ou confirmada no cliente.

Leia [o guia de dados e uso pelos agentes](docs/WOWHEAD-KNOWLEDGE.md), [o manifesto](knowledge/packs/wowhead-forever/manifest.json) e [a cobertura](knowledge/gaps/wowhead-forever.json). Use `npm run knowledge:validate`, `npm run init` e `npm run knowledge:coverage`. `npm run knowledge:export` gera TXT e JSON locais. No MCP, consulte `get_knowledge_coverage` e `get_gameplay_entity` antes de preencher requisitos de um addon. Não há crawler ou cópia de textos/ativos do Wowhead.

**Fábrica agêntica de addons para leveling Alliance 1–60, com RAG, SQLite, memória, MCP, regras de compatibilidade, testes e geração de ZIPs.**

> Status da base: **funcional offline para ingestão de documentos locais, consulta, memória, validação estrutural de blueprints, empacotamento, testes Node e MCP stdio**. **Não** é uma base de quests ou API completa do WoW Forever. O pacote editorial de 15/11/2026 inclui 19 documentos originais resumindo fontes oficiais e 48 entidades estruturadas; IDs internos/rotas reais continuam pendentes. Testes no cliente real ainda são obrigatórios. A geração com LLM é opcional e requer credenciais.

> Base inicial de conhecimento oficial preenchida: consulte [`docs/KNOWLEDGE-PACK-FOREVER.md`](docs/KNOWLEDGE-PACK-FOREVER.md). Os dados internos de cliente ainda precisam de exportação e verificação.

## Comece em 5 minutos

Requisitos: **Node.js 22.16+ (recomendado Node 24 LTS)**. A instalação básica não exige Python, serviços externos, credenciais, IDE nem dependências npm de runtime. SQLite é fornecido pelo `node:sqlite` (em Node 22 pode exibir um aviso de API experimental).

```bash
npm ci --ignore-scripts
npm run init
npm test
npm run doctor
npm run example
```

Após `npm run example`, consulte:

- `releases/AllianceLevelPulse-0.1.0-candidate.zip` — addon demonstrativo pronto para extrair no diretório de AddOns do Forever, **ainda não testado em cliente real**.
- `releases/AllianceLevelPulse-icon.png` — arte original para identificação do projeto.
- `traces/last-journey.json` — trilha de etapas realmente executadas.
- `dist/AllianceLevelPulse/FACTORY-VALIDATION.json` — validação estática e limitações.

Na pasta do jogo, instale em `World of Warcraft/_forever_/Interface/AddOns/AllianceLevelPulse/` (confirme a pasta do seu cliente). A pasta descompactada deve conter `AllianceLevelPulse.toc` diretamente. Depois abra o cliente com personagem da Alliance e use `/alp show` ou `/alp hide`.

## Criar outro addon com Codex / Work / um agente conectado

1. Envie o repositório ao GitHub.
2. Dê ao agente acesso de escrita, leitura e terminal ao clone do projeto; use `AGENTS.md`, `FACTORY-WORKFLOW.md` e a Skill `.agents/skills/build-alliance-addon/SKILL.md`.
3. Peça: **"Crie o addon [nome] para WoW Forever Alliance 1–60, usando obrigatoriamente a jornada, RAG, matriz de capacidades e validações. Gere blueprint, código original, testes e ZIP em releases."**
4. O agente deverá pesquisar fontes verificáveis e preencher o JSON no formato `schemas/addon-blueprint.schema.json`; salve em `evals/fixtures/MeuAddon.blueprint.json` (para teste de desenvolvimento) ou `.data/generated/MeuAddon.blueprint.json` (para saída privada).
5. Execute `node --experimental-strip-types orchestrator.ts --blueprint evals/fixtures/MeuAddon.blueprint.json`.
6. Faça os testes dentro do jogo e só depois considere publicar no CurseForge.

### Gerar o esqueleto de um novo addon sem créditos de IA

```bash
npm run new -- AllianceTrainerNotes "Indicadores de treinadores Alliance"
```

O comando cria `.data/generated/AllianceTrainerNotes.blueprint.json` com TOC/Lua mínimos. Ele **não implementa** automaticamente as funcionalidades pedidas: serve como ponto de partida para o agente pesquisar, escrever e validar o código. Depois, execute a jornada com `--blueprint`.

### Geração opcional direta com um LLM

Para quem deseja solicitar a um modelo externo a geração de um primeiro blueprint (os resultados continuam sujeitos às verificações):

- Configure `config/models.json` com `enabled: true` e um modelo realmente disponível na sua conta.
- Configure `OPENAI_API_KEY` no ambiente (não no GitHub).
- Execute `npm run agent -- "Crie um addon Alliance para ..."`.
- A implementação é compatível com a API *Chat Completions* do provedor configurado; modelos/provedores podem exigir adaptações.

**Sem a chave, a geração por texto livre não funciona automaticamente.** O projeto não possui créditos pagos embutidos. Em contrapartida, Codex, Work ou outro agente que já tenha acesso ao repositório pode produzir o blueprint diretamente, sem usar a API opcional deste boilerplate.

## RAG: duas coleções, um índice

- `api`: notas técnicas e dumps de API/licenciados para o cliente Forever.
- `leveling`: documentação de progressão Alliance verificada por versão.

```bash
npm run search -- "UnitXP"
npm run knowledge -- quest "Synthetic Alliance" 3
npm run capability -- xp-display
npm run index
```

O mecanismo gratuito usa **SQLite FTS5** e filtro de facção, nível, build e licença. Embeddings semânticos são **opcionais**, via provedor externo, ativados com `npm run index:embeddings` e chave válida. Não há um banco vetorial supostamente cheio; ele começa vazio.

Os dados reais de quests, talentos Legacy, novas zonas, pets e dungeons **não estão pré-carregados**. `evals/fixtures/` contém registros inteiramente **sintéticos** somente para exercitar o modelo. Consulte `docs/ADDING-KNOWLEDGE.md`.

## MCP

`npm run mcp` inicia um servidor MCP **stdio local** com ferramentas, recursos e prompts para um agente compatível. Leia `mcp/README.md`. Isso não registra o servidor automaticamente no ChatGPT Work, nem cria uma URL HTTP pública. Um Work conectado poderá utilizar ferramentas quando a integração e permissões efetivamente suportarem esse transporte.

## Pastas importantes

| Pasta | Uso |
|---|---|
| `addons/` | Código-fonte dos addons produzidos |
| `dist/` | Entregas locais em formato de pasta |
| `releases/` | ZIPs candidatos e ícones publicitários gerados |
| `market-references/zygor/` e `restedxp/` | Material privado de referência autorizado; **ignorado no Git** e não indexado automaticamente |
| `knowledge/alliance/` | Entidades Alliance, grafo, SQLite |
| `knowledge/provenance/` | Regras e origem de conhecimento |
| `knowledge/capabilities/` | Matriz de viabilidade de funcionalidades |
| `memory/` | Memória persistente de projetos/decisões/falhas |
| `rag/` | Indexação + pesquisa sobre fontes locais |
| `diagnostics/ForeverDevProbe/` | Addon opcional de diagnóstico, sem rede externa |
| `mcp/` | Ferramentas/recursos/prompts compatíveis com MCP |
| `design-system/` | Paletas e geração de arte original por addon |
| `evals/` | Mocks, fixtures sintéticas e cenários de benchmark |

## O que a base não afirma

- Não declara compatibilidade de cada API sem verificação em build correspondente.
- Não executa testes reais dentro do cliente por conta própria.
- Não possui um banco completo de quests, talentos, trainers ou pets.
- Não copia roteiros, código, arte ou bases pagas de Zygor/RestedXP.
- Não publica automaticamente no CurseForge.
- Não garante que um agente externo execute etapas se não tiver acesso às ferramentas; os comandos locais aplicam verificações estruturais obrigatórias.
- `STATIC_PASSED` **não significa** que o Lua compilou, que o addon carregou ou que o CurseForge aprovou o arquivo.

## Referências

- [Atraeau/WoW-Addons — ambiente e API Forever](https://github.com/Atraeau/WoW-Addons)
- [Thunderz96/forever-addon-kit — medições de API](https://github.com/Thunderz96/forever-addon-kit)
- [Warcraft Wiki — formato TOC](https://warcraft.wiki.gg/wiki/TOC_format)

Leia `docs/READY-FOR-AGENT.md` e `docs/TESTING-STRATEGY.md` antes de desenvolver ou distribuir novos addons.

**Licença MIT aplicável ao código original da fábrica. World of Warcraft e marcas associadas pertencem a seus respectivos titulares.**
