# Relatório: datamining local Forever — 17/11/2026

## Resultado e aplicação

Inspeção autorizada somente de leitura do cliente wowf 1.60.1.70938 ptBR. Engenharia reversa limitada aos formatos de armazenamento e metadados documentais; nenhuma injeção, patch, instrumentação de processos ou alteração do jogo. Nenhum teste em jogo foi executado nesta tarefa.

- 18 documentos extraídos do CASC local, totalizando 795 assinaturas factuais. Dez hashes coincidem com os dez arquivos de referência anteriores; os 33 contratos existentes ganham confirmação de origem documental, sem promoção de runtime.
- Seis tabelas DB2 WDC5 inspecionadas: Map81, ChrClasses9, ChrRaces58, CreatureFamily27, SpellName17991, SkillLine154 registros de cabeçalho. Schema WOWSTATIC_1_60_1_70399; build do cliente70938. Não foram decodificadas linhas, nomes, spells, coordenadas ou rotas a partir desses cabeçalhos.
- Estrutura completa dos três caches WDB percorrida até o terminador: criaturas1534, objetos2016, quests251. Nenhum texto ou ID individual encontrado foi publicado; cache não indica progresso de personagem.
- Executável x64 identificado e hashado; configuração filtrada para idiomas. Hashes e proveniência em knowledge/client/current.json; fatos de APIs em knowledge/client/api-signatures.json; manifesto exato em research/client/manifest.txt.
- Nova skill inspect-local-client incorporada às instruções, ao contexto do LLM e à etapa LOCAL_CLIENT_EVIDENCE. Build configurado divergente é rejeitado; null continua desconhecido. A fotografia histórica exige nova inspeção depois de uma atualização do cliente.
- RAG ganhou 19 documentos originais e 114 vetores: total582, todos vinculados a hashes atuais. Nenhum peso baixado novamente; modelo local existente reutilizado.

## Validação executada

Baseline antes das alterações: npm run init, npm test (117 aprovados), npm run example. Depois: npm run init, npm test (**128 aprovados, zero falhas**), npm run example (STATIC_PASSED com etapa LOCAL_CLIENT_EVIDENCE e clientVerified:false), npm run doctor, npm run rag:embed, npm run rag:status e npm run rag:eval.

Os onze testes novos verificam identidade e privacidade, ambiguidade de build, whitelist de configuração, contagem e limites de WDB, builds divergentes, truncamento/terminador, cabeçalho WDC5/schema separado, rejeição de geometria inválida, parsing de metadados Lua sem execução, restrições/secret values, consistência do catálogo e separação entre instruções e fatos no LLM.

A avaliação fixa de recuperação manteve **14/14 consultas na busca híbrida**, MRR@5=0,9286; lexical13/14. A amostra é diagnóstica, não garantia geral. Três consultas adicionais recuperaram fontes locais relevantes (WDC5/schema, arrastar frames e nameplates); detalhes em retrieval-check.json. A suíte existente não foi alterada para favorecer o resultado.

O quick_validate.py da skill não pôde iniciar porque o Python disponível é um alias WindowsApps inacessível. Frontmatter, descrição, referências e integração foram revisados diretamente; a integração de contexto foi executada e coberta pelo teste LLM. Não registrar o validador Python como aprovado.

## Limitações preservadas

Todos os símbolos do novo catálogo permanecem UNVERIFIED em runtime. API presente não garante chamada permitida, retorno público ou navegação utilizável. Prefixos de ScriptObject não são namespaces globais. Payloads WDB e linhas DB2 não foram interpretados sem schemas correspondentes. As quantidades de cache são uma fotografia parcial; não representam todas as quests/NPCs do Forever. Nenhuma informação de conta, personagem, chat, credencial ou SavedVariables foi exportada. Conteúdo bruto de cliente e ferramentas ficaram fora do commit, em diretórios locais de trabalho.

Não há addon ou ZIP novo nesta alteração: a entrega é a infraestrutura de conhecimento, parsers, skill, corpus, vetores e testes da fábrica. Aprovação e merge ficam com o usuário. O resultado de CI do commit entregue deve ser consultado no Pull Request, separadamente dos testes locais acima.
