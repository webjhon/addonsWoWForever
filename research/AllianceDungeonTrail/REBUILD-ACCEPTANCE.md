# AllianceDungeonTrail 2.0 — contrato antes da implementação

## Benefício e decisão

O jogador recebe uma ação vigente: coletar uma quest potencial, viajar, executar o primeiro objetivo pendente, entregar ou escolher a próxima faixa. Aceites, objetivos, abandono, entrega e entrada/saída são observados, não confirmados por botões. O diário é autoridade; dados comunitários apenas enriquecem o contexto. Nenhum clique representa progresso.

## Arquitetura original

Adapters.lua normaliza APIs e rejeita dados secretos/incompletos; Core.lua reconcilia um snapshot e decide a ação; Navigation.lua acompanha a quest pelo rastreador nativo quando disponível e sem tomar uma marcação externa; UI.lua mostra um tracker compacto com ação, referência e continuidade. Data.lua é gerado da curadoria factual, preservando proveniência. Não há dependência de guia comercial.

Prioridades: escopo/indisponibilidade → morte → instância atual → objetivo local pendente → entrega → preparação/viagem. O foco permanece estável enquanto útil, mas uma quest nativa rastreada relevante ou a instância atual prevalece. Objetivos concluídos fora da ordem são reconciliados pelo diário. Ausência nunca significa entrega. Falta de API essencial produz estado BLOQUEADO explícito, sem checklist substituto.

## Aceitação observável

1. Nível 17 sem quests: recomendar preparação; aceitar Underground Assault (ID 2040, inclusive título traduzido) altera para viagem sem clique; entrar em Deadmines muda para execução.
2. Dois objetivos: concluir o primeiro mostra automaticamente o segundo; terminar ambos apenas não presume entrega; IsComplete autoritativo muda para entrega quando não há outra tarefa local pendente; QUEST_TURNED_IN remove a ação.
3. Abandono não é entrega; morte suspende orientação; retorno à vida e reload reconstroem a ação por GUID e diário; não herdar estado de outro personagem.
4. Waypoint válido do cliente acompanha a quest atual; nil/valor secreto/posição inválida remove navegação obsoleta e preserva referência de boss/sala. Rastreamento externo não é sobrescrito automaticamente. Nenhuma coordenada de teste vai ao catálogo.
5. Eventos em rajada são agrupados; em combate mantém orientação anterior com indicação de atualização pendente; regen reconcilia entregas e abandono. Sem crescimento de frames.
6. Faixa nova gera aviso uma vez por personagem; primeira abertura já tem ação útil. Faixas são sugestões, não promessa de acesso.
7. Entrada/saída registra expedição automaticamente. XP é medida por segmento observado; reload, entrega, morte, lacuna de leitura e variação de build invalidam calibração. Só estimar após duas amostras comparáveis; nunca afirmar número de clears ou XP futura exata.

## Evidência e limites

Referência principal de assinaturas: UI Blizzard Forever, commit bebcb6bf309cf41b41bd74f8ca651e6a105b2676 (2026-11-13), documentação QuestLog/Map/Instance/SuperTrackManager. Snapshot anterior 69893 confirma presença; executável local 70938 não prova runtime. Capacidades documentadas são SUPPORTED_WITH_LIMITATIONS na referência, UNVERIFIED nesta build até jogo real.

Navegação usa exclusivamente GetNextWaypoint/GetNextWaypointForMap do cliente: posições ausentes não são inventadas. Uma seta nativa não é cálculo de caminho entre paredes. Coleta de quests não aceitas usa NPC/área da curadoria, sem alegar disponibilidade ou pin conhecido. Quatro dungeons sem dados não são anunciadas como guias completos; estado de cobertura deve ser visível. Instância desconhecida não pode ser inferida só por quests na mochila. Compatibilidade localizada depende de ID observado/alias seguro; não gravar vínculo especulativo.

## Gate humano

Revisar preparação, execução, entrega, reload e perda de API como jogador. A ação deve mudar sozinha em cada cenário. Mock comprova decisões e regressões; teste no WoW continua condição de aprovação final e será declarado NÃO EXECUTADO se não houver sessão real.
