# Ampliação da fábrica para Alliance e Horde — 17/11/2026

## Entrega

O escopo padrão passa a Alliance **e** Horde, níveis1–60, para todos os addons novos ou revisados. Foram alterados instruções/skills, prompt, schema, validação, scaffolding, pesquisa, orquestração, banco, importação de fatos, MCP/CLI e metadados de embalagem. Nenhum jogo instalado foi alterado; nenhum teste real em jogo foi realizado nesta tarefa.

O contrato factionSupport exige estratégia de dados, tratamento de facção desconhecida, ambas as facções na aceitação e arquivo executável de testes. FACTION_SUPPORT_REVIEW registra a decisão na jornada. O empacotador executa testes de facção além dos de interatividade quando os arquivos diferem. As regras de autoria, produto reativo, build, nível, segurança e aprovação por PR continuam vigentes.

O banco ganhou horde_access por migração aditiva; gravações atualizam ambas as flags atomicamente. SQL, relações, FTS, busca semântica e importação/exportação de vetores aplicam os limites de acesso. Neutral legado com acesso Alliance não se torna Horde automaticamente. Dados Horde com elegibilidade/procedência adequada podem entrar no pack; flags sem fontes ou facção desconhecida não são promovidas. Schema aceita shards alliance/horde/shared. Queries de personagem aceitam uma facção por vez; o LLM e o orquestrador pesquisam cada facção separadamente.

Documentação técnica comum foi revisada e compartilhada. Fichas específicas Alliance continuam nessa elegibilidade. O catálogo factual ainda contém 72 quests elegíveis para Alliance e **zero quests com elegibilidade Horde comprovada**. Não foram inventados fatos ou copiados dados Alliance para preencher a lacuna. Cobertura por facção está em knowledge/gaps/wowhead-forever.json; instruções de ingestão em knowledge/horde/ e knowledge/shared/.

## Candidatos anteriores

AURANPC2.0.1 e AllianceDungeonTrail3.1.0 têm hashes exatos registrados como HISTORICAL_SINGLE_FACTION. Permanecem reproduzíveis sob esse rótulo; **não receberam suporte Horde nesta alteração**. Qualquer modificação de código embutido/blueprint/versão invalida a exceção e exige migração para a política nova. Isso preserva a evidência antiga e aplica a nova exigência à próxima revisão de todos os addons. A adaptação funcional de cada produto e a validação real por facção continuam pendentes.

## Verificações executadas

- Antes: npm ci --ignore-scripts, npm run init, npm test (**128 aprovados**), npm run example.
- Depois: npm run init, npm test (**141 aprovados, zero falhas**), npm run example (**STATIC_PASSED / DUAL_FACTION_CANDIDATE / clientVerified:false**), npm run doctor.
- Novo exemplo Lua executado com Fengari em Alliance e Horde: atualização de XP, nível60, bloqueio em61, identidade desconhecida e recuperação para ambas as facções. Mock de API/UI, não teste de WoW.
- Testes novos cobrem migração/reabertura de banco, isolamento de entidades/grafos/FTS/semântica, neutros unilaterais/bilaterais, vetores Horde, importação com fontes, rejeição de fontes ausentes, exceção histórica exata, schema compilado em modo estrito, protocolo MCP e novo scaffold. Foi corrigida também a falha observada do scaffold CLI com descrição vazia, com regressão executável.
- npm run new -- FactionProbeDraft gerou rascunho Both, explicitamente não aprovado. A consulta CLI Horde respondeu sem inventar registros.
- npm run rag:embed e rag:eval: snapshot com **589 vetores**; amostra fixa híbrida **14/14**, lexical13/14. Avaliação preservada em retrieval-evaluation.json, sem substituir o relatório histórico anterior. Quatro consultas adicionais executadas nas duas facções recuperaram fontes com acesso correto (retrieval-check.json). Esses números são diagnósticos, não garantia geral de qualidade.

O resultado de GitHub Actions do commit entregue será registrado no Pull Request. Não houve certificação CLIENT_VERIFIED nem merge automático.
