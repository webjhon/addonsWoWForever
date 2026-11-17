# Política Alliance e Horde — 17/11/2026

Todos os addons novos ou revisados passam a atender **Alliance e Horde, níveis 1–60**. Nenhuma mudança no limite de nível, interatividade, autoria Tonho Contrabando, proteções do cliente ou aprovação por PR.

## Contrato de produto e geração

O blueprint usa `faction:"Both"` e `factionSupport` com `dataStrategy` (`shared-live-state` ou `partitioned-data`), `unknownFaction`, `acceptanceFactions:["Alliance","Horde"]` e `testFile`. O código observa UnitFactionGroup; facção desconhecida interrompe orientações dependentes de facção, limpa feedback antigo e tenta novamente em eventos apropriados. Não traduzir o token interno Alliance/Horde para comparar; texto exibido pode ser localizado. Login/reload e mudança de contexto exigem reconciliação. A aceitação deve incluir ambas as facções, dados ausentes e recuperação; o empacotador executa também o arquivo de testes de facção quando distinto do teste de interatividade.

`npm run new -- NomeDoAddon` cria um rascunho para ambas as facções; não é um produto aprovado. O exemplo executável também foi adaptado e seu Lua roda em mock com personagens Alliance/Horde, XP, nível60/61 e identidade desconhecida/recuperada. Isso não é teste no jogo.

O LLM recebe regras para ambas as facções e evidências separadas por facção. A jornada registra FACTION_SUPPORT_REVIEW e as fontes de pesquisa de cada facção. Não misturar etapas de guias, flight masters, pré-requisitos, treinadores, reputações ou quests de classe/raça. Um NPC ou dungeon compartilhado não torna suas quests compartilhadas. Não extrapolar de Classic, da cor do NPC, do ID de instância ou de um cache do cliente.

## Banco e RAG

`docs` e `entities` possuem flags independentes `alliance_access` e `horde_access`. Migração local é aditiva. Dados legados Neutral com acesso Alliance continuam exclusivos dessa elegibilidade até existir fonte para Horde; não são promovidos por silêncio. Faction Unknown fica fora do contexto operacional. Relações requerem ao menos uma facção comum entre os dois extremos e são filtradas novamente na consulta.

Exemplos:

```text
npm run search -- "quest NPC" --faction Horde --level 25
npm run knowledge -- quest "termo" 25 Horde
node --experimental-strip-types scripts/factory.ts entity "id" 25 Horde
```

As APIs queryFaction, searchKnowledge e entityContext recebem `faction:'Alliance'|'Horde'`. Consultas de personagem não aceitam Both, evitando mesclar passos. Wrappers e clientes antigos conservam Alliance como default; os novos fluxos consultam ambas explicitamente. O MCP oferece query_faction_records com facção obrigatória; buscas e contexto de entidade aceitam o seletor. O nome build-alliance-addon permanece como alias histórico da skill/prompt, cujo conteúdo agora cobre ambas.

Schemas de packs aceitam shards em knowledge/alliance/, knowledge/horde/ e knowledge/shared/. Um registro Horde deve ter alliance_access:false e horde_access:true; a flag Horde precisa de field_sources, como os demais fatos. Neutral só recebe horde_access:true com fonte. Unknown não pode receber nenhuma flag verdadeira. Campo omitido não concede acesso. A cobertura informa separadamente ambas as facções e conserva complete:false/clientVerified:false.

O pacote factual existente ainda possui **72 quests com elegibilidade Alliance e zero quests com elegibilidade Horde comprovada**. Isso é uma lacuna real, não uma instrução para inventar dados. A documentação técnica comum e as sínteses de engenharia revisadas são compartilhadas; fichas Alliance de quests/dungeons continuam filtradas. Conteúdo compartilhado não transforma testes antigos de personagens Alliance em testes Horde. Cada nova importação exige procedência e revisão.

## Candidatos existentes

config/faction-policy.json registra os hashes exatos de AURANPC2.0.1 e AllianceDungeonTrail3.1.0. Eles permanecem HISTORICAL_SINGLE_FACTION, sem aprovação Horde. Isso preserva a reprodução dos candidatos históricos; não libera alterações sob o escopo antigo. Qualquer alteração do blueprint, código embutido ou versão muda o hash e exige a nova política. Nunca atualizar o hash para contornar uma migração.

O AURANPC ainda contém bloqueio de facção no runtime e fallback de dados a revisar. O DungeonTrail ainda tem seleção/rotas/quests específicas da Alliance. A migração funcional de cada um precisa de revisão própria, dados pertinentes, testes e novo candidato; não foi realizada nem certificada por esta alteração da fábrica. A política aplica-se à próxima revisão de **todos** eles.

## Evidências de aceitação

Verificar: isolamento SQL/FTS/vetorial por facção; neutros com acesso unilateral e bilateral; relações cruzadas rejeitadas; migração sem promoção indevida; Horde com procedência aceita; flags sem fontes rejeitadas; desconhecido seguro; build/nível/licença continuam filtrados; novos produtos de facção única rejeitados; hash histórico alterado perde exceção; geração/MCP levam o contexto correto. Registrar separadamente testes automatizados e testes reais por facção. Aprovação Alliance nunca certifica Horde automaticamente.
