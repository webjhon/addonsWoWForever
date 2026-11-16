# AllianceDungeonTrail 2.0 — pesquisa e decisões

Reconstrução original em 16/11/2026. Escopo Alliance 1–60. O contrato anterior de confirmação manual foi substituído; a pesquisa v1 está em archive/ e não descreve o produto atual.

## Fontes e capacidade

- Configuração: interface 16001, build em runtime ainda não confirmada. Executável local lido como 1.60.1.70938; não há processo WoW ativo durante a inspeção.
- Documentação da UI Blizzard **branch Forever**, commit `bebcb6bf309cf41b41bd74f8ca651e6a105b2676`, de 13/11/2026: QuestLogDocumentation, MapDocumentation, InstanceDocumentation, SuperTrackManagerDocumentation e GossipInfoDocumentation. Consultadas assinaturas, retornos, eventos e restrições. Referências por símbolo em API-CAPABILITIES.json. Apenas resumo factual original redistribuído, sem implementação Blizzard copiada.
- Snapshot público MIT Thunderz96/forever-addon-kit `8dc297689059dd204bf8663a05aaa36d6a628b76`, 1.60.1.69893/interface16001: presença de símbolos. Não é prova de assinatura atual ou execução.
- **Map DB2 build 1.60.1.70938**, enUS e ptBR, consultas públicas em wago.tools: 27 identificadores de instância e nomes localizados extraídos e cruzados por ID. Dados selecionados, URLs e hashes SHA256 em `knowledge/alliance/forever-dungeon-maps.json`. Nenhuma tabela completa, descrição ou arte redistribuída. IDs Map/instance não são UIMapIDs: jamais utilizados como coordenadas de waypoint.
- Quests: IDs e requisitos vêm da curadoria factual Wowhead Forever existente (`knowledge/alliance/quest/wowhead-forever.json`), relações parciais do mesmo pacote; nomes/NPCs/referências autorais anteriores foram preservados onde úteis. Cada registro tem sua URL individual. Dados comunitários continuam COMMUNITY_UNVERIFIED para disponibilidade/fase atual. Nenhum título traduzido é necessário para ligar o diário: a ligação é pelo ID.
- Referência adicional da quest 2040: https://www.wowhead.com/forever/quest=2040/underground-assault . Relação factual com Sneed's Shredder/sala dos goblins; comentários históricos não são promovidos a confirmação Forever. Não importar coordenadas ou texto dos comentários. GetQuestObjectives é a autoridade para crédito.
- Faixas das dungeons novas: anúncio Blizzard https://news.blizzard.com/en-us/article/24301455/explore-the-new-dungeons-of-world-of-warcraft-forever ; faixas de catálogo são sugestões e não mínimos de quest/entrada. Divergência histórica Excavation 24–29 / referência 26–31 permanece explicitada no catálogo.
- Nenhum arquivo de Zygor/RestedXP foi aberto, copiado ou redistribuído nesta reconstrução.

## Decisões funcionais

1. **Reconciliação, não contador de cliques.** Eventos agrupados por 150 ms produzem snapshot normalizado. Diário, instância, nível, XP, personagem e oferta atual do NPC alimentam uma decisão. Objetivos, aceite, entrega e entrada não têm controles manuais.
2. **Quest em andamento prevalece sobre histórico.** Isso permite repetíveis. Ausência é MISSING, nunca TURNED_IN. Somente evento de entrega ou flag real confirma entrega. Falta de API/retorno não gera conclusão.
3. **Prioridade de jogo.** Instância real prevalece sobre plano anterior. Dentro dela, outras tarefas internas pendentes precedem saída para entregar. Objetivos externos ao portal são separados. Oferta real do NPC é indicada no diálogo; preparação fora dele é apenas potencial, sem afirmar elegibilidade completa. Morte/escopo/dados indisponíveis são estados próprios.
4. **Navegação nativa original na integração.** GetNextWaypoint retorna mapID,x,y; GetNextWaypointForMap retorna x,y no mapa consultado. Validar valores não secretos e faixa 0–1. Não calcular caminho ou distância por paredes. SetSuperTrackedQuestID é informativo e condicionado à disponibilidade de waypoint; preservar rastreamento externo salvo solicitação explícita em SEGUIR QUEST. Remover apenas rastreamento próprio ao deixar de ser útil. Não criar pins fixos nem guardar coordenadas.
5. **Recuperação.** Estado por GUID. Migração v1 descarta checks/vínculos manuais como fonte de progresso. Login/reload reconcilia o diário; amostra de XP interrompida é excluída e retomada dentro da instância não se torna uma entrada válida. Posição/visibilidade/preferência de navegação persistem.
6. **Combate.** Exibir a última orientação com atualização pendente, sem abrir splash em combate; adiar leituras/rastreamento até regen. Evento de entrega ainda conserva seu ID público e invalida calibração. Sem OnUpdate, loops por frame ou ações protegidas.
7. **Estimativa honesta.** Entrada e saída detectam segmentos de expedição, não clears. Usar duas amostras positivas >=5 min, sem quests ativas/aceites/entregas/morte/reload/lacunas, mesma build, últimas24h e níveis próximos. Intervalo empírico de níveis fracionários até próxima faixa; não promete XP futura. No máximo20 amostras por personagem. Trocar de instância ou sair fecha segmento, XP externa não é atribuída ao segmento anterior.
8. **Identidade.** Tonho Contrabando em TOC e splash compartilhado obrigatório. Ícone específico portal/escadaria redesenhado pelo gerador original em grade32px, upscale nearest-neighbor. Tracker compacto opcional, posição arrastável, próximo objetivo em destaque.

## Limites reais e condições de aprovação

- Nenhum teste dentro do WoW foi executado. Presença de cliente instalado/dados DB2 não é CLIENT_VERIFIED. Assinaturas documentadas são SUPPORTED_WITH_LIMITATIONS na referência e UNVERIFIED em runtime70938.
- 27 instâncias identificadas; quests selecionadas em23. Shadowfang Keep, Alcaz Prison, Blackmaw Hold e Shaper's Terrace não têm guia curado e exibem bloqueio por dados, sem checklist substituto. Cobertura não é exaustiva.
- Catálogo não é um solucionador completo de todos os pré-requisitos, raças e fases. Classes explicitamente conhecidas são filtradas; oferta real do NPC prevalece. Quest desconhecida ainda não recebe guia pesquisado.
- Ausência de waypoint impede seta/localização precisa; objetivo ao vivo e referência de boss/área continuam disponíveis. Coleta de quest ainda não aceita não tem coordenada inventada. Quando o destino de entrega não tem referência distinta curada, somente o destino do cliente é autoritativo; a UI identifica o NPC de coleta como tal.
- Algumas instâncias compartilham mapa/alas. LBRS usa Map229 e guia apenas objetivos inferiores; mapa não comprova qual ala o grupo pretende percorrer. Nenhum attunement/raid é incluído.
- Dungeons novas podem estar indisponíveis apesar de existirem na tabela Map. Dados de tabela não são acesso garantido.
- Renderização, escala, texturas, eventos reais, taint e disponibilidade dos waypoints precisam de sessão de jogo antes de aprovação final. Candidato técnico não implica aprovação do produto.
